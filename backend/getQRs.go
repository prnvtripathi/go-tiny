package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/prnvtripathi/go-url-api/shortener"
)

type QRRequest struct {
	UserID int `json:"user_id"`
}

type QRResponse struct {
	Success bool           `json:"success"`
	QRs     []shortener.QR `json:"qrs,omitempty"`
	Message string         `json:"message,omitempty"`
}

func getQRsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	// Decode the JSON request into URLRequest
	var req URLRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil || req.UserID == 0 {
		response := URLResponse{
			Success: false,
			Message: "Invalid request",
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		log.Printf("Invalid request: %v", err)
		return
	}

	qrs, err := shortener.GetQRs(req.UserID)
	if err != nil {
		response := URLResponse{
			Success: false,
			Message: "Failed to retrieve URLs",
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		log.Printf("Failed to retrieve URLs: %v", err)
		return
	}

	response := QRResponse{
		Success: true,
		QRs:     qrs,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Failed to encode response: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}
