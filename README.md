# 🏗️ Avysta News

Portal de notícias profissional sobre construção civil no Brasil. Agrega feeds RSS de múltiplas fontes em tempo real.

## ✨ Funcionalidades

- **Agregação de RSS em tempo real** — 8 feeds do Google News cobrem materiais, mercado imobiliário, infraestrutura, tecnologia, sustentabilidade, financiamento e legislação
- **Busca por palavra-chave** com debounce (⌘K para focar)
- **Filtro por categoria** com 8 categorias temáticas
- **Destaque automático** — notícias importantes são identificadas por palavras-chave
- **Página de detalhes** com SSR e meta tags dinâmicas para SEO
- **Dark mode** com suporte a preferência do sistema e persistência
- **Cache em memória** (15 min) para evitar sobrecarregar os feeds
- **Paginação** com 12 notícias por página
- **Design responsivo** e moderno com Tailwind CSS
- **CORS resolvido** via API interna (o frontend nunca acessa RSS diretamente)

## 🚀 Como instalar e rodar

### Pré-requisitos

- **Node.js >= 18.17** ([baixar aqui](https://nodejs.org))
- npm, yarn ou pnpm

### 1. Instalar dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 2. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### 3. Build para produção

```bash
npm run build
npm run start
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz com metadados SEO globais
│   ├── page.tsx            # Página inicial
│   ├── not-found.tsx       # Página 404
│   ├── loading.tsx         # Loading global
│   ├── globals.css         # Estilos globais (Tailwind)
│   ├── api/
│   │   └── news/
│   │       ├── route.ts          # GET /api/news (lista paginada e filtrada)
│   │       └── [slug]/route.ts   # GET /api/news/:slug (detalhe)
│   └── news/
│       └── [slug]/page.tsx # Página de detalhe (SSR)
│
├── components/
│   ├── Header.tsx          # Cabeçalho responsivo com nav + dark mode
│   ├── Footer.tsx          # Rodapé com links e categorias
│   ├── NewsGrid.tsx        # Grid client-side com busca, filtro e paginação
│   ├── NewsCard.tsx        # Card de notícia (normal e featured)
│   ├── SearchBar.tsx       # Input de busca com atalho ⌘K
│   ├── CategoryFilter.tsx  # Botões de filtro por categoria
│   ├── Pagination.tsx      # Paginação com ellipsis
│   ├── ThemeProvider.tsx   # Context de tema (dark/light)
│   └── Icons.tsx           # Ícones SVG inline
│
├── services/
│   └── rssService.ts       # Parsing de RSS, detecção de categoria, deduplicação
│
├── lib/
│   └── cache.ts            # Cache em memória singleton
│
└── types/
    └── news.ts             # Tipos TypeScript
```

## 🔌 API Interna

### `GET /api/news`

Retorna lista de notícias paginada e filtrada.

**Query params:**

| Parâmetro | Tipo   | Default  | Descrição                                      |
|-----------|--------|----------|------------------------------------------------|
| `search`  | string | `""`     | Termo de busca                                 |
| `category`| string | `"todos"`| Categoria (materiais, mercado, infraestrutura…)|
| `page`    | number | `1`      | Página atual                                   |
| `sortBy`  | string | `"date"` | Ordenação (apenas `date` suportado)            |

**Resposta:**
```json
{
  "news": [...],
  "total": 45,
  "page": 1,
  "pageSize": 12,
  "totalPages": 4,
  "cachedAt": "2024-01-01T12:00:00.000Z"
}
```

### `GET /api/news/:slug`

Retorna um item de notícia pelo slug.

## 🌐 Deploy

### Vercel (recomendado)

```bash
# Instalar CLI da Vercel
npm i -g vercel

# Deploy
vercel

# Deploy em produção
vercel --prod
```

### Railway / Render / Fly.io

```bash
npm run build
npm run start
```

### Variáveis de ambiente (opcional)

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_BASE_URL=https://seudominio.com.br
```

## 🔧 Personalização

### Adicionar mais feeds RSS

Edite o array `RSS_FEEDS` em `src/services/rssService.ts`:

```typescript
{
  url: "https://seu-site.com.br/feed.xml",
  sourceName: "Nome do Site",
  category: "mercado", // materiais | mercado | infraestrutura | ...
},
```

### Ajustar TTL do cache

Edite `src/lib/cache.ts`:

```typescript
export const CACHE_TTL = {
  NEWS_LIST: 15 * 60,   // 15 minutos
  NEWS_DETAIL: 30 * 60, // 30 minutos
};
```

### Alterar notícias por página

Edite a constante `PAGE_SIZE` em `src/app/api/news/route.ts`.

## 🗺️ Roadmap (Features futuras)

- [ ] Área Premium com conteúdo exclusivo
- [ ] Newsletter por email (Resend / SendGrid)
- [ ] Alertas personalizados por categoria
- [ ] Favoritos locais
- [ ] Compartilhamento social

## 🛠️ Stack

| Tecnologia   | Versão  | Uso                              |
|--------------|---------|----------------------------------|
| Next.js      | 14.x    | Framework full-stack com App Router |
| React        | 18.x    | UI                               |
| TypeScript   | 5.x     | Tipagem estática                 |
| Tailwind CSS | 3.x     | Estilização                      |
| rss-parser   | 3.x     | Parsing de feeds RSS             |
| date-fns     | 3.x     | Formatação de datas              |
| slugify      | 1.x     | Geração de slugs para URLs       |

## 📄 Licença

MIT © Avysta
