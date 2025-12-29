package checks

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/bebop/poly/checks"
)

type ChecksRequest struct {
	Sequence string `json:"sequence"`
}

type ChecksResponse struct {
	IsDNA         bool    `json:"is_dna"`
	IsRNA         bool    `json:"is_rna"`
	IsPalindromic bool    `json:"is_palindromic"`
	GcContent     float64 `json:"gc_content"`
	Error         string  `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ChecksRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Sequence == "" {
		http.Error(w, "Sequence is required", http.StatusBadRequest)
		return
	}

	// Normalize sequence to uppercase as poly/checks functions (IsDNA, IsRNA) are case-sensitive
	req.Sequence = strings.ToUpper(req.Sequence)

	isDNA := checks.IsDNA(req.Sequence)
	isRNA := checks.IsRNA(req.Sequence)
	isPalindromic := checks.IsPalindromic(req.Sequence)
	gcContent := checks.GcContent(req.Sequence)

	resp := ChecksResponse{
		IsDNA:         isDNA,
		IsRNA:         isRNA,
		IsPalindromic: isPalindromic,
		GcContent:     gcContent,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
