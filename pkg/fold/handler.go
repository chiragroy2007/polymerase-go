package fold

import (
	"encoding/json"
	"math"
	"net/http"

	"github.com/bebop/poly/fold"
)

type FoldRequest struct {
	Sequence    string  `json:"sequence"`
	Temperature float64 `json:"temperature"`
}

type FoldResponse struct {
	MinimumFreeEnergy float64 `json:"minimum_free_energy"`
	Structure         string  `json:"structure"` // Dot-bracket notation if available
	Error             string  `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req FoldRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Sequence == "" {
		http.Error(w, "Sequence is required", http.StatusBadRequest)
		return
	}
	if req.Temperature == 0 {
		req.Temperature = 37.0 // Default 37C
	}

	// fold.Zuker returns (Result, error)
	result, err := fold.Zuker(req.Sequence, req.Temperature)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	mfe := result.MinimumFreeEnergy()
	if math.IsNaN(mfe) || math.IsInf(mfe, 0) {
		mfe = 0.0 // Handle invalid energy values gracefully
	}

	resp := FoldResponse{
		MinimumFreeEnergy: mfe,
		Structure:         result.DotBracket(),
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}
