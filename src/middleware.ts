import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAccessTokenValid } from "@/lib/jwt";

const PROTECTED = ["/noticias", "/cotacoes", "/fornecedores", "/news"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("avysta_auth")?.value;

  if (!isAccessTokenValid(token)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/noticias/:path*", "/cotacoes/:path*", "/fornecedores/:path*", "/news/:path*"],
};
