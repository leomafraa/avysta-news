import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { NewsItem, NewsCategory } from "@/types/news";
import { StarIcon, CalendarIcon } from "./Icons";
import { NewsImage } from "./NewsImage";

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  todos: "Todos",
  materiais: "Materiais",
  mercado: "Mercado",
  infraestrutura: "Infraestrutura",
  tecnologia: "Tecnologia",
  sustentabilidade: "Sustentabilidade",
  financiamento: "Financiamento",
  legislacao: "Legislação",
};

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  todos: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  materiais: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  mercado: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  infraestrutura: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  tecnologia: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  sustentabilidade: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  financiamento: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  legislacao: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

interface NewsCardProps {
  item: NewsItem;
  featured?: boolean;
}

export function NewsCard({ item, featured = false }: NewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(item.publishedAt), {
    addSuffix: true,
    locale: ptBR,
  });

  if (featured) {
    return (
      <Link href={`/news/${item.slug}`} className="group block">
        <article className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row min-h-[260px]">
          {/* Image */}
          <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden flex-shrink-0">
            <NewsImage
              src={item.imageUrl}
              alt={item.title}
              category={item.category}
              className="group-hover:scale-105 transition-transform duration-500"
            />
            {item.isImportant && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-brand-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow z-10">
                <StarIcon className="w-3 h-3" />
                Destaque
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between p-6 flex-1">
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[item.category]}`}>
                  {CATEGORY_LABELS[item.category]}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug mb-3">
                {item.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
                {item.summary}
              </p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate max-w-[60%]">
                {item.sourceName}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <CalendarIcon className="w-3.5 h-3.5" />
                {timeAgo}
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/news/${item.slug}`} className="group block h-full">
      <article className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full">
        {/* Image */}
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          <NewsImage
            src={item.imageUrl}
            alt={item.title}
            category={item.category}
            className="group-hover:scale-105 transition-transform duration-500"
          />
          {item.isImportant && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-brand-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow z-10">
              <StarIcon className="w-2.5 h-2.5" />
              Destaque
            </div>
          )}
          <div className="absolute bottom-2 left-2 z-10">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category]}`}>
              {CATEGORY_LABELS[item.category]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug mb-2">
            {item.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed flex-1">
            {item.summary}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[55%]">
              {item.sourceName}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
              <CalendarIcon className="w-3 h-3" />
              {timeAgo}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
