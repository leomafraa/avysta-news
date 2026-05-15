-- Nome fantasia da empresa do comprador (opcional para fornecedores)
alter table public.users
  add column if not exists empresa_nome_fantasia text null;
