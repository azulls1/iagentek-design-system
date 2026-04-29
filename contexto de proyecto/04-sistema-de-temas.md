# 04 — Sistema dinamico de temas

## Problema que resuelve

Antes: las plantillas tenian solo UN color primario, y solo ~5 vistas lo leian manualmente con `style={{ backgroundColor: brandColor }}`. Los demas componentes usaban clases Tailwind hardcoded (`bg-nxt-700`, `bg-primary`, `text-forest`, etc.) que apuntaban a hex fijos del `tailwind.config.js`. Resultado: cambiar plantilla solo recoloreaba 5 vistas parcialmente.

Ahora: cambiar plantilla recolorea TODA la app (todas las clases de branding de Tailwind).

## Arquitectura

Tres capas:

```
┌─────────────────────────────────────────────────────┐
│ 1. ColorOverrideContext (runtime)                   │
│    - templates (lista con color primario)           │
│    - activeTemplate (id)                            │
│    - useEffect: cuando cambia activeTemplate →      │
│      llama generatePalette(color) →                 │
│      aplica cada entry a document.documentElement   │
│      .style.setProperty('--'+key, value)            │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 2. CSS variables en :root (runtime-mutable)         │
│    --color-primary, --color-forest, --color-nxt-500 │
│    ...etc. Definidas default en src/styles/         │
│    palette.css e inyectadas dinamicamente por el    │
│    context.                                         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ 3. Tailwind config → CSS vars                       │
│    bg-primary → var(--color-primary, #04202C)       │
│    bg-nxt-500 → var(--color-nxt-500, #7D8F84)       │
│    ...etc. Fallback hex por si no hay var seteada.  │
└─────────────────────────────────────────────────────┘
```

## Archivos clave

### `src/lib/paletteGenerator.ts`

Funcion pura sin dependencias externas. Toma un hex base y genera un `Record<string, string>` con toda la paleta via HSL.

Contrato de keys (sin el prefijo `--`):

- **Primary:** `color-primary`, `color-primary-light`, `color-primary-hover`, `color-primary-active`
- **Forest family:** `color-forest`, `color-evergreen`, `color-pine`, `color-moss`, `color-fog`, `color-bark`, `color-midnight`
- **Nxt scale (grises tintados con el hue base):** `color-nxt-50`, `-100`, `-200`, `-300`, `-400`, `-500`, `-600`, `-700`, `-800`, `-900`
- **Surfaces:** `color-nav-bg`, `color-page`, `color-surface`, `color-surface-dark`, `color-surface-darker`, `color-surface-darkest`

**Algoritmo:**
- Forest family: base hue y saturation, variando lightness entre -15% y +50% del base.
- Nxt scale: tinted grays con saturation muy baja (4-8%), lightness de 97% (nxt-50) a 8% (nxt-900).
- Primary variants: base, +20% light, -8% hover, -15% active.
- Surfaces: mapean a otros tokens (nav-bg = forest, page = nxt-50, surface = #FFFFFF fijo, etc.).

### `src/styles/palette.css`

Define las CSS variables default en `:root` con los valores forest originales (#04202C, etc.). Se carga al arranque antes de que el context inyecte cualquier cosa. Sirve como fallback y evita flicker.

### `tailwind.config.js`

Todas las clases de colores del branding usan `var(--color-..., #fallback)`:

```js
colors: {
  forest: 'var(--color-forest, #04202C)',
  primary: 'var(--color-primary, #04202C)',
  nxt: {
    50: 'var(--color-nxt-50, #F7F8F7)',
    // ...
    900: 'var(--color-nxt-900, #04202C)',
  },
  // ...
  // Semanticos SE QUEDAN FIJOS — no cambian con plantilla:
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',
}
```

### `src/contexts/ColorOverrideContext.tsx`

El useEffect que hace la magia:

```ts
useEffect(() => {
  const current = templates.find((t) => t.id === activeTemplate);
  if (!current) return;
  const palette = generatePalette(current.color);
  const root = document.documentElement;
  for (const [key, value] of Object.entries(palette)) {
    root.style.setProperty('--' + key, value);
  }
}, [activeTemplate, templates]);
```

Persiste la plantilla activa en localStorage con key `iagentek-active-template-{uid}` para que sobreviva reloads.

## Plantillas incluidas (DEFAULT_TEMPLATES)

| ID | Nombre | Color base |
|---|---|---|
| iagentek | IAgentek | #04202C |
| fresco-y-brillante | Fresco y Brillante | #FF420E |
| sutil-y-profesional | Sutil y Profesional | #336B87 |
| oscuro-y-terroso | Oscuro y Terroso | #BA5536 |
| nitido-y-dramatico | Nitido y Dramatico | #598234 |
| azules-frios | Azules Frios | #07575B |
| aire-libre-y-natural | Aire Libre y Natural | #2E4600 |
| verde-azulado-acuoso | Verde-Azulado Acuoso | #004445 |

## Capa de overrides individuales (sin cambios)

El sistema anterior de overrides por elemento/propiedad sigue existiendo sin cambios:

- `setOverride("btn-primary", "bg", "#ff0000")` — guarda override especifico en Supabase/localStorage.
- Lee via `getOverride("btn-primary", "bg")`.
- Se aplica en los componentes con `style={{ backgroundColor: getOverride(...) }}`.

Esta capa esta ENCIMA de la paleta generada por plantilla. Funciona independientemente.

## Semanticos no cambian

`success`, `warning`, `error`, `info` estan HARDCODED en `tailwind.config.js`. Son parte de la identidad semantica del UI (verde = exito, rojo = error) y no deben cambiar con la plantilla. Si se quisiera hacerlos tambien dinamicos, habria que extender `generatePalette` y exponer esas vars.
