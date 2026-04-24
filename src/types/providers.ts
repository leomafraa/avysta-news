export type ProviderCategory =
  | "todos"
  | "construtora"
  | "materiais"
  | "eletrica"
  | "hidraulica"
  | "acabamento"
  | "projeto"
  | "equipamentos"
  | "esquadrias"
  | "outros";

export type ProviderPlan = "gratuito" | "verificado" | "premium";

export interface Provider {
  id: string;
  userId?: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  category: ProviderCategory;
  description: string;
  state: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  services: string[];
  plan: ProviderPlan;
  verified: boolean;
  createdAt: string;
  /** CNAE code from Receita Federal */
  cnae?: string;
  cnaeDescricao?: string;
}

export interface ProviderFilters {
  search?: string;
  category?: ProviderCategory;
  state?: string;
  page?: number;
}

export interface ProvidersApiResponse {
  providers: Provider[];
  total: number;
  page: number;
  totalPages: number;
  stats: {
    total: number;
    verified: number;
    states: number;
    categories: number;
  };
}

export interface CnpjApiData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  cnae: string;
  cnaeDescricao: string;
  situacao: string;
}
