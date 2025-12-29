"use client";

import { useState } from 'react';
import ToolLayout from "../../components/ToolLayout";

export default function FoldPage() {
    const [temperature, setTemperature] = useState<number>(37);
    const [result, setResult] = useState<{ mfe: number; structure: string; type: string } | null>(null);

    const handleRun = async (input: string) => {
        setResult(null); // Clear previous result
        const response = await fetch("/api/fold", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sequence: input, temperature: Number(temperature) }),
        });

        const data = await response.json();
        if (!response.ok || data.error) {
            throw new Error(data.error || "Failed to fold sequence");
        }

        setResult({
            mfe: data.minimum_free_energy,
            structure: data.structure,
            type: data.type
        });

        return "Success"; // ToolLayout expects a string, but we handle display manually
    };

    return (
        <div className="space-y-8">
            <ToolLayout
                title="RNA/DNA Folding"
                description="Predict secondary structure and minimum free energy (Zuker algorithm)."
                inputLabel="Sequence"
                inputPlaceholder="ATGC..."
                onRun={handleRun}
                outputLabel="Folding Result"
                // Custom Controls
                extraControls={
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Temperature (°C)</label>
                        <input
                            type="number"
                            value={temperature}
                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>
                }
                // Custom Result Display
                customResult={
                    result ? (
                        <div className="space-y-4">
                            <div className="flex gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                                <span>Type: <span className="text-gray-900">{result.type}</span></span>
                                <span>MFE: <span className="text-gray-900">{result.mfe.toFixed(2)} kcal/mol</span></span>
                                <span>Temp: <span className="text-gray-900">{temperature}°C</span></span>
                            </div>

                            <div className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto font-mono text-sm leading-relaxed">
                                {result.structure}
                            </div>
                            <p className="text-xs text-gray-400">
                                Dot-bracket notation: <code>.</code> unpaired, <code>( )</code> paired.
                            </p>
                        </div>
                    ) : null
                }
            />

            {/* How It Works Guide */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-gray-900 mb-4">How it Works</h2>
                <div className="prose prose-sm text-gray-600 space-y-4">
                    <p>
                        This tool uses the <strong>Zuker recursive algorithm</strong> to predict the optimal secondary structure of a nucleic acid sequence.
                    </p>

                    <div>
                        <h3 className="text-md font-semibold text-gray-800">Key Concepts</h3>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li><strong>Minimum Free Energy (MFE)</strong>: The structure with the lowest stability energy (kcal/mol) is typically the most stable state in nature.</li>
                            <li><strong>Dot-Bracket Notation</strong>: A compact way to represent structure.
                                <ul className="pl-5 list-circle">
                                    <li><code>.</code> : Unpaired base</li>
                                    <li><code>( )</code> : Base pair (opening and closing)</li>
                                </ul>
                            </li>
                            <li><strong>Temperature</strong>: Folding stability is temperature-dependent. The default is 37°C (body temperature).</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
