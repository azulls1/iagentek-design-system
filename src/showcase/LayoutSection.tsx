import { useEffect, useState } from "react";
import {
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  LayoutDashboard,
  Server,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ColorEditable } from "../components/ColorEditable";
import { resolveDefaultBg } from "../utils/tailwindColorMap";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function Section({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10 sm:mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-nxt-900 mb-1">
        {title}
      </h2>
      {description && (
        <p className="text-xs sm:text-sm text-nxt-500 mb-4 sm:mb-6">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const summaryCards = [
  {
    label: "Requests",
    value: "12.4k",
    icon: Activity,
    color: "text-forest",
    bg: "bg-forest/10",
  },
  {
    label: "Latencia",
    value: "45ms",
    icon: Clock,
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    label: "Error Rate",
    value: "0.3%",
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    label: "Uptime",
    value: "99.9%",
    icon: CheckCircle,
    color: "text-success",
    bg: "bg-success/10",
  },
];

const services = [
  { name: "Supabase DB", latency: "12ms", healthy: true },
  { name: "Python API", latency: "45ms", healthy: true },
  { name: "n8n", latency: "89ms", healthy: true },
  { name: "Redis", latency: "3ms", healthy: true },
  { name: "NGINX", latency: "8ms", healthy: true },
  { name: "Gemini", latency: "320ms", healthy: true },
];

const allSidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, group: "principal" },
  { label: "Servicios", icon: Server, group: "principal" },
  { label: "Monitoreo", icon: Activity, group: "principal" },
  { label: "Configuración", icon: Settings, group: "sistema" },
  { label: "Notificaciones", icon: Bell, group: "sistema" },
];

const sidebarPrincipal = allSidebarItems.filter((i) => i.group === "principal");
const sidebarSistema = allSidebarItems.filter((i) => i.group === "sistema");

const navItems = ["Dashboard", "Servicios", "Monitoreo"];

const sidebarContentMap: Record<string, { title: string; desc: string }> = {
  Dashboard: { title: "Dashboard", desc: "Resumen general del sistema." },
  Servicios: { title: "Servicios", desc: "Estado de los microservicios conectados." },
  Monitoreo: { title: "Monitoreo", desc: "Metricas y alertas en tiempo real." },
  Configuración: { title: "Configuración", desc: "Ajustes generales de la plataforma." },
  Notificaciones: { title: "Notificaciones", desc: "Centro de notificaciones y alertas." },
};

/* ------------------------------------------------------------------ */
/*  LayoutSection                                                      */
/* ------------------------------------------------------------------ */

export function LayoutSection({ scrollTo }: { scrollTo?: string }) {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTo]);

  // Grid cards selection (shared across modes)
  const [selectedSummaryCard, setSelectedSummaryCard] = useState<string | null>(null);
  const [selectedServiceCard, setSelectedServiceCard] = useState<string | null>(null);

  // Sidebar state (shared across modes)
  const [activeSidebarItem, setActiveSidebarItem] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Navbar state (shared across modes)
  const [activeNavItem, setActiveNavItem] = useState("Dashboard");

  const sidebarContent = sidebarContentMap[activeSidebarItem] ?? sidebarContentMap["Dashboard"];

  return (
    <>
      {/* ── Dashboard Grids ────────────────────────────────────── */}
      <Section
        id="grids"
        title="Dashboard Grids"
        description="Grids responsivos para dashboards. Summary Grid: 4 columnas que colapsan a 2 en tablet y 1 en mobile. Auto-fit Grid: columnas que se adaptan automaticamente al espacio disponible (min 280px). Usar gap-2 en mobile, gap-3 en desktop."
      >
        {/* ─── Grid Summary (4 columnas) ─────────────────────── */}
        <div>
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">
            Grid Summary (4 columnas)
          </h3>
          <p className="text-xs text-nxt-400 mb-4">Grid de 4 columnas para metricas y KPIs del dashboard principal.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="border border-nxt-200 rounded-nxt-xl p-5 h-full overflow-hidden">
              <div className="grid grid-cols-2 gap-3">
                {summaryCards.map((card) => (
                  <ColorEditable key={card.label} elementKey={`layout.summary-l-${card.label.toLowerCase()}`} defaultBg={resolveDefaultBg(card.bg)} showProperties={["bg"]}>
                    {(styles, _openPicker, _currentHex) => (
                      <div
                        onClick={() => setSelectedSummaryCard(selectedSummaryCard === card.label ? null : card.label)}
                        className={`nxt-card p-3 flex items-center gap-2.5 cursor-pointer transition-all duration-300 active:scale-95 hover:shadow-md hover:border-nxt-300 ${
                          selectedSummaryCard === card.label
                            ? "ring-2 ring-forest scale-[1.02]"
                            : ""
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${card.bg}`} style={styles}>
                          <card.icon className={`w-4 h-4 ${card.color}`} />
                        </div>
                        <div>
                          <p className="text-[10px] text-nxt-500 uppercase tracking-wide">
                            {card.label}
                          </p>
                          <p className="text-sm font-bold text-nxt-900">
                            {card.value}
                          </p>
                        </div>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          {/* Gradiente */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full overflow-hidden">
              <div className="grid grid-cols-2 gap-3">
                {summaryCards.map((card) => (
                  <ColorEditable key={card.label} elementKey={`layout.summary-g-${card.label.toLowerCase()}`} defaultBg={resolveDefaultBg(card.bg)} showProperties={["bg"]}>
                    {(styles, openPicker, _currentHex) => (
                      <div
                        onClick={() => { openPicker(); setSelectedSummaryCard(selectedSummaryCard === card.label ? null : card.label); }}
                        className={`bg-white/15 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2.5 border border-white/20 cursor-pointer transition-all duration-300 active:scale-95 hover:bg-white/25 hover:shadow-lg ${
                          selectedSummaryCard === card.label
                            ? "ring-2 ring-white scale-[1.02]"
                            : ""
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-white/20" style={styles}>
                          <card.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] text-white/70 uppercase tracking-wide">
                            {card.label}
                          </p>
                          <p className="text-sm font-bold text-white">
                            {card.value}
                          </p>
                        </div>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full overflow-hidden">
              <div className="grid grid-cols-2 gap-3">
                {summaryCards.map((card) => (
                  <ColorEditable key={card.label} elementKey={`layout.summary-d-${card.label.toLowerCase()}`} defaultBg={resolveDefaultBg(card.bg)} showProperties={["bg"]}>
                    {(styles, openPicker, _currentHex) => (
                      <div
                        onClick={() => { openPicker(); setSelectedSummaryCard(selectedSummaryCard === card.label ? null : card.label); }}
                        className={`bg-[#1A3036] border border-[#304040] rounded-xl p-3 flex items-center gap-2.5 cursor-pointer transition-all duration-300 active:scale-95 hover:bg-[#333333] hover:border-[#5B7065] ${
                          selectedSummaryCard === card.label
                            ? "ring-2 ring-forest scale-[1.02]"
                            : ""
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${card.bg}`} style={styles}>
                          <card.icon className={`w-4 h-4 ${card.color}`} />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                            {card.label}
                          </p>
                          <p className="text-sm font-bold text-white">
                            {card.value}
                          </p>
                        </div>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Grid Auto-fit Cards ────────────────────────────── */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">
            Grid Auto-fit Cards
          </h3>
          <p className="text-xs text-nxt-400 mb-4">Grid responsivo con auto-fit para cards de servicios y monitoreo.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="border border-nxt-200 rounded-nxt-xl p-5 h-full overflow-hidden">
              <div className="grid grid-cols-1 gap-2.5">
                {services.map((svc) => (
                  <ColorEditable key={svc.name} elementKey={`layout.svc-l-${svc.name.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg("bg-success")} showProperties={["bg"]}>
                    {(styles, _openPicker, _currentHex) => (
                      <div
                        onClick={() => setSelectedServiceCard(selectedServiceCard === svc.name ? null : svc.name)}
                        className={`nxt-card p-2.5 flex items-center justify-between cursor-pointer transition-all duration-300 active:scale-95 hover:shadow-md hover:border-nxt-300 ${
                          selectedServiceCard === svc.name
                            ? "ring-2 ring-forest scale-[1.02]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" style={styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : undefined} />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" style={styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : undefined} />
                          </span>
                          <span className="text-xs font-medium text-nxt-900">
                            {svc.name}
                          </span>
                        </div>
                        <span className="text-xs text-nxt-500 font-mono">
                          {svc.latency}
                        </span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          {/* Gradiente */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full overflow-hidden">
              <div className="grid grid-cols-1 gap-2.5">
                {services.map((svc) => (
                  <ColorEditable key={svc.name} elementKey={`layout.svc-g-${svc.name.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg("bg-green-400")} showProperties={["bg"]}>
                    {(styles, _openPicker, _currentHex) => (
                      <div
                        onClick={() => setSelectedServiceCard(selectedServiceCard === svc.name ? null : svc.name)}
                        className={`bg-white/15 backdrop-blur-sm rounded-xl p-2.5 flex items-center justify-between border border-white/20 cursor-pointer transition-all duration-300 active:scale-95 hover:bg-white/25 hover:shadow-lg ${
                          selectedServiceCard === svc.name
                            ? "ring-2 ring-white scale-[1.02]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" style={styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : undefined} />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-300" style={styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : undefined} />
                          </span>
                          <span className="text-xs font-medium text-white">
                            {svc.name}
                          </span>
                        </div>
                        <span className="text-xs text-white/70 font-mono">
                          {svc.latency}
                        </span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full overflow-hidden">
              <div className="grid grid-cols-1 gap-2.5">
                {services.map((svc) => (
                  <ColorEditable key={svc.name} elementKey={`layout.svc-d-${svc.name.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg("bg-success")} showProperties={["bg"]}>
                    {(styles, _openPicker, _currentHex) => (
                      <div
                        onClick={() => setSelectedServiceCard(selectedServiceCard === svc.name ? null : svc.name)}
                        className={`bg-[#1A3036] border border-[#304040] rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-all duration-300 active:scale-95 hover:bg-[#333333] hover:border-[#5B7065] ${
                          selectedServiceCard === svc.name
                            ? "ring-2 ring-forest scale-[1.02]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" style={styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : undefined} />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" style={styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : undefined} />
                          </span>
                          <span className="text-xs font-medium text-gray-300">
                            {svc.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">
                          {svc.latency}
                        </span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Sidebar Preview ────────────────────────────────────── */}
      <Section
        id="sidebar-preview"
        title="Sidebar Preview"
        description="Navegacion lateral con secciones colapsables. Ancho: 240px expandido, 64px colapsado. En mobile (<768px) se oculta como overlay con hamburger menu. Item activo con fondo primary/15 y borde derecho amarillo."
      >
        <div>
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Sidebar</h3>
          <p className="text-xs text-nxt-400 mb-4">Panel lateral de navegacion con items clickeables, collapse/expand y contenido dinamico.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="border border-nxt-200 rounded-nxt-xl p-5 h-full overflow-hidden">
              <div className="overflow-hidden flex max-h-[300px] rounded-lg">
                {/* Sidebar */}
                <aside className={`flex flex-col bg-white border-r border-nxt-200 shrink-0 transition-all duration-300 ${sidebarCollapsed ? "w-14" : "w-36"}`}>
                  <div className="px-3 py-2.5 border-b border-nxt-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-forest flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-[9px]">N</span>
                      </div>
                      <span className={`font-bold text-xs text-nxt-900 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>Forest</span>
                    </div>
                  </div>
                  <div className="flex-1 px-2 py-2.5 space-y-0.5 overflow-hidden">
                    <p className={`px-2 text-[8px] font-semibold text-nxt-400 uppercase tracking-wider mb-1 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100"}`}>Principal</p>
                    {sidebarPrincipal.map((item) => (
                      <ColorEditable key={item.label} elementKey={`layout.sidebar-l-${item.label.toLowerCase()}`} defaultBg={resolveDefaultBg("bg-forest/15")} showProperties={["bg"]} hasHover={true}>
                        {(styles, openPicker, _currentHex, hoverHandlers) => (
                          <button
                            {...hoverHandlers}
                            onClick={() => { openPicker(); setActiveSidebarItem(item.label); }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer transition-all duration-200 active:scale-95 ${
                              activeSidebarItem === item.label
                                ? "bg-forest/15 text-forest font-medium border-l-2 border-forest"
                                : "text-nxt-600 hover:bg-nxt-50 border-l-2 border-transparent"
                            }`}
                            style={activeSidebarItem === item.label ? styles : undefined}
                          >
                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                            <span className={`transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>{item.label}</span>
                          </button>
                        )}
                      </ColorEditable>
                    ))}
                    <p className={`px-2 pt-2.5 text-[8px] font-semibold text-nxt-400 uppercase tracking-wider mb-1 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 h-0 pt-0 mb-0" : "opacity-100"}`}>Sistema</p>
                    {sidebarSistema.map((item) => (
                      <ColorEditable key={item.label} elementKey={`layout.sidebar-l-${item.label.toLowerCase()}`} defaultBg={resolveDefaultBg("bg-forest/15")} showProperties={["bg"]} hasHover={true}>
                        {(styles, openPicker, _currentHex, hoverHandlers) => (
                          <button
                            {...hoverHandlers}
                            onClick={() => { openPicker(); setActiveSidebarItem(item.label); }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer transition-all duration-200 active:scale-95 ${
                              activeSidebarItem === item.label
                                ? "bg-forest/15 text-forest font-medium border-l-2 border-forest"
                                : "text-nxt-600 hover:bg-nxt-50 border-l-2 border-transparent"
                            }`}
                            style={activeSidebarItem === item.label ? styles : undefined}
                          >
                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                            <span className={`transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>{item.label}</span>
                          </button>
                        )}
                      </ColorEditable>
                    ))}
                  </div>
                  <div className="px-2 py-2 border-t border-nxt-100 flex flex-col items-center gap-1">
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="w-full flex items-center justify-center p-1 rounded text-nxt-400 hover:bg-nxt-100 cursor-pointer transition-all duration-200 active:scale-95"
                    >
                      {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                    </button>
                    <p className={`text-[8px] text-nxt-400 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>v1.0.0</p>
                  </div>
                </aside>
                {/* Content */}
                <div className="flex-1 bg-nxt-50 p-3 overflow-auto">
                  <h3 className="text-xs font-bold text-nxt-900 mb-1 transition-all duration-300">{sidebarContent.title}</h3>
                  <p className="text-[10px] text-nxt-500 mb-2.5 transition-all duration-300">{sidebarContent.desc}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="bg-white rounded border border-nxt-200 p-2.5">
                        <div className="h-2 w-12 bg-nxt-200 rounded mb-2 animate-pulse" />
                        <div className="h-3.5 w-10 bg-nxt-100 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Gradiente */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full overflow-hidden">
              <div className="overflow-hidden flex max-h-[300px] rounded-lg">
                <aside className={`flex flex-col bg-white/15 backdrop-blur-sm border-r border-white/20 shrink-0 transition-all duration-300 ${sidebarCollapsed ? "w-14" : "w-36"}`}>
                  <div className="px-3 py-2.5 border-b border-white/15">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-white/25 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-[9px]">N</span>
                      </div>
                      <span className={`font-bold text-xs text-white transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>Forest</span>
                    </div>
                  </div>
                  <div className="flex-1 px-2 py-2.5 space-y-0.5 overflow-hidden">
                    <p className={`px-2 text-[8px] font-semibold text-white/60 uppercase tracking-wider mb-1 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100"}`}>Principal</p>
                    {sidebarPrincipal.map((item) => (
                      <ColorEditable key={item.label} elementKey={`layout.sidebar-g-${item.label.toLowerCase()}`} defaultBg={resolveDefaultBg("bg-white/25")} showProperties={["bg"]} hasHover={true}>
                        {(styles, openPicker, _currentHex, hoverHandlers) => (
                          <button
                            {...hoverHandlers}
                            onClick={() => { openPicker(); setActiveSidebarItem(item.label); }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer transition-all duration-200 active:scale-95 ${
                              activeSidebarItem === item.label
                                ? "bg-white/25 text-white font-medium border-l-2 border-white"
                                : "text-white/80 hover:bg-white/10 border-l-2 border-transparent"
                            }`}
                            style={activeSidebarItem === item.label ? styles : undefined}
                          >
                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                            <span className={`transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>{item.label}</span>
                          </button>
                        )}
                      </ColorEditable>
                    ))}
                    <p className={`px-2 pt-2.5 text-[8px] font-semibold text-white/60 uppercase tracking-wider mb-1 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 h-0 pt-0 mb-0" : "opacity-100"}`}>Sistema</p>
                    {sidebarSistema.map((item) => (
                      <ColorEditable key={item.label} elementKey={`layout.sidebar-g-${item.label.toLowerCase()}`} defaultBg={resolveDefaultBg("bg-white/25")} showProperties={["bg"]} hasHover={true}>
                        {(styles, openPicker, _currentHex, hoverHandlers) => (
                          <button
                            {...hoverHandlers}
                            onClick={() => { openPicker(); setActiveSidebarItem(item.label); }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer transition-all duration-200 active:scale-95 ${
                              activeSidebarItem === item.label
                                ? "bg-white/25 text-white font-medium border-l-2 border-white"
                                : "text-white/80 hover:bg-white/10 border-l-2 border-transparent"
                            }`}
                            style={activeSidebarItem === item.label ? styles : undefined}
                          >
                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                            <span className={`transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>{item.label}</span>
                          </button>
                        )}
                      </ColorEditable>
                    ))}
                  </div>
                  <div className="px-2 py-2 border-t border-white/15 flex flex-col items-center gap-1">
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="w-full flex items-center justify-center p-1 rounded text-white/60 hover:bg-white/15 cursor-pointer transition-all duration-200 active:scale-95"
                    >
                      {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                    </button>
                    <p className={`text-[8px] text-white/50 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>v1.0.0</p>
                  </div>
                </aside>
                <div className="flex-1 bg-white/10 p-3 overflow-auto">
                  <h3 className="text-xs font-bold text-white mb-1 transition-all duration-300">{sidebarContent.title}</h3>
                  <p className="text-[10px] text-white/70 mb-2.5 transition-all duration-300">{sidebarContent.desc}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="bg-white/15 backdrop-blur-sm rounded border border-white/20 p-2.5">
                        <div className="h-2 w-12 bg-white/30 rounded mb-2 animate-pulse" />
                        <div className="h-3.5 w-10 bg-white/20 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full overflow-hidden">
              <div className="overflow-hidden flex max-h-[300px] rounded-lg">
                <aside className={`flex flex-col bg-[#04202C] border-r border-[#304040] shrink-0 transition-all duration-300 ${sidebarCollapsed ? "w-14" : "w-36"}`}>
                  <div className="px-3 py-2.5 border-b border-[#304040]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-forest flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-[9px]">N</span>
                      </div>
                      <span className={`font-bold text-xs text-white transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>Forest</span>
                    </div>
                  </div>
                  <div className="flex-1 px-2 py-2.5 space-y-0.5 overflow-hidden">
                    <p className={`px-2 text-[8px] font-semibold text-gray-500 uppercase tracking-wider mb-1 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 h-0 mb-0" : "opacity-100"}`}>Principal</p>
                    {sidebarPrincipal.map((item) => (
                      <ColorEditable key={item.label} elementKey={`layout.sidebar-d-${item.label.toLowerCase()}`} defaultBg={resolveDefaultBg("bg-forest/15")} showProperties={["bg"]} hasHover={true}>
                        {(styles, openPicker, _currentHex, hoverHandlers) => (
                          <button
                            {...hoverHandlers}
                            onClick={() => { openPicker(); setActiveSidebarItem(item.label); }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer transition-all duration-200 active:scale-95 ${
                              activeSidebarItem === item.label
                                ? "bg-[rgba(4,32,44,0.15)] text-forest font-medium border-l-2 border-forest"
                                : "text-gray-300 hover:bg-[#1A3036] border-l-2 border-transparent"
                            }`}
                            style={activeSidebarItem === item.label ? styles : undefined}
                          >
                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                            <span className={`transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>{item.label}</span>
                          </button>
                        )}
                      </ColorEditable>
                    ))}
                    <p className={`px-2 pt-2.5 text-[8px] font-semibold text-gray-500 uppercase tracking-wider mb-1 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 h-0 pt-0 mb-0" : "opacity-100"}`}>Sistema</p>
                    {sidebarSistema.map((item) => (
                      <ColorEditable key={item.label} elementKey={`layout.sidebar-d-${item.label.toLowerCase()}`} defaultBg={resolveDefaultBg("bg-forest/15")} showProperties={["bg"]} hasHover={true}>
                        {(styles, openPicker, _currentHex, hoverHandlers) => (
                          <button
                            {...hoverHandlers}
                            onClick={() => { openPicker(); setActiveSidebarItem(item.label); }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs cursor-pointer transition-all duration-200 active:scale-95 ${
                              activeSidebarItem === item.label
                                ? "bg-[rgba(4,32,44,0.15)] text-forest font-medium border-l-2 border-forest"
                                : "text-gray-300 hover:bg-[#1A3036] border-l-2 border-transparent"
                            }`}
                            style={activeSidebarItem === item.label ? styles : undefined}
                          >
                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                            <span className={`transition-all duration-300 ${sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}`}>{item.label}</span>
                          </button>
                        )}
                      </ColorEditable>
                    ))}
                  </div>
                  <div className="px-2 py-2 border-t border-[#304040] flex flex-col items-center gap-1">
                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      className="w-full flex items-center justify-center p-1 rounded text-gray-500 hover:bg-[#1A3036] cursor-pointer transition-all duration-200 active:scale-95"
                    >
                      {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                    </button>
                    <p className={`text-[8px] text-gray-500 transition-all duration-300 ${sidebarCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>v1.0.0</p>
                  </div>
                </aside>
                <div className="flex-1 bg-[#111111] p-3 overflow-auto">
                  <h3 className="text-xs font-bold text-white mb-1 transition-all duration-300">{sidebarContent.title}</h3>
                  <p className="text-[10px] text-gray-500 mb-2.5 transition-all duration-300">{sidebarContent.desc}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="bg-[#1A3036] rounded border border-[#304040] p-2.5">
                        <div className="h-2 w-12 bg-[#304040] rounded mb-2 animate-pulse" />
                        <div className="h-3.5 w-10 bg-[#333333] rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Navbar Preview ─────────────────────────────────────── */}
      <Section
        id="navbar-preview"
        title="Navbar Preview"
        description="Barra de navegacion superior sticky. Altura: 60px desktop, 52px mobile. Contiene: logo/brand, items de navegacion (solo iconos en mobile), notificaciones y avatar/dropdown de usuario. Fondo: nxt-nav-bg (#304040), dark mode: #04202C."
      >
        <div>
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Navbar</h3>
          <p className="text-xs text-nxt-400 mb-4">Barra de navegacion superior con items activos, acciones de usuario y responsividad.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="border border-nxt-200 rounded-nxt-xl p-5 h-full overflow-hidden">
              <div className="overflow-hidden rounded-lg">
                {/* Mini Navbar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-nxt-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-forest flex items-center justify-center">
                      <span className="text-white font-bold text-[9px]">N</span>
                    </div>
                    <span className="font-bold text-xs text-nxt-900">Forest</span>
                  </div>
                  <nav className="flex items-center gap-1 relative">
                    {navItems.map((item) => (
                      <ColorEditable key={item} elementKey={`layout.nav-l-${item.toLowerCase()}`} defaultBg={resolveDefaultBg("bg-forest")} showProperties={["bg"]} hasHover={true}>
                        {(styles, _openPicker, _currentHex, hoverHandlers) => (
                          <button
                            {...hoverHandlers}
                            onClick={() => setActiveNavItem(item)}
                            className={`px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200 active:scale-95 relative ${
                              activeNavItem === item
                                ? "bg-forest/10 text-forest font-medium"
                                : "text-nxt-600 hover:bg-nxt-50"
                            }`}
                            style={activeNavItem === item ? styles : undefined}
                          >
                            {item}
                            <span className={`absolute bottom-0 left-1 right-1 h-0.5 bg-forest rounded-full transition-all duration-300 ${
                              activeNavItem === item ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                            }`} style={styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : undefined} />
                          </button>
                        )}
                      </ColorEditable>
                    ))}
                  </nav>
                  <div className="flex items-center gap-2">
                    <button className="relative p-1.5 rounded text-nxt-500 hover:bg-nxt-50 cursor-pointer transition-all duration-200 active:scale-95">
                      <Bell className="w-3.5 h-3.5" />
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-error rounded-full" />
                    </button>
                    <div className="w-6 h-6 rounded-full bg-forest/20 flex items-center justify-center cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-forest/30 active:scale-95">
                      <span className="text-forest text-[8px] font-bold">SH</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-nxt-50">
                  <p className="text-xs text-nxt-500 transition-all duration-300">
                    Seccion activa: <span className="font-semibold text-nxt-700">{activeNavItem}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Gradiente */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full overflow-hidden">
              <div className="overflow-hidden rounded-lg">
                <div className="flex items-center justify-between px-4 py-2.5 bg-white/15 backdrop-blur-sm border-b border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/25 flex items-center justify-center">
                      <span className="text-white font-bold text-[9px]">N</span>
                    </div>
                    <span className="font-bold text-xs text-white">Forest</span>
                  </div>
                  <nav className="flex items-center gap-1 relative">
                    {navItems.map((item) => (
                      <ColorEditable key={item} elementKey={`layout.nav-g-${item.toLowerCase()}`} defaultBg="#FFFFFF" showProperties={["bg"]} hasHover={true}>
                        {(styles, _openPicker, _currentHex, hoverHandlers) => (
                          <button
                            {...hoverHandlers}
                            onClick={() => setActiveNavItem(item)}
                            className={`px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200 active:scale-95 relative ${
                              activeNavItem === item
                                ? "bg-white/25 text-white font-medium"
                                : "text-white/80 hover:bg-white/10"
                            }`}
                            style={activeNavItem === item ? styles : undefined}
                          >
                            {item}
                            <span className={`absolute bottom-0 left-1 right-1 h-0.5 bg-white rounded-full transition-all duration-300 ${
                              activeNavItem === item ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                            }`} style={styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : undefined} />
                          </button>
                        )}
                      </ColorEditable>
                    ))}
                  </nav>
                  <div className="flex items-center gap-2">
                    <button className="relative p-1.5 rounded text-white/80 hover:bg-white/10 cursor-pointer transition-all duration-200 active:scale-95">
                      <Bell className="w-3.5 h-3.5" />
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-300 rounded-full" />
                    </button>
                    <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-white/30 active:scale-95">
                      <span className="text-white text-[8px] font-bold">SH</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-white/10">
                  <p className="text-xs text-white/70 transition-all duration-300">
                    Seccion activa: <span className="font-semibold text-white">{activeNavItem}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full overflow-hidden">
              <div className="overflow-hidden rounded-lg">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#04202C] border-b border-[#304040]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-forest flex items-center justify-center">
                      <span className="text-white font-bold text-[9px]">N</span>
                    </div>
                    <span className="font-bold text-xs text-white">Forest</span>
                  </div>
                  <nav className="flex items-center gap-1 relative">
                    {navItems.map((item) => (
                      <ColorEditable key={item} elementKey={`layout.nav-d-${item.toLowerCase()}`} defaultBg={resolveDefaultBg("bg-forest")} showProperties={["bg"]} hasHover={true}>
                        {(styles, _openPicker, _currentHex, hoverHandlers) => (
                          <button
                            {...hoverHandlers}
                            onClick={() => setActiveNavItem(item)}
                            className={`px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200 active:scale-95 relative ${
                              activeNavItem === item
                                ? "bg-[rgba(4,32,44,0.15)] text-forest font-medium"
                                : "text-gray-300 hover:bg-[#1A3036]"
                            }`}
                            style={activeNavItem === item ? styles : undefined}
                          >
                            {item}
                            <span className={`absolute bottom-0 left-1 right-1 h-0.5 bg-forest rounded-full transition-all duration-300 ${
                              activeNavItem === item ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                            }`} style={styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : undefined} />
                          </button>
                        )}
                      </ColorEditable>
                    ))}
                  </nav>
                  <div className="flex items-center gap-2">
                    <button className="relative p-1.5 rounded text-gray-400 hover:bg-[#1A3036] cursor-pointer transition-all duration-200 active:scale-95">
                      <Bell className="w-3.5 h-3.5" />
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-error rounded-full" />
                    </button>
                    <div className="w-6 h-6 rounded-full bg-forest/20 flex items-center justify-center cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-forest/30 active:scale-95">
                      <span className="text-forest text-[8px] font-bold">SH</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-[#111111]">
                  <p className="text-xs text-gray-500 transition-all duration-300">
                    Seccion activa: <span className="font-semibold text-gray-300">{activeNavItem}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
