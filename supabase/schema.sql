create extension if not exists pgcrypto;

create table if not exists public.users (
  id text primary key,
  name text not null,
  email text not null unique,
  phone text not null,
  phone_normalized text not null unique,
  type text not null check (type in ('comprador', 'fornecedor')),
  company_trade_name text null,
  created_at timestamptz not null default now(),
  provider_id text null
);

create table if not exists public.providers (
  id text primary key,
  user_id text null unique references public.users(id) on delete set null,
  cnpj text not null,
  cnpj_normalized text not null unique,
  legal_name text not null,
  trade_name text not null,
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
  cnae_description text null
);

alter table public.users
  add constraint users_provider_fk
  foreign key (provider_id) references public.providers(id) on delete set null;

create index if not exists idx_providers_category on public.providers (category);
create index if not exists idx_providers_state on public.providers (state);
create index if not exists idx_providers_city on public.providers (city);

create table if not exists public.improvement_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users (id) on delete cascade,
  user_email text not null,
  user_name text not null,
  user_type text not null check (user_type in ('comprador', 'fornecedor')),
  contact_name text not null,
  company_name text not null,
  suggestion text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_improvement_suggestions_user_id
  on public.improvement_suggestions (user_id);

create index if not exists idx_improvement_suggestions_created_at
  on public.improvement_suggestions (created_at desc);
