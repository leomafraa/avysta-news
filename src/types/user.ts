export type UserType = "comprador" | "fornecedor";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  createdAt: string;
  providerId?: string;
}

export interface UserPublic {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  createdAt: string;
  providerId?: string;
}

export interface AuthToken {
  userId: string;
  type: UserType;
  exp: number;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  type: UserType;
}

export interface LoginPayload {
  credential: string; // email or phone
}

export interface AuthResponse {
  user: UserPublic;
  token: string;
}
