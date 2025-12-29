package main

import (
	"fmt"
	"log"
	"net/http"
	"poly-webstudio/pkg/align"
	"poly-webstudio/pkg/alphabet"
	"poly-webstudio/pkg/checks"
	"poly-webstudio/pkg/clone"
	"poly-webstudio/pkg/codon"
	"poly-webstudio/pkg/fold"
	"poly-webstudio/pkg/io"
	"poly-webstudio/pkg/primers"
	"poly-webstudio/pkg/random"
	"poly-webstudio/pkg/revcomp"
	"poly-webstudio/pkg/search"
	"poly-webstudio/pkg/seqhash"
	"poly-webstudio/pkg/transform"
	"poly-webstudio/pkg/translate"
)

func main() {
	http.HandleFunc("/api/revcomp", revcomp.Handler)
	http.HandleFunc("/api/codon-optimize", codon.Handler)
	http.HandleFunc("/api/align", align.Handler)
	http.HandleFunc("/api/translate", translate.Handler)
	http.HandleFunc("/api/primer-design", primers.Handler)
	http.HandleFunc("/api/random", random.Handler)
	http.HandleFunc("/api/seqhash", seqhash.Handler)
	http.HandleFunc("/api/checks", checks.Handler)
	http.HandleFunc("/api/fold", fold.Handler)
	http.HandleFunc("/api/alphabet", alphabet.Handler)
	http.HandleFunc("/api/clone", clone.Handler)
	http.HandleFunc("/api/io", io.Handler)
	http.HandleFunc("/api/search", search.Handler)
	http.HandleFunc("/api/transform", transform.Handler)

	fmt.Println("Starting local API server on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
