import type { UserPublic, UserType } from "@/types/user";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "comprador" | "fornecedor";
  empresaNomeFantasia?: string;
  createdAt: string;
  providerId?: string;
};

/** Rota inicial após login/cadastro conforme o tipo de conta. */
export function getDefaultRouteForUserType(type: UserType): string {
  return type === "fornecedor" ? "/fornecedores" : "/noticias";
}

/** Respeita `?next=` quando informado; senão usa a rota padrão do tipo. */
export function getPostLoginRoute(user: { type: UserType }, next?: string | null): string {
  const trimmed = next?.trim();
  if (trimmed && trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }
  return getDefaultRouteForUserType(user.type);
}

export function toPublic(user: User): UserPublic {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    type: user.type,
    empresaNomeFantasia: user.empresaNomeFantasia,
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

export function isValidPassword(password: string): boolean {
  return typeof password === "string" && password.length >= 8;
}
