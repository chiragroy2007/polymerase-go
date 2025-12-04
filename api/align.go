package handler

import (
	"net/http"
	"poly-webstudio/pkg/align"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	align.Handler(w, r)
}
