"use client";

import ToolLayout from "../../components/ToolLayout";

export default function SeqHashPage() {
    const handleRun = async (input: string) => {
        const response = await fetch("/api/seqhash", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sequence: input, type: "DNA", circular: false, double_stranded: false }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to hash sequence");
        }

        const data = await response.json();
        return data.hash;
    };

    return (
        <ToolLayout
            title="Sequence Hashing"
            description="Generate a unique hash for a DNA sequence using the SeqHash algorithm."
            inputLabel="DNA Sequence"
            inputPlaceholder="ATGC..."
            onRun={handleRun}
        >
            <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">How to Use</h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">SeqHash Algorithm</h3>
                        <p>
                            Generates a consistent, collision-resistant identifier for your sequence.
                            Useful for database deduplication.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Stable:</strong> The hash is deterministic.</li>
                            <li><strong>Algorithm:</strong> Uses SHA-256 with specific normalization (e.g. upper-casing).</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
