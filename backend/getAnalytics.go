package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/prnvtripathi/go-url-api/shortener"
)

type AnalyticsRequest struct {
	UserID int `json:"user_id"`
	URLID  int `json:"url_id"`
}

type AnalyticsResponse struct {
	Success   bool                 `json:"success"`
	Analytics shortener.Analytics  `json:"analytics,omitempty"`
	Message   string               `json:"message,omitempty"`
}

func getAnalyticsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	// Decode the JSON request into AnalyticsRequest
	var req AnalyticsRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil || req.UserID == 0 || req.URLID == 0 {
		response := AnalyticsResponse{
			Success: false,
			Message: "Invalid request",
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		log.Printf("Invalid request: %v", err)
		return
	}

	analytics, err := shortener.GetAnalytics(req.UserID, req.URLID)
	if err != nil {
		response := AnalyticsResponse{
			Success: false,
			Message: "Failed to retrieve analytics",
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		log.Printf("Failed to retrieve analytics: %v", err)
		return
	}

	response := AnalyticsResponse{
		Success:   true,
		Analytics: analytics,
		Message:   "Analytics retrieved successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Failed to encode response: %v", err)
	}

}
