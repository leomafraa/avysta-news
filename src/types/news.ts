export type NewsCategory =
  | "todos"
  | "materiais"
  | "mercado"
  | "infraestrutura"
  | "tecnologia"
  | "sustentabilidade"
  | "financiamento"
  | "legislacao";

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  category: NewsCategory;
  isImportant: boolean;
  tags: string[];
}

export interface NewsApiResponse {
  news: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  cachedAt: string;
}

export interface NewsFilters {
  search?: string;
  category?: NewsCategory;
  page?: number;
  pageSize?: number;
  sortBy?: "date" | "relevance";
}

export interface RssFeedConfig {
  url: string;
  sourceName: string;
  category: NewsCategory;
}
