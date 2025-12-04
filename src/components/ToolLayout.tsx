'use client';

import { useState } from 'react';

interface ToolLayoutProps {
    title: string;
    description: string;
    inputLabel: string;
    inputPlaceholder: string;
    onRun: (input: string, secondaryInput?: string) => Promise<string | Record<string, unknown>>;
    outputLabel?: string;
    secondaryInputLabel?: string;
    secondaryInputPlaceholder?: string;
}

export default function ToolLayout({
    title,
    description,
    inputLabel,
    inputPlaceholder,
    onRun,
    outputLabel = "Output",
    secondaryInputLabel,
    secondaryInputPlaceholder,
}: ToolLayoutProps) {
    const [input, setInput] = useState('');
    const [secondaryInput, setSecondaryInput] = useState('');
    const [output, setOutput] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRun = async () => {
        if (!input.trim()) {
            setError("Please enter an input sequence.");
            return;
        }

        setLoading(true);
        setError(null);
        setOutput(null);

        try {
            const result = await onRun(input, secondaryInput);
            if (typeof result === 'string') {
                setOutput(result);
            } else {
                setOutput(JSON.stringify(result, null, 2));
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 border-b border-gray-200 pb-5">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="mt-2 text-sm text-gray-500">{description}</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {inputLabel}
                        </label>
                        <textarea
                            className="input-field h-40 resize-y font-mono text-sm"
                            placeholder={inputPlaceholder}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>

                    {secondaryInputLabel && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {secondaryInputLabel}
                            </label>
                            <input
                                type="text"
                                className="input-field font-mono text-sm"
                                placeholder={secondaryInputPlaceholder}
                                value={secondaryInput}
                                onChange={(e) => setSecondaryInput(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                        <button
                            onClick={handleRun}
                            disabled={loading}
                            className="btn-primary min-w-[100px] flex justify-center"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing
                                </span>
                            ) : 'Run Analysis'}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="px-6 py-4 bg-red-50 border-t border-red-100">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {output && (
                    <div className="bg-gray-50 border-t border-gray-200 p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {outputLabel}
                        </label>
                        <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto shadow-sm">
                            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">
                                {output}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
