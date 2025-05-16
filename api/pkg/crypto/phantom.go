package crypto

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"github.com/mr-tron/base58"
)

func VerifyPhantomSignature(publicKey, message, signature string) (bool, error) {
	pubKeyBytes, err := base58Decode(publicKey)
	if err != nil {
		return false, err
	}

	sigBytes, err := base64.StdEncoding.DecodeString(signature)
	if err != nil {
		return false, err
	}

	if len(pubKeyBytes) != ed25519.PublicKeySize {
		return false, errors.New("invalid public key size")
	}

	return ed25519.Verify(ed25519.PublicKey(pubKeyBytes), []byte(message), sigBytes), nil
}

func GenerateNonce() (string, error) {
	nonce := make([]byte, 32)
	_, err := rand.Read(nonce)
	if err != nil {
		return "", err
	}

	return hex.EncodeToString(nonce), nil
}

func base58Decode(encoded string) ([]byte, error) {
	return base58.Decode(encoded)
}
