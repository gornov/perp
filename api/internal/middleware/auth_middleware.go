package middleware

import (
	"gornov.me/engine/internal/service"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authService *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing or invalid authorization header"})
			return
		}

		token := strings.TrimPrefix(authHeader, "Bearer ")
		authService.TokenMutex.Lock()
		rec, ok := authService.Tokens[token]
		authService.TokenMutex.Unlock()
		if !ok || time.Now().After(rec.ExpiresAt) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			return
		}

		c.Set("account_id", rec.AccountID)
		c.Set("public_key", rec.PubKey)
		c.Next()
	}
}
