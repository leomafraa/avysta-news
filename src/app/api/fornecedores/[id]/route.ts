import { NextRequest, NextResponse } from "next/server";
import { findProviderById, updateProvider } from "@/lib/providersStore";
import { uploadProviderLogoFromDataUrl, MSG_PROVIDER_SAVE_FAILED } from "@/lib/providerLogoUpload";
import { getBearerToken, getUserFromAccessToken } from "@/lib/session";
import type { Provider } from "@/types/providers";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const provider = await findProviderById(id);
    if (!provider) {
      return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 });
    }
    return NextResponse.json(provider);
  } catch (error) {
    console.error("[API /fornecedores/[id]] GET error:", error);
    return NextResponse.json({ error: "Erro ao buscar empresa." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    // Authenticate
    const token = getBearerToken(request);
    const dbUser = token ? await getUserFromAccessToken(token) : null;
    if (!dbUser) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    // Ensure ownership
    if (dbUser.providerId !== id) {
      return NextResponse.json({ error: "Você não tem permissão para editar esta empresa." }, { status: 403 });
    }

    const existing = await findProviderById(id);
    if (!existing) {
      return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 });
    }

    const body = await request.json();

    // Fields that can be updated (CNPJ and plan/verified are immutable by the user)
    const allowed: Array<keyof Provider> = [
      "nomeFantasia", "razaoSocial", "category", "description",
      "state", "city", "phone", "email", "website", "services",
    ];

    const patch: Partial<Provider> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (patch as any)[key] = body[key];
      }
    }

    if (body.services !== undefined) {
      patch.services = Array.isArray(body.services) ? body.services : [];
    }

    if (typeof body.logoBase64 === "string" && body.logoBase64.trim()) {
      const up = await uploadProviderLogoFromDataUrl(id, body.logoBase64.trim());
      if ("error" in up) {
        const status = up.error === MSG_PROVIDER_SAVE_FAILED ? 503 : 400;
        return NextResponse.json({ error: up.error }, { status });
      }
      patch.logoUrl = up.url;
    } else if (body.clearLogo === true) {
      patch.logoUrl = "";
    }

    const updated = await updateProvider(id, patch);
    if (!updated) {
      return NextResponse.json({ error: "Empresa não encontrada." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[API /fornecedores/[id]] PATCH error:", error);
    return NextResponse.json({ error: MSG_PROVIDER_SAVE_FAILED }, { status: 500 });
  }
}
