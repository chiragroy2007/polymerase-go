package align

import (
	"encoding/json"
	"net/http"
)

type AlignRequest struct {
	SequenceA string `json:"sequence_a"`
	SequenceB string `json:"sequence_b"`
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

	score, alignA, alignB := needlemanWunsch(req.SequenceA, req.SequenceB)

	resp := AlignResponse{
		Score:     score,
		Alignment: alignA + "\n" + alignB,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func needlemanWunsch(seqA, seqB string) (int, string, string) {
	n, m := len(seqA), len(seqB)
	if n == 0 || m == 0 {
		return 0, seqA, seqB
	}

	// Score matrix
	matrix := make([][]int, n+1)
	for i := range matrix {
		matrix[i] = make([]int, m+1)
	}

	// Gap penalty
	gap := -1
	match := 1
	mismatch := -1

	// Initialize
	for i := 0; i <= n; i++ {
		matrix[i][0] = i * gap
	}
	for j := 0; j <= m; j++ {
		matrix[0][j] = j * gap
	}

	// Fill
	for i := 1; i <= n; i++ {
		for j := 1; j <= m; j++ {
			scoreDiag := matrix[i-1][j-1]
			if seqA[i-1] == seqB[j-1] {
				scoreDiag += match
			} else {
				scoreDiag += mismatch
			}
			scoreUp := matrix[i-1][j] + gap
			scoreLeft := matrix[i][j-1] + gap

			matrix[i][j] = max(scoreDiag, max(scoreUp, scoreLeft))
		}
	}

	// Traceback
	alignA, alignB := "", ""
	i, j := n, m
	for i > 0 && j > 0 {
		score := matrix[i][j]
		scoreDiag := matrix[i-1][j-1]
		if seqA[i-1] == seqB[j-1] {
			scoreDiag += match
		} else {
			scoreDiag += mismatch
		}
		
		if score == scoreDiag {
			alignA = string(seqA[i-1]) + alignA
			alignB = string(seqB[j-1]) + alignB
			i--
			j--
		} else if score == matrix[i-1][j]+gap {
			alignA = string(seqA[i-1]) + alignA
			alignB = "-" + alignB
			i--
		} else {
			alignA = "-" + alignA
			alignB = string(seqB[j-1]) + alignB
			j--
		}
	}
	for i > 0 {
		alignA = string(seqA[i-1]) + alignA
		alignB = "-" + alignB
		i--
	}
	for j > 0 {
		alignA = "-" + alignA
		alignB = string(seqB[j-1]) + alignB
		j--
	}

	return matrix[n][m], alignA, alignB
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
