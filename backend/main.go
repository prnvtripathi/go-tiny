package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

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
	// Load .env only if running locally (not in production)
	env := os.Getenv("ENVIRONMENT") // Assume "APP_ENV" determines the environment
	if env != "production" {
		err := godotenv.Load(".env")
		if err != nil {
			log.Printf("Warning: No .env file found. Continuing without it.")
		} else {
			fmt.Println("Environment variables loaded from .env")
		}
	}

	// Connect to Redis
	err := connectRedis()
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

	// Determine the port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start the server
	fmt.Printf("Server is running on port %s...\n", port)
	err = http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
