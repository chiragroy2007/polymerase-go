package handler

import (
	"net/http"
	"poly-webstudio/pkg/codon"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	codon.Handler(w, r)
}
