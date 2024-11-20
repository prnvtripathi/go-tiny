package qr

import (
	// "bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/prnvtripathi/go-url-api/shortener"
	"github.com/yeqown/go-qrcode/v2"
	"github.com/yeqown/go-qrcode/writer/standard"
)

type QRCodeRequest struct {
	URL             string `json:"url"`              // The URL to encode in the QR code
	URLID           int    `json:"url_id"`           // The URL ID in the database
	ShortCode       string `json:"short_code"`       // The short code for the URL
	Size            int    `json:"size"`             // QR code size (default: 256)
	ErrorCorrection string `json:"error_correction"` // Error correction level: L, M, Q, H
}

type QRCodeResponse struct {
	Base64  string `json:"base64"`  // The generated QR code as a Base64 string
	Success bool   `json:"success"` // Whether the operation was successful
	Message string `json:"message"` // Success or error message
}

// GenerateQRCodeHandler handles QR code generation requests.
func GenerateQRCodeHandler(w http.ResponseWriter, r *http.Request) {
	var req QRCodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.URL == "" || req.ShortCode == "" || req.URLID == 0 {
		http.Error(w, "Missing required fields: url, url_id, or short_code", http.StatusBadRequest)
		return
	}

	// Generate QR code
	base64QR, err := GenerateQRCode(req.URL, req.Size, req.ErrorCorrection)
	if err != nil {
		http.Error(w, "Failed to generate QR code: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Save QR code Base64 in the database
	err = shortener.SaveQRCodeInDB(req.URLID, req.ShortCode, base64QR)
	if err != nil {
		http.Error(w, "Failed to save QR code in database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with Base64 QR code
	response := QRCodeResponse{
		Base64:  base64QR,
		Success: true,
		Message: "QR code generated and saved successfully",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GenerateQRCode(url string, size int, errorCorrection string) (string, error) {
	if size == 0 {
		size = 256 // Default size
	}

	// Set error correction level
	var ecLevel = qrcode.ErrorCorrectionMedium
	switch errorCorrection {
	case "L":
		ecLevel = qrcode.ErrorCorrectionLow
	case "Q":
		ecLevel = qrcode.ErrorCorrectionQuart
	case "H":
		ecLevel = qrcode.ErrorCorrectionHighest
	}

	// Create the QR code with error correction level
	qrCode, err := qrcode.NewWith(url,
		qrcode.WithErrorCorrectionLevel(ecLevel),
	)
	if err != nil {
		return "", err
	}

	// Create a temporary file to write the QR code
	tempFile, err := os.CreateTemp("", "qrcode*.png")
	if err != nil {
		return "", err
	}
	defer os.Remove(tempFile.Name())
	defer tempFile.Close()

	// Create writer
	writer, err := standard.New(tempFile.Name(),
		standard.WithLogoSizeMultiplier(size),
	)
	if err != nil {
		return "", fmt.Errorf("failed to create writer: %v", err)
	}

	// Save QR code
	if err := qrCode.Save(writer); err != nil {
		return "", fmt.Errorf("failed to save QR code: %v", err)
	}

	// Read file contents
	fileContents, err := os.ReadFile(tempFile.Name())
	if err != nil {
		return "", err
	}

	// Convert to Base64
	base64QR := base64.StdEncoding.EncodeToString(fileContents)
	return base64QR, nil
}
