import { NextRequest, NextResponse } from "next/server";
import { toPublic, isValidEmail, isValidPhone, isValidPassword } from "@/lib/auth";
import { getSiteUrl } from "@/lib/siteUrl";
import { getSupabaseAuthClient } from "@/lib/supabaseAnon";
import { createUser, findUserByEmail, findUserByPhone } from "@/lib/usersStore";
import type { RegisterPayload, AuthResponse, RegisterPendingResponse } from "@/types/user";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterPayload = await request.json();
    const { name, email, phone, type, password } = body;

    if (!name?.trim()) return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    if (!email?.trim() || !isValidEmail(email)) return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    if (!phone?.trim() || !isValidPhone(phone)) return NextResponse.json({ error: "Telefone inválido." }, { status: 400 });
    if (type !== "comprador" && type !== "fornecedor") return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });
    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 8 caracteres." },
        { status: 400 }
      );
    }

    const [existingEmail, existingPhone] = await Promise.all([
      findUserByEmail(email),
      findUserByPhone(phone),
    ]);
    if (existingEmail) return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
    if (existingPhone) return NextResponse.json({ error: "Este telefone já está cadastrado." }, { status: 409 });

    const supabase = getSupabaseAuthClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        emailRedirectTo: `${getSiteUrl()}/login`,
        data: {
          name: name.trim(),
          phone: phone.trim(),
          type,
        },
      },
    });

    if (error) {
      const msg = error.message?.toLowerCase() ?? "";
      if (msg.includes("already registered") || msg.includes("user already")) {
        return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
      }
      return NextResponse.json({ error: error.message || "Não foi possível criar a conta." }, { status: 400 });
    }

    if (!data.user?.id) {
      return NextResponse.json({ error: "Não foi possível criar a conta." }, { status: 500 });
    }

    const user = {
      id: data.user.id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      type,
      createdAt: new Date().toISOString(),
    };

    try {
      await createUser(user);
    } catch (e) {
      console.error("[API /auth/register] createUser after signUp", e);
      return NextResponse.json(
        { error: "Conta criada no login, mas falhou ao salvar o perfil. Entre em contato com o suporte." },
        { status: 500 }
      );
    }

    if (!data.session) {
      const pending: RegisterPendingResponse = {
        needsEmailConfirmation: true,
        message:
          "Enviamos um link de confirmação para seu e-mail. Abra o link para ativar a conta e depois faça login.",
      };
      return NextResponse.json(pending, { status: 201 });
    }

    const response: AuthResponse = {
      user: toPublic(user),
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("[API /auth/register]", error);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
