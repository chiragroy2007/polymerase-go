'use client';

import ToolLayout from '@/components/ToolLayout';

export default function AlignPage() {
    const handleRun = async (input: string, secondaryInput?: string) => {
        if (!secondaryInput) {
            throw new Error("Please provide a second sequence for alignment.");
        }

        const res = await fetch('/api/align', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sequence_a: input, sequence_b: secondaryInput }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to align sequences');
        }

        const data = await res.json();
        return `Score: ${data.score}\n\n${data.alignment}`;
    };

    return (
        <ToolLayout
            title="Sequence Alignment"
            description="Perform global alignment between two DNA/Protein sequences."
            inputLabel="Sequence A"
            inputPlaceholder="e.g. ATGC..."
            secondaryInputLabel="Sequence B"
            secondaryInputPlaceholder="e.g. ATGG..."
            onRun={handleRun}
            outputLabel="Alignment Result"
        />
    );
}
