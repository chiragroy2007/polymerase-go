package handler

import (
	"net/http"

	"poly-webstudio/pkg/search"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	search.Handler(w, r)
}
