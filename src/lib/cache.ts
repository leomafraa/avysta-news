interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  cachedAt: string;
}

class InMemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttlSeconds: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
      cachedAt: new Date().toISOString(),
    });
  }

  get<T>(key: string): { data: T; cachedAt: string } | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return { data: entry.data, cachedAt: entry.cachedAt };
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

// Singleton to persist across API requests in the same Node.js process
const globalCache = global as typeof global & { __newsCache?: InMemoryCache };
if (!globalCache.__newsCache) {
  globalCache.__newsCache = new InMemoryCache();
}

export const cache = globalCache.__newsCache;

export const CACHE_TTL = {
  NEWS_LIST: 15 * 60,    // 15 minutes
  NEWS_DETAIL: 30 * 60,  // 30 minutes
  PRICES: 24 * 60 * 60,  // 24 hours (INCC updates monthly)
} as const;
