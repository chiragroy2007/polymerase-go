package handler

import (
	"net/http"
	"poly-webstudio/pkg/random"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	random.Handler(w, r)
}
