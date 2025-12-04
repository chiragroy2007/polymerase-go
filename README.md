# Polymerase-go

**High-Performance Computational Biology Platform**

**Live Demo**: [https://polymerase-go.tools.teamneuron.blog](https://polymerase-go.tools.teamneuron.blog)

Polymerase-go is a local bioinformatics suite that interfaces a Next.js frontend with a Go-based computational backend. It leverages the `poly` library to provide performant, statically-typed implementations of common biological algorithms, offering an alternative to interpreted language solutions for local sequence analysis.

## Architecture

The application follows a client-server architecture designed for local execution:

*   **Backend**: A Go HTTP server (`net/http`) that exposes RESTful endpoints. It handles all heavy computational tasks, including sequence alignment (Needleman-Wunsch), secondary structure prediction (Zuker algorithm), and codon optimization.
*   **Frontend**: A Next.js (React) application serving as the user interface. It communicates with the backend via JSON payloads.
*   **Core Logic**: Utilizes `github.com/bebop/poly`, a Go package for engineering organisms, ensuring strictly typed and tested biological primitives.

## Features

### Sequence Manipulation
*   **Reverse Complement**: Generates reverse complements for DNA/RNA sequences.
*   **Translation**: Translates nucleotide sequences to protein sequences using standard genetic codes.

### Analysis & Simulation
*   **Global Alignment**: Performs pairwise sequence alignment using the Needleman-Wunsch algorithm with configurable scoring matrices.
*   **Secondary Structure Prediction**: Predicts RNA/DNA folding and calculates Minimum Free Energy (MFE) using dynamic programming approaches (Zuker).
*   **Sequence Verification**: Validates sequence properties including nucleic acid type (DNA/RNA) and palindromicity.

### Synthetic Biology
*   **Codon Optimization**: Optimizes coding sequences for expression in specific host organisms (e.g., *E. coli*) based on codon usage tables.
*   **Primer Design**: Automates the generation of forward and reverse primers for PCR amplification.

### Utilities
*   **SeqHash**: Generates strictly defined, reproducible hashes for biological sequences to ensure identifier consistency.
*   **Random Sequence Generation**: Produces pseudo-random DNA, RNA, or Protein sequences for testing and simulation purposes.

## Installation

### Prerequisites
*   **Go**: Version 1.18 or higher.
*   **Node.js**: Version 18 or higher.

### Local Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/chiragroy2007/polymerase-go.git
    cd polymerase-go
    ```

2.  **Initialize Backend**
    The backend runs on port 8080.
    ```bash
    go mod tidy
    go run dev_server.go
    ```

3.  **Initialize Frontend**
    Open a new terminal session. The frontend runs on port 3000.
    ```bash
    npm install
    npm run dev
    ```

4.  **Access Application**
    Navigate to `http://localhost:3000` in a web browser.

## Technical Stack

*   **Language**: Go (Backend), TypeScript (Frontend)
*   **Framework**: Next.js 14
*   **Styling**: Tailwind CSS
*   **Bioinformatics Library**: `bebop/poly`

## License

This project is open-source and available under the MIT License.

---

**Built by Chirag** | **Powered by Poly** | **TeamNeuron Tools**
