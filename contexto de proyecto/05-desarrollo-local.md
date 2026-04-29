# 05 — Desarrollo local

## Correr el dev server

```bash
cd "C:/Users/shernandez/Desktop/Personal/estilos iagentek/Iagentek-playground"
npx vite
```

El servidor corre en `http://localhost:52817` (puerto fijo con `strictPort: true`).

Para build de produccion:
```bash
npx vite build
```

## Archivo `.env` (desarrollo)

```
VITE_SUPABASE_URL=http://localhost:52817
VITE_SUPABASE_ANON_KEY=<anon key de IAgentek>
VITE_MINIO_ENDPOINT=https://iagentekminioback.iagentek.com.mx
VITE_MINIO_ACCESS_KEY=admin
VITE_MINIO_SECRET_KEY=Iagentek_123
VITE_MINIO_BUCKET=iagentek-designsystem-assets
```

**Nota importante:** `VITE_SUPABASE_URL` apunta a `http://localhost:52817` (NO a Supabase directo). Esto es intencional — es el proxy de Vite. Ver siguiente seccion.

## El proxy de Vite (workaround para CORS)

### Problema

El Kong Gateway del Supabase self-hosted de IAgentek NO tiene CORS configurado. Cuando el navegador hace un OPTIONS preflight a `https://iagenteksupabase.iagentek.com.mx/auth/v1/token`, Kong responde 504 Gateway Timeout. El POST real nunca llega.

El Kong Admin API no esta expuesto externamente (solo `/kong-admin/` que es el UI, no el API). Sin acceso al Kong admin, no se puede habilitar el plugin CORS desde el cliente.

### Solucion (dev-only)

`vite.config.ts` tiene un proxy que reenvia `/auth`, `/rest`, `/pg` desde `localhost:52817` hacia `iagenteksupabase.iagentek.com.mx`:

```ts
server: {
  port: 52817,
  strictPort: true,
  proxy: {
    '/auth': { target: 'https://iagenteksupabase.iagentek.com.mx', changeOrigin: true, secure: true },
    '/rest': { target: 'https://iagenteksupabase.iagentek.com.mx', changeOrigin: true, secure: true },
    '/pg':   { target: 'https://iagenteksupabase.iagentek.com.mx', changeOrigin: true, secure: true },
  },
}
```

Asi el navegador habla con `http://localhost:52817/auth/...` (mismo origen, sin CORS) y Vite hace el fetch real al Supabase desde el proceso de Node (que no tiene CORS porque no es browser).

Por eso `VITE_SUPABASE_URL=http://localhost:52817` en dev.

## Build

- `dist/` se genera con `npx vite build` — contiene los archivos estaticos listos para servir.

## HMR / Hot reload

Vite HMR funciona normal. Cambios en `.tsx`/`.ts`/`.css` se reflejan sin recargar. Cambios en `.env` requieren reiniciar el dev server.
