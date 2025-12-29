package handler

import (
	"net/http"
	"poly-webstudio/pkg/clone"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	clone.Handler(w, r)
}
