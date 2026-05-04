import type { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { findUserById } from "@/lib/usersStore";
import type { User } from "@/types/user";

export function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization") || "";
  const fromHeader = auth.replace(/^Bearer\s+/i, "").trim();
  if (fromHeader) return fromHeader;
  return request.cookies.get("avysta_auth")?.value?.trim() || null;
}

/** Validates the Supabase access token and loads the matching row from public.users. */
export async function getUserFromAccessToken(accessToken: string): Promise<User | null> {
  const { data: { user: authUser }, error } = await supabaseServer.auth.getUser(accessToken);
  if (error || !authUser?.id) return null;
  return (await findUserById(authUser.id)) ?? null;
}
