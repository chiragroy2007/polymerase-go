package primers

import (
	"encoding/json"
	"net/http"
)

type PrimerRequest struct {
	Sequence string `json:"sequence"`
}

type PrimerResponse struct {
	ForwardPrimer string `json:"forward_primer"`
	ReversePrimer string `json:"reverse_primer"`
	Error         string `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req PrimerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if len(req.Sequence) < 20 {
		http.Error(w, "Sequence too short", http.StatusBadRequest)
		return
	}

	// Simple primer design: first 20 bases and reverse complement of last 20 bases
	fwd := req.Sequence[:20]
	rev := req.Sequence[len(req.Sequence)-20:]
	revComp := reverseComplement(rev)

	resp := PrimerResponse{
		ForwardPrimer: fwd,
		ReversePrimer: revComp,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func reverseComplement(seq string) string {
	// Simple reverse complement
	complement := map[rune]rune{
		'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C',
		'a': 't', 't': 'a', 'c': 'g', 'g': 'c',
		'N': 'N', 'n': 'n',
	}
	
	runes := []rune(seq)
	n := len(runes)
	rc := make([]rune, n)
	for i, base := range runes {
		if c, ok := complement[base]; ok {
			rc[n-1-i] = c
		} else {
			rc[n-1-i] = base
		}
	}
	return string(rc)
}
