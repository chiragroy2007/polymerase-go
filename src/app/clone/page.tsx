"use client";

import { useState } from 'react';

type Part = {
    id: number;
    sequence: string;
    circular: boolean;
};

export default function ClonePage() {
    const [parts, setParts] = useState<Part[]>([
        { id: 1, sequence: '', circular: false },
        { id: 2, sequence: '', circular: false }
    ]);
    const [enzyme, setEnzyme] = useState('BsaI');
    const [results, setResults] = useState<string[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Add a new empty part
    const addPart = () => {
        setParts([...parts, { id: Date.now(), sequence: '', circular: false }]);
    };

    // Update a specific part
    const updatePart = (id: number, field: keyof Part, value: any) => {
        setParts(parts.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    // Remove a part (if more than 2)
    const removePart = (id: number) => {
        if (parts.length > 2) {
            setParts(parts.filter(p => p.id !== id));
        }
    };

    const handleSimulate = async () => {
        // Basic frontend validation
        if (parts.some(p => !p.sequence.trim())) {
            setError("All parts must have a sequence.");
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const payload = {
                parts: parts.map(({ sequence, circular }) => ({ sequence, circular })),
                enzyme_name: enzyme
            };

            const res = await fetch('/api/clone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Simulation failed");

            if (data.results && data.results.length > 0) {
                setResults(data.results);
            } else {
                setResults([]); // No assembly found
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-5">
                <h1 className="text-2xl font-bold text-gray-900">Golden Gate Assembly</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Simulate restriction enzyme cloning with multiple parts. Supports BsaI, BbsI, and BtgZI.
                </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assembly Enzyme</label>
                        <select
                            value={enzyme}
                            onChange={(e) => setEnzyme(e.target.value)}
                            className="input-field max-w-xs"
                        >
                            <option value="BsaI">BsaI (GGTCTC)</option>
                            <option value="BbsI">BbsI (GAAGAC)</option>
                            <option value="BtgZI">BtgZI (GCGATG)</option>
                        </select>
                    </div>
                    <button onClick={addPart} className="btn-secondary text-sm">
                        + Add Part
                    </button>
                </div>

                {/* Parts List */}
                <div className="space-y-4">
                    {parts.map((part, index) => (
                        <div key={part.id} className="flex gap-4 items-start p-4 bg-gray-50 rounded-md border border-gray-100">
                            <span className="pt-2 text-sm font-bold text-gray-400">#{index + 1}</span>

                            <div className="flex-1">
                                <textarea
                                    className="input-field font-mono text-sm h-20 resize-y"
                                    placeholder="Sequence (e.g. ATCG...)"
                                    value={part.sequence}
                                    onChange={(e) => updatePart(part.id, 'sequence', e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2 items-center pt-1">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={part.circular}
                                        onChange={(e) => updatePart(part.id, 'circular', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    Circular
                                </label>

                                {parts.length > 2 && (
                                    <button
                                        onClick={() => removePart(part.id)}
                                        className="text-red-400 hover:text-red-600 p-1"
                                        title="Remove part"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Run Button */}
                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                        onClick={handleSimulate}
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Simulating...' : 'Simulate Assembly'}
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="px-6 py-4 bg-red-50 border-t border-red-100 rounded-md">
                    <h3 className="text-sm font-bold text-red-800">Error</h3>
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Results Display */}
            {results && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Assembly Results</h2>
                    {results.length === 0 ? (
                        <p className="text-gray-500 italic">No valid circular assemblies found.</p>
                    ) : (
                        <div className="space-y-4">
                            {results.map((seq, i) => (
                                <div key={i} className="bg-white p-4 rounded border border-gray-200 shadow-sm overflow-x-auto">
                                    <div className="text-xs font-semibold text-gray-500 mb-1">Construct {i + 1} ({seq.length} bp)</div>
                                    <pre className="text-sm font-mono text-gray-800">{seq}</pre>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* How It Works Guide */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">How it Works</h2>
                <div className="prose prose-sm text-gray-600 space-y-4">
                    <p>
                        <strong>Golden Gate Assembly</strong> is a method to assemble multiple DNA parts into a single valid circular construct using Type IIS restriction enzymes.
                    </p>

                    <div>
                        <h3 className="text-md font-semibold text-gray-800">Key Concepts</h3>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li><strong>Type IIS Enzymes</strong>: Enzymes like <code>BsaI</code> cut outside their recognition site, creating custom "sticky ends" (overhangs).</li>
                            <li><strong>Parts</strong>: DNA fragments that have compatible overhangs. When cut and ligated, they assemble in a specific order.</li>
                            <li><strong>One-Pot Reaction</strong>: Digestion and ligation happen simultaneously. The tool simulates this process to find all valid circular outcomes.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* How to Use Guide */}
            <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">How to Use</h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Golden Gate Simulation</h3>
                        <p>
                            Simulates the digestion and ligation process of Type IIS restriction enzymes (BsaI, BbsI, BtgZI).
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Parts:</strong> Define multiple DNA parts. Can be linear or circular.</li>
                            <li><strong>Enzyme:</strong> Select the enzyme used for the reaction.</li>
                            <li><strong>Logic:</strong> The tool finds recognition sites, cuts, and attempts to assemble compatible overhangs.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                        <ol className="list-decimal pl-5 space-y-1 mt-2">
                            <li><strong>Select Enzyme</strong>: Choose the enzyme your parts are designed for (e.g., BsaI).</li>
                            <li><strong>Add Parts</strong>: Input your DNA sequences. Mark them as <strong>Circular</strong> if they are plasmids.</li>
                            <li><strong>Simulate</strong>: Click run to see if your parts successfully assemble into a circular plasmid.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
