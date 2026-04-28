import type { Provider } from "@/types/providers";
import { supabaseServer } from "@/lib/supabaseServer";

type ProviderRow = {
  id: string;
  user_id: string | null;
  cnpj: string;
  cnpj_normalized: string;
  razao_social: string;
  nome_fantasia: string;
  category: Provider["category"];
  description: string;
  state: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  services: string[];
  plan: Provider["plan"];
  verified: boolean;
  created_at: string;
  cnae: string | null;
  cnae_descricao: string | null;
};

function normalizeCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, "");
}

function rowToProvider(row: ProviderRow): Provider {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    cnpj: row.cnpj,
    razaoSocial: row.razao_social,
    nomeFantasia: row.nome_fantasia,
    category: row.category,
    description: row.description,
    state: row.state,
    city: row.city,
    phone: row.phone,
    email: row.email,
    website: row.website,
    services: row.services ?? [],
    plan: row.plan,
    verified: row.verified,
    createdAt: row.created_at,
    cnae: row.cnae ?? undefined,
    cnaeDescricao: row.cnae_descricao ?? undefined,
  };
}

export async function readProviders(): Promise<Provider[]> {
  const { data, error } = await supabaseServer
    .from("providers")
    .select("*");

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => rowToProvider(row as ProviderRow));
}

export async function writeProviders(providers: Provider[]): Promise<void> {
  const rows = providers.map((p) => ({
    id: p.id,
    user_id: p.userId ?? null,
    cnpj: p.cnpj,
    cnpj_normalized: normalizeCnpj(p.cnpj),
    razao_social: p.razaoSocial,
    nome_fantasia: p.nomeFantasia,
    category: p.category,
    description: p.description,
    state: p.state,
    city: p.city,
    phone: p.phone,
    email: p.email,
    website: p.website,
    services: p.services,
    plan: p.plan,
    verified: p.verified,
    created_at: p.createdAt,
    cnae: p.cnae ?? null,
    cnae_descricao: p.cnaeDescricao ?? null,
  }));

  const { error } = await supabaseServer
    .from("providers")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    throw error;
  }
}

export async function addProvider(provider: Provider): Promise<void> {
  const { error } = await supabaseServer
    .from("providers")
    .insert({
      id: provider.id,
      user_id: provider.userId ?? null,
      cnpj: provider.cnpj,
      cnpj_normalized: normalizeCnpj(provider.cnpj),
      razao_social: provider.razaoSocial,
      nome_fantasia: provider.nomeFantasia,
      category: provider.category,
      description: provider.description,
      state: provider.state,
      city: provider.city,
      phone: provider.phone,
      email: provider.email,
      website: provider.website,
      services: provider.services,
      plan: provider.plan,
      verified: provider.verified,
      created_at: provider.createdAt,
      cnae: provider.cnae ?? null,
      cnae_descricao: provider.cnaeDescricao ?? null,
    });

  if (error) {
    throw error;
  }
}

export async function findProviderById(id: string): Promise<Provider | undefined> {
  const { data, error } = await supabaseServer
    .from("providers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? rowToProvider(data as ProviderRow) : undefined;
}

export async function updateProvider(id: string, patch: Partial<Provider>): Promise<Provider | null> {
  const updatePayload: Record<string, string | string[] | boolean | null> = {};

  if (patch.userId !== undefined) updatePayload.user_id = patch.userId;
  if (patch.cnpj !== undefined) {
    updatePayload.cnpj = patch.cnpj;
    updatePayload.cnpj_normalized = normalizeCnpj(patch.cnpj);
  }
  if (patch.razaoSocial !== undefined) updatePayload.razao_social = patch.razaoSocial;
  if (patch.nomeFantasia !== undefined) updatePayload.nome_fantasia = patch.nomeFantasia;
  if (patch.category !== undefined) updatePayload.category = patch.category;
  if (patch.description !== undefined) updatePayload.description = patch.description;
  if (patch.state !== undefined) updatePayload.state = patch.state;
  if (patch.city !== undefined) updatePayload.city = patch.city;
  if (patch.phone !== undefined) updatePayload.phone = patch.phone;
  if (patch.email !== undefined) updatePayload.email = patch.email;
  if (patch.website !== undefined) updatePayload.website = patch.website;
  if (patch.services !== undefined) updatePayload.services = patch.services;
  if (patch.plan !== undefined) updatePayload.plan = patch.plan;
  if (patch.verified !== undefined) updatePayload.verified = patch.verified;
  if (patch.createdAt !== undefined) updatePayload.created_at = patch.createdAt;
  if (patch.cnae !== undefined) updatePayload.cnae = patch.cnae;
  if (patch.cnaeDescricao !== undefined) updatePayload.cnae_descricao = patch.cnaeDescricao;

  const { data, error } = await supabaseServer
    .from("providers")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? rowToProvider(data as ProviderRow) : null;
}

export function generateId(): string {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
