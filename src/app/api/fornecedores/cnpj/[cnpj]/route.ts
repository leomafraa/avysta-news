import { NextRequest, NextResponse } from "next/server";
import type { CnpjApiData } from "@/types/providers";

function formatPhone(raw: string): string {
  const digits = raw?.replace(/\D/g, "") || "";
  if (digits.length === 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return raw || "";
}

function toTitleCase(str: string): string {
  const lower = [
    "de", "da", "do", "das", "dos", "e", "em", "a", "o", "com", "para",
  ];
  return str
    .toLowerCase()
    .split(" ")
    .map((w, i) => (i === 0 || !lower.includes(w) ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function formatCnpj(cnpj: string): string {
  const d = cnpj.replace(/\D/g, "").padStart(14, "0");
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ cnpj: string }> }
) {
  const { cnpj } = await params;
  const clean = cnpj.replace(/\D/g, "");

  if (clean.length !== 14) {
    return NextResponse.json({ error: "CNPJ inválido." }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${clean}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 },
      }
    );

    if (res.status === 404) {
      return NextResponse.json({ error: "CNPJ não encontrado na Receita Federal." }, { status: 404 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: "Erro ao consultar Receita Federal." }, { status: 502 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json();

    if (data.descricao_situacao_cadastral?.toLowerCase() !== "ativa") {
      return NextResponse.json(
        { error: `CNPJ com situação: ${data.descricao_situacao_cadastral}. Apenas empresas ativas podem se cadastrar.` },
        { status: 422 }
      );
    }

    const result: CnpjApiData = {
      cnpj: formatCnpj(clean),
      razaoSocial: toTitleCase(data.razao_social || ""),
      nomeFantasia: toTitleCase(data.nome_fantasia || data.razao_social || ""),
      city: toTitleCase(data.municipio || ""),
      state: data.uf || "",
      phone: formatPhone(data.ddd_telefone_1 || ""),
      email: (data.email || "").toLowerCase(),
      cnae: String(data.cnae_fiscal || ""),
      cnaeDescricao: toTitleCase(data.cnae_fiscal_descricao || ""),
      situacao: data.descricao_situacao_cadastral || "",
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[API CNPJ] Error:", error);
    return NextResponse.json(
      { error: "Não foi possível consultar o CNPJ. Tente novamente." },
      { status: 500 }
    );
  }
}
