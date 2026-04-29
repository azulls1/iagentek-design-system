# 06 — Estructura del proyecto

Root: `C:\Users\shernandez\Desktop\Personal\estilos\nxtview-playground\`

## Archivos en root

| Archivo | Proposito |
|---|---|
| `package.json` | Deps npm |
| `vite.config.ts` | Config de Vite + proxy CORS |
| `tailwind.config.js` | Tokens de design (colores como CSS vars, fonts, spacing) |
| `tsconfig.json`, `tsconfig.node.json` | Config TypeScript |
| `postcss.config.js` | Para Tailwind |
| `index.html` | Entry HTML |
| `.env` | Credenciales DEV (usa Vite proxy) |

## `src/`

```
src/
├── App.tsx                      # Root component, routing, auth state, ColorOverrideProvider
├── index.tsx                    # ReactDOM.createRoot
├── index.css                    # Tailwind imports + components globales + animations
│
├── components/                  # Componentes reusables
│   ├── ColorEditable.tsx        # Wrapper que permite editar color en edit mode
│   ├── ColorEditToolbar.tsx     # Toolbar flotante de edit mode
│   ├── CompanySelector.tsx      # Dropdown para cambiar plantilla activa
│   ├── ExportLibrary.tsx        # Exportar colors como Tailwind config / CSS vars
│   ├── ImportLibrary.tsx        # Importar plantillas desde archivo / lib
│   ├── TypoEditable.tsx         # Edit inline de tipografia
│   └── UserDropdown.tsx         # Menu de usuario (logout, profile)
│
├── contexts/
│   └── ColorOverrideContext.tsx # CORE: overrides, templates, paleta dinamica
│
├── hooks/                       # Custom hooks
│
├── lib/
│   ├── supabase.ts              # Cliente Supabase
│   ├── minio.ts                 # Cliente S3 (MinIO)
│   └── paletteGenerator.ts      # Genera paleta completa desde un hex base
│
├── showcase/                    # Componentes de demo/showcase
│
├── styles/
│   └── palette.css              # CSS variables default en :root
│
├── utils/                       # Utilidades varias
│
└── views/                       # Pantallas top-level
    ├── LoginView.tsx            # Login + Registro + Recuperacion
    ├── DashboardFullView.tsx    # Dashboard principal
    ├── LandingPageView.tsx      # Landing
    ├── OnboardingView.tsx       # Onboarding
    ├── SettingsView.tsx         # Settings
    ├── ConfigView.tsx           # Configuracion
    ├── DocsView.tsx             # Docs
    ├── LoadingView.tsx          # Loading state
    ├── MonitoreoView.tsx        # Monitoreo
    ├── NotificationCenterView.tsx
    └── ServiciosView.tsx
```

## Archivos criticos (los que mas importan)

| Archivo | Por que importa |
|---|---|
| `src/contexts/ColorOverrideContext.tsx` | El cerebro del sistema de temas. Maneja overrides, plantillas, paleta dinamica, persistencia por usuario |
| `src/lib/paletteGenerator.ts` | Convierte 1 color → paleta completa |
| `src/styles/palette.css` | Variables default |
| `tailwind.config.js` | Mapea clases Tailwind a CSS vars |
| `src/views/LoginView.tsx` | Auth UI (3 vistas: login/register/forgot) |
| `src/App.tsx` | Propaga userId al provider, maneja auth state |
| `vite.config.ts` | Proxy para evitar CORS |

## Clases Tailwind importantes

Las clases de colores del branding se resuelven via CSS vars:

- `bg-forest`, `text-forest`, `border-forest` → `var(--color-forest)`
- `bg-primary`, `text-primary` → `var(--color-primary)`
- `bg-nxt-50` ... `bg-nxt-900` → `var(--color-nxt-*)`
- `bg-nav-bg`, `bg-page`, `bg-surface` → `var(--color-nav-bg)` etc.

Semanticas FIJAS:
- `bg-success`, `bg-warning`, `bg-error`, `bg-info` → verde/amarillo/rojo/azul fijos

## Notas sobre legacy naming

La carpeta se llama `nxtview-playground` por razones historicas, pero no queda ninguna referencia a NXT en el codigo. Se puede renombrar la carpeta sin riesgo — los paths en los scripts son relativos.

Las clases Tailwind `nxt-*` (ej `bg-nxt-500`, `rounded-nxt-md`, `text-nxt-700`) son nombres de **tokens de diseño** (no de marca). Es la escala gris del sistema, no tiene que ver con la marca NXT. Se puede renombrar a `gray-*` o `brand-*` si se prefiere, pero implica tocar cientos de referencias.
