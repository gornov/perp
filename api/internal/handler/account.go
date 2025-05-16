package handler

import (
	"gornov.me/engine/internal/usecase"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
)

type AccountHandler struct {
	accountUsecase usecase.AccountUsecase
}

func NewAccountHandler(au usecase.AccountUsecase) *AccountHandler {
	return &AccountHandler{accountUsecase: au}
}

type createAccountRequest struct {
	ExtID string `json:"ext_id" binding:"required"`
}

func (h *AccountHandler) CreateAccount(c *gin.Context) {
	var req createAccountRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	account, err := h.accountUsecase.CreateAccount(req.ExtID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, account)
}

type updateBalanceRequest struct {
	Balance decimal.Decimal `json:"balance" binding:"required"`
}

func (h *AccountHandler) UpdateBalance(c *gin.Context) {
	extID, exists := c.Get("public_key")
	if !exists {
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}
	var req updateBalanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.accountUsecase.UpdateBalance(extID.(string), req.Balance); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (h *AccountHandler) GetBalance(c *gin.Context) {
	extID, exists := c.Get("public_key")
	if !exists {
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}
	if extID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing ext_id"})
		return
	}

	balance, err := h.accountUsecase.GetBalance(extID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"ext_id":  extID,
		"balance": balance.String(),
	})
}

type adjustBalanceRequest struct {
	Delta decimal.Decimal `json:"delta" binding:"required"`
}

func (h *AccountHandler) AdjustBalance(c *gin.Context) {
	extID, exists := c.Get("public_key")
	if !exists {
		c.JSON(401, gin.H{"error": "unauthorized"})
		return
	}
	var req adjustBalanceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.accountUsecase.AdjustBalance(extID.(string), req.Delta); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "balance adjusted"})
}
