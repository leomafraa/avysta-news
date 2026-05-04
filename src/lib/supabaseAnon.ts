import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing Supabase anon/publishable key. Set NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
  );
}

const url = supabaseUrl;
const anonKey = supabaseAnonKey;

let authClient: SupabaseClient | null = null;

/** Singleton client with the anon (publishable) key — use for signUp, signIn, resetPassword, refreshSession in Route Handlers. */
export function getSupabaseAuthClient(): SupabaseClient {
  if (!authClient) {
    authClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return authClient;
}
