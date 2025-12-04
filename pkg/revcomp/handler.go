package revcomp

import (
	"encoding/json"
	"net/http"

	"github.com/bebop/poly/transform"
)

type RevCompRequest struct {
	Sequence string `json:"sequence"`
}

type RevCompResponse struct {
	ReverseComplement string `json:"reverse_complement"`
	Error             string `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req RevCompRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Sequence == "" {
		http.Error(w, "Sequence is required", http.StatusBadRequest)
		return
	}

	rc := transform.ReverseComplement(req.Sequence)

	resp := RevCompResponse{
		ReverseComplement: rc,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
