import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Palette, Type, Sparkles,
  MousePointer, Tag, CreditCard, Bell, LayoutList, MessageSquare, Loader, Box,
  FormInput, Search, Upload,
  Table, Terminal,
  LayoutGrid, PanelLeft, Navigation,
  LayoutDashboard, Play, Image,
  Menu, X, ChevronRight
} from "lucide-react";
import { UserDropdown } from "./components/UserDropdown";
import { ColorEditToolbar } from "./components/ColorEditToolbar";
import { CompanySelector } from "./components/CompanySelector";
import { ColorOverrideProvider } from "./contexts/ColorOverrideContext";
import { LoginView } from "./views/LoginView";
import { supabase } from "./lib/supabase";

// ─── Code-split: cada section/view pesada se carga on-demand ────
const FundamentosSection  = lazy(() => import("./showcase/FundamentosSection").then(m => ({ default: m.FundamentosSection })));
const ComponentesSection  = lazy(() => import("./showcase/ComponentesSection").then(m => ({ default: m.ComponentesSection })));
const FormulariosSection  = lazy(() => import("./showcase/FormulariosSection").then(m => ({ default: m.FormulariosSection })));
const DatosSection        = lazy(() => import("./showcase/DatosSection").then(m => ({ default: m.DatosSection })));
const LayoutSection       = lazy(() => import("./showcase/LayoutSection").then(m => ({ default: m.LayoutSection })));
const LogosSection        = lazy(() => import("./showcase/LogosSection").then(m => ({ default: m.LogosSection })));
const DashboardFullView   = lazy(() => import("./views/DashboardFullView").then(m => ({ default: m.DashboardFullView })));
const LoadingView         = lazy(() => import("./views/LoadingView").then(m => ({ default: m.LoadingView })));

function SectionFallback() {
  return (
    <div className="flex items-center justify-center py-20 text-nxt-400 text-sm">
      <Loader className="animate-spin mr-2" size={16} /> Cargando...
    </div>
  );
}

// ─── Navigation structure ───────────────────────────────────────
const navSections = [
  {
    title: "FUNDAMENTOS",
    items: [
      { id: "colores", label: "Colores", icon: Palette },
      { id: "tipografia", label: "Tipografia", icon: Type },
      { id: "animaciones", label: "Animaciones", icon: Sparkles },
    ],
  },
  {
    title: "COMPONENTES",
    items: [
      { id: "botones", label: "Botones", icon: MousePointer },
      { id: "badges", label: "Badges & Status", icon: Tag },
      { id: "cards", label: "Cards", icon: CreditCard },
      { id: "alertas-toast", label: "Alertas & Toast", icon: Bell },
      { id: "tabs", label: "Tabs", icon: LayoutList },
      { id: "tooltips-modals", label: "Tooltips & Modals", icon: MessageSquare },
      { id: "progress-spinners", label: "Progress & Spinners", icon: Loader },
      { id: "skeleton-empty", label: "Skeleton & Empty", icon: Box },
    ],
  },
  {
    title: "FORMULARIOS",
    items: [
      { id: "inputs", label: "Inputs & Textarea", icon: FormInput },
      { id: "busqueda", label: "Busqueda & Filtros", icon: Search },
      { id: "upload-modal", label: "Upload & Modal", icon: Upload },
    ],
  },
  {
    title: "DATOS",
    items: [
      { id: "tablas", label: "Tablas", icon: Table },
      { id: "log-viewer", label: "Log Viewer", icon: Terminal },
    ],
  },
  {
    title: "LAYOUT",
    items: [
      { id: "grids", label: "Grids Dashboard", icon: LayoutGrid },
      { id: "sidebar-preview", label: "Sidebar", icon: PanelLeft },
      { id: "navbar-preview", label: "Navbar", icon: Navigation },
    ],
  },
  {
    title: "ASSETS",
    items: [
      { id: "logos-favicons", label: "Logos & Favicons", icon: Image },
    ],
  },
  {
    title: "DEMOS",
    items: [
      { id: "demo-dashboard", label: "Dashboard Completo", icon: LayoutDashboard },
      { id: "demo-loading", label: "Loading States", icon: Play },
    ],
  },
];

// Map section IDs to component + section group
function getSectionGroup(id: string): string {
  for (const section of navSections) {
    if (section.items.some((item) => item.id === id)) {
      return section.title;
    }
  }
  return "";
}

// ─── Main App ──────────────────────────────────────────────────
export function App() {
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Derive activeId from URL path (e.g., "/botones" → "botones")
  const activeId = useMemo(() => {
    const path = location.pathname.replace(/^\//, "") || "colores";
    return path;
  }, [location.pathname]);

  const setActiveId = (id: string) => navigate(`/${id}`);

  // Restore session on mount + listen for OAuth redirects
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
        });
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect to /login when not authenticated
  useEffect(() => {
    if (!loading && !user && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [loading, user, location.pathname, navigate]);

  // Scroll to section when activeId changes (uses window/document scroll)
  useEffect(() => {
    if (loading || !user) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(activeId);
      if (el) {
        // Offset for sticky header so the section title isn't hidden under it.
        const header = document.querySelector("header");
        const headerHeight = header ? header.getBoundingClientRect().height : 56;
        const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [activeId, loading, user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login", { replace: true });
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nxt-50">
        <div className="flex flex-col items-center gap-3">
          <img src="/images/logo-iagentek.webp" alt="IAgentek" className="h-16 w-16 object-contain animate-pulse" />
          <p className="text-sm text-nxt-400">Cargando...</p>
        </div>
      </div>
    );
  }

  // ── Login gate ──
  if (!user) {
    return <LoginView onLogin={(u) => { setUser(u); navigate("/colores", { replace: true }); }} />;
  }

  const userInitials = (user.name || user.email)
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join("");

  // ── Full-page demos ──
  if (activeId === "demo-dashboard") {
    return (
      <ColorOverrideProvider userId={user?.id}>
        <div className="min-h-screen flex flex-col">
          <BackBar onBack={() => setActiveId("colores")} label="Dashboard Completo" />
          <Suspense fallback={<SectionFallback />}>
            <DashboardFullView onLogout={handleLogout} />
          </Suspense>
        </div>
      </ColorOverrideProvider>
    );
  }
  if (activeId === "demo-loading") {
    return (
      <ColorOverrideProvider userId={user?.id}>
        <div className="min-h-screen flex flex-col">
          <BackBar onBack={() => setActiveId("colores")} label="Loading States" />
          <Suspense fallback={<SectionFallback />}>
            <LoadingView />
          </Suspense>
        </div>
      </ColorOverrideProvider>
    );
  }

  const group = getSectionGroup(activeId);

  return (
    <ColorOverrideProvider userId={user?.id}>
    <div className="w-full min-h-screen bg-nxt-50 flex flex-col">
      {/* ── Navbar — Forest glassmorphism ── */}
      <header className="bg-forest sticky top-0 z-fixed flex-shrink-0">
        <div className="h-0.5 bg-pine w-full" />
        <div className="flex items-center justify-between px-3 sm:px-6 h-[52px] sm:h-navbar">
          {/* Left: hamburger + brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-nxt-300 hover:text-white p-1.5"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="font-bold text-white flex items-center gap-2 font-display">
              <img src="/images/logo_ia_withe.webp" alt="IAgentek" className="h-5 w-5 sm:h-6 sm:w-6 object-contain" />
              <span className="text-sm sm:text-base">IAgentek</span>
              <span className="text-xs text-moss ml-1 hidden sm:inline">Design System</span>
            </div>
          </div>
          {/* Right: company + toolbar + user */}
          <div className="flex items-center gap-1 sm:gap-2">
            <CompanySelector />
            <div className="w-px h-5 bg-evergreen hidden sm:block" />
            <ColorEditToolbar />
            <UserDropdown
              initials={userInitials}
              name={user.name || user.email.split("@")[0]}
              role="Authenticated"
              onLogout={handleLogout}
              onSettings={() => setActiveId("colores")}
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* ── Sidebar (desktop: sticky, mobile: overlay drawer) ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            fixed lg:sticky top-[52px] sm:top-navbar bottom-0 lg:bottom-auto left-0
            lg:self-start lg:h-[calc(100vh-56px)]
            w-64 sm:w-72 lg:w-60 xl:w-64
            bg-white border-r border-nxt-200
            overflow-y-auto z-40
            transition-transform duration-200 ease-in-out
            lg:translate-x-0 lg:flex-shrink-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <nav className="py-2">
            {navSections.map((section) => (
              <div key={section.title} className="mb-1">
                <p className="px-4 py-2 text-[10px] font-bold text-nxt-400 uppercase tracking-wider font-display">
                  {section.title}
                </p>
                {section.items.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveId(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors
                        ${isActive
                          ? "bg-forest/10 text-forest font-medium border-r-2 border-forest"
                          : "text-nxt-600 hover:bg-nxt-50 hover:text-nxt-800"
                        }
                      `}
                    >
                      <item.icon size={15} className={isActive ? "text-pine" : "text-nxt-400"} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main id="main-content" className="flex-1 min-w-0 p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="max-w-full mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-nxt-400 mb-4 sm:mb-6">
              <span>{group}</span>
              <ChevronRight size={12} />
              <span className="text-forest font-medium">
                {navSections
                  .flatMap((s) => s.items)
                  .find((i) => i.id === activeId)?.label}
              </span>
            </div>

            {/* Render section content (lazy chunks) */}
            <Suspense fallback={<SectionFallback />}>
              <SectionContent activeId={activeId} userId={user.id} />
            </Suspense>
          </div>
        </main>
      </div>

      {/* ── Footer — Forest styled ── */}
      <footer className="bg-forest flex-shrink-0">
        <div className="h-0.5 bg-pine w-full" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-3 sm:px-6 py-3 text-xs">
          <div className="flex items-center gap-2.5">
            <img src="/images/logo_ia_withe.webp" alt="IAgentek" className="h-4 w-4 object-contain" />
            <span className="font-semibold text-white font-display">IAgentek Design System</span>
            <span className="text-pine">|</span>
            <span className="text-moss">Area de IA & Automatizacion</span>
          </div>
          <div className="flex items-center gap-3 text-moss">
            <span>&copy; {new Date().getFullYear()} IAgentek</span>
            <span className="text-evergreen">|</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
    </ColorOverrideProvider>
  );
}

// ─── Section content router ─────────────────────────────────────
function SectionContent({ activeId, userId }: { activeId: string; userId: string }) {
  // Fundamentos
  if (["colores", "tipografia", "animaciones"].includes(activeId)) {
    return <FundamentosSection scrollTo={activeId} />;
  }
  // Componentes
  if (["botones", "badges", "cards", "alertas-toast", "tabs", "tooltips-modals", "progress-spinners", "skeleton-empty"].includes(activeId)) {
    return <ComponentesSection scrollTo={activeId} />;
  }
  // Formularios
  if (["inputs", "busqueda", "upload-modal"].includes(activeId)) {
    return <FormulariosSection scrollTo={activeId} />;
  }
  // Datos
  if (["tablas", "log-viewer"].includes(activeId)) {
    return <DatosSection scrollTo={activeId} />;
  }
  // Layout
  if (["grids", "sidebar-preview", "navbar-preview"].includes(activeId)) {
    return <LayoutSection scrollTo={activeId} />;
  }
  // Assets
  if (["logos-favicons"].includes(activeId)) {
    return <LogosSection scrollTo={activeId} userId={userId} />;
  }
  return null;
}

// ─── Back bar for full-page demos ────────────────────────────────
function BackBar({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <div className="bg-forest text-white px-3 sm:px-4 py-2 flex items-center gap-3 text-sm sticky top-0 z-[9999]">
      <button onClick={onBack} className="flex items-center gap-1 text-pine hover:text-moss transition-colors">
        <ChevronRight size={16} className="rotate-180" /> Volver
      </button>
      <span className="text-evergreen">|</span>
      <span className="text-fog text-xs sm:text-sm">{label}</span>
    </div>
  );
}
