package handler

import (
	"fmt"
	"gornov.me/engine/internal/repository"
	"gornov.me/engine/internal/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *service.AuthService
	accountRepo repository.AccountRepository
}

func NewAuthHandler(as *service.AuthService, ar repository.AccountRepository) *AuthHandler {
	return &AuthHandler{
		authService: as,
		accountRepo: ar,
	}
}

type nonceRequest struct {
	PublicKey string `json:"public_key" binding:"required"`
}

func (h *AuthHandler) GenerateNonce(c *gin.Context) {
	var req nonceRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	nonce, err := h.authService.GenerateNonce(req.PublicKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"nonce": nonce})
}

type verifyRequest struct {
	PublicKey string `json:"public_key" binding:"required"`
	Signature string `json:"signature" binding:"required"`
}

func (h *AuthHandler) VerifySignature(c *gin.Context) {
	var req verifyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := h.authService.VerifySignatureWithAccount(req.PublicKey, req.Signature, func(pubKey string) (int64, error) {
		account, err := h.accountRepo.FindOrCreateAccountByPubKey(pubKey)
		if err != nil {
			return 0, fmt.Errorf("failed to resolve account: %v", err)
		}
		return account.ID, nil
	})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
