import Link from "next/link";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Polymerase-go",
  description: "An open-source fast fork of 'poly' running on a webserver with go speed.",
  icons: {
    icon: "https://raw.githubusercontent.com/bebop/presskit/main/gopher.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 text-gray-900`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                <img
                  src="https://raw.githubusercontent.com/bebop/presskit/main/gopher.png"
                  alt="Poly Logo"
                  className="w-6 h-6 object-contain"
                />
                Polymerase-go
              </Link>
              <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
                <Link href="/revcomp" className="hover:text-gray-900 transition-colors">RevComp</Link>
                <Link href="/codon-optimize" className="hover:text-gray-900 transition-colors">Optimize</Link>
                <Link href="/align" className="hover:text-gray-900 transition-colors">Align</Link>
                <Link href="/translate" className="hover:text-gray-900 transition-colors">Translate</Link>
                <Link href="/primer-design" className="hover:text-gray-900 transition-colors">Primers</Link>
                <Link href="/random" className="hover:text-gray-900 transition-colors">Random</Link>
                <Link href="/seqhash" className="hover:text-gray-900 transition-colors">SeqHash</Link>
                <Link href="/checks" className="hover:text-gray-900 transition-colors">Checks</Link>
                <Link href="/fold" className="hover:text-gray-900 transition-colors">Fold</Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
            Built by Chirag, powered by <a href="https://github.com/bebop/poly" className="text-gray-700 hover:underline font-medium" target="_blank" rel="noreferrer">Poly</a>, under <span className="text-black font-semibold">TeamNeuron Tools</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
