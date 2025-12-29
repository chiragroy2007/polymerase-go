package handler

import (
	"net/http"
	"poly-webstudio/pkg/fold"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	fold.Handler(w, r)
}
