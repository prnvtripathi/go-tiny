package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/prnvtripathi/go-url-api/redirect"
	"github.com/prnvtripathi/go-url-api/shortener"
)

func healthCheck(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Server is up and running")
}

// main is the entry point of the application. It sets up an HTTP server
// that listens on port 8080 and handles requests to the "/health" endpoint
// using the healthCheck handler function. If the server fails to start,
// it logs the error and exits.
func main() {
	// Load environment variables
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
	fmt.Println("Environment variables loaded")

	// Connect to Redis
	err = connectRedis()
	if err != nil {
		log.Fatalf("Redis connection failed: %v", err)
	}

	// Connect to the database
	err = shortener.ConnectDB()
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer shortener.CloseDB()

	// Use the RateLimiter middleware
	http.Handle("/health", RateLimiter(http.HandlerFunc(healthCheck)))
	http.Handle("/shorten", RateLimiter(http.HandlerFunc(shortener.ShortenURL)))
	http.Handle("/r/", RateLimiter(http.HandlerFunc(redirect.RedirectHandler)))
	http.Handle("/getUrls", RateLimiter(http.HandlerFunc(getUrlsHandler)))
	http.Handle("/deleteUrl", RateLimiter(http.HandlerFunc(deleteUrlHandler)))

	// Start the server
	fmt.Println("Server is running on port 8080...")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
