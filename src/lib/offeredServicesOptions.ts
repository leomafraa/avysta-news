/** Opções fixas de "Serviços oferecidos" no cadastro de empresa (seleção múltipla). */
export const OFFERED_SERVICES_OPTIONS = [
  "Alarmes e Segurança",
  "Andaimes",
  "Aquecedor Solar",
  "Aquecedores Solares",
  "Ar Condicionado",
  "Areia e Pedra",
  "Automação Residencial",
  "Banheira de Hidromassagem",
  "Básico ao Acabamento",
  "Blocos e Tijolos",
  "Caçambas",
  "Calhas",
  "Churrasqueiras",
  "Cimento Cal e Argamassa",
  "Cobertura Metálica",
  "Coifas",
  "Colchões",
  "Construção Civil",
  "Construtoras",
  "Controle de Pragas",
  "Corrimão",
  "Cortinas",
  "Decoração",
  "Design de Interiores",
  "Elétrica e Instalações",
  "Eletricistas e Instaladores",
  "Energia Solar",
  "Esquadrias em Alumínio",
  "Estruturas Metálicas",
  "Fechaduras",
  "Ferragens Armadas",
  "Ferramentas",
  "Fios",
  "Gesso",
  "Iluminação",
  "Impermeabilização",
  "Lajes",
  "Locação de Máquinas",
  "Louças e Metais",
  "Madeireiras",
  "Marcenarias",
  "Marmorarias",
  "Materiais Elétricos",
  "Materiais Hidráulicos",
  "Material de Construção",
  "Móveis e Decoração",
  "Móveis Planejados",
  "Papel de Parede",
  "Pedras Decorativas",
  "Piscinas",
  "Pisos",
  "Pisos Cimentícios",
  "Pisos e Revestimentos",
  "Pisos Laminados",
  "Pisos Vinílicos",
  "Portas e Acessórios",
  "Portões",
  "Poste Padrão",
  "Redução de INSS",
  "Refrigeração",
  "Revestimentos",
  "Serralherias",
  "Spas e Ofurôs",
  "Telhado Galvanizado",
  "Telhas",
  "Tijolos e Revestimentos",
  "Tintas",
  "Vidraçarias",
  "Outros",
] as const;

const OPTION_SET = new Set<string>(OFFERED_SERVICES_OPTIONS);

/** Reconhece rótulos da lista em dados antigos (array ou texto com vírgulas). */
export function normalizeSelectedOfferedServices(services: string[] | undefined): string[] {
  if (!services?.length) return [];
  const out = new Set<string>();
  for (const entry of services) {
    for (const part of entry.split(",").map((s) => s.trim()).filter(Boolean)) {
      if (OPTION_SET.has(part)) out.add(part);
    }
  }
  return [...out];
}
