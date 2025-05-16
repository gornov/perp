package service

import (
	"fmt"
	"github.com/shopspring/decimal"
	"gornov.me/engine/internal/repository"
	"sync"
	"time"
)

type PositionData struct {
	ID         int64
	OpenRate   decimal.Decimal
	Symbol     string
	Side       string
	Margin     decimal.Decimal
	Quantity   decimal.Decimal
	Leverage   int64
	Instrument string
	AccountID  int64
}

type DealerService struct {
	qs    *QuotesService
	p     repository.PositionRepository
	Queue []PositionData
	mu    sync.Mutex
}

func NewDealerService(qs *QuotesService, p repository.PositionRepository) (*DealerService, error) {

	pos, err := p.GetAllOpenPositionsWithSymbol()
	if err != nil {
		return nil, fmt.Errorf("could not get all open positions: %w", err)
	}

	ds := &DealerService{
		qs: qs,
		p:  p,
	}

	for _, pos := range pos {
		var data PositionData
		data.ID = pos.ID
		data.Symbol = pos.InstrumentSymbol
		data.Margin = pos.Margin
		data.Leverage = pos.Leverage
		data.Side = pos.Side
		data.OpenRate = pos.OpenRate
		data.Quantity = pos.Quantity
		ds.AddToQueue(data)
	}

	return ds, nil
}

func (ds *DealerService) AddToQueue(pd PositionData) {
	ds.mu.Lock()
	defer ds.mu.Unlock()
	ds.Queue = append(ds.Queue, pd)
}

func (ds *DealerService) DeleteFromQueue(positionID int64) {
	ds.mu.Lock()
	defer ds.mu.Unlock()

	var newQueue []PositionData
	for _, q := range ds.Queue {
		if q.ID == positionID {
			continue
		}
		newQueue = append(newQueue, q)
	}

	ds.Queue = newQueue
}

func (ds *DealerService) Start() {
	go ds.loop()
}

func (ds *DealerService) loop() {

	for {
		ds.mu.Lock()
		for _, pd := range ds.Queue {
			currentQuoteStr, _ := ds.qs.GetQuote(pd.Symbol)
			currentQuote, err := decimal.NewFromString(currentQuoteStr)
			if err != nil {
				fmt.Println(err)
			}
			leverage := decimal.NewFromInt(pd.Leverage)
			positionSize := pd.Margin.Mul(leverage)
			if positionSize.Cmp(decimal.Zero) == 0 {
				fmt.Printf("division by zero: %d", pd.ID)
				continue
			}

			//MMR := decimal.NewFromFloat(0.2) // 20%
			//maintenanceMargin := positionSize.Mul(MMR)

			plToReachSO := decimal.NewFromFloat(0.8).Neg().Mul(pd.Margin)

			//LiquidationPrice := positionSize.Mul(pd.OpenRate).Sub(positionSize.Add(pd.Margin.Sub(maintenanceMargin)))

			var PL, SO decimal.Decimal
			if pd.Side == "buy" {
				PL = currentQuote.Sub(pd.OpenRate).Mul(pd.Quantity)
				SO = plToReachSO.Add(positionSize).Mul(pd.OpenRate).Div(positionSize)
			} else {
				PL = pd.OpenRate.Sub(currentQuote).Mul(pd.Quantity)
				SO = plToReachSO.Sub(positionSize).Mul(pd.OpenRate).Neg().Div(positionSize)
			}

			err = ds.p.UpdatePositionPL(pd.ID, PL)
			if err != nil {
				fmt.Println(err)
			}
			fmt.Printf("id=%d PL=%s SO=%s Open=%s Current=%s\n", pd.ID, PL.String(), SO.String(), pd.OpenRate.String(), currentQuote)
		}
		ds.mu.Unlock()

		time.Sleep(500 * time.Millisecond)
	}
}
