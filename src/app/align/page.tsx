'use client';

import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';

export default function AlignPage() {
    const [sequenceB, setSequenceB] = useState("");
    const [mode, setMode] = useState("global");

    const handleRun = async (input: string) => {
        if (!sequenceB) {
            throw new Error("Please provide a second sequence for alignment.");
        }

        const res = await fetch('/api/align', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sequence_a: input, sequence_b: sequenceB, mode: mode }),
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
            description="Perform global or local alignment between two sequences."
            inputLabel="Sequence A"
            inputPlaceholder="AGCT..."
            onRun={handleRun}
            outputLabel="Alignment Result"
            extraControls={
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Alignment Mode</label>
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="global">Global (Needleman-Wunsch)</option>
                            <option value="local">Local (Smith-Waterman)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sequence B</label>
                        <textarea
                            value={sequenceB}
                            onChange={(e) => setSequenceB(e.target.value)}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            placeholder="Enter second sequence..."
                        />
                    </div>
                </div>
            }
        >
            <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">How to Use</h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Global Alignment (Needleman-Wunsch)</h3>
                        <p>
                            Best for aligning sequences of roughly equal length from end-to-end.
                            It attempts to match every residuary in both sequences.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Use case:</strong> Comparing homologous genes or proteins.</li>
                            <li><strong>Algorithm:</strong> Maximizes the total score of the alignment matrix.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Local Alignment (Smith-Waterman)</h3>
                        <p>
                            Finds the most similar region (substring) between two sequences.
                            Useful for finding motifs or domains within larger sequences.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Use case:</strong> Finding a gene in a genome or a domain in a protein.</li>
                            <li><strong>Algorithm:</strong> Allows the alignment to start and end anywhere.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
