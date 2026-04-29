# Contexto del Proyecto — IAgentek Design System Playground

Este folder contiene todo el contexto relevante del proyecto: infraestructura, decisiones de arquitectura, credenciales, flujos, y lo que se ha construido.

## Indice

| Archivo | Contenido |
|---|---|
| [01-infraestructura.md](./01-infraestructura.md) | Supabase IAgentek + MinIO IAgentek (URLs, credenciales, dominios) |
| [02-base-de-datos.md](./02-base-de-datos.md) | Tablas, RLS, funciones RPC, nomenclatura |
| [03-autenticacion.md](./03-autenticacion.md) | Flujo de login/registro, aislamiento por usuario |
| [04-sistema-de-temas.md](./04-sistema-de-temas.md) | Sistema dinamico de temas (CSS vars + generador de paleta) |
| [05-desarrollo-local.md](./05-desarrollo-local.md) | Dev server, Vite proxy para CORS, .env |
| [06-estructura-del-proyecto.md](./06-estructura-del-proyecto.md) | Layout de carpetas y archivos clave |
| [07-historial-de-trabajo.md](./07-historial-de-trabajo.md) | Que se hizo en esta sesion |
| [08-auditoria.md](./08-auditoria.md) | Auditoria del proyecto: scores reales por area, gaps, recomendaciones |

## Resumen del proyecto

**Que es:** Un playground de design system para IAgentek. Permite:
- Ver componentes UI estilo Forest/IAgentek
- Personalizar colores por elemento (overrides persistentes)
- Cambiar la paleta completa seleccionando una "plantilla" (un solo color primario que genera toda la escala)
- Guardar plantillas personalizadas
- Todo aislado por usuario (cada quien tiene su propia configuracion)

**Stack:**
- Frontend: React + TypeScript + Vite
- Styling: TailwindCSS con CSS variables dinamicas
- Backend: Supabase (Postgres + Auth) self-hosted en IAgentek
- Storage: MinIO (S3 compatible) self-hosted en IAgentek
- Dev server: `http://localhost:52817`

**Nomenclatura estandar:**
Todo lo relacionado a la base de datos usa el prefijo `iagentek-designsystem-`:
- `iagentek-designsystem-overrides`
- `iagentek-designsystem-templates`
- `iagentek-designsystem-services`
- `iagentek-designsystem-autoconfirm` (funcion RPC)
- `iagentek-designsystem-assets` (bucket S3)
