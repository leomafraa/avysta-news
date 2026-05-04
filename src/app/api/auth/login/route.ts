import { NextRequest, NextResponse } from "next/server";
import { toPublic, isValidEmail, isValidPassword } from "@/lib/auth";
import { getSupabaseAuthClient } from "@/lib/supabaseAnon";
import { findUserById } from "@/lib/usersStore";
import type { LoginPayload, AuthResponse } from "@/types/user";

export async function POST(request: NextRequest) {
  try {
    const body: LoginPayload = await request.json();
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }
    if (!isValidPassword(password)) {
      return NextResponse.json({ error: "Senha inválida." }, { status: 400 });
    }

    const supabase = getSupabaseAuthClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session || !data.user) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const profile = await findUserById(data.user.id);
    if (!profile) {
      return NextResponse.json(
        { error: "Perfil não encontrado. Conclua o cadastro ou fale com o suporte." },
        { status: 404 }
      );
    }

    const response: AuthResponse = {
      user: toPublic(profile),
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API /auth/login]", error);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
