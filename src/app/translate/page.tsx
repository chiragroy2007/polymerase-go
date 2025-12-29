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
        >
            <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">How to Use</h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">DNA Translation</h3>
                        <p>
                            Converts a DNA sequence into an Amino Acid sequence using the standard genetic code.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Frame:</strong> Translates from the first base (+1 frame).</li>
                            <li><strong>Stop Codons:</strong> Marked as <code>*</code>.</li>
                            <li><strong>Ambiguities:</strong> Handles N and other ambiguous bases gracefully.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
