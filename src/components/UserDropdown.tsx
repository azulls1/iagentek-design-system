import { useState, useRef, useEffect } from "react";
import { Settings, LogOut, Moon, Sun, KeyRound, Eye, EyeOff, X, Check } from "lucide-react";
import { supabase } from "../lib/supabase";

interface UserDropdownProps {
  initials?: string;
  name?: string;
  role?: string;
  size?: "sm" | "md";
  onSettings?: () => void;
  onLogout?: () => void;
}

export function UserDropdown({
  initials = "SH",
  name = "S. Hernandez",
  role = "Admin",
  size = "md",
  onSettings,
  onLogout,
}: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    document.body.classList.toggle("dark-mode", next);
  };

  const avatarSize = size === "sm" ? "w-7 h-7 text-[10px]" : "w-8 h-8 text-xs";

  // Colors that DON'T change with dark mode global rules
  const dropdownBg = dark ? "#04202C" : "#FFFFFF";
  const dropdownBorder = dark ? "#304040" : "#DFE4E0";
  const headerBg = dark ? "#1A3036" : "#F7F8F7";
  const hoverBg = dark ? "#1A3036" : "#F7F8F7";
  const textPrimary = dark ? "#F7F8F7" : "#04202C";
  const textSecondary = dark ? "#9EADA3" : "#7D8F84";
  const textMenu = dark ? "#DFE4E0" : "#304040";
  const iconColor = dark ? "#9EADA3" : "#9EADA3";

  return (
    <div className="relative" ref={ref}>
      {/* Avatar — texto blanco sobre forest */}
      <button
        onClick={() => setOpen(!open)}
        className={`${avatarSize} rounded-full bg-pine flex items-center justify-center font-bold cursor-pointer hover:ring-2 hover:ring-moss transition-all duration-nxt-fast text-white`}
      >
        {initials}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-56 max-w-[224px] rounded-nxt-lg shadow-nxt-lg z-[9999] overflow-hidden"
          style={{ backgroundColor: dropdownBg, border: `1px solid ${dropdownBorder}` }}
        >
          {/* User info */}
          <div
            className="px-4 py-3"
            style={{ backgroundColor: headerBg, borderBottom: `1px solid ${dropdownBorder}` }}
          >
            <p className="text-sm font-semibold" style={{ color: textPrimary }}>{name}</p>
            <p className="text-xs" style={{ color: textSecondary }}>{role}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => { onSettings?.(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-nxt-fast"
              style={{ color: textMenu }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <Settings size={16} style={{ color: iconColor }} />
              Configuracion
            </button>

            <button
              onClick={() => { setShowPasswordModal(true); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-nxt-fast"
              style={{ color: textMenu }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <KeyRound size={16} style={{ color: iconColor }} />
              Cambiar contraseña
            </button>

            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-nxt-fast"
              style={{ color: textMenu }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {dark ? <Sun size={16} className="text-warning" /> : <Moon size={16} style={{ color: iconColor }} />}
              {dark ? "Modo claro" : "Modo oscuro"}
            </button>
          </div>

          {/* Logout */}
          <div className="py-1" style={{ borderTop: `1px solid ${dropdownBorder}` }}>
            <button
              onClick={() => { onLogout?.(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error transition-colors duration-nxt-fast"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = dark ? "rgba(220,38,38,0.15)" : "#FEF2F2")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <LogOut size={16} />
              Cerrar sesion
            </button>
          </div>
        </div>
      )}

      {/* Modal cambio de contraseña */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const minLength = newPass.length >= 8;
  const hasUpper = /[A-Z]/.test(newPass);
  const hasNumber = /[0-9]/.test(newPass);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPass);
  const matches = newPass === confirm && confirm.length > 0;
  const isValid = minLength && hasUpper && hasNumber && hasSpecial && matches;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError("");

    try {
      // Verify current password by re-signing in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        setError("No se pudo obtener la sesion actual.");
        setLoading(false);
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: current,
      });

      if (signInError) {
        setError("La contraseña actual es incorrecta.");
        setLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPass,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch {
      setError("Error de conexion. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999] p-4"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-nxt-200">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-forest" />
            <h2 className="text-lg font-bold text-nxt-900">Cambiar contraseña</h2>
          </div>
          <button onClick={onClose} className="text-nxt-400 hover:text-nxt-600 p-1 rounded-lg hover:bg-nxt-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-success" />
            </div>
            <p className="text-lg font-semibold text-nxt-900 mb-1">Contraseña actualizada</p>
            <p className="text-sm text-nxt-500">Tu nueva contraseña esta activa.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-error/10 border border-error/20 text-error text-sm rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            {/* Current password */}
            <div>
              <label className="block text-sm font-medium text-nxt-700 mb-1">Contraseña actual</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="w-full px-3 py-2 border border-nxt-200 rounded-lg text-sm focus:ring-2 focus:ring-forest focus:outline-none pr-10"
                  placeholder="Tu contraseña actual"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-nxt-400 hover:text-nxt-600 p-1"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label className="block text-sm font-medium text-nxt-700 mb-1">Nueva contraseña</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3 py-2 border border-nxt-200 rounded-lg text-sm focus:ring-2 focus:ring-forest focus:outline-none pr-10"
                  placeholder="Nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-nxt-400 hover:text-nxt-600 p-1"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Requirements */}
              {newPass.length > 0 && (
                <div className="mt-2 space-y-1">
                  <Req ok={minLength}>Minimo 8 caracteres</Req>
                  <Req ok={hasUpper}>Al menos 1 mayuscula</Req>
                  <Req ok={hasNumber}>Al menos 1 numero</Req>
                  <Req ok={hasSpecial}>Al menos 1 caracter especial (!@#$...)</Req>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium text-nxt-700 mb-1">Confirmar nueva contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:outline-none ${
                  confirm.length > 0
                    ? matches ? "border-success focus:ring-success/30" : "border-error focus:ring-error/30"
                    : "border-nxt-200 focus:ring-forest"
                }`}
                placeholder="Repite la nueva contraseña"
                required
              />
              {confirm.length > 0 && !matches && (
                <p className="text-[11px] text-error mt-1">Las contraseñas no coinciden</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-forest text-white hover:bg-bark active:scale-[0.98]"
            >
              {loading ? "Actualizando..." : "Cambiar contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Req({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex items-center gap-1.5 text-[11px] ${ok ? "text-success" : "text-nxt-400"}`}>
      {ok ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-nxt-300" />}
      {children}
    </div>
  );
}
