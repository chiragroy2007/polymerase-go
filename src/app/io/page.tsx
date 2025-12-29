"use client";

import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

export default function IOPage() {
    const [inputContent, setInputContent] = useState("");
    const [outputContent, setOutputContent] = useState("");
    const [inputFormat, setInputFormat] = useState("fasta");
    const [outputFormat, setOutputFormat] = useState("genbank");
    const [error, setError] = useState<string | null>(null);

    const handleRun = async () => {
        setError(null);
        setOutputContent("");

        try {
            const response = await fetch("/api/io", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    input_content: inputContent,
                    input_format: inputFormat,
                    output_format: outputFormat,
                }),
            });

            const data = await response.json();
            if (!response.ok || data.error) {
                throw new Error(data.error || "Conversion failed");
            }

            setOutputContent(data.output_content);
            return data.output_content; // ToolLayout might handle this
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            throw err;
        }
    };

    // Helper to handle file uploads
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setInputContent(text);
        };
        reader.readAsText(file);
    };

    return (
        <ToolLayout
            title="Universal Converter"
            description="Convert between biological file formats (FASTA, GenBank, PolyJSON)."
            inputLabel="Input Sequence"
            inputPlaceholder="Paste your file content here..."
            onRun={handleRun}
            outputLabel="Converted Output"
            extraControls={
                <div className="grid grid-cols-2 gap-6 mt-4">
                    {/* Input Controls */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Input Format</label>
                        <select
                            value={inputFormat}
                            onChange={(e) => setInputFormat(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="fasta">FASTA</option>
                            <option value="genbank">GenBank</option>
                            <option value="json">PolyJSON</option>
                            <option value="fastq">FASTQ</option>
                            <option value="gff">GFF</option>
                            <option value="uniprot">Uniprot XML (Input Only)</option>
                        </select>

                        <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Or Upload File</label>
                            <input type="file" onChange={handleFileUpload} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        </div>
                    </div>

                    {/* Output Controls */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Output Format</label>
                        <select
                            value={outputFormat}
                            onChange={(e) => setOutputFormat(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="fasta">FASTA</option>
                            <option value="genbank">GenBank</option>
                            <option value="json">PolyJSON</option>
                            <option value="fastq">FASTQ</option>
                            <option value="gff">GFF</option>
                        </select>
                    </div>
                </div>
            }
            customResult={
                outputContent ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-sm font-medium text-gray-500">Result ({outputFormat.toUpperCase()})</span>
                            <button
                                onClick={() => {
                                    const blob = new Blob([outputContent], { type: "text/plain" });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = `converted.${outputFormat === 'json' ? 'json' : outputFormat === 'genbank' ? 'gb' : 'fasta'}`;
                                    a.click();
                                }}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                                Download File
                            </button>
                        </div>
                        <pre className="bg-gray-50 p-4 rounded-md border border-gray-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap text-gray-800 max-h-[500px]">
                            {outputContent}
                        </pre>
                    </div>
                ) : null
            }
        >
            <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">How to Use</h2>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Universal Converter</h3>
                        <p>
                            Robustly converts between common biological formats.
                            Uses <code>poly/io</code> for reliable parsing and generation.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Formats:</strong> FASTA, GenBank, GFF, PolyJSON, FASTQ.</li>
                            <li><strong>Uniprot:</strong> Supports Uniprot XML as input (converts to FASTA/JSON).</li>
                            <li><strong>Upload:</strong> Drag and drop or paste your sequence file.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </ToolLayout>
    );
}
