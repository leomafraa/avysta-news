export type MaterialCategory =
  | "todos"
  | "estrutura"
  | "alvenaria"
  | "cobertura"
  | "instalacoes"
  | "acabamento";

export type ImpactLevel = "alto" | "medio" | "baixo";
export type Trend = "alta" | "queda" | "estavel";

export interface Material {
  id: string;
  name: string;
  description: string;
  unit: string;
  category: MaterialCategory;
  /** SINAPI national average baseline price (R$) */
  basePrice: number;
  impact: ImpactLevel;
  emoji: string;
  tips: string[];
  /** % of total construction cost this item represents */
  costShare: number;
}

export interface MaterialWithPrice extends Material {
  currentPrice: number;
  priceMin: number;
  priceMax: number;
  variation30d: number;
  variation12m: number;
  trend: Trend;
  updatedAt: string;
}

export interface INCCDataPoint {
  date: string;     // "MM/YYYY"
  value: number;    // monthly variation %
}

export interface INCCData {
  history: INCCDataPoint[];
  latest: number;        // last monthly variation %
  accumulated12m: number; // accumulated 12-month variation %
  updatedAt: string;
}

export interface CotacoesApiResponse {
  materials: MaterialWithPrice[];
  incc: INCCData;
  cachedAt: string;
  source: string;
}
