# 01 — Infraestructura IAgentek

Todo el proyecto apunta EXCLUSIVAMENTE a la infraestructura IAgentek. No hay ninguna referencia a infraestructura anterior (NXT / gruponxt).

> **AVISO DE SEGURIDAD:** este documento NO contiene secretos. Las credenciales reales viven en:
> - `.env` (gitignored) — para el frontend en dev
> - `contexto de proyecto/_credentials.md` (gitignored) — cheatsheet local con TODO (Supabase, MinIO, VPS, JWT secret, etc.)
> - El secret manager interno de IAgentek como fuente de verdad
>
> Si necesitas una credencial, abre `_credentials.md` (local). NO pegar credenciales en este archivo ni en otros docs trackeados.

## Supabase (Orion — self-hosted)

**Dashboard / Studio:**
- URL: https://iagenteksupabase.iagentek.com.mx
- Acceso: pedirlo al admin del proyecto.

**Conexion API:**
- REST + Auth URL: `https://iagenteksupabase.iagentek.com.mx`
- Anon Key: vive en `.env.local` (`VITE_SUPABASE_ANON_KEY`). Es publica por diseño (la usa el frontend).
- **Service Key (`service_role`):** NUNCA debe llegar al cliente ni a este repo. Solo se usa server-side (Edge Functions, scripts admin). Si alguna vez fue commiteada al repo, **rótala** desde el dashboard de Supabase.

**Conexion Postgres directa (operacion server-side):**
- Host interno (compose): `supabase_db:5432`
- DB User / Password / JWT Secret: vault.

**Infra Docker (en VPS Contabo, ver mas abajo):**
- Compose: `/root/supabase.yaml`
- Volumes: `/root/supabase/docker/volumes/`
- Red interna: `supabase_internal`

**Kong Gateway:**
- Dashboard: `https://iagenteksupabase.iagentek.com.mx/kong-admin/`
- Admin API externo: NO expuesto. Acceso solo via SSH al host del Supabase.

## MinIO (Sam — self-hosted, S3 compatible)

**Consola web (administracion):**
- URL: `https://iagentekminiofront.iagentek.com.mx`
- Credenciales: ver `_credentials.md`.

**S3 Endpoint (API):**
- URL: `https://iagentekminioback.iagentek.com.mx`
- Path-style: `forcePathStyle: true`

**Buckets:**
- `supabase` — bucket interno de Supabase (no tocar)
- `iagentek-designsystem-assets` — bucket del playground. Politica de lectura publica (anonymous GetObject) para servir assets directamente.

**Credenciales de admin del MinIO:** server-side only. **HOY estan expuestas en el bundle del cliente** (ver `08-auditoria.md`, P0). Plan de remediacion: crear user MinIO con scope al bucket del proyecto y migrar a presigned URLs via Edge Function.

## VPS Contabo (deploy target)

Aqui corre Supabase + MinIO en Docker, y se va a desplegar el frontend del playground.

- IP: `144.126.157.81`
- Puerto SSH: `22000`
- User: `root`
- Comando de acceso: ver `_credentials.md`
- Compose de Supabase: `/root/supabase.yaml`
- Volumes: `/root/supabase/docker/volumes/`

## Donde viven las credenciales

- `.env` (gitignored) — DEV local. El frontend solo necesita `VITE_SUPABASE_*` y temporalmente `VITE_MINIO_*` hasta migrar a presigned URLs.
- `contexto de proyecto/_credentials.md` (gitignored) — cheatsheet local con TODAS las credenciales (Supabase, MinIO, VPS, JWT secret).
- Variables de entorno del proceso/contenedor en produccion — DEPLOY. Mismas vars, sin `.env`.

## Bucket / namespace en MinIO

Las claves estan namespaceadas por usuario y plantilla:

```
iagentek-designsystem-assets/
└── users/{userId}/templates/{templateId}/{project}/{type}/{file}
```

Donde `{type}` es `logos`, `favicons` o `icons`. Cuando `{project}` es `_general` se omite ese segmento. Esto aisla a cada usuario y a cada plantilla. Ver `02-base-de-datos.md` y `08-auditoria.md`.
