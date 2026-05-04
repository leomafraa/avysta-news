-- Execute no SQL Editor do Supabase (ou em migration).
alter table public.providers add column if not exists logo_url text;

-- Storage: criar bucket "provider-logos" (ou outro nome → SUPABASE_PROVIDER_LOGO_BUCKET no .env do Next).
-- Marque o bucket como público se quiser URL pública nas páginas.
--
-- Upload no servidor (Next API) usa SUPABASE_SERVICE_ROLE_KEY em .env.
-- Sem a service_role, o código pode cair na chave anon/publishable e o Storage bloqueia (RLS).
-- Copie em: Supabase Dashboard → Settings → API → project API keys → service_role (secret).
