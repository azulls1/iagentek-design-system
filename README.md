# IAgentek Design System

Playground del design system de IAgentek. Permite explorar componentes UI, personalizar colores por elemento, y guardar plantillas de tema completas — todo aislado por usuario.

**Producción:** https://designsystem.iagentek.com.mx

## Stack

- **Frontend:** React 18 + TypeScript + Vite + TailwindCSS (CSS vars dinámicas)
- **Auth + DB:** Supabase self-hosted (`iagenteksupabase.iagentek.com.mx`)
- **Storage:** MinIO S3-compatible (`iagentekminioback.iagentek.com.mx`) vía Edge Function presigned URLs
- **Tests:** Vitest
- **CI:** GitHub Actions (lint + test + build)
- **Deploy:** Docker Swarm + Traefik en VPS Contabo (igual patrón que el resto de servicios IAgentek)

## Correr local

```bash
npm install
npm run dev
```

Abre `http://localhost:52817`. El dev server tiene proxy a Supabase para esquivar CORS.

## Otros comandos

```bash
npm test          # Vitest
npm run lint      # ESLint
npm run build     # Build de producción a dist/
```

## Estructura

```
src/
├── App.tsx                 # Routing + auth state + ColorOverrideProvider
├── components/             # ColorEditable, CompanySelector, etc.
├── contexts/
│   └── ColorOverrideContext.tsx   # Cerebro del sistema de temas
├── lib/
│   ├── supabase.ts         # Cliente Supabase
│   ├── minio.ts            # Llama a la Edge Function (presigned URLs)
│   ├── paletteGenerator.ts # 1 hex → paleta completa HSL
│   └── logger.ts           # Wrapper console + hook Sentry-ready
├── showcase/               # Secciones de demo del design system (lazy-loaded)
└── views/                  # LoginView, DashboardFullView, LoadingView

supabase/
├── iagentek-designsystem.sql           # Schema SQL idempotente
└── functions/iagentek-storage-presign/ # Edge Function (server-side firma)

deploy/
└── designsystem.yaml       # Docker Swarm stack para el VPS
```

## Deploy

Reproducible desde el VPS:

```bash
ssh -p 22000 root@144.126.157.81
cd /root/builds/designsystem/source
git pull
docker build \
  --build-arg VITE_SUPABASE_URL=https://designsystem.iagentek.com.mx \
  --build-arg VITE_SUPABASE_ANON_KEY=<anon> \
  --build-arg VITE_MINIO_ENDPOINT=https://iagentekminioback.iagentek.com.mx \
  --build-arg VITE_MINIO_BUCKET=iagentek-designsystem-assets \
  -t designsystem-frontend:latest .
docker stack deploy -c deploy/designsystem.yaml designsystem
```

Traefik registra el router y emite el cert Let's Encrypt automáticamente.

## Documentación interna

Toda la doc operativa vive en [`contexto de proyecto/`](./contexto%20de%20proyecto/):

| Archivo | Tema |
|---|---|
| `01-infraestructura.md` | Supabase, MinIO, VPS Contabo |
| `02-base-de-datos.md` | Tablas, RLS, RPC |
| `03-autenticacion.md` | Login, registro, RLS por usuario |
| `04-sistema-de-temas.md` | Generador dinámico de paleta |
| `05-desarrollo-local.md` | Dev server, proxy CORS |
| `06-estructura-del-proyecto.md` | Layout y archivos clave |
| `07-historial-de-trabajo.md` | Cronología de decisiones |
| `08-auditoria.md` | Scores reales por área + decisiones registradas |

Las credenciales viven en `_credentials.md` (gitignored, fuente de verdad local).
