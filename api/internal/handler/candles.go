package handler

import (
	"gornov.me/engine/internal/usecase"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CandleHandler struct {
	candleUsecase usecase.CandleUsecase
}

func NewCandleHandler(cu usecase.CandleUsecase) *CandleHandler {
	return &CandleHandler{candleUsecase: cu}
}

func (h *CandleHandler) GetCandles(c *gin.Context) {
	symbol := c.Query("symbol")
	interval := c.Query("interval")
	startTime := c.Query("startTime")
	endTime := c.Query("endTime")

	if symbol == "" || interval == "" || startTime == "" || endTime == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required parameters"})
		return
	}

	candles, err := h.candleUsecase.FetchCandles(symbol, interval, startTime, endTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, candles)
}
