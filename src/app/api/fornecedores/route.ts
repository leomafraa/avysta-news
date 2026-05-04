import { NextRequest, NextResponse } from "next/server";
import { readProviders, addProvider, generateId } from "@/lib/providersStore";
import { toPublic } from "@/lib/auth";
import { uploadProviderLogoFromDataUrl, MSG_PROVIDER_SAVE_FAILED } from "@/lib/providerLogoUpload";
import { getBearerToken, getUserFromAccessToken } from "@/lib/session";
import { updateUser } from "@/lib/usersStore";
import type { ProvidersApiResponse, Provider, ProviderCategory } from "@/types/providers";

const PAGE_SIZE = 12;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const category = (searchParams.get("category") || "todos") as ProviderCategory;
  const state = searchParams.get("state") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  try {
    const all = await readProviders();

    let filtered = all;

    if (category !== "todos") {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (state) {
      filtered = filtered.filter((p) => p.state === state);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nomeFantasia.toLowerCase().includes(term) ||
          p.razaoSocial.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.city.toLowerCase().includes(term) ||
          p.services.some((s) => s.toLowerCase().includes(term))
      );
    }

    // Sort: premium first, then verified, then by date
    filtered.sort((a, b) => {
      const planScore = { premium: 3, verificado: 2, gratuito: 1 };
      const diff = planScore[b.plan] - planScore[a.plan];
      if (diff !== 0) return diff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const stats = {
      total: all.length,
      verified: all.filter((p) => p.verified).length,
      states: new Set(all.map((p) => p.state)).size,
      categories: new Set(all.map((p) => p.category)).size,
    };

    const response: ProvidersApiResponse = {
      providers: items,
      total,
      page,
      totalPages,
      stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[API /fornecedores] GET error:", error);
    return NextResponse.json({ error: "Erro ao buscar fornecedores." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate
    const token = getBearerToken(request);
    const dbUser = token ? await getUserFromAccessToken(token) : null;
    if (!dbUser) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Prevent duplicate company per user
    if (dbUser.providerId) {
      return NextResponse.json({ error: "Você já possui uma empresa cadastrada. Use a opção de editar." }, { status: 409 });
    }

    const body = await request.json();

    const required = ["nomeFantasia", "cnpj", "category", "phone", "email"];
    for (const field of required) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json(
          { error: `Campo obrigatório ausente: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check for duplicate CNPJ
    const all = await readProviders();
    const cleanCnpj = body.cnpj.replace(/\D/g, "");
    if (all.some((p) => p.cnpj.replace(/\D/g, "") === cleanCnpj)) {
      return NextResponse.json(
        { error: "Este CNPJ já está cadastrado." },
        { status: 409 }
      );
    }

    const id = generateId();
    let logoUrl: string | undefined;

    if (typeof body.logoBase64 === "string" && body.logoBase64.trim()) {
      const up = await uploadProviderLogoFromDataUrl(id, body.logoBase64.trim());
      if ("error" in up) {
        const status = up.error === MSG_PROVIDER_SAVE_FAILED ? 503 : 400;
        return NextResponse.json({ error: up.error }, { status });
      }
      logoUrl = up.url;
    }

    const newProvider: Provider = {
      id,
      userId: dbUser.id,
      cnpj: body.cnpj,
      razaoSocial: body.razaoSocial || body.nomeFantasia,
      nomeFantasia: body.nomeFantasia,
      category: body.category,
      description: body.description || "",
      state: body.state,
      city: body.city,
      phone: body.phone,
      email: body.email,
      website: body.website || "",
      logoUrl,
      services: Array.isArray(body.services) ? body.services : [],
      plan: "gratuito",
      verified: false,
      createdAt: new Date().toISOString(),
      cnae: body.cnae || "",
      cnaeDescricao: body.cnaeDescricao || "",
    };

    await addProvider(newProvider);

    // Link provider to user
    const updatedUser = await updateUser(dbUser.id, { providerId: newProvider.id });

    return NextResponse.json(
      { provider: newProvider, user: updatedUser ? toPublic(updatedUser) : undefined },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /fornecedores] POST error:", error);
    return NextResponse.json({ error: MSG_PROVIDER_SAVE_FAILED }, { status: 500 });
  }
}
