import Parser from "rss-parser";
import slugify from "slugify";
import type { NewsItem, NewsCategory, RssFeedConfig } from "@/types/news";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
      ["enclosure", "enclosure", { keepArray: false }],
    ],
  },
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; AvystaComunidadeBot/1.0; +https://avysta.com.br)",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

// RSS feeds focused on Brazilian civil construction
const RSS_FEEDS: RssFeedConfig[] = [
  {
    url: "https://news.google.com/rss/search?q=constru%C3%A7%C3%A3o+civil+brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    sourceName: "Google News",
    category: "mercado",
  },
  {
    url: "https://news.google.com/rss/search?q=mercado+imobili%C3%A1rio+brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    sourceName: "Google News - Imobiliário",
    category: "mercado",
  },
  {
    url: "https://news.google.com/rss/search?q=materiais+de+constru%C3%A7%C3%A3o+brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    sourceName: "Google News - Materiais",
    category: "materiais",
  },
  {
    url: "https://news.google.com/rss/search?q=infraestrutura+brasil+obras&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    sourceName: "Google News - Infraestrutura",
    category: "infraestrutura",
  },
  {
    url: "https://news.google.com/rss/search?q=financiamento+imobili%C3%A1rio+caixa+brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    sourceName: "Google News - Financiamento",
    category: "financiamento",
  },
  {
    url: "https://news.google.com/rss/search?q=tecnologia+constru%C3%A7%C3%A3o+civil+BIM&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    sourceName: "Google News - Tecnologia",
    category: "tecnologia",
  },
  {
    url: "https://news.google.com/rss/search?q=constru%C3%A7%C3%A3o+sustent%C3%A1vel+verde+brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    sourceName: "Google News - Sustentabilidade",
    category: "sustentabilidade",
  },
  {
    url: "https://news.google.com/rss/search?q=legisla%C3%A7%C3%A3o+urbanismo+zoneamento+brasil&hl=pt-BR&gl=BR&ceid=BR:pt-419",
    sourceName: "Google News - Legislação",
    category: "legislacao",
  },
];

// Keywords that flag a news item as important
const IMPORTANT_KEYWORDS = [
  "urgente",
  "exclusivo",
  "alta",
  "recorde",
  "aprovado",
  "programa",
  "bilhões",
  "minha casa",
  "caixa econômica",
  "banco central",
  "pib",
  "cdhu",
  "mcmv",
];

function extractImageUrl(item: Record<string, unknown>): string | null {
  // Try media:content
  const mc = item.mediaContent as Record<string, unknown> | undefined;
  if (mc?.url) return mc.url as string;

  // Try media:thumbnail
  const mt = item.mediaThumbnail as Record<string, unknown> | undefined;
  if (mt?.url) return mt.url as string;

  // Try enclosure
  const enc = item.enclosure as Record<string, unknown> | undefined;
  if (enc?.url && (enc.type as string)?.startsWith("image/"))
    return enc.url as string;

  // Gather all possible HTML fields rss-parser may populate
  const candidates = [
    item.content,
    item["content:encoded"],
    item.summary,
    item.description, // Some parsers use this
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string" || !candidate) continue;

    // Match quoted src attribute
    const m1 = candidate.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m1?.[1]) return m1[1];

    // Match unquoted src attribute (fallback)
    const m2 = candidate.match(/<img[^>]+src=([^\s>"']+)/i);
    if (m2?.[1]) return m2[1];

    // Google News encodes description as HTML entities — decode and retry
    if (candidate.includes("&lt;img")) {
      const decoded = candidate
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");
      const m3 = decoded.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (m3?.[1]) return m3[1];
    }
  }

  return null;
}

function cleanHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectCategory(
  title: string,
  summary: string,
  defaultCategory: NewsCategory
): NewsCategory {
  const text = `${title} ${summary}`.toLowerCase();

  if (
    text.includes("material") ||
    text.includes("cimento") ||
    text.includes("aço") ||
    text.includes("tijolo") ||
    text.includes("tinta") ||
    text.includes("ferragem")
  )
    return "materiais";

  if (
    text.includes("obra") ||
    text.includes("infra") ||
    text.includes("estrada") ||
    text.includes("ponte") ||
    text.includes("saneamento")
  )
    return "infraestrutura";

  if (
    text.includes("bim") ||
    text.includes("tecnologia") ||
    text.includes("software") ||
    text.includes("automação") ||
    text.includes("digital") ||
    text.includes("inteligência artificial")
  )
    return "tecnologia";

  if (
    text.includes("sustentável") ||
    text.includes("verde") ||
    text.includes("leed") ||
    text.includes("energia solar") ||
    text.includes("reciclagem")
  )
    return "sustentabilidade";

  if (
    text.includes("financiamento") ||
    text.includes("crédito") ||
    text.includes("juros") ||
    text.includes("caixa") ||
    text.includes("fgts") ||
    text.includes("mcmv")
  )
    return "financiamento";

  if (
    text.includes("lei") ||
    text.includes("norma") ||
    text.includes("regulamento") ||
    text.includes("abnt") ||
    text.includes("prefeitura") ||
    text.includes("decreto")
  )
    return "legislacao";

  if (
    text.includes("mercado") ||
    text.includes("preço") ||
    text.includes("venda") ||
    text.includes("imóvel") ||
    text.includes("lançamento") ||
    text.includes("incorpor")
  )
    return "mercado";

  return defaultCategory;
}

function isImportant(title: string, summary: string): boolean {
  const text = `${title} ${summary}`.toLowerCase();
  return IMPORTANT_KEYWORDS.some((kw) => text.includes(kw));
}

function generateSlug(title: string, id: string): string {
  const base = slugify(title, {
    lower: true,
    strict: true,
    locale: "pt",
  }).substring(0, 80);
  const shortId = id.substring(0, 8);
  return `${base}-${shortId}`;
}

function generateId(title: string, sourceUrl: string): string {
  const str = `${title}${sourceUrl}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).padStart(8, "0");
}

async function parseFeed(
  config: RssFeedConfig
): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(config.url);
    const items: NewsItem[] = [];

    for (const item of feed.items.slice(0, 15)) {
      if (!item.title || !item.link) continue;

      const title = cleanHtml(item.title);
      const rawSummary =
        item.contentSnippet ||
        item.summary ||
        item.content ||
        "";
      const summary = cleanHtml(rawSummary).substring(0, 300);
      const content = cleanHtml(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item as any)["content:encoded"] || item.content || item.summary || summary
      );

      const sourceUrl = item.link;
      const id = generateId(title, sourceUrl);
      const slug = generateSlug(title, id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imageUrl = extractImageUrl(item as unknown as Record<string, unknown>);

      const category = detectCategory(title, summary, config.category);
      const publishedAt = item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString();

      // Extract source name from feed or item
      const sourceName = item.creator || feed.title || config.sourceName;

      items.push({
        id,
        slug,
        title,
        summary: summary || title,
        content: content || summary || title,
        imageUrl,
        sourceUrl,
        sourceName,
        publishedAt,
        category,
        isImportant: isImportant(title, summary),
        tags: [],
      });
    }

    return items;
  } catch (error) {
    console.error(`[RSS] Failed to parse feed: ${config.url}`, error);
    return [];
  }
}

function buildStateFeeds(stateName: string): RssFeedConfig[] {
  const enc = encodeURIComponent;
  return [
    {
      url: `https://news.google.com/rss/search?q=constru%C3%A7%C3%A3o+civil+${enc(stateName)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`,
      sourceName: `Google News – ${stateName}`,
      category: "mercado",
    },
    {
      url: `https://news.google.com/rss/search?q=mercado+imobili%C3%A1rio+${enc(stateName)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`,
      sourceName: `Google News – Imobiliário ${stateName}`,
      category: "mercado",
    },
    {
      url: `https://news.google.com/rss/search?q=obras+infraestrutura+${enc(stateName)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`,
      sourceName: `Google News – Infraestrutura ${stateName}`,
      category: "infraestrutura",
    },
    {
      url: `https://news.google.com/rss/search?q=financiamento+im%C3%B3veis+${enc(stateName)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`,
      sourceName: `Google News – Financiamento ${stateName}`,
      category: "financiamento",
    },
  ];
}

async function fetchFeeds(feeds: RssFeedConfig[]): Promise<NewsItem[]> {
  const results = await Promise.allSettled(feeds.map((feed) => parseFeed(feed)));

  const allItems: NewsItem[] = [];
  const seenIds = new Set<string>();

  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const item of result.value) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          allItems.push(item);
        }
      }
    }
  }

  return allItems.sort((a, b) => {
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  return fetchFeeds(RSS_FEEDS);
}

export async function fetchNewsByState(stateName: string): Promise<NewsItem[]> {
  return fetchFeeds(buildStateFeeds(stateName));
}

export function filterNews(
  items: NewsItem[],
  {
    search,
    category,
  }: { search?: string; category?: string }
): NewsItem[] {
  let filtered = items;

  if (category && category !== "todos") {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (search && search.trim()) {
    const term = search.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.summary.toLowerCase().includes(term) ||
        item.sourceName.toLowerCase().includes(term)
    );
  }

  return filtered;
}
