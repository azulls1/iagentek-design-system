import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { Eye, EyeOff } from "lucide-react";

interface LoginViewProps {
  onLogin?: (user: { id: string; email: string; name?: string }) => void;
}

type View = "login" | "register" | "forgot";

export function LoginView({ onLogin }: LoginViewProps) {
  const [view, setView] = useState<View>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const inputCls = "w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm rounded-lg border-[1.5px] border-nxt-200 bg-nxt-50 text-nxt-900 placeholder-nxt-400 transition-all focus:outline-none focus:border-forest focus:bg-white focus:shadow-[0_0_0_3px_rgba(4,32,44,0.12)]";
  const btnPrimaryCls = "w-full py-3 sm:py-3.5 bg-forest hover:bg-bark active:bg-midnight text-white font-bold text-sm uppercase tracking-wider rounded-lg transition-all hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(4,32,44,0.2)] disabled:opacity-50 disabled:cursor-not-allowed";

  const resetForm = () => {
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  const switchView = (v: View) => {
    resetForm();
    setView(v);
  };

  // ── Login ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email y contrasena son requeridos.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(
          authError.message === "Invalid login credentials"
            ? "Credenciales incorrectas. Verifica tu email y contrasena."
            : authError.message
        );
        setLoading(false);
        return;
      }

      if (data.user && onLogin) {
        onLogin({
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || data.user.email?.split("@")[0],
        });
      }
    } catch {
      setError("Error de conexion. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ── Register ──
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre es requerido.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Email y contrasena son requeridos.");
      return;
    }
    if (password.length < 6) {
      setError("La contrasena debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim() },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // If email confirmation is required, instruct the user to check email.
      // (The autoconfirm RPC was removed for security; new accounts must
      // verify their email like normal Supabase signup flow.)
      if (data.user && !data.session) {
        setSuccess("Cuenta creada. Revisa tu email para confirmarla y luego inicia sesion.");
        setView("login");
        setLoading(false);
        return;
      }

      // Auto-login if no confirmation needed
      if (data.user && data.session && onLogin) {
        onLogin({
          id: data.user.id,
          email: data.user.email || email,
          name: name.trim(),
        });
      }
    } catch {
      setError("Error al crear la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password ──
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Ingresa tu email.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess("Enlace enviado. Revisa tu bandeja de entrada.");
      }
    } catch {
      setError("Error al enviar el enlace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex min-h-screen">
      {/* Panel izquierdo — branding */}
      <div
        className="hidden lg:flex flex-1 flex-col items-center justify-center relative overflow-hidden p-12"
        style={{ background: "linear-gradient(135deg, #04202C 0%, #5B7065 50%, #C9D1C8 100%)" }}
      >
        <div className="flex flex-col items-center z-10">
          {/* Sello con orbitas */}
          <div className="relative w-[280px] h-[280px] md:w-[360px] md:h-[360px] lg:w-[400px] lg:h-[400px] flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[1.5px] border-white/10 animate-[orbit-spin_8s_linear_infinite]"
              style={{ borderTopColor: "rgba(255,255,255,0.7)", borderRightColor: "rgba(255,255,255,0.3)" }} />
            <div className="absolute inset-[8%] rounded-full border-[1.5px] border-white/[0.07] animate-[orbit-spin_6s_linear_infinite_reverse]"
              style={{ borderTopColor: "rgba(255,255,255,0.55)", borderLeftColor: "rgba(255,255,255,0.2)" }} />
            <div className="absolute inset-[18%] rounded-full border-2 border-white/[0.05] animate-[orbit-spin_4.5s_linear_infinite]"
              style={{ borderTopColor: "rgba(255,255,255,0.6)", borderRightColor: "rgba(255,255,255,0.15)" }} />
            <div className="absolute inset-[28%] rounded-full border-[1.5px] border-white/[0.06] animate-[orbit-spin_3.5s_linear_infinite_reverse]"
              style={{ borderTopColor: "rgba(255,255,255,0.5)" }} />
            <div className="absolute inset-[38%] rounded-full border border-white/[0.04] animate-[orbit-spin_2.5s_linear_infinite]"
              style={{ borderTopColor: "rgba(255,255,255,0.4)" }} />
            <img
              src="/images/logo_ia_withe.webp"
              alt="IAgentek"
              className="relative z-10 w-[120px] md:w-[150px] lg:w-[170px] h-auto object-contain"
              style={{ filter: "drop-shadow(0 0 30px rgba(255,255,255,0.15))", animation: "seal-float 4s ease-in-out infinite" }}
            />
          </div>
          <div className="flex items-center gap-3 mt-8">
            <span className="text-white/30 text-xs tracking-wide">by</span>
            <img src="/images/logo_ia_withe.webp" alt="IAgentek" className="h-[36px] w-auto opacity-40" />
            <span className="text-white/50 text-lg font-display font-semibold tracking-wide">IAgentek</span>
          </div>
        </div>
        <img src="/images/logo_ia_withe.webp" alt="" className="absolute -bottom-[30px] -right-[30px] h-[280px] w-auto opacity-[0.05] pointer-events-none select-none" />
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 lg:flex-none lg:w-[480px] lg:min-w-[400px] bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-[380px] w-full">
          {/* Logo mobile */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-8">
            <div className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] flex items-center justify-center mb-4">
              <div className="absolute inset-0 rounded-full border-[1.5px] border-forest/10 animate-[orbit-spin_8s_linear_infinite]"
                style={{ borderTopColor: "rgba(4,32,44,0.5)", borderRightColor: "rgba(4,32,44,0.2)" }} />
              <div className="absolute inset-[10%] rounded-full border-[1.5px] border-forest/[0.07] animate-[orbit-spin_5.5s_linear_infinite_reverse]"
                style={{ borderTopColor: "rgba(4,32,44,0.4)" }} />
              <div className="absolute inset-[22%] rounded-full border border-forest/[0.05] animate-[orbit-spin_3.5s_linear_infinite]"
                style={{ borderTopColor: "rgba(4,32,44,0.35)" }} />
              <img src="/images/logo-iagentek.webp" alt="IAgentek" className="relative z-10 w-[70px] sm:w-[90px] h-auto object-contain"
                style={{ filter: "drop-shadow(0 0 20px rgba(4,32,44,0.1))", animation: "seal-float 4s ease-in-out infinite" }} />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-nxt-900 tracking-tight font-display">IAGENTEK</h1>
            <p className="text-xs sm:text-sm text-nxt-400 font-medium tracking-widest">DESIGN SYSTEM</p>
          </div>

          {/* ── LOGIN ── */}
          {view === "login" && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <h2 className="text-xl sm:text-2xl font-bold text-nxt-900 mb-1 font-display">Bienvenido</h2>
              <p className="text-sm text-nxt-500 mb-6">Inicia sesion para continuar</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-nxt-600 uppercase tracking-wide mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="tu@email.com" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-nxt-600 uppercase tracking-wide mb-1.5">Contrasena</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls + " pr-10"} placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-nxt-400 hover:text-nxt-600 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && <div className="bg-error-light text-error rounded-lg px-4 py-3 text-sm">{error}</div>}

                <button type="submit" disabled={loading} className={btnPrimaryCls}>
                  {loading ? "Iniciando sesion..." : "Iniciar Sesion"}
                </button>
              </form>

              <div className="flex items-center justify-between mt-5">
                <button onClick={() => switchView("forgot")} className="text-sm text-nxt-500 hover:text-forest transition-colors">
                  Olvidaste tu contrasena?
                </button>
              </div>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-nxt-200" />
                <span className="text-xs text-nxt-400 font-medium">o</span>
                <div className="flex-1 h-px bg-nxt-200" />
              </div>

              <button onClick={() => switchView("register")} className="w-full py-3 sm:py-3.5 bg-white border-2 border-forest text-forest font-bold text-sm uppercase tracking-wider rounded-lg transition-all hover:bg-forest hover:text-white hover:-translate-y-px">
                Crear una cuenta
              </button>
            </div>
          )}

          {/* ── REGISTER ── */}
          {view === "register" && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <h2 className="text-xl sm:text-2xl font-bold text-nxt-900 mb-1 font-display">Crear cuenta</h2>
              <p className="text-sm text-nxt-500 mb-6">Registrate para tener tu propio espacio de diseno</p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-nxt-600 uppercase tracking-wide mb-1.5">Nombre</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Tu nombre" required autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-nxt-600 uppercase tracking-wide mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="tu@email.com" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-nxt-600 uppercase tracking-wide mb-1.5">Contrasena</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls + " pr-10"} placeholder="Minimo 6 caracteres" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-nxt-400 hover:text-nxt-600 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-nxt-600 uppercase tracking-wide mb-1.5">Confirmar contrasena</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} placeholder="Repite tu contrasena" required />
                </div>

                {error && <div className="bg-error-light text-error rounded-lg px-4 py-3 text-sm">{error}</div>}
                {success && <div className="bg-success-light text-success rounded-lg px-4 py-3 text-sm">{success}</div>}

                <button type="submit" disabled={loading} className={btnPrimaryCls}>
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </button>
              </form>

              <div className="mt-5 text-center">
                <span className="text-sm text-nxt-400">Ya tienes cuenta? </span>
                <button onClick={() => switchView("login")} className="text-sm text-forest font-semibold hover:text-bark transition-colors">
                  Inicia sesion
                </button>
              </div>
            </div>
          )}

          {/* ── FORGOT ── */}
          {view === "forgot" && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <h2 className="text-xl sm:text-2xl font-bold text-nxt-900 mb-1 font-display">Recuperar contrasena</h2>
              <p className="text-sm text-nxt-500 mb-6">Te enviaremos un enlace para restablecerla.</p>

              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-nxt-600 uppercase tracking-wide mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="tu@email.com" autoFocus required />
                </div>

                {error && <div className="bg-error-light text-error rounded-lg px-4 py-3 text-sm">{error}</div>}
                {success && <div className="bg-success-light text-success rounded-lg px-4 py-3 text-sm">{success}</div>}

                <button type="submit" disabled={loading} className={btnPrimaryCls}>
                  {loading ? "Enviando..." : "Enviar enlace"}
                </button>
              </form>

              <div className="mt-5 text-center">
                <button onClick={() => switchView("login")} className="text-sm text-nxt-500 hover:text-forest transition-colors">
                  Volver al login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes seal-float {
          0%, 100% { transform: translateY(0); filter: drop-shadow(0 0 20px rgba(255,255,255,0.15)); }
          50% { transform: translateY(-8px); filter: drop-shadow(0 0 40px rgba(255,255,255,0.3)); }
        }
      `}</style>
    </div>
  );
}
