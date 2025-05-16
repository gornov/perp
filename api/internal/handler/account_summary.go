package handler

import (
	"gornov.me/engine/internal/usecase"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AccountSummaryHandler struct {
	summaryUsecase usecase.AccountSummaryUsecase
}

func NewAccountSummaryHandler(asu usecase.AccountSummaryUsecase) *AccountSummaryHandler {
	return &AccountSummaryHandler{summaryUsecase: asu}
}

func (h *AccountSummaryHandler) GetSummary(c *gin.Context) {
	extID, exists := c.Get("public_key")
	if !exists {
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}
	if extID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing ext_id"})
		return
	}

	summary, err := h.summaryUsecase.GetSummary(extID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, summary)
}
