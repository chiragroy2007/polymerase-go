package seqhash

import (
	"encoding/json"
	"net/http"

	"github.com/bebop/poly/seqhash"
)

type HashRequest struct {
	Sequence       string `json:"sequence"`
	Type           string `json:"type"` // "DNA", "RNA", "Protein"
	Circular       bool   `json:"circular"`
	DoubleStranded bool   `json:"double_stranded"`
}

type HashResponse struct {
	Hash  string `json:"hash"`
	Error string `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req HashRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Sequence == "" {
		http.Error(w, "Sequence is required", http.StatusBadRequest)
		return
	}

	var seqType seqhash.SequenceType
	switch req.Type {
	case "RNA":
		seqType = seqhash.RNA
	case "Protein":
		seqType = seqhash.PROTEIN
	default:
		seqType = seqhash.DNA
	}

	hash, err := seqhash.Hash(req.Sequence, seqType, req.Circular, req.DoubleStranded)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := HashResponse{
		Hash: hash,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
