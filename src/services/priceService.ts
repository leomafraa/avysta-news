import type {
  Material,
  MaterialWithPrice,
  INCCData,
  INCCDataPoint,
  Trend,
} from "@/types/prices";

// ---------------------------------------------------------------------------
// 80/20 materials — based on SINAPI national reference table (baseline: 2024)
// These 14 inputs account for ~80% of cost variation in Brazilian construction
// ---------------------------------------------------------------------------
export const MATERIALS: Material[] = [
  // ── ESTRUTURA (30–35% do custo total) ──────────────────────────────────
  {
    id: "cimento-cpii",
    name: "Cimento Portland CP II-E-32",
    description: "Principal aglomerante da construção civil. Alta sensibilidade a variações de energia e logística.",
    unit: "saco 50 kg",
    category: "estrutura",
    basePrice: 38.50,
    impact: "alto",
    emoji: "🏭",
    costShare: 8,
    tips: [
      "Compre em quantidade para garantir lote do mesmo fabricante",
      "Estoque máximo: 3 meses (umidade degrada)",
      "Compare marcas nacionais — qualidade é regulada pela ABNT NBR 11578",
      "Evite comprar em períodos de alta do câmbio (afeta custo de energia das fábricas)",
    ],
  },
  {
    id: "aco-ca50",
    name: "Vergalhão de Aço CA-50",
    description: "Aço para armadura de concreto. Preço atrelado ao mercado internacional do minério de ferro.",
    unit: "kg",
    category: "estrutura",
    basePrice: 6.40,
    impact: "alto",
    emoji: "⚙️",
    costShare: 9,
    tips: [
      "Feche contrato para entrega parcelada ao invés de comprar tudo de uma vez",
      "Acompanhe o índice de minério de ferro — antecipa variações em 30–60 dias",
      "Barras de 12m têm menor desperdício que barras de 6m para a maioria das obras",
      "Negocie com distribuidores regionais — margem menor que grandes redes",
    ],
  },
  {
    id: "brita-1",
    name: "Brita Nº 1",
    description: "Agregado graúdo para concreto. Custo fortemente influenciado pelo frete e localização.",
    unit: "m³",
    category: "estrutura",
    basePrice: 155.00,
    impact: "medio",
    emoji: "🪨",
    costShare: 5,
    tips: [
      "Priorize fornecedores locais — frete pode ser maior que o custo do produto",
      "Peça laudos de ensaio: granulometria incorreta compromete resistência do concreto",
      "Compre para a obra toda de uma vez para fixar o preço",
    ],
  },
  {
    id: "areia-lavada",
    name: "Areia Lavada Média",
    description: "Agregado miúdo essencial para argamassas e concreto. Preço varia muito por região.",
    unit: "m³",
    category: "estrutura",
    basePrice: 115.00,
    impact: "medio",
    emoji: "🏜️",
    costShare: 4,
    tips: [
      "Exija areia lavada — areia de construção suja aumenta consumo de cimento",
      "Verifique teor de argila antes de comprar (pode comprometer aderência)",
      "Regiões próximas de rios costumam ter preços menores",
    ],
  },

  // ── ALVENARIA (10–12% do custo total) ───────────────────────────────────
  {
    id: "tijolo-8furos",
    name: "Tijolo Cerâmico 8 Furos",
    description: "Vedação padrão da construção brasileira. Preço impactado por custo de energia das cerâmicas.",
    unit: "milheiro",
    category: "alvenaria",
    basePrice: 590.00,
    impact: "alto",
    emoji: "🧱",
    costShare: 7,
    tips: [
      "Compre o lote completo — tijolos de lotes diferentes variam em dimensão",
      "Exija tolerância dimensional ABNT: variação de até 3mm por peça",
      "Tijolo com furo horizontal tem maior desempenho térmico",
      "Calcule com folga de 5–8% para quebras e recortes",
    ],
  },
  {
    id: "bloco-concreto",
    name: "Bloco de Concreto Estrutural",
    description: "Alvenaria estrutural sem necessidade de pilares. Reduz custo de concreto e aço.",
    unit: "unidade (14×19×39 cm)",
    category: "alvenaria",
    basePrice: 4.80,
    impact: "medio",
    emoji: "🔲",
    costShare: 4,
    tips: [
      "Alvenaria estrutural pode reduzir o custo total da obra em até 15%",
      "Exija resistência mínima de 4 MPa para paredes externas",
      "Use modulação 3D antes de comprar — evita cortes e desperdício",
    ],
  },

  // ── COBERTURA (8–10% do custo total) ────────────────────────────────────
  {
    id: "telha-ceramica",
    name: "Telha Cerâmica Colonial",
    description: "Cobertura mais comum no Brasil. Preço influenciado por custo de gás das cerâmicas.",
    unit: "milheiro",
    category: "cobertura",
    basePrice: 960.00,
    impact: "alto",
    emoji: "🏠",
    costShare: 5,
    tips: [
      "Compre do mesmo lote para garantir uniformidade de cor e dimensão",
      "Calcule com 10% a mais para quebras e beirais",
      "Telha esmaltada tem maior durabilidade mas custa 30–50% mais",
      "Compare com telha de concreto para obras de maior porte",
    ],
  },
  {
    id: "madeira-pinus",
    name: "Madeira Pinus (Estrutura de Telhado)",
    description: "Principal material para a estrutura de cobertura. Preço acompanha dólar e demanda de exportação.",
    unit: "m³",
    category: "cobertura",
    basePrice: 1850.00,
    impact: "alto",
    emoji: "🌲",
    costShare: 6,
    tips: [
      "Exija certificado de reflorestamento (FSC ou CERFLOR)",
      "Madeira tratada com CCA dura 3–5x mais que sem tratamento",
      "Alternativa: treliças de aço galvanizado para vãos maiores",
      "Compre com 15% de umidade ou menos — madeira verde retorce",
    ],
  },

  // ── INSTALAÇÕES (15–18% do custo total) ─────────────────────────────────
  {
    id: "fio-eletrico-25",
    name: "Fio de Cobre Flexível 2,5 mm²",
    description: "Condutor elétrico mais usado em residências. Preço extremamente sensível ao preço do cobre.",
    unit: "metro",
    category: "instalacoes",
    basePrice: 3.40,
    impact: "alto",
    emoji: "⚡",
    costShare: 5,
    tips: [
      "Compre rolos completos de 100m — custo unitário menor",
      "Fio com selo ABNT garante bitola real (alguns fabricantes entregam menor)",
      "Especifique isolamento 70°C para áreas úmidas",
      "Acompanhe o preço do cobre na B3 — antecipa alta em 2–3 semanas",
    ],
  },
  {
    id: "tubo-pvc-25",
    name: "Tubo PVC Soldável 25 mm",
    description: "Tubulação hidráulica mais utilizada. Preço atrelado ao petróleo (PVC é derivado).",
    unit: "barra 6 m",
    category: "instalacoes",
    basePrice: 24.00,
    impact: "medio",
    emoji: "🔧",
    costShare: 3,
    tips: [
      "Compare Série A vs Série B — Série A tem parede mais grossa e maior durabilidade",
      "Evite compras em períodos de alta do petróleo",
      "Solicite laudo de impacto Izod para confirmar qualidade",
    ],
  },

  // ── ACABAMENTO (20–25% do custo total) ──────────────────────────────────
  {
    id: "porcelanato-60",
    name: "Porcelanato Retificado 60×60 cm",
    description: "Revestimento de alto padrão. Alta variação de preço entre marcas e espessuras.",
    unit: "m²",
    category: "acabamento",
    basePrice: 79.00,
    impact: "alto",
    emoji: "🪟",
    costShare: 8,
    tips: [
      "Compre 10% a mais para reposições futuras — produção muda constantemente",
      "Espessura 10mm tem maior resistência a tráfego intenso",
      "PEI 4 ou 5 para áreas de circulação intensa",
      "Compare Absorção de água: < 0,5% = porcelanato técnico (melhor qualidade)",
    ],
  },
  {
    id: "tinta-latex-18l",
    name: "Tinta Látex Acrílica (Premium)",
    description: "Acabamento de paredes e tetos. Preço fortemente afetado pelo custo do TiO₂ (dióxido de titânio).",
    unit: "lata 18 L",
    category: "acabamento",
    basePrice: 235.00,
    impact: "alto",
    emoji: "🎨",
    costShare: 5,
    tips: [
      "Rendimento real das tintas premium é 30–40% maior — custo/m² pode ser menor",
      "Verifique viscosidade KU: 100–110 KU é ideal para pintura a rolo",
      "Cores especiais têm menor desconto — prefira cores de linha para negociar",
      "Aproveite promoções de fim de estação (março–abril e agosto–setembro)",
    ],
  },
  {
    id: "argamassa-acii",
    name: "Argamassa Colante ACII",
    description: "Para assentamento de cerâmicas e porcelanatos em áreas úmidas e externas.",
    unit: "saco 20 kg",
    category: "acabamento",
    basePrice: 23.50,
    impact: "medio",
    emoji: "🪣",
    costShare: 3,
    tips: [
      "ACII é obrigatório para porcelanatos — ACII tem maior poder de aderência",
      "Nunca estocar mais de 6 meses — perde resistência mesmo fechado",
      "Para fachadas externas, use ACIII ou adesivo epóxi",
    ],
  },
  {
    id: "drywall-parede",
    name: "Drywall — Parede Simples",
    description: "Alternativa à alvenaria para paredes internas. Crescente adoção por reduzir prazo de obra.",
    unit: "m² (montado)",
    category: "acabamento",
    basePrice: 88.00,
    impact: "medio",
    emoji: "🗂️",
    costShare: 4,
    tips: [
      "Drywall reduz o prazo de obra em até 40% comparado à alvenaria",
      "Especifique chapas RU (resistente à umidade) em banheiros e cozinhas",
      "Chapas de 15mm têm melhor isolamento acústico que as de 12,5mm",
      "Inclua custo de calha e montante no orçamento — frequentemente esquecidos",
    ],
  },
];

// ---------------------------------------------------------------------------
// BCB API — INCC-DI série 192 (Índice Nacional de Custo da Construção)
// Fonte oficial: Banco Central do Brasil — sem autenticação necessária
// ---------------------------------------------------------------------------
const BCB_INCC_URL =
  "https://api.bcb.gov.br/dados/serie/bcdata.sgs.192/dados/ultimos/14?formato=json";

interface BCBDataPoint {
  data: string;   // "DD/MM/YYYY"
  valor: string;  // decimal as string
}

export async function fetchINCCFromBCB(): Promise<INCCData> {
  const res = await fetch(BCB_INCC_URL, {
    next: { revalidate: 86400 }, // Cache for 24h — INCC updates monthly
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`BCB API error: ${res.status}`);

  const raw: BCBDataPoint[] = await res.json();

  const history: INCCDataPoint[] = raw.map((p) => {
    const [, month, year] = p.data.split("/");
    return {
      date: `${month}/${year}`,
      value: parseFloat(p.valor),
    };
  });

  // Accumulated 12 months: compound the monthly variations
  const last12 = history.slice(-12);
  const accumulated12m =
    last12.reduce((acc, p) => acc * (1 + p.value / 100), 1) * 100 - 100;

  return {
    history: last12,
    latest: last12[last12.length - 1]?.value ?? 0,
    accumulated12m: parseFloat(accumulated12m.toFixed(2)),
    updatedAt: new Date().toISOString(),
  };
}

// Fallback static INCC data when BCB API is unreachable
export function getStaticINCCFallback(): INCCData {
  const months = [
    { date: "05/2024", value: 0.57 },
    { date: "06/2024", value: 0.46 },
    { date: "07/2024", value: 0.43 },
    { date: "08/2024", value: 0.51 },
    { date: "09/2024", value: 0.55 },
    { date: "10/2024", value: 0.44 },
    { date: "11/2024", value: 0.47 },
    { date: "12/2024", value: 0.48 },
    { date: "01/2025", value: 0.63 },
    { date: "02/2025", value: 0.58 },
    { date: "03/2025", value: 0.72 },
    { date: "04/2025", value: 0.65 },
  ];
  const accumulated12m =
    months.reduce((acc, p) => acc * (1 + p.value / 100), 1) * 100 - 100;
  return {
    history: months,
    latest: months[months.length - 1].value,
    accumulated12m: parseFloat(accumulated12m.toFixed(2)),
    updatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Apply INCC variation to SINAPI base prices to get current estimates
// ---------------------------------------------------------------------------
export function buildMaterialsWithPrices(
  incc: INCCData
): MaterialWithPrice[] {
  const factor = 1 + incc.accumulated12m / 100;

  return MATERIALS.map((m) => {
    const currentPrice = parseFloat((m.basePrice * factor).toFixed(2));
    const variation12m = incc.accumulated12m;
    const trend: Trend =
      incc.latest > 0.5 ? "alta" : incc.latest < 0.1 ? "queda" : "estavel";

    return {
      ...m,
      currentPrice,
      priceMin: parseFloat((currentPrice * 0.88).toFixed(2)),
      priceMax: parseFloat((currentPrice * 1.18).toFixed(2)),
      variation30d: incc.latest,
      variation12m,
      trend,
      updatedAt: incc.updatedAt,
    };
  });
}
