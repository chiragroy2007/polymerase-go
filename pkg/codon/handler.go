package codon

import (
	"encoding/json"
	"net/http"
)

type OptimizeRequest struct {
	ProteinSequence string `json:"protein_sequence"`
	Organism        string `json:"organism"` // e.g. "E. coli", "S. cerevisiae"
}

type OptimizeResponse struct {
	DNA   string `json:"dna"`
	Error string `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req OptimizeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.ProteinSequence == "" {
		http.Error(w, "Protein sequence is required", http.StatusBadRequest)
		return
	}

	dna := optimize(req.ProteinSequence)

	resp := OptimizeResponse{
		DNA: dna,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func optimize(protein string) string {
	// Simple E. coli codon usage (most frequent codon)
	codonTable := map[rune]string{
		'A': "GCG", 'C': "TGC", 'D': "GAT", 'E': "GAA",
		'F': "TTC", 'G': "GGC", 'H': "CAT", 'I': "ATT",
		'K': "AAA", 'L': "CTG", 'M': "ATG", 'N': "AAC",
		'P': "CCG", 'Q': "CAG", 'R': "CGT", 'S': "AGC",
		'T': "ACC", 'V': "GTG", 'W': "TGG", 'Y': "TAT",
		'*': "TAA",
	}

	var dna string
	for _, aa := range protein {
		if codon, ok := codonTable[aa]; ok {
			dna += codon
		} else {
			dna += "NNN"
		}
	}
	return dna
}
