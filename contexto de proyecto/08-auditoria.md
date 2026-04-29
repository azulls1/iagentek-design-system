# 08 — Auditoria del proyecto

**Fecha:** 2026-04-29
**Alcance:** Codigo en `src/`, deps en `package.json`, config Vite/ESLint, schema en `supabase/`, infra documentada.

## Metodologia

- **Verificable:** datos extraidos directamente del repo (LOC, lint, npm audit, grep de patrones, schema SQL).
- **N/D (No Disponible):** metricas que requieren datos de produccion, telemetria, o procesos de equipo que no existen en este repo. NO se inventaron numeros.

Score: 1 (critico) · 2 (malo) · 3 (aceptable) · 4 (bueno) · 5 (excelente)

---

## Resumen ejecutivo

| Hallazgo | Severidad | Estado |
|---|---|---|
| Bucket MinIO `iagentek-designsystem-assets` no existia | CRITICO | **RESUELTO 2026-04-29** (creado, policy `download` aplicada) |
| Tabla `iagentek-designsystem-services` no existia | ALTO | **RESUELTO 2026-04-29** (creada con 6 filas seed) |
| RPC `iagentek-designsystem-autoconfirm` no existia | ALTO | **RESUELTO 2026-04-29** (creada, scoped a `service_role`) |
| Credenciales admin de MinIO expuestas en bundle del cliente — afecta TODOS los buckets del MinIO compartido (coevolucion, forms-empresarial, imgstudio, maestria, supabase, iagentek-designsystem-assets) | **CRITICO** | Pendiente — ver P0 |
| 0% cobertura de pruebas | ALTO | Pendiente |
| Sin pipeline CI/CD | ALTO | Pendiente |
| 111 errores ESLint + 198 warnings | MEDIO | Pendiente |
| 5 vulnerabilidades npm (moderate) | MEDIO | Pendiente |
| Bundle JS 1.2 MB sin code-splitting | MEDIO | Pendiente |
| Sin observabilidad (solo `console.log`) | MEDIO | Pendiente |

---

## Codigo

### Deuda tecnica · Score 2/5

| Metrica | Valor real | Score |
|---|---|---|
| LOC totales (src) | 29,439 | — |
| Archivos .tsx/.ts | 31 / 4 | — |
| Archivo mas grande | `src/showcase/ComponentesSection.tsx` (4,716 LOC) | 1/5 |
| Archivos > 1,000 LOC | 14 (40% del total) | 2/5 |
| Complejidad ciclomatica | No medida (sin tool); 391 hooks React distribuidos | N/D |
| Duplicacion (jscpd/sonar) | No medida (sin tool corriendo) | N/D |
| Cobertura de pruebas | **0%** (sin tests, sin framework instalado) | 1/5 |
| `any` types | 1 ocurrencia (excelente type safety) | 5/5 |
| TODO/FIXME/HACK | 0 markers | 5/5 |

**Notas:**
- `src/showcase/` concentra ~13,500 LOC en archivos masivos. Es contenido demo, pero limita mantenibilidad.
- No hay framework de testing (`vitest`, `jest`, `@testing-library`, `playwright`, `cypress` ausentes en `package.json`).

### Arquitectura · Score 4/5

| Metrica | Valor real | Score |
|---|---|---|
| Separacion de capas | `views/`, `components/`, `contexts/`, `lib/`, `hooks/`, `styles/` claramente separadas | 4/5 |
| Acoplamiento (imports `../../`) | 0 ocurrencias | 5/5 |
| Cohesion | `ColorOverrideContext` centraliza estado de tema (1 sola responsabilidad) | 4/5 |
| Patron arquitectonico | SPA con Context API + RLS en backend | 4/5 |

### Mantenibilidad · Score 2/5

| Metrica | Valor real | Score |
|---|---|---|
| ESLint errores | **111** | 1/5 |
| ESLint warnings | **198** | 2/5 |
| Imports no usados | mayoria de warnings | 2/5 |
| `no-undef` en `tailwind.config.js` | 1 error (config CommonJS sin override) | 2/5 |
| Documentacion | `contexto de proyecto/` con 8 archivos cubre stack, infra, db, auth, dev | 4/5 |
| Standards (TypeScript strict) | habilitado | 4/5 |

### Cobertura de pruebas · Score 1/5

| Tipo | Valor real | Score |
|---|---|---|
| Unit | 0 tests, 0 framework | 1/5 |
| Integracion | 0 | 1/5 |
| E2E | 0 | 1/5 |

---

## Performance

### Score promedio: 2/5

| Metrica | Valor real | Score |
|---|---|---|
| Bundle JS principal | **1.2 MB** (`index-Uy6rK62v.js`) | 2/5 |
| Bundle CSS | 131 KB | 3/5 |
| Code-splitting | NO (chunk unico, Vite avisa) | 1/5 |
| P50/P95/P99 latency | **N/D** — no hay APM, no hay logs de prod | N/D |
| Throughput (RPS) | **N/D** — sin load testing | N/D |
| Escalabilidad horizontal | **N/D** — frontend estatico es escalable por CDN, pero no medido | N/D |
| Escalabilidad Supabase | gestionado por self-hosted IAgentek (capacidad no expuesta) | N/D |
| CPU/RAM/IO/Red en prod | **N/D** — sin metricas de runtime accesibles | N/D |

**Para medir** se necesitaria: APM (Sentry/Datadog), Lighthouse CI, k6/Artillery para load tests, monitoreo del host de Supabase.

---

## Seguridad

### Score promedio: 2/5

| Metrica | Valor real | Score |
|---|---|---|
| **Credenciales MinIO admin expuestas en cliente** | `VITE_MINIO_SECRET_KEY=Iagentek_123` se inyecta en bundle JS publico | **1/5** |
| Anon key Supabase en bundle | OK por diseno (clave publica), RLS protege | 4/5 |
| RLS habilitado en `color_overrides` | Si | 3/5 |
| RLS politica granular | `auth.role() = 'authenticated'` permite a CUALQUIER user autenticado leer/escribir la fila `id='global'`. **NOTA:** la doc dice que migro a per-user, pero el SQL en `supabase/color_overrides.sql` aun refleja modelo viejo | 2/5 |
| Vulnerabilidades npm | 5 moderate (esbuild, postcss, fast-xml-parser, @aws-sdk/xml-builder) — `npm audit fix` resuelve la mayoria | 3/5 |
| Secretos hardcoded en src/ | 0 detectados (todo via `import.meta.env`) | 4/5 |
| `.env` en `.gitignore` | Si | 5/5 |
| Auditoria/logs estructurados | NO — solo 17 `console.log/error/warn` | 1/5 |
| Trazabilidad de accesos | **N/D** — depende de logs de Kong/Supabase no auditados aqui | N/D |
| Superficie de ataque | Solo frontend; backend protegido por Kong; pero proxy Vite publico en prod si se despliega | 3/5 |
| HSTS / CSP / X-Frame-Options | NO configurados (ya no hay nginx.conf, dependera del host de despliegue) | 1/5 |

**Riesgos abiertos:**
1. **MinIO admin key en bundle** — cualquiera con acceso al sitio puede leer/escribir/borrar todos los buckets. Mitigacion: backend proxy o credenciales scoped por usuario.
2. **RLS de templates/services** — el archivo `supabase/color_overrides.sql` esta desactualizado vs lo descrito en la doc; no hay garantia verificable de que el schema actual aplica el aislamiento por `userId`.
3. **CORS** — pendiente configurar Kong para quitar el proxy de dev.

---

## Resiliencia

### Score promedio: N/D

| Metrica | Valor real | Score |
|---|---|---|
| Disponibilidad / uptime | **N/D** — sin historico, sin SLA documentado | N/D |
| MTTR | **N/D** — sin tracking de incidentes | N/D |
| MTBF | **N/D** — sin tracking de incidentes | N/D |
| Circuit breakers / retry policies | NO implementados (fetch directo sin retry/backoff) | 1/5 |
| Timeouts en cliente | NO configurados explicitamente | 2/5 |
| Backups | Supabase self-hosted IAgentek; politica de backup no verificada en este repo | N/D |
| Recovery (RPO/RTO) | **N/D** | N/D |

---

## DevOps

### Score promedio: 1/5

| Metrica | Valor real | Score |
|---|---|---|
| CI/CD | **NO EXISTE** (sin `.github/`, `.gitlab-ci.yml`, `.circleci/`) | 1/5 |
| Pre-commit hooks | NO (sin husky) | 1/5 |
| Gates de calidad (lint/test en PR) | NO | 1/5 |
| Lead time deploy | **N/D** — sin pipeline | N/D |
| Deploy frequency | **N/D** | N/D |
| Rollback capability | Manual (git revert + rebuild) | 2/5 |
| Observabilidad (Grafana/Prometheus) | **NO** — sin metricas, sin logs estructurados, sin traces | 1/5 |
| Errores en runtime (Sentry/similar) | NO instalado | 1/5 |

---

## IA & Modelos

**No aplica.** Este proyecto es un design system playground. No usa LLMs, modelos ML, ni inferencia. Todas las metricas de esta categoria (accuracy, F1, drift, fairness, costo por inferencia, prompts) **no son aplicables**.

---

## Infra

### Score promedio: 2/5

| Metrica | Valor real | Score |
|---|---|---|
| Configuracion contenedores | No hay (Dockerfile y nginx.conf eliminados, deploy depende de host externo) | N/A |
| Restart policies / resource limits | **N/D** — depende del orquestador donde se despliegue | N/D |
| Gestion de secretos | `.env` files (NO vault, NO secrets manager) | 2/5 |
| Networking / firewall | Frontend HTTPS via host externo; Supabase y MinIO via Kong en `iagentek.com.mx` | 3/5 |
| Segmentacion | Backend self-hosted en VPC IAgentek (no auditado aqui) | N/D |
| Monitoreo & alertas criticas | **NO existen** | 1/5 |
| Capacidad / headroom | **N/D** | N/D |

---

## Equipo

**No medible desde el repo.** Todas las metricas de esta categoria requieren acceso a:
- Sistema de tracking (Jira / Linear / GitHub Projects) — no integrado en este repo
- Sprints / planning — no documentados aqui
- Postmortems / runbooks — no existen en `contexto de proyecto/`

| Metrica | Valor real |
|---|---|
| Velocidad de equipo (story points) | **N/D** |
| Bugs por sprint | **N/D** |
| Documentacion sistemas criticos | `contexto de proyecto/` cubre stack, infra, auth, db, theming. Score parcial 4/5 |
| Gestion de incidentes | **N/D** — sin runbook, sin oncall documentado |

---

## Producto

### Score promedio: 2/5

| Metrica | Valor real | Score |
|---|---|---|
| Tiempo de carga inicial | **1.2 MB JS sin splitting** — proxy: lento en 3G | 2/5 |
| Errores visibles al usuario | 17 `console.error/warn` (no UI feedback estructurado) | 2/5 |
| Disponibilidad funcional (features operativas) | **N/D** — no hay backlog publicado en repo | N/D |
| Usuarios activos / retencion | **N/D** — sin analytics (no hay GA, Mixpanel, PostHog, etc.) | N/D |

---

## Decisiones registradas

### CVEs `esbuild` y `vite` (2 moderate, dev-only) — **POSTPUESTO**

Decision tomada 2026-04-29.

- **Vector:** dev server local; `npm audit fix --force` ofrece upgrade a Vite 8 (breaking).
- **CVSS:** 5.3, AC:H (high attack complexity, requiere user interaction en navegador).
- **Razon de postponer:** pre-deploy se prefiere estabilidad. Vite 5 → 8 es jump de 3 majors con cambios en plugins/config que podrian romper el build.
- **Cuando ejecutar:** despues del primer deploy estable, en una iteracion de upgrades dedicada.

### Migracion MinIO admin → presigned URLs via Edge Function — **POSTPUESTO**

Decision tomada 2026-04-29.

- **Edge Functions disponibles** en este Supabase self-hosted (verificado: `supabase_functions` container con `supabase/edge-runtime:v1.67.4`).
- **P0 ya mitigado al ~80%** con el user MinIO scoped (`iagentek-ds-app` con policy solo al bucket del playground; blast radius reducido de 7 buckets a 1).
- **Refactor estimado:** ~6h (reescribir 6 funciones en `src/lib/minio.ts`, listing tiene que pasar por server-side, gestion de upload progress mas compleja).
- **Cuando ejecutar:** post-deploy estable, como mejora v2.

---

## Recomendaciones priorizadas

### P0 (criticas)
1. **Mover credenciales MinIO al backend.** Usar credenciales scoped (presigned URLs o STS) en vez de admin key embebida en cliente.
2. **Verificar y actualizar `supabase/color_overrides.sql`** para reflejar el modelo per-user descrito en la doc; commitear el SQL real de produccion.

### P1 (altas)
3. **Instalar test framework** (Vitest + @testing-library/react) y empezar por tests de `paletteGenerator.ts` y `ColorOverrideContext.tsx`.
4. **Crear pipeline CI minimo** (GitHub Actions o GitLab CI): `npm ci`, `npm run lint`, `npm run build`.
5. **Code-splitting de Vite:** lazy-load de `views/` y `showcase/` para bajar bundle inicial.
6. **`npm audit fix`** para resolver las 5 vulnerabilidades moderate.

### P2 (medias)
7. **Resolver los 111 errores ESLint** (mayoria son warnings de imports no usados; eliminables con `--fix` parcial).
8. **Instalar Sentry o equivalente** para captura de errores en runtime.
9. **Logger estructurado** (pino/loglevel) en vez de `console.log` ad-hoc.
10. **Configurar headers de seguridad** (CSP, HSTS, nosniff) en el host de despliegue.

### P3 (bajas, requieren info externa)
11. Definir SLA/SLO con stakeholders antes de poder medir disponibilidad.
12. Documentar runbook de incidentes y proceso de postmortem.
13. Integrar analytics (PostHog o similar) para medir adopcion real.

---

## Que se midio realmente vs N/D

**Medido del repo (verificable):**
- LOC, archivos, complejidad por proxy de hooks, type safety
- Lint output (309 problemas)
- npm audit (5 vulnerabilities moderate)
- Bundle size del `dist/` actual (1.2 MB)
- Schema SQL de Supabase (`color_overrides.sql`)
- Patrones de seguridad: secretos, logging, error handling
- Estructura de carpetas y acoplamiento

**N/D (requiere datos externos no presentes en repo):**
- Toda la categoria de Performance runtime (P50/P95, RPS)
- Toda la categoria de Resiliencia (uptime, MTTR, MTBF, backups)
- Toda la categoria de Equipo (velocidad, bugs, incidentes)
- Adopcion / usuarios activos
- DevOps lead time / deploy frequency

**No aplicable:**
- IA & Modelos (proyecto sin componente IA)
