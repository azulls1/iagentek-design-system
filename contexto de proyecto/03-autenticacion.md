# 03 — Autenticacion y aislamiento por usuario

## Login View

Archivo: `src/views/LoginView.tsx`

3 vistas con animacion de transicion:
1. **login** (default) — email + password
2. **register** — nombre + email + password + confirmar password
3. **forgot** — recuperacion de contraseña via email

Toggle de ver/ocultar password con icono `Eye` de lucide-react.

**NO hay** OAuth (Google, GitHub, etc.). Solo email + password. La ventana de signup esta habilitada en el Supabase (`disable_signup: false`).

## Flujo de registro

1. Usuario llena el form en la vista `register`.
2. Se llama `supabase.auth.signUp({ email, password, options: { data: { name } } })`.
3. Si regresa `session` → login automatico inmediato.
4. Si NO regresa `session` (requires email confirmation):
   - Se hace `signInWithPassword` para obtener una session (el usuario existe pero esta sin confirmar — esto funciona porque la instancia permite login sin confirmar).
   - Se llama la RPC `iagentek-designsystem-autoconfirm` para confirmar el email automaticamente.
   - Se llama `onLogin({ id, email, name })`.

Asi el usuario entra directo al playground sin tener que buscar un email de confirmacion.

## Usuario creado manualmente

- Email: `azull.samael@gmail.com`
- Password: `Nomelase4`
- Nombre: `Samael Hernandez`
- UUID: `ac62adce-daa7-4579-93dd-e825fa8d51fa`
- Estado: confirmado (email_confirmed_at setted)

Se creo via `admin.createUser` con el service key y despues `admin.updateUserById` para setear password + confirmar.

## Aislamiento por usuario

Cada usuario tiene su propio espacio. El `userId` (UUID de Supabase Auth) se usa como llave.

**Capas de persistencia:**

| Capa | Donde vive | Key |
|---|---|---|
| Overrides (Supabase) | tabla `iagentek-designsystem-overrides` | fila con `id = userId` |
| Overrides (fallback localStorage) | browser | `iagentek-overrides-{userId}` |
| Templates personalizadas | browser localStorage | `iagentek-templates-{userId}` |
| Template activa | browser localStorage | `iagentek-active-template-{userId}` |

**Como se propaga el userId:**

```
App.tsx
  └─ state: user = { id, email, name }
    └─ <ColorOverrideProvider userId={user?.id}>
         └─ ColorOverrideContext usa userId para:
            - seleccionar fila en Supabase (eq("id", uid))
            - keys de localStorage
            - watcher de useEffect([uid])
```

Cuando cambia el usuario (login, logout, cambio de cuenta), el `useEffect` del provider reacciona a `uid` y recarga todo.

## Propagacion del `id` desde Supabase

LoginView, en los callbacks `onLogin`, pasa `{ id: data.user.id, email, name }` (no solo email + name). `App.tsx` guarda ese id en el state y lo pasa al provider.

Tambien se hidrata el user al cargar la app via `supabase.auth.getSession()` y `supabase.auth.onAuthStateChange()`.

## Seguridad

- El service key NUNCA se expone al cliente. Solo la anon key.
- Las operaciones privilegiadas (crear usuario, confirmar email) se hacen via RPC con `SECURITY DEFINER`, no con el service key desde el cliente.
- RLS garantiza aislamiento incluso si alguien intenta acceder a otro `id`.
