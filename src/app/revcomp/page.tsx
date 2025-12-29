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
        >
            <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">How to Use</h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Reverse Complement</h3>
                        <p>
                            Generates the reverse complement of a DNA sequence.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Reverse:</strong> Reverses the order of the sequence (5'&rarr;3' becomes 3'&rarr;5').</li>
                            <li><strong>Complement:</strong> Swaps bases (A&rarr;T, C&rarr;G, etc.).</li>
                            <li><strong>Ambiguity:</strong> Standard IUPAC codes are supported.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
