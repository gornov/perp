package usecase

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type Candle struct {
	OpenTime  int64  `json:"openTime"`
	Open      string `json:"open"`
	High      string `json:"high"`
	Low       string `json:"low"`
	Close     string `json:"close"`
	Volume    string `json:"volume"`
	CloseTime int64  `json:"closeTime"`
}

type CandleUsecase interface {
	FetchCandles(symbol, interval, startTime, endTime string) ([]Candle, error)
}

type candleUsecaseImpl struct {
	binanceAPI string
}

func NewCandleUsecase(binanceAPI string) CandleUsecase {
	return &candleUsecaseImpl{binanceAPI: binanceAPI}
}

func (u *candleUsecaseImpl) FetchCandles(symbol, interval, startTime, endTime string) ([]Candle, error) {
	url := fmt.Sprintf("%s/api/v3/klines?symbol=%s&interval=%s&startTime=%s&endTime=%s&limit=1000",
		u.binanceAPI, symbol, interval, startTime, endTime)

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("HTTP request failed: %v", err)
	}
	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	var rawKlines [][]interface{}
	err = json.Unmarshal(body, &rawKlines)
	if err != nil {
		return nil, fmt.Errorf("failed to parse response: %v", err)
	}

	candles := make([]Candle, 0, len(rawKlines))
	for _, k := range rawKlines {
		candles = append(candles, Candle{
			OpenTime:  int64(k[0].(float64)),
			Open:      k[1].(string),
			High:      k[2].(string),
			Low:       k[3].(string),
			Close:     k[4].(string),
			Volume:    k[5].(string),
			CloseTime: int64(k[6].(float64)),
		})
	}

	return candles, nil
}
