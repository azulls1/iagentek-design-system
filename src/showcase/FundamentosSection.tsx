import { useEffect, useRef, useState } from "react";
import { MousePointer } from "lucide-react";
import { ColorEditable } from "../components/ColorEditable";
import { TypoEditable } from "../components/TypoEditable";

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

function ColorSwatch({
  name,
  hex,
  cls,
  small,
  textCls,
  subTextCls,
  group = "color",
}: {
  name: string;
  hex: string;
  cls: string;
  small?: boolean;
  textCls?: string;
  subTextCls?: string;
  group?: string;
}) {
  const size = small
    ? "w-10 h-10 sm:w-12 sm:h-12 rounded-nxt-md"
    : "w-14 h-14 sm:w-16 sm:h-16 rounded-nxt-lg";

  const elementKey = `fundamentos.${group}.${name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <ColorEditable elementKey={elementKey} defaultBg={hex}>
      {(styleOverrides, openPicker, currentHex) => (
        <div className="flex flex-col items-center gap-1">
          <div
            className={`${size} ${cls} shadow-nxt-sm cursor-pointer hover:ring-2 hover:ring-forest hover:ring-offset-1 transition-all active:scale-95`}
            style={styleOverrides}
            onClick={openPicker}
            title="Click para editar color"
          />
          <span className={`text-[10px] sm:text-xs font-medium leading-tight text-center ${textCls ?? "text-nxt-700"}`}>
            {name}
          </span>
          <span className={`text-[9px] sm:text-[10px] font-mono ${subTextCls ?? "text-nxt-400"}`}>
            {currentHex}
          </span>
        </div>
      )}
    </ColorEditable>
  );
}

function AnimationCardVariant({
  name,
  cls,
  cardCls,
  textCls,
}: {
  name: string;
  cls: string;
  cardCls?: string;
  textCls?: string;
}) {
  const [key, setKey] = useState(0);
  const replay = () => setKey((k) => k + 1);
  const elementKey = `fundamentos.anim.${name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <ColorEditable elementKey={elementKey} defaultBg="#04202C">
      {(styles, openPicker, currentHex) => (
        <div
          className={`${cardCls ?? "nxt-card"} p-3 sm:p-4 flex flex-col items-center gap-2 cursor-pointer select-none`}
          onClick={replay}
          title="Click para repetir / Right-click para editar color"
        >
          <div
            key={key}
            className={`w-10 h-10 rounded-nxt-lg bg-forest ${cls} hover:ring-2 hover:ring-forest hover:ring-offset-1`}
            style={styles}
            onClick={(e) => { e.stopPropagation(); openPicker(); }}
          />
          <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight ${textCls ?? "text-nxt-700"}`}>
            {name}
          </span>
          <span className={`text-[8px] font-mono ${textCls ? "text-white/40" : "text-nxt-400"}`}>{currentHex}</span>
        </div>
      )}
    </ColorEditable>
  );
}

function HelperCard({ name, children: content, defaultColor = "#04202C" }: { name: string; children: React.ReactNode; defaultColor?: string }) {
  const elementKey = `fundamentos.helper.${name}`;
  return (
    <ColorEditable elementKey={elementKey} defaultBg={defaultColor}>
      {(styles, openPicker, currentHex) => (
        <div
          className="nxt-card p-4 flex flex-col items-center gap-3 cursor-pointer hover:ring-2 hover:ring-forest hover:ring-offset-1 transition-all active:scale-95"
          onClick={openPicker}
        >
          <div style={styles}>{content}</div>
          <span className="text-xs font-medium text-nxt-600">{name}</span>
          <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
        </div>
      )}
    </ColorEditable>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const primaryColors = [
  { name: "Primary", hex: "#04202C", cls: "bg-forest" },
  { name: "Light", hex: "#5B7065", cls: "bg-pine" },
  { name: "Hover", hex: "#1A3036", cls: "bg-bark" },
  { name: "Active", hex: "#021519", cls: "bg-midnight" },
];

const grayColors = [
  { name: "50", hex: "#F7F8F7", cls: "bg-nxt-50" },
  { name: "100", hex: "#EFF2F0", cls: "bg-nxt-100" },
  { name: "200", hex: "#DFE4E0", cls: "bg-nxt-200" },
  { name: "300", hex: "#C9D1C8", cls: "bg-nxt-300" },
  { name: "400", hex: "#9EADA3", cls: "bg-nxt-400" },
  { name: "500", hex: "#7D8F84", cls: "bg-nxt-500" },
  { name: "600", hex: "#5B7065", cls: "bg-nxt-600" },
  { name: "700", hex: "#304040", cls: "bg-nxt-700" },
  { name: "800", hex: "#1A3036", cls: "bg-nxt-800" },
  { name: "900", hex: "#04202C", cls: "bg-nxt-900" },
];

const stateColors = [
  { name: "Success", hex: "#059669", cls: "bg-success" },
  { name: "Success Light", hex: "#F0FDF4", cls: "bg-success-light" },
  { name: "Warning", hex: "#D97706", cls: "bg-warning" },
  { name: "Warning Light", hex: "#FEFCE8", cls: "bg-warning-light" },
  { name: "Error", hex: "#DC2626", cls: "bg-error" },
  { name: "Error Light", hex: "#FEF2F2", cls: "bg-error-light" },
  { name: "Info", hex: "#2563EB", cls: "bg-info" },
  { name: "Info Light", hex: "#EFF6FF", cls: "bg-info-light" },
];

const typographySamples = [
  {
    label: "4xl / 36px",
    text: "Dashboard Principal",
    cls: "text-4xl sm:text-4xl font-bold",
    typoKey: "4xl",
    defaultSize: "36px",
    defaultWeight: "700",
    defaultColor: "#04202C",
  },
  {
    label: "3xl / 30px",
    text: "Titulo de Seccion",
    cls: "text-3xl sm:text-3xl font-bold",
    typoKey: "3xl",
    defaultSize: "30px",
    defaultWeight: "700",
    defaultColor: "#04202C",
  },
  {
    label: "2xl / 24px",
    text: "Subtitulo",
    cls: "text-2xl sm:text-2xl font-semibold",
    typoKey: "2xl",
    defaultSize: "24px",
    defaultWeight: "600",
    defaultColor: "#04202C",
  },
  {
    label: "xl / 20px",
    text: "Encabezado de Card",
    cls: "text-xl sm:text-xl font-semibold",
    typoKey: "xl",
    defaultSize: "20px",
    defaultWeight: "600",
    defaultColor: "#04202C",
  },
  {
    label: "base / 14px",
    text: "Texto de cuerpo utilizado en la mayoria de interfaces para parrafos, descripciones y contenido general.",
    cls: "text-base",
    typoKey: "base",
    defaultSize: "14px",
    defaultWeight: "400",
    defaultColor: "#04202C",
  },
  {
    label: "sm / 12px",
    text: "Texto secundario para labels, hints y metadata de menor jerarquia.",
    cls: "text-sm text-nxt-500",
    typoKey: "sm",
    defaultSize: "12px",
    defaultWeight: "400",
    defaultColor: "#7D8F84",
  },
];

const animEntrada = [
  { name: "fade-in", cls: "animate-nxt-fade-in" },
  { name: "slide-up", cls: "animate-nxt-slide-up" },
  { name: "slide-down", cls: "animate-nxt-slide-down" },
  { name: "slide-in-right", cls: "animate-nxt-slide-in-right" },
  { name: "slide-in-left", cls: "animate-nxt-slide-in-left" },
  { name: "scale-in", cls: "animate-nxt-scale-in" },
  { name: "bounce-in", cls: "animate-nxt-bounce-in" },
  { name: "zoom-in", cls: "animate-nxt-zoom-in" },
  { name: "pop", cls: "animate-nxt-pop" },
  { name: "blur-in", cls: "animate-nxt-blur-in" },
  { name: "drop-in", cls: "animate-nxt-drop-in" },
  { name: "flip-x", cls: "animate-nxt-flip-x" },
  { name: "flip-y", cls: "animate-nxt-flip-y" },
  { name: "rotate-in", cls: "animate-nxt-rotate-in" },
  { name: "slide-rotate", cls: "animate-nxt-slide-rotate" },
];

const animAtencion = [
  { name: "shake", cls: "animate-nxt-shake" },
  { name: "bounce", cls: "animate-nxt-bounce" },
  { name: "jello", cls: "animate-nxt-jello" },
  { name: "tada", cls: "animate-nxt-tada" },
  { name: "swing", cls: "animate-nxt-swing" },
  { name: "wobble", cls: "animate-nxt-wobble" },
  { name: "flash", cls: "animate-nxt-flash" },
  { name: "glitch", cls: "animate-nxt-glitch" },
  { name: "count-pulse", cls: "animate-nxt-count-pulse" },
  { name: "glow", cls: "animate-nxt-glow" },
];

const animLoop = [
  { name: "pulse-soft", cls: "animate-nxt-pulse-soft" },
  { name: "spin", cls: "animate-nxt-spin" },
  { name: "blink", cls: "animate-nxt-blink" },
  { name: "ping", cls: "animate-nxt-ping" },
  { name: "float", cls: "animate-nxt-float" },
  { name: "heartbeat", cls: "animate-nxt-heartbeat" },
  { name: "levitate", cls: "animate-nxt-levitate" },
  { name: "sway", cls: "animate-nxt-sway" },
  { name: "morph", cls: "animate-nxt-morph" },
  { name: "orbit", cls: "animate-nxt-orbit" },
  { name: "gradient-shift", cls: "animate-nxt-gradient-shift bg-gradient-to-r from-primary via-info to-success" },
];

/* ------------------------------------------------------------------ */
/*  Animation Card                                                     */
/* ------------------------------------------------------------------ */

function AnimationCard({ name, cls }: { name: string; cls: string }) {
  const [key, setKey] = useState(0);
  const replay = () => setKey((k) => k + 1);
  const elementKey = `fundamentos.anim-all.${name.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <ColorEditable elementKey={elementKey} defaultBg="#04202C">
      {(styles, openPicker, currentHex) => (
        <div
          className="nxt-card p-3 sm:p-4 flex flex-col items-center gap-2 cursor-pointer select-none"
          onClick={replay}
          title="Click para repetir"
        >
          <div
            key={key}
            className={`w-10 h-10 rounded-nxt-lg bg-forest ${cls} hover:ring-2 hover:ring-forest hover:ring-offset-1`}
            style={styles}
            onClick={(e) => { e.stopPropagation(); openPicker(); }}
          />
          <span className="text-[10px] sm:text-xs font-medium text-nxt-700 text-center leading-tight">
            {name}
          </span>
          <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
        </div>
      )}
    </ColorEditable>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function FundamentosSection({ scrollTo }: { scrollTo?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTo]);

  return (
    <div className="space-y-2">
      {/* ---- COLORES ---- */}
      <Section
        id="colores"
        title="Colores"
        description="Paleta oficial extraida de Figma. Todos los proyectos (Apollo, Atlas, CFE-Recibos) deben usar exclusivamente estos colores. Los tokens CSS son --nxt-primary, --nxt-bg-*, --nxt-text-*, etc."
      >
        {/* Primario */}
        <p className="text-xs text-nxt-500 mb-2">Color principal de la marca Forest. Usar para CTAs, highlights y elementos interactivos.</p>
        <h3 className="text-sm sm:text-base font-semibold text-nxt-700 mb-2">
          Primario
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-5 h-full">
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {primaryColors.map((c) => (
                  <ColorSwatch key={c.name} {...c} group="primary" />
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {primaryColors.map((c) => (
                    <ColorSwatch key={c.name} {...c} group="primary" textCls="text-white" subTextCls="text-white/60" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full">
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {primaryColors.map((c) => (
                  <ColorSwatch key={c.name} {...c} group="primary" textCls="text-gray-200" subTextCls="text-gray-400" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grises */}
        <p className="text-xs text-nxt-500 mb-2">Escala de grises para fondos, textos, bordes y superficies. nxt-50 para fondos claros, nxt-900 para textos oscuros.</p>
        <h3 className="text-sm sm:text-base font-semibold text-nxt-700 mb-2">
          Grises (Nxt)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-5 h-full">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {grayColors.map((c) => (
                  <ColorSwatch key={c.name} {...c} small group="gray" />
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {grayColors.map((c) => (
                    <ColorSwatch key={c.name} {...c} small group="gray" textCls="text-white" subTextCls="text-white/60" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {grayColors.map((c) => (
                  <ColorSwatch key={c.name} {...c} small group="gray" textCls="text-gray-200" subTextCls="text-gray-400" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Estados */}
        <p className="text-xs text-nxt-500 mb-2">Colores semanticos para feedback: exito (verde), alerta (amarillo), error (rojo), informativo (azul). Cada uno tiene variante light para fondos y border para bordes.</p>
        <h3 className="text-sm sm:text-base font-semibold text-nxt-700 mb-2">
          Estados
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-5 h-full">
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {stateColors.map((c) => (
                  <ColorSwatch key={c.name} {...c} group="state" />
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {stateColors.map((c) => (
                    <ColorSwatch key={c.name} {...c} group="state" textCls="text-white" subTextCls="text-white/60" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full">
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {stateColors.map((c) => (
                  <ColorSwatch key={c.name} {...c} group="state" textCls="text-gray-200" subTextCls="text-gray-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- TIPOGRAFIA ---- */}
      <Section
        id="tipografia"
        title="Tipografia"
        description="Fuente principal: Inter (UI). Monospace: JetBrains Mono (codigo, IDs, RPUs). Escala de 10px a 36px con pesos de 400 a 700."
      >
<div className="bg-info-light border border-info-border rounded-nxt-md p-3 mb-4 text-xs text-info">Tip: Usar text-sm (11.9px) para labels y datos secundarios, text-base (14px) para cuerpo, text-xl+ para titulos.</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 sm:p-6 space-y-4 h-full">
              {typographySamples.map((s) => (
                <TypoEditable key={s.typoKey} typoKey={s.typoKey} defaultColor={s.defaultColor} defaultSize={s.defaultSize} defaultWeight={s.defaultWeight} alwaysEditable>
                  {(style, openEditor, hasOverrides) => (
                    <div>
                      <span className="text-[10px] sm:text-xs text-nxt-400 font-mono block mb-0.5">
                        {s.label}{hasOverrides && <span className="ml-1 text-forest">*</span>}
                      </span>
                      <p className={`text-nxt-900 ${s.cls}`} style={style}>{s.text}</p>
                    </div>
                  )}
                </TypoEditable>
              ))}
              <TypoEditable typoKey="mono" defaultColor="#1A3036" defaultSize="13px" defaultWeight="400" alwaysEditable>
                {(style, openEditor, hasOverrides) => (
                  <div>
                    <span className="text-[10px] sm:text-xs text-nxt-400 font-mono block mb-0.5">
                      mono{hasOverrides && <span className="ml-1 text-forest">*</span>}
                    </span>
                    <pre className="bg-nxt-100 rounded p-2 sm:p-3 text-xs sm:text-sm font-mono text-nxt-800 overflow-x-auto" style={style}>
                      {`const config = { theme: "forest", primary: "#04202C" };`}
                    </pre>
                  </div>
                )}
              </TypoEditable>
            </div>
          </div>
          {/* Gradiente */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 sm:p-6 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 space-y-4">
                {typographySamples.map((s) => (
                  <TypoEditable key={s.typoKey} typoKey={s.typoKey} defaultColor={s.defaultColor} defaultSize={s.defaultSize} defaultWeight={s.defaultWeight} alwaysEditable>
                    {(style, openEditor, hasOverrides) => (
                      <div>
                        <span className="text-[10px] sm:text-xs text-white/50 font-mono block mb-0.5">
                          {s.label}{hasOverrides && <span className="ml-1 text-forest">*</span>}
                        </span>
                        <p className={`text-white ${s.cls.replace("text-nxt-500", "text-white/70")}`} style={style}>{s.text}</p>
                      </div>
                    )}
                  </TypoEditable>
                ))}
                <TypoEditable typoKey="mono" defaultColor="#1A3036" defaultSize="13px" defaultWeight="400" alwaysEditable>
                  {(style, openEditor, hasOverrides) => (
                    <div>
                      <span className="text-[10px] sm:text-xs text-white/50 font-mono block mb-0.5">
                        mono{hasOverrides && <span className="ml-1 text-forest">*</span>}
                      </span>
                      <pre className="bg-white/10 rounded p-2 sm:p-3 text-xs sm:text-sm font-mono text-white/90 overflow-x-auto" style={style}>
                        {`const config = { theme: "forest", primary: "#04202C" };`}
                      </pre>
                    </div>
                  )}
                </TypoEditable>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-4 sm:p-6 h-full space-y-4">
              {typographySamples.map((s) => (
                <TypoEditable key={s.typoKey} typoKey={s.typoKey} defaultColor={s.defaultColor} defaultSize={s.defaultSize} defaultWeight={s.defaultWeight} alwaysEditable>
                  {(style, openEditor, hasOverrides) => (
                    <div>
                      <span className="text-[10px] sm:text-xs text-gray-500 font-mono block mb-0.5">
                        {s.label}{hasOverrides && <span className="ml-1 text-forest">*</span>}
                      </span>
                      <p className={`text-gray-200 ${s.cls.replace("text-nxt-500", "text-gray-400")}`} style={style}>{s.text}</p>
                    </div>
                  )}
                </TypoEditable>
              ))}
              <TypoEditable typoKey="mono" defaultColor="#1A3036" defaultSize="13px" defaultWeight="400" alwaysEditable>
                {(style, openEditor, hasOverrides) => (
                  <div>
                    <span className="text-[10px] sm:text-xs text-gray-500 font-mono block mb-0.5">
                      mono{hasOverrides && <span className="ml-1 text-forest">*</span>}
                    </span>
                    <pre className="bg-[#1A3036] rounded p-2 sm:p-3 text-xs sm:text-sm font-mono text-gray-300 overflow-x-auto" style={style}>
                      {`const config = { theme: "forest", primary: "#04202C" };`}
                    </pre>
                  </div>
                )}
              </TypoEditable>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- ANIMACIONES ---- */}
      <Section
        id="animaciones"
        title="Animaciones"
        description="36 animaciones reutilizables organizadas por tipo. Click en cada tarjeta para repetir. Usar animate-nxt-* en Tailwind o .nxt-animate-* en CSS puro."
      >
        {/* Entrada - 3-col sample */}
        <h3 className="text-xs sm:text-sm font-semibold text-nxt-500 uppercase tracking-wide mb-3">Entrada (15)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-5 h-full">
              <div className="grid grid-cols-3 gap-3">
                {animEntrada.slice(0, 3).map((a) => (
                  <AnimationCardVariant key={a.name} name={a.name} cls={a.cls} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="grid grid-cols-3 gap-3">
                  {animEntrada.slice(0, 3).map((a) => (
                    <AnimationCardVariant key={a.name} name={a.name} cls={a.cls} cardCls="bg-white/10 rounded-nxt-xl" textCls="text-white" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full">
              <div className="grid grid-cols-3 gap-3">
                {animEntrada.slice(0, 3).map((a) => (
                  <AnimationCardVariant key={a.name} name={a.name} cls={a.cls} cardCls="bg-[#1A3036] rounded-nxt-xl" textCls="text-gray-200" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-nxt-400 mb-2 uppercase tracking-wider">Todas las animaciones de Entrada</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-3 mb-6">
          {animEntrada.map((a) => (
            <AnimationCard key={a.name} name={a.name} cls={a.cls} />
          ))}
        </div>

        {/* Atencion / Feedback - 3-col sample */}
        <h3 className="text-xs sm:text-sm font-semibold text-nxt-500 uppercase tracking-wide mb-3">Atencion / Feedback (10)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-5 h-full">
              <div className="grid grid-cols-3 gap-3">
                {animAtencion.slice(0, 3).map((a) => (
                  <AnimationCardVariant key={a.name} name={a.name} cls={a.cls} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="grid grid-cols-3 gap-3">
                  {animAtencion.slice(0, 3).map((a) => (
                    <AnimationCardVariant key={a.name} name={a.name} cls={a.cls} cardCls="bg-white/10 rounded-nxt-xl" textCls="text-white" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full">
              <div className="grid grid-cols-3 gap-3">
                {animAtencion.slice(0, 3).map((a) => (
                  <AnimationCardVariant key={a.name} name={a.name} cls={a.cls} cardCls="bg-[#1A3036] rounded-nxt-xl" textCls="text-gray-200" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-nxt-400 mb-2 uppercase tracking-wider">Todas las animaciones de Atencion</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-3 mb-6">
          {animAtencion.map((a) => (
            <AnimationCard key={a.name} name={a.name} cls={a.cls} />
          ))}
        </div>

        {/* Loop / Continuas - 3-col sample */}
        <h3 className="text-xs sm:text-sm font-semibold text-nxt-500 uppercase tracking-wide mb-3">Loop / Continuas (11)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-5 h-full">
              <div className="grid grid-cols-3 gap-3">
                {animLoop.slice(0, 3).map((a) => (
                  <AnimationCardVariant key={a.name} name={a.name} cls={a.cls} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="grid grid-cols-3 gap-3">
                  {animLoop.slice(0, 3).map((a) => (
                    <AnimationCardVariant key={a.name} name={a.name} cls={a.cls} cardCls="bg-white/10 rounded-nxt-xl" textCls="text-white" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full">
              <div className="grid grid-cols-3 gap-3">
                {animLoop.slice(0, 3).map((a) => (
                  <AnimationCardVariant key={a.name} name={a.name} cls={a.cls} cardCls="bg-[#1A3036] rounded-nxt-xl" textCls="text-gray-200" />
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-nxt-400 mb-2 uppercase tracking-wider">Todas las animaciones Loop</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-3 mb-6">
          {animLoop.map((a) => (
            <AnimationCard key={a.name} name={a.name} cls={a.cls} />
          ))}
        </div>

        {/* Helpers compuestos - 3-col sample */}
        <h3 className="text-xs sm:text-sm font-semibold text-nxt-500 uppercase tracking-wide mb-3">Helpers compuestos (25)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-5 h-full">
              <div className="grid grid-cols-2 gap-3">
                <HelperCard name="wave-dots-l">
                  <div className="nxt-wave-dots"><span className="w-2.5 h-2.5 rounded-full bg-forest" /><span className="w-2.5 h-2.5 rounded-full bg-forest" /><span className="w-2.5 h-2.5 rounded-full bg-forest" /></div>
                </HelperCard>
                <HelperCard name="equalizer-l">
                  <div className="nxt-equalizer"><span className="w-1 bg-forest rounded-full" /><span className="w-1 bg-forest rounded-full" /><span className="w-1 bg-forest rounded-full" /><span className="w-1 bg-forest rounded-full" /></div>
                </HelperCard>
                <HelperCard name="typing-l" defaultColor="#7D8F84">
                  <div className="nxt-typing"><span className="w-2 h-2 rounded-full bg-nxt-500" /><span className="w-2 h-2 rounded-full bg-nxt-500" /><span className="w-2 h-2 rounded-full bg-nxt-500" /></div>
                </HelperCard>
                <HelperCard name="ripple-l">
                  <div className="nxt-ripple-circles w-10 h-10"><span /><span /><span /><span className="w-3 h-3 rounded-full bg-forest relative z-10" /></div>
                </HelperCard>
              </div>
            </div>
          </div>
          {/* Gradiente */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-3">
                  <HelperCard name="wave-dots-g">
                    <div className="nxt-wave-dots"><span className="w-2.5 h-2.5 rounded-full bg-forest" /><span className="w-2.5 h-2.5 rounded-full bg-forest" /><span className="w-2.5 h-2.5 rounded-full bg-forest" /></div>
                  </HelperCard>
                  <HelperCard name="equalizer-g">
                    <div className="nxt-equalizer"><span className="w-1 bg-forest rounded-full" /><span className="w-1 bg-forest rounded-full" /><span className="w-1 bg-forest rounded-full" /><span className="w-1 bg-forest rounded-full" /></div>
                  </HelperCard>
                  <HelperCard name="typing-g" defaultColor="#FFFFFF">
                    <div className="nxt-typing"><span className="w-2 h-2 rounded-full bg-white/60" /><span className="w-2 h-2 rounded-full bg-white/60" /><span className="w-2 h-2 rounded-full bg-white/60" /></div>
                  </HelperCard>
                  <HelperCard name="ripple-g">
                    <div className="nxt-ripple-circles w-10 h-10"><span /><span /><span /><span className="w-3 h-3 rounded-full bg-forest relative z-10" /></div>
                  </HelperCard>
                </div>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full">
              <div className="grid grid-cols-2 gap-3">
                <HelperCard name="wave-dots-d">
                  <div className="nxt-wave-dots"><span className="w-2.5 h-2.5 rounded-full bg-forest" /><span className="w-2.5 h-2.5 rounded-full bg-forest" /><span className="w-2.5 h-2.5 rounded-full bg-forest" /></div>
                </HelperCard>
                <HelperCard name="equalizer-d">
                  <div className="nxt-equalizer"><span className="w-1 bg-forest rounded-full" /><span className="w-1 bg-forest rounded-full" /><span className="w-1 bg-forest rounded-full" /><span className="w-1 bg-forest rounded-full" /></div>
                </HelperCard>
                <HelperCard name="typing-d" defaultColor="#9EADA3">
                  <div className="nxt-typing"><span className="w-2 h-2 rounded-full bg-gray-400" /><span className="w-2 h-2 rounded-full bg-gray-400" /><span className="w-2 h-2 rounded-full bg-gray-400" /></div>
                </HelperCard>
                <HelperCard name="ripple-d">
                  <div className="nxt-ripple-circles w-10 h-10"><span /><span /><span /><span className="w-3 h-3 rounded-full bg-forest relative z-10" /></div>
                </HelperCard>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-nxt-400 mb-2 uppercase tracking-wider">Todos los Helpers compuestos</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          <HelperCard name="wave-dots">
            <div className="nxt-wave-dots">
              <span className="w-2.5 h-2.5 rounded-full bg-forest" />
              <span className="w-2.5 h-2.5 rounded-full bg-forest" />
              <span className="w-2.5 h-2.5 rounded-full bg-forest" />
            </div>
          </HelperCard>
          <HelperCard name="equalizer">
            <div className="nxt-equalizer">
              <span className="w-1 bg-forest rounded-full" />
              <span className="w-1 bg-forest rounded-full" />
              <span className="w-1 bg-forest rounded-full" />
              <span className="w-1 bg-forest rounded-full" />
            </div>
          </HelperCard>
          <HelperCard name="stagger">
            <div className="nxt-stagger flex gap-1">
              {[1,2,3,4,5].map((i) => (
                <span key={i} className="w-3 h-3 rounded bg-forest" />
              ))}
            </div>
          </HelperCard>
          <HelperCard name="typing" defaultColor="#7D8F84">
            <div className="nxt-typing">
              <span className="w-2 h-2 rounded-full bg-nxt-500" />
              <span className="w-2 h-2 rounded-full bg-nxt-500" />
              <span className="w-2 h-2 rounded-full bg-nxt-500" />
            </div>
          </HelperCard>
          <HelperCard name="traffic-light" defaultColor="#DC2626">
            <div className="nxt-traffic-light">
              <span className="w-3 h-3 rounded-full bg-error" />
              <span className="w-3 h-3 rounded-full bg-warning" />
              <span className="w-3 h-3 rounded-full bg-success" />
            </div>
          </HelperCard>
          <HelperCard name="signal-bars" defaultColor="#059669">
            <div className="nxt-signal-bars">
              <span className="w-1.5 h-[5px] bg-success rounded-sm" />
              <span className="w-1.5 h-[9px] bg-success rounded-sm" />
              <span className="w-1.5 h-[13px] bg-success rounded-sm" />
              <span className="w-1.5 h-[17px] bg-success rounded-sm" />
            </div>
          </HelperCard>
          <HelperCard name="ripple-circles">
            <div className="nxt-ripple-circles w-10 h-10">
              <span /><span /><span />
              <span className="w-3 h-3 rounded-full bg-forest relative z-10" />
            </div>
          </HelperCard>
          <HelperCard name="radar">
            <div className="nxt-radar">
              <span className="nxt-radar__dot" />
            </div>
          </HelperCard>
          <HelperCard name="orbit-dots">
            <div className="nxt-orbit-dots">
              <span /><span /><span />
            </div>
          </HelperCard>
          <HelperCard name="breathing-ring">
            <div className="nxt-breathing-ring w-10 h-10">
              <span className="nxt-breathing-ring__ring" />
              <span className="nxt-breathing-ring__ring" />
              <span className="nxt-breathing-ring__ring" />
              <span className="w-3 h-3 rounded-full bg-forest relative z-10" />
            </div>
          </HelperCard>
          <HelperCard name="flip-counter">
            <div className="nxt-flip-counter">
              <span>1</span><span>2</span><span>3</span><span>4</span>
            </div>
          </HelperCard>
          <HelperCard name="progress-steps">
            <div className="nxt-progress-steps">
              <span className="nxt-progress-steps__step">1</span>
              <span className="nxt-progress-steps__line" />
              <span className="nxt-progress-steps__step">2</span>
              <span className="nxt-progress-steps__line" />
              <span className="nxt-progress-steps__step">3</span>
            </div>
          </HelperCard>
          <HelperCard name="loading-card">
            <div className="nxt-loading-card w-full">
              <div className="nxt-loading-card__row" />
              <div className="nxt-loading-card__row" />
              <div className="nxt-loading-card__row" />
              <div className="nxt-loading-card__row" />
            </div>
          </HelperCard>
          <HelperCard name="bouncing-balls">
            <div className="nxt-bouncing-balls">
              <span className="w-3 h-3 rounded-full bg-forest" />
              <span className="w-3 h-3 rounded-full bg-info" />
              <span className="w-3 h-3 rounded-full bg-success" />
            </div>
          </HelperCard>
          <HelperCard name="battery">
            <div className="nxt-battery">
              <div className="nxt-battery__body" />
              <div className="nxt-battery__tip" />
            </div>
          </HelperCard>
          <HelperCard name="bell" defaultColor="#304040">
            <div className="nxt-bell">
              <svg className="w-6 h-6 text-nxt-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
              <span className="nxt-bell__badge" />
            </div>
          </HelperCard>
          <HelperCard name="sound-wave" defaultColor="#2563EB">
            <div className="nxt-sound-wave">
              <span className="w-1 bg-info rounded-full" />
              <span className="w-1 bg-info rounded-full" />
              <span className="w-1 bg-info rounded-full" />
              <span className="w-1 bg-info rounded-full" />
              <span className="w-1 bg-info rounded-full" />
            </div>
          </HelperCard>
          <HelperCard name="sparkles">
            <div className="nxt-sparkles">
              <span /><span /><span /><span />
            </div>
          </HelperCard>
          <HelperCard name="hourglass">
            <div className="nxt-hourglass">&#9203;</div>
          </HelperCard>
          <HelperCard name="domino" defaultColor="#304040">
            <div className="nxt-domino">
              <span className="w-2 h-6 bg-nxt-700 rounded-sm" />
              <span className="w-2 h-6 bg-nxt-600 rounded-sm" />
              <span className="w-2 h-6 bg-nxt-500 rounded-sm" />
              <span className="w-2 h-6 bg-nxt-400 rounded-sm" />
              <span className="w-2 h-6 bg-nxt-300 rounded-sm" />
            </div>
          </HelperCard>
          <HelperCard name="circle-progress">
            <div className="nxt-circle-progress">
              <svg width="44" height="44">
                <circle className="nxt-circle-progress__track" cx="22" cy="22" r="20" />
                <circle className="nxt-circle-progress__fill" cx="22" cy="22" r="20" />
              </svg>
            </div>
          </HelperCard>
          <HelperCard name="pendulum">
            <div className="nxt-pendulum">
              <div className="w-0.5 h-8 bg-nxt-400" />
              <div className="w-4 h-4 rounded-full bg-forest -mt-0.5" />
            </div>
          </HelperCard>
          <HelperCard name="carousel-dots">
            <div className="nxt-carousel-dots">
              <span /><span /><span /><span />
            </div>
          </HelperCard>
          <HelperCard name="dna-helix" defaultColor="#2563EB">
            <div className="nxt-dna">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="nxt-dna__pair">
                  <span className="w-2 h-2 rounded-full bg-info" />
                  <span className="w-2 h-2 rounded-full bg-error" />
                </div>
              ))}
            </div>
          </HelperCard>
          <HelperCard name="metronome">
            <div className="flex flex-col items-center">
              <div className="nxt-metronome">
                <div className="w-0.5 h-10 bg-nxt-500" />
                <div className="w-3 h-3 rounded-full bg-forest -mt-0.5" />
              </div>
              <div className="w-8 h-1 bg-nxt-300 rounded mt-1" />
            </div>
          </HelperCard>
        </div>

        <div className="bg-nxt-100 rounded-nxt-md p-3 mt-2 text-xs text-nxt-600">
          <strong>Tailwind:</strong> className="animate-nxt-tada" | <strong>CSS:</strong> .nxt-animate-tada | <strong>Accesibilidad:</strong> prefers-reduced-motion desactiva todas
        </div>
      </Section>
    </div>
  );
}
