# Polymerase-go

<img src="https://raw.githubusercontent.com/bebop/presskit/main/gopher.png" width="150" alt="Polymerase-go Banner">

**Polymerase-go** is a high-performance, open-source computational biology workbench. Built for speed and rigorous scientific accuracy, it provides a tailored suite of tools for synthetic biology, sequence analysis, and DNA manipulation.

Whether you are a student learning the ropes of genetic engineering or a researcher needing quick, reliable sequence operations, Polymerase-go offers a streamlined, "human-first" interface backed by the lightning-fast Go `poly` library.

---

## Table of Contents

- [Features](#features)
  - [Analysis](#analysis)
  - [Manipulation](#manipulation)
  - [Synthetic Biology](#synthetic-biology)
  - [Utilities](#utilities)
- [Installation Guide](#installation-guide)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Setup](#step-by-step-setup)
- [Deployment on Ubuntu](#deployment-on-ubuntu)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [Credits](#credits)

---

## Features

We've organized our tools into logical categories to help you find exactly what you need.

### Analysis
Powerful tools to interrogate your sequences.
*   **[Sequence Search](/search)**: Locate patterns and compare sequences using advanced BWT (Burrows-Wheeler Transform) and Mash (MinHash) algorithms.
*   **[Global & Local Align](/align)**: Align sequences end-to-end (Needleman-Wunsch) or find local similarities (Smith-Waterman).
*   **[Sequence Checks](/checks)**: Instantly validate GC content, check for palindromes, and confirm DNA/RNA identity.
*   **[Alphabet Validator](/alphabet)**: Strict validation against standard (DNA, RNA, Protein) or custom user-defined alphabets.
*   **[Folding](/fold)**: Predict secondary structures and Minimum Free Energy (MFE) using the Zuker algorithm.
*   **[SeqHash](/seqhash)**: Generate collision-resistant, stable hashes for sequence deduplication.

### Manipulation
Transform and edit your genetic data.
*   **[Sequence Transform](/transform)**: Perform reverse, complement, and IUPAC variant expansion in one place.
*   **[Translation](/translate)**: Convert DNA/RNA into protein sequences using standard genetic codes.
*   **[Random Generator](/random)**: Create synthetic test sequences of any length with balanced distribution.
*   **[Reverse Complement](/revcomp)**: A quick utility for standard reverse complement operations.

### Synthetic Biology
Design and simulate constructs.
*   **[Golden Gate Assembly](/clone)**: Simulate digestion and ligation with Type IIS enzymes (BsaI, BbsI, BtgZI) for complex cloning workflows.
*   **[Codon Optimization](/codon-optimize)**: Optimize protein sequences for efficient expression in host organisms like *E. coli*.
*   **[Primer Design](/primer-design)**: Automatically generate forward and reverse PCR primers with calculated melting temperatures.

### Utilities
Essential helpers for your workflow.
*   **[Universal Converter](/io)**: Seamlessly convert between FASTA, GenBank, FASTQ, GFF, and PolyJSON formats.

---

## Installation Guide

Run Polymerase-go locally on your machine for development or personal use.

### Prerequisites
*   **Go** (v1.23 or later): [Download Go](https://go.dev/dl/)
*   **Node.js** (v18 or later): [Download Node.js](https://nodejs.org/en/download/)
*   **Git**: [Download Git](https://git-scm.com/downloads)

### Step-by-Step Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/chiragroy2007/polymerase-go.git
    cd polymerase-go
    ```

2.  **Start the Backend Server**
    The Go backend handles all computational heavy lifting.
    ```bash
    # Runs the server on localhost:8080
    go run main.go
    ```
    *Keep this terminal open.*

3.  **Start the Frontend**
    Open a new terminal window to run the Next.js interface.
    ```bash
    npm install
    npm run dev
    ```

4.  **Access the Workbench**
    Open your browser and navigate to `http://localhost:3000`.

---

## Deployment on Ubuntu

Ready to host this for your lab or team? Here is a complete guide to deploying Polymerase-go on a fresh Ubuntu server.

### 1. Prepare the Server
Update your system and install necessary dependencies.
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git curl build-essential -y
```

### 2. Install Go
```bash
# Download Go 1.23 (check https://go.dev/dl/ for latest version)
wget https://go.dev/dl/go1.23.0.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.0.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.profile
source ~/.profile
go version # Verify installation
```

### 3. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Verify installation
```

### 4. Deploy the Application
Clone the repo and set it up.

```bash
git clone https://github.com/chiragroy2007/polymerase-go.git
cd polymerase-go

# Build the Backend
go build -o server main.go

# Install Frontend Dependencies and Build
npm install
npm run build
```

### 5. Run the Services
For a production setup, we recommend using `pm2` to keep things running.

```bash
sudo npm install -g pm2

# Start Backend
pm2 start ./server --name "poly-backend"

# Start Frontend
pm2 start npm --name "poly-frontend" -- start
```

Your app is now live! 
- Frontend: `http://<your-server-ip>:3000`
- Backend: `http://<your-server-ip>:8080`

*(Note: For a secure production environment, consider setting up Nginx as a reverse proxy with SSL.)*

---

## API Reference

The backend exposes a RESTful API at `/api`. Each tool has a corresponding endpoint.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/align` | POST | Sequence alignment (Global/Local) |
| `/api/clone` | POST | Golden Gate cloning simulation |
| `/api/transform` | POST | Sequence transformation and variants |
| `/api/io` | POST | File format conversion |
| ... | ... | See `main.go` for full route list |

---

## Contributing

We welcome contributions! Whether it's fixing a bug, improving documentation, or adding a new algorithm, your help makes this tool better for everyone.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## Credits

**Polymerase-go** is proudly developed by [Chirag](https://github.com/chiragroy2007) as part of **TeamNeuron Tools**.

*   Powered by the **[Poly](https://github.com/bebop/poly)** library for Go.
*   Part of the **[TeamNeuron](https://www.teamneuron.blog)** initiative to democratize scientific software.

<div align="center">
  <sub>Made with ❤️ for Biology</sub>
</div>
