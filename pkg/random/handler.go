package random

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/bebop/poly/random"
)

type RandomRequest struct {
	Type   string `json:"type"`   // "DNA", "RNA", "Protein"
	Length int    `json:"length"`
	Seed   int64  `json:"seed,omitempty"`
}

type RandomResponse struct {
	Sequence string `json:"sequence"`
	Error    string `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req RandomRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Length <= 0 {
		req.Length = 100 // Default length
	}
	if req.Seed == 0 {
		req.Seed = time.Now().UnixNano()
	}

	var seq string
	var err error

	switch req.Type {
	case "RNA":
		seq, err = random.RNASequence(req.Length, req.Seed)
	case "Protein":
		seq, err = random.ProteinSequence(req.Length, req.Seed)
	default: // DNA
		seq, err = random.DNASequence(req.Length, req.Seed)
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := RandomResponse{
		Sequence: seq,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
