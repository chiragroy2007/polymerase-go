"use client";

import ToolLayout from "../../components/ToolLayout";

export default function AlphabetPage() {
  const handleRun = async (sequence: string, customSymbols?: string) => {
    const response = await fetch("/api/alphabet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sequence: sequence.toUpperCase(), // Normalize input
        custom_symbols: customSymbols
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to validate sequence");
    }

    const data = await response.json();

    let output = "Validation Results:\n\n";

    // Helper to format result
    const formatResult = (label: string, res: any) => {
      const status = res.valid ? "VALID" : "INVALID";
      const details = res.valid ? "" : ` (${res.error})`;
      return `[${status}] ${label}${details}`;
    };

    output += formatResult("DNA", data.is_dna) + "\n";
    output += formatResult("RNA", data.is_rna) + "\n";
    output += formatResult("Protein", data.is_protein) + "\n";

    if (data.has_custom) {
      output += "\nCustom Alphabet:\n";
      output += formatResult("Custom", data.is_custom);
    }

    return output;
  };

  return (
    <div className="space-y-8">
      <ToolLayout
        title="Alphabet Validator"
        description="Validate biological sequences against standard (DNA, RNA, Protein) and custom alphabets."
        inputLabel="Sequence"
        inputPlaceholder="e.g. ATCG..."
        secondaryInputLabel="Custom Symbols (Space separated)"
        secondaryInputPlaceholder="e.g. 0 1 or A C G T"
        onRun={handleRun}
        outputLabel="Validation Report"
      />

      <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">How it Works</h2>
        <div className="prose prose-sm text-gray-600 space-y-4">
          <p>
            This tool validates whether your sequence strictly adheres to specific biological alphabets.
            It checks every partial character against the allowed set of symbols.
          </p>

          <div>
            <h3 className="text-md font-semibold text-gray-800">Standard Alphabets</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>DNA</strong>: Checks for <code>A, C, G, T</code> (Strict). Ambiguous chars (N, R, Y etc) are invalid.</li>
              <li><strong>RNA</strong>: Checks for <code>A, C, G, U</code>.</li>
              <li><strong>Protein</strong>: Checks for standard 20 amino acids.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-800">Custom Alphabet</h3>
            <p className="mt-1">
              You can define your own alphabet by providing space-separated symbols in the "Custom Symbols" field.
              For example, entering <code>0 1</code> will validate that your sequence contains <strong>only</strong> those digits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
