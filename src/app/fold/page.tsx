"use client";

import ToolLayout from "../../components/ToolLayout";

export default function FoldPage() {
    const handleRun = async (input: string) => {
        const response = await fetch("/api/fold", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sequence: input, temperature: 37.0 }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fold sequence");
        }

        const data = await response.json();
        return `Minimum Free Energy: ${data.minimum_free_energy} kcal/mol\nStructure: ${data.structure}`;
    };

    return (
        <ToolLayout
            title="RNA/DNA Folding"
            description="Predict the secondary structure and minimum free energy of a sequence (Zuker algorithm)."
            inputLabel="Sequence"
            inputPlaceholder="ATGC..."
            onRun={handleRun}
            outputLabel="Folding Result"
        />
    );
}
