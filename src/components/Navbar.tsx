"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const categories = [
        {
            name: "Analysis",
            links: [
                { name: "Search", href: "/search" },
                { name: "Align", href: "/align" },
                { name: "Checks", href: "/checks" },
                { name: "Alphabet", href: "/alphabet" },
                { name: "Fold", href: "/fold" },
                { name: "SeqHash", href: "/seqhash" },
            ],
        },
        {
            name: "Manipulation",
            links: [
                { name: "Transform", href: "/transform" },
                { name: "Translate", href: "/translate" },
                { name: "Random", href: "/random" },
            ],
        },
        {
            name: "SynBio",
            links: [
                { name: "Clone", href: "/clone" },
                { name: "Optimize", href: "/codon-optimize" },
                { name: "Primers", href: "/primer-design" },
            ],
        },
        {
            name: "Utilities",
            links: [
                { name: "Converter", href: "/io" },
            ],
        },
    ];

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14">
                    {/* Logo and Desktop Nav */}
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-gray-900 tracking-tight">
                                <img
                                    src="https://raw.githubusercontent.com/bebop/presskit/main/gopher.png"
                                    alt="Poly Logo"
                                    className="w-6 h-6 object-contain"
                                />
                                Polymerase-go
                            </Link>
                        </div>

                        <div className="hidden md:ml-8 md:flex md:space-x-8">
                            {categories.map((category) => (
                                <div key={category.name} className="relative group flex items-center">
                                    <button className="text-gray-500 group-hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors">
                                        {category.name}
                                        <svg className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute left-0 top-full mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50">
                                        <div className="py-1">
                                            {category.links.map((link) => (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${pathname === link.href ? "bg-gray-50 font-medium text-indigo-600" : ""}`}
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side Icons */}
                    <div className="hidden md:flex items-center">
                        <a
                            href="https://github.com/bebop/poly"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="View on GitHub"
                        >
                            <span className="sr-only">GitHub</span>
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex items-center md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            type="button"
                            className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {mobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {categories.map((category) => (
                            <div key={category.name} className="space-y-1">
                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    {category.name}
                                </div>
                                {category.links.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium ${pathname === link.href
                                                ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                                                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
