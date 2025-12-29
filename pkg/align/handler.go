package align

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/bebop/poly/search/align"
)

type AlignRequest struct {
	SequenceA string `json:"sequence_a"`
	SequenceB string `json:"sequence_b"`
	Mode      string `json:"mode"` // "global" (Needleman-Wunsch) or "local" (Smith-Waterman)
}

type AlignResponse struct {
	Score     int    `json:"score"`
	Alignment string `json:"alignment"`
	Error     string `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req AlignRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Default scoring (DNA)
	scoring, err := align.NewScoring(nil, -1) // -1 gap penalty
	if err != nil {
		json.NewEncoder(w).Encode(AlignResponse{Error: err.Error()})
		return
	}

	var score int
	var alignA, alignB string

	switch strings.ToLower(req.Mode) {
	case "local", "smith-waterman":
		score, alignA, alignB, err = align.SmithWaterman(req.SequenceA, req.SequenceB, scoring)
	case "global", "needleman-wunsch", "":
		score, alignA, alignB, err = align.NeedlemanWunsch(req.SequenceA, req.SequenceB, scoring)
	default:
		json.NewEncoder(w).Encode(AlignResponse{Error: fmt.Sprintf("Unknown mode: %s", req.Mode)})
		return
	}

	if err != nil {
		json.NewEncoder(w).Encode(AlignResponse{Error: err.Error()})
		return
	}

	resp := AlignResponse{
		Score:     score,
		Alignment: alignA + "\n" + alignB,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
