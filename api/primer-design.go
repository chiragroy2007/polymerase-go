package handler

import (
	"net/http"
	"poly-webstudio/pkg/primers"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	primers.Handler(w, r)
}
