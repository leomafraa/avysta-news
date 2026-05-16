import type { User } from "@/types/user";
import { supabaseServer } from "@/lib/supabaseServer";

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  phone_normalized: string;
  type: User["type"];
  company_trade_name: string | null;
  created_at: string;
  provider_id: string | null;
};

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    type: row.type,
    empresaNomeFantasia: row.company_trade_name ?? undefined,
    createdAt: row.created_at,
    providerId: row.provider_id ?? undefined,
  };
}

export async function readUsers(): Promise<User[]> {
  const { data, error } = await supabaseServer
    .from("users")
    .select("*");

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => rowToUser(row as UserRow));
}

export async function writeUsers(users: User[]): Promise<void> {
  const rows = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email.toLowerCase().trim(),
    phone: u.phone,
    phone_normalized: normalizePhone(u.phone),
    type: u.type,
    company_trade_name: u.empresaNomeFantasia?.trim() || null,
    created_at: u.createdAt,
    provider_id: u.providerId ?? null,
  }));

  const { error } = await supabaseServer
    .from("users")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    throw error;
  }
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const { data, error } = await supabaseServer
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? rowToUser(data as UserRow) : undefined;
}

export async function findUserByPhone(phone: string): Promise<User | undefined> {
  const { data, error } = await supabaseServer
    .from("users")
    .select("*")
    .eq("phone_normalized", normalizePhone(phone))
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? rowToUser(data as UserRow) : undefined;
}

export async function findUserById(id: string): Promise<User | undefined> {
  const { data, error } = await supabaseServer
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? rowToUser(data as UserRow) : undefined;
}

export async function createUser(user: User): Promise<void> {
  const { error } = await supabaseServer
    .from("users")
    .insert({
      id: user.id,
      name: user.name,
      email: user.email.toLowerCase().trim(),
      phone: user.phone,
      phone_normalized: normalizePhone(user.phone),
      type: user.type,
      company_trade_name: user.empresaNomeFantasia?.trim() || null,
      created_at: user.createdAt,
      provider_id: user.providerId ?? null,
    });

  if (error) {
    throw error;
  }
}

export async function updateUser(id: string, patch: Partial<User>): Promise<User | null> {
  const updatePayload: Record<string, string | null> = {};

  if (patch.name !== undefined) updatePayload.name = patch.name;
  if (patch.email !== undefined) updatePayload.email = patch.email.toLowerCase().trim();
  if (patch.phone !== undefined) {
    updatePayload.phone = patch.phone;
    updatePayload.phone_normalized = normalizePhone(patch.phone);
  }
  if (patch.type !== undefined) updatePayload.type = patch.type;
  if (patch.empresaNomeFantasia !== undefined) {
    updatePayload.company_trade_name = patch.empresaNomeFantasia.trim() || null;
  }
  if (patch.createdAt !== undefined) updatePayload.created_at = patch.createdAt;
  if (patch.providerId !== undefined) updatePayload.provider_id = patch.providerId;

  const { data, error } = await supabaseServer
    .from("users")
    .update(updatePayload)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? rowToUser(data as UserRow) : null;
}
