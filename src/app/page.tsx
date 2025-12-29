"use client";

import Link from "next/link";

export default function Home() {
  const categories = [
    {
      name: "Analysis",
      tools: [
        { name: "Sequence Search", description: "Advanced search (BWT) and comparison (Mash).", href: "/search" },
        { name: "Global & Local Align", description: "Needleman-Wunsch & Smith-Waterman alignment.", href: "/align" },
        { name: "Sequence Checks", description: "Validate GC content, palindromes, and more.", href: "/checks" },
        { name: "Alphabet Validator", description: "Strict validation against DNA/RNA/Protein tables.", href: "/alphabet" },
        { name: "Folding", description: "Predict secondary structures (MFE).", href: "/fold" },
        { name: "SeqHash", description: "Generate unique stable hashes for sequences.", href: "/seqhash" },
      ]
    },
    {
      name: "Manipulation",
      tools: [
        { name: "Sequence Transform", description: "Reverse, Complement, and IUPAC variant expansion.", href: "/transform" },
        { name: "Translation", description: "Translate DNA/RNA to Protein.", href: "/translate" },
        { name: "Random Generator", description: "Generate random biological sequences.", href: "/random" },
        { name: "Reverse Complement", description: "Simple reverse complement tool.", href: "/revcomp" },
      ]
    },
    {
      name: "Synthetic Biology",
      tools: [
        { name: "Golden Gate Assembly", description: "Simulate Type IIS restriction cloning.", href: "/clone" },
        { name: "Codon Optimization", description: "Optimize sequences for host expression.", href: "/codon-optimize" },
        { name: "Primer Design", description: "Create PCR primers with Tm calculation.", href: "/primer-design" },
      ]
    },
    {
      name: "Utilities",
      tools: [
        { name: "Universal Converter", description: "Convert FASTA, GenBank, FASTQ, GFF, PolyJSON.", href: "/io" },
      ]
    }
  ];

  return (
    <div className="space-y-12">
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-xl leading-6 font-semibold text-gray-900">
          Polymerase-Go Workbench
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          A high-performance suite of biological engineering tools running on a Go backend.
        </p>
      </div>

      <div className="grid gap-10">
        {categories.map((category) => (
          <div key={category.name}>
            <h4 className="text-lg font-medium text-gray-900 mb-4 px-2 border-l-4 border-indigo-500">
              {category.name}
            </h4>
            <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
              <ul role="list" className="divide-y divide-gray-200">
                {category.tools.map((tool) => (
                  <li key={tool.name}>
                    <Link href={tool.href} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-indigo-600 truncate">{tool.name}</p>
                          <p className="mt-1 flex items-center text-sm text-gray-500">
                            {tool.description}
                          </p>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
