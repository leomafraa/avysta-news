import crypto from "crypto";
import type { AuthToken, UserPublic } from "@/types/user";

const SECRET = process.env.AUTH_SECRET || "avysta-community-secret-2025";
const TOKEN_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

// ── Token creation / verification ────────────────────
export function createToken(payload: Omit<AuthToken, "exp">): string {
  const data: AuthToken = { ...payload, exp: Date.now() + TOKEN_TTL };
  const json = Buffer.from(JSON.stringify(data)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(json).digest("base64url");
  return `${json}.${sig}`;
}

export function verifyToken(token: string): AuthToken | null {
  try {
    const [json, sig] = token.split(".");
    if (!json || !sig) return null;
    const expected = crypto.createHmac("sha256", SECRET).update(json).digest("base64url");
    if (expected !== sig) return null;
    const data = JSON.parse(Buffer.from(json, "base64url").toString()) as AuthToken;
    if (data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

// ── Helpers ───────────────────────────────────────────
export function generateUserId(): string {
  return `u${Date.now().toString(36)}${crypto.randomBytes(3).toString("hex")}`;
}

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "comprador" | "fornecedor";
  createdAt: string;
  providerId?: string;
};

export function toPublic(user: User): UserPublic {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    type: user.type,
    createdAt: user.createdAt,
    providerId: user.providerId,
  };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, "").length >= 10;
}
