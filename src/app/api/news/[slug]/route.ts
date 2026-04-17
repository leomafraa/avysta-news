import { NextRequest, NextResponse } from "next/server";
import { fetchAllNews } from "@/services/rssService";
import { cache, CACHE_TTL } from "@/lib/cache";
import type { NewsItem } from "@/types/news";

const CACHE_KEY = "all_news";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    let allNews: NewsItem[];
    const cached = cache.get<NewsItem[]>(CACHE_KEY);

    if (cached) {
      allNews = cached.data;
    } else {
      allNews = await fetchAllNews();
      cache.set(CACHE_KEY, allNews, CACHE_TTL.NEWS_DETAIL);
    }

    const item = allNews.find((n) => n.slug === slug);

    if (!item) {
      return NextResponse.json(
        { error: "Notícia não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(item, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (error) {
    console.error("[API /news/:slug] Error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar notícia." },
      { status: 500 }
    );
  }
}
