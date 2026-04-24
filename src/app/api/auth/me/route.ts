import { NextRequest, NextResponse } from "next/server";
import { verifyToken, toPublic } from "@/lib/auth";
import { findUserById } from "@/lib/usersStore";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "").trim();

  if (!token) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Token inválido ou expirado." }, { status: 401 });

  const user = await findUserById(payload.userId);
  if (!user) return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });

  return NextResponse.json({ user: toPublic(user) });
}
