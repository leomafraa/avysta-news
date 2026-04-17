import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews, fetchNewsByState, filterNews } from "@/services/rssService";
import { cache, CACHE_TTL } from "@/lib/cache";
import { BRAZIL_STATES } from "@/lib/states";
import type { NewsApiResponse, NewsItem } from "@/types/news";

const PAGE_SIZE = 12;

function getCacheKey(stateCode: string): string {
  return stateCode ? `news_state_${stateCode}` : "news_all";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "todos";
  const stateCode = searchParams.get("state") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const sortBy = searchParams.get("sortBy") || "date";

  // Resolve state name from code
  const stateObj = BRAZIL_STATES.find((s) => s.code === stateCode);
  const stateName = stateObj?.name || "";

  const cacheKey = getCacheKey(stateCode);

  try {
    let allNews: NewsItem[];
    const cached = cache.get<NewsItem[]>(cacheKey);

    if (cached) {
      allNews = cached.data;
    } else {
      allNews = stateName
        ? await fetchNewsByState(stateName)
        : await fetchAllNews();
      cache.set(cacheKey, allNews, CACHE_TTL.NEWS_LIST);
    }

    // Apply filters
    let filtered = filterNews(allNews, { search, category });

    if (sortBy === "date") {
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const start = (page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    const cacheInfo = cache.get<NewsItem[]>(cacheKey);

    const response: NewsApiResponse = {
      news: pageItems,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages,
      cachedAt: cacheInfo?.cachedAt || new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("[API /news] Error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar notícias. Tente novamente." },
      { status: 500 }
    );
  }
}
