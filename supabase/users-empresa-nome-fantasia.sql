-- Legado: use company_trade_name (ver schema.sql ou rename-columns-to-english.sql)
alter table public.users
  add column if not exists company_trade_name text null;
