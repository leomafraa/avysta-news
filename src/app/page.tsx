import type { Metadata } from "next";
import { Suspense } from "react";
import { NewsGrid } from "@/components/NewsGrid";
import { RefreshIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Avysta News — Notícias de Construção Civil no Brasil",
  description:
    "Acompanhe as últimas notícias sobre construção civil, mercado imobiliário, materiais, infraestrutura e tecnologia no Brasil.",
};

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero section */}
      <section className="mb-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Construção Civil{" "}
              <span className="text-brand-500">em Foco</span>
            </h1>
            <p className="mt-2 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
              As principais notícias do setor — materiais, mercado, infraestrutura, financiamento e muito mais.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 dark:text-gray-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full font-medium text-xs border border-green-200 dark:border-green-800">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Atualização automática
            </span>
          </div>
        </div>
      </section>

      {/* News grid with search + filters */}
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-gray-400 py-12 justify-center">
            <RefreshIcon className="w-5 h-5 animate-spin" />
            <span className="text-sm">Carregando...</span>
          </div>
        }
      >
        <NewsGrid />
      </Suspense>
    </div>
  );
}
