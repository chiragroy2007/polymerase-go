package transform

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/bebop/poly/transform"
	"github.com/bebop/poly/transform/variants"
)

type TransformRequest struct {
	Sequence  string `json:"sequence"`
	Operation string `json:"operation"` // "reverse", "complement", "reverse_complement", "expand_variants"
	Type      string `json:"type"`      // "dna", "rna" (default dna)
}

type TransformResponse struct {
	Result   string   `json:"result,omitempty"`
	Variants []string `json:"variants,omitempty"`
	Error    string   `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req TransformRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Sequence == "" {
		json.NewEncoder(w).Encode(TransformResponse{Error: "Sequence is required"})
		return
	}

	isRNA := strings.ToLower(req.Type) == "rna"
	var resp TransformResponse

	switch strings.ToLower(req.Operation) {
	case "reverse":
		resp.Result = transform.Reverse(req.Sequence)
	case "complement":
		if isRNA {
			resp.Result = transform.ComplementRNA(req.Sequence)
		} else {
			resp.Result = transform.Complement(req.Sequence)
		}
	case "reverse_complement":
		if isRNA {
			resp.Result = transform.ReverseComplementRNA(req.Sequence)
		} else {
			resp.Result = transform.ReverseComplement(req.Sequence)
		}
	case "expand_variants":
		vars, err := variants.AllVariantsIUPAC(req.Sequence)
		if err != nil {
			resp.Error = err.Error()
		} else {
			resp.Variants = vars
			// If too many, maybe warn? Currently backend dumps all.
		}
	default:
		resp.Error = fmt.Sprintf("Unknown operation: %s", req.Operation)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
