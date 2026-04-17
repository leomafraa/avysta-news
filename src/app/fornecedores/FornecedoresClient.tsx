"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProviderCard } from "@/components/ProviderCard";
import { ProviderRegisterModal } from "@/components/ProviderRegisterModal";
import { Pagination } from "@/components/Pagination";
import { RefreshIcon } from "@/components/Icons";
import { BRAZIL_STATES } from "@/lib/states";
import type { Provider, ProvidersApiResponse, ProviderCategory } from "@/types/providers";

const CATEGORIES: { value: ProviderCategory; label: string; emoji: string }[] = [
  { value: "todos",        label: "Todos",         emoji: "📦" },
  { value: "construtora",  label: "Construtoras",  emoji: "🏗️" },
  { value: "materiais",    label: "Materiais",     emoji: "🧱" },
  { value: "eletrica",     label: "Elétrica",      emoji: "⚡" },
  { value: "hidraulica",   label: "Hidráulica",    emoji: "🔧" },
  { value: "acabamento",   label: "Acabamento",    emoji: "🎨" },
  { value: "projeto",      label: "Projetos",      emoji: "📐" },
  { value: "equipamentos", label: "Equipamentos",  emoji: "🚜" },
  { value: "esquadrias",   label: "Esquadrias",    emoji: "🪟" },
  { value: "outros",       label: "Outros",        emoji: "🔩" },
];

export function FornecedoresClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, states: 0, categories: 0 });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProviderCategory>(
    (searchParams.get("category") as ProviderCategory) || "todos"
  );
  const [state, setState] = useState(searchParams.get("state") || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchProviders = useCallback(async (opts: {
    search: string; category: ProviderCategory; state: string; page: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: opts.search,
        category: opts.category,
        state: opts.state,
        page: opts.page.toString(),
      });
      const res = await fetch(`/api/fornecedores?${params}`);
      if (!res.ok) throw new Error("Erro ao carregar");
      const data: ProvidersApiResponse = await res.json();
      setProviders(data.providers);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setStats(data.stats);
    } catch {
      setError("Não foi possível carregar o diretório.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search + filter effect
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchProviders({ search, category, state, page: 1 });
    }, 350);
    return () => clearTimeout(searchTimeout.current);
  }, [search, category, state, fetchProviders]);

  // Page change effect
  useEffect(() => {
    fetchProviders({ search, category, state, page });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleCategoryChange(cat: ProviderCategory) {
    setCategory(cat);
    setPage(1);
    const p = new URLSearchParams(searchParams.toString());
    cat === "todos" ? p.delete("category") : p.set("category", cat);
    router.push(`/fornecedores?${p}`, { scroll: false });
  }

  function handleStateChange(s: string) {
    setState(s);
    setPage(1);
    const p = new URLSearchParams(searchParams.toString());
    s ? p.set("state", s) : p.delete("state");
    router.push(`/fornecedores?${p}`, { scroll: false });
  }

  function handleSuccess() {
    setShowModal(false);
    setSuccessMsg("Empresa cadastrada com sucesso! Ela aparecerá no diretório em breve.");
    fetchProviders({ search, category, state, page: 1 });
    setTimeout(() => setSuccessMsg(""), 6000);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* Hero */}
      <section className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
              Diretório de{" "}
              <span className="text-brand-500">Fornecedores</span>
            </h1>
            <p className="mt-2 text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
              Encontre construtoras, fornecedores de materiais e prestadores de serviços
              verificados em todo o Brasil.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-brand-500/25 text-sm"
          >
            + Cadastrar minha empresa
          </button>
        </div>
      </section>

      {/* Stats bar */}
      {!loading && stats.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Empresas cadastradas", value: stats.total, emoji: "🏢" },
            { label: "Empresas verificadas",  value: stats.verified, emoji: "✓" },
            { label: "Estados atendidos",     value: stats.states, emoji: "📍" },
            { label: "Categorias",            value: stats.categories, emoji: "📦" },
          ].map(({ label, value, emoji }) => (
            <div
              key={label}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 text-center"
            >
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {emoji} {value}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Success message */}
      {successMsg && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 rounded-xl text-sm text-green-700 dark:text-green-400 font-medium">
          ✓ {successMsg}
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Search + State */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, serviço ou cidade..."
              className="w-full pl-9 pr-4 py-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
          </div>

          {/* State selector */}
          <div className="relative sm:w-56">
            <select
              value={state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm cursor-pointer"
            >
              <option value="">🇧🇷 Todos os estados</option>
              {BRAZIL_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(({ value, label, emoji }) => (
            <button
              key={value}
              onClick={() => handleCategoryChange(value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                category === value
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/30 scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-brand-300"
              }`}
            >
              <span>{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-5">
        <span>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <RefreshIcon className="w-4 h-4 animate-spin" />
              Buscando...
            </span>
          ) : (
            <>
              <strong className="text-gray-900 dark:text-white">{total}</strong>{" "}
              {total === 1 ? "empresa encontrada" : "empresas encontradas"}
            </>
          )}
        </span>
        <span className="text-xs hidden sm:block">
          ⭐ Premium · ✓ Verificado · Grátis
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => fetchProviders({ search, category, state, page })}
            className="text-sm text-brand-500 hover:text-brand-600 font-medium underline underline-offset-2"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && providers.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Nenhuma empresa encontrada
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Tente outros filtros ou seja o primeiro a cadastrar nessa categoria!
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-brand-500 hover:text-brand-600 font-medium underline underline-offset-2"
          >
            Cadastrar minha empresa →
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && providers.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Bottom CTA */}
      {!loading && (
        <div className="mt-16 bg-gradient-to-br from-brand-50 to-orange-50 dark:from-brand-950/20 dark:to-orange-950/20 border border-brand-100 dark:border-brand-800/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
            Sua empresa ainda não está aqui?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Cadastro gratuito com validação automática via CNPJ. Apareça para compradores
            e contratantes de todo o Brasil.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-brand-500/25 text-sm"
            >
              + Cadastrar gratuitamente
            </button>
            <div className="text-xs text-gray-400 dark:text-gray-600 space-y-1">
              <p>✓ Validação automática por CNPJ</p>
              <p>✓ Sem cartão de crédito</p>
              <p>✓ Visível em todo o Brasil</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProviderRegisterModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
