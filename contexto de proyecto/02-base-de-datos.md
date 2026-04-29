# 02 — Base de datos

## Nomenclatura

Todas las tablas, funciones RPC y buckets de este proyecto llevan el prefijo `iagentek-designsystem-`. Ejemplos:
- `iagentek-designsystem-overrides` (tabla)
- `iagentek-designsystem-templates` (tabla)
- `iagentek-designsystem-autoconfirm` (funcion RPC)
- `iagentek-designsystem-assets` (bucket S3)

Esto permite que varios proyectos compartan la misma instancia de Supabase sin colisiones.

## Tablas

### `iagentek-designsystem-overrides`

Guarda los color overrides puntuales (por elemento / propiedad) de cada usuario.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `text` PK | `auth.uid()` del usuario (uuid como string) |
| `overrides` | `jsonb` | mapa `{"elementKey.property": "#hex"}` |
| `updated_at` | `timestamptz` | default `now()` |

### `iagentek-designsystem-templates`

Plantillas de colores personalizadas creadas por cada usuario.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `text` PK | ID de la plantilla |
| `name` | `text` | Nombre visible |
| `color` | `text` | hex primario (ej `#FF420E`) |
| `short` | `text` nullable | nombre corto |
| `sort_order` | `int` | orden en la UI |
| `user_id` | `uuid` FK → `auth.users` | owner |
| `created_at` | `timestamptz` | default `now()` |

### `iagentek-designsystem-services`

Tabla reservada (creada pero no usada activamente todavia). Para catalogar servicios/integraciones.

## RLS (Row Level Security)

Habilitada en las 3 tablas. Politicas:

**overrides:**
- `SELECT/INSERT/UPDATE/DELETE` permitido si `id = auth.uid()::text`

**templates:**
- `SELECT/INSERT/UPDATE/DELETE` permitido si `user_id = auth.uid()`

Esto garantiza que un usuario NO puede ver ni modificar datos de otro usuario, incluso si conociera su UUID.

Grants aplicados al rol `authenticated` (el rol JWT que Supabase asigna a usuarios logueados).

## Funcion RPC

### `iagentek-designsystem-autoconfirm()`

`SECURITY DEFINER`. Auto-confirma el email del usuario que la invoca (marca `email_confirmed_at = now()` en `auth.users`).

Se usa en el flujo de registro: despues de `auth.signUp`, se llama esta RPC para que el usuario no tenga que confirmar el email por link y entre directo al playground.

```ts
await supabase.rpc("iagentek-designsystem-autoconfirm");
```

## Como re-crear las tablas

Si hubiera que re-aplicar el esquema en otra instancia, aqui esta el SQL equivalente (aproximado, basado en lo que se ejecuto via pg-meta):

```sql
-- overrides
create table "iagentek-designsystem-overrides" (
  id text primary key,
  overrides jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
alter table "iagentek-designsystem-overrides" enable row level security;
create policy "own_row" on "iagentek-designsystem-overrides"
  for all using (id = auth.uid()::text) with check (id = auth.uid()::text);
grant all on "iagentek-designsystem-overrides" to authenticated;

-- templates
create table "iagentek-designsystem-templates" (
  id text primary key,
  name text not null,
  color text not null,
  short text,
  sort_order int default 0,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table "iagentek-designsystem-templates" enable row level security;
create policy "own_templates" on "iagentek-designsystem-templates"
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
grant all on "iagentek-designsystem-templates" to authenticated;

-- autoconfirm RPC
create or replace function "iagentek-designsystem-autoconfirm"()
returns void
language plpgsql
security definer
set search_path = auth, public
as $$
begin
  update auth.users
  set email_confirmed_at = coalesce(email_confirmed_at, now()),
      confirmed_at = coalesce(confirmed_at, now())
  where id = auth.uid();
end;
$$;
grant execute on function "iagentek-designsystem-autoconfirm"() to authenticated;
```

## Cliente PostgREST — notas

- Usar `.maybeSingle()` en vez de `.single()` cuando la fila puede no existir. `.single()` devuelve 406 Not Acceptable con 0 filas; `.maybeSingle()` devuelve `data: null`.
- Usar `.upsert({ id, ... })` cuando queremos crear-o-actualizar en un solo call. Es lo que usa el provider de overrides.
