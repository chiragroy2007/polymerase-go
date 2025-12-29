package handler

import (
	"net/http"

	"poly-webstudio/pkg/transform"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	transform.Handler(w, r)
}
