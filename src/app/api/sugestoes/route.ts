import { NextRequest, NextResponse } from "next/server";
import { getBearerToken, getUserFromAccessToken } from "@/lib/session";
import { createImprovementSuggestion } from "@/lib/improvementSuggestionsStore";
import type { CreateImprovementSuggestionPayload } from "@/types/improvementSuggestion";

const MAX_SUGESTAO_LENGTH = 5000;

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);
    const user = token ? await getUserFromAccessToken(token) : null;
    if (!user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = (await request.json()) as CreateImprovementSuggestionPayload;
    const nome = body.nome?.trim() ?? "";
    const empresa = body.empresa?.trim() ?? "";
    const sugestao = body.sugestao?.trim() ?? "";

    if (!nome) {
      return NextResponse.json({ error: "Informe seu nome." }, { status: 400 });
    }
    if (!empresa) {
      return NextResponse.json({ error: "Informe a empresa." }, { status: 400 });
    }
    if (!sugestao) {
      return NextResponse.json(
        { error: "Descreva sua sugestão de melhoria." },
        { status: 400 }
      );
    }
    if (sugestao.length > MAX_SUGESTAO_LENGTH) {
      return NextResponse.json(
        { error: `A sugestão deve ter no máximo ${MAX_SUGESTAO_LENGTH} caracteres.` },
        { status: 400 }
      );
    }

    const suggestion = await createImprovementSuggestion(user, {
      nome,
      empresa,
      sugestao,
    });

    return NextResponse.json(
      {
        message: "Sugestão enviada com sucesso. Obrigado pelo feedback!",
        suggestion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /sugestoes] POST error:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar a sugestão. Tente novamente." },
      { status: 500 }
    );
  }
}
