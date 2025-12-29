package handler

import (
	"net/http"
	"poly-webstudio/pkg/translate"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	translate.Handler(w, r)
}
