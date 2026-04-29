import { useState } from "react";
import {
  Settings, LayoutDashboard, Bell, Activity,
  Server, CheckCircle, AlertTriangle, XCircle, Clock,
  TrendingUp, TrendingDown, RefreshCw,
  Users, BarChart3, ArrowRight, Menu, X, LogOut, User,
  FileText
} from "lucide-react";
import { ServiciosView } from "./ServiciosView";
import { MonitoreoView } from "./MonitoreoView";
import { ConfigView } from "./ConfigView";
import { UserDropdown } from "../components/UserDropdown";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Server, label: "Servicios" },
  { icon: Activity, label: "Monitoreo" },
  { icon: Settings, label: "Config" },
];

export function DashboardFullView({ onLogout }: { onLogout?: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const navigate = (page: string) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-nxt-50 flex flex-col">
      {/* ── Navbar completo ── */}
      <header className="bg-forest sticky top-0 z-fixed">
        <div className="h-0.5 bg-forest w-full" />
        <div className="flex items-center justify-between px-4 md:px-6 h-[52px] sm:h-[58px]">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <img src="/images/logo_ia_withe.webp" alt="IAgentek" className="h-6 w-6 object-contain" />
            <span className="font-bold text-white">Apollo</span>{" "}
            <span className="hidden sm:inline text-xs text-nxt-300 font-normal">Design System</span>
            <span className="text-xs text-nxt-400 hidden md:inline ml-1">v2.4.0</span>
          </div>

          {/* Nav desktop */}
          <nav className="hidden sm:flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-nxt-md text-sm transition-colors ${
                  activePage === item.label ? "bg-nxt-600 text-pine" : "text-nxt-300 hover:text-white hover:bg-nxt-600"
                }`}
              >
                <item.icon size={15} />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <button className="relative text-nxt-300 hover:text-white">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full text-white text-[10px] flex items-center justify-center font-bold">3</span>
            </button>
            <div className="hidden md:flex items-center gap-2">
              <UserDropdown onSettings={() => navigate("Config")} onLogout={onLogout} />
              <div className="text-xs">
                <p className="text-white font-medium">S. Hernandez</p>
                <p className="text-nxt-400">Admin</p>
              </div>
            </div>
            <button className="sm:hidden text-nxt-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-nxt-800 border-t border-nxt-700 px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.label)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-nxt-md text-sm transition-colors ${
                  activePage === item.label ? "bg-nxt-600 text-pine" : "text-nxt-300 hover:text-white hover:bg-nxt-700"
                }`}
              >
                <item.icon size={15} />
                {item.label}
              </button>
            ))}
            <div className="border-t border-nxt-700 pt-2 mt-2 flex items-center gap-2 px-3">
              <UserDropdown onSettings={() => navigate("Config")} onLogout={onLogout} />
              <div className="text-xs">
                <p className="text-white font-medium">S. Hernandez</p>
                <p className="text-nxt-400">Admin</p>
              </div>
              <button className="ml-auto text-nxt-400 hover:text-error" onClick={() => onLogout?.()}><LogOut size={16} /></button>
            </div>
          </div>
        )}
      </header>

      {/* ── Contenido principal ── */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto w-full">
        {activePage === "Dashboard" && <DashboardContent />}
        {activePage === "Servicios" && <ServiciosView />}
        {activePage === "Monitoreo" && <MonitoreoView />}
        {activePage === "Config" && <ConfigView />}
      </main>

      {/* Footer */}
      <footer className="bg-forest text-moss text-[10px] sm:text-xs py-3 px-3 sm:px-4 md:px-6 flex items-center justify-between">
        <span>Apollo v2.4.0 — Forest S.A. de C.V.</span>
        <span>Powered by Forest Design System</span>
      </footer>
    </div>
  );
}

// ── Dashboard content (extracted from original) ──
function DashboardContent() {
  return (
    <>
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-nxt-900">Dashboard</h1>
          <p className="text-sm text-nxt-500">Resumen general del sistema Apollo</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-nxt-400">Actualizado hace 2 min</span>
          <button className="nxt-btn-ghost text-xs"><RefreshCw size={14} /> Actualizar</button>
          <button className="nxt-btn-primary text-xs">+ Nueva Solicitud</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
        {[
          { label: "Total RPUs", value: "2,450", icon: Server, color: "text-forest", bg: "bg-forest/10", trend: "+12" },
          { label: "Completadas", value: "1,892", icon: CheckCircle, color: "text-success", bg: "bg-success-light", trend: "+45" },
          { label: "En Proceso", value: "234", icon: Activity, color: "text-info", bg: "bg-info-light", trend: null },
          { label: "Pendientes", value: "156", icon: Clock, color: "text-warning", bg: "bg-warning-light", trend: "-8" },
          { label: "Fallidas", value: "42", icon: XCircle, color: "text-error", bg: "bg-error-light", trend: "+3" },
          { label: "Timeout", value: "8", icon: AlertTriangle, color: "text-nxt-500", bg: "bg-nxt-100", trend: "-2" },
        ].map((m) => (
          <div key={m.label} className="nxt-card p-3 hover:shadow-nxt-md transition-shadow cursor-pointer group">
            <div className={`w-8 h-8 rounded-nxt-md ${m.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
              <m.icon size={16} className={m.color} />
            </div>
            <p className="text-xl font-bold text-nxt-900">{m.value}</p>
            <p className="text-xs text-nxt-500">{m.label}</p>
            {m.trend && (
              <p className={`text-xs mt-1 ${m.trend.startsWith('+') && m.label !== "Fallidas" ? "text-success" : "text-error"}`}>
                {m.trend} hoy
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Service Health (2/3) */}
        <div className="lg:col-span-2 nxt-card overflow-hidden">
          <div className="p-4 border-b border-nxt-200 flex items-center justify-between">
            <h3 className="font-semibold text-nxt-900">Estado de Servicios</h3>
            <span className="nxt-badge-success text-xs"><CheckCircle size={12} /> 4/5 Saludables</span>
          </div>
          <div className="divide-y divide-nxt-100">
            {[
              { name: "Supabase (PostgreSQL)", status: "healthy", latency: "12ms", uptime: "99.99%" },
              { name: "Python API (FastAPI)", status: "healthy", latency: "45ms", uptime: "99.95%" },
              { name: "n8n Workflows", status: "degraded", latency: "890ms", uptime: "98.2%" },
              { name: "Redis Cache", status: "healthy", latency: "3ms", uptime: "100%" },
              { name: "Icinga Monitoreo", status: "healthy", latency: "67ms", uptime: "99.8%" },
            ].map((svc) => (
              <div key={svc.name} className="flex items-center justify-between p-3 hover:bg-nxt-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    svc.status === "healthy" ? "bg-success animate-pulse" :
                    svc.status === "degraded" ? "bg-warning" : "bg-error"
                  }`} />
                  <span className="text-sm font-medium text-nxt-800">{svc.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-nxt-400 hidden sm:block">{svc.uptime}</span>
                  <span className="text-xs font-mono text-nxt-500 w-12 text-right">{svc.latency}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-nxt-md font-medium ${
                    svc.status === "healthy" ? "bg-success-light text-success" : "bg-warning-light text-warning"
                  }`}>
                    {svc.status === "healthy" ? "OK" : "Lento"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Semaphore + Quick Stats (1/3) */}
        <div className="space-y-4">
          <div className="nxt-card p-4">
            <h3 className="text-sm font-semibold text-nxt-700 mb-3">Comunicacion</h3>
            <div className="flex items-center gap-3 p-3 bg-success-light rounded-nxt-lg">
              <span className="w-4 h-4 rounded-full bg-success animate-pulse" />
              <div>
                <p className="text-sm font-bold text-success">ONLINE</p>
                <p className="text-xs text-success/70">Ping: 12ms | Loss: 0%</p>
              </div>
            </div>
          </div>

          <div className="nxt-card p-4">
            <h3 className="text-sm font-semibold text-nxt-700 mb-3">Resumen Mensual</h3>
            <div className="space-y-3">
              {[
                { label: "Consumo Total", value: "45,230 kWh", trend: "+12%", up: true },
                { label: "Costo Estimado", value: "$128,450", trend: "-8%", up: false },
                { label: "Factor Potencia", value: "0.92", trend: "+0.03", up: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-nxt-500">{s.label}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-nxt-900">{s.value}</span>
                    <span className={`block text-xs ${s.up ? "text-success" : "text-error"}`}>
                      {s.up ? <TrendingUp size={10} className="inline" /> : <TrendingDown size={10} className="inline" />} {s.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="nxt-card overflow-hidden">
        <div className="p-4 border-b border-nxt-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="font-semibold text-nxt-900">Solicitudes Recientes</h3>
          <div className="flex items-center gap-2">
            <div className="flex rounded-nxt-md border border-nxt-200 overflow-hidden">
              <button className="px-3 py-1.5 text-xs bg-forest/10 text-nxt-800 font-medium border-r border-nxt-200">
                <User size={12} className="inline mr-1" /> Mis Solicitudes
              </button>
              <button className="px-3 py-1.5 text-xs text-nxt-500 hover:bg-nxt-50">
                <Users size={12} className="inline mr-1" /> Todas
              </button>
            </div>
          </div>
        </div>
        <div className="divide-y divide-nxt-100">
          {[
            { id: "REQ-2451", action: "Consulta RPU Masiva", host: "Proyecto Centro", status: "completed", time: "hace 3 min", user: "S. Hernandez" },
            { id: "REQ-2450", action: "Sync Monitoreo Icinga", host: "Todos los sitios", status: "running", time: "hace 8 min", user: "S. Hernandez" },
            { id: "REQ-2449", action: "Actualizacion de Tarifas", host: "Division Norte", status: "completed", time: "hace 15 min", user: "A. Lopez" },
            { id: "REQ-2448", action: "Backup Configuracion", host: "router-mty-07", status: "pending", time: "hace 22 min", user: "S. Hernandez" },
            { id: "REQ-2447", action: "Health Check General", host: "Todos los servicios", status: "failed", time: "hace 35 min", user: "J. Martinez" },
            { id: "REQ-2446", action: "Exportar Facturas PDF", host: "Proyecto Sur", status: "completed", time: "hace 1 hora", user: "S. Hernandez" },
          ].map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3 hover:bg-nxt-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  r.status === "completed" ? "bg-success" :
                  r.status === "running" ? "bg-info animate-pulse" :
                  r.status === "pending" ? "bg-warning" : "bg-error"
                }`} />
                <div>
                  <p className="text-sm font-medium text-nxt-800">{r.action}</p>
                  <p className="text-xs text-nxt-400">
                    <span className="font-mono">{r.id}</span> — {r.host} — {r.user}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <span className={`text-xs px-2 py-0.5 rounded-nxt-md font-medium ${
                  r.status === "completed" ? "bg-success-light text-success" :
                  r.status === "running" ? "bg-info-light text-info" :
                  r.status === "pending" ? "bg-warning-light text-warning" : "bg-error-light text-error"
                }`}>
                  {r.status === "completed" ? "Completado" : r.status === "running" ? "Ejecutando" : r.status === "pending" ? "Pendiente" : "Fallido"}
                </span>
                <p className="text-xs text-nxt-400 mt-1">{r.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-nxt-200 text-center">
          <button className="text-sm text-info hover:underline">Ver todas las solicitudes <ArrowRight size={14} className="inline" /></button>
        </div>
      </div>
    </>
  );
}
