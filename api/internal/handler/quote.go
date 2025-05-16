package handler

import (
	"gornov.me/engine/internal/usecase"
	"net/http"

	"github.com/gin-gonic/gin"
)

type QuoteHandler struct {
	quoteUsecase usecase.QuoteUsecase
}

func NewQuoteHandler(qu usecase.QuoteUsecase) *QuoteHandler {
	return &QuoteHandler{quoteUsecase: qu}
}

func (h *QuoteHandler) GetQuote(c *gin.Context) {
	symbol := c.Query("symbol")
	if symbol == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing symbol parameter"})
		return
	}

	quote, err := h.quoteUsecase.GetCurrentQuote(symbol)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, quote)
}
