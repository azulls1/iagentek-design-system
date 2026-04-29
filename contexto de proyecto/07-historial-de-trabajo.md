# 07 — Historial de trabajo

Resumen cronologico de lo que se hizo en esta sesion.

## 1. LoginView rediseñado

- Eliminado: Google OAuth (boton + script)
- Agregado: vista de Crear cuenta (nombre, email, password, confirmar password)
- 3 vistas con animacion: Login → Crear cuenta → Recuperar
- Toggle de ver/ocultar password con icono Eye

## 2. Aislamiento por usuario

Antes: todo se guardaba en una fila `id = "global"` → compartido entre todos.

Ahora: cada usuario tiene sus propios datos indexados por `userId`.

Cambios:
- `ColorOverrideProvider` recibe `userId` como prop
- Supabase: `.upsert({ id: uid, ... })` en vez de `id = "global"`
- localStorage fallback: `iagentek-overrides-{userId}`, `iagentek-templates-{userId}`, `iagentek-active-template-{userId}`
- `App.tsx` propaga `user.id` al provider
- `LoginView` pasa `{ id, email, name }` al callback `onLogin`

## 3. Migracion de infraestructura a IAgentek

**Antes:** apuntaba a `nxtsupabase.gruponxt.dev` y `nxtminioback.gruponxt.dev`.

**Ahora:** apunta EXCLUSIVAMENTE a:
- Supabase: `iagenteksupabase.iagentek.com.mx`
- MinIO: `iagentekminioback.iagentek.com.mx`

Ver `01-infraestructura.md` para credenciales completas.

## 4. Nomenclatura `iagentek-designsystem-*`

Todas las tablas, funciones RPC y buckets renombrados con este prefijo:
- `color_overrides` → `iagentek-designsystem-overrides`
- `templates`/`companies` → `iagentek-designsystem-templates`
- `services` → `iagentek-designsystem-services`
- RPC `autoconfirm` → `iagentek-designsystem-autoconfirm`
- Bucket `nxtview-assets` → `iagentek-designsystem-assets`

## 5. Tablas + RLS + RPC creadas

Todo el SQL se ejecuto contra la instancia de IAgentek via pg-meta endpoint con el service key. Ver `02-base-de-datos.md`.

## 6. Bucket MinIO creado

Bucket `iagentek-designsystem-assets` creado en MinIO con politica de lectura publica (anonymous GetObject). Se uso el AWS SDK de Node con las credenciales admin/Iagentek_123.

## 7. Usuario azull.samael@gmail.com creado

Creado via Admin API con el service key. Password: `Nomelase4`. Email pre-confirmado (no requirio link por email).

## 8. Limpieza total de referencias viejas

- Removidas TODAS las referencias a `nxtview`, `gruponxt`, `nxt view`, `NXT Design`, `NXT Platform`, `NXT Docs`, etc.
- Escala de colores Tailwind renombrada: `nxt` key interno se mantiene (es nombre de token, no branding), pero `NXT Docs`, `NXT Platform` → `IAgentek Docs`, `IAgentek Platform`.
- CSS vars exportadas en `ExportLibrary` cambiaron de `--nxt-*` a `--forest-*`.
- Carpeta `.nxt/` borrada.

## 9. Proxy de Vite para CORS

El Kong del Supabase IAgentek no tiene CORS → preflight OPTIONS falla con 504.

Solucion: `vite.config.ts` con proxy `/auth`, `/rest`, `/pg` apuntando a `iagenteksupabase.iagentek.com.mx`. `.env` cambiado para que `VITE_SUPABASE_URL=http://localhost:52817`.

## 10. Fix del 406 en overrides

`.single()` devolvia 406 cuando no habia overrides guardados (esperado en PostgREST, pero ruidoso en la consola).

Cambiado a `.maybeSingle()` que devuelve `data: null` sin error.

## 11. Sistema dinamico de temas

**Problema:** al cambiar de plantilla solo se recoloreaban 5 vistas parcialmente porque los componentes usaban clases Tailwind con hex hardcoded.

**Solucion:**
- `src/lib/paletteGenerator.ts` — funcion HSL que genera paleta completa desde 1 hex
- `tailwind.config.js` — todas las clases de branding ahora usan `var(--color-..., #fallback)`
- `src/styles/palette.css` — CSS vars default en `:root`
- `ColorOverrideContext` — al cambiar `activeTemplate`, genera paleta y la inyecta en `document.documentElement`

Se implemento lanzando 3 agentes en paralelo con contrato estricto de nombres de variables.

Ver `04-sistema-de-temas.md` para detalles.

## Estado actual

- Dev server corriendo en `localhost:52817` con proxy
- Usuario de prueba listo: `azull.samael@gmail.com` / `Nomelase4`
- Build de produccion pasa (`npx vite build`)
- 8 plantillas default, cada una recolorea toda la app
- Cada usuario ve solo sus propios overrides/templates

## Pendientes / mejoras posibles

- Configurar CORS en Kong para poder quitar el proxy en produccion
- Agregar boton "Crear nueva plantilla" en CompanySelector (la capacidad existe via `addTemplate`, falta el UI)
- Opcional: hacer tambien los semanticos (success/warning/error/info) dinamicos si se quiere soportar temas "rojo-primario" con todo cambiando
- Code-splitting (el bundle pesa 1.1 MB; Vite avisa del warning)
