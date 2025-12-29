package handler

import (
	"net/http"
	"poly-webstudio/pkg/seqhash"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	seqhash.Handler(w, r)
}
