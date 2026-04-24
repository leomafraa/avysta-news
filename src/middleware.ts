import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Decode base64url without Node.js Buffer (Edge Runtime compatible)
function decodeBase64url(str: string): string {
  // Convert base64url → base64
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // Add required padding
  const pad = base64.length % 4;
  const padded = pad === 0 ? base64 : base64 + "=".repeat(4 - pad);
  return atob(padded);
}

// Check token expiry without HMAC (signature is verified in API routes)
function isTokenValid(token: string): boolean {
  try {
    const [json] = token.split(".");
    if (!json) return false;
    const payload = JSON.parse(decodeBase64url(json)) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

const PROTECTED = ["/noticias", "/cotacoes", "/fornecedores", "/news"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("avysta_auth")?.value;

  if (!token || !isTokenValid(token)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/noticias/:path*", "/cotacoes/:path*", "/fornecedores/:path*", "/news/:path*"],
};
