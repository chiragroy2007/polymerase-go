"use client";

import ToolLayout from "../../components/ToolLayout";

export default function ChecksPage() {
    const handleRun = async (input: string) => {
        const response = await fetch("/api/checks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sequence: input }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to check sequence");
        }

        const data = await response.json();
        return `Is DNA: ${data.is_dna}\nIs RNA: ${data.is_rna}\nIs Palindromic: ${data.is_palindromic}`;
    };

    return (
        <ToolLayout
            title="Sequence Checks"
            description="Check if a sequence is DNA, RNA, or palindromic."
            inputLabel="Sequence"
            inputPlaceholder="ATGC..."
            onRun={handleRun}
            outputLabel="Results"
        />
    );
}
