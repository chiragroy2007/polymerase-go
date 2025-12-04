"use client";

import ToolLayout from "../../components/ToolLayout";

export default function RandomPage() {
    const handleRun = async (input: string, secondaryInput?: string) => {
        // Input format: "Type,Length,Seed" or just handle via separate inputs if ToolLayout supported it.
        // Since ToolLayout is simple, we'll parse the input string or just ask for specific format.
        // Better: Let's just use the input for Length (default DNA) for now to keep it simple as per "don't change complexity".
        // Or we can try to parse JSON from input if user wants advanced options.
        // Let's stick to a simple default: Generate DNA of given length.

        // Actually, let's make it slightly smarter.
        // We'll use the input as length.
        const length = parseInt(input) || 100;

        const response = await fetch("/api/random", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ type: "DNA", length: length }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to generate sequence");
        }

        const data = await response.json();
        return data.sequence;
    };

    return (
        <ToolLayout
            title="Random Sequence Generator"
            description="Generate random DNA sequences."
            inputLabel="Length (default 100)"
            inputPlaceholder="100"
            onRun={handleRun}
            outputLabel="Generated Sequence"
        />
    );
}
