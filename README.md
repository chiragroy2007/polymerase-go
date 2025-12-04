# Polymerase-go

**High-Performance Computational Biology Platform**

Polymerase-go is a next-generation bioinformatics suite designed for speed, accuracy, and accessibility. By bridging a modern, responsive **Next.js** frontend with a high-performance **Go** backend, it delivers research-grade sequence analysis tools that run locally with native efficiency.

Powered by the [**poly**](https://github.com/bebop/poly) library, Polymerase-go provides a robust set of utilities for DNA, RNA, and protein manipulation, engineered for students, researchers, and bioengineers who demand reliable computation without the latency of cloud-based services.

## 🚀 Why Polymerase-go?

### **Unmatched Performance**
Unlike traditional Python-based bioinformatics tools or client-side JavaScript implementations, Polymerase-go offloads heavy computation to a **Go server**. Go's statically typed, compiled nature ensures that algorithms like **Needleman-Wunsch alignment**, **Zuker folding**, and **SeqHash generation** execute with near-instantaneous speed, even for complex datasets.

### **Scientific Accuracy**
Built on top of `poly`, a rigorously tested Go library for engineering organisms, Polymerase-go ensures that every calculation—from reverse complements to codon optimization—adheres to strict biological standards.

### **Privacy & Security**
Run your sensitive genetic data locally. No cloud uploads, no API rate limits, and no data dependency. Your research stays on your machine.

## 🛠️ Toolset

| Category | Tool | Description |
|----------|------|-------------|
| **Manipulation** | **Reverse Complement** | Generate reverse complements instantly. |
| | **Translation** | Accurate DNA-to-Protein translation using standard genetic codes. |
| **Analysis** | **Sequence Alignment** | Global pairwise alignment (Needleman-Wunsch) with configurable scoring. |
| | **Folding** | Predict RNA/DNA secondary structures and Minimum Free Energy (MFE). |
| | **Checks** | Verify sequence properties (DNA/RNA type, palindromicity). |
| **Synthetic Bio** | **Codon Optimization** | Optimize sequences for expression in specific hosts (e.g., *E. coli*). |
| | **Primer Design** | Automated forward and reverse primer generation for PCR. |
| **Utilities** | **SeqHash** | Generate unique, reproducible hashes for biological sequences. |
| | **Random Generator** | Create synthetic DNA/RNA/Protein sequences for testing. |

## 💻 Installation & Local Setup

Polymerase-go is designed to be run locally on your machine. Follow these steps to get started.

### Prerequisites
- **Go** (v1.18 or later): [Download Go](https://go.dev/dl/)
- **Node.js** (v18 or later): [Download Node.js](https://nodejs.org/)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/polymerase-go.git
cd polymerase-go
```

### 2. Setup the Backend (Go)
The backend handles all computational logic.
```bash
# Install Go dependencies
go mod tidy

# Start the local development server (runs on port 8080)
go run dev_server.go
```
*Keep this terminal window open.*

### 3. Setup the Frontend (Next.js)
Open a **new terminal window** in the same directory.
```bash
# Install Node.js dependencies
npm install

# Start the frontend interface (runs on port 3000)
npm run dev
```

### 4. Access the Platform
Open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

## 🏗️ Architecture

- **Frontend**: Next.js 14 (React), Tailwind CSS, Lucide Icons.
- **Backend**: Go (Golang) HTTP Server.
- **Core Library**: `github.com/bebop/poly` (Bioinformatics logic).
- **Communication**: REST API (JSON) over HTTP.

## 🤝 Contributing

We welcome contributions from the scientific community! Whether you're adding a new algorithm from `poly` or refining the UI, please feel free to submit a Pull Request.

---

**Built by Chirag** • **Powered by Poly** • **TeamNeuron Tools**
