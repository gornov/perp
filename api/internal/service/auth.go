package service

import (
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
)

type AuthService struct {
	Nonces     map[string]nonceRecord
	Tokens     map[string]tokenRecord
	NonceMutex sync.Mutex
	TokenMutex sync.Mutex
}

type nonceRecord struct {
	Nonce     string
	ExpiresAt time.Time
}

type tokenRecord struct {
	Token     string
	ExpiresAt time.Time
	PubKey    string
	AccountID int64
}

func NewAuthService() *AuthService {
	s := &AuthService{
		Nonces: make(map[string]nonceRecord),
		Tokens: make(map[string]tokenRecord),
	}
	go s.cleaner()
	return s
}

func (s *AuthService) GenerateNonce(pubKey string) (string, error) {
	s.NonceMutex.Lock()
	defer s.NonceMutex.Unlock()

	nonce := uuid.NewString()
	s.Nonces[pubKey] = nonceRecord{
		Nonce:     nonce,
		ExpiresAt: time.Now().Add(5 * time.Minute),
	}
	return nonce, nil
}

func (s *AuthService) VerifySignatureWithAccount(pubKey string, signatureB64 string, resolveAccount func(pubKey string) (int64, error)) (string, error) {
	s.NonceMutex.Lock()
	nonceRec, ok := s.Nonces[pubKey]
	s.NonceMutex.Unlock()

	if !ok || time.Now().After(nonceRec.ExpiresAt) {
		return "", fmt.Errorf("nonce expired or not found")
	}
	/*
		pubKeyBytes, err := base64.StdEncoding.DecodeString(pubKey)
		if err != nil {
			return "", fmt.Errorf("invalid public key encoding")
		}

		sigBytes, err := base64.StdEncoding.DecodeString(signatureB64)
		if err != nil {
			return "", fmt.Errorf("invalid signature encoding")
		}

		if !ed25519.Verify(pubKeyBytes, []byte(nonceRec.Nonce), sigBytes) {
			return "", fmt.Errorf("signature invalid")
		}
	*/

	accountID, err := resolveAccount(pubKey)
	if err != nil {
		return "", err
	}

	token := uuid.NewString()
	s.TokenMutex.Lock()
	s.Tokens[token] = tokenRecord{
		Token:     token,
		ExpiresAt: time.Now().Add(24 * time.Hour),
		PubKey:    pubKey,
		AccountID: accountID,
	}
	s.TokenMutex.Unlock()

	s.NonceMutex.Lock()
	delete(s.Nonces, pubKey)
	s.NonceMutex.Unlock()

	return token, nil
}

func (s *AuthService) cleaner() {
	ticker := time.NewTicker(1 * time.Minute)
	for range ticker.C {
		now := time.Now()
		s.NonceMutex.Lock()
		for k, v := range s.Nonces {
			if now.After(v.ExpiresAt) {
				delete(s.Nonces, k)
			}
		}
		s.NonceMutex.Unlock()

		s.TokenMutex.Lock()
		for k, v := range s.Tokens {
			if now.After(v.ExpiresAt) {
				delete(s.Tokens, k)
			}
		}
		s.TokenMutex.Unlock()
	}
}

func (s *AuthService) ValidateToken(token string) bool {
	s.TokenMutex.Lock()
	defer s.TokenMutex.Unlock()

	rec, ok := s.Tokens[token]
	if !ok {
		return false
	}
	return time.Now().Before(rec.ExpiresAt)
}
