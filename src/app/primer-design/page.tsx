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
        >
            <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">How to Use</h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Primer Design</h3>
                        <p>
                            Generates forward and reverse primers for PCR amplification.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Target:</strong> Wraps the entire input sequence.</li>
                            <li><strong>Tm Calculation:</strong> Ensures melting temperatures are close to optimal (~55-60°C).</li>
                            <li><strong>GC Clamp:</strong> Attempts to end primers with C or G for stability.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
