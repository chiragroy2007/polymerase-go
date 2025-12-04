package main

import (
	"fmt"
	"log"
	"net/http"
	"poly-webstudio/pkg/align"
	"poly-webstudio/pkg/checks"
	"poly-webstudio/pkg/codon"
	"poly-webstudio/pkg/fold"
	"poly-webstudio/pkg/primers"
	"poly-webstudio/pkg/random"
	"poly-webstudio/pkg/revcomp"
	"poly-webstudio/pkg/seqhash"
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

	fmt.Println("Starting local API server on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
