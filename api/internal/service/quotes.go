package service

import (
	"encoding/json"
	"fmt"
	"gornov.me/engine/internal/repository"
	"io/ioutil"
	"net/http"
	"sync"
	"time"
)

type Quote struct {
	Symbol string `json:"symbol"`
	Price  string `json:"price"`
}

type QuotesService struct {
	binanceAPI     string
	instrumentRepo repository.InstrumentRepository

	mu     sync.RWMutex
	quotes map[string]string // symbol -> price
}

func NewQuotesService(binanceAPI string, ir repository.InstrumentRepository) *QuotesService {
	return &QuotesService{
		binanceAPI:     binanceAPI,
		instrumentRepo: ir,
		quotes:         make(map[string]string),
	}
}

func (s *QuotesService) Start() {
	go s.loop()
}

func (s *QuotesService) loop() {
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for {
		s.updateQuotes()
		<-ticker.C
	}
}

func (s *QuotesService) updateQuotes() {
	instruments, err := s.instrumentRepo.GetActiveInstruments()
	if err != nil {
		fmt.Printf("failed to load instruments: %v\n", err)
		return
	}

	for _, inst := range instruments {
		quote, err := s.fetchQuote(inst.Symbol)
		if err != nil {
			fmt.Printf("failed to fetch quote for %s: %v\n", inst.Symbol, err)
			continue
		}
		s.mu.Lock()
		s.quotes[inst.Symbol] = quote.Price
		s.mu.Unlock()
	}
}

func (s *QuotesService) fetchQuote(symbol string) (*Quote, error) {
	url := fmt.Sprintf("%s/api/v3/ticker/price?symbol=%s", s.binanceAPI, symbol)
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("HTTP request failed: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := ioutil.ReadAll(resp.Body)
		return nil, fmt.Errorf("Binance API error: %s", string(body))
	}

	body, _ := ioutil.ReadAll(resp.Body)
	var quote Quote
	err = json.Unmarshal(body, &quote)
	if err != nil {
		return nil, fmt.Errorf("failed to parse response: %v", err)
	}

	return &quote, nil
}

func (s *QuotesService) GetQuote(symbol string) (string, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	price, ok := s.quotes[symbol]
	if !ok {
		return "", fmt.Errorf("no quote found for %s", symbol)
	}
	return price, nil
}
