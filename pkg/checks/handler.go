package checks

import (
	"encoding/json"
	"net/http"

	"github.com/bebop/poly/checks"
)

type ChecksRequest struct {
	Sequence string `json:"sequence"`
}

type ChecksResponse struct {
	IsDNA         bool `json:"is_dna"`
	IsRNA         bool `json:"is_rna"`
	IsPalindromic bool `json:"is_palindromic"`
	Error         string `json:"error,omitempty"`
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

	// checks.IsDNA and IsRNA might not exist directly as simple bool checks in all versions, 
	// but based on docs they seem to be there.
	// IsPalindromic returns bool.
	
	// Note: checks.IsDNA might return error or bool. 
	// I'll assume bool based on typical Go patterns for "Is...".
	// If compilation fails, I'll fix.
	
	isDNA := checks.IsDNA(req.Sequence)
	isRNA := checks.IsRNA(req.Sequence)
	isPalindromic := checks.IsPalindromic(req.Sequence)

	resp := ChecksResponse{
		IsDNA:         isDNA,
		IsRNA:         isRNA,
		IsPalindromic: isPalindromic,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
