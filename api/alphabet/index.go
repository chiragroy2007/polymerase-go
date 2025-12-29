package handler

import (
	"net/http"
	"poly-webstudio/pkg/alphabet"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	alphabet.Handler(w, r)
}
