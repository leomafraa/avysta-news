import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { fetchAllNews } from "@/services/rssService";
import { cache, CACHE_TTL } from "@/lib/cache";
import type { NewsItem } from "@/types/news";
import { ArrowLeftIcon, ArrowTopRightIcon, CalendarIcon, StarIcon } from "@/components/Icons";

const CATEGORY_LABELS: Record<string, string> = {
  todos: "Todos",
  materiais: "Materiais",
  mercado: "Mercado",
  infraestrutura: "Infraestrutura",
  tecnologia: "Tecnologia",
  sustentabilidade: "Sustentabilidade",
  financiamento: "Financiamento",
  legislacao: "Legislação",
};

const CACHE_KEY = "all_news";

async function getNewsItem(slug: string): Promise<NewsItem | null> {
  let allNews: NewsItem[];
  const cached = cache.get<NewsItem[]>(CACHE_KEY);

  if (cached) {
    allNews = cached.data;
  } else {
    allNews = await fetchAllNews();
    cache.set(CACHE_KEY, allNews, CACHE_TTL.NEWS_DETAIL);
  }

  return allNews.find((n) => n.slug === slug) ?? null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItem(slug);

  if (!item) {
    return {
      title: "Notícia não encontrada",
      description: "Esta notícia não está mais disponível.",
    };
  }

  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      type: "article",
      publishedTime: item.publishedAt,
      ...(item.imageUrl && { images: [{ url: item.imageUrl, alt: item.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.summary,
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getNewsItem(slug);

  if (!item) notFound();

  const publishedDate = format(new Date(item.publishedAt), "d 'de' MMMM 'de' yyyy 'às' HH:mm", {
    locale: ptBR,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-8 group"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar para notícias
      </Link>

      <article className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Hero image */}
        {item.imageUrl && (
          <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-100 dark:bg-gray-800">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        )}

        <div className="p-6 sm:p-8 lg:p-10">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300">
              {CATEGORY_LABELS[item.category] || item.category}
            </span>
            {item.isImportant && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                <StarIcon className="w-3 h-3" />
                Destaque
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
            {item.title}
          </h1>

          {/* Source + date */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pb-6 mb-6 border-b border-gray-100 dark:border-gray-800">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {item.sourceName}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              {publishedDate}
            </span>
          </div>

          {/* Summary / Lead */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-medium">
            {item.summary}
          </p>

          {/* Content */}
          {item.content && item.content !== item.summary && (
            <div className="prose prose-gray dark:prose-invert prose-lg max-w-none mb-8">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>
            </div>
          )}

          {/* Source notice + CTA */}
          <div className="mt-8 p-5 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/30 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Este é um resumo gerado a partir do feed RSS de{" "}
              <strong className="text-gray-800 dark:text-gray-200">{item.sourceName}</strong>.
              Para ler a notícia completa, acesse a fonte original.
            </p>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-brand-500/20 text-sm"
            >
              Ler notícia completa
              <ArrowTopRightIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </article>

      {/* Navigation back */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Ver mais notícias
        </Link>
      </div>
    </div>
  );
}
