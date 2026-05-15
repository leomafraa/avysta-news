export type UserType = "comprador" | "fornecedor";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  /** Nome fantasia da empresa (compradores) */
  empresaNomeFantasia?: string;
  createdAt: string;
  providerId?: string;
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  empresaNomeFantasia?: string;
  createdAt: string;
  providerId?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  type: UserType;
  password: string;
  /** Obrigatório quando type === comprador */
  empresaNomeFantasia?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserPublic;
  token: string;
  refreshToken: string;
}

export interface RegisterPendingResponse {
  needsEmailConfirmation: true;
  message: string;
}
