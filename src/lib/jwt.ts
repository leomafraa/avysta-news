/**
 * Decode JWT payload (middle segment) in Edge-safe way. Does not verify signature
 * (same role as previous middleware check: gate only; APIs validate with Supabase).
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payloadB64 = parts[1];
    if (!payloadB64) return null;
    const base64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad === 0 ? base64 : base64 + "=".repeat(4 - pad);
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Returns true if JWT exists and exp (seconds) is still in the future. */
export function isAccessTokenValid(token: string | undefined | null): boolean {
  if (!token?.trim()) return false;
  const payload = decodeJwtPayload(token.trim());
  const exp = payload?.exp;
  if (typeof exp !== "number") return false;
  return exp * 1000 > Date.now();
}
