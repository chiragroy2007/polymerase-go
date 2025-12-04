package translate

import (
	"encoding/json"
	"net/http"
)

type TranslateRequest struct {
	Sequence string `json:"sequence"`
}

type TranslateResponse struct {
	Protein string `json:"protein"`
	Error   string `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req TranslateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Sequence == "" {
		http.Error(w, "Sequence is required", http.StatusBadRequest)
		return
	}

	protein := translate(req.Sequence)

	resp := TranslateResponse{
		Protein: protein,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func translate(sequence string) string {
	// Standard Genetic Code
	codonTable := map[string]string{
		"ATA": "I", "ATC": "I", "ATT": "I", "ATG": "M",
		"ACA": "T", "ACC": "T", "ACG": "T", "ACT": "T",
		"AAC": "N", "AAT": "N", "AAA": "K", "AAG": "K",
		"AGC": "S", "AGT": "S", "AGA": "R", "AGG": "R",
		"CTA": "L", "CTC": "L", "CTG": "L", "CTT": "L",
		"CCA": "P", "CCC": "P", "CCG": "P", "CCT": "P",
		"CAC": "H", "CAT": "H", "CAA": "Q", "CAG": "Q",
		"CGA": "R", "CGC": "R", "CGG": "R", "CGT": "R",
		"GTA": "V", "GTC": "V", "GTG": "V", "GTT": "V",
		"GCA": "A", "GCC": "A", "GCG": "A", "GCT": "A",
		"GAC": "D", "GAT": "D", "GAA": "E", "GAG": "E",
		"GGA": "G", "GGC": "G", "GGG": "G", "GGT": "G",
		"TCA": "S", "TCC": "S", "TCG": "S", "TCT": "S",
		"TTC": "F", "TTT": "F", "TTA": "L", "TTG": "L",
		"TAC": "Y", "TAT": "Y", "TAA": "*", "TAG": "*",
		"TGC": "C", "TGT": "C", "TGA": "*", "TGG": "W",
	}

	var protein string
	for i := 0; i < len(sequence)-2; i += 3 {
		codon := sequence[i : i+3]
		if aa, ok := codonTable[codon]; ok {
			protein += aa
		} else {
			protein += "X"
		}
	}
	return protein
}
