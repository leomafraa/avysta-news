import type { Metadata } from "next";
import { CotacoesClient } from "@/app/cotacoes/CotacoesClient";

export const metadata: Metadata = {
  title: "Cotações de Materiais | Avysta Community",
  description:
    "Acompanhe a variação de preços dos principais insumos da construção civil no Brasil. Dados baseados no SINAPI e INCC-DI (Banco Central).",
  keywords: [
    "cotação materiais construção",
    "preço cimento",
    "preço vergalhão",
    "preço tijolo",
    "SINAPI",
    "INCC construção civil",
    "reajuste materiais construção",
  ],
};

export default function CotacoesPage() {
  return <CotacoesClient />;
}
