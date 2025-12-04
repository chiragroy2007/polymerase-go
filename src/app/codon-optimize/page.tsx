'use client';

import ToolLayout from '@/components/ToolLayout';

export default function CodonOptimizePage() {
    const handleRun = async (input: string) => {
        const res = await fetch('/api/codon-optimize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ protein_sequence: input, organism: 'E. coli' }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to optimize sequence');
        }

        const data = await res.json();
        return data.dna;
    };

    return (
        <ToolLayout
            title="Codon Optimization"
            description="Optimize a protein sequence for expression in E. coli."
            inputLabel="Protein Sequence"
            inputPlaceholder="e.g. MKT..."
            onRun={handleRun}
            outputLabel="Optimized DNA Sequence"
        />
    );
}
