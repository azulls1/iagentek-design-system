import { useEffect, useState } from "react";
import {
  ChevronRight,
  Home,
  Folder,
  FileText,
  Settings,
  X,
  ArrowLeft,
  Plus,
  Download,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Layers,
  CheckCircle,
  MoreHorizontal,
  PanelLeftOpen,
  PanelRightOpen,
  Trash2,
  Tag,
} from "lucide-react";
import { ColorEditable } from "../components/ColorEditable";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { resolveDefaultBg, resolveDominantColor, resolveHoverColor } from "../utils/tailwindColorMap";

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
    <section id={id} className="mb-10 sm:mb-12 pt-8 border-t-2 border-nxt-200 first:border-t-0 first:pt-0">
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

const footerLinks = {
  producto: [
    { label: "Plataforma", href: "#" },
    { label: "Integraciones", href: "#" },
    { label: "Precios", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  recursos: [
    { label: "Documentacion", href: "#" },
    { label: "Guias de inicio", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
  ],
  legal: [
    { label: "Terminos de uso", href: "#" },
    { label: "Privacidad", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "Licencias", href: "#" },
  ],
};

const socialIcons = [
  { icon: Github, label: "GitHub" },
  { icon: Twitter, label: "Twitter" },
  { icon: Linkedin, label: "LinkedIn" },
  { icon: Mail, label: "Email" },
];

const defaultBreadcrumbs = [
  { label: "Inicio", icon: Home },
  { label: "Proyectos", icon: Folder },
  { label: "Cortex AI", icon: Layers },
  { label: "Configuracion", icon: Settings },
  { label: "Detalle", icon: FileText },
];

const pageHeaderTabs = ["General", "Permisos", "Historial", "Configuracion"];

type DrawerSize = "sm" | "md" | "lg";
type DrawerSide = "left" | "right";

/* ------------------------------------------------------------------ */
/*  EstructuraSection                                                  */
/* ------------------------------------------------------------------ */

export function EstructuraSection({ scrollTo }: { scrollTo?: string }) {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTo]);

  /* ---- Footer state ---- */
  const [footerVariant, setFooterVariant] = useState<"dark" | "light" | "minimal">("dark");

  /* ---- Breadcrumbs state ---- */
  const [breadcrumbItems, setBreadcrumbItems] = useState(defaultBreadcrumbs.slice(0, 3));
  const [breadcrumbActive, setBreadcrumbActive] = useState(2);
  const [breadcrumbCollapsed, setBreadcrumbCollapsed] = useState(false);

  const addBreadcrumb = () => {
    const pool = defaultBreadcrumbs;
    const nextIdx = breadcrumbItems.length % pool.length;
    const newItem = pool[nextIdx];
    const updated = [...breadcrumbItems, newItem];
    setBreadcrumbItems(updated);
    setBreadcrumbActive(updated.length - 1);
    if (updated.length > 4) setBreadcrumbCollapsed(true);
  };

  const removeBreadcrumb = () => {
    if (breadcrumbItems.length <= 1) return;
    const updated = breadcrumbItems.slice(0, -1);
    setBreadcrumbItems(updated);
    setBreadcrumbActive(Math.min(breadcrumbActive, updated.length - 1));
    if (updated.length <= 4) setBreadcrumbCollapsed(false);
  };

  /* ---- Page Header state ---- */
  const [headerVariant, setHeaderVariant] = useState<"standard" | "breadcrumbs" | "tabs" | "status" | "back">("standard");
  const [headerActiveTab, setHeaderActiveTab] = useState(0);

  /* ---- Drawer state ---- */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSide, setDrawerSide] = useState<DrawerSide>("right");
  const [drawerSize, setDrawerSize] = useState<DrawerSize>("md");

  const openDrawer = (side: DrawerSide, size: DrawerSize) => {
    setDrawerSide(side);
    setDrawerSize(size);
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const drawerWidthClass: Record<DrawerSize, string> = {
    sm: "w-64",
    md: "w-80",
    lg: "w-96",
  };

  return (
    <>
      {/* ================================================================ */}
      {/*  FOOTER                                                          */}
      {/* ================================================================ */}
      <Section
        id="footer"
        title="Footer"
        description="Pie de pagina con multiples variantes: completo (4 columnas con info de empresa, links de producto, recursos y legal), claro, oscuro y minimal. Incluye barra inferior con copyright e iconos sociales."
      >
        {/* Variant selector */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-nxt-700 mb-2">Variante activa</h3>
          <div className="flex flex-wrap gap-2">
            {(["dark", "light", "minimal"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setFooterVariant(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 active:scale-95 ${
                  footerVariant === v
                    ? "bg-forest text-white shadow-sm"
                    : "bg-nxt-100 text-nxt-600 hover:bg-nxt-200"
                }`}
              >
                {v === "dark" ? "Oscuro" : v === "light" ? "Claro" : "Minimal"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* ---- Light ---- */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full overflow-hidden">
              {footerVariant === "dark" && (
                <footer className="bg-nxt-900 rounded-lg p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ColorEditable elementKey="estructura.footer-logo-l" defaultBg="#04202C">
                          {(styles, openPicker, currentHex, hoverHandlers) => (
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ ...styles, backgroundColor: styles.backgroundColor || "#04202C" }} onClick={openPicker} {...hoverHandlers}>
                              <span className="text-nxt-900 font-bold text-xs">N</span>
                            </div>
                          )}
                        </ColorEditable>
                        <span className="font-bold text-sm text-white">Forest</span>
                      </div>
                      <p className="text-[11px] text-nxt-400 leading-relaxed">
                        Plataforma de automatizacion e inteligencia artificial para equipos de tecnologia.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">Producto</h4>
                      <ul className="space-y-1.5">
                        {footerLinks.producto.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="text-[11px] text-nxt-400 hover:text-forest transition-colors duration-200">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">Recursos</h4>
                      <ul className="space-y-1.5">
                        {footerLinks.recursos.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="text-[11px] text-nxt-400 hover:text-forest transition-colors duration-200">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">Legal</h4>
                      <ul className="space-y-1.5">
                        {footerLinks.legal.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="text-[11px] text-nxt-400 hover:text-forest transition-colors duration-200">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-nxt-700 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[10px] text-nxt-500">&copy; 2026 Forest. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-3">
                      {socialIcons.map((s) => (
                        <button key={s.label} className="text-nxt-500 hover:text-forest transition-colors duration-200 cursor-pointer active:scale-90" title={s.label}>
                          <s.icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </footer>
              )}

              {footerVariant === "light" && (
                <footer className="bg-white rounded-lg border border-nxt-200 p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ColorEditable elementKey="estructura.footer-logo-light-l" defaultBg="#04202C">
                          {(styles, openPicker, currentHex, hoverHandlers) => (
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ ...styles, backgroundColor: styles.backgroundColor || "#04202C" }} onClick={openPicker} {...hoverHandlers}>
                              <span className="text-nxt-900 font-bold text-xs">N</span>
                            </div>
                          )}
                        </ColorEditable>
                        <span className="font-bold text-sm text-nxt-900">Forest</span>
                      </div>
                      <p className="text-[11px] text-nxt-500 leading-relaxed">
                        Plataforma de automatizacion e inteligencia artificial para equipos de tecnologia.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-nxt-900 uppercase tracking-wider mb-2">Producto</h4>
                      <ul className="space-y-1.5">
                        {footerLinks.producto.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="text-[11px] text-nxt-500 hover:text-forest transition-colors duration-200">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-nxt-900 uppercase tracking-wider mb-2">Recursos</h4>
                      <ul className="space-y-1.5">
                        {footerLinks.recursos.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="text-[11px] text-nxt-500 hover:text-forest transition-colors duration-200">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-nxt-900 uppercase tracking-wider mb-2">Legal</h4>
                      <ul className="space-y-1.5">
                        {footerLinks.legal.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="text-[11px] text-nxt-500 hover:text-forest transition-colors duration-200">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-nxt-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[10px] text-nxt-400">&copy; 2026 Forest. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-3">
                      {socialIcons.map((s) => (
                        <button key={s.label} className="text-nxt-400 hover:text-forest transition-colors duration-200 cursor-pointer active:scale-90" title={s.label}>
                          <s.icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </footer>
              )}

              {footerVariant === "minimal" && (
                <footer className="bg-white rounded-lg border border-nxt-200 px-5 py-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ColorEditable elementKey="estructura.footer-logo-min-l" defaultBg="#04202C">
                        {(styles, openPicker, currentHex, hoverHandlers) => (
                          <div className="w-5 h-5 rounded flex items-center justify-center cursor-pointer" style={{ ...styles, backgroundColor: styles.backgroundColor || "#04202C" }} onClick={openPicker} {...hoverHandlers}>
                            <span className="text-nxt-900 font-bold text-[8px]">N</span>
                          </div>
                        )}
                      </ColorEditable>
                      <span className="font-bold text-xs text-nxt-900">Forest</span>
                    </div>
                    <nav className="flex items-center gap-4">
                      {["Producto", "Documentacion", "Soporte", "Privacidad"].map((link) => (
                        <a key={link} href="#" className="text-[11px] text-nxt-500 hover:text-forest transition-colors duration-200">{link}</a>
                      ))}
                    </nav>
                    <p className="text-[10px] text-nxt-400">&copy; 2026 Forest</p>
                  </div>
                </footer>
              )}
            </div>
          </div>

          {/* ---- Gradient ---- */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                {footerVariant === "dark" && (
                  <footer className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <ColorEditable elementKey="estructura.footer-logo-g" defaultBg="#04202C">
                            {(styles, openPicker, currentHex, hoverHandlers) => (
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ ...styles, backgroundColor: styles.backgroundColor || "#04202C" }} onClick={openPicker} {...hoverHandlers}>
                                <span className="text-nxt-900 font-bold text-xs">N</span>
                              </div>
                            )}
                          </ColorEditable>
                          <span className="font-bold text-sm text-white">Forest</span>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed">
                          Plataforma de automatizacion e IA para equipos de tecnologia.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">Producto</h4>
                        <ul className="space-y-1.5">
                          {footerLinks.producto.map((link) => (
                            <li key={link.label}>
                              <a href={link.href} className="text-[11px] text-white/50 hover:text-forest transition-colors duration-200">{link.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">Recursos</h4>
                        <ul className="space-y-1.5">
                          {footerLinks.recursos.map((link) => (
                            <li key={link.label}>
                              <a href={link.href} className="text-[11px] text-white/50 hover:text-forest transition-colors duration-200">{link.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">Legal</h4>
                        <ul className="space-y-1.5">
                          {footerLinks.legal.map((link) => (
                            <li key={link.label}>
                              <a href={link.href} className="text-[11px] text-white/50 hover:text-forest transition-colors duration-200">{link.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="border-t border-white/15 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-[10px] text-white/40">&copy; 2026 Forest. Todos los derechos reservados.</p>
                      <div className="flex items-center gap-3">
                        {socialIcons.map((s) => (
                          <button key={s.label} className="text-white/40 hover:text-forest transition-colors duration-200 cursor-pointer active:scale-90" title={s.label}>
                            <s.icon className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </footer>
                )}

                {footerVariant === "light" && (
                  <footer className="bg-white/15 backdrop-blur-sm rounded-lg border border-white/10 p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <ColorEditable elementKey="estructura.footer-logo-lightv-g" defaultBg="#04202C">
                            {(styles, openPicker, currentHex, hoverHandlers) => (
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ ...styles, backgroundColor: styles.backgroundColor || "#04202C" }} onClick={openPicker} {...hoverHandlers}>
                                <span className="text-nxt-900 font-bold text-xs">N</span>
                              </div>
                            )}
                          </ColorEditable>
                          <span className="font-bold text-sm text-white">Forest</span>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed">
                          Plataforma de automatizacion e IA para equipos de tecnologia.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">Producto</h4>
                        <ul className="space-y-1.5">
                          {footerLinks.producto.map((link) => (
                            <li key={link.label}>
                              <a href={link.href} className="text-[11px] text-white/50 hover:text-forest transition-colors duration-200">{link.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">Recursos</h4>
                        <ul className="space-y-1.5">
                          {footerLinks.recursos.map((link) => (
                            <li key={link.label}>
                              <a href={link.href} className="text-[11px] text-white/50 hover:text-forest transition-colors duration-200">{link.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">Legal</h4>
                        <ul className="space-y-1.5">
                          {footerLinks.legal.map((link) => (
                            <li key={link.label}>
                              <a href={link.href} className="text-[11px] text-white/50 hover:text-forest transition-colors duration-200">{link.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="border-t border-white/15 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <p className="text-[10px] text-white/40">&copy; 2026 Forest. Todos los derechos reservados.</p>
                      <div className="flex items-center gap-3">
                        {socialIcons.map((s) => (
                          <button key={s.label} className="text-white/40 hover:text-forest transition-colors duration-200 cursor-pointer active:scale-90" title={s.label}>
                            <s.icon className="w-3.5 h-3.5" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </footer>
                )}

                {footerVariant === "minimal" && (
                  <footer className="bg-white/15 backdrop-blur-sm rounded-lg border border-white/10 px-5 py-3">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <ColorEditable elementKey="estructura.footer-logo-minv-g" defaultBg="#04202C">
                          {(styles, openPicker, currentHex, hoverHandlers) => (
                            <div className="w-5 h-5 rounded flex items-center justify-center cursor-pointer" style={{ ...styles, backgroundColor: styles.backgroundColor || "#04202C" }} onClick={openPicker} {...hoverHandlers}>
                              <span className="text-nxt-900 font-bold text-[8px]">N</span>
                            </div>
                          )}
                        </ColorEditable>
                        <span className="font-bold text-xs text-white">Forest</span>
                      </div>
                      <nav className="flex items-center gap-4">
                        {["Producto", "Documentacion", "Soporte", "Privacidad"].map((link) => (
                          <a key={link} href="#" className="text-[11px] text-white/60 hover:text-forest transition-colors duration-200">{link}</a>
                        ))}
                      </nav>
                      <p className="text-[10px] text-white/40">&copy; 2026 Forest</p>
                    </div>
                  </footer>
                )}
              </div>
            </div>
          </div>

          {/* ---- Dark ---- */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full overflow-hidden">
              {footerVariant === "dark" && (
                <footer className="bg-[#111111] rounded-lg border border-[#304040] p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ColorEditable elementKey="estructura.footer-logo-d" defaultBg="#04202C">
                          {(styles, openPicker, currentHex, hoverHandlers) => (
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ ...styles, backgroundColor: styles.backgroundColor || "#04202C" }} onClick={openPicker} {...hoverHandlers}>
                              <span className="text-nxt-900 font-bold text-xs">N</span>
                            </div>
                          )}
                        </ColorEditable>
                        <span className="font-bold text-sm text-white">Forest</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Plataforma de automatizacion e inteligencia artificial para equipos de tecnologia.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">Producto</h4>
                      <ul className="space-y-1.5">
                        {footerLinks.producto.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="text-[11px] text-gray-500 hover:text-forest transition-colors duration-200">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">Recursos</h4>
                      <ul className="space-y-1.5">
                        {footerLinks.recursos.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="text-[11px] text-gray-500 hover:text-forest transition-colors duration-200">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-2">Legal</h4>
                      <ul className="space-y-1.5">
                        {footerLinks.legal.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="text-[11px] text-gray-500 hover:text-forest transition-colors duration-200">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-[#304040] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[10px] text-gray-600">&copy; 2026 Forest. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-3">
                      {socialIcons.map((s) => (
                        <button key={s.label} className="text-gray-600 hover:text-forest transition-colors duration-200 cursor-pointer active:scale-90" title={s.label}>
                          <s.icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </footer>
              )}

              {footerVariant === "light" && (
                <footer className="bg-[#1A3036] rounded-lg border border-[#304040] p-5">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <ColorEditable elementKey="estructura.footer-logo-lightv-d" defaultBg="#04202C">
                          {(styles, openPicker, currentHex, hoverHandlers) => (
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer" style={{ ...styles, backgroundColor: styles.backgroundColor || "#04202C" }} onClick={openPicker} {...hoverHandlers}>
                              <span className="text-nxt-900 font-bold text-xs">N</span>
                            </div>
                          )}
                        </ColorEditable>
                        <span className="font-bold text-sm text-gray-200">Forest</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Plataforma de automatizacion e inteligencia artificial para equipos de tecnologia.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider mb-2">Producto</h4>
                      <ul className="space-y-1.5">
                        {footerLinks.producto.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="text-[11px] text-gray-500 hover:text-forest transition-colors duration-200">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider mb-2">Recursos</h4>
                      <ul className="space-y-1.5">
                        {footerLinks.recursos.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="text-[11px] text-gray-500 hover:text-forest transition-colors duration-200">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider mb-2">Legal</h4>
                      <ul className="space-y-1.5">
                        {footerLinks.legal.map((link) => (
                          <li key={link.label}>
                            <a href={link.href} className="text-[11px] text-gray-500 hover:text-forest transition-colors duration-200">{link.label}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-[#304040] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[10px] text-gray-600">&copy; 2026 Forest. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-3">
                      {socialIcons.map((s) => (
                        <button key={s.label} className="text-gray-600 hover:text-forest transition-colors duration-200 cursor-pointer active:scale-90" title={s.label}>
                          <s.icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </footer>
              )}

              {footerVariant === "minimal" && (
                <footer className="bg-[#1A3036] rounded-lg border border-[#304040] px-5 py-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ColorEditable elementKey="estructura.footer-logo-minv-d" defaultBg="#04202C">
                        {(styles, openPicker, currentHex, hoverHandlers) => (
                          <div className="w-5 h-5 rounded flex items-center justify-center cursor-pointer" style={{ ...styles, backgroundColor: styles.backgroundColor || "#04202C" }} onClick={openPicker} {...hoverHandlers}>
                            <span className="text-nxt-900 font-bold text-[8px]">N</span>
                          </div>
                        )}
                      </ColorEditable>
                      <span className="font-bold text-xs text-white">Forest</span>
                    </div>
                    <nav className="flex items-center gap-4">
                      {["Producto", "Documentacion", "Soporte", "Privacidad"].map((link) => (
                        <a key={link} href="#" className="text-[11px] text-gray-500 hover:text-forest transition-colors duration-200">{link}</a>
                      ))}
                    </nav>
                    <p className="text-[10px] text-gray-600">&copy; 2026 Forest</p>
                  </div>
                </footer>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ================================================================ */}
      {/*  BREADCRUMBS                                                     */}
      {/* ================================================================ */}
      <Section
        id="breadcrumbs"
        title="Breadcrumbs"
        description="Navegacion por migas de pan con separadores ChevronRight. Variantes: estandar, con iconos, y colapsable (muestra '...' cuando hay muchos niveles). Interactivo: click para navegar, botones para agregar/quitar niveles."
      >
        {/* Controls */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={addBreadcrumb}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-forest text-white cursor-pointer transition-all duration-200 active:scale-95 hover:bg-forest/90 shadow-sm"
          >
            <Plus className="w-3 h-3" /> Agregar nivel
          </button>
          <button
            onClick={removeBreadcrumb}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-nxt-100 text-nxt-600 cursor-pointer transition-all duration-200 active:scale-95 hover:bg-nxt-200"
          >
            <Trash2 className="w-3 h-3" /> Quitar nivel
          </button>
          <button
            onClick={() => setBreadcrumbCollapsed(!breadcrumbCollapsed)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 active:scale-95 ${
              breadcrumbCollapsed
                ? "bg-forest/15 text-forest"
                : "bg-nxt-100 text-nxt-600 hover:bg-nxt-200"
            }`}
          >
            <MoreHorizontal className="w-3 h-3" /> {breadcrumbCollapsed ? "Expandir" : "Colapsar"}
          </button>
          <span className="text-[10px] text-nxt-400 ml-2">
            {breadcrumbItems.length} niveles | Activo: {breadcrumbItems[breadcrumbActive]?.label}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* ---- Light ---- */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Estandar</p>
                <nav className="flex items-center flex-wrap gap-1">
                  {renderBreadcrumbs(breadcrumbItems, breadcrumbActive, breadcrumbCollapsed, setBreadcrumbActive, false, "light")}
                </nav>
              </div>
              <div className="border-t border-nxt-100 pt-4">
                <p className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Con iconos</p>
                <nav className="flex items-center flex-wrap gap-1">
                  {renderBreadcrumbs(breadcrumbItems, breadcrumbActive, breadcrumbCollapsed, setBreadcrumbActive, true, "light")}
                </nav>
              </div>
              {breadcrumbItems.length > 3 && (
                <div className="border-t border-nxt-100 pt-4">
                  <p className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Colapsado automatico (4+ niveles)</p>
                  <nav className="flex items-center flex-wrap gap-1">
                    {renderBreadcrumbs(breadcrumbItems, breadcrumbActive, true, setBreadcrumbActive, true, "light")}
                  </nav>
                </div>
              )}
            </div>
          </div>

          {/* ---- Gradient ---- */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div>
                  <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Estandar</p>
                  <nav className="flex items-center flex-wrap gap-1">
                    {renderBreadcrumbs(breadcrumbItems, breadcrumbActive, breadcrumbCollapsed, setBreadcrumbActive, false, "gradient")}
                  </nav>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Con iconos</p>
                  <nav className="flex items-center flex-wrap gap-1">
                    {renderBreadcrumbs(breadcrumbItems, breadcrumbActive, breadcrumbCollapsed, setBreadcrumbActive, true, "gradient")}
                  </nav>
                </div>
                {breadcrumbItems.length > 3 && (
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Colapsado automatico (4+ niveles)</p>
                    <nav className="flex items-center flex-wrap gap-1">
                      {renderBreadcrumbs(breadcrumbItems, breadcrumbActive, true, setBreadcrumbActive, true, "gradient")}
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ---- Dark ---- */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full space-y-4">
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Estandar</p>
                <nav className="flex items-center flex-wrap gap-1">
                  {renderBreadcrumbs(breadcrumbItems, breadcrumbActive, breadcrumbCollapsed, setBreadcrumbActive, false, "dark")}
                </nav>
              </div>
              <div className="border-t border-[#304040] pt-4">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Con iconos</p>
                <nav className="flex items-center flex-wrap gap-1">
                  {renderBreadcrumbs(breadcrumbItems, breadcrumbActive, breadcrumbCollapsed, setBreadcrumbActive, true, "dark")}
                </nav>
              </div>
              {breadcrumbItems.length > 3 && (
                <div className="border-t border-[#304040] pt-4">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Colapsado automatico (4+ niveles)</p>
                  <nav className="flex items-center flex-wrap gap-1">
                    {renderBreadcrumbs(breadcrumbItems, breadcrumbActive, true, setBreadcrumbActive, true, "dark")}
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ================================================================ */}
      {/*  PAGE HEADER                                                     */}
      {/* ================================================================ */}
      <Section
        id="page-header"
        title="Page Header"
        description="Cabecera de pagina con titulo, descripcion, acciones y variantes: estandar, con breadcrumbs, con tabs, con badge de estado y con flecha de retorno. Interactivo: alternar entre las 5 variantes."
      >
        {/* Variant selector */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-nxt-700 mb-2">Variante</h3>
          <div className="flex flex-wrap gap-2">
            {([
              { key: "standard", label: "Estandar" },
              { key: "breadcrumbs", label: "Con Breadcrumbs" },
              { key: "tabs", label: "Con Tabs" },
              { key: "status", label: "Con Status" },
              { key: "back", label: "Con Retorno" },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setHeaderVariant(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 active:scale-95 ${
                  headerVariant === key
                    ? "bg-forest text-white shadow-sm"
                    : "bg-nxt-100 text-nxt-600 hover:bg-nxt-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* ---- Light ---- */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full overflow-hidden">
              <div className="bg-white rounded-lg border border-nxt-200 overflow-hidden">
                {headerVariant === "breadcrumbs" && (
                  <div className="px-5 pt-4 pb-0">
                    <nav className="flex items-center gap-1 text-[11px]">
                      <span className="text-nxt-400 hover:text-forest cursor-pointer transition-colors">Inicio</span>
                      <ChevronRight className="w-3 h-3 text-nxt-300" />
                      <span className="text-nxt-400 hover:text-forest cursor-pointer transition-colors">Proyectos</span>
                      <ChevronRight className="w-3 h-3 text-nxt-300" />
                      <span className="text-nxt-700 font-medium">Cortex AI</span>
                    </nav>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {headerVariant === "back" && (
                        <button className="mt-0.5 p-1.5 rounded-lg text-nxt-500 hover:bg-nxt-100 cursor-pointer transition-all duration-200 active:scale-90">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-lg font-bold text-nxt-900">Cortex AI</h1>
                          {headerVariant === "status" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/15 text-success">
                              <CheckCircle className="w-3 h-3" /> Activo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-nxt-500 mt-0.5">
                          Motor de procesamiento de lenguaje natural y automatizacion inteligente.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-nxt-200 text-nxt-700 hover:bg-nxt-50 cursor-pointer transition-all duration-200 active:scale-95">
                        <Download className="w-3.5 h-3.5 inline mr-1" />Exportar
                      </button>
                      <ColorEditable elementKey="estructura.header-cta-l" defaultBg="#04202C" hasHover={true} defaultHoverBg="#1A3036">
                        {(styles, openPicker, currentHex, hoverHandlers) => (
                          <button
                            style={styles}
                            onClick={openPicker}
                            {...hoverHandlers}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-nxt-900 shadow-sm cursor-pointer transition-all duration-200 active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5 inline mr-1" />Nuevo
                          </button>
                        )}
                      </ColorEditable>
                    </div>
                  </div>
                  {headerVariant === "tabs" && (
                    <div className="mt-4 border-t border-nxt-100 pt-3">
                      <nav className="flex items-center gap-1">
                        {pageHeaderTabs.map((tab, i) => (
                          <button
                            key={tab}
                            onClick={() => setHeaderActiveTab(i)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 active:scale-95 relative ${
                              headerActiveTab === i
                                ? "bg-forest/10 text-forest"
                                : "text-nxt-500 hover:bg-nxt-50 hover:text-nxt-700"
                            }`}
                          >
                            {tab}
                            {headerActiveTab === i && (
                              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-forest rounded-full" />
                            )}
                          </button>
                        ))}
                      </nav>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ---- Gradient ---- */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
                  {headerVariant === "breadcrumbs" && (
                    <div className="px-5 pt-4 pb-0">
                      <nav className="flex items-center gap-1 text-[11px]">
                        <span className="text-white/50 hover:text-forest cursor-pointer transition-colors">Inicio</span>
                        <ChevronRight className="w-3 h-3 text-white/30" />
                        <span className="text-white/50 hover:text-forest cursor-pointer transition-colors">Proyectos</span>
                        <ChevronRight className="w-3 h-3 text-white/30" />
                        <span className="text-white font-medium">Cortex AI</span>
                      </nav>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {headerVariant === "back" && (
                          <button className="mt-0.5 p-1.5 rounded-lg text-white/60 hover:bg-white/10 cursor-pointer transition-all duration-200 active:scale-90">
                            <ArrowLeft className="w-4 h-4" />
                          </button>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-white">Cortex AI</h1>
                            {headerVariant === "status" && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/15 text-success">
                                <CheckCircle className="w-3 h-3" /> Activo
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/50 mt-0.5">
                            Motor de procesamiento de lenguaje natural y automatizacion inteligente.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/20 text-white hover:bg-white/10 cursor-pointer transition-all duration-200 active:scale-95">
                          <Download className="w-3.5 h-3.5 inline mr-1" />Exportar
                        </button>
                        <ColorEditable elementKey="estructura.header-cta-g" defaultBg="#04202C" hasHover={true} defaultHoverBg="#1A3036">
                          {(styles, openPicker, currentHex, hoverHandlers) => (
                            <button
                              style={styles}
                              onClick={openPicker}
                              {...hoverHandlers}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-nxt-900 shadow-sm cursor-pointer transition-all duration-200 active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5 inline mr-1" />Nuevo
                            </button>
                          )}
                        </ColorEditable>
                      </div>
                    </div>
                    {headerVariant === "tabs" && (
                      <div className="mt-4 border-t border-white/10 pt-3">
                        <nav className="flex items-center gap-1">
                          {pageHeaderTabs.map((tab, i) => (
                            <button
                              key={tab}
                              onClick={() => setHeaderActiveTab(i)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 active:scale-95 relative ${
                                headerActiveTab === i
                                  ? "bg-[rgba(4,32,44,0.15)] text-forest"
                                  : "text-white/50 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {tab}
                              {headerActiveTab === i && (
                                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-forest rounded-full" />
                              )}
                            </button>
                          ))}
                        </nav>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Dark ---- */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full overflow-hidden">
              <div className="bg-[#1A3036] rounded-lg border border-[#304040] overflow-hidden">
                {headerVariant === "breadcrumbs" && (
                  <div className="px-5 pt-4 pb-0">
                    <nav className="flex items-center gap-1 text-[11px]">
                      <span className="text-gray-500 hover:text-forest cursor-pointer transition-colors">Inicio</span>
                      <ChevronRight className="w-3 h-3 text-gray-600" />
                      <span className="text-gray-500 hover:text-forest cursor-pointer transition-colors">Proyectos</span>
                      <ChevronRight className="w-3 h-3 text-gray-600" />
                      <span className="text-gray-300 font-medium">Cortex AI</span>
                    </nav>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {headerVariant === "back" && (
                        <button className="mt-0.5 p-1.5 rounded-lg text-gray-400 hover:bg-[#304040] cursor-pointer transition-all duration-200 active:scale-90">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-lg font-bold text-white">Cortex AI</h1>
                          {headerVariant === "status" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/15 text-success">
                              <CheckCircle className="w-3 h-3" /> Activo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Motor de procesamiento de lenguaje natural y automatizacion inteligente.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#304040] text-gray-300 hover:bg-[#304040] cursor-pointer transition-all duration-200 active:scale-95">
                        <Download className="w-3.5 h-3.5 inline mr-1" />Exportar
                      </button>
                      <ColorEditable elementKey="estructura.header-cta-d" defaultBg="#04202C" hasHover={true} defaultHoverBg="#1A3036">
                        {(styles, openPicker, currentHex, hoverHandlers) => (
                          <button
                            style={styles}
                            onClick={openPicker}
                            {...hoverHandlers}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-nxt-900 shadow-sm cursor-pointer transition-all duration-200 active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5 inline mr-1" />Nuevo
                          </button>
                        )}
                      </ColorEditable>
                    </div>
                  </div>
                  {headerVariant === "tabs" && (
                    <div className="mt-4 border-t border-[#304040] pt-3">
                      <nav className="flex items-center gap-1">
                        {pageHeaderTabs.map((tab, i) => (
                          <button
                            key={tab}
                            onClick={() => setHeaderActiveTab(i)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 active:scale-95 relative ${
                              headerActiveTab === i
                                ? "bg-[rgba(4,32,44,0.15)] text-forest"
                                : "text-gray-500 hover:bg-[#304040] hover:text-gray-300"
                            }`}
                          >
                            {tab}
                            {headerActiveTab === i && (
                              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-forest rounded-full" />
                            )}
                          </button>
                        ))}
                      </nav>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ================================================================ */}
      {/*  DRAWER                                                          */}
      {/* ================================================================ */}
      <Section
        id="drawer"
        title="Drawer"
        description="Panel deslizante lateral con overlay, cabecera, contenido scrolleable y footer con acciones. Disponible desde izquierda o derecha en 3 tamanos (sm, md, lg). Usa transiciones CSS translate-x para la animacion de entrada/salida."
      >
        {/* Controls */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-nxt-700 mb-2">Abrir Drawer</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => openDrawer("left", "md")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-forest text-white cursor-pointer transition-all duration-200 active:scale-95 hover:bg-forest/90 shadow-sm"
            >
              <PanelLeftOpen className="w-3.5 h-3.5" /> Izquierda
            </button>
            <button
              onClick={() => openDrawer("right", "md")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-forest text-white cursor-pointer transition-all duration-200 active:scale-95 hover:bg-forest/90 shadow-sm"
            >
              <PanelRightOpen className="w-3.5 h-3.5" /> Derecha
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[10px] text-nxt-400 self-center mr-1">Tamano:</span>
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                onClick={() => openDrawer(drawerSide, s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 active:scale-95 ${
                  drawerSize === s && drawerOpen
                    ? "bg-forest/15 text-forest"
                    : "bg-nxt-100 text-nxt-600 hover:bg-nxt-200"
                }`}
              >
                {s.toUpperCase()} ({s === "sm" ? "256px" : s === "md" ? "320px" : "384px"})
              </button>
            ))}
          </div>
        </div>

        {/* Static preview in light/gradient/dark */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* ---- Light preview ---- */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full overflow-hidden">
              <div className="relative h-56 bg-nxt-50 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-black/20 rounded-lg" />
                <div className="absolute top-0 right-0 bottom-0 w-48 bg-white border-l border-nxt-200 shadow-xl flex flex-col rounded-r-lg">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-nxt-100">
                    <h3 className="text-sm font-bold text-nxt-900">Filtros</h3>
                    <button className="p-1 rounded text-nxt-400 hover:bg-nxt-100 cursor-pointer transition-all duration-200 active:scale-90">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 p-4 overflow-auto space-y-3">
                    <div>
                      <label className="text-[10px] font-medium text-nxt-600 mb-1 block">Estado</label>
                      <div className="flex flex-wrap gap-1">
                        {["Activo", "Pendiente", "Cerrado"].map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-full text-[9px] bg-nxt-100 text-nxt-600 cursor-pointer hover:bg-forest/15 hover:text-forest transition-all duration-200">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-nxt-600 mb-1 block">Prioridad</label>
                      <div className="flex flex-wrap gap-1">
                        {["Alta", "Media", "Baja"].map((p) => (
                          <span key={p} className="px-2 py-0.5 rounded-full text-[9px] bg-nxt-100 text-nxt-600 cursor-pointer hover:bg-forest/15 hover:text-forest transition-all duration-200">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-nxt-600 mb-1 block">Asignado a</label>
                      <div className="flex flex-wrap gap-1">
                        {["M. Romero", "F. Silva", "S. Hernandez"].map((u) => (
                          <span key={u} className="px-2 py-0.5 rounded-full text-[9px] bg-nxt-100 text-nxt-600 cursor-pointer hover:bg-forest/15 hover:text-forest transition-all duration-200">{u}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-nxt-100 flex items-center gap-2">
                    <button className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-nxt-200 text-nxt-600 hover:bg-nxt-50 cursor-pointer transition-all duration-200 active:scale-95">
                      Limpiar
                    </button>
                    <ColorEditable elementKey="estructura.drawer-apply-l" defaultBg="#04202C" hasHover={true} defaultHoverBg="#1A3036">
                      {(styles, openPicker, currentHex, hoverHandlers) => (
                        <button
                          style={styles}
                          onClick={openPicker}
                          {...hoverHandlers}
                          className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium text-nxt-900 shadow-sm cursor-pointer transition-all duration-200 active:scale-95"
                        >
                          Aplicar
                        </button>
                      )}
                    </ColorEditable>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Gradient preview ---- */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="relative h-56 bg-white/5 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-black/30 rounded-lg" />
                  <div className="absolute top-0 right-0 bottom-0 w-48 bg-white/15 backdrop-blur-sm border-l border-white/10 shadow-xl flex flex-col rounded-r-lg">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                      <h3 className="text-sm font-bold text-white">Filtros</h3>
                      <button className="p-1 rounded text-white/50 hover:bg-white/10 cursor-pointer transition-all duration-200 active:scale-90">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex-1 p-4 overflow-auto space-y-3">
                      <div>
                        <label className="text-[10px] font-medium text-white/60 mb-1 block">Estado</label>
                        <div className="flex flex-wrap gap-1">
                          {["Activo", "Pendiente", "Cerrado"].map((s) => (
                            <span key={s} className="px-2 py-0.5 rounded-full text-[9px] bg-white/10 text-white/70 cursor-pointer hover:bg-forest/15 hover:text-forest transition-all duration-200">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-white/60 mb-1 block">Prioridad</label>
                        <div className="flex flex-wrap gap-1">
                          {["Alta", "Media", "Baja"].map((p) => (
                            <span key={p} className="px-2 py-0.5 rounded-full text-[9px] bg-white/10 text-white/70 cursor-pointer hover:bg-forest/15 hover:text-forest transition-all duration-200">{p}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-white/60 mb-1 block">Asignado a</label>
                        <div className="flex flex-wrap gap-1">
                          {["M. Romero", "F. Silva", "S. Hernandez"].map((u) => (
                            <span key={u} className="px-2 py-0.5 rounded-full text-[9px] bg-white/10 text-white/70 cursor-pointer hover:bg-forest/15 hover:text-forest transition-all duration-200">{u}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 border-t border-white/10 flex items-center gap-2">
                      <button className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-white/20 text-white/70 hover:bg-white/10 cursor-pointer transition-all duration-200 active:scale-95">
                        Limpiar
                      </button>
                      <ColorEditable elementKey="estructura.drawer-apply-g" defaultBg="#04202C" hasHover={true} defaultHoverBg="#1A3036">
                        {(styles, openPicker, currentHex, hoverHandlers) => (
                          <button
                            style={styles}
                            onClick={openPicker}
                            {...hoverHandlers}
                            className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium text-nxt-900 shadow-sm cursor-pointer transition-all duration-200 active:scale-95"
                          >
                            Aplicar
                          </button>
                        )}
                      </ColorEditable>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Dark preview ---- */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full overflow-hidden">
              <div className="relative h-56 bg-[#111111] rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-black/40 rounded-lg" />
                <div className="absolute top-0 right-0 bottom-0 w-48 bg-[#1A3036] border-l border-[#304040] shadow-xl flex flex-col rounded-r-lg">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#304040]">
                    <h3 className="text-sm font-bold text-white">Filtros</h3>
                    <button className="p-1 rounded text-gray-500 hover:bg-[#304040] cursor-pointer transition-all duration-200 active:scale-90">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 p-4 overflow-auto space-y-3">
                    <div>
                      <label className="text-[10px] font-medium text-gray-400 mb-1 block">Estado</label>
                      <div className="flex flex-wrap gap-1">
                        {["Activo", "Pendiente", "Cerrado"].map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-full text-[9px] bg-[#304040] text-gray-300 cursor-pointer hover:bg-forest/15 hover:text-forest transition-all duration-200">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-gray-400 mb-1 block">Prioridad</label>
                      <div className="flex flex-wrap gap-1">
                        {["Alta", "Media", "Baja"].map((p) => (
                          <span key={p} className="px-2 py-0.5 rounded-full text-[9px] bg-[#304040] text-gray-300 cursor-pointer hover:bg-forest/15 hover:text-forest transition-all duration-200">{p}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-gray-400 mb-1 block">Asignado a</label>
                      <div className="flex flex-wrap gap-1">
                        {["M. Romero", "F. Silva", "S. Hernandez"].map((u) => (
                          <span key={u} className="px-2 py-0.5 rounded-full text-[9px] bg-[#304040] text-gray-300 cursor-pointer hover:bg-forest/15 hover:text-forest transition-all duration-200">{u}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-[#304040] flex items-center gap-2">
                    <button className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium border border-[#304040] text-gray-400 hover:bg-[#304040] cursor-pointer transition-all duration-200 active:scale-95">
                      Limpiar
                    </button>
                    <ColorEditable elementKey="estructura.drawer-apply-d" defaultBg="#04202C" hasHover={true} defaultHoverBg="#1A3036">
                      {(styles, openPicker, currentHex, hoverHandlers) => (
                        <button
                          style={styles}
                          onClick={openPicker}
                          {...hoverHandlers}
                          className="flex-1 px-2 py-1.5 rounded-lg text-[10px] font-medium text-nxt-900 shadow-sm cursor-pointer transition-all duration-200 active:scale-95"
                        >
                          Aplicar
                        </button>
                      )}
                    </ColorEditable>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ================================================================ */}
      {/*  LIVE DRAWER (portal-style overlay)                              */}
      {/* ================================================================ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={closeDrawer}
          />
          {/* Drawer panel */}
          <div
            className={`absolute top-0 bottom-0 ${
              drawerSide === "left" ? "left-0" : "right-0"
            } ${drawerWidthClass[drawerSize]} bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
              drawerOpen
                ? "translate-x-0"
                : drawerSide === "left"
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
            style={{ animationFillMode: "forwards" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-nxt-200 shrink-0">
              <div>
                <h2 className="text-base font-bold text-nxt-900">Panel de filtros</h2>
                <p className="text-[11px] text-nxt-500 mt-0.5">Configura los filtros de busqueda</p>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-lg text-nxt-400 hover:bg-nxt-100 cursor-pointer transition-all duration-200 active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content (scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Estado */}
              <div>
                <label className="text-xs font-semibold text-nxt-700 mb-2 block">Estado del servicio</label>
                <div className="space-y-1.5">
                  {["Activo", "En mantenimiento", "Degradado", "Inactivo"].map((status) => (
                    <label key={status} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-nxt-50 cursor-pointer transition-all duration-200">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-nxt-300 text-forest focus:ring-forest/30 accent-[#04202C]" />
                      <span className="text-xs text-nxt-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prioridad */}
              <div className="border-t border-nxt-100 pt-4">
                <label className="text-xs font-semibold text-nxt-700 mb-2 block">Prioridad</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Critica", color: "bg-error/15 text-error" },
                    { label: "Alta", color: "bg-warning/15 text-warning" },
                    { label: "Media", color: "bg-info/15 text-info" },
                    { label: "Baja", color: "bg-success/15 text-success" },
                  ].map((p) => (
                    <button
                      key={p.label}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium ${p.color} cursor-pointer transition-all duration-200 active:scale-95 hover:opacity-80`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipo */}
              <div className="border-t border-nxt-100 pt-4">
                <label className="text-xs font-semibold text-nxt-700 mb-2 block">Equipo asignado</label>
                <div className="space-y-1.5">
                  {[
                    { name: "Miguel Romero", role: "Backend Lead" },
                    { name: "Felipe Silva", role: "Frontend Dev" },
                    { name: "Santiago Hernandez", role: "IA/Automatizacion" },
                  ].map((user) => (
                    <label key={user.name} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-nxt-50 cursor-pointer transition-all duration-200">
                      <input type="checkbox" className="w-3.5 h-3.5 rounded border-nxt-300 text-forest focus:ring-forest/30 accent-[#04202C]" />
                      <div>
                        <span className="text-xs font-medium text-nxt-800 block">{user.name}</span>
                        <span className="text-[10px] text-nxt-400">{user.role}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="border-t border-nxt-100 pt-4">
                <label className="text-xs font-semibold text-nxt-700 mb-2 block">Etiquetas</label>
                <div className="flex flex-wrap gap-1.5">
                  {["Produccion", "Staging", "Dev", "Urgente", "Automatizado", "Manual", "API", "UI"].map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-nxt-100 text-nxt-600 cursor-pointer hover:bg-forest/15 hover:text-forest transition-all duration-200 active:scale-95">
                      <Tag className="w-2.5 h-2.5" /> {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Date range */}
              <div className="border-t border-nxt-100 pt-4">
                <label className="text-xs font-semibold text-nxt-700 mb-2 block">Rango de fechas</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-nxt-500 mb-1 block">Desde</label>
                    <input type="date" className="w-full px-2.5 py-1.5 rounded-lg border border-nxt-200 text-xs text-nxt-700 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest" />
                  </div>
                  <div>
                    <label className="text-[10px] text-nxt-500 mb-1 block">Hasta</label>
                    <input type="date" className="w-full px-2.5 py-1.5 rounded-lg border border-nxt-200 text-xs text-nxt-700 focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-nxt-200 flex items-center gap-3 shrink-0 bg-nxt-50">
              <button
                onClick={closeDrawer}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border border-nxt-200 text-nxt-600 hover:bg-white cursor-pointer transition-all duration-200 active:scale-95"
              >
                Cancelar
              </button>
              <button
                className="px-3 py-2 rounded-lg text-xs font-medium border border-nxt-200 text-nxt-600 hover:bg-white cursor-pointer transition-all duration-200 active:scale-95"
              >
                Limpiar filtros
              </button>
              <button
                onClick={closeDrawer}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-forest text-white hover:bg-forest/90 shadow-sm cursor-pointer transition-all duration-200 active:scale-95"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Breadcrumb render helper                                           */
/* ------------------------------------------------------------------ */

type BreadcrumbTheme = "light" | "gradient" | "dark";

function renderBreadcrumbs(
  items: typeof defaultBreadcrumbs,
  active: number,
  collapsed: boolean,
  onNavigate: (idx: number) => void,
  showIcons: boolean,
  theme: BreadcrumbTheme,
) {
  const isDark = theme === "dark";
  const isGradient = theme === "gradient";

  const textBase = isDark ? "text-gray-500" : isGradient ? "text-white/50" : "text-nxt-400";
  const textActive = isDark ? "text-gray-200 font-medium" : isGradient ? "text-white font-medium" : "text-nxt-800 font-medium";
  const textHover = "hover:text-forest";
  const chevronColor = isDark ? "text-gray-600" : isGradient ? "text-white/30" : "text-nxt-300";
  const ellipsisBg = isDark
    ? "bg-[#304040] text-gray-400 hover:bg-[#5B7065]"
    : isGradient
    ? "bg-white/10 text-white/60 hover:bg-white/20"
    : "bg-nxt-100 text-nxt-500 hover:bg-nxt-200";

  // Determine which items to render
  let rendered: (typeof defaultBreadcrumbs[0] | "ellipsis")[];
  if (collapsed && items.length > 3) {
    rendered = [items[0], "ellipsis" as const, items[items.length - 1]];
  } else {
    rendered = [...items];
  }

  const elements: React.ReactNode[] = [];

  rendered.forEach((item, idx) => {
    if (idx > 0) {
      elements.push(
        <ChevronRight key={`sep-${idx}`} className={`w-3 h-3 ${chevronColor} shrink-0`} />
      );
    }

    if (item === "ellipsis") {
      elements.push(
        <span
          key="ellipsis"
          className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-all duration-200 active:scale-95 ${ellipsisBg}`}
        >
          ...
        </span>
      );
      return;
    }

    // Determine the actual index in the full array
    const actualIdx = collapsed && items.length > 3
      ? (idx === 0 ? 0 : items.length - 1)
      : idx;
    const isActive = actualIdx === active;
    const Icon = item.icon;

    elements.push(
      <button
        key={`bc-${idx}-${item.label}`}
        onClick={() => onNavigate(actualIdx)}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] cursor-pointer transition-all duration-200 active:scale-95 ${textHover} ${
          isActive ? textActive : textBase
        }`}
      >
        {showIcons && <Icon className="w-3 h-3 shrink-0" />}
        {item.label}
      </button>
    );
  });

  return elements;
}
