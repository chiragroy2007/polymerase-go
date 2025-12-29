package alphabet

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/bebop/poly/alphabet"
)

type AlphabetRequest struct {
	Sequence      string `json:"sequence"`
	CustomSymbols string `json:"custom_symbols,omitempty"` // Space-separated symbols, e.g., "A C G T"
}

type AlphabetResult struct {
	Valid bool   `json:"valid"`
	Error string `json:"error,omitempty"`
}

type AlphabetResponse struct {
	IsDNA     AlphabetResult `json:"is_dna"`
	IsRNA     AlphabetResult `json:"is_rna"`
	IsProtein AlphabetResult `json:"is_protein"`
	IsCustom  AlphabetResult `json:"is_custom,omitempty"`
	HasCustom bool           `json:"has_custom"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req AlphabetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Sequence == "" {
		http.Error(w, "Sequence is required", http.StatusBadRequest)
		return
	}

	// Validate against standard alphabets
	// DNA
	dnaValid, dnaErrStr := validateSequence(alphabet.DNA, req.Sequence)

	// RNA
	rnaValid, rnaErrStr := validateSequence(alphabet.RNA, req.Sequence)

	// Protein
	proteinValid, proteinErrStr := validateSequence(alphabet.Protein, req.Sequence)

	resp := AlphabetResponse{
		IsDNA:     AlphabetResult{Valid: dnaValid, Error: dnaErrStr},
		IsRNA:     AlphabetResult{Valid: rnaValid, Error: rnaErrStr},
		IsProtein: AlphabetResult{Valid: proteinValid, Error: proteinErrStr},
		HasCustom: false,
	}

	// Custom Alphabet Validation
	if req.CustomSymbols != "" {
		resp.HasCustom = true
		symbols := strings.Fields(req.CustomSymbols)
		if len(symbols) == 0 {
			resp.IsCustom = AlphabetResult{Valid: false, Error: "No symbols provided for custom alphabet"}
		} else {
			customAlpha := alphabet.NewAlphabet(symbols)
			valid, errStr := validateSequence(customAlpha, req.Sequence)
			resp.IsCustom = AlphabetResult{Valid: valid, Error: errStr}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func validateSequence(alpha *alphabet.Alphabet, seq string) (bool, string) {
	for _, char := range seq {
		// Convert rune to string as poly/alphabet expects symbol as string
		// Standard alphabets in poly use strings like "A", "C" etc.
		if _, err := alpha.Encode(string(char)); err != nil {
			// Using basic string concatenation to avoid importing fmt if possible,
			// but we need strconv for position. Let's just use fmt.Sprintf if we import it,
			// or just return the char.
			// Since we haven't imported fmt/strconv, and I don't want to mess up imports blindly (though I can using the tool),
			// I'll stick to a simple error message for now or add imports.
			return false, "Invalid character '" + string(char) + "'"
		}
	}
	return true, ""
}
