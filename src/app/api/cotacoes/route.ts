import { NextResponse } from "next/server";
import {
  fetchINCCFromBCB,
  getStaticINCCFallback,
  buildMaterialsWithPrices,
} from "@/services/priceService";
import { cache, CACHE_TTL } from "@/lib/cache";
import type { CotacoesApiResponse } from "@/types/prices";

const CACHE_KEY = "cotacoes_prices";

export async function GET() {
  try {
    const cached = cache.get<CotacoesApiResponse>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
      });
    }

    // Fetch INCC from Banco Central do Brasil
    let incc;
    try {
      incc = await fetchINCCFromBCB();
    } catch (err) {
      console.warn("[Cotacoes] BCB API unavailable, using fallback data:", err);
      incc = getStaticINCCFallback();
    }

    const materials = buildMaterialsWithPrices(incc);

    const response: CotacoesApiResponse = {
      materials,
      incc,
      cachedAt: new Date().toISOString(),
      source:
        "Preços de referência: SINAPI (Caixa/IBGE). Índice de variação: INCC-DI (BCB série 192).",
    };

    cache.set(CACHE_KEY, response, CACHE_TTL.PRICES);

    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (error) {
    console.error("[API /cotacoes] Error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cotações. Tente novamente." },
      { status: 500 }
    );
  }
}
