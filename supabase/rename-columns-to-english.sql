-- Padroniza nomes de colunas em inglês (rode uma vez no SQL Editor).
-- Faça backup antes. Depois disso, o código em src/lib/*Store.ts já usa estes nomes.

BEGIN;

ALTER TABLE public.users
  RENAME COLUMN empresa_nome_fantasia TO company_trade_name;

ALTER TABLE public.providers
  RENAME COLUMN razao_social TO legal_name;

ALTER TABLE public.providers
  RENAME COLUMN nome_fantasia TO trade_name;

ALTER TABLE public.providers
  RENAME COLUMN cnae_descricao TO cnae_description;

ALTER TABLE public.improvement_suggestions
  RENAME COLUMN nome TO contact_name;

ALTER TABLE public.improvement_suggestions
  RENAME COLUMN empresa TO company_name;

ALTER TABLE public.improvement_suggestions
  RENAME COLUMN sugestao TO suggestion;

COMMIT;
