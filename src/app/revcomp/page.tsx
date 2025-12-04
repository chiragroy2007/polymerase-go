'use client';

import ToolLayout from '@/components/ToolLayout';

export default function RevCompPage() {
    const handleRun = async (input: string) => {
        const res = await fetch('/api/revcomp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sequence: input }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to process sequence');
        }

        const data = await res.json();
        return data.reverse_complement;
    };

    return (
        <ToolLayout
            title="Reverse Complement"
            description="Enter a DNA sequence to generate its reverse complement."
            inputLabel="DNA Sequence"
            inputPlaceholder="e.g. ATGC..."
            onRun={handleRun}
            outputLabel="Reverse Complement"
        />
    );
}
