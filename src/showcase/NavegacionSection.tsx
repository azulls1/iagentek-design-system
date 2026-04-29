import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Check,
  Circle,
  Search,
  Command,
  Copy,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Settings,
  User,
  LogOut,
  Edit3,
  Trash2,
  FileText,
  Folder,
  Globe,
  Mail,
  Bell,
  Shield,
  Zap,
  Clock,
  Plus,
  Filter,
  Terminal,
  Code,
  Hash,
  Eye,
  Rocket,
  Bug,
  Database,
  Server,
  ArrowRight,
  ArrowLeft,
  Play,
  RotateCcw,
  MessageSquare,
  Download,
  CornerDownLeft,
} from "lucide-react";
import { ColorEditable } from "../components/ColorEditable";
import { resolveDominantColor, resolveHoverColor } from "../utils/tailwindColorMap";

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
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
/*  1. Dropdown Menu                                                   */
/* ------------------------------------------------------------------ */

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  divider?: boolean;
  checked?: boolean;
  radio?: boolean;
  children?: DropdownItem[];
}

function DropdownDemo() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set(["Notificaciones Email"]));
  const [radioValue, setRadioValue] = useState("Espanol");
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const isInside = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(target)
      );
      if (!isInside) {
        setOpenDropdown(null);
        setSubmenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
    setSubmenuOpen(false);
  };

  const toggleCheck = (label: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  /* Basic items */
  const basicItems: DropdownItem[] = [
    { label: "Perfil", icon: <User className="w-4 h-4" /> },
    { label: "Configuracion", icon: <Settings className="w-4 h-4" />, shortcut: "Ctrl+," },
    { label: "Editar", icon: <Edit3 className="w-4 h-4" />, shortcut: "Ctrl+E" },
    { label: "", divider: true },
    { label: "Cerrar sesion", icon: <LogOut className="w-4 h-4" />, danger: true },
  ];

  /* Nested items */
  const nestedItems: DropdownItem[] = [
    { label: "Nuevo archivo", icon: <FileText className="w-4 h-4" /> },
    { label: "Nueva carpeta", icon: <Folder className="w-4 h-4" /> },
    {
      label: "Exportar como",
      icon: <Download className="w-4 h-4" />,
      children: [
        { label: "PDF", icon: <FileText className="w-4 h-4" /> },
        { label: "CSV", icon: <FileText className="w-4 h-4" /> },
        { label: "JSON", icon: <Code className="w-4 h-4" /> },
      ],
    },
    { label: "", divider: true },
    { label: "Eliminar", icon: <Trash2 className="w-4 h-4" />, danger: true },
  ];

  /* Checkbox items */
  const checkItems = [
    "Notificaciones Email",
    "Notificaciones Push",
    "Sonidos",
    "Modo oscuro",
  ];

  /* Radio items */
  const radioItems = ["Espanol", "Ingles", "Portugues"];

  const renderMenuItem = (item: DropdownItem, idx: number, onSelect?: () => void) => {
    if (item.divider) {
      return <div key={idx} className="my-1 border-t border-nxt-200" />;
    }
    return (
      <button
        key={idx}
        onClick={onSelect}
        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
          item.danger
            ? "text-error hover:bg-error/10"
            : "text-nxt-700 hover:bg-nxt-100"
        }`}
      >
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span className="flex-1 text-left">{item.label}</span>
        {item.shortcut && (
          <span className="text-xs text-nxt-400 ml-4">{item.shortcut}</span>
        )}
        {item.children && <ChevronRight className="w-3.5 h-3.5 text-nxt-400" />}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Basic */}
      <div className="nxt-card p-4" ref={(el) => { dropdownRefs.current["basic"] = el; }}>
        <p className="text-xs font-semibold text-nxt-500 uppercase tracking-wider mb-3">Basico</p>
        <div className="relative">
          <button
            onClick={() => toggleDropdown("basic")}
            className="flex items-center gap-2 px-4 py-2 bg-forest text-white font-medium rounded-lg hover:bg-forest/90 transition-colors text-sm"
          >
            Opciones <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "basic" ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === "basic" && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl border border-nxt-200 shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              {basicItems.map((item, i) => renderMenuItem(item, i, () => !item.divider && setOpenDropdown(null)))}
            </div>
          )}
        </div>
      </div>

      {/* Nested submenu */}
      <div className="nxt-card p-4" ref={(el) => { dropdownRefs.current["nested"] = el; }}>
        <p className="text-xs font-semibold text-nxt-500 uppercase tracking-wider mb-3">Con submenu</p>
        <div className="relative">
          <button
            onClick={() => toggleDropdown("nested")}
            className="flex items-center gap-2 px-4 py-2 bg-nxt-800 text-white font-medium rounded-lg hover:bg-nxt-700 transition-colors text-sm"
          >
            Archivo <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "nested" ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === "nested" && (
            <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-nxt-200 shadow-lg p-1.5 z-50">
              {nestedItems.map((item, i) => {
                if (item.divider) return <div key={i} className="my-1 border-t border-nxt-200" />;
                if (item.children) {
                  return (
                    <div key={i} className="relative">
                      <button
                        onMouseEnter={() => setSubmenuOpen(true)}
                        onClick={() => setSubmenuOpen(!submenuOpen)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-nxt-700 rounded-lg hover:bg-nxt-100 transition-colors"
                      >
                        {item.icon}
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-nxt-400" />
                      </button>
                      {submenuOpen && (
                        <div className="absolute left-full top-0 ml-1 w-40 bg-white rounded-xl border border-nxt-200 shadow-lg p-1.5 z-50">
                          {item.children.map((child, ci) => renderMenuItem(child, ci, () => {
                            setOpenDropdown(null);
                            setSubmenuOpen(false);
                          }))}
                        </div>
                      )}
                    </div>
                  );
                }
                return renderMenuItem(item, i, () => !item.divider && setOpenDropdown(null));
              })}
            </div>
          )}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="nxt-card p-4" ref={(el) => { dropdownRefs.current["checks"] = el; }}>
        <p className="text-xs font-semibold text-nxt-500 uppercase tracking-wider mb-3">Multi-select</p>
        <div className="relative">
          <button
            onClick={() => toggleDropdown("checks")}
            className="flex items-center gap-2 px-4 py-2 bg-info/10 text-info font-medium rounded-lg hover:bg-info/20 transition-colors text-sm border border-info/30"
          >
            Preferencias <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "checks" ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === "checks" && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl border border-nxt-200 shadow-lg p-1.5 z-50">
              {checkItems.map((label, i) => (
                <button
                  key={i}
                  onClick={() => toggleCheck(label)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-nxt-700 rounded-lg hover:bg-nxt-100 transition-colors"
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                    checkedItems.has(label) ? "bg-forest border-forest" : "border-nxt-300"
                  }`}>
                    {checkedItems.has(label) && <Check className="w-3 h-3 text-nxt-900" />}
                  </span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs text-nxt-400 mt-2">
          Activos: {checkedItems.size > 0 ? [...checkedItems].join(", ") : "Ninguno"}
        </p>
      </div>

      {/* Radio */}
      <div className="nxt-card p-4" ref={(el) => { dropdownRefs.current["radio"] = el; }}>
        <p className="text-xs font-semibold text-nxt-500 uppercase tracking-wider mb-3">Seleccion unica</p>
        <div className="relative">
          <button
            onClick={() => toggleDropdown("radio")}
            className="flex items-center gap-2 px-4 py-2 bg-success/10 text-success font-medium rounded-lg hover:bg-success/20 transition-colors text-sm border border-success/30"
          >
            <Globe className="w-4 h-4" /> {radioValue} <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === "radio" ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === "radio" && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-nxt-200 shadow-lg p-1.5 z-50">
              {radioItems.map((label, i) => (
                <button
                  key={i}
                  onClick={() => { setRadioValue(label); setOpenDropdown(null); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-nxt-700 rounded-lg hover:bg-nxt-100 transition-colors"
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    radioValue === label ? "border-forest" : "border-nxt-300"
                  }`}>
                    {radioValue === label && <span className="w-2 h-2 rounded-full bg-forest" />}
                  </span>
                  <span>{label}</span>
                  {radioValue === label && <Check className="w-3.5 h-3.5 text-forest ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  1b. Dropdown 3-mode miniatures                                     */
/* ------------------------------------------------------------------ */

function DropdownMiniLight() {
  return (
    <div className="space-y-2">
      <ColorEditable elementKey="navegacion.dropdown-primary" defaultBg={resolveDominantColor("bg-primary-light")} hasHover defaultHoverBg={resolveHoverColor("bg-primary-light")}>
        {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
          <div className="flex flex-col items-start gap-1">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors" style={{ ...styles, backgroundColor: styles.backgroundColor || "#04202C", color: "#0f172a" }} onClick={openPicker} {...hoverHandlers}>
              Opciones <ChevronDown className="w-3 h-3" />
            </button>
            <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` -> ${hoverHex}` : ""}</span>
          </div>
        )}
      </ColorEditable>
      <div className="bg-white rounded-lg border border-nxt-200 shadow-sm p-1 w-36">
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-nxt-700 rounded hover:bg-nxt-50"><User className="w-3 h-3 text-nxt-400" /> Perfil</div>
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-nxt-700 rounded bg-nxt-50"><Settings className="w-3 h-3 text-nxt-400" /> Configuracion</div>
        <div className="my-0.5 border-t border-nxt-100" />
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-error rounded"><LogOut className="w-3 h-3" /> Cerrar sesion</div>
      </div>
    </div>
  );
}

function DropdownMiniGradient() {
  return (
    <div className="space-y-2">
      <ColorEditable elementKey="navegacion.dropdown-g-primary" defaultBg={resolveDominantColor("bg-primary-light")} hasHover defaultHoverBg={resolveHoverColor("bg-primary-light")}>
        {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
          <div className="flex flex-col items-start gap-1">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors" style={{ ...styles, backgroundColor: styles.backgroundColor || "#04202C", color: "#0f172a" }} onClick={openPicker} {...hoverHandlers}>
              Opciones <ChevronDown className="w-3 h-3" />
            </button>
            <span className="text-[8px] font-mono text-white/50">{currentHex}{hoverHex ? ` -> ${hoverHex}` : ""}</span>
          </div>
        )}
      </ColorEditable>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm p-1 w-36">
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-white/90 rounded hover:bg-white/10"><User className="w-3 h-3 text-white/60" /> Perfil</div>
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-white/90 rounded bg-white/10"><Settings className="w-3 h-3 text-white/60" /> Configuracion</div>
        <div className="my-0.5 border-t border-white/10" />
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-red-300 rounded"><LogOut className="w-3 h-3" /> Cerrar sesion</div>
      </div>
    </div>
  );
}

function DropdownMiniDark() {
  return (
    <div className="space-y-2">
      <ColorEditable elementKey="navegacion.dropdown-d-primary" defaultBg={resolveDominantColor("bg-primary-light")} hasHover defaultHoverBg={resolveHoverColor("bg-primary-light")}>
        {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
          <div className="flex flex-col items-start gap-1">
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors" style={{ ...styles, backgroundColor: styles.backgroundColor || "#04202C", color: "#0f172a" }} onClick={openPicker} {...hoverHandlers}>
              Opciones <ChevronDown className="w-3 h-3" />
            </button>
            <span className="text-[8px] font-mono text-gray-500">{currentHex}{hoverHex ? ` -> ${hoverHex}` : ""}</span>
          </div>
        )}
      </ColorEditable>
      <div className="bg-bark rounded-lg border border-[#3A3A3A] shadow-sm p-1 w-36">
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-gray-300 rounded hover:bg-[#333]"><User className="w-3 h-3 text-gray-500" /> Perfil</div>
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-gray-300 rounded bg-[#333]"><Settings className="w-3 h-3 text-gray-500" /> Configuracion</div>
        <div className="my-0.5 border-t border-[#3A3A3A]" />
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-red-400 rounded"><LogOut className="w-3 h-3" /> Cerrar sesion</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. Command Palette                                                 */
/* ------------------------------------------------------------------ */

interface CommandItem {
  id: string;
  label: string;
  category: string;
  icon: React.ReactNode;
  shortcut?: string;
}

const commandItems: CommandItem[] = [
  { id: "dashboard", label: "Ir al Dashboard", category: "Paginas", icon: <Globe className="w-4 h-4" />, shortcut: "G D" },
  { id: "servicios", label: "Ir a Servicios", category: "Paginas", icon: <Server className="w-4 h-4" />, shortcut: "G S" },
  { id: "monitoreo", label: "Ir a Monitoreo", category: "Paginas", icon: <Zap className="w-4 h-4" />, shortcut: "G M" },
  { id: "config", label: "Ir a Configuracion", category: "Paginas", icon: <Settings className="w-4 h-4" />, shortcut: "G C" },
  { id: "new-service", label: "Crear nuevo servicio", category: "Acciones", icon: <Plus className="w-4 h-4" />, shortcut: "Ctrl+N" },
  { id: "deploy", label: "Desplegar cambios", category: "Acciones", icon: <Rocket className="w-4 h-4" />, shortcut: "Ctrl+D" },
  { id: "restart", label: "Reiniciar servicio", category: "Acciones", icon: <RotateCcw className="w-4 h-4" /> },
  { id: "report-bug", label: "Reportar error", category: "Acciones", icon: <Bug className="w-4 h-4" /> },
  { id: "theme", label: "Cambiar tema", category: "Configuracion", icon: <Eye className="w-4 h-4" />, shortcut: "Ctrl+T" },
  { id: "notifications", label: "Notificaciones", category: "Configuracion", icon: <Bell className="w-4 h-4" />, shortcut: "Ctrl+," },
  { id: "security", label: "Seguridad y acceso", category: "Configuracion", icon: <Shield className="w-4 h-4" /> },
  { id: "database", label: "Conexion a base de datos", category: "Configuracion", icon: <Database className="w-4 h-4" /> },
];

function CommandPaletteDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [recentSearches] = useState(["deploy", "monitoreo", "tema"]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filtered = query.trim()
    ? commandItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : commandItems;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const flatList = Object.values(grouped).flat();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, flatList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && flatList[selectedIndex]) {
      e.preventDefault();
      setSelectedItem(flatList[selectedIndex].label);
      setOpen(false);
      setQuery("");
      setSelectedIndex(0);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      setSelectedIndex(0);
    }
  };

  let globalIndex = -1;

  return (
    <div className="nxt-card p-4 sm:p-6">
      <div className="flex items-center gap-4 flex-wrap mb-4">
        <button
          onClick={() => { setOpen(true); setSelectedItem(null); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-nxt-100 text-nxt-600 rounded-lg hover:bg-nxt-200 transition-colors text-sm border border-nxt-200"
        >
          <Search className="w-4 h-4" />
          <span>Buscar comandos...</span>
          <span className="ml-4 flex items-center gap-1 text-xs bg-white px-1.5 py-0.5 rounded border border-nxt-200">
            <Command className="w-3 h-3" /> K
          </span>
        </button>
        {selectedItem && (
          <span className="text-sm text-success flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Seleccionado: <strong>{selectedItem}</strong>
          </span>
        )}
      </div>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm" onClick={() => { setOpen(false); setQuery(""); setSelectedIndex(0); }}>
          <div
            className="w-full max-w-lg bg-white rounded-2xl border border-nxt-200 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-nxt-200">
              <Search className="w-5 h-5 text-nxt-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Buscar paginas, acciones, configuracion..."
                className="flex-1 text-sm outline-none bg-transparent text-nxt-800 placeholder:text-nxt-400"
              />
              <kbd className="text-xs text-nxt-400 bg-nxt-100 px-1.5 py-0.5 rounded border border-nxt-200">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-72 overflow-y-auto p-2">
              {/* Recent searches when no query */}
              {!query.trim() && (
                <div className="mb-2">
                  <p className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider px-2 py-1">Busquedas recientes</p>
                  <div className="flex gap-1.5 px-2 pb-2">
                    {recentSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setQuery(s); setSelectedIndex(0); }}
                        className="text-xs px-2 py-1 bg-nxt-100 text-nxt-600 rounded-md hover:bg-nxt-200 transition-colors flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" /> {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {flatList.length === 0 ? (
                <div className="py-8 text-center">
                  <Search className="w-8 h-8 text-nxt-300 mx-auto mb-2" />
                  <p className="text-sm text-nxt-500">Sin resultados para "{query}"</p>
                  <p className="text-xs text-nxt-400 mt-1">Intenta con otra busqueda</p>
                </div>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="mb-1">
                    <p className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider px-2 py-1">{category}</p>
                    {items.map((item) => {
                      globalIndex++;
                      const idx = globalIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedItem(item.label);
                            setOpen(false);
                            setQuery("");
                            setSelectedIndex(0);
                          }}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedIndex === idx ? "bg-forest/10 text-nxt-900" : "text-nxt-700 hover:bg-nxt-50"
                          }`}
                        >
                          <span className={`flex-shrink-0 ${selectedIndex === idx ? "text-forest" : "text-nxt-400"}`}>
                            {item.icon}
                          </span>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.shortcut && (
                            <span className="text-xs text-nxt-400 flex items-center gap-0.5">
                              {item.shortcut.split("+").map((k, ki) => (
                                <kbd key={ki} className="bg-nxt-100 px-1.5 py-0.5 rounded border border-nxt-200 text-[10px]">
                                  {k}
                                </kbd>
                              ))}
                            </span>
                          )}
                          {selectedIndex === idx && (
                            <CornerDownLeft className="w-3.5 h-3.5 text-nxt-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-nxt-200 px-4 py-2 flex items-center gap-4 text-[10px] text-nxt-400">
              <span className="flex items-center gap-1"><kbd className="bg-nxt-100 px-1 py-0.5 rounded border border-nxt-200">...</kbd> Navegar</span>
              <span className="flex items-center gap-1"><kbd className="bg-nxt-100 px-1 py-0.5 rounded border border-nxt-200">Enter</kbd> Seleccionar</span>
              <span className="flex items-center gap-1"><kbd className="bg-nxt-100 px-1 py-0.5 rounded border border-nxt-200">ESC</kbd> Cerrar</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  2b. Command Palette 3-mode miniatures                              */
/* ------------------------------------------------------------------ */

function CmdPaletteMiniLight() {
  return (
    <div className="space-y-1.5">
      <ColorEditable elementKey="navegacion.cmdpalette-search" defaultBg={resolveDominantColor("bg-gray-100")}>
        {(styles, openPicker, currentHex) => (
          <div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-nxt-200 text-[10px] text-nxt-500 cursor-pointer" style={styles} onClick={openPicker}>
              <Search className="w-3 h-3" /> Buscar comandos... <span className="ml-auto text-[8px] bg-white px-1 py-0.5 rounded border border-nxt-200"><Command className="w-2 h-2 inline" /> K</span>
            </div>
            <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
          </div>
        )}
      </ColorEditable>
      <div className="bg-white rounded-lg border border-nxt-200 shadow-sm p-1">
        <p className="text-[8px] font-semibold text-nxt-400 uppercase tracking-wider px-2 py-0.5">Paginas</p>
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-nxt-700 rounded bg-forest/10"><Globe className="w-3 h-3 text-forest" /> Dashboard <span className="ml-auto text-[8px] text-nxt-400">G D</span></div>
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-nxt-700 rounded"><Server className="w-3 h-3 text-nxt-400" /> Servicios</div>
        <p className="text-[8px] font-semibold text-nxt-400 uppercase tracking-wider px-2 py-0.5 mt-1">Acciones</p>
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-nxt-700 rounded"><Rocket className="w-3 h-3 text-nxt-400" /> Desplegar</div>
      </div>
    </div>
  );
}

function CmdPaletteMiniGradient() {
  return (
    <div className="space-y-1.5">
      <ColorEditable elementKey="navegacion.cmdpalette-g-search" defaultBg="#ffffff1a">
        {(styles, openPicker, currentHex) => (
          <div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-white/20 text-[10px] text-white/60 cursor-pointer" style={styles} onClick={openPicker}>
              <Search className="w-3 h-3" /> Buscar comandos... <span className="ml-auto text-[8px] bg-white/10 px-1 py-0.5 rounded border border-white/20"><Command className="w-2 h-2 inline" /> K</span>
            </div>
            <span className="text-[8px] font-mono text-white/40">{currentHex}</span>
          </div>
        )}
      </ColorEditable>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm p-1">
        <p className="text-[8px] font-semibold text-white/40 uppercase tracking-wider px-2 py-0.5">Paginas</p>
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-white/90 rounded bg-white/10"><Globe className="w-3 h-3 text-primary-light" /> Dashboard <span className="ml-auto text-[8px] text-white/40">G D</span></div>
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-white/80 rounded"><Server className="w-3 h-3 text-white/50" /> Servicios</div>
        <p className="text-[8px] font-semibold text-white/40 uppercase tracking-wider px-2 py-0.5 mt-1">Acciones</p>
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-white/80 rounded"><Rocket className="w-3 h-3 text-white/50" /> Desplegar</div>
      </div>
    </div>
  );
}

function CmdPaletteMiniDark() {
  return (
    <div className="space-y-1.5">
      <ColorEditable elementKey="navegacion.cmdpalette-d-search" defaultBg="#1A3036">
        {(styles, openPicker, currentHex) => (
          <div>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#3A3A3A] text-[10px] text-gray-400 cursor-pointer" style={styles} onClick={openPicker}>
              <Search className="w-3 h-3" /> Buscar comandos... <span className="ml-auto text-[8px] bg-[#333] px-1 py-0.5 rounded border border-[#444]"><Command className="w-2 h-2 inline" /> K</span>
            </div>
            <span className="text-[8px] font-mono text-gray-500">{currentHex}</span>
          </div>
        )}
      </ColorEditable>
      <div className="bg-bark rounded-lg border border-[#3A3A3A] shadow-sm p-1">
        <p className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider px-2 py-0.5">Paginas</p>
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-gray-300 rounded bg-primary-light/10"><Globe className="w-3 h-3 text-primary-light" /> Dashboard <span className="ml-auto text-[8px] text-gray-500">G D</span></div>
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-gray-400 rounded"><Server className="w-3 h-3 text-gray-500" /> Servicios</div>
        <p className="text-[8px] font-semibold text-gray-500 uppercase tracking-wider px-2 py-0.5 mt-1">Acciones</p>
        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-gray-400 rounded"><Rocket className="w-3 h-3 text-gray-500" /> Desplegar</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Stepper / Wizard                                                */
/* ------------------------------------------------------------------ */

interface StepDef {
  label: string;
  description: string;
  icon: React.ReactNode;
}

const horizontalSteps: StepDef[] = [
  { label: "Datos basicos", description: "Nombre y descripcion del servicio", icon: <FileText className="w-4 h-4" /> },
  { label: "Configuracion", description: "Parametros y variables de entorno", icon: <Settings className="w-4 h-4" /> },
  { label: "Integraciones", description: "APIs y servicios conectados", icon: <Zap className="w-4 h-4" /> },
  { label: "Despliegue", description: "Revision final y deploy", icon: <Rocket className="w-4 h-4" /> },
];

const verticalSteps: StepDef[] = [
  { label: "Crear cuenta", description: "Registrar email y contrasena", icon: <User className="w-4 h-4" /> },
  { label: "Verificar email", description: "Confirmar direccion de correo", icon: <Mail className="w-4 h-4" /> },
  { label: "Completar perfil", description: "Datos personales y foto", icon: <Edit3 className="w-4 h-4" /> },
  { label: "Configurar equipo", description: "Invitar miembros al workspace", icon: <Shield className="w-4 h-4" /> },
  { label: "Listo", description: "Todo configurado correctamente", icon: <CheckCircle className="w-4 h-4" /> },
];

function StepperDemo() {
  const [hStep, setHStep] = useState(1);
  const [vStep, setVStep] = useState(2);

  return (
    <div className="space-y-6">
      {/* Horizontal stepper */}
      <div className="nxt-card p-4 sm:p-6">
        <p className="text-xs font-semibold text-nxt-500 uppercase tracking-wider mb-5">Stepper horizontal</p>

        {/* Steps bar */}
        <div className="flex items-center mb-6 overflow-x-auto">
          {horizontalSteps.map((step, i) => {
            const isCompleted = i < hStep;
            const isActive = i === hStep;
            const isPending = i > hStep;
            return (
              <div key={i} className="flex items-center flex-1 min-w-0">
                <button
                  onClick={() => { if (isCompleted) setHStep(i); }}
                  className={`flex items-center gap-2 min-w-0 ${isCompleted ? "cursor-pointer" : isPending ? "cursor-default" : "cursor-default"}`}
                >
                  {/* Circle */}
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm transition-all ${
                    isCompleted
                      ? "bg-success text-white"
                      : isActive
                      ? "bg-forest text-white ring-4 ring-forest/20"
                      : "bg-nxt-200 text-nxt-500"
                  }`}>
                    {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                  </span>
                  {/* Label */}
                  <div className="hidden sm:block min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-nxt-900" : isCompleted ? "text-success" : "text-nxt-400"}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-nxt-400 truncate">{step.description}</p>
                  </div>
                </button>
                {/* Connector */}
                {i < horizontalSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 rounded-full transition-colors ${
                    i < hStep ? "bg-success" : "bg-nxt-200"
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="bg-nxt-50 rounded-lg p-4 mb-4 border border-nxt-100">
          <div className="flex items-center gap-2 mb-1">
            {horizontalSteps[hStep].icon}
            <p className="font-semibold text-nxt-800">{horizontalSteps[hStep].label}</p>
          </div>
          <p className="text-sm text-nxt-500">{horizontalSteps[hStep].description}</p>
          <p className="text-xs text-nxt-400 mt-2">Paso {hStep + 1} de {horizontalSteps.length}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHStep(Math.max(0, hStep - 1))}
            disabled={hStep === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-nxt-200 text-nxt-600 hover:bg-nxt-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Atras
          </button>
          <button
            onClick={() => setHStep(Math.min(horizontalSteps.length - 1, hStep + 1))}
            disabled={hStep === horizontalSteps.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-forest text-white hover:bg-forest/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente <ArrowRight className="w-4 h-4" />
          </button>
          {hStep > 0 && (
            <button
              onClick={() => setHStep(0)}
              className="ml-auto flex items-center gap-1.5 px-3 py-2 text-xs text-nxt-500 hover:text-nxt-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
            </button>
          )}
        </div>
      </div>

      {/* Vertical stepper */}
      <div className="nxt-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-semibold text-nxt-500 uppercase tracking-wider">Stepper vertical</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVStep(Math.max(0, vStep - 1))}
              disabled={vStep === 0}
              className="p-1.5 rounded-lg border border-nxt-200 text-nxt-500 hover:bg-nxt-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setVStep(Math.min(verticalSteps.length - 1, vStep + 1))}
              disabled={vStep === verticalSteps.length - 1}
              className="p-1.5 rounded-lg border border-nxt-200 text-nxt-500 hover:bg-nxt-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-0">
          {verticalSteps.map((step, i) => {
            const isCompleted = i < vStep;
            const isActive = i === vStep;
            return (
              <div key={i} className="flex gap-3">
                {/* Dot + line */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => { if (isCompleted) setVStep(i); }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold transition-all ${
                      isCompleted
                        ? "bg-success text-white cursor-pointer"
                        : isActive
                        ? "bg-forest text-white ring-4 ring-forest/20"
                        : "bg-nxt-200 text-nxt-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </button>
                  {i < verticalSteps.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[2rem] transition-colors ${
                      i < vStep ? "bg-success" : "bg-nxt-200"
                    }`} />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-6 ${i === verticalSteps.length - 1 ? "pb-0" : ""}`}>
                  <p className={`text-sm font-medium ${isActive ? "text-nxt-900" : isCompleted ? "text-success" : "text-nxt-400"}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${isActive ? "text-nxt-500" : "text-nxt-400"}`}>
                    {step.description}
                  </p>
                  {isActive && (
                    <div className="mt-2 bg-forest/5 border border-forest/20 rounded-lg px-3 py-2">
                      <p className="text-xs text-nxt-600 flex items-center gap-1.5">
                        {step.icon} <span>Paso actual - completa esta etapa para continuar</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  3b. Stepper 3-mode miniatures                                      */
/* ------------------------------------------------------------------ */

function StepperMiniLight() {
  const miniSteps = ["Datos", "Config", "APIs", "Deploy"];
  const current = 1;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {miniSteps.map((_s, i) => (
          <div key={i} className="flex items-center">
            <ColorEditable elementKey={`navegacion.stepper-active${i === current ? "" : "-done"}`} defaultBg={i < current ? "#22c55e" : i === current ? "#04202C" : "#e2e8f0"}>
              {(styles, openPicker, currentHex) => (
                <div className="flex flex-col items-center">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold cursor-pointer ${
                      i < current ? "text-white" : i === current ? "text-nxt-900 ring-2 ring-primary-light/40" : "text-nxt-400"
                    }`}
                    style={styles}
                    onClick={openPicker}
                  >
                    {i < current ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className="text-[7px] font-mono text-nxt-400 mt-0.5">{currentHex}</span>
                </div>
              )}
            </ColorEditable>
            {i < miniSteps.length - 1 && (
              <div className={`w-4 h-0.5 mx-0.5 rounded-full ${i < current ? "bg-success" : "bg-nxt-200"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-[9px] text-nxt-500">
        {miniSteps.map((s, i) => (
          <span key={i} className={`mr-2 ${i === current ? "font-bold text-nxt-800" : ""}`}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function StepperMiniGradient() {
  const miniSteps = ["Datos", "Config", "APIs", "Deploy"];
  const current = 1;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {miniSteps.map((_s, i) => (
          <div key={i} className="flex items-center">
            <ColorEditable elementKey={`navegacion.stepper-g-step${i}`} defaultBg={i < current ? "#22c55e" : i === current ? "#04202C" : "rgba(255,255,255,0.2)"}>
              {(styles, openPicker, currentHex) => (
                <div className="flex flex-col items-center">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold cursor-pointer ${
                      i < current ? "text-white" : i === current ? "text-nxt-900 ring-2 ring-primary-light/40" : "text-white/60"
                    }`}
                    style={styles}
                    onClick={openPicker}
                  >
                    {i < current ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className="text-[7px] font-mono text-white/40 mt-0.5">{currentHex}</span>
                </div>
              )}
            </ColorEditable>
            {i < miniSteps.length - 1 && (
              <div className={`w-4 h-0.5 mx-0.5 rounded-full ${i < current ? "bg-success" : "bg-white/20"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-[9px] text-white/60">
        {miniSteps.map((s, i) => (
          <span key={i} className={`mr-2 ${i === current ? "font-bold text-white" : ""}`}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function StepperMiniDark() {
  const miniSteps = ["Datos", "Config", "APIs", "Deploy"];
  const current = 1;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {miniSteps.map((_s, i) => (
          <div key={i} className="flex items-center">
            <ColorEditable elementKey={`navegacion.stepper-d-step${i}`} defaultBg={i < current ? "#22c55e" : i === current ? "#04202C" : "#3A3A3A"}>
              {(styles, openPicker, currentHex) => (
                <div className="flex flex-col items-center">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold cursor-pointer ${
                      i < current ? "text-white" : i === current ? "text-nxt-900 ring-2 ring-primary-light/40" : "text-gray-500"
                    }`}
                    style={styles}
                    onClick={openPicker}
                  >
                    {i < current ? <Check className="w-3 h-3" /> : i + 1}
                  </span>
                  <span className="text-[7px] font-mono text-gray-600 mt-0.5">{currentHex}</span>
                </div>
              )}
            </ColorEditable>
            {i < miniSteps.length - 1 && (
              <div className={`w-4 h-0.5 mx-0.5 rounded-full ${i < current ? "bg-success" : "bg-[#3A3A3A]"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-[9px] text-gray-500">
        {miniSteps.map((s, i) => (
          <span key={i} className={`mr-2 ${i === current ? "font-bold text-gray-200" : ""}`}>{s}</span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Accordion                                                       */
/* ------------------------------------------------------------------ */

interface AccordionItemDef {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  children?: AccordionItemDef[];
}

const faqItems: AccordionItemDef[] = [
  {
    id: "faq-1",
    title: "Como crear un nuevo servicio?",
    icon: <Rocket className="w-4 h-4 text-forest" />,
    content: "Navega a la seccion de Servicios en el sidebar y haz clic en 'Nuevo servicio'. Completa el formulario con el nombre, tipo de servicio, y las variables de entorno necesarias. El sistema generara automaticamente la configuracion de Docker y los endpoints correspondientes.",
  },
  {
    id: "faq-2",
    title: "Cuales son los limites de la API?",
    icon: <Shield className="w-4 h-4 text-info" />,
    content: "El plan actual permite hasta 10,000 requests por minuto con un maximo de 100 conexiones concurrentes. Los webhooks tienen un timeout de 30 segundos. Para aumentar estos limites, contacta al equipo de infraestructura.",
  },
  {
    id: "faq-3",
    title: "Como configurar notificaciones?",
    icon: <Bell className="w-4 h-4 text-warning" />,
    content: "Ve a Configuracion > Notificaciones. Puedes activar alertas por email, Slack, o webhooks personalizados. Cada canal se puede configurar con filtros de severidad (critico, warning, info) y horarios de envio.",
  },
  {
    id: "faq-4",
    title: "Que hacer en caso de una caida?",
    icon: <AlertTriangle className="w-4 h-4 text-error" />,
    content: "Primero revisa el panel de Monitoreo para identificar el servicio afectado. Luego consulta los logs en tiempo real desde la terminal integrada. Si necesitas reiniciar, usa el boton de 'Restart' en la tarjeta del servicio. Para incidentes criticos, el sistema activa automaticamente el protocolo de failover.",
  },
];

const multiItems: AccordionItemDef[] = [
  {
    id: "multi-1",
    title: "Integraciones disponibles",
    icon: <Zap className="w-4 h-4 text-forest" />,
    content: "Conecta con Supabase, Redis, n8n, APIs REST/GraphQL, y servicios de IA como Gemini y OpenAI.",
    children: [
      { id: "multi-1a", title: "Bases de datos", icon: <Database className="w-4 h-4 text-info" />, content: "PostgreSQL via Supabase, Redis para cache, SQLite para datos locales." },
      { id: "multi-1b", title: "APIs externas", icon: <Globe className="w-4 h-4 text-success" />, content: "Cualquier API REST o GraphQL. Soporte para OAuth2, API keys, y JWT." },
    ],
  },
  {
    id: "multi-2",
    title: "Seguridad y permisos",
    icon: <Shield className="w-4 h-4 text-warning" />,
    content: "Sistema de roles con permisos granulares. Soporte para SSO via Google OAuth.",
  },
  {
    id: "multi-3",
    title: "Monitoreo y logs",
    icon: <Eye className="w-4 h-4 text-info" />,
    content: "Dashboard en tiempo real con metricas de CPU, memoria, latencia y throughput. Logs centralizados con busqueda full-text.",
  },
];

function AccordionPanel({
  item,
  isOpen,
  onToggle,
  nested = false,
}: {
  item: AccordionItemDef;
  isOpen: boolean;
  onToggle: () => void;
  nested?: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  /* nested children accordion state */
  const [openChild, setOpenChild] = useState<string | null>(null);

  return (
    <div className={`border ${nested ? "border-nxt-100" : "border-nxt-200"} rounded-lg overflow-hidden ${nested ? "bg-nxt-50/50" : ""}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
          isOpen ? "bg-nxt-50" : "hover:bg-nxt-50/50"
        }`}
      >
        {item.icon}
        <span className={`flex-1 text-sm font-medium ${isOpen ? "text-nxt-900" : "text-nxt-700"}`}>
          {item.title}
        </span>
        <ChevronDown className={`w-4 h-4 text-nxt-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div
        style={{ height }}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
      >
        <div ref={contentRef} className="px-4 pb-3 pt-1">
          <p className="text-sm text-nxt-600 leading-relaxed">{item.content}</p>
          {/* Nested accordion */}
          {item.children && item.children.length > 0 && (
            <div className="mt-3 space-y-2">
              {item.children.map((child) => (
                <AccordionPanel
                  key={child.id}
                  item={child}
                  isOpen={openChild === child.id}
                  onToggle={() => setOpenChild(openChild === child.id ? null : child.id)}
                  nested
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccordionDemo() {
  /* Single expand */
  const [singleOpen, setSingleOpen] = useState<string | null>("faq-1");
  /* Multi expand */
  const [multiOpen, setMultiOpen] = useState<Set<string>>(new Set(["multi-1"]));

  const toggleMulti = (id: string) => {
    setMultiOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Single expand */}
      <div className="nxt-card p-4 sm:p-6">
        <p className="text-xs font-semibold text-nxt-500 uppercase tracking-wider mb-4">Expansion unica (FAQ)</p>
        <div className="space-y-2">
          {faqItems.map((item) => (
            <AccordionPanel
              key={item.id}
              item={item}
              isOpen={singleOpen === item.id}
              onToggle={() => setSingleOpen(singleOpen === item.id ? null : item.id)}
            />
          ))}
        </div>
      </div>

      {/* Multi expand + nested */}
      <div className="nxt-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-nxt-500 uppercase tracking-wider">Expansion multiple + anidado</p>
          <div className="flex gap-1">
            <button
              onClick={() => setMultiOpen(new Set(multiItems.map((i) => i.id)))}
              className="text-[10px] px-2 py-1 rounded bg-nxt-100 text-nxt-600 hover:bg-nxt-200 transition-colors"
            >
              Abrir todos
            </button>
            <button
              onClick={() => setMultiOpen(new Set())}
              className="text-[10px] px-2 py-1 rounded bg-nxt-100 text-nxt-600 hover:bg-nxt-200 transition-colors"
            >
              Cerrar todos
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {multiItems.map((item) => (
            <AccordionPanel
              key={item.id}
              item={item}
              isOpen={multiOpen.has(item.id)}
              onToggle={() => toggleMulti(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  4b. Accordion 3-mode miniatures                                    */
/* ------------------------------------------------------------------ */

function AccordionMiniLight() {
  const items = [
    { label: "Como crear un servicio?", icon: <Rocket className="w-3 h-3 text-forest" />, open: true, content: "Navega a Servicios y haz clic en Nuevo servicio." },
    { label: "Limites de la API?", icon: <Shield className="w-3 h-3 text-info" />, open: false, content: "" },
    { label: "Configurar notificaciones?", icon: <Bell className="w-3 h-3 text-warning" />, open: false, content: "" },
  ];
  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="border border-nxt-200 rounded-lg overflow-hidden">
          <ColorEditable elementKey={`navegacion.accordion-item${i}`} defaultBg={item.open ? "#f8fafc" : "#ffffff"}>
            {(styles, openPicker, currentHex) => (
              <div>
                <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] cursor-pointer" style={styles} onClick={openPicker}>
                  {item.icon}
                  <span className={`flex-1 font-medium ${item.open ? "text-nxt-900" : "text-nxt-600"}`}>{item.label}</span>
                  <ChevronDown className={`w-3 h-3 text-nxt-400 ${item.open ? "rotate-180" : ""}`} />
                </div>
                {item.open && <div className="px-2 pb-1.5 text-[9px] text-nxt-500">{item.content}</div>}
                <span className="text-[7px] font-mono text-nxt-400 px-2 pb-1 block">{currentHex}</span>
              </div>
            )}
          </ColorEditable>
        </div>
      ))}
    </div>
  );
}

function AccordionMiniGradient() {
  const items = [
    { label: "Como crear un servicio?", icon: <Rocket className="w-3 h-3 text-yellow-300" />, open: true, content: "Navega a Servicios y haz clic en Nuevo servicio." },
    { label: "Limites de la API?", icon: <Shield className="w-3 h-3 text-cyan-300" />, open: false, content: "" },
    { label: "Configurar notificaciones?", icon: <Bell className="w-3 h-3 text-amber-300" />, open: false, content: "" },
  ];
  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="border border-white/15 rounded-lg overflow-hidden">
          <ColorEditable elementKey={`navegacion.accordion-g-item${i}`} defaultBg={item.open ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}>
            {(styles, openPicker, currentHex) => (
              <div>
                <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] cursor-pointer" style={styles} onClick={openPicker}>
                  {item.icon}
                  <span className={`flex-1 font-medium ${item.open ? "text-white" : "text-white/70"}`}>{item.label}</span>
                  <ChevronDown className={`w-3 h-3 text-white/40 ${item.open ? "rotate-180" : ""}`} />
                </div>
                {item.open && <div className="px-2 pb-1.5 text-[9px] text-white/60">{item.content}</div>}
                <span className="text-[7px] font-mono text-white/30 px-2 pb-1 block">{currentHex}</span>
              </div>
            )}
          </ColorEditable>
        </div>
      ))}
    </div>
  );
}

function AccordionMiniDark() {
  const items = [
    { label: "Como crear un servicio?", icon: <Rocket className="w-3 h-3 text-yellow-400" />, open: true, content: "Navega a Servicios y haz clic en Nuevo servicio." },
    { label: "Limites de la API?", icon: <Shield className="w-3 h-3 text-blue-400" />, open: false, content: "" },
    { label: "Configurar notificaciones?", icon: <Bell className="w-3 h-3 text-amber-400" />, open: false, content: "" },
  ];
  return (
    <div className="space-y-1">
      {items.map((item, i) => (
        <div key={i} className="border border-[#3A3A3A] rounded-lg overflow-hidden">
          <ColorEditable elementKey={`navegacion.accordion-d-item${i}`} defaultBg={item.open ? "#1A3036" : "#222"}>
            {(styles, openPicker, currentHex) => (
              <div>
                <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] cursor-pointer" style={styles} onClick={openPicker}>
                  {item.icon}
                  <span className={`flex-1 font-medium ${item.open ? "text-gray-200" : "text-gray-400"}`}>{item.label}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-500 ${item.open ? "rotate-180" : ""}`} />
                </div>
                {item.open && <div className="px-2 pb-1.5 text-[9px] text-gray-400">{item.content}</div>}
                <span className="text-[7px] font-mono text-gray-600 px-2 pb-1 block">{currentHex}</span>
              </div>
            )}
          </ColorEditable>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Timeline                                                        */
/* ------------------------------------------------------------------ */

interface TimelineEvent {
  id: number;
  type: "success" | "warning" | "error" | "info";
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

const initialEvents: TimelineEvent[] = [
  { id: 1, type: "success", title: "Despliegue completado", description: "v2.4.1 desplegado en produccion sin errores", time: "Hace 5 min", icon: <Rocket className="w-3.5 h-3.5" /> },
  { id: 2, type: "info", title: "Pipeline iniciado", description: "Build #847 en progreso - rama main", time: "Hace 12 min", icon: <Play className="w-3.5 h-3.5" /> },
  { id: 3, type: "warning", title: "Latencia elevada", description: "API Gateway reportando latencia > 200ms", time: "Hace 25 min", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { id: 4, type: "error", title: "Servicio caido", description: "Redis cache no responde - failover activado", time: "Hace 1 hora", icon: <XCircle className="w-3.5 h-3.5" /> },
  { id: 5, type: "success", title: "Backup completado", description: "Snapshot de base de datos creado correctamente", time: "Hace 2 horas", icon: <Database className="w-3.5 h-3.5" /> },
  { id: 6, type: "info", title: "Nuevo miembro", description: "fsilva se unio al equipo de desarrollo", time: "Hace 3 horas", icon: <User className="w-3.5 h-3.5" /> },
];

const typeColors: Record<string, { dot: string; bg: string; text: string; border: string }> = {
  success: { dot: "bg-success", bg: "bg-success/10", text: "text-success", border: "border-success/30" },
  warning: { dot: "bg-warning", bg: "bg-warning/10", text: "text-warning", border: "border-warning/30" },
  error:   { dot: "bg-error",   bg: "bg-error/10",   text: "text-error",   border: "border-error/30" },
  info:    { dot: "bg-info",    bg: "bg-info/10",     text: "text-info",    border: "border-info/30" },
};

const newEventOptions: { type: TimelineEvent["type"]; title: string; description: string; icon: React.ReactNode }[] = [
  { type: "success", title: "Test suite pasado", description: "156 tests ejecutados, 0 fallos", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  { type: "warning", title: "Memoria al 85%", description: "Servidor principal cerca del limite", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { type: "error", title: "Error de certificado", description: "SSL certificate expiring in 3 days", icon: <Shield className="w-3.5 h-3.5" /> },
  { type: "info", title: "Merge completado", description: "PR #234 mergeado a main por mromero", icon: <MessageSquare className="w-3.5 h-3.5" /> },
];

function TimelineDemo() {
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
  const [filter, setFilter] = useState<string | null>(null);
  const [nextId, setNextId] = useState(initialEvents.length + 1);
  const [layout, setLayout] = useState<"left" | "alternating">("left");

  const addEvent = () => {
    const template = newEventOptions[Math.floor(Math.random() * newEventOptions.length)];
    const newEvent: TimelineEvent = {
      id: nextId,
      type: template.type,
      title: template.title,
      description: template.description,
      time: "Ahora",
      icon: template.icon,
    };
    setEvents((prev) => [newEvent, ...prev]);
    setNextId((prev) => prev + 1);
  };

  const filteredEvents = filter ? events.filter((e) => e.type === filter) : events;

  const filterButtons: { type: string | null; label: string }[] = [
    { type: null, label: "Todos" },
    { type: "success", label: "Exito" },
    { type: "warning", label: "Warning" },
    { type: "error", label: "Error" },
    { type: "info", label: "Info" },
  ];

  return (
    <div className="nxt-card p-4 sm:p-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <button
          onClick={addEvent}
          className="flex items-center gap-1.5 px-3 py-2 bg-forest text-white text-sm font-medium rounded-lg hover:bg-forest/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar evento
        </button>

        <div className="flex items-center gap-1 bg-nxt-100 p-1 rounded-lg">
          {filterButtons.map((fb) => (
            <button
              key={fb.label}
              onClick={() => setFilter(fb.type)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                filter === fb.type
                  ? "bg-white text-nxt-900 shadow-sm"
                  : "text-nxt-500 hover:text-nxt-700"
              }`}
            >
              {fb.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1 bg-nxt-100 p-1 rounded-lg">
          <button
            onClick={() => setLayout("left")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              layout === "left" ? "bg-white text-nxt-900 shadow-sm" : "text-nxt-500 hover:text-nxt-700"
            }`}
          >
            Izquierda
          </button>
          <button
            onClick={() => setLayout("alternating")}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              layout === "alternating" ? "bg-white text-nxt-900 shadow-sm" : "text-nxt-500 hover:text-nxt-700"
            }`}
          >
            Alternado
          </button>
        </div>
      </div>

      {/* Timeline */}
      {layout === "left" ? (
        /* Left-aligned timeline */
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-nxt-200" />

          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const colors = typeColors[event.type];
              return (
                <div key={event.id} className="relative flex gap-4 items-start group">
                  {/* Dot */}
                  <div className={`absolute -left-8 top-1 w-[30px] h-[30px] rounded-full flex items-center justify-center ${colors.dot} text-white z-10 shadow-sm`}>
                    {event.icon}
                  </div>
                  {/* Card */}
                  <div className={`flex-1 ${colors.bg} border ${colors.border} rounded-lg px-4 py-3 transition-all group-hover:shadow-sm`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-nxt-800">{event.title}</p>
                        <p className="text-xs text-nxt-500 mt-0.5">{event.description}</p>
                      </div>
                      <span className="text-[10px] text-nxt-400 whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" /> {event.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Alternating timeline */
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 -translate-x-[1px] top-2 bottom-2 w-0.5 bg-nxt-200" />

          <div className="space-y-4">
            {filteredEvents.map((event, i) => {
              const colors = typeColors[event.type];
              const isLeft = i % 2 === 0;
              return (
                <div key={event.id} className="relative flex items-start">
                  {/* Left content */}
                  <div className={`w-[calc(50%-20px)] ${isLeft ? "" : "order-last"}`}>
                    {isLeft && (
                      <div className={`${colors.bg} border ${colors.border} rounded-lg px-4 py-3 ml-auto mr-4 max-w-sm`}>
                        <p className="text-sm font-semibold text-nxt-800">{event.title}</p>
                        <p className="text-xs text-nxt-500 mt-0.5">{event.description}</p>
                        <span className="text-[10px] text-nxt-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {event.time}
                        </span>
                      </div>
                    )}
                    {!isLeft && (
                      <div className={`${colors.bg} border ${colors.border} rounded-lg px-4 py-3 ml-4 max-w-sm`}>
                        <p className="text-sm font-semibold text-nxt-800">{event.title}</p>
                        <p className="text-xs text-nxt-500 mt-0.5">{event.description}</p>
                        <span className="text-[10px] text-nxt-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {event.time}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Center dot */}
                  <div className={`absolute left-1/2 -translate-x-1/2 top-1 w-[30px] h-[30px] rounded-full flex items-center justify-center ${colors.dot} text-white z-10 shadow-sm`}>
                    {event.icon}
                  </div>

                  {/* Right content (timestamp on opposite side) */}
                  <div className={`w-[calc(50%-20px)] ${isLeft ? "" : "order-first"}`}>
                    {isLeft ? (
                      <div className="pl-4 pt-1">
                        <span className="text-[10px] text-nxt-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {event.time}
                        </span>
                      </div>
                    ) : (
                      <div className="pr-4 pt-1 text-right">
                        <span className="text-[10px] text-nxt-400 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {event.time}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredEvents.length === 0 && (
        <div className="text-center py-8">
          <Filter className="w-8 h-8 text-nxt-300 mx-auto mb-2" />
          <p className="text-sm text-nxt-500">No hay eventos de este tipo</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  5b. Timeline 3-mode miniatures                                     */
/* ------------------------------------------------------------------ */

function TimelineMiniLight() {
  const miniEvents = [
    { type: "success", title: "Deploy v2.4.1", time: "5 min", dotCls: "bg-success" },
    { type: "warning", title: "Latencia alta", time: "25 min", dotCls: "bg-warning" },
    { type: "error", title: "Redis caido", time: "1 hr", dotCls: "bg-error" },
  ];
  return (
    <div className="relative pl-5">
      <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-nxt-200" />
      <div className="space-y-2">
        {miniEvents.map((ev, i) => (
          <div key={i} className="relative flex items-start gap-2">
            <ColorEditable elementKey={`navegacion.timeline-dot${i}`} defaultBg={ev.dotCls === "bg-success" ? "#22c55e" : ev.dotCls === "bg-warning" ? "#f59e0b" : "#ef4444"}>
              {(styles, openPicker, currentHex) => (
                <div className="flex flex-col items-center">
                  <span className="absolute -left-5 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white cursor-pointer" style={styles} onClick={openPicker}>
                    <Circle className="w-2 h-2 fill-current" />
                  </span>
                  <span className="text-[6px] font-mono text-nxt-400 absolute -left-5 top-5">{currentHex}</span>
                </div>
              )}
            </ColorEditable>
            <div className="ml-1">
              <p className="text-[10px] font-medium text-nxt-800">{ev.title}</p>
              <p className="text-[8px] text-nxt-400">{ev.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineMiniGradient() {
  const miniEvents = [
    { title: "Deploy v2.4.1", time: "5 min", color: "#22c55e" },
    { title: "Latencia alta", time: "25 min", color: "#f59e0b" },
    { title: "Redis caido", time: "1 hr", color: "#ef4444" },
  ];
  return (
    <div className="relative pl-5">
      <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-white/20" />
      <div className="space-y-2">
        {miniEvents.map((ev, i) => (
          <div key={i} className="relative flex items-start gap-2">
            <ColorEditable elementKey={`navegacion.timeline-g-dot${i}`} defaultBg={ev.color}>
              {(styles, openPicker, currentHex) => (
                <div className="flex flex-col items-center">
                  <span className="absolute -left-5 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white cursor-pointer" style={styles} onClick={openPicker}>
                    <Circle className="w-2 h-2 fill-current" />
                  </span>
                  <span className="text-[6px] font-mono text-white/30 absolute -left-5 top-5">{currentHex}</span>
                </div>
              )}
            </ColorEditable>
            <div className="ml-1">
              <p className="text-[10px] font-medium text-white">{ev.title}</p>
              <p className="text-[8px] text-white/50">{ev.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineMiniDark() {
  const miniEvents = [
    { title: "Deploy v2.4.1", time: "5 min", color: "#22c55e" },
    { title: "Latencia alta", time: "25 min", color: "#f59e0b" },
    { title: "Redis caido", time: "1 hr", color: "#ef4444" },
  ];
  return (
    <div className="relative pl-5">
      <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-[#3A3A3A]" />
      <div className="space-y-2">
        {miniEvents.map((ev, i) => (
          <div key={i} className="relative flex items-start gap-2">
            <ColorEditable elementKey={`navegacion.timeline-d-dot${i}`} defaultBg={ev.color}>
              {(styles, openPicker, currentHex) => (
                <div className="flex flex-col items-center">
                  <span className="absolute -left-5 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white cursor-pointer" style={styles} onClick={openPicker}>
                    <Circle className="w-2 h-2 fill-current" />
                  </span>
                  <span className="text-[6px] font-mono text-gray-600 absolute -left-5 top-5">{currentHex}</span>
                </div>
              )}
            </ColorEditable>
            <div className="ml-1">
              <p className="text-[10px] font-medium text-gray-200">{ev.title}</p>
              <p className="text-[8px] text-gray-500">{ev.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Code Block                                                      */
/* ------------------------------------------------------------------ */

interface CodeTab {
  label: string;
  language: string;
  icon: React.ReactNode;
  code: string;
}

const codeTabs: CodeTab[] = [
  {
    label: "HTML",
    language: "html",
    icon: <Code className="w-3.5 h-3.5" />,
    code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width" />
  <title>IAgentek Design System</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="app" class="nxt-container">
    <header class="nxt-header">
      <h1>Dashboard</h1>
      <nav class="nxt-nav">
        <a href="/servicios">Servicios</a>
        <a href="/monitoreo">Monitoreo</a>
      </nav>
    </header>
    <main class="nxt-main">
      <!-- Content here -->
    </main>
  </div>
  <script src="app.js"></script>
</body>
</html>`,
  },
  {
    label: "CSS",
    language: "css",
    icon: <Hash className="w-3.5 h-3.5" />,
    code: `:root {
  --primary: #04202C;
  --nxt-900: #0f172a;
  --nxt-700: #334155;
  --nxt-200: #e2e8f0;
  --nxt-50: #f8fafc;
  --radius: 0.75rem;
}

.nxt-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem;
}

.nxt-card {
  background: white;
  border-radius: var(--radius);
  border: 1px solid var(--nxt-200);
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);
  padding: 1.5rem;
}

.nxt-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 2px solid var(--nxt-200);
}

.nxt-btn-primary {
  background: var(--primary);
  color: var(--nxt-900);
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: opacity 150ms;
}

.nxt-btn-primary:hover {
  opacity: 0.9;
}`,
  },
  {
    label: "JavaScript",
    language: "javascript",
    icon: <FileText className="w-3.5 h-3.5" />,
    code: `import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Fetch services with real-time updates
async function fetchServices() {
  const { data, error } = await supabase
    .from("iagentek-designsystem-services")
    .select("id, name, status, latency")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }

  return data.map((service) => ({
    ...service,
    healthy: service.status === "active",
    badge: service.latency < 100 ? "fast" : "slow",
  }));
}

// Subscribe to changes
const channel = supabase
  .channel("services")
  .on("postgres_changes",
    { event: "*", schema: "public", table: "services" },
    (payload) => {
      console.log("Service updated:", payload.new);
      updateDashboard(payload.new);
    }
  )
  .subscribe();

export { fetchServices, channel };`,
  },
  {
    label: "Terminal",
    language: "terminal",
    icon: <Terminal className="w-3.5 h-3.5" />,
    code: `$ npm install @forest/design-system
added 42 packages in 3.2s

$ npm run build
> forest-playground@2.4.1 build
> vite build

vite v5.4.2 building for production...
transforming (156) src/index.tsx
\u2713 156 modules transformed.
dist/index.html          0.46 kB \u2502 gzip:  0.30 kB
dist/assets/index.css   24.18 kB \u2502 gzip:  5.12 kB
dist/assets/index.js   142.67 kB \u2502 gzip: 46.23 kB
\u2713 built in 2.84s

$ docker compose up -d
[+] Running 3/3
 \u2714 Container nginx      Started  0.4s
 \u2714 Container api        Started  1.2s
 \u2714 Container frontend   Started  0.8s

$ curl -s localhost:52817/health | jq .
{
  "status": "healthy",
  "version": "2.4.1",
  "uptime": "4d 12h 33m",
  "services": 7
}`,
  },
];

/* Simple syntax highlighting by token type */
function highlightLine(line: string, language: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let key = 0;

  if (language === "terminal") {
    if (line.startsWith("$")) {
      tokens.push(<span key={key++} className="text-emerald-400">$ </span>);
      tokens.push(<span key={key++} className="text-sky-300">{line.slice(2)}</span>);
    } else if (line.startsWith("\u2713") || line.startsWith("\u2714")) {
      tokens.push(<span key={key++} className="text-emerald-400">{line}</span>);
    } else if (line.startsWith(">")) {
      tokens.push(<span key={key++} className="text-nxt-500">{line}</span>);
    } else if (line.includes("Error") || line.includes("error")) {
      tokens.push(<span key={key++} className="text-red-400">{line}</span>);
    } else if (line.startsWith("[+]") || line.startsWith(" ")) {
      tokens.push(<span key={key++} className="text-nxt-400">{line}</span>);
    } else {
      tokens.push(<span key={key++} className="text-nxt-300">{line}</span>);
    }
    return tokens;
  }

  if (language === "html") {
    /* Very simple HTML highlighting */
    const remaining = line;
    let matchArr: RegExpExecArray | null;
    const htmlRegex = /(<\/?[\w-]+)|(\s[\w-]+=)|(".*?")|(&lt;|&gt;)|(<!--.*?-->)|(>)/g;
    let lastIdx = 0;

    while ((matchArr = htmlRegex.exec(remaining)) !== null) {
      if (matchArr.index > lastIdx) {
        tokens.push(<span key={key++} className="text-nxt-300">{remaining.slice(lastIdx, matchArr.index)}</span>);
      }
      const m = matchArr[0];
      if (m.startsWith("<!--")) {
        tokens.push(<span key={key++} className="text-nxt-500 italic">{m}</span>);
      } else if (m.startsWith("<")) {
        tokens.push(<span key={key++} className="text-rose-400">{m}</span>);
      } else if (m.startsWith('"')) {
        tokens.push(<span key={key++} className="text-emerald-400">{m}</span>);
      } else if (m.includes("=")) {
        tokens.push(<span key={key++} className="text-sky-300">{m}</span>);
      } else if (m === ">") {
        tokens.push(<span key={key++} className="text-rose-400">{m}</span>);
      } else {
        tokens.push(<span key={key++} className="text-nxt-300">{m}</span>);
      }
      lastIdx = matchArr.index + m.length;
    }
    if (lastIdx < remaining.length) {
      tokens.push(<span key={key++} className="text-nxt-300">{remaining.slice(lastIdx)}</span>);
    }
    if (tokens.length === 0) tokens.push(<span key={key++} className="text-nxt-300">{line}</span>);
    return tokens;
  }

  if (language === "css") {
    if (line.trim().startsWith("/*") || line.trim().startsWith("*")) {
      return [<span key={0} className="text-nxt-500 italic">{line}</span>];
    }
    if (line.includes("--")) {
      const parts = line.split(":");
      if (parts.length >= 2) {
        tokens.push(<span key={key++} className="text-sky-300">{parts[0]}:</span>);
        tokens.push(<span key={key++} className="text-emerald-400">{parts.slice(1).join(":")}</span>);
        return tokens;
      }
    }
    if (line.includes(":") && !line.includes("{")) {
      const colonIdx = line.indexOf(":");
      tokens.push(<span key={key++} className="text-sky-300">{line.slice(0, colonIdx)}</span>);
      tokens.push(<span key={key++} className="text-nxt-400">:</span>);
      tokens.push(<span key={key++} className="text-amber-300">{line.slice(colonIdx + 1)}</span>);
      return tokens;
    }
    if (line.includes("{") || line.includes("}")) {
      tokens.push(<span key={key++} className="text-violet-400">{line}</span>);
      return tokens;
    }
    return [<span key={0} className="text-nxt-300">{line}</span>];
  }

  if (language === "javascript") {
    const jsComments = /(\/\/.*$)/;

    /* Check for comment first */
    const commentMatch = jsComments.exec(line);
    if (commentMatch && line.trim().startsWith("//")) {
      return [<span key={0} className="text-nxt-500 italic">{line}</span>];
    }

    /* Simple token split */
    const remaining = line;
    let lastIdx = 0;
    const combinedRegex = /(\b(?:import|from|export|const|let|var|async|function|await|return|if|else|new)\b)|(".*?"|'.*?'|`.*?`)|(\/\/.*$)|(\b\d+\b)|(\.[\w]+\()|(\{|\}|\(|\)|\[|\]|=>|;|,)/g;
    let match: RegExpExecArray | null;

    while ((match = combinedRegex.exec(remaining)) !== null) {
      if (match.index > lastIdx) {
        tokens.push(<span key={key++} className="text-nxt-300">{remaining.slice(lastIdx, match.index)}</span>);
      }
      const m = match[0];
      if (match[1]) {
        tokens.push(<span key={key++} className="text-violet-400">{m}</span>);
      } else if (match[2]) {
        tokens.push(<span key={key++} className="text-emerald-400">{m}</span>);
      } else if (match[3]) {
        tokens.push(<span key={key++} className="text-nxt-500 italic">{m}</span>);
      } else if (match[4]) {
        tokens.push(<span key={key++} className="text-amber-300">{m}</span>);
      } else if (match[5]) {
        tokens.push(<span key={key++} className="text-sky-300">{m}</span>);
      } else {
        tokens.push(<span key={key++} className="text-nxt-400">{m}</span>);
      }
      lastIdx = match.index + m.length;
    }
    if (lastIdx < remaining.length) {
      tokens.push(<span key={key++} className="text-nxt-300">{remaining.slice(lastIdx)}</span>);
    }
    if (tokens.length === 0) tokens.push(<span key={key++} className="text-nxt-300">{line}</span>);
    return tokens;
  }

  return [<span key={0} className="text-nxt-300">{line}</span>];
}

function CodeBlockDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const tab = codeTabs[activeTab];
  const lines = tab.code.split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tab.code);
    } catch {
      /* fallback for non-secure contexts */
      const textarea = document.createElement("textarea");
      textarea.value = tab.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="nxt-card overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#1e1e2e] px-4 py-2 border-b border-[#2a2a3e]">
        {/* Tabs */}
        <div className="flex items-center gap-0.5">
          {codeTabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => { setActiveTab(i); setCopied(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors ${
                activeTab === i
                  ? "bg-[#282840] text-white"
                  : "text-[#888] hover:text-[#ccc] hover:bg-[#282840]/50"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={`flex items-center gap-1 px-2 py-1 text-[10px] rounded transition-colors ${
              showLineNumbers
                ? "bg-[#282840] text-[#ccc]"
                : "text-[#666] hover:text-[#999]"
            }`}
            title="Numeros de linea"
          >
            <Hash className="w-3 h-3" /> {showLineNumbers ? "ON" : "OFF"}
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-all ${
              copied
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-[#282840] text-[#888] hover:text-white"
            }`}
          >
            {copied ? (
              <><CheckCircle className="w-3.5 h-3.5" /> Copiado!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Copiar</>
            )}
          </button>
        </div>
      </div>

      {/* Code area */}
      <div className="bg-[#1e1e2e] overflow-x-auto">
        <pre className="text-sm leading-6 py-4 font-mono">
          {lines.map((line, i) => (
            <div key={i} className="flex hover:bg-white/5 transition-colors px-4">
              {showLineNumbers && (
                <span className="inline-block w-10 text-right pr-4 text-[#555] select-none flex-shrink-0 text-xs leading-6">
                  {i + 1}
                </span>
              )}
              <code className="flex-1">{highlightLine(line, tab.language)}</code>
            </div>
          ))}
        </pre>
      </div>

      {/* Footer */}
      <div className="bg-[#1a1a2a] px-4 py-1.5 flex items-center justify-between text-[10px] text-[#555] border-t border-[#2a2a3e]">
        <span>{tab.language.toUpperCase()} - {lines.length} lineas</span>
        <span>UTF-8 - IAgentek Design System</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  6b. Code Block 3-mode miniatures                                   */
/* ------------------------------------------------------------------ */

function CodeBlockMiniLight() {
  return (
    <div className="space-y-1">
      <ColorEditable elementKey="navegacion.codeblock-header" defaultBg="#1e1e2e">
        {(styles, openPicker, currentHex) => (
          <div>
            <div className="rounded-t-lg px-2 py-1 flex items-center gap-2 cursor-pointer" style={styles} onClick={openPicker}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <span className="text-[8px] text-[#888]">index.js</span>
            </div>
            <span className="text-[7px] font-mono text-nxt-400">{currentHex}</span>
          </div>
        )}
      </ColorEditable>
      <div className="bg-[#1e1e2e] rounded-b-lg px-2 py-1.5 font-mono text-[8px] leading-4">
        <div><span className="text-violet-400">const</span> <span className="text-nxt-300">app</span> <span className="text-nxt-400">=</span> <span className="text-sky-300">.create</span><span className="text-nxt-400">()</span></div>
        <div><span className="text-violet-400">import</span> <span className="text-emerald-400">"./styles.css"</span></div>
        <div className="text-nxt-500 italic">{"// ready"}</div>
      </div>
    </div>
  );
}

function CodeBlockMiniGradient() {
  return (
    <div className="space-y-1">
      <ColorEditable elementKey="navegacion.codeblock-g-header" defaultBg="rgba(255,255,255,0.1)">
        {(styles, openPicker, currentHex) => (
          <div>
            <div className="rounded-t-lg px-2 py-1 flex items-center gap-2 border border-white/10 cursor-pointer" style={styles} onClick={openPicker}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400/70" />
                <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
                <span className="w-2 h-2 rounded-full bg-green-400/70" />
              </div>
              <span className="text-[8px] text-white/50">index.js</span>
            </div>
            <span className="text-[7px] font-mono text-white/30">{currentHex}</span>
          </div>
        )}
      </ColorEditable>
      <div className="bg-black/30 rounded-b-lg px-2 py-1.5 font-mono text-[8px] leading-4 border border-white/10 border-t-0">
        <div><span className="text-violet-300">const</span> <span className="text-white/70">app</span> <span className="text-white/40">=</span> <span className="text-cyan-300">.create</span><span className="text-white/40">()</span></div>
        <div><span className="text-violet-300">import</span> <span className="text-emerald-300">"./styles.css"</span></div>
        <div className="text-white/30 italic">{"// ready"}</div>
      </div>
    </div>
  );
}

function CodeBlockMiniDark() {
  return (
    <div className="space-y-1">
      <ColorEditable elementKey="navegacion.codeblock-d-header" defaultBg="#1A3036">
        {(styles, openPicker, currentHex) => (
          <div>
            <div className="rounded-t-lg px-2 py-1 flex items-center gap-2 border border-[#3A3A3A] cursor-pointer" style={styles} onClick={openPicker}>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="w-2 h-2 rounded-full bg-green-400" />
              </div>
              <span className="text-[8px] text-gray-500">index.js</span>
            </div>
            <span className="text-[7px] font-mono text-gray-600">{currentHex}</span>
          </div>
        )}
      </ColorEditable>
      <div className="bg-[#1e1e1e] rounded-b-lg px-2 py-1.5 font-mono text-[8px] leading-4 border border-[#3A3A3A] border-t-0">
        <div><span className="text-violet-400">const</span> <span className="text-gray-300">app</span> <span className="text-gray-500">=</span> <span className="text-sky-400">.create</span><span className="text-gray-500">()</span></div>
        <div><span className="text-violet-400">import</span> <span className="text-emerald-400">"./styles.css"</span></div>
        <div className="text-gray-600 italic">{"// ready"}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Export                                                        */
/* ------------------------------------------------------------------ */

export function NavegacionSection({ scrollTo }: { scrollTo?: string }) {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTo]);

  return (
    <div>
      {/* 1. Dropdown Menu */}
      <Section
        id="dropdown-menu"
        title="Dropdown Menu"
        description="Menus desplegables con items, iconos, submenus, checkboxes y seleccion unica. Soporta acciones destructivas con estilo diferenciado."
      >
        {/* 3-mode grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <DropdownMiniLight />
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <DropdownMiniGradient />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-forest rounded-nxt-xl p-4 h-full">
              <DropdownMiniDark />
            </div>
          </div>
        </div>
        {/* Full interactive demo */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Demo interactiva</h3>
          <p className="text-xs text-nxt-400 mb-4">Haz clic en los botones para abrir los dropdowns con todas las variantes.</p>
        </div>
        <DropdownDemo />
      </Section>

      {/* 2. Command Palette */}
      <Section
        id="command-palette"
        title="Command Palette"
        description="Paleta de comandos con busqueda, categorias, atajos de teclado y navegacion con flechas. Abre el modal para explorar."
      >
        {/* 3-mode grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <CmdPaletteMiniLight />
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <CmdPaletteMiniGradient />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-forest rounded-nxt-xl p-4 h-full">
              <CmdPaletteMiniDark />
            </div>
          </div>
        </div>
        {/* Full interactive demo */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Demo interactiva</h3>
          <p className="text-xs text-nxt-400 mb-4">Haz clic en el buscador para abrir la paleta de comandos completa.</p>
        </div>
        <CommandPaletteDemo />
      </Section>

      {/* 3. Stepper / Wizard */}
      <Section
        id="stepper"
        title="Stepper / Wizard"
        description="Indicadores de progreso paso a paso en variantes horizontal y vertical. Navega entre pasos y haz clic en completados para retroceder."
      >
        {/* 3-mode grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <StepperMiniLight />
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <StepperMiniGradient />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-forest rounded-nxt-xl p-4 h-full">
              <StepperMiniDark />
            </div>
          </div>
        </div>
        {/* Full interactive demo */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Demo interactiva</h3>
          <p className="text-xs text-nxt-400 mb-4">Navega entre pasos con los botones. Haz clic en pasos completados para retroceder.</p>
        </div>
        <StepperDemo />
      </Section>

      {/* 4. Accordion */}
      <Section
        id="accordion"
        title="Accordion"
        description="Paneles expandibles con transicion suave. Disponible en expansion unica, multiple y con niveles anidados."
      >
        {/* 3-mode grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <AccordionMiniLight />
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <AccordionMiniGradient />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-forest rounded-nxt-xl p-4 h-full">
              <AccordionMiniDark />
            </div>
          </div>
        </div>
        {/* Full interactive demo */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Demo interactiva</h3>
          <p className="text-xs text-nxt-400 mb-4">Haz clic en los paneles para expandir y colapsar. El primer grupo es single-expand, el segundo es multi-expand con anidados.</p>
        </div>
        <AccordionDemo />
      </Section>

      {/* 5. Timeline */}
      <Section
        id="timeline"
        title="Timeline"
        description="Linea temporal de eventos con dots de color por tipo, layout izquierdo o alternado, y capacidad de agregar eventos dinamicamente."
      >
        {/* 3-mode grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <TimelineMiniLight />
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <TimelineMiniGradient />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-forest rounded-nxt-xl p-4 h-full">
              <TimelineMiniDark />
            </div>
          </div>
        </div>
        {/* Full interactive demo */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Demo interactiva</h3>
          <p className="text-xs text-nxt-400 mb-4">Agrega eventos, filtra por tipo y alterna entre layout izquierdo y alternado.</p>
        </div>
        <TimelineDemo />
      </Section>

      {/* 6. Code Block */}
      <Section
        id="code-block"
        title="Code Block"
        description="Bloque de codigo con resaltado de sintaxis, multiples lenguajes, numeros de linea y boton de copiar. Tema oscuro estilo VS Code."
      >
        {/* 3-mode grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <CodeBlockMiniLight />
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <CodeBlockMiniGradient />
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-forest rounded-nxt-xl p-4 h-full">
              <CodeBlockMiniDark />
            </div>
          </div>
        </div>
        {/* Full interactive demo */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Demo interactiva</h3>
          <p className="text-xs text-nxt-400 mb-4">Cambia de pestana, activa/desactiva numeros de linea y copia el codigo al portapapeles.</p>
        </div>
        <CodeBlockDemo />
      </Section>
    </div>
  );
}
