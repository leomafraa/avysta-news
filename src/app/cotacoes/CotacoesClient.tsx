"use client";

import { useState, useEffect } from "react";
import { PriceCard } from "@/components/PriceCard";
import { PriceSparkline } from "@/components/PriceSparkline";
import { RefreshIcon } from "@/components/Icons";
import type { CotacoesApiResponse, MaterialCategory, MaterialWithPrice } from "@/types/prices";

const CATEGORIES: { value: MaterialCategory; label: string; emoji: string }[] = [
  { value: "todos",       label: "Todos",          emoji: "📦" },
  { value: "estrutura",   label: "Estrutura",       emoji: "🏗️" },
  { value: "alvenaria",   label: "Alvenaria",       emoji: "🧱" },
  { value: "cobertura",   label: "Cobertura",       emoji: "🏠" },
  { value: "instalacoes", label: "Instalações",     emoji: "⚡" },
  { value: "acabamento",  label: "Acabamento",      emoji: "🎨" },
];

function INCCPanel({ data }: { data: CotacoesApiResponse }) {
  const { incc } = data;
  const isHigh = incc.accumulated12m > 6;

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Left: INCC info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Índice Oficial
              </span>
              <span className="text-xs bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-semibold px-2 py-0.5 rounded-full">
                INCC-DI · BCB
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Índice Nacional de Custo da Construção
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
              Calculado pela FGV e divulgado pelo Banco Central. Mede a variação de custo
              da construção civil no Brasil — referência oficial para reajuste de contratos.
            </p>

            {/* Metrics */}
            <div className="mt-5 flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Variação mensal</p>
                <p className={`text-3xl font-extrabold ${incc.latest > 0.5 ? "text-red-500" : "text-gray-900 dark:text-white"}`}>
                  +{fmt(incc.latest)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Acumulado 12 meses</p>
                <p className={`text-3xl font-extrabold ${isHigh ? "text-red-500" : "text-amber-500"}`}>
                  +{fmt(incc.accumulated12m)}%
                </p>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Evolução 12 meses</p>
                <PriceSparkline
                  data={incc.history}
                  width={140}
                  height={44}
                  color={isHigh ? "#ef4444" : "#f97316"}
                />
              </div>
            </div>
          </div>

          {/* Right: alert box */}
          <div className={`flex-shrink-0 p-4 rounded-xl border max-w-xs ${
            isHigh
              ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30"
              : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30"
          }`}>
            <p className={`text-sm font-semibold mb-1 ${isHigh ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"}`}>
              {isHigh ? "Atenção: alta acima da média" : "📊 Variação em nível moderado"}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {isHigh
                ? `O INCC acumulou +${fmt(incc.accumulated12m)}% em 12 meses. Isso significa que uma obra orçada em R$ 100 mil há um ano custaria hoje R$ ${(100 * (1 + incc.accumulated12m / 100)).toFixed(0)} mil.`
                : `O INCC acumulou +${fmt(incc.accumulated12m)}% em 12 meses. Orçamentos têm validade curta — reconfirme preços antes de assinar contratos.`}
            </p>
          </div>
        </div>

        {/* Mobile sparkline */}
        <div className="sm:hidden mt-4 flex items-center gap-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">Evolução mensal:</span>
          <PriceSparkline data={incc.history} width={160} height={40} color={isHigh ? "#ef4444" : "#f97316"} />
        </div>

        {/* Monthly history pills */}
        <div className="mt-5 pt-4 border-t border-gray-50 dark:border-gray-800 overflow-x-auto">
          <div className="flex gap-2 pb-1 min-w-max">
            {incc.history.map((p) => (
              <div key={p.date} className="flex flex-col items-center gap-1">
                <div
                  className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    p.value > 0.6
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      : p.value > 0.4
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  }`}
                >
                  +{p.value.toFixed(2)}%
                </div>
                <span className="text-[10px] text-gray-400 dark:text-gray-600">{p.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source footer */}
      <div className="px-6 sm:px-8 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          📌 {data.source} Atualizado em{" "}
          {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(data.cachedAt))}
        </p>
      </div>
    </div>
  );
}

export function CotacoesClient() {
  const [data, setData] = useState<CotacoesApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<MaterialCategory>("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/cotacoes")
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao carregar cotações");
        return r.json();
      })
      .then((d: CotacoesApiResponse) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered: MaterialWithPrice[] = (data?.materials ?? []).filter((m) => {
    const matchCat = category === "todos" || m.category === category;
    const matchSearch =
      !search.trim() ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const avgVariation =
    filtered.length > 0
      ? filtered.reduce((s, m) => s + m.variation12m, 0) / filtered.length
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero */}
      <section className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Cotações de{" "}
              <span className="text-brand-500">Materiais</span>
            </h1>
            <p className="mt-2 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
              Os 14 insumos que representam ~80% do custo de uma obra. Preços de referência
              nacional com variação pelo INCC-DI oficial do Banco Central.
            </p>
          </div>
          <a
            href="https://www.caixa.gov.br/poder-publico/modernizacao-gestao/sinapi/Paginas/default.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl transition-colors flex-shrink-0"
          >
            📋 Tabela SINAPI completa ↗
          </a>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 text-sm font-medium transition-colors"
          >
            <RefreshIcon className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-8">
          {/* INCC Panel */}
          <INCCPanel data={data} />

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar materiais ou serviços..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
              />
            </div>
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    category === value
                      ? "bg-brand-500 text-white shadow-md shadow-brand-500/30 scale-105"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600"
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>
              <strong className="text-gray-900 dark:text-white">{filtered.length}</strong>{" "}
              {filtered.length === 1 ? "material" : "materiais"}
              {category !== "todos" && ` em ${CATEGORIES.find((c) => c.value === category)?.label}`}
            </span>
            {filtered.length > 0 && (
              <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full font-medium border border-amber-200 dark:border-amber-800/30">
                Variação média 12m: +{avgVariation.toFixed(2)}%
              </span>
            )}
          </div>

          {/* Materials grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 dark:text-gray-600">Nenhum material encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((m) => (
                <PriceCard key={m.id} material={m} />
              ))}
            </div>
          )}

          {/* Bottom disclaimer */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-2xl p-5 sm:p-6">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
              ℹ️ Sobre os preços apresentados
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-400 space-y-2 leading-relaxed">
              <p>
                <strong>Preço de referência:</strong> Baseado na tabela SINAPI (Sistema Nacional de Pesquisa de Custos e Índices da Construção Civil), publicada mensalmente pela Caixa Econômica Federal em parceria com o IBGE.
              </p>
              <p>
                <strong>Variação aplicada:</strong> O índice INCC-DI (Banco Central, série 192) é buscado em tempo real para calcular a variação acumulada. Os preços são estimativas — consulte fornecedores locais para cotações definitivas.
              </p>
              <p>
                <strong>Faixa de preço:</strong> Representa a variação típica entre regiões e marcas no mercado nacional. Regiões Norte e Nordeste tendem a ser 10–25% mais caras por frete.
              </p>
              <div className="flex flex-wrap gap-3 mt-3">
                <a href="https://www.caixa.gov.br/poder-publico/modernizacao-gestao/sinapi/Paginas/default.aspx" target="_blank" rel="noopener noreferrer" className="text-xs underline underline-offset-2 hover:text-blue-900 dark:hover:text-blue-200">
                  📋 SINAPI — Caixa/IBGE ↗
                </a>
                <a href="https://api.bcb.gov.br/dados/serie/bcdata.sgs.192/dados/ultimos/12?formato=json" target="_blank" rel="noopener noreferrer" className="text-xs underline underline-offset-2 hover:text-blue-900 dark:hover:text-blue-200">
                  📊 INCC-DI — Banco Central ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
