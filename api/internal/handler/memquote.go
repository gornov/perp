package handler

import (
	"gornov.me/engine/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MemQuoteHandler struct {
	quotesService *service.QuotesService
}

func NewMemQuoteHandler(qs *service.QuotesService) *MemQuoteHandler {
	return &MemQuoteHandler{quotesService: qs}
}

func (h *MemQuoteHandler) GetQuote(c *gin.Context) {
	symbol := c.Query("symbol")
	if symbol == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing symbol parameter"})
		return
	}

	price, err := h.quotesService.GetQuote(symbol)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"symbol": symbol,
		"price":  price,
	})
}
