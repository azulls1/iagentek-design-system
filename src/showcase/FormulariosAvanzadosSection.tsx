import { useState, useEffect, useRef } from "react";
import {
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Minus,
  Sun,
  Moon,
  Bell,
  Shield,
  Wifi,
  Zap,
  Globe,
  Tag,
} from "lucide-react";
import { ColorEditable } from "../components/ColorEditable";

/* ================================================================== */
/*  SectionHeader                                                      */
/* ================================================================== */

function SectionHeader({
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

/* ================================================================== */
/*  Toggle / Switch Component                                          */
/* ================================================================== */

function ToggleSwitch({
  checked,
  onChange,
  size = "md",
  disabled = false,
  color = "primary",
  showIcon = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  color?: "primary" | "success" | "error";
  showIcon?: boolean;
}) {
  const sizes = {
    sm: { track: "w-8 h-[18px]", thumb: "w-3.5 h-3.5", translate: "translate-x-[14px]", icon: "w-2 h-2" },
    md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5", icon: "w-3 h-3" },
    lg: { track: "w-14 h-8", thumb: "w-6.5 h-6.5", translate: "translate-x-6", icon: "w-3.5 h-3.5" },
  };

  const colors = {
    primary: "bg-forest",
    success: "bg-success",
    error: "bg-error",
  };

  const s = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex items-center rounded-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none
        ${s.track}
        ${checked ? colors[color] : "bg-nxt-300"}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`
          inline-flex items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200
          ${s.thumb}
          ${checked ? s.translate : "translate-x-0.5"}
        `}
      >
        {showIcon && (
          checked
            ? <Check className={`${s.icon} text-success`} />
            : <X className={`${s.icon} text-nxt-400`} />
        )}
      </span>
    </button>
  );
}

/* ================================================================== */
/*  Toggle Section Demo                                                */
/* ================================================================== */

function ToggleSwitchDemo() {
  const [basicToggle, setBasicToggle] = useState(true);
  const [smToggle, setSmToggle] = useState(false);
  const [mdToggle, setMdToggle] = useState(true);
  const [lgToggle, setLgToggle] = useState(false);
  const [iconToggle, setIconToggle] = useState(true);
  const [successToggle, setSuccessToggle] = useState(true);
  const [errorToggle, setErrorToggle] = useState(false);

  // Gradient toggles
  const [gradBasic, setGradBasic] = useState(true);
  const [gradSm, setGradSm] = useState(false);
  const [gradMd, setGradMd] = useState(true);
  const [gradLg, setGradLg] = useState(false);
  const [gradIcon, setGradIcon] = useState(true);

  // Settings panel
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    security: true,
    wifi: true,
    performance: false,
    language: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsConfig = [
    { key: "notifications" as const, label: "Notificaciones", desc: "Recibir alertas del sistema", icon: Bell },
    { key: "darkMode" as const, label: "Modo oscuro", desc: "Interfaz con tema oscuro", icon: Moon },
    { key: "security" as const, label: "2FA Seguridad", desc: "Autenticacion de dos factores", icon: Shield },
    { key: "wifi" as const, label: "Sincronizacion", desc: "Sincronizar datos automaticamente", icon: Wifi },
    { key: "performance" as const, label: "Alto rendimiento", desc: "Optimizar para velocidad", icon: Zap },
    { key: "language" as const, label: "Multi-idioma", desc: "Deteccion automatica de idioma", icon: Globe },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Light */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
        <div className="nxt-card p-4 h-full space-y-6">
          {/* Basic */}
          <div>
            <p className="text-sm font-medium text-nxt-700 mb-3">Toggle basico</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-nxt-600">Activar modulo</span>
              <ColorEditable elementKey="formularios-avz.toggle-primary" defaultBg="#04202C">
                {(_styles, openPicker, currentHex) => (
                  <div className="relative flex flex-col items-center gap-1">
                    <div onClick={openPicker} className="cursor-pointer">
                      <ToggleSwitch checked={basicToggle} onChange={setBasicToggle} />
                    </div>
                    <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                  </div>
                )}
              </ColorEditable>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${basicToggle ? "bg-success/10 text-success" : "bg-nxt-100 text-nxt-500"}`}>
                {basicToggle ? "ON" : "OFF"}
              </span>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <p className="text-sm font-medium text-nxt-700 mb-3">Tamanos</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-nxt-500">SM</span>
                <ToggleSwitch checked={smToggle} onChange={setSmToggle} size="sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-nxt-500">MD</span>
                <ToggleSwitch checked={mdToggle} onChange={setMdToggle} size="md" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-nxt-500">LG</span>
                <ToggleSwitch checked={lgToggle} onChange={setLgToggle} size="lg" />
              </div>
            </div>
          </div>

          {/* With icon */}
          <div>
            <p className="text-sm font-medium text-nxt-700 mb-3">Con icono interno</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-nxt-600">Verificacion activa</span>
              <ToggleSwitch checked={iconToggle} onChange={setIconToggle} showIcon />
            </div>
          </div>

          {/* Color variants */}
          <div>
            <p className="text-sm font-medium text-nxt-700 mb-3">Variantes de color</p>
            <div className="flex items-center gap-6">
              <ColorEditable elementKey="formularios-avz.toggle-l-primary" defaultBg="#04202C">
                {(_styles, openPicker, currentHex) => (
                  <div className="relative flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-nxt-500">Primary</span>
                      <div onClick={openPicker} className="cursor-pointer">
                        <ToggleSwitch checked={true} onChange={() => {}} color="primary" />
                      </div>
                    </div>
                    <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                  </div>
                )}
              </ColorEditable>
              <ColorEditable elementKey="formularios-avz.toggle-l-success" defaultBg="#059669">
                {(_styles, openPicker, currentHex) => (
                  <div className="relative flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-nxt-500">Success</span>
                      <div onClick={openPicker} className="cursor-pointer">
                        <ToggleSwitch checked={successToggle} onChange={setSuccessToggle} color="success" />
                      </div>
                    </div>
                    <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                  </div>
                )}
              </ColorEditable>
              <ColorEditable elementKey="formularios-avz.toggle-l-error" defaultBg="#DC2626">
                {(_styles, openPicker, currentHex) => (
                  <div className="relative flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-nxt-500">Error</span>
                      <div onClick={openPicker} className="cursor-pointer">
                        <ToggleSwitch checked={errorToggle} onChange={setErrorToggle} color="error" />
                      </div>
                    </div>
                    <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                  </div>
                )}
              </ColorEditable>
            </div>
          </div>

          {/* Disabled */}
          <div>
            <p className="text-sm font-medium text-nxt-700 mb-3">Deshabilitado</p>
            <div className="flex items-center gap-4">
              <ToggleSwitch checked={true} onChange={() => {}} disabled />
              <ToggleSwitch checked={false} onChange={() => {}} disabled />
              <span className="text-xs text-nxt-400">No interactivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gradiente */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
        <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 space-y-6">
            {/* Basic */}
            <div>
              <p className="text-sm font-medium text-white mb-3">Toggle basico</p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/80">Activar modulo</span>
                <ToggleSwitch checked={gradBasic} onChange={setGradBasic} />
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${gradBasic ? "bg-white/20 text-white" : "bg-white/10 text-white/60"}`}>
                  {gradBasic ? "ON" : "OFF"}
                </span>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="text-sm font-medium text-white mb-3">Tamanos</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60">SM</span>
                  <ToggleSwitch checked={gradSm} onChange={setGradSm} size="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60">MD</span>
                  <ToggleSwitch checked={gradMd} onChange={setGradMd} size="md" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60">LG</span>
                  <ToggleSwitch checked={gradLg} onChange={setGradLg} size="lg" />
                </div>
              </div>
            </div>

            {/* With icon */}
            <div>
              <p className="text-sm font-medium text-white mb-3">Con icono interno</p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/80">Verificacion activa</span>
                <ToggleSwitch checked={gradIcon} onChange={setGradIcon} showIcon />
              </div>
            </div>

            {/* Disabled */}
            <div>
              <p className="text-sm font-medium text-white mb-3">Deshabilitado</p>
              <div className="flex items-center gap-4">
                <ToggleSwitch checked={true} onChange={() => {}} disabled />
                <ToggleSwitch checked={false} onChange={() => {}} disabled />
                <span className="text-xs text-white/50">No interactivo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark - Settings Panel */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
        <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-4 h-4 text-forest" />
            <h3 className="text-sm font-semibold text-white">Preferencias</h3>
          </div>
          <div className="divide-y divide-nxt-700">
            {settingsConfig.map(({ key, label, desc, icon: Icon }) => (
              <div
                key={key}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <ColorEditable elementKey={`formularios-avz.toggle-d-icon-${key}`} defaultBg={settings[key] ? "#04202C" : "#304040"}>
                    {(styles, openPicker, _currentHex) => (
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${settings[key] ? "bg-forest/20" : "bg-nxt-700"}`}
                        style={styles}
                        onClick={openPicker}
                      >
                        <Icon className={`w-4 h-4 ${settings[key] ? "text-forest" : "text-nxt-400"}`} />
                      </div>
                    )}
                  </ColorEditable>
                  <div>
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-nxt-400">{desc}</p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings[key]}
                  onChange={() => toggleSetting(key)}
                  color={key === "security" ? "success" : key === "darkMode" ? "primary" : "primary"}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-nxt-700">
            <p className="text-xs text-nxt-400">
              {Object.values(settings).filter(Boolean).length} de {Object.keys(settings).length} activos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Checkbox & Radio Component                                         */
/* ================================================================== */

function StyledCheckbox({
  checked,
  indeterminate = false,
  onChange,
  size = "md",
  disabled = false,
  label,
  description,
  dark = false,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
  description?: string;
  dark?: boolean;
}) {
  const sizes = {
    sm: { box: "w-4 h-4", icon: "w-2.5 h-2.5", text: "text-xs" },
    md: { box: "w-5 h-5", icon: "w-3 h-3", text: "text-sm" },
    lg: { box: "w-6 h-6", icon: "w-3.5 h-3.5", text: "text-base" },
  };
  const s = sizes[size];

  return (
    <label className={`inline-flex items-start gap-2.5 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} group`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          ${s.box} rounded flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200
          focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none
          ${(checked || indeterminate)
            ? "bg-forest border-forest"
            : dark
              ? "border-nxt-500 bg-nxt-700 group-hover:border-forest/60"
              : "border-nxt-300 bg-white group-hover:border-forest/60"
          }
        `}
      >
        {checked && (
          <Check className={`${s.icon} text-nxt-800`} style={{ animation: "checkIn 0.15s ease-out" }} />
        )}
        {indeterminate && !checked && (
          <Minus className={`${s.icon} text-nxt-800`} />
        )}
      </button>
      {(label || description) && (
        <div className="pt-0.5">
          {label && <span className={`${s.text} font-medium ${dark ? "text-white" : "text-nxt-700"}`}>{label}</span>}
          {description && <p className={`text-xs mt-0.5 ${dark ? "text-nxt-400" : "text-nxt-500"}`}>{description}</p>}
        </div>
      )}
    </label>
  );
}

function StyledRadio({
  selected,
  onChange,
  size = "md",
  disabled = false,
  label,
  description,
  dark = false,
}: {
  selected: boolean;
  onChange: () => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  label?: string;
  description?: string;
  dark?: boolean;
}) {
  const sizes = {
    sm: { box: "w-4 h-4", dot: "w-1.5 h-1.5", text: "text-xs" },
    md: { box: "w-5 h-5", dot: "w-2 h-2", text: "text-sm" },
    lg: { box: "w-6 h-6", dot: "w-2.5 h-2.5", text: "text-base" },
  };
  const s = sizes[size];

  return (
    <label className={`inline-flex items-start gap-2.5 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} group`}>
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        disabled={disabled}
        onClick={() => !disabled && onChange()}
        className={`
          ${s.box} rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200
          focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none
          ${selected
            ? "border-forest bg-white"
            : dark
              ? "border-nxt-500 bg-nxt-700 group-hover:border-forest/60"
              : "border-nxt-300 bg-white group-hover:border-forest/60"
          }
        `}
      >
        {selected && (
          <span
            className={`${s.dot} rounded-full bg-forest`}
            style={{ animation: "radioFill 0.15s ease-out" }}
          />
        )}
      </button>
      {(label || description) && (
        <div className="pt-0.5">
          {label && <span className={`${s.text} font-medium ${dark ? "text-white" : "text-nxt-700"}`}>{label}</span>}
          {description && <p className={`text-xs mt-0.5 ${dark ? "text-nxt-400" : "text-nxt-500"}`}>{description}</p>}
        </div>
      )}
    </label>
  );
}

function CheckboxRadioDemo() {
  // Checkbox group
  const allItems = ["Monitoreo en tiempo real", "Alertas por correo", "Reportes semanales", "Dashboard ejecutivo"];
  const [checkedItems, setCheckedItems] = useState<string[]>(["Monitoreo en tiempo real", "Alertas por correo"]);

  const allChecked = checkedItems.length === allItems.length;
  const someChecked = checkedItems.length > 0 && !allChecked;

  const toggleItem = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleAll = () => {
    if (allChecked) setCheckedItems([]);
    else setCheckedItems([...allItems]);
  };

  // Gradient checkbox group
  const gradItems = ["Monitoreo", "Alertas", "Reportes"];
  const [gradCheckedItems, setGradCheckedItems] = useState<string[]>(["Monitoreo"]);
  const toggleGradItem = (item: string) => {
    setGradCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Gradient radio
  const [gradRadio, setGradRadio] = useState("opcion1");

  // Radio group
  const [selectedPlan, setSelectedPlan] = useState("profesional");
  const plans = [
    { value: "basico", label: "Basico", desc: "Hasta 10 sitios monitoreados" },
    { value: "profesional", label: "Profesional", desc: "Hasta 100 sitios con alertas avanzadas" },
    { value: "empresarial", label: "Empresarial", desc: "Sitios ilimitados con soporte premium" },
  ];

  // Horizontal radio
  const [selectedFreq, setSelectedFreq] = useState("mensual");

  // Checkbox sizes
  const [sizeChecks, setSizeChecks] = useState({ sm: true, md: false, lg: true });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Light */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
        <div className="nxt-card p-4 h-full space-y-6">
          {/* Checkbox Sizes */}
          <div>
            <p className="text-sm font-medium text-nxt-700 mb-3">Tamanos de checkbox</p>
            <div className="flex items-center gap-6">
              <StyledCheckbox checked={sizeChecks.sm} onChange={(v) => setSizeChecks((p) => ({ ...p, sm: v }))} size="sm" label="Pequeno" />
              <StyledCheckbox checked={sizeChecks.md} onChange={(v) => setSizeChecks((p) => ({ ...p, md: v }))} size="md" label="Mediano" />
              <StyledCheckbox checked={sizeChecks.lg} onChange={(v) => setSizeChecks((p) => ({ ...p, lg: v }))} size="lg" label="Grande" />
            </div>
          </div>

          {/* Checkbox Group with Select All */}
          <div>
            <p className="text-sm font-medium text-nxt-700 mb-3">Grupo con "Seleccionar todo"</p>
            <div className="border border-nxt-200 rounded-lg divide-y divide-nxt-100">
              <div className="px-4 py-3 bg-nxt-50 rounded-t-lg">
                <StyledCheckbox
                  checked={allChecked}
                  indeterminate={someChecked}
                  onChange={toggleAll}
                  label="Seleccionar todo"
                />
              </div>
              {allItems.map((item) => (
                <div key={item} className="px-4 py-3">
                  <StyledCheckbox
                    checked={checkedItems.includes(item)}
                    onChange={() => toggleItem(item)}
                    label={item}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-nxt-400 mt-2">{checkedItems.length} de {allItems.length} seleccionados</p>
          </div>

          {/* Disabled checkbox */}
          <div>
            <p className="text-sm font-medium text-nxt-700 mb-3">Deshabilitado</p>
            <div className="flex items-center gap-6">
              <StyledCheckbox checked={true} onChange={() => {}} disabled label="Activo (bloqueado)" />
              <StyledCheckbox checked={false} onChange={() => {}} disabled label="Inactivo (bloqueado)" />
            </div>
          </div>

          {/* Radio Horizontal */}
          <div>
            <p className="text-sm font-medium text-nxt-700 mb-3">Radio horizontal</p>
            <div className="flex items-center gap-6">
              {["diario", "semanal", "mensual"].map((freq) => (
                <StyledRadio
                  key={freq}
                  selected={selectedFreq === freq}
                  onChange={() => setSelectedFreq(freq)}
                  label={freq.charAt(0).toUpperCase() + freq.slice(1)}
                />
              ))}
            </div>
            <p className="text-xs text-nxt-400 mt-2">Frecuencia seleccionada: <span className="text-forest font-medium">{selectedFreq}</span></p>
          </div>
        </div>
      </div>

      {/* Gradiente */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
        <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 space-y-6">
            {/* Checkboxes */}
            <div>
              <p className="text-sm font-medium text-white mb-3">Checkboxes</p>
              <div className="space-y-2">
                {gradItems.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <StyledCheckbox
                      checked={gradCheckedItems.includes(item)}
                      onChange={() => toggleGradItem(item)}
                      label={item}
                      dark
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/50 mt-2">{gradCheckedItems.length} de {gradItems.length} seleccionados</p>
            </div>

            {/* Radios */}
            <div>
              <p className="text-sm font-medium text-white mb-3">Radios</p>
              <div className="space-y-2">
                {["opcion1", "opcion2", "opcion3"].map((opt, i) => (
                  <StyledRadio
                    key={opt}
                    selected={gradRadio === opt}
                    onChange={() => setGradRadio(opt)}
                    label={`Opcion ${i + 1}`}
                    dark
                  />
                ))}
              </div>
              <p className="text-xs text-white/50 mt-2">Seleccionado: <span className="text-forest font-medium">{gradRadio}</span></p>
            </div>

            {/* Disabled */}
            <div>
              <p className="text-sm font-medium text-white mb-3">Deshabilitados</p>
              <div className="flex items-center gap-6">
                <StyledCheckbox checked={true} onChange={() => {}} disabled label="Check" dark />
                <StyledRadio selected={true} onChange={() => {}} disabled label="Radio" dark />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
        <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full space-y-6">
          {/* Radio Group Vertical with descriptions */}
          <div>
            <p className="text-sm font-medium text-white mb-3">Plan de servicio</p>
            <div className="space-y-1">
              {plans.map(({ value, label, desc }) => (
                <ColorEditable key={value} elementKey={`formularios-avz.radio-d-plan-${value}`} defaultBg={selectedPlan === value ? "#04202C" : undefined}>
                  {(_styles, _openPicker, _currentHex) => (
                    <div
                      onClick={() => setSelectedPlan(value)}
                      className={`
                        p-3 rounded-lg border cursor-pointer transition-all duration-200
                        ${selectedPlan === value
                          ? "border-forest bg-forest/10"
                          : "border-nxt-700 hover:border-nxt-600"
                        }
                      `}
                    >
                      <StyledRadio
                        selected={selectedPlan === value}
                        onChange={() => setSelectedPlan(value)}
                        label={label}
                        description={desc}
                        dark
                      />
                    </div>
                  )}
                </ColorEditable>
              ))}
            </div>
            <p className="text-xs text-nxt-400 mt-2">
              Plan seleccionado: <span className="text-forest font-medium">{plans.find((p) => p.value === selectedPlan)?.label}</span>
            </p>
          </div>

          {/* Disabled radios */}
          <div>
            <p className="text-sm font-medium text-white mb-3">Radios deshabilitados</p>
            <div className="flex items-center gap-6">
              <StyledRadio selected={true} onChange={() => {}} disabled label="Seleccionado" dark />
              <StyledRadio selected={false} onChange={() => {}} disabled label="No seleccionado" dark />
            </div>
          </div>

          {/* Radio sizes */}
          <div>
            <p className="text-sm font-medium text-white mb-3">Tamanos de radio</p>
            <div className="flex items-center gap-6">
              <StyledRadio selected={true} onChange={() => {}} size="sm" label="SM" dark />
              <StyledRadio selected={true} onChange={() => {}} size="md" label="MD" dark />
              <StyledRadio selected={true} onChange={() => {}} size="lg" label="LG" dark />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Slider / Range Component                                           */
/* ================================================================== */

function SliderDemo() {
  const [singleValue, setSingleValue] = useState(65);
  const [rangeMin, setRangeMin] = useState(25);
  const [rangeMax, setRangeMax] = useState(75);
  const [inputValue, setInputValue] = useState(50);
  const [verticalValue, setVerticalValue] = useState(40);
  const [successValue, setSuccessValue] = useState(80);
  const [warningValue, setWarningValue] = useState(45);
  const [errorValue, setErrorValue] = useState(30);

  // Gradient sliders
  const [gradSlider, setGradSlider] = useState(55);
  const [gradRange1, setGradRange1] = useState(20);
  const [gradRange2, setGradRange2] = useState(70);

  const rangeTrackRef = useRef<HTMLDivElement>(null);

  // Ensure min < max for range
  const handleRangeMin = (v: number) => {
    if (v < rangeMax - 5) setRangeMin(v);
  };
  const handleRangeMax = (v: number) => {
    if (v > rangeMin + 5) setRangeMax(v);
  };

  const handleGradRange1 = (v: number) => {
    if (v < gradRange2 - 5) setGradRange1(v);
  };
  const handleGradRange2 = (v: number) => {
    if (v > gradRange1 + 5) setGradRange2(v);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      setInputValue(val);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Light */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
        <div className="nxt-card p-4 h-full space-y-8">
          {/* Single slider with label */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-nxt-700">Brillo del panel</p>
              <span className="text-sm font-semibold text-forest">{singleValue}%</span>
            </div>
            <ColorEditable elementKey="formularios-avz.slider-track" defaultBg="#04202C">
              {(_styles, openPicker, currentHex) => (
                <div>
                  <div className="relative">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={singleValue}
                      onChange={(e) => setSingleValue(parseInt(e.target.value))}
                      className="w-full h-2 bg-nxt-200 rounded-full appearance-none cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                        [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-150
                        [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-95
                        [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-forest
                        [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
                        [&::-moz-range-thumb]:border-none"
                      style={{
                        background: `linear-gradient(to right, ${currentHex || "#04202C"} 0%, ${currentHex || "#04202C"} ${singleValue}%, #e2e8f0 ${singleValue}%, #e2e8f0 100%)`,
                      }}
                    />
                    {/* Floating label */}
                    <div
                      className="absolute -top-8 transform -translate-x-1/2 bg-nxt-800 text-white text-xs font-medium px-2 py-1 rounded shadow-lg pointer-events-none"
                      style={{ left: `${singleValue}%` }}
                    >
                      {singleValue}
                    </div>
                  </div>
                  {/* Tick marks */}
                  <div className="flex justify-between mt-1 px-0.5">
                    {[0, 25, 50, 75, 100].map((tick) => (
                      <div key={tick} className="flex flex-col items-center">
                        <div className="w-px h-2 bg-nxt-300" />
                        <span className="text-[10px] text-nxt-400 mt-0.5">{tick}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-1">
                    <button onClick={openPicker} className="text-[8px] font-mono text-nxt-400 hover:text-forest cursor-pointer">{currentHex}</button>
                  </div>
                </div>
              )}
            </ColorEditable>
          </div>

          {/* Range slider (min/max) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-nxt-700">Rango de potencia (kW)</p>
              <span className="text-sm font-semibold text-nxt-600">{rangeMin} - {rangeMax}</span>
            </div>
            <div className="relative h-2" ref={rangeTrackRef}>
              {/* Track background */}
              <div className="absolute inset-0 bg-nxt-200 rounded-full" />
              {/* Active range */}
              <div
                className="absolute h-full bg-forest rounded-full"
                style={{ left: `${rangeMin}%`, width: `${rangeMax - rangeMin}%` }}
              />
              {/* Min thumb */}
              <input
                type="range"
                min={0}
                max={100}
                value={rangeMin}
                onChange={(e) => handleRangeMin(parseInt(e.target.value))}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer pointer-events-none
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-forest
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-forest [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-solid"
              />
              {/* Max thumb */}
              <input
                type="range"
                min={0}
                max={100}
                value={rangeMax}
                onChange={(e) => handleRangeMax(parseInt(e.target.value))}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer pointer-events-none
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-forest
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:pointer-events-auto
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-forest [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-solid"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-forest font-medium">{rangeMin} kW</span>
              <span className="text-xs text-forest font-medium">{rangeMax} kW</span>
            </div>
          </div>

          {/* Slider + input field */}
          <div>
            <p className="text-sm font-medium text-nxt-700 mb-2">Con campo numerico</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={100}
                value={inputValue}
                onChange={(e) => setInputValue(parseInt(e.target.value))}
                className="flex-1 h-2 bg-nxt-200 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-forest
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:border-none"
                style={{
                  background: `linear-gradient(to right, #04202C 0%, #04202C ${inputValue}%, #e2e8f0 ${inputValue}%, #e2e8f0 100%)`,
                }}
              />
              <input
                type="number"
                min={0}
                max={100}
                value={inputValue}
                onChange={handleInputChange}
                className="w-16 nxt-input text-center text-sm font-medium"
              />
            </div>
          </div>

          {/* Color variants */}
          <div>
            <p className="text-sm font-medium text-nxt-700 mb-3">Variantes de color</p>
            <div className="space-y-4">
              {[
                { label: "Success", value: successValue, set: setSuccessValue, color: "#16a34a", trackColor: "#dcfce7", key: "slider-l-success" },
                { label: "Warning", value: warningValue, set: setWarningValue, color: "#ca8a04", trackColor: "#fef9c3", key: "slider-l-warning" },
                { label: "Error", value: errorValue, set: setErrorValue, color: "#dc2626", trackColor: "#fee2e2", key: "slider-l-error" },
              ].map(({ label, value, set, color, trackColor, key }) => (
                <ColorEditable key={key} elementKey={`formularios-avz.${key}`} defaultBg={color}>
                  {(_styles, openPicker, currentHex) => (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-nxt-500">{label}</span>
                        <button onClick={openPicker} className="text-xs font-medium cursor-pointer hover:underline" style={{ color: currentHex || color }}>{value}%</button>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(e) => set(parseInt(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
                          [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
                        style={{
                          background: `linear-gradient(to right, ${currentHex || color} 0%, ${currentHex || color} ${value}%, ${trackColor} ${value}%, ${trackColor} 100%)`,
                        }}
                      />
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gradiente */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
        <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 space-y-8">
            {/* Single slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-white">Intensidad de senal</p>
                <span className="text-sm font-semibold text-forest">{gradSlider}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={gradSlider}
                onChange={(e) => setGradSlider(parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-forest
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:border-none"
                style={{
                  background: `linear-gradient(to right, #04202C 0%, #04202C ${gradSlider}%, rgba(255,255,255,0.15) ${gradSlider}%, rgba(255,255,255,0.15) 100%)`,
                }}
              />
              <div className="flex justify-between mt-1 px-0.5">
                {[0, 25, 50, 75, 100].map((tick) => (
                  <span key={tick} className="text-[10px] text-white/50">{tick}</span>
                ))}
              </div>
            </div>

            {/* Range slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-white">Rango de operacion</p>
                <span className="text-sm font-semibold text-white/80">{gradRange1} - {gradRange2}</span>
              </div>
              <div className="relative h-2">
                <div className="absolute inset-0 bg-white/15 rounded-full" />
                <div
                  className="absolute h-full bg-forest rounded-full"
                  style={{ left: `${gradRange1}%`, width: `${gradRange2 - gradRange1}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={gradRange1}
                  onChange={(e) => handleGradRange1(parseInt(e.target.value))}
                  className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer pointer-events-none
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10
                    [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-forest
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:border-none"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={gradRange2}
                  onChange={(e) => handleGradRange2(parseInt(e.target.value))}
                  className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer pointer-events-none
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10
                    [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-forest
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:border-none"
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-forest font-medium">{gradRange1}</span>
                <span className="text-xs text-forest font-medium">{gradRange2}</span>
              </div>
            </div>

            {/* Vertical visual bars */}
            <div>
              <p className="text-sm font-medium text-white mb-3">Niveles visuales</p>
              <div className="flex items-end gap-4 h-24">
                {[
                  { label: "CPU", pct: gradSlider, color: "bg-forest" },
                  { label: "RAM", pct: gradRange1, color: "bg-success" },
                  { label: "Disk", pct: gradRange2, color: "bg-info" },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="flex flex-col items-center h-full flex-1">
                    <span className="text-xs text-white/60 mb-1">{label}</span>
                    <div className="relative flex-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`absolute bottom-0 w-full ${color} rounded-full transition-all duration-300`}
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/80 font-medium mt-1">{pct}%</span>
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
        <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full space-y-8">
          {/* Single slider dark */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white">Voltaje de salida</p>
              <span className="text-sm font-semibold text-forest">{singleValue}V</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={singleValue}
              onChange={(e) => setSingleValue(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-forest
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
                [&::-moz-range-thumb]:border-none"
              style={{
                background: `linear-gradient(to right, #04202C 0%, #04202C ${singleValue}%, #304040 ${singleValue}%, #304040 100%)`,
              }}
            />
            <div className="flex justify-between mt-1 px-0.5">
              {[0, 25, 50, 75, 100].map((tick) => (
                <span key={tick} className="text-[10px] text-nxt-500">{tick}V</span>
              ))}
            </div>
          </div>

          {/* Range dark */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white">Rango de frecuencia (Hz)</p>
              <span className="text-sm font-semibold text-nxt-300">{rangeMin} - {rangeMax}</span>
            </div>
            <div className="relative h-2">
              <div className="absolute inset-0 bg-nxt-700 rounded-full" />
              <div
                className="absolute h-full bg-forest rounded-full"
                style={{ left: `${rangeMin}%`, width: `${rangeMax - rangeMin}%` }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={rangeMin}
                onChange={(e) => handleRangeMin(parseInt(e.target.value))}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer pointer-events-none
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-forest
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:border-none"
              />
              <input
                type="range"
                min={0}
                max={100}
                value={rangeMax}
                onChange={(e) => handleRangeMax(parseInt(e.target.value))}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer pointer-events-none
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-forest
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:border-none"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-forest font-medium">{rangeMin} Hz</span>
              <span className="text-xs text-forest font-medium">{rangeMax} Hz</span>
            </div>
          </div>

          {/* Vertical slider */}
          <div>
            <p className="text-sm font-medium text-white mb-3">Slider vertical</p>
            <div className="flex items-end gap-6 h-40">
              <div className="flex flex-col items-center h-full">
                <span className="text-xs text-nxt-400 mb-2">Vol.</span>
                <div className="relative flex-1 w-2 bg-nxt-700 rounded-full overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full bg-forest rounded-full transition-all duration-100"
                    style={{ height: `${verticalValue}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={verticalValue}
                  onChange={(e) => setVerticalValue(parseInt(e.target.value))}
                  className="absolute opacity-0 cursor-pointer"
                  style={{ writingMode: "vertical-lr", direction: "rtl", height: "128px", width: "32px" }}
                />
                <span className="text-xs text-forest font-medium mt-2">{verticalValue}%</span>
              </div>
              <div className="flex flex-col items-center h-full">
                <span className="text-xs text-nxt-400 mb-2">Bass</span>
                <div className="relative flex-1 w-2 bg-nxt-700 rounded-full overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full bg-success rounded-full transition-all duration-100"
                    style={{ height: `${successValue}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={successValue}
                  onChange={(e) => setSuccessValue(parseInt(e.target.value))}
                  className="absolute opacity-0 cursor-pointer"
                  style={{ writingMode: "vertical-lr", direction: "rtl", height: "128px", width: "32px" }}
                />
                <span className="text-xs text-success font-medium mt-2">{successValue}%</span>
              </div>
              <div className="flex flex-col items-center h-full">
                <span className="text-xs text-nxt-400 mb-2">Treble</span>
                <div className="relative flex-1 w-2 bg-nxt-700 rounded-full overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full bg-info rounded-full transition-all duration-100"
                    style={{ height: `${warningValue}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={warningValue}
                  onChange={(e) => setWarningValue(parseInt(e.target.value))}
                  className="absolute opacity-0 cursor-pointer"
                  style={{ writingMode: "vertical-lr", direction: "rtl", height: "128px", width: "32px" }}
                />
                <span className="text-xs text-info font-medium mt-2">{warningValue}%</span>
              </div>
            </div>
          </div>

          {/* Dark slider with input */}
          <div>
            <p className="text-sm font-medium text-white mb-2">Con campo numerico</p>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={100}
                value={inputValue}
                onChange={(e) => setInputValue(parseInt(e.target.value))}
                className="flex-1 h-2 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-forest
                  [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:border-none"
                style={{
                  background: `linear-gradient(to right, #04202C 0%, #04202C ${inputValue}%, #304040 ${inputValue}%, #304040 100%)`,
                }}
              />
              <input
                type="number"
                min={0}
                max={100}
                value={inputValue}
                onChange={handleInputChange}
                className="w-16 rounded-lg border border-nxt-600 bg-nxt-700 px-2 py-1.5 text-center text-sm font-medium text-white outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Tag Input Component                                                */
/* ================================================================== */

const TAG_COLORS = [
  "bg-forest/15 text-forest border-forest/30",
  "bg-success/15 text-success border-success/30",
  "bg-info/15 text-info border-info/30",
  "bg-error/15 text-error border-error/30",
  "bg-warning/15 text-warning border-warning/30",
  "bg-purple-100 text-purple-700 border-purple-300",
  "bg-pink-100 text-pink-700 border-pink-300",
  "bg-cyan-100 text-cyan-700 border-cyan-300",
];

const TAG_COLORS_GRAD = [
  "bg-white/20 text-white border-white/30",
  "bg-green-400/20 text-green-300 border-green-400/30",
  "bg-blue-400/20 text-blue-300 border-blue-400/30",
  "bg-red-400/20 text-red-300 border-red-400/30",
  "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
  "bg-purple-400/20 text-purple-300 border-purple-400/30",
  "bg-pink-400/20 text-pink-300 border-pink-400/30",
  "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
];

const TAG_COLORS_DARK = [
  "bg-forest/20 text-forest border-forest/30",
  "bg-green-900/40 text-green-400 border-green-700/50",
  "bg-blue-900/40 text-blue-400 border-blue-700/50",
  "bg-red-900/40 text-red-400 border-red-700/50",
  "bg-yellow-900/40 text-yellow-400 border-yellow-700/50",
  "bg-purple-900/40 text-purple-400 border-purple-700/50",
  "bg-pink-900/40 text-pink-400 border-pink-700/50",
  "bg-cyan-900/40 text-cyan-400 border-cyan-700/50",
];

const AUTOCOMPLETE_OPTIONS = [
  "React", "TypeScript", "Tailwind CSS", "Node.js", "Python", "Docker",
  "PostgreSQL", "Redis", "GraphQL", "REST API", "Kubernetes", "AWS",
  "Supabase", "Next.js", "Vite", "Prisma", "MongoDB", "Firebase",
];

const MAX_TAGS = 8;

function TagInputDemo() {
  // Light mode state
  const [tags, setTags] = useState<string[]>(["React", "TypeScript", "Tailwind CSS"]);
  const [tagInput, setTagInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Gradient mode state
  const [gradTags, setGradTags] = useState<string[]>(["Vite", "Node.js"]);
  const [gradTagInput, setGradTagInput] = useState("");
  const [showGradSuggestions, setShowGradSuggestions] = useState(false);
  const gradInputRef = useRef<HTMLInputElement>(null);

  // Dark mode state
  const [darkTags, setDarkTags] = useState<string[]>(["Docker", "PostgreSQL"]);
  const [darkTagInput, setDarkTagInput] = useState("");
  const [showDarkSuggestions, setShowDarkSuggestions] = useState(false);
  const darkInputRef = useRef<HTMLInputElement>(null);

  const getFilteredSuggestions = (input: string, currentTags: string[]) => {
    if (!input.trim()) return [];
    return AUTOCOMPLETE_OPTIONS.filter(
      (opt) =>
        opt.toLowerCase().includes(input.toLowerCase()) &&
        !currentTags.includes(opt)
    ).slice(0, 5);
  };

  // Light handlers
  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed) || tags.length >= MAX_TAGS) return;
    setTags((prev) => [...prev, trimmed]);
    setTagInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  // Gradient handlers
  const addGradTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || gradTags.includes(trimmed) || gradTags.length >= MAX_TAGS) return;
    setGradTags((prev) => [...prev, trimmed]);
    setGradTagInput("");
    setShowGradSuggestions(false);
    gradInputRef.current?.focus();
  };

  const removeGradTag = (index: number) => {
    setGradTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGradKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addGradTag(gradTagInput);
    } else if (e.key === "Backspace" && !gradTagInput && gradTags.length > 0) {
      removeGradTag(gradTags.length - 1);
    }
  };

  // Dark handlers
  const addDarkTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || darkTags.includes(trimmed) || darkTags.length >= MAX_TAGS) return;
    setDarkTags((prev) => [...prev, trimmed]);
    setDarkTagInput("");
    setShowDarkSuggestions(false);
    darkInputRef.current?.focus();
  };

  const removeDarkTag = (index: number) => {
    setDarkTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDarkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDarkTag(darkTagInput);
    } else if (e.key === "Backspace" && !darkTagInput && darkTags.length > 0) {
      removeDarkTag(darkTags.length - 1);
    }
  };

  const lightSuggestions = getFilteredSuggestions(tagInput, tags);
  const gradSuggestions = getFilteredSuggestions(gradTagInput, gradTags);
  const darkSuggestions = getFilteredSuggestions(darkTagInput, darkTags);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Light */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
        <div className="nxt-card p-4 h-full space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-nxt-700">Tecnologias del proyecto</label>
              <span className={`text-xs font-medium ${tags.length >= MAX_TAGS ? "text-error" : "text-nxt-400"}`}>
                {tags.length}/{MAX_TAGS}
              </span>
            </div>

            <div className="relative">
              <div className="flex flex-wrap items-center gap-1.5 p-2 border border-nxt-200 rounded-lg bg-white min-h-[42px] focus-within:border-forest focus-within:ring-2 focus-within:ring-forest/20 transition-all duration-200">
                {tags.map((tag, i) => (
                  <ColorEditable key={`tag-l-${tag}`} elementKey={`formularios-avz.tag-l-${i}`} defaultBg="#04202C">
                    {(_styles, _openPicker, _currentHex) => (
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border transition-all duration-200 ${TAG_COLORS[i % TAG_COLORS.length]}`}
                        style={{ animation: "fadeScaleIn 0.15s ease-out" }}
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(i)}
                          className="ml-0.5 hover:bg-black/10 rounded p-0.5 transition-all duration-150 active:scale-90"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </ColorEditable>
                ))}
                <input
                  ref={inputRef}
                  type="text"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder={tags.length >= MAX_TAGS ? "Limite alcanzado" : "Escribe y presiona Enter..."}
                  disabled={tags.length >= MAX_TAGS}
                  className="flex-1 min-w-[120px] text-sm text-nxt-900 placeholder-nxt-400 outline-none bg-transparent disabled:cursor-not-allowed"
                />
              </div>

              {/* Suggestions */}
              {showSuggestions && lightSuggestions.length > 0 && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-white border border-nxt-200 rounded-lg shadow-lg overflow-hidden">
                  {lightSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addTag(suggestion);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-nxt-700 hover:bg-forest/5 hover:text-forest transition-all duration-150 flex items-center gap-2"
                    >
                      <Tag className="w-3.5 h-3.5 text-nxt-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Duplicate warning */}
            {tagInput.trim() && tags.includes(tagInput.trim()) && (
              <p className="text-xs text-warning mt-1.5">Esta etiqueta ya existe en la lista.</p>
            )}

            <p className="text-xs text-nxt-400 mt-2">
              Presiona <kbd className="px-1 py-0.5 bg-nxt-100 rounded text-nxt-600 font-mono text-[10px]">Enter</kbd> para agregar,{" "}
              <kbd className="px-1 py-0.5 bg-nxt-100 rounded text-nxt-600 font-mono text-[10px]">Backspace</kbd> para eliminar la ultima.
            </p>
          </div>
        </div>
      </div>

      {/* Gradiente */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
        <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">Herramientas</label>
                <span className={`text-xs font-medium ${gradTags.length >= MAX_TAGS ? "text-red-300" : "text-white/50"}`}>
                  {gradTags.length}/{MAX_TAGS}
                </span>
              </div>

              <div className="relative">
                <div className="flex flex-wrap items-center gap-1.5 p-2 border border-white/20 rounded-lg bg-white/10 min-h-[42px] focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/20 transition-all duration-200">
                  {gradTags.map((tag, i) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border transition-all duration-200 ${TAG_COLORS_GRAD[i % TAG_COLORS_GRAD.length]}`}
                      style={{ animation: "fadeScaleIn 0.15s ease-out" }}
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeGradTag(i)}
                        className="ml-0.5 hover:bg-white/20 rounded p-0.5 transition-all duration-150 active:scale-90"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={gradInputRef}
                    type="text"
                    value={gradTagInput}
                    onChange={(e) => {
                      setGradTagInput(e.target.value);
                      setShowGradSuggestions(true);
                    }}
                    onKeyDown={handleGradKeyDown}
                    onFocus={() => setShowGradSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowGradSuggestions(false), 150)}
                    placeholder={gradTags.length >= MAX_TAGS ? "Limite alcanzado" : "Escribe y presiona Enter..."}
                    disabled={gradTags.length >= MAX_TAGS}
                    className="flex-1 min-w-[120px] text-sm text-white placeholder-white/50 outline-none bg-transparent disabled:cursor-not-allowed"
                  />
                </div>

                {/* Gradient suggestions */}
                {showGradSuggestions && gradSuggestions.length > 0 && (
                  <div className="absolute z-10 left-0 right-0 mt-1 bg-slate-700 border border-white/20 rounded-lg shadow-lg overflow-hidden">
                    {gradSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addGradTag(suggestion);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all duration-150 flex items-center gap-2"
                      >
                        <Tag className="w-3.5 h-3.5 text-white/40" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {gradTagInput.trim() && gradTags.includes(gradTagInput.trim()) && (
                <p className="text-xs text-yellow-300 mt-1.5">Esta etiqueta ya existe en la lista.</p>
              )}

              <p className="text-xs text-white/50 mt-2">
                Presiona <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/70 font-mono text-[10px]">Enter</kbd> para agregar,{" "}
                <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/70 font-mono text-[10px]">Backspace</kbd> para eliminar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dark */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
        <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">Stack tecnologico</label>
              <span className={`text-xs font-medium ${darkTags.length >= MAX_TAGS ? "text-error" : "text-nxt-400"}`}>
                {darkTags.length}/{MAX_TAGS}
              </span>
            </div>

            <div className="relative">
              <div className="flex flex-wrap items-center gap-1.5 p-2 border border-nxt-600 rounded-lg bg-nxt-700 min-h-[42px] focus-within:border-forest focus-within:ring-2 focus-within:ring-forest/20 transition-all duration-200">
                {darkTags.map((tag, i) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md border transition-all duration-200 ${TAG_COLORS_DARK[i % TAG_COLORS_DARK.length]}`}
                    style={{ animation: "fadeScaleIn 0.15s ease-out" }}
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeDarkTag(i)}
                      className="ml-0.5 hover:bg-white/10 rounded p-0.5 transition-all duration-150 active:scale-90"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  ref={darkInputRef}
                  type="text"
                  value={darkTagInput}
                  onChange={(e) => {
                    setDarkTagInput(e.target.value);
                    setShowDarkSuggestions(true);
                  }}
                  onKeyDown={handleDarkKeyDown}
                  onFocus={() => setShowDarkSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowDarkSuggestions(false), 150)}
                  placeholder={darkTags.length >= MAX_TAGS ? "Limite alcanzado" : "Escribe y presiona Enter..."}
                  disabled={darkTags.length >= MAX_TAGS}
                  className="flex-1 min-w-[120px] text-sm text-white placeholder-nxt-500 outline-none bg-transparent disabled:cursor-not-allowed"
                />
              </div>

              {/* Dark suggestions */}
              {showDarkSuggestions && darkSuggestions.length > 0 && (
                <div className="absolute z-10 left-0 right-0 mt-1 bg-nxt-700 border border-nxt-600 rounded-lg shadow-lg overflow-hidden">
                  {darkSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addDarkTag(suggestion);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-nxt-300 hover:bg-forest/10 hover:text-forest transition-all duration-150 flex items-center gap-2"
                    >
                      <Tag className="w-3.5 h-3.5 text-nxt-500" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {darkTagInput.trim() && darkTags.includes(darkTagInput.trim()) && (
              <p className="text-xs text-warning mt-1.5">Esta etiqueta ya existe en la lista.</p>
            )}

            <p className="text-xs text-nxt-500 mt-2">
              Presiona <kbd className="px-1 py-0.5 bg-nxt-600 rounded text-nxt-300 font-mono text-[10px]">Enter</kbd> para agregar,{" "}
              <kbd className="px-1 py-0.5 bg-nxt-600 rounded text-nxt-300 font-mono text-[10px]">Backspace</kbd> para eliminar la ultima.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Date Picker Component                                              */
/* ================================================================== */

const DAYS_ES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  // 0 = Sunday, adjust so Monday = 0
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBeforeDay(a: Date, b: Date): boolean {
  const aDate = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const bDate = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return aDate < bDate;
}

function isBetween(date: Date, start: Date, end: Date): boolean {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return d > Math.min(s, e) && d < Math.max(s, e);
}

function DatePickerDemo() {
  const today = new Date();

  // Single date picker state (Light)
  const [showCalendar, setShowCalendar] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  // Gradient date picker state
  const [gradMonth, setGradMonth] = useState(today.getMonth());
  const [gradYear, setGradYear] = useState(today.getFullYear());
  const [gradSelectedDate, setGradSelectedDate] = useState<Date | null>(today);
  const [showGradCalendar, setShowGradCalendar] = useState(true);

  // Range date picker state (Dark)
  const [showRangeCalendar, setShowRangeCalendar] = useState(true);
  const [rangeMonth, setRangeMonth] = useState(today.getMonth());
  const [rangeYear, setRangeYear] = useState(today.getFullYear());
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [rangeHover, setRangeHover] = useState<Date | null>(null);

  // Light navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Gradient navigation
  const prevGradMonth = () => {
    if (gradMonth === 0) {
      setGradMonth(11);
      setGradYear((y) => y - 1);
    } else {
      setGradMonth((m) => m - 1);
    }
  };

  const nextGradMonth = () => {
    if (gradMonth === 11) {
      setGradMonth(0);
      setGradYear((y) => y + 1);
    } else {
      setGradMonth((m) => m + 1);
    }
  };

  // Dark range navigation
  const prevRangeMonth = () => {
    if (rangeMonth === 0) {
      setRangeMonth(11);
      setRangeYear((y) => y - 1);
    } else {
      setRangeMonth((m) => m - 1);
    }
  };

  const nextRangeMonth = () => {
    if (rangeMonth === 11) {
      setRangeMonth(0);
      setRangeYear((y) => y + 1);
    } else {
      setRangeMonth((m) => m + 1);
    }
  };

  // Single date select (Light)
  const handleSelectDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
  };

  // Gradient date select
  const handleGradSelectDate = (day: number) => {
    const date = new Date(gradYear, gradMonth, day);
    setGradSelectedDate(date);
  };

  // Range date select (Dark)
  const handleRangeSelect = (day: number) => {
    const date = new Date(rangeYear, rangeMonth, day);
    const isPast = isBeforeDay(date, today);
    if (isPast) return;

    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      if (isBeforeDay(date, rangeStart)) {
        setRangeEnd(rangeStart);
        setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
    }
  };

  // Build calendar grid
  const buildCalendarDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: (number | null)[] = [];

    // Empty cells for days before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  };

  const lightDays = buildCalendarDays(currentYear, currentMonth);
  const gradDays = buildCalendarDays(gradYear, gradMonth);
  const darkDays = buildCalendarDays(rangeYear, rangeMonth);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Light - Single date */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
        <div className="nxt-card p-4 h-full space-y-4">
          {/* Input field */}
          <div className="relative">
            <label className="block text-sm font-medium text-nxt-700 mb-1">Fecha de instalacion</label>
            <div
              className="flex items-center gap-2 nxt-input cursor-pointer"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <Calendar className="w-4 h-4 text-nxt-400" />
              <span className={`text-sm ${selectedDate ? "text-nxt-900" : "text-nxt-400"}`}>
                {selectedDate ? formatDate(selectedDate) : "Seleccionar fecha..."}
              </span>
              <ChevronDown className={`w-4 h-4 text-nxt-400 ml-auto transition-transform duration-200 ${showCalendar ? "rotate-180" : ""}`} />
            </div>
          </div>

          {/* Calendar */}
          {showCalendar && (
            <div className="border border-nxt-200 rounded-lg p-4 bg-white shadow-sm">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg hover:bg-nxt-100 text-nxt-600 transition-all duration-150 active:scale-90"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowMonthSelector(!showMonthSelector)}
                  className="text-sm font-semibold text-nxt-900 hover:text-forest transition-colors px-2 py-1 rounded-lg hover:bg-nxt-50"
                >
                  {MONTHS_ES[currentMonth]} {currentYear}
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg hover:bg-nxt-100 text-nxt-600 transition-all duration-150 active:scale-90"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Month/Year quick selector */}
              {showMonthSelector && (
                <div className="grid grid-cols-3 gap-1 mb-4 p-2 bg-nxt-50 rounded-lg">
                  {MONTHS_ES.map((m, i) => (
                    <ColorEditable key={`month-l-${i}`} elementKey={`formularios-avz.datepicker-month-${i}`} defaultBg={i === currentMonth ? "#04202C" : undefined}>
                      {(styles, _openPicker, _currentHex) => (
                        <button
                          onClick={() => {
                            setCurrentMonth(i);
                            setShowMonthSelector(false);
                          }}
                          className={`text-xs py-1.5 rounded-md transition-all duration-150 ${
                            i === currentMonth
                              ? "bg-forest text-white font-semibold"
                              : "text-nxt-600 hover:bg-nxt-200"
                          }`}
                          style={i === currentMonth ? styles : undefined}
                        >
                          {m.slice(0, 3)}
                        </button>
                      )}
                    </ColorEditable>
                  ))}
                </div>
              )}

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS_ES.map((d) => (
                  <div key={d} className="text-center text-[10px] font-semibold text-nxt-400 uppercase py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {lightDays.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} />;
                  const date = new Date(currentYear, currentMonth, day);
                  const isToday = isSameDay(date, today);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);

                  return (
                    <button
                      key={day}
                      onClick={() => handleSelectDate(day)}
                      className={`
                        relative h-9 w-full rounded-lg text-sm font-medium transition-all duration-150
                        ${isSelected
                          ? "bg-forest text-white shadow-sm"
                          : isToday
                            ? "bg-forest/10 text-forest font-bold"
                            : "text-nxt-700 hover:bg-nxt-100"
                        }
                      `}
                    >
                      {day}
                      {isToday && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-forest rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Today button */}
              <div className="mt-3 pt-3 border-t border-nxt-100 flex justify-between items-center">
                <button
                  onClick={() => {
                    setSelectedDate(today);
                    setCurrentMonth(today.getMonth());
                    setCurrentYear(today.getFullYear());
                  }}
                  className="text-xs text-forest font-medium hover:underline transition-all duration-150"
                >
                  Ir a hoy
                </button>
                {selectedDate && (
                  <span className="text-xs text-nxt-500">
                    Seleccionado: <span className="font-medium text-nxt-700">{formatDate(selectedDate)}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gradiente - Single date */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
        <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="relative z-10 space-y-4">
            {/* Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-white mb-1">Fecha de revision</label>
              <div
                className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 cursor-pointer"
                onClick={() => setShowGradCalendar(!showGradCalendar)}
              >
                <Calendar className="w-4 h-4 text-white/60" />
                <span className={`text-sm ${gradSelectedDate ? "text-white" : "text-white/50"}`}>
                  {gradSelectedDate ? formatDate(gradSelectedDate) : "Seleccionar fecha..."}
                </span>
                <ChevronDown className={`w-4 h-4 text-white/60 ml-auto transition-transform duration-200 ${showGradCalendar ? "rotate-180" : ""}`} />
              </div>
            </div>

            {/* Calendar */}
            {showGradCalendar && (
              <div className="border border-white/20 rounded-lg p-4 bg-white/5 backdrop-blur-sm">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevGradMonth}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 transition-all duration-150 active:scale-90"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-semibold text-white">
                    {MONTHS_ES[gradMonth]} {gradYear}
                  </span>
                  <button
                    onClick={nextGradMonth}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 transition-all duration-150 active:scale-90"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1">
                  {DAYS_ES.map((d) => (
                    <div key={d} className="text-center text-[10px] font-semibold text-white/40 uppercase py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-0.5">
                  {gradDays.map((day, i) => {
                    if (day === null) return <div key={`empty-g-${i}`} />;
                    const date = new Date(gradYear, gradMonth, day);
                    const isToday = isSameDay(date, today);
                    const isSelected = gradSelectedDate && isSameDay(date, gradSelectedDate);

                    return (
                      <button
                        key={day}
                        onClick={() => handleGradSelectDate(day)}
                        className={`
                          relative h-9 w-full rounded-lg text-sm font-medium transition-all duration-150
                          ${isSelected
                            ? "bg-forest text-white shadow-sm"
                            : isToday
                              ? "bg-white/10 text-forest font-bold"
                              : "text-white/80 hover:bg-white/10"
                          }
                        `}
                      >
                        {day}
                        {isToday && !isSelected && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-forest rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                  <button
                    onClick={() => {
                      setGradSelectedDate(today);
                      setGradMonth(today.getMonth());
                      setGradYear(today.getFullYear());
                    }}
                    className="text-xs text-forest font-medium hover:underline transition-all duration-150"
                  >
                    Ir a hoy
                  </button>
                  {gradSelectedDate && (
                    <span className="text-xs text-white/50">
                      Seleccionado: <span className="font-medium text-white">{formatDate(gradSelectedDate)}</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dark - Range date */}
      <div>
        <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
        <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full space-y-4">
          {/* Input fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-nxt-400 mb-1">Fecha inicio</label>
              <div
                className="flex items-center gap-2 rounded-lg border border-nxt-600 bg-nxt-700 px-3 py-2 cursor-pointer"
                onClick={() => setShowRangeCalendar(true)}
              >
                <Calendar className="w-4 h-4 text-nxt-400" />
                <span className={`text-sm ${rangeStart ? "text-white" : "text-nxt-500"}`}>
                  {rangeStart ? formatDate(rangeStart) : "Inicio..."}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-nxt-400 mb-1">Fecha fin</label>
              <div className="flex items-center gap-2 rounded-lg border border-nxt-600 bg-nxt-700 px-3 py-2">
                <Calendar className="w-4 h-4 text-nxt-400" />
                <span className={`text-sm ${rangeEnd ? "text-white" : "text-nxt-500"}`}>
                  {rangeEnd ? formatDate(rangeEnd) : "Fin..."}
                </span>
              </div>
            </div>
          </div>

          {/* Range Calendar */}
          {showRangeCalendar && (
            <div className="border border-nxt-700 rounded-lg p-4 bg-nxt-800">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevRangeMonth}
                  className="p-1.5 rounded-lg hover:bg-nxt-700 text-nxt-400 transition-all duration-150 active:scale-90"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-white">
                  {MONTHS_ES[rangeMonth]} {rangeYear}
                </span>
                <button
                  onClick={nextRangeMonth}
                  className="p-1.5 rounded-lg hover:bg-nxt-700 text-nxt-400 transition-all duration-150 active:scale-90"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS_ES.map((d) => (
                  <div key={d} className="text-center text-[10px] font-semibold text-nxt-500 uppercase py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {darkDays.map((day, i) => {
                  if (day === null) return <div key={`empty-d-${i}`} />;

                  const date = new Date(rangeYear, rangeMonth, day);
                  const isToday = isSameDay(date, today);
                  const isPast = isBeforeDay(date, today);
                  const isStart = rangeStart && isSameDay(date, rangeStart);
                  const isEnd = rangeEnd && isSameDay(date, rangeEnd);
                  const effectiveEnd = rangeEnd || rangeHover;
                  const inRange = rangeStart && effectiveEnd && isBetween(date, rangeStart, effectiveEnd);

                  return (
                    <button
                      key={day}
                      onClick={() => handleRangeSelect(day)}
                      onMouseEnter={() => {
                        if (rangeStart && !rangeEnd) {
                          setRangeHover(date);
                        }
                      }}
                      onMouseLeave={() => setRangeHover(null)}
                      disabled={isPast}
                      className={`
                        relative h-9 w-full text-sm font-medium transition-all duration-150
                        ${isStart || isEnd ? "rounded-lg" : ""}
                        ${isStart
                          ? "bg-forest text-white rounded-l-lg rounded-r-none"
                          : isEnd
                            ? "bg-forest text-white rounded-r-lg rounded-l-none"
                            : inRange
                              ? "bg-forest/20 text-forest"
                              : isPast
                                ? "text-nxt-600 cursor-not-allowed"
                                : isToday
                                  ? "text-forest font-bold"
                                  : "text-nxt-300 hover:bg-nxt-700 rounded-lg"
                        }
                        ${(isStart && isEnd) ? "!rounded-lg" : ""}
                      `}
                    >
                      {day}
                      {isToday && !isStart && !isEnd && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-forest rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-3 pt-3 border-t border-nxt-700 flex justify-between items-center">
                <button
                  onClick={() => {
                    setRangeStart(null);
                    setRangeEnd(null);
                  }}
                  className="text-xs text-nxt-400 hover:text-white transition-all duration-150"
                >
                  Limpiar seleccion
                </button>
                {rangeStart && rangeEnd && (
                  <span className="text-xs text-nxt-400">
                    {Math.abs(Math.ceil((rangeEnd.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24)))} dias seleccionados
                  </span>
                )}
                {rangeStart && !rangeEnd && (
                  <span className="text-xs text-forest">Selecciona la fecha final</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Export                                                         */
/* ================================================================== */

export function FormulariosAvanzadosSection({ scrollTo }: { scrollTo?: string }) {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTo]);

  return (
    <>
      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes checkIn {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes radioFill {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>

      {/* 1. Toggle / Switch */}
      <SectionHeader
        id="toggle-switch"
        title="Toggle / Switch"
        description="Interruptores tipo toggle con multiples tamanos, colores, iconos y estados. Panel de configuracion interactivo."
      >
        <ToggleSwitchDemo />
      </SectionHeader>

      {/* Separator */}
      <div className="border-t border-nxt-200 pt-6 mt-6" />

      {/* 2. Checkbox & Radio */}
      <SectionHeader
        id="checkbox-radio"
        title="Checkbox & Radio"
        description="Checkboxes estilizados con animacion, estados indeterminados y 'Seleccionar todo'. Radios con descripcion y variantes de tamano."
      >
        <CheckboxRadioDemo />
      </SectionHeader>

      {/* Separator */}
      <div className="border-t border-nxt-200 pt-6 mt-6" />

      {/* 3. Slider / Range */}
      <SectionHeader
        id="slider-range"
        title="Slider / Range"
        description="Sliders de valor unico y rango con thumbs personalizados, etiquetas flotantes, marcas de tick y variantes de color."
      >
        <SliderDemo />
      </SectionHeader>

      {/* Separator */}
      <div className="border-t border-nxt-200 pt-6 mt-6" />

      {/* 4. Tag Input */}
      <SectionHeader
        id="tag-input"
        title="Tag Input"
        description="Campo de entrada que crea etiquetas con Enter, con autocompletado, colores asignados, limite maximo y prevencion de duplicados."
      >
        <TagInputDemo />
      </SectionHeader>

      {/* Separator */}
      <div className="border-t border-nxt-200 pt-6 mt-6" />

      {/* 5. Date Picker */}
      <SectionHeader
        id="date-picker"
        title="Date Picker"
        description="Calendario interactivo construido desde cero con seleccion de fecha unica, rango de fechas, navegacion por mes y resaltado de hoy."
      >
        <DatePickerDemo />
      </SectionHeader>
    </>
  );
}
