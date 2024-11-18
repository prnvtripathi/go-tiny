// redirect/redirect.go
package redirect

import (
	"log"
	"net/http"
	"net"
	"strings"

	"github.com/prnvtripathi/go-url-api/shortener"
)

// RedirectHandler handles the redirection based on the short code in the URL.
func RedirectHandler(w http.ResponseWriter, r *http.Request) {
	// Extract the code from the URL path, expected as "/r/{code}"
	code := strings.TrimSpace(r.URL.Path[len("/r/"):])

	if code == "" {
		http.Error(w, "Code not provided", http.StatusBadRequest)
		return
	}

	// Retrieve the original URL associated with the code from the database
	originalURL, err := shortener.GetOriginalURL(code)
	if err != nil {
		http.Error(w, "URL not found or has expired", http.StatusNotFound)
		return
	}

	// Ensure the URL is fully qualified
	if !strings.HasPrefix(originalURL, "http://") && !strings.HasPrefix(originalURL, "https://") {
		originalURL = "http://" + originalURL
	}

	// Asynchronously log analytics
	go logAnalytics(r, code)
	go shortener.IncrementClickCount(code)

	// Redirect to the original URL
	http.Redirect(w, r, originalURL, http.StatusFound)
}

// GetClientIP extracts the client's IP address from the request.
func GetClientIP(r *http.Request) string {
	// Check X-Forwarded-For header
	forwarded := r.Header.Get("X-Forwarded-For")
	if forwarded != "" {
		// Use the first IP in the list
		ips := strings.Split(forwarded, ",")
		return strings.TrimSpace(ips[0])
	}

	// Check X-Real-IP header
	realIP := r.Header.Get("X-Real-IP")
	if realIP != "" {
		return realIP
	}

	// Fallback to RemoteAddr
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr // Return as is if splitting fails
	}
	return ip
}

// logAnalytics records traffic details in the database.
func logAnalytics(r *http.Request, code string) {
	// Extract analytics data
	referrer := r.Referer()
	userAgent := r.UserAgent()
	ipAddress := GetClientIP(r)

	log.Printf("Logging analytics for code %s: referrer=%s, userAgent=%s, ipAddress=%s\n", code, referrer, userAgent, ipAddress)

	// Log analytics to the database
	err := shortener.LogAnalytics(code, referrer, userAgent, ipAddress)
	if err != nil {
		// Log the error (optional)
	}
}
