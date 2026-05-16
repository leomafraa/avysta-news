import type { ImprovementSuggestion } from "@/types/improvementSuggestion";
import type { User } from "@/types/user";
import { supabaseServer } from "@/lib/supabaseServer";

type SuggestionRow = {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  user_type: User["type"];
  contact_name: string;
  company_name: string;
  suggestion: string;
  created_at: string;
};

function rowToSuggestion(row: SuggestionRow): ImprovementSuggestion {
  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email,
    userName: row.user_name,
    userType: row.user_type,
    nome: row.contact_name,
    empresa: row.company_name,
    sugestao: row.suggestion,
    createdAt: row.created_at,
  };
}

export async function createImprovementSuggestion(
  user: User,
  data: { nome: string; empresa: string; sugestao: string }
): Promise<ImprovementSuggestion> {
  const { data: row, error } = await supabaseServer
    .from("improvement_suggestions")
    .insert({
      user_id: user.id,
      user_email: user.email,
      user_name: user.name,
      user_type: user.type,
      contact_name: data.nome,
      company_name: data.empresa,
      suggestion: data.sugestao,
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return rowToSuggestion(row as SuggestionRow);
}
