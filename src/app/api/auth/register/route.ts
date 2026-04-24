import { NextRequest, NextResponse } from "next/server";
import { createToken, generateUserId, toPublic, isValidEmail, isValidPhone } from "@/lib/auth";
import { createUser, findUserByEmail, findUserByPhone } from "@/lib/usersStore";
import type { RegisterPayload, AuthResponse } from "@/types/user";

export async function POST(request: NextRequest) {
  try {
    const body: RegisterPayload = await request.json();
    const { name, email, phone, type } = body;

    if (!name?.trim()) return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
    if (!email?.trim() || !isValidEmail(email)) return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    if (!phone?.trim() || !isValidPhone(phone)) return NextResponse.json({ error: "Telefone inválido." }, { status: 400 });
    if (type !== "comprador" && type !== "fornecedor") return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });

    const [existingEmail, existingPhone] = await Promise.all([
      findUserByEmail(email),
      findUserByPhone(phone),
    ]);
    if (existingEmail) return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
    if (existingPhone) return NextResponse.json({ error: "Este telefone já está cadastrado." }, { status: 409 });

    const user = {
      id: generateUserId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      type,
      createdAt: new Date().toISOString(),
    };

    await createUser(user);

    const token = createToken({ userId: user.id, type: user.type });
    const response: AuthResponse = { user: toPublic(user), token };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("[API /auth/register]", error);
    return NextResponse.json({ error: "Erro interno. Tente novamente." }, { status: 500 });
  }
}
