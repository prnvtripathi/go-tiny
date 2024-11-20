package shortener

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"time"

	"github.com/ipinfo/go/v2/ipinfo"
	"github.com/ua-parser/uap-go/uaparser"
)

// SaveURL stores the original URL, short code, and expiration time in the database.
func SaveURL(originalURL, name string, shortCode string, customCode bool, expiresAt *time.Time, customExpiry bool, created_by int) (int, error) {
	var url_id int
	query := `
        INSERT INTO urls (original_url, name, short_code, is_custom_code, expires_at, is_custom_expiry, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING url_id
    `

	err := DB.QueryRow(context.Background(), query, originalURL, name, shortCode, customCode, expiresAt, customExpiry, created_by).Scan(&url_id)
	if err != nil {
		return 0, fmt.Errorf("failed to save URL: %v", err)
	}
	return url_id, nil
}

// GetOriginalURL retrieves the original URL by its short code.
func GetOriginalURL(shortCode string) (string, error) {
	var originalURL string
	var expiresAt *time.Time

	query := `
        SELECT original_url, expires_at 
        FROM urls 
        WHERE short_code = $1
    `

	err := DB.QueryRow(context.Background(), query, shortCode).Scan(&originalURL, &expiresAt)
	if err != nil {
		return "", fmt.Errorf("URL not found: %v", err)
	}

	// Check if the URL has expired
	if expiresAt != nil && expiresAt.Before(time.Now()) {
		return "", fmt.Errorf("URL has expired")
	}

	return originalURL, nil
}

// CheckCodeExists checks if a custom code already exists in the database.
func CheckCodeExists(code string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM urls WHERE short_code = $1)`

	err := DB.QueryRow(context.Background(), query, code).Scan(&exists)
	return exists, err
}

// GetAllUrls retrieves all URLs created by a user from the database.
func GetAllUrls(userId int) ([]URL, error) {
	query := `
		SELECT original_url, name, short_code, expires_at, url_id, click_count
		FROM urls
		WHERE created_by = $1 AND is_deleted = false
	`

	rows, err := DB.Query(context.Background(), query, userId)
	if err != nil {
		log.Printf("Failed to get URLs: %v", err)
		return nil, err
	}
	defer rows.Close()

	var urls []URL
	for rows.Next() {
		var url URL
		err := rows.Scan(&url.OriginalURL, &url.Name, &url.ShortCode, &url.ExpiresAt, &url.UrlId, &url.ClickCount)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			return nil, err
		}
		urls = append(urls, url)
	}

	// Check for any row iteration errors
	if err := rows.Err(); err != nil {
		log.Printf("Row iteration error: %v", err)
		return nil, err
	}

	return urls, nil
}

func GetQRs(userId int) ([]QR, error) {
	query := `
		SELECT original_url, name, short_code, expires_at, url_id, click_count, qr_code
		FROM urls
		WHERE created_by = $1 AND is_deleted = false AND qr_code IS NOT NULL
	`

	rows, err := DB.Query(context.Background(), query, userId)
	if err != nil {
		log.Printf("Failed to get URLs: %v", err)
		return nil, err
	}
	defer rows.Close()

	var qrs []QR
	for rows.Next() {
		var qr QR
		err := rows.Scan(&qr.OriginalURL, &qr.Name, &qr.ShortCode, &qr.ExpiresAt, &qr.UrlId, &qr.ClickCount, &qr.Base64)
		if err != nil {
			log.Printf("Error scanning row: %v", err)
			return nil, err
		}
		qrs = append(qrs, qr)
	}

	// Check for any row iteration errors
	if err := rows.Err(); err != nil {
		log.Printf("Row iteration error: %v", err)
		return nil, err
	}

	return qrs, nil
}

// DeleteUrl marks a URL as deleted in the database for a specific user
func DeleteUrl(urlId int, userId int) error {
	query := `
		UPDATE urls
		SET is_deleted = true
		WHERE url_id = $1 AND created_by = $2
	`

	// Use ExecContext with the provided context for better control
	rows, err := DB.Query(context.Background(), query, urlId, userId)
	if err != nil {
		log.Printf("Failed to delete url: %v", err)
		return err
	}
	defer rows.Close()

	return nil
}

// GeoLocation represents the geo-location data of an IP address.
type GeoLocation struct {
	Country string `json:"country"`
	Region  string `json:"region"`
	City    string `json:"city"`
}

// LogAnalytics logs analytics data, including geo-location, even if some fields are missing initially.
func LogAnalytics(code, referrer, userAgent, ipAddress string) error {
	urlID, err := getURLIDFromCode(code)
	if err != nil {
		log.Printf("Error getting URL ID for code %s: %v", code, err)
		return err
	}

	// Parse user agent
	browser, os := ParseUserAgent(userAgent)

	// Fetch geo-location data
	location, err := getGeoLocation(ipAddress)
	if err != nil {
		log.Printf("Error fetching geo-location for IP %s: %v", ipAddress, err)
		location = &GeoLocation{}
	}

	// Insert initial data into database (without geolocation)
	query := `
		INSERT INTO url_analytics (url_id, referrer, user_agent, browser, os, ip_address, country, region, city)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`
	_, err = DB.Query(context.Background(), query, urlID, referrer, userAgent, browser, os, ipAddress, location.Country, location.Region, location.City)

	if err != nil {
		log.Printf("Error inserting analytics data: %v", err)

		// Retry inserting data without geolocation
		query = `
			INSERT INTO url_analytics (url_id, referrer, user_agent, browser, os, ip_address)
			VALUES ($1, $2, $3, $4, $5, $6)
		`
		_, err = DB.Query(context.Background(), query, urlID, referrer, userAgent, browser, os, ipAddress)
		if err != nil {
			log.Printf("Error inserting analytics data (without geolocation): %v", err)
		}
	}

	return nil
}

// getGeoLocation fetches geo-location data using an API.
func getGeoLocation(ipAddress string) (*GeoLocation, error) {
	token := os.Getenv("IPINFO_TOKEN")

	client := ipinfo.NewClient(nil, nil, token)

	info, err := client.GetIPInfo(net.ParseIP(ipAddress))

	if err != nil {
		log.Fatal(err)
	}

	location := &GeoLocation{
		Country: info.Country,
		Region:  info.Region,
		City:    info.City,
	}

	return location, nil

}

// ParseUserAgent extracts browser and OS details from the User-Agent string.
func ParseUserAgent(userAgent string) (string, string) {
	parser, err := uaparser.New("./regexes.yaml")
	if err != nil {
		log.Fatal(err)
	}

	client := parser.Parse(userAgent)

	browser := client.UserAgent.Family
	os := client.Os.Family

	return browser, os
}

// getURLIDFromCode retrieves the URL ID using the short code.
func getURLIDFromCode(code string) (int, error) {
	var urlID int
	query := `SELECT url_id FROM urls WHERE short_code = $1`
	err := DB.QueryRow(context.Background(), query, code).Scan(&urlID)
	if err != nil {
		return 0, err
	}
	return urlID, nil
}

// IncrementClickCount increments the click count for a URL.
func IncrementClickCount(code string) error {
	query := `UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1`
	_, err := DB.Exec(context.Background(), query, code)
	if err != nil {
		return err
	}
	return nil
}

func SaveQRCodeInDB(urlID int, shortCode, base64QR string) error {
	query := `
		UPDATE urls
		SET qr_code = $1
		WHERE url_id = $2 AND short_code = $3
	`
	_, err := DB.Exec(context.Background(), query, base64QR, urlID, shortCode)
	return err
}
