"use client";

import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

export default function SearchPage() {
    const [activeTab, setActiveTab] = useState<"bwt" | "mash">("bwt");
    const [result, setResult] = useState<any>(null);

    const handleRun = async (input: string, secondaryInput?: string) => {
        setResult(null);

        if (activeTab === "bwt") {
            if (!secondaryInput) throw new Error("Please provide a search pattern.");

            const res = await fetch("/api/search", {
                method: "POST",
                body: JSON.stringify({ tool: "bwt", sequence: input, pattern: secondaryInput }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setResult({ type: 'bwt', ...data });
            return "Count: " + data.count; // Simple string return for standard output area
        } else {
            if (!secondaryInput) throw new Error("Please provide a second sequence.");

            const res = await fetch("/api/search", {
                method: "POST",
                body: JSON.stringify({ tool: "mash", sequence: input, sequence_b: secondaryInput }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setResult({ type: 'mash', ...data });
            return `Similarity: ${data.similarity}\nDistance: ${data.distance}`;
        }
    };

    return (
        <ToolLayout
            title="Search & Compare"
            description="Advanced sequence analysis tools."
            inputLabel={activeTab === "bwt" ? "Reference Sequence" : "Sequence A"}
            inputPlaceholder="Paste sequence..."
            secondaryInputLabel={activeTab === "bwt" ? "Search Pattern" : "Sequence B"}
            secondaryInputPlaceholder={activeTab === "bwt" ? "e.g. ATGC" : "Paste second sequence..."}
            onRun={handleRun}
            outputLabel="Results"
            extraControls={
                <div className="mb-6 space-y-4">
                    {/* Tabs */}
                    <div className="flex space-x-4 border-b">
                        <button
                            className={`py-2 px-4 font-medium ${activeTab === "bwt" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                            onClick={() => { setActiveTab("bwt"); setResult(null); }}
                        >
                            BWT Search
                        </button>
                        <button
                            className={`py-2 px-4 font-medium ${activeTab === "mash" ? "border-b-2 border-indigo-500 text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
                            onClick={() => { setActiveTab("mash"); setResult(null); }}
                        >
                            Mash Comparison
                        </button>
                    </div>
                    {/* Note: Inputs are handled by ToolLayoutMain, but we could add Mash params here if needed */}
                </div>
            }
            customResult={
                result?.type === 'bwt' && result.offsets ? (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Occurrences</h4>
                                <p className="text-2xl font-bold text-gray-900">{result.count}</p>
                            </div>
                            {result.offsets.length > 0 && result.offsets[0] !== -1 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Positions (0-indexed)</h4>
                                    <div className="mt-1 max-h-32 overflow-y-auto text-sm text-gray-700 font-mono break-all">
                                        [{result.offsets.join(", ")}]
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : result?.type === 'mash' ? (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Similarity</h4>
                                <p className="text-2xl font-bold text-indigo-600">{(result.similarity * 100).toFixed(2)}%</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Distance</h4>
                                <p className="text-2xl font-bold text-gray-900">{result.distance?.toFixed(4)}</p>
                            </div>
                        </div>
                    </div>
                ) : null
            }
        >
            <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">How it Works</h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">BWT Search (Burrows-Wheeler Transform)</h3>
                        <p>
                            The BWT is a powerful algorithm used for compressing and indexing genomic data.
                            It allows us to efficiently <strong>count</strong> and <strong>locate</strong> short patterns (substrings)
                            within a massive reference sequence without scanning the whole file linearly.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Input:</strong> A reference sequence (e.g. a genome or gene).</li>
                            <li><strong>Pattern:</strong> The subsequence you want to find.</li>
                            <li><strong>Output:</strong> Number of occurrences and their 0-indexed positions.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Mash Comparison (MinHash)</h3>
                        <p>
                            Mash uses MinHash sketching to rapidly estimate the <strong>Jaccard distance</strong> and <strong>Similarity</strong> between two sequences.
                            Instead of aligning every base, it compares random samples (hashes) of K-mers.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Similarity:</strong> (0.0 to 1.0) Approximation of how much genetic material is shared.</li>
                            <li><strong>Distance:</strong> (0.0 to 1.0) Inverse of similarity, useful for clustering.</li>
                            <li><strong>Efficiency:</strong> Extremely fast for comparing large sequences (like bacterial genomes).</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
