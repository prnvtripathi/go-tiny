package shortener

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/binary"
	"math/big"
	"sync/atomic"
	"time"
)

const base62Chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

// counter is an atomic counter to ensure uniqueness
var counter uint64

// GenerateShortCode creates a unique base-62 short code for a given URL.
func GenerateShortCode(url string, length int) string {
	// Get current timestamp with nanosecond precision
	timestamp := time.Now().UnixNano()

	// Increment atomic counter
	count := atomic.AddUint64(&counter, 1)

	// Generate random bytes
	randomBytes := make([]byte, 8)
	_, err := rand.Read(randomBytes)
	if err != nil {
		// Fallback to timestamp if random generation fails
		binary.BigEndian.PutUint64(randomBytes, uint64(timestamp))
	}

	// Convert random bytes to uint64
	randomNum := binary.BigEndian.Uint64(randomBytes)

	// Combine all components into a unique string
	uniqueInput := []byte(url)
	uniqueInput = append(uniqueInput, byte(timestamp))
	uniqueInput = append(uniqueInput, byte(count))
	uniqueInput = append(uniqueInput, randomBytes...)

	// Generate hash of the combined components
	hash := sha256.Sum256(uniqueInput)

	// Take the first 8 bytes and combine with random number
	hashPrefix := binary.BigEndian.Uint64(hash[:8])
	finalNumber := hashPrefix ^ randomNum

	return base62Encode(finalNumber, length)
}

// base62Encode converts an integer to a base-62 encoded string of fixed length.
func base62Encode(number uint64, length int) string {
	encoded := make([]byte, length)
	base := uint64(len(base62Chars))

	// Generate a random starting point for more uniqueness
	start, _ := rand.Int(rand.Reader, big.NewInt(int64(base)))
	startNum := uint64(start.Int64())

	// Combine the input number with the random starting point
	number = number ^ startNum

	// Fill the encoded string backwards to ensure a fixed length
	for i := length - 1; i >= 0; i-- {
		encoded[i] = base62Chars[number%base]
		number = number / base
	}
	return string(encoded)
}
