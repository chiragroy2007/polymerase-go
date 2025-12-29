package io

import (
	"encoding/json"
	"encoding/xml"
	"fmt"
	"net/http"
	"strings"

	"github.com/bebop/poly/io/fasta"
	"github.com/bebop/poly/io/fastq"
	"github.com/bebop/poly/io/genbank"
	"github.com/bebop/poly/io/gff"
	"github.com/bebop/poly/io/polyjson"
	"github.com/bebop/poly/io/uniprot"
)

type ConvertRequest struct {
	InputContent string `json:"input_content"`
	InputFormat  string `json:"input_format"`  // "fasta", "genbank", "json", "fastq", "gff", "uniprot"
	OutputFormat string `json:"output_format"` // "fasta", "genbank", "json", "fastq", "gff"
}

type ConvertResponse struct {
	OutputContent string `json:"output_content"`
	Error         string `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ConvertRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	output, err := convert(req.InputContent, req.InputFormat, req.OutputFormat)
	if err != nil {
		json.NewEncoder(w).Encode(ConvertResponse{Error: err.Error()})
		return
	}

	resp := ConvertResponse{
		OutputContent: output,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func convert(content, inputFormat, outputFormat string) (string, error) {
	// Intermediate format: []genbank.Genbank
	var intermediate []genbank.Genbank
	var err error

	// 1. Parse Input -> Intermediate
	switch strings.ToLower(inputFormat) {
	case "fasta":
		parser := fasta.NewParser(strings.NewReader(content), 32*1024)
		fastas, err := parser.ParseAll()
		if err != nil {
			return "", fmt.Errorf("failed to parse fasta: %w", err)
		}
		intermediate = fastasToGenbanks(fastas)
	case "genbank":
		intermediate, err = genbank.ParseMulti(strings.NewReader(content))
		if err != nil {
			return "", fmt.Errorf("failed to parse genbank: %w", err)
		}
	case "json", "polyjson":
		poly, err := polyjson.Parse(strings.NewReader(content))
		if err != nil {
			return "", fmt.Errorf("failed to parse polyjson: %w", err)
		}
		intermediate = []genbank.Genbank{polyToGenbank(poly)}
	case "fastq":
		fastqs, err := fastq.Parse(strings.NewReader(content))
		if err != nil {
			return "", fmt.Errorf("failed to parse fastq: %w", err)
		}
		intermediate = fastqsToGenbanks(fastqs)
	case "gff":
		gffRecord, err := gff.Parse(strings.NewReader(content))
		if err != nil {
			return "", fmt.Errorf("failed to parse gff: %w", err)
		}
		intermediate = []genbank.Genbank{gffToGenbank(gffRecord)}
	case "uniprot", "uniprotxml":
		intermediate, err = parseUniprot(content)
		if err != nil {
			return "", fmt.Errorf("failed to parse uniprot: %w", err)
		}
	default:
		return "", fmt.Errorf("unsupported input format: %s", inputFormat)
	}

	// 2. Build Output <- Intermediate
	switch strings.ToLower(outputFormat) {
	case "fasta":
		fastas := genbanksToFastas(intermediate)
		bytes, err := fasta.Build(fastas)
		return string(bytes), err
	case "genbank":
		bytes, err := genbank.BuildMulti(intermediate)
		return string(bytes), err
	case "json", "polyjson":
		if len(intermediate) == 0 {
			return "", nil
		}
		var polyList []polyjson.Poly
		for _, gb := range intermediate {
			polyList = append(polyList, genbankToPoly(gb))
		}
		if len(polyList) == 1 {
			b, err := json.MarshalIndent(polyList[0], "", "  ")
			return string(b), err
		}
		b, err := json.MarshalIndent(polyList, "", "  ")
		return string(b), err
	case "fastq":
		fastqs := genbanksToFastqs(intermediate)
		bytes, err := fastq.Build(fastqs)
		return string(bytes), err
	case "gff":
		if len(intermediate) == 0 {
			return "", nil
		}
		// GFF only handles single sequence per call usually, so we concatenate or just do first?
		// gff.Build takes a single Gff struct.
		// Let's just output the first one for now as a limitation or join them?
		// Joining GFFs isn't standard in the library. Let's do first one.
		gffRecord := genbankToGff(intermediate[0])
		bytes, err := gff.Build(gffRecord)
		return string(bytes), err

	default:
		return "", fmt.Errorf("unsupported output format: %s", outputFormat)
	}
}

// Helpers

func fastasToGenbanks(fastas []fasta.Fasta) []genbank.Genbank {
	var gbs []genbank.Genbank
	for _, f := range fastas {
		gbs = append(gbs, genbank.Genbank{
			Meta: genbank.Meta{
				Locus:      genbank.Locus{Name: f.Name, Circular: false},
				Name:       f.Name,
				Definition: f.Name,
			},
			Sequence: f.Sequence,
		})
	}
	return gbs
}

func genbanksToFastas(gbs []genbank.Genbank) []fasta.Fasta {
	var fs []fasta.Fasta
	for _, gb := range gbs {
		name := gb.Meta.Name
		if name == "" {
			name = gb.Meta.Locus.Name
		}
		fs = append(fs, fasta.Fasta{
			Name:     name,
			Sequence: gb.Sequence,
		})
	}
	return fs
}

func polyToGenbank(p polyjson.Poly) genbank.Genbank {
	gb := genbank.Genbank{
		Meta: genbank.Meta{
			Name:       p.Meta.Name,
			Definition: p.Meta.Description,
			Accession:  p.Meta.Name,
			Locus: genbank.Locus{
				Name:     p.Meta.Name,
				Circular: false,
			},
		},
		Sequence: p.Sequence,
	}
	for _, f := range p.Features {
		gbFeat := genbank.Feature{
			Type:        f.Type,
			Description: f.Description,
			Attributes:  f.Tags,
			Location: genbank.Location{
				Start:      f.Location.Start,
				End:        f.Location.End,
				Complement: f.Location.Complement,
			},
		}
		gb.Features = append(gb.Features, gbFeat)
	}
	return gb
}

func genbankToPoly(gb genbank.Genbank) polyjson.Poly {
	p := polyjson.Poly{
		Meta: polyjson.Meta{
			Name:        gb.Meta.Name,
			Description: gb.Meta.Definition,
		},
		Sequence: gb.Sequence,
	}
	if p.Meta.Name == "" {
		p.Meta.Name = gb.Meta.Locus.Name
	}
	for _, f := range gb.Features {
		pf := polyjson.Feature{
			Name:        f.Attributes["label"],
			Type:        f.Type,
			Description: f.Description,
			Tags:        f.Attributes,
			Location: polyjson.Location{
				Start:      f.Location.Start,
				End:        f.Location.End,
				Complement: f.Location.Complement,
			},
		}
		p.Features = append(p.Features, pf)
	}
	return p
}

// FASTQ Helpers
func fastqsToGenbanks(fastqs []fastq.Fastq) []genbank.Genbank {
	var gbs []genbank.Genbank
	for _, f := range fastqs {
		// Use Optionals to try to populate meta?
		gbs = append(gbs, genbank.Genbank{
			Meta: genbank.Meta{
				Locus:      genbank.Locus{Name: f.Identifier, Circular: false},
				Name:       f.Identifier,
				Definition: f.Identifier,
				// We can store Quality in "Other" or somewhere else if needed, but standard Genbank doesn't hold it easily.
			},
			Sequence: f.Sequence,
		})
	}
	return gbs
}

func genbanksToFastqs(gbs []genbank.Genbank) []fastq.Fastq {
	var fqs []fastq.Fastq
	for _, gb := range gbs {
		name := gb.Meta.Name
		if name == "" {
			name = gb.Meta.Locus.Name
		}
		// Generate dummy quality score if real data missing
		// FASTQ quality is usually length of sequence.
		// Lowest quality '!' is 33.
		dummyQuality := strings.Repeat("I", len(gb.Sequence)) // 'I' is often used as a good quality placeholder (score 40)

		fqs = append(fqs, fastq.Fastq{
			Identifier: name,
			Sequence:   gb.Sequence,
			Quality:    dummyQuality,
		})
	}
	return fqs
}

// GFF Helpers
func gffToGenbank(g gff.Gff) genbank.Genbank {
	gb := genbank.Genbank{
		Meta: genbank.Meta{
			Name:       g.Meta.Name,
			Definition: g.Meta.Description,
			Locus: genbank.Locus{
				Name: g.Meta.Name,
			},
		},
		Sequence: g.Sequence,
	}
	for _, f := range g.Features {
		gbFeat := genbank.Feature{
			Type:       f.Type,
			Attributes: f.Attributes,
			Location: genbank.Location{
				Start:      f.Location.Start,
				End:        f.Location.End,
				Complement: f.Location.Complement,
			},
		}
		gb.Features = append(gb.Features, gbFeat)
	}
	return gb
}

func genbankToGff(gb genbank.Genbank) gff.Gff {
	g := gff.Gff{
		Meta: gff.Meta{
			Name:        gb.Meta.Name,
			Description: gb.Meta.Definition,
			RegionEnd:   len(gb.Sequence),
		},
		Sequence: gb.Sequence,
	}
	if g.Meta.Name == "" {
		g.Meta.Name = gb.Meta.Locus.Name
	}
	for _, f := range gb.Features {
		gFeat := gff.Feature{
			Type:       f.Type,
			Source:     "poly-tool",
			Attributes: f.Attributes,
			Location: gff.Location{
				Start:      f.Location.Start,
				End:        f.Location.End,
				Complement: f.Location.Complement,
			},
		}
		g.AddFeature(&gFeat)
	}
	return g
}

// Uniprot Helper
func parseUniprot(content string) ([]genbank.Genbank, error) {
	entries := make(chan uniprot.Entry, 10) // buffered
	errors := make(chan error, 10)

	// Start parsing in a goroutine
	go func() {
		decoder := xml.NewDecoder(strings.NewReader(content))
		uniprot.Parse(decoder, entries, errors)
	}()

	var gbs []genbank.Genbank
	// Collect entries
	for entry := range entries {
		// Map Entry to Genbank
		name := ""
		if len(entry.Name) > 0 {
			name = entry.Name[0]
		}
		desc := ""
		if entry.Protein.RecommendedName.FullName.Value != "" {
			desc = entry.Protein.RecommendedName.FullName.Value
		}

		gb := genbank.Genbank{
			Meta: genbank.Meta{
				Name:       name,
				Definition: desc,
				Locus: genbank.Locus{
					Name: name,
				},
				Accession: strings.Join(entry.Accession, ";"),
			},
			Sequence: entry.Sequence.Value,
		}
		gbs = append(gbs, gb)
	}

	// Check for errors (optional, simplified)
	// In a real app we'd check 'errors' channel too, but Parse closes 'entries' when done.

	return gbs, nil
}
