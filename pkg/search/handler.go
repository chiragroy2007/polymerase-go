package search

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/bebop/poly/search/bwt"
	"github.com/bebop/poly/search/mash"
)

type SearchRequest struct {
	Tool string `json:"tool"` // "bwt", "mash"

	// Common / BWT
	Sequence string `json:"sequence"`
	Pattern  string `json:"pattern,omitempty"`

	// Mash
	SequenceB  string `json:"sequence_b,omitempty"`
	KmerSize   int    `json:"kmer_size,omitempty"`
	SketchSize int    `json:"sketch_size,omitempty"`
}

type SearchResponse struct {
	// BWT Results
	Count   int   `json:"count,omitempty"`
	Offsets []int `json:"offsets,omitempty"`

	// Mash Results
	Similarity float64 `json:"similarity,omitempty"`
	Distance   float64 `json:"distance,omitempty"`

	Error string `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req SearchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var resp SearchResponse
	var err error

	switch strings.ToLower(req.Tool) {
	case "bwt":
		resp, err = handleBWT(req)
	case "mash":
		resp, err = handleMash(req)
	default:
		err = fmt.Errorf("unknown tool: %s", req.Tool)
	}

	if err != nil {
		json.NewEncoder(w).Encode(SearchResponse{Error: err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func handleBWT(req SearchRequest) (SearchResponse, error) {
	if req.Sequence == "" {
		return SearchResponse{}, fmt.Errorf("sequence is required")
	}
	if req.Pattern == "" {
		return SearchResponse{}, fmt.Errorf("pattern is required")
	}

	// BWT construction might be slow for massive sequences, but fine for demo.
	b, err := bwt.New(req.Sequence)
	if err != nil {
		return SearchResponse{}, fmt.Errorf("failed to build BWT: %w", err)
	}

	count, err := b.Count(req.Pattern)
	if err != nil {
		return SearchResponse{}, fmt.Errorf("count failed: %w", err)
	}

	var offsets []int
	// Only locate if count is reasonable to avoid huge payload
	if count > 0 && count < 1000 {
		offsets, err = b.Locate(req.Pattern)
		if err != nil {
			return SearchResponse{}, fmt.Errorf("locate failed: %w", err)
		}
	} else if count >= 1000 {
		// Cap offsets?
		offsets = []int{-1} // Signal too many?
	}

	return SearchResponse{
		Count:   count,
		Offsets: offsets,
	}, nil
}

func handleMash(req SearchRequest) (SearchResponse, error) {
	if req.Sequence == "" || req.SequenceB == "" {
		return SearchResponse{}, fmt.Errorf("sequence_a and sequence_b are required")
	}

	k := req.KmerSize
	if k == 0 {
		k = 21 // Default
	}
	s := req.SketchSize
	if s == 0 {
		s = 1000 // Default
	}

	m1 := mash.New(k, s)
	m1.Sketch(req.Sequence)

	m2 := mash.New(k, s)
	m2.Sketch(req.SequenceB)

	sim := m1.Similarity(m2)
	dist := m1.Distance(m2)

	return SearchResponse{
		Similarity: sim,
		Distance:   dist,
	}, nil
}
