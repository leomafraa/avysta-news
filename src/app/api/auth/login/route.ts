import { NextRequest, NextResponse } from "next/server";
import { createToken, toPublic, isValidEmail } from "@/lib/auth";
import { findUserByEmail, findUserByPhone } from "@/lib/usersStore";
import type { LoginPayload, AuthResponse } from "@/types/user";

export async function POST(request: NextRequest) {
  try {
    const body: LoginPayload = await request.json();
    const { credential } = body;

    if (!credential?.trim()) {
      return NextResponse.json({ error: "Informe seu e-mail ou telefone." }, { status: 400 });
    }

    const isEmail = isValidEmail(credential.trim());
    const user = isEmail
      ? await findUserByEmail(credential.trim())
      : await findUserByPhone(credential.trim());

    if (!user) {
      return NextResponse.json(
        { error: "Nenhuma conta encontrada com este e-mail ou telefone." },
        { status: 404 }
      );
    }

    const token = createToken({ userId: user.id, type: user.type });
    const response: AuthResponse = { user: toPublic(user), token };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API /auth/login]", error);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
