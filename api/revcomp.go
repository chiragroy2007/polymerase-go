package handler

import (
	"net/http"
	"poly-webstudio/pkg/revcomp"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	revcomp.Handler(w, r)
}
