'use client';

import ToolLayout from '@/components/ToolLayout';

export default function TranslatePage() {
    const handleRun = async (input: string) => {
        const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sequence: input }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to translate sequence');
        }

        const data = await res.json();
        return data.protein;
    };

    return (
        <ToolLayout
            title="Translation"
            description="Translate a DNA sequence into a protein sequence."
            inputLabel="DNA Sequence"
            inputPlaceholder="e.g. ATGC..."
            onRun={handleRun}
            outputLabel="Protein Sequence"
        />
    );
}
