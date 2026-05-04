import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAuthClient } from "@/lib/supabaseAnon";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const refresh_token = typeof body.refresh_token === "string" ? body.refresh_token.trim() : "";

    if (!refresh_token) {
      return NextResponse.json({ error: "Sessão inválida." }, { status: 400 });
    }

    const supabase = getSupabaseAuthClient();
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error || !data.session) {
      return NextResponse.json({ error: "Não foi possível renovar a sessão." }, { status: 401 });
    }

    return NextResponse.json({
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
    });
  } catch (error) {
    console.error("[API /auth/refresh]", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
