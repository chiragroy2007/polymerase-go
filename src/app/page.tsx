import Link from "next/link";

export default function Home() {
  const tools = [
    {
      name: "Reverse Complement",
      description: "Generate the reverse complement of a DNA sequence.",
      href: "/revcomp",
      category: "Sequence Manipulation",
    },
    {
      name: "Codon Optimization",
      description: "Optimize DNA sequences for expression in specific organisms.",
      href: "/codon-optimize",
      category: "Synthetic Biology",
    },
    {
      name: "Sequence Alignment",
      description: "Perform global alignment between two sequences.",
      href: "/align",
      category: "Analysis",
    },
    {
      name: "Translation",
      description: "Translate DNA sequences into protein sequences.",
      href: "/translate",
      category: "Sequence Manipulation",
    },
    {
      name: "Primer Design",
      description: "Design forward and reverse primers for PCR.",
      href: "/primer-design",
      category: "Synthetic Biology",
    },
    {
      name: "Random Generator",
      description: "Generate random DNA, RNA, or Protein sequences.",
      href: "/random",
      category: "Utilities",
    },
    {
      name: "SeqHash",
      description: "Generate unique hashes for biological sequences.",
      href: "/seqhash",
      category: "Utilities",
    },
    {
      name: "Sequence Checks",
      description: "Check properties like DNA/RNA type and palindromicity.",
      href: "/checks",
      category: "Analysis",
    },
    {
      name: "Folding",
      description: "Predict secondary structure and minimum free energy.",
      href: "/fold",
      category: "Analysis",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Available Tools
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-gray-500">
          Polymerase-Go delivers advanced sequence analysis through a fast, Go-powered backend and a clean, accessible UI. A minimal, professional interface for running research-level DNA/RNA/protein workflows effortlessly. Designed for students, researchers, and engineers who need accurate, reliable biological computation on demand.
        </p>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tool Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Open</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tools.map((tool) => (
                    <tr key={tool.href} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link href={tool.href} className="hover:underline">
                          {tool.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {tool.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tool.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={tool.href} className="text-slate-900 hover:text-slate-700">
                          Open &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
