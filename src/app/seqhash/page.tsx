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
            outputLabel="SeqHash"
        />
    );
}
