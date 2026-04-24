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

## 🗄️ Armazenamento de Dados

O projeto usa arquivos JSON como banco de dados em memória/disco (sem banco externo). Os dados ficam em `src/data/`:

| Arquivo | O que armazena | Store |
|---|---|---|
| `src/data/users.json` | Todos os usuários — compradores e fornecedores — diferenciados pelo campo `type` | `src/lib/usersStore.ts` |
| `src/data/providers.json` | Empresas cadastradas no diretório de fornecedores | `src/lib/providersStore.ts` |

### Relação entre usuários e empresas

Compradores e fornecedores compartilham a mesma tabela de usuários. O campo `type` define o perfil:

```json
{ "id": "u123", "name": "João Silva", "type": "comprador", ... }
{ "id": "u456", "name": "Maria Costa", "type": "fornecedor", "providerId": "p789", ... }
```

Quando um fornecedor cadastra sua empresa, o campo `providerId` é preenchido com o ID correspondente em `providers.json`. Cada fornecedor pode ter **no máximo uma empresa** cadastrada.

```
users.json          providers.json
┌──────────────┐    ┌─────────────────────┐
│ id: "u456"   │    │ id: "p789"          │
│ type: "forn."│───▶│ userId: "u456"      │
│ providerId: ─┼───▶│ nomeFantasia: "..." │
│   "p789"     │    │ cnpj: "..."         │
└──────────────┘    └─────────────────────┘
```

> **Nota:** Para produção, recomenda-se substituir os arquivos JSON por um banco de dados real (PostgreSQL, MongoDB, etc.).

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

## 🌐 Deploy & Hospedagem

### Opções de host recomendadas

| Plataforma | Plano gratuito | Ideal para | Observação |
|---|---|---|---|
| [Vercel](https://vercel.com) | ✅ Sim | Produção (Next.js nativo) | Deploy automático por push |
| [Railway](https://railway.app) | ✅ Sim (limitado) | Produção com banco de dados | Suporte a volumes persistentes |
| [Render](https://render.com) | ✅ Sim | Staging / produção | Deploy via Dockerfile ou Node |
| [Fly.io](https://fly.io) | ✅ Sim (limitado) | Produção global | Deploy via CLI |

### Deploy na Vercel (recomendado)

```bash
# 1. Instalar CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy de preview (branch atual)
vercel

# 4. Deploy em produção
vercel --prod
```

> A Vercel detecta automaticamente projetos Next.js. Basta conectar o repositório GitHub em [vercel.com/new](https://vercel.com/new) para ter deploy automático a cada push.

### Deploy em Railway / Render / Fly.io

```bash
npm run build
npm run start
```

### Variáveis de ambiente

Crie um arquivo `.env.local` para desenvolvimento local:

```env
NEXT_PUBLIC_BASE_URL=https://seudominio.com.br
AUTH_SECRET=seu-segredo-jwt-aqui
```

Configure as mesmas variáveis no painel da plataforma escolhida (Vercel → Settings → Environment Variables, Railway → Variables, etc.).

---

## ⚙️ CI/CD

### Fluxo recomendado (GitHub Actions + Vercel)

```
push / pull request
        │
        ▼
┌───────────────────┐
│  GitHub Actions   │  lint + type-check + build
└────────┬──────────┘
         │ aprovado
         ▼
┌───────────────────┐
│  Vercel Preview   │  deploy automático de PR (URL única por branch)
└────────┬──────────┘
         │ merge na main
         ▼
┌───────────────────┐
│ Vercel Production │  deploy automático em produção
└───────────────────┘
```

### Configurar GitHub Actions

Crie o arquivo `.github/workflows/ci.yml` no repositório:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_BASE_URL: ${{ secrets.NEXT_PUBLIC_BASE_URL }}
          AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
```

### Configurar secrets no GitHub

Acesse **Settings → Secrets and variables → Actions** no repositório e adicione:

| Secret | Descrição |
|---|---|
| `AUTH_SECRET` | Chave secreta para assinar os tokens JWT |
| `NEXT_PUBLIC_BASE_URL` | URL pública da aplicação em produção |

### Deploy automático via Vercel + GitHub

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório
2. A Vercel cria automaticamente:
   - **Production** → deploy a cada push na branch `main`
   - **Preview** → deploy a cada Pull Request (URL única por PR)
3. As variáveis de ambiente configuradas na Vercel são injetadas automaticamente no build

### Estratégia de branches sugerida

```
main        → produção (deploy automático)
develop     → staging / homologação
feature/*   → desenvolvimento de funcionalidades (PR → develop)
fix/*       → correções (PR → main ou develop)
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
