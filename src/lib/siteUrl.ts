/**
 * Base URL for Supabase e-mail links (recovery, confirmation).
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://seu-dominio.com).
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}
