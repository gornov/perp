package usecase

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type Quote struct {
	Symbol string `json:"symbol"`
	Price  string `json:"price"`
}

type QuoteUsecase interface {
	GetCurrentQuote(symbol string) (*Quote, error)
}

type quoteUsecaseImpl struct {
	quoteAPI string
}

func NewQuoteUsecase(quoteAPI string) QuoteUsecase {
	return &quoteUsecaseImpl{quoteAPI: quoteAPI}
}

func (u *quoteUsecaseImpl) GetCurrentQuote(symbol string) (*Quote, error) {
	url := fmt.Sprintf("%s/api/v3/ticker/price?symbol=%s", u.quoteAPI, symbol)

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
