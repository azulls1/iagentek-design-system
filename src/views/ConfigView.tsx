import { useState } from "react";
import {
  Settings, Shield, Bell, Database, Globe, Users,
  Key, Mail, Clock, Save, RefreshCw, CheckCircle,
  AlertTriangle, Eye, EyeOff, ChevronRight, Palette,
  Monitor, Moon, Sun, Zap, Lock, Unlock
} from "lucide-react";

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-nxt-300"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
        enabled ? "translate-x-5" : "translate-x-0.5"
      }`} />
    </button>
  );
}

function ConfigSection({ title, description, icon: Icon, children }: {
  title: string; description: string; icon: typeof Settings; children: React.ReactNode;
}) {
  return (
    <div className="nxt-card overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-nxt-200 flex items-center gap-3">
        <div className="w-8 h-8 rounded-nxt-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon size={16} className="text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-nxt-900 text-sm sm:text-base">{title}</h3>
          <p className="text-xs text-nxt-500">{description}</p>
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-4">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }: {
  label: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 py-2">
      <div className="flex-1">
        <p className="text-sm font-medium text-nxt-800">{label}</p>
        {description && <p className="text-xs text-nxt-400">{description}</p>}
      </div>
      <div className="sm:ml-4">{children}</div>
    </div>
  );
}

export function ConfigView() {
  const [notifications, setNotifications] = useState({ email: true, slack: true, sms: false, browser: true });
  const [security, setSecurity] = useState({ twoFactor: true, sessionTimeout: "30", ipWhitelist: false, auditLog: true });
  const [general, setGeneral] = useState({ theme: "light", language: "es", timezone: "America/Mexico_City", autoRefresh: true, refreshInterval: "30" });
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("general");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "security", label: "Seguridad", icon: Shield },
    { id: "api", label: "API & Integraciones", icon: Key },
    { id: "users", label: "Usuarios", icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-nxt-900">Configuracion</h1>
          <p className="text-sm text-nxt-500">Ajustes del sistema y preferencias</p>
        </div>
        <button onClick={handleSave} className="nxt-btn-primary text-xs flex items-center gap-1.5">
          {saved ? <><CheckCircle size={14} /> Guardado</> : <><Save size={14} /> Guardar Cambios</>}
        </button>
      </div>

      {/* Layout: sidebar + content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar nav — horizontal tabs on mobile, vertical sidebar on md+ */}
        <div className="md:col-span-1">
          <nav className="nxt-card p-2 flex md:flex-col gap-1 md:gap-0.5 overflow-x-auto md:overflow-x-visible">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex-shrink-0 md:w-full flex items-center gap-2 px-3 py-2.5 rounded-nxt-md text-sm transition-colors ${
                  activeSection === s.id
                    ? "bg-primary/10 text-nxt-900 font-medium"
                    : "text-nxt-500 hover:text-nxt-700 hover:bg-nxt-50"
                }`}
              >
                <s.icon size={16} />
                <span className="whitespace-nowrap">{s.label}</span>
                {activeSection === s.id && <ChevronRight size={14} className="ml-auto text-primary hidden md:block" />}
              </button>
            ))}
          </nav>

          {/* System info */}
          <div className="nxt-card p-3 sm:p-4 mt-4 hidden md:block">
            <h4 className="text-xs font-semibold text-nxt-600 mb-3">Sistema</h4>
            <div className="space-y-2 text-xs">
              {[
                { label: "Version", value: "Apollo v2.4.0" },
                { label: "Design System", value: "v1.0.0" },
                { label: "Node", value: "v20.11.0" },
                { label: "Ambiente", value: "Produccion" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-nxt-500">{item.label}</span>
                  <span className="font-mono text-nxt-700">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-4">
          {/* General */}
          {activeSection === "general" && (
            <>
              <ConfigSection title="Apariencia" description="Tema y preferencias visuales" icon={Palette}>
                <SettingRow label="Tema" description="Selecciona el tema de la interfaz">
                  <div className="flex gap-1 rounded-nxt-md border border-nxt-200 overflow-hidden">
                    {[
                      { value: "light", icon: Sun, label: "Claro" },
                      { value: "dark", icon: Moon, label: "Oscuro" },
                      { value: "auto", icon: Monitor, label: "Auto" },
                    ].map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setGeneral({ ...general, theme: t.value })}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs transition-colors ${
                          general.theme === t.value
                            ? "bg-primary/10 text-nxt-800 font-medium"
                            : "text-nxt-500 hover:bg-nxt-50"
                        }`}
                      >
                        <t.icon size={12} /> {t.label}
                      </button>
                    ))}
                  </div>
                </SettingRow>
                <SettingRow label="Idioma" description="Idioma de la interfaz">
                  <select
                    value={general.language}
                    onChange={(e) => setGeneral({ ...general, language: e.target.value })}
                    className="nxt-input text-sm w-full sm:w-40"
                  >
                    <option value="es">Espanol</option>
                    <option value="en">English</option>
                  </select>
                </SettingRow>
                <SettingRow label="Zona Horaria">
                  <select
                    value={general.timezone}
                    onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                    className="nxt-input text-sm w-full sm:w-52"
                  >
                    <option value="America/Mexico_City">America/Mexico_City (CST)</option>
                    <option value="America/Monterrey">America/Monterrey (CST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </SettingRow>
              </ConfigSection>

              <ConfigSection title="Datos" description="Actualizacion y sincronizacion" icon={RefreshCw}>
                <SettingRow label="Auto-refresh" description="Actualizar datos automaticamente">
                  <Toggle enabled={general.autoRefresh} onChange={() => setGeneral({ ...general, autoRefresh: !general.autoRefresh })} />
                </SettingRow>
                {general.autoRefresh && (
                  <SettingRow label="Intervalo de actualizacion">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={general.refreshInterval}
                        onChange={(e) => setGeneral({ ...general, refreshInterval: e.target.value })}
                        className="nxt-input text-sm w-20 text-center"
                        min="5"
                        max="300"
                      />
                      <span className="text-xs text-nxt-500">segundos</span>
                    </div>
                  </SettingRow>
                )}
              </ConfigSection>
            </>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <ConfigSection title="Canales de Notificacion" description="Configura donde recibir alertas" icon={Bell}>
              <SettingRow label="Email" description="Recibir alertas por correo electronico">
                <Toggle enabled={notifications.email} onChange={() => setNotifications({ ...notifications, email: !notifications.email })} />
              </SettingRow>
              <SettingRow label="Slack" description="Enviar alertas al canal de Slack">
                <Toggle enabled={notifications.slack} onChange={() => setNotifications({ ...notifications, slack: !notifications.slack })} />
              </SettingRow>
              <SettingRow label="SMS" description="Alertas criticas por mensaje de texto">
                <Toggle enabled={notifications.sms} onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })} />
              </SettingRow>
              <SettingRow label="Navegador" description="Notificaciones push en el navegador">
                <Toggle enabled={notifications.browser} onChange={() => setNotifications({ ...notifications, browser: !notifications.browser })} />
              </SettingRow>

              <div className="border-t border-nxt-200 pt-4 mt-4">
                <h4 className="text-sm font-medium text-nxt-700 mb-3">Niveles de alerta</h4>
                <div className="space-y-2">
                  {[
                    { level: "Critico", desc: "Servicios caidos, errores graves", color: "border-l-error" },
                    { level: "Alerta", desc: "Degradacion, umbrales cercanos", color: "border-l-warning" },
                    { level: "Info", desc: "Cambios de estado, acciones completadas", color: "border-l-info" },
                  ].map((item) => (
                    <div key={item.level} className={`flex items-center justify-between p-3 bg-nxt-50 rounded-nxt-md border-l-4 ${item.color}`}>
                      <div>
                        <p className="text-sm font-medium text-nxt-800">{item.level}</p>
                        <p className="text-xs text-nxt-500">{item.desc}</p>
                      </div>
                      <Toggle enabled={true} onChange={() => {}} />
                    </div>
                  ))}
                </div>
              </div>
            </ConfigSection>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <ConfigSection title="Seguridad" description="Autenticacion y control de acceso" icon={Shield}>
              <SettingRow label="Autenticacion de dos factores" description="Requiere codigo adicional al iniciar sesion">
                <div className="flex items-center gap-2">
                  <Toggle enabled={security.twoFactor} onChange={() => setSecurity({ ...security, twoFactor: !security.twoFactor })} />
                  {security.twoFactor && <span className="nxt-badge-success text-xs">Activo</span>}
                </div>
              </SettingRow>
              <SettingRow label="Timeout de sesion" description="Cerrar sesion despues de inactividad">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                    className="nxt-input text-sm w-20 text-center"
                  />
                  <span className="text-xs text-nxt-500">minutos</span>
                </div>
              </SettingRow>
              <SettingRow label="Lista blanca de IPs" description="Solo permitir acceso desde IPs autorizadas">
                <div className="flex items-center gap-2">
                  <Toggle enabled={security.ipWhitelist} onChange={() => setSecurity({ ...security, ipWhitelist: !security.ipWhitelist })} />
                  {security.ipWhitelist ? <Lock size={14} className="text-success" /> : <Unlock size={14} className="text-nxt-400" />}
                </div>
              </SettingRow>
              <SettingRow label="Log de auditoria" description="Registrar todas las acciones de usuarios">
                <Toggle enabled={security.auditLog} onChange={() => setSecurity({ ...security, auditLog: !security.auditLog })} />
              </SettingRow>

              <div className="border-t border-nxt-200 pt-4 mt-4">
                <div className="bg-warning-light border border-warning/30 rounded-nxt-md p-3 flex items-start gap-3">
                  <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-nxt-800">Zona de peligro</p>
                    <p className="text-xs text-nxt-600 mb-2">Acciones irreversibles que afectan la seguridad del sistema</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button className="px-3 py-1.5 text-xs border border-error text-error rounded-nxt-md hover:bg-error-light transition-colors">
                        Revocar todas las sesiones
                      </button>
                      <button className="px-3 py-1.5 text-xs border border-error text-error rounded-nxt-md hover:bg-error-light transition-colors">
                        Resetear API keys
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ConfigSection>
          )}

          {/* API */}
          {activeSection === "api" && (
            <ConfigSection title="API & Integraciones" description="Claves de acceso y conexiones externas" icon={Key}>
              <div>
                <label className="text-sm font-medium text-nxt-800 block mb-1">API Key</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value="nxtv_sk_prod_4rF5VlU8kh6bsuZN7AmTjq286MQp1Oj"
                      readOnly
                      className="nxt-input text-sm font-mono pr-10 w-full"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-nxt-400 hover:text-nxt-600"
                    >
                      {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="nxt-btn-secondary text-xs">Copiar</button>
                    <button className="nxt-btn-ghost text-xs text-error">Regenerar</button>
                  </div>
                </div>
                <p className="text-xs text-nxt-400 mt-1">Creada el 15 Mar 2026 — Expira el 15 Mar 2027</p>
              </div>

              <div className="border-t border-nxt-200 pt-4 mt-4">
                <h4 className="text-sm font-medium text-nxt-700 mb-3">Integraciones Activas</h4>
                <div className="space-y-2">
                  {[
                    { name: "GitLab", status: "connected", desc: "gitlab.nxtview.com", icon: Globe },
                    { name: "Slack", status: "connected", desc: "#apollo-alerts", icon: Bell },
                    { name: "Supabase", status: "connected", desc: "db.nxtview.com", icon: Database },
                    { name: "Jira", status: "disconnected", desc: "No configurado", icon: Zap },
                  ].map((int) => (
                    <div key={int.name} className="flex items-center justify-between p-3 bg-nxt-50 rounded-nxt-md">
                      <div className="flex items-center gap-3">
                        <int.icon size={16} className="text-nxt-500" />
                        <div>
                          <p className="text-sm font-medium text-nxt-800">{int.name}</p>
                          <p className="text-xs text-nxt-400">{int.desc}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-nxt-md font-medium ${
                        int.status === "connected" ? "bg-success-light text-success" : "bg-nxt-200 text-nxt-500"
                      }`}>
                        {int.status === "connected" ? "Conectado" : "Desconectado"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ConfigSection>
          )}

          {/* Users */}
          {activeSection === "users" && (
            <ConfigSection title="Usuarios y Permisos" description="Gestion de acceso al sistema" icon={Users}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-nxt-200">
                      <th className="text-left text-xs font-semibold text-nxt-600 pb-3">Usuario</th>
                      <th className="text-left text-xs font-semibold text-nxt-600 pb-3">Rol</th>
                      <th className="text-center text-xs font-semibold text-nxt-600 pb-3">Estado</th>
                      <th className="text-right text-xs font-semibold text-nxt-600 pb-3">Ultimo acceso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nxt-100">
                    {[
                      { name: "S. Hernandez", email: "shernandez@nxtview.com", role: "Admin", status: "active", lastAccess: "Ahora", initials: "SH" },
                      { name: "A. Lopez", email: "alopez@nxtview.com", role: "Operador", status: "active", lastAccess: "hace 2 horas", initials: "AL" },
                      { name: "J. Martinez", email: "jmartinez@nxtview.com", role: "Viewer", status: "active", lastAccess: "hace 1 dia", initials: "JM" },
                      { name: "R. Garcia", email: "rgarcia@nxtview.com", role: "Operador", status: "inactive", lastAccess: "hace 15 dias", initials: "RG" },
                    ].map((user) => (
                      <tr key={user.email} className="hover:bg-nxt-50">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-nxt-800 text-xs font-bold">
                              {user.initials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-nxt-800">{user.name}</p>
                              <p className="text-xs text-nxt-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-nxt-md font-medium ${
                            user.role === "Admin" ? "bg-primary/10 text-nxt-800" :
                            user.role === "Operador" ? "bg-info-light text-info" : "bg-nxt-100 text-nxt-600"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`inline-flex items-center gap-1 text-xs ${
                            user.status === "active" ? "text-success" : "text-nxt-400"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-success" : "bg-nxt-300"}`} />
                            {user.status === "active" ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="py-3 text-right text-xs text-nxt-500">{user.lastAccess}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ConfigSection>
          )}
        </div>
      </div>
    </div>
  );
}
