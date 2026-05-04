import { NextRequest, NextResponse } from "next/server";
import { toPublic } from "@/lib/auth";
import { getBearerToken, getUserFromAccessToken } from "@/lib/session";

export async function GET(request: NextRequest) {
  const token = getBearerToken(request);

  if (!token) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const user = await getUserFromAccessToken(token);
  if (!user) return NextResponse.json({ error: "Token inválido ou expirado." }, { status: 401 });

  return NextResponse.json({ user: toPublic(user) });
}
