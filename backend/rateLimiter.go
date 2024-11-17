package main

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()
var redisClient *redis.Client

// connectRedis initializes and tests the Redis connection
func connectRedis() error {
	redisClient = redis.NewClient(&redis.Options{
		Addr:      os.Getenv("UPSTASH_REDIS_URL"), // Ensure this includes port if needed
		Password:  os.Getenv("UPSTASH_REDIS_PASSWORD"),
		DB:        0,
		TLSConfig: &tls.Config{}, // Add if using Upstash or other secure Redis providers
	})

	pong, err := redisClient.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	fmt.Println("Redis connected:", pong)

	return nil
}

type Response struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
}

func RateLimiter(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil {
			fmt.Printf("Error parsing IP: %v\n", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		key := fmt.Sprintf("rate_limit:%s", ip)
		limit := 20
		window := 60 * time.Second

		count, err := redisClient.Incr(ctx, key).Result()
		if err != nil {
			fmt.Printf("Redis Incr error: %v\n", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if count == 1 {
			_, err := redisClient.Expire(ctx, key, window).Result()
			if err != nil {
				fmt.Printf("Redis Expire error: %v\n", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}
		}

		if count > int64(limit) {
			response := Response{
				Message: "Rate limit exceeded. Try again later.",
				Status:  http.StatusTooManyRequests,
			}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusTooManyRequests)
			json.NewEncoder(w).Encode(response)
			return
		}

		next.ServeHTTP(w, r)
	})
}
