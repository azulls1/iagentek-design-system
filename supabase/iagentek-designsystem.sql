-- ============================================================
-- IAgentek Design System Playground — Schema completo
-- Ejecutar en Supabase Studio (SQL Editor) o via psql server-side.
-- Idempotente: se puede correr varias veces sin romper nada.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tabla: iagentek-designsystem-templates
--    Plantillas de tema personalizadas por usuario.
--    Las plantillas DEFAULT viven en codigo (DEFAULT_TEMPLATES);
--    aqui solo se persisten las que el usuario crea/importa.
-- ------------------------------------------------------------
create table if not exists public."iagentek-designsystem-templates" (
  id           text        not null,
  user_id      text        not null,
  name         text        not null,
  color        text        not null,                 -- hex base, ej "#04202C"
  short        text,                                  -- 2 chars (ej "IA")
  sort_order   integer     not null default 0,
  palette      jsonb,                                 -- override completo opcional
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  primary key (id, user_id)
);

create index if not exists "iagentek-ds-templates-user-idx"
  on public."iagentek-designsystem-templates" (user_id);

alter table public."iagentek-designsystem-templates" enable row level security;

drop policy if exists "tpl_user_select" on public."iagentek-designsystem-templates";
create policy "tpl_user_select" on public."iagentek-designsystem-templates"
  for select using (auth.uid()::text = user_id);

drop policy if exists "tpl_user_insert" on public."iagentek-designsystem-templates";
create policy "tpl_user_insert" on public."iagentek-designsystem-templates"
  for insert with check (auth.uid()::text = user_id);

drop policy if exists "tpl_user_update" on public."iagentek-designsystem-templates";
create policy "tpl_user_update" on public."iagentek-designsystem-templates"
  for update using (auth.uid()::text = user_id);

drop policy if exists "tpl_user_delete" on public."iagentek-designsystem-templates";
create policy "tpl_user_delete" on public."iagentek-designsystem-templates"
  for delete using (auth.uid()::text = user_id);


-- ------------------------------------------------------------
-- 2. Tabla: iagentek-designsystem-overrides
--    Color overrides por usuario. La columna `id` ES el user_id
--    (asi lo usa el codigo: .eq("id", uid) y upsert({ id: uid })).
--    `overrides` es un jsonb anidado: { templateId: { "key.prop": "#hex" } }.
-- ------------------------------------------------------------
create table if not exists public."iagentek-designsystem-overrides" (
  id          text        primary key,                   -- == user_id
  overrides   jsonb       not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public."iagentek-designsystem-overrides" enable row level security;

drop policy if exists "ov_user_select" on public."iagentek-designsystem-overrides";
create policy "ov_user_select" on public."iagentek-designsystem-overrides"
  for select using (auth.uid()::text = id);

drop policy if exists "ov_user_insert" on public."iagentek-designsystem-overrides";
create policy "ov_user_insert" on public."iagentek-designsystem-overrides"
  for insert with check (auth.uid()::text = id);

drop policy if exists "ov_user_update" on public."iagentek-designsystem-overrides";
create policy "ov_user_update" on public."iagentek-designsystem-overrides"
  for update using (auth.uid()::text = id);

drop policy if exists "ov_user_delete" on public."iagentek-designsystem-overrides";
create policy "ov_user_delete" on public."iagentek-designsystem-overrides"
  for delete using (auth.uid()::text = id);


-- ------------------------------------------------------------
-- 3. Tabla: iagentek-designsystem-services
--    Catalogo de servicios para MonitoreoView / NavegacionSection.
--    Lectura abierta a authenticated (datos no sensibles).
--    Escritura solo via service_role (bypassea RLS).
-- ------------------------------------------------------------
create table if not exists public."iagentek-designsystem-services" (
  id          text        primary key,
  name        text        not null,
  status      text        not null default 'active',     -- 'active' | 'degraded' | 'down'
  latency     integer     not null default 0,            -- ms
  region      text,
  description text,
  updated_at  timestamptz not null default now()
);

alter table public."iagentek-designsystem-services" enable row level security;

drop policy if exists "svc_auth_select" on public."iagentek-designsystem-services";
create policy "svc_auth_select" on public."iagentek-designsystem-services"
  for select using (auth.role() = 'authenticated');

-- Seed inicial de servicios para que MonitoreoView muestre algo real.
insert into public."iagentek-designsystem-services" (id, name, status, latency, region, description) values
  ('api-auth',     'Auth Service',          'active',   45,  'mx-central', 'Supabase Auth (login, sessions)'),
  ('api-rest',     'REST API',              'active',   32,  'mx-central', 'PostgREST (data API)'),
  ('api-storage',  'Storage Service',       'active',   78,  'mx-central', 'MinIO S3 endpoint'),
  ('api-realtime', 'Realtime',              'degraded', 156, 'mx-central', 'Supabase Realtime websockets'),
  ('cdn-assets',   'CDN Assets',            'active',   22,  'mx-central', 'Asset delivery (logos, icons)'),
  ('db-primary',   'Database Primary',      'active',   12,  'mx-central', 'Postgres principal')
on conflict (id) do update
  set name = excluded.name,
      status = excluded.status,
      latency = excluded.latency,
      region = excluded.region,
      description = excluded.description,
      updated_at = now();


-- ------------------------------------------------------------
-- 4. RPC: iagentek-designsystem-autoconfirm
--    Auto-confirma email de un usuario (auth.users).
--    Util en ambientes self-hosted sin servicio de email.
--    SOLO callable con service_role (revoke de anon/authenticated).
-- ------------------------------------------------------------
create or replace function public."iagentek-designsystem-autoconfirm"(user_email text)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  affected integer;
begin
  update auth.users
     set email_confirmed_at = coalesce(email_confirmed_at, now()),
         confirmed_at       = coalesce(confirmed_at, now())
   where email = user_email
     and email_confirmed_at is null;
  get diagnostics affected = row_count;
  return affected > 0;
end;
$$;

revoke all on function public."iagentek-designsystem-autoconfirm"(text) from public, anon, authenticated;
grant execute on function public."iagentek-designsystem-autoconfirm"(text) to service_role;


-- ============================================================
-- Verificacion (opcional — correr al final para validar)
-- ============================================================
-- select tablename from pg_tables where schemaname = 'public' and tablename like 'iagentek-designsystem-%';
-- select count(*) from public."iagentek-designsystem-services";
-- select proname from pg_proc where proname = 'iagentek-designsystem-autoconfirm';
