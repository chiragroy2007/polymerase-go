package handler

import (
	"net/http"

	"poly-webstudio/pkg/io"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	io.Handler(w, r)
}
