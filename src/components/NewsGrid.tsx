"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { StateFilter } from "./StateFilter";
import { NewsCard } from "./NewsCard";
import { Pagination } from "./Pagination";
import { RefreshIcon } from "./Icons";
import type { NewsItem, NewsCategory, NewsApiResponse } from "@/types/news";

export function NewsGrid() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [cachedAt, setCachedAt] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<NewsCategory>(
    (searchParams.get("category") as NewsCategory) || "todos"
  );
  const [state, setState] = useState(searchParams.get("state") || "");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchNews = useCallback(
    async (opts: {
      search: string;
      category: NewsCategory;
      state: string;
      page: number;
    }) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          search: opts.search,
          category: opts.category,
          state: opts.state,
          page: opts.page.toString(),
          sortBy: "date",
        });

        const res = await fetch(`/api/news?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Erro ao carregar notícias");

        const data: NewsApiResponse = await res.json();
        setNews(data.news);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setCachedAt(data.cachedAt);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError("Não foi possível carregar as notícias. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      fetchNews({ search, category, state, page: 1 });
    }, 400);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [search, category, state, fetchNews]);

  useEffect(() => {
    fetchNews({ search, category, state, page });
    // fetchNews is stable (useCallback with no deps), search/category/state
    // are intentionally excluded — their changes are handled by the
    // debounced effect above to avoid double-fetching.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Sync filters from URL (e.g. footer links)
  useEffect(() => {
    const urlCategory = (searchParams.get("category") as NewsCategory) || "todos";
    const urlState = searchParams.get("state") || "";
    setCategory(urlCategory);
    setState(urlState);
    setPage(1);
  }, [searchParams]);

  const handleCategoryChange = (cat: NewsCategory) => {
    setCategory(cat);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "todos") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleStateChange = (stateCode: string) => {
    setState(stateCode);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (stateCode) {
      params.set("state", stateCode);
    } else {
      params.delete("state");
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featured = news.slice(0, 1);
  const rest = news.slice(1);

  return (
    <div className="space-y-6">
      {/* Search + Filter bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>
          <StateFilter value={state} onChange={handleStateChange} />
        </div>
        <CategoryFilter active={category} onChange={handleCategoryChange} />
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <RefreshIcon className="w-4 h-4 animate-spin" />
              Carregando notícias...
            </span>
          ) : (
            <>
              <strong className="text-gray-900 dark:text-white">{total}</strong>{" "}
              {total === 1 ? "notícia encontrada" : "notícias encontradas"}
            </>
          )}
        </span>
        {cachedAt && !loading && (
          <span className="text-xs text-gray-400 dark:text-gray-600 hidden sm:block">
            Atualizado {new Intl.DateTimeFormat("pt-BR", { timeStyle: "short", dateStyle: "short" }).format(new Date(cachedAt))}
          </span>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <span className="text-4xl">⚠️</span>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm">{error}</p>
          <button
            onClick={() => fetchNews({ search, category, page })}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium"
          >
            <RefreshIcon className="w-4 h-4" />
            Tentar novamente
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && news.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <span className="text-5xl">🔍</span>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Nenhuma notícia encontrada
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
            Tente ajustar os filtros ou buscar por outros termos.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("todos");
              setState("");
              setPage(1);
              router.push("/", { scroll: false });
            }}
            className="mt-2 text-sm text-brand-500 hover:text-brand-600 font-medium underline underline-offset-2"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Skeleton loading */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-72" />
            ))}
          </div>
        </div>
      )}

      {/* News content */}
      {!loading && !error && news.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          {/* Featured article */}
          {featured.map((item) => (
            <NewsCard key={item.id} item={item} featured />
          ))}

          {/* Regular grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="pt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
