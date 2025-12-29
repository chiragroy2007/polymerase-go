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
    extraControls?: React.ReactNode; // For things like checkboxes, sliders, etc.
    customResult?: React.ReactNode;  // For complex result displays (charts, highlighted text)
    children?: React.ReactNode;      // For additional content (e.g. guides)
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
    extraControls,
    customResult,
    children,
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
                // If customResult is provided, we might ignore this or expect the parent to handle state.
                // But typically onRun returns data that the parent might use to set customResult.
                // For simple string returns, we setOutput.
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
            {/* Header */}
            <div className="border-b border-gray-200 pb-5 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
                <p className="mt-2 text-lg text-gray-500">{description}</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Input Section */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{inputLabel}</label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="input-field min-h-[120px] font-mono text-sm leading-relaxed"
                                placeholder={inputPlaceholder}
                            />
                        </div>

                        {secondaryInputLabel && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{secondaryInputLabel}</label>
                                <input
                                    type="text"
                                    value={secondaryInput}
                                    onChange={(e) => setSecondaryInput(e.target.value)}
                                    className="input-field font-mono text-sm"
                                    placeholder={secondaryInputPlaceholder}
                                />
                            </div>
                        )}

                        {extraControls}

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleRun}
                                disabled={loading}
                                className="btn-primary min-w-[120px]"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Running
                                    </span>
                                ) : (
                                    'Run Analysis'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-fade-in">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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

                {/* Output Section */}
                {(output || customResult) && (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h2 className="text-lg font-medium text-gray-900">{outputLabel}</h2>
                        </div>
                        <div className="p-6">
                            {customResult ? (
                                customResult
                            ) : (
                                <pre className="bg-gray-50 p-4 rounded-md border border-gray-200 font-mono text-sm overflow-x-auto whitespace-pre-wrap text-gray-800">
                                    {output}
                                </pre>
                            )}
                        </div>
                    </div>
                )}

                {/* Additional Content (Guides, etc.) */}
                {children}
            </div>
        </div>
    );
}
