"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {isHome && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 mb-12">

                        {/* TeamNeuron Tools Section */}
                        <div className="md:pr-8">
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                                TeamNeuron Tools
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                A subpart of <a href="https://www.teamneuron.blog" target="_blank" rel="noreferrer" className="text-gray-900 font-medium hover:underline">TeamNeuron</a>.
                                We provide open-source computational tools designed to accelerate workflows for students and learners in biological engineering.
                            </p>
                        </div>

                        {/* Vertical Divider (Desktop Only) */}
                        <div className="hidden md:block absolute left-1/2 mt-2 h-32 w-px bg-gray-200 transform -translate-x-1/2"></div>

                        {/* About Developer Section */}
                        <div className="md:pl-8 md:border-l md:border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                                About Developer
                            </h3>
                            <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                                <p>
                                    <span className="font-semibold text-gray-900">Chirag</span>: An 18yo passionate programmer and research student.
                                </p>
                                <p>
                                    Know More at <a href="https://www.chirag404.me" target="_blank" rel="noreferrer" className="text-gray-900 font-medium hover:underline">www.chirag404.me</a>.
                                </p>
                                <p className="pt-2 text-gray-500 text-xs">
                                    Support the project? <a href="https://github.com/chiragroy2007/polymerase-go" target="_blank" rel="noreferrer" className="text-gray-900 hover:underline font-medium">Star us on GitHub</a> (for free!).
                                </p>
                            </div>
                        </div>

                    </div>
                )}

                {/* Copyright / Bottom Line */}
                <div className={`text-center text-xs text-gray-400 ${isHome ? "pt-8 border-t border-gray-100" : ""}`}>
                    &copy; {new Date().getFullYear()} TeamNeuron Tools. Open Source.
                </div>
            </div>
        </footer>
    );
}
