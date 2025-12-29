package handler

import (
	"net/http"
	"poly-webstudio/pkg/checks"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	checks.Handler(w, r)
}
