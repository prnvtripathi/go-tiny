package shortener

import (
	"time"
)

type URL struct {
	OriginalURL string    `json:"original_url"`
	Name        string    `json:"name"`
	ShortCode   string    `json:"short_code"`
	ExpiresAt   time.Time `json:"expires_at"`
	UrlId       int       `json:"url_id"`
	ClickCount  int       `json:"click_count"`
}

type QR struct {
	OriginalURL string    `json:"original_url"`
	Name        string    `json:"name"`
	ShortCode   string    `json:"short_code"`
	ExpiresAt   time.Time `json:"expires_at"`
	UrlId       int       `json:"url_id"`
	ClickCount  int       `json:"click_count"`
	Base64      string    `json:"base64"`
}
