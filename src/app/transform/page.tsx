"use client";

import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

export default function TransformPage() {
    const [moleculeType, setMoleculeType] = useState<"dna" | "rna">("dna");
    const [operation, setOperation] = useState("reverse_complement");
    const [result, setResult] = useState<any>(null);

    const handleRun = async (input: string) => {
        setResult(null);
        if (!input) throw new Error("Please enter a sequence.");

        const res = await fetch("/api/transform", {
            method: "POST",
            body: JSON.stringify({ sequence: input, operation, type: moleculeType }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setResult(data);
        return ""; // We use customResult for display
    };

    return (
        <ToolLayout
            title="Sequence Transform"
            description="Manipulate sequences and expand IUPAC ambiguities."
            inputLabel="Input Sequence"
            inputPlaceholder="e.g. ATGC or ATGRY..."
            onRun={handleRun}
            outputLabel="Result"
            extraControls={
                <div className="space-y-4">
                    {/* Molecule Type */}
                    <div>
                        <span className="block text-sm font-medium text-gray-700 mb-2">Molecule Type</span>
                        <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-indigo-600"
                                    name="moleculeType"
                                    value="dna"
                                    checked={moleculeType === "dna"}
                                    onChange={() => setMoleculeType("dna")}
                                />
                                <span className="ml-2">DNA</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-indigo-600"
                                    name="moleculeType"
                                    value="rna"
                                    checked={moleculeType === "rna"}
                                    onChange={() => setMoleculeType("rna")}
                                />
                                <span className="ml-2">RNA</span>
                            </label>
                        </div>
                    </div>

                    {/* Operation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
                        <select
                            value={operation}
                            onChange={(e) => setOperation(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="reverse_complement">Reverse Complement</option>
                            <option value="complement">Complement</option>
                            <option value="reverse">Reverse</option>
                            <option value="expand_variants">Expand IUPAC Variants</option>
                        </select>
                    </div>
                </div>
            }
            customResult={
                result ? (
                    <div className="bg-gray-50 rounded-md border border-gray-200">
                        {result.variants ? (
                            <div className="p-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Generated Variants ({result.variants.length})</h4>
                                <div className="max-h-60 overflow-y-auto font-mono text-sm bg-white p-2 border rounded">
                                    {result.variants.map((v: string, i: number) => (
                                        <div key={i} className="py-1 border-b border-gray-100 last:border-0">
                                            {v}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Transformed Sequence</h4>
                                <pre className="whitespace-pre-wrap break-all font-mono text-gray-900">
                                    {result.result}
                                </pre>
                            </div>
                        )}
                    </div>
                ) : null
            }
        >
            <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">How to Use</h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Basic Operations</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Reverse:</strong> Reverses the sequence string (e.g. <code>ATGC</code> → <code>CGTA</code>).</li>
                            <li><strong>Complement:</strong> Swaps bases with their pair (A↔T, G↔C). Handles RNA (A↔U).</li>
                            <li><strong>Reverse Complement:</strong> Reverse followed by Complement. Standard for analyzing the opposite strand.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Variant Expansion</h3>
                        <p className="mb-2">
                            Generates all possible unambiguous sequences from a sequence containing IUPAC ambiguity codes.
                        </p>
                        <div className="bg-gray-100 p-2 rounded text-xs font-mono">
                            <p>R = A or G</p>
                            <p>Y = C or T</p>
                            <p>N = Any</p>
                            {/* ... others */}
                        </div>
                        <p className="mt-2">
                            <em>Example:</em> <code>ATR</code> expands to <code>ATA</code> and <code>ATG</code>.
                        </p>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
