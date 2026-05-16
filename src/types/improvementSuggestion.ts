import type { UserType } from "@/types/user";

export interface ImprovementSuggestion {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userType: UserType;
  nome: string;
  empresa: string;
  sugestao: string;
  createdAt: string;
}

export interface CreateImprovementSuggestionPayload {
  nome: string;
  empresa: string;
  sugestao: string;
}
