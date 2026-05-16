-- Sugestões de melhoria enviadas pelos usuários autenticados
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
