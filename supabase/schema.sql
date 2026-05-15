create extension if not exists pgcrypto;

create table if not exists public.users (
  id text primary key,
  name text not null,
  email text not null unique,
  phone text not null,
  phone_normalized text not null unique,
  type text not null check (type in ('comprador', 'fornecedor')),
  empresa_nome_fantasia text null,
  created_at timestamptz not null default now(),
  provider_id text null
);

create table if not exists public.providers (
  id text primary key,
  user_id text null unique references public.users(id) on delete set null,
  cnpj text not null,
  cnpj_normalized text not null unique,
  razao_social text not null,
  nome_fantasia text not null,
  category text not null,
  description text not null default '',
  state text not null,
  city text not null,
  phone text not null,
  email text not null,
  website text not null default '',
  services text[] not null default '{}',
  plan text not null check (plan in ('gratuito', 'verificado', 'premium')),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  cnae text null,
  cnae_descricao text null
);

alter table public.users
  add constraint users_provider_fk
  foreign key (provider_id) references public.providers(id) on delete set null;

create index if not exists idx_providers_category on public.providers (category);
create index if not exists idx_providers_state on public.providers (state);
create index if not exists idx_providers_city on public.providers (city);
