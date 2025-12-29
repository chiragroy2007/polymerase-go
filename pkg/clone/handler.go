package clone

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/bebop/poly/clone"
)

type PartInput struct {
	Sequence string `json:"sequence"`
	Circular bool   `json:"circular"`
}

type CloneRequest struct {
	Parts      []PartInput `json:"parts"`
	EnzymeName string      `json:"enzyme_name"`
}

type CloneResponse struct {
	Results []string `json:"results"` // Open constructs
	Error   string   `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CloneRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if len(req.Parts) == 0 {
		http.Error(w, "At least one part is required", http.StatusBadRequest)
		return
	}

	// 1. Find the enzyme
	var selectedEnzyme clone.Enzyme
	found := false
	baseEnzymes := clone.GetBaseRestrictionEnzymes()
	for _, enzyme := range baseEnzymes {
		if strings.EqualFold(enzyme.Name, req.EnzymeName) {
			selectedEnzyme = enzyme
			found = true
			break
		}
	}

	if !found {
		json.NewEncoder(w).Encode(CloneResponse{
			Error: "Enzyme not found. Supported: BsaI, BbsI, BtgZI",
		})
		return
	}

	// 2. Convert inputs to poly/clone Parts
	var parts []clone.Part
	for _, p := range req.Parts {
		parts = append(parts, clone.Part{
			Sequence: strings.ToUpper(p.Sequence),
			Circular: p.Circular,
		})
	}

	// 3. Run Golden Gate Assembly
	// Note: GoldenGate returns (openConstructs, infiniteLoops)
	// We primarily care about the constructed sequences.
	results, _ := clone.GoldenGate(parts, selectedEnzyme)

	resp := CloneResponse{
		Results: results,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
