import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <p className="text-7xl mb-6">🏗️</p>
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
        Ops! Página não encontrada
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
        A notícia ou página que você procura não existe ou foi removida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
