'use client';

import ToolLayout from '@/components/ToolLayout';

export default function PrimerDesignPage() {
    const handleRun = async (input: string) => {
        const res = await fetch('/api/primer-design', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sequence: input }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to design primers');
        }

        const data = await res.json();
        return `Forward Primer: ${data.forward_primer}\nReverse Primer: ${data.reverse_primer}`;
    };

    return (
        <ToolLayout
            title="Primer Design"
            description="Design forward and reverse primers for a DNA sequence."
            inputLabel="DNA Sequence"
            inputPlaceholder="e.g. ATGC... (min 20 bases)"
            onRun={handleRun}
            outputLabel="Primers"
        />
    );
}
