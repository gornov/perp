package handler

import (
	"gornov.me/engine/internal/usecase"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
)

type PositionHandler struct {
	positionUsecase usecase.PositionUsecase
}

func NewPositionHandler(pu usecase.PositionUsecase) *PositionHandler {
	return &PositionHandler{positionUsecase: pu}
}

type createPositionRequest struct {
	Symbol   string          `json:"symbol" binding:"required"`
	Margin   decimal.Decimal `json:"margin" binding:"required"`
	Leverage int64           `json:"leverage" binding:"required"`
	Side     string          `json:"side" binding:"required"` // "buy" или "sell"
}

func (h *PositionHandler) CreatePosition(c *gin.Context) {
	extID, exists := c.Get("public_key")
	if !exists {
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}
	var req createPositionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.positionUsecase.CreatePosition(req.Symbol, req.Margin, req.Leverage, req.Side, extID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "position created"})
}

func (h *PositionHandler) GetPositions(c *gin.Context) {
	extID, exists := c.Get("public_key")
	if !exists {
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}
	symbol := c.Query("symbol")
	side := c.Query("side")
	state := c.Query("state")

	var (
		symbolPtr *string
		extIDPtr  *string
		sidePtr   *string
		statePtr  *string
	)

	if symbol != "" {
		symbolPtr = &symbol
	}
	extIDStr := extID.(string)
	if extID != "" {
		extIDPtr = &extIDStr
	}
	if side != "" {
		sidePtr = &side
	}
	if state != "" {
		statePtr = &state
	}

	positions, err := h.positionUsecase.GetPositions(symbolPtr, extIDPtr, sidePtr, statePtr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, positions)
}

type closePositionRequest struct {
	PositionID int64 `json:"position_id" binding:"required"`
}

func (h *PositionHandler) ClosePosition(c *gin.Context) {

	var req closePositionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.positionUsecase.ClosePosition(req.PositionID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "position closed"})
}
