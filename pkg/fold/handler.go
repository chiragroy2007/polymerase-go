package fold

import (
	"encoding/json"
	"math"
	"net/http"
	"strings"

	"github.com/bebop/poly/checks"
	"github.com/bebop/poly/fold"
)

type FoldRequest struct {
	Sequence    string  `json:"sequence"`
	Temperature float64 `json:"temperature"`
}

type FoldResponse struct {
	MinimumFreeEnergy float64 `json:"minimum_free_energy"`
	Structure         string  `json:"structure"` // Dot-bracket notation
	Type              string  `json:"type"`      // DNA or RNA
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

	seq := strings.ToUpper(strings.TrimSpace(req.Sequence))
	if seq == "" {
		http.Error(w, "Sequence is required", http.StatusBadRequest)
		return
	}
	if req.Temperature == 0 {
		req.Temperature = 37.0 // Default 37C
	}

	// Identify type
	seqType := "UNKNOWN"
	if checks.IsRNA(seq) {
		seqType = "RNA"
	} else if checks.IsDNA(seq) {
		seqType = "DNA"
	}
	// Note: We don't block UNKNOWN here because Zuker might attempt it anyway,
	// or the check might be too strict. We let Zuker fail if it can't handle it.

	// fold.Zuker returns (Result, error)
	result, err := fold.Zuker(seq, req.Temperature)
	if err != nil {
		// Provide a more user-friendly error if possible
		msg := err.Error()
		if strings.Contains(msg, "is not RNA or DNA") {
			msg = "Sequence must be valid DNA or RNA (ACGT/U only)."
		}
		json.NewEncoder(w).Encode(FoldResponse{Error: msg})
		return
	}

	mfe := result.MinimumFreeEnergy()
	if math.IsNaN(mfe) || math.IsInf(mfe, 0) {
		mfe = 0.0
	}

	resp := FoldResponse{
		MinimumFreeEnergy: mfe,
		Structure:         result.DotBracket(),
		Type:              seqType,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
