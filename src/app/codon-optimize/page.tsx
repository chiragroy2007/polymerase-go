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
        >
            <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">How to Use</h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Codon Optimization</h3>
                        <p>
                            Optimizes a protein sequence for efficient expression in a specific host organism.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Host:</strong> Currently defaults to <em>E. coli</em>.</li>
                            <li><strong>Strategy:</strong> Selects codons with higher tRNA abundance in the host to prevent ribosomal stalling.</li>
                            <li><strong>Output:</strong> A DNA sequence encoding your protein.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
