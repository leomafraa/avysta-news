import type { Metadata } from "next";
import { Suspense } from "react";
import { FornecedoresClient } from "./FornecedoresClient";
import { RefreshIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Fornecedores e Prestadores | Avysta News",
  description:
    "Diretório de construtoras, fornecedores de materiais e prestadores de serviços para construção civil no Brasil. Encontre parceiros verificados por estado e categoria.",
  keywords: [
    "fornecedores construção civil",
    "construtoras brasil",
    "materiais de construção",
    "prestadores de serviços obra",
    "empreiteiras",
    "engenharia civil",
  ],
};

export default function FornecedoresPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] gap-2 text-gray-400">
          <RefreshIcon className="w-5 h-5 animate-spin" />
          <span className="text-sm">Carregando diretório...</span>
        </div>
      }
    >
      <FornecedoresClient />
    </Suspense>
  );
}
