import { useState, useRef, useEffect, useCallback, type ReactNode, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Pencil, X, RotateCcw, Search } from "lucide-react";
import { useColorOverrides } from "../contexts/ColorOverrideContext";

const WEIGHTS = [
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi" },
  { value: "700", label: "Bold" },
];

/* ─── Google Fonts catalog (curated, sorted by popularity) ──────── */
const GOOGLE_FONTS = [
  // ── Sans Serif (popular) ──
  "DM Sans", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins", "Nunito",
  "Raleway", "Ubuntu", "Oswald", "Source Sans 3", "Noto Sans", "Rubik",
  "Work Sans", "DM Sans", "Outfit", "Manrope", "Space Grotesk",
  "Plus Jakarta Sans", "Nunito Sans", "Mukta", "Quicksand", "Barlow", "Mulish",
  "Josefin Sans", "Titillium Web", "Karla", "Libre Franklin", "Cabin", "Archivo",
  "Exo 2", "Overpass", "Urbanist", "Sora", "Figtree", "Lexend",
  "Albert Sans", "Red Hat Display", "Onest",
  // ── Sans Serif (extended) ──
  "Hind", "Asap", "Catamaran", "Kanit", "Signika", "Varela Round",
  "Abel", "Assistant", "Dosis", "Maven Pro", "Sarabun", "Prompt",
  "Yanone Kaffeesatz", "Acme", "Questrial", "Cantarell", "Nanum Gothic",
  "Istok Web", "Didact Gothic", "Chivo", "Schibsted Grotesk", "Geologica",
  "Bricolage Grotesque", "Hanken Grotesk", "Wix Madefor Display",
  "Be Vietnam Pro", "Readex Pro", "Atkinson Hyperlegible", "Public Sans",
  "Jost", "Encode Sans", "Tenor Sans", "Zen Kaku Gothic New",
  "Red Hat Text", "IBM Plex Sans", "Commissioner", "Libre Caslon Text",
  "Gudea", "Mada", "Ysabeau", "Gabarito", "Rethink Sans",
  "Inclusive Sans", "Pathway Extreme", "Afacad", "Familjen Grotesk",
  // ── Serif ──
  "Merriweather", "Playfair Display", "Lora", "PT Serif", "Crimson Text",
  "Source Serif 4", "Libre Baskerville", "EB Garamond", "Cormorant Garamond",
  "Bitter", "Arvo", "Vollkorn", "Spectral", "Noto Serif", "Domine",
  "Cardo", "Crimson Pro", "Alegreya", "Old Standard TT", "Unna",
  "Frank Ruhl Libre", "Brygada 1918", "Fraunces", "Newsreader",
  "Gelasio", "Literata", "Baskervville", "Cormorant", "Young Serif",
  "Instrument Serif", "DM Serif Display", "DM Serif Text",
  "Bodoni Moda", "Gloock", "Sorts Mill Goudy", "Mate",
  "Zilla Slab", "Faustina", "Aleo", "Petrona", "Rokkitt",
  // ── Monospace ──
  "JetBrains Mono", "Fira Code", "Source Code Pro", "IBM Plex Mono", "Roboto Mono",
  "Ubuntu Mono", "Space Mono", "Inconsolata", "DM Mono",
  "Red Hat Mono", "Overpass Mono", "Anonymous Pro", "Cousine",
  "Nanum Gothic Coding", "Share Tech Mono", "Azeret Mono", "Martian Mono",
  "Fragment Mono", "Sometype Mono", "Commit Mono",
  // ── Display ──
  "Bebas Neue", "Righteous", "Abril Fatface", "Permanent Marker", "Pacifico",
  "Lobster", "Comfortaa", "Fredoka", "Baloo 2", "Concert One",
  "Lilita One", "Bungee", "Press Start 2P", "Silkscreen",
  "Bangers", "Bungee Shade", "Monoton", "Rubik Mono One",
  "Fascinate Inline", "Ultra", "Passion One", "Bowlby One SC",
  "Luckiest Guy", "Bungee Inline", "Audiowide", "Orbitron",
  "Russo One", "Teko", "Chakra Petch", "Rajdhani", "Michroma",
  "Saira Condensed", "Big Shoulders Display", "Anton", "Staatliches",
  "Black Ops One", "Baumans", "Squada One", "Fugaz One",
  "Rampart One", "Honk", "Nabla", "Rubik Glitch",
  // ── Handwriting / Script ──
  "Caveat", "Dancing Script", "Sacramento", "Great Vibes", "Satisfy",
  "Parisienne", "Kalam", "Patrick Hand", "Indie Flower", "Shadows Into Light",
  "Architects Daughter", "Amatic SC", "Courgette", "Cookie", "Handlee",
  "Rock Salt", "Covered By Your Grace", "Gloria Hallelujah", "Reenie Beanie",
  "Homemade Apple", "Playwrite DE Grund", "Edu NSW ACT Foundation",
  "Playpen Sans", "Klee One", "Shantell Sans",
];
// Deduplicate
const FONT_CATALOG = [...new Set(GOOGLE_FONTS)];

/* ─── Load Google Font dynamically ──────────────────────────────── */
const loadedFonts = new Set<string>();
function loadGoogleFont(family: string) {
  if (!family || loadedFonts.has(family)) return;
  loadedFonts.add(family);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

/* ─── Font Search Component ─────────────────────────────────────── */
function FontSearch({
  value,
  onSelect,
  onClear,
}: {
  value: string;
  onSelect: (font: string) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? FONT_CATALOG.filter((f) => f.toLowerCase().includes(query.toLowerCase())).slice(0, 30)
    : FONT_CATALOG.slice(0, 30);

  // Preload visible fonts for preview
  useEffect(() => {
    if (showDrop) filtered.forEach((f) => loadGoogleFont(f));
  }, [showDrop, filtered]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!showDrop) return;
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current && !inputRef.current.contains(e.target as Node) &&
        dropRef.current && !dropRef.current.contains(e.target as Node)
      ) {
        setShowDrop(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDrop]);

  return (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <div style={{ position: "relative" }}>
        <Search size={12} style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#9EADA3", pointerEvents: "none" }} />
        <input
          ref={inputRef}
          type="text"
          value={showDrop ? query : (value || "")}
          placeholder={value || "Buscar fuente..."}
          onFocus={() => { setQuery(""); setShowDrop(true); }}
          onChange={(e) => { setQuery(e.target.value); setShowDrop(true); }}
          style={{
            width: "100%", padding: "6px 8px 6px 26px", border: "1px solid #DFE4E0",
            borderRadius: 6, fontSize: 12, backgroundColor: "white",
            fontFamily: value ? `"${value}", sans-serif` : "inherit",
          }}
        />
        {value && (
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); setQuery(""); }}
            style={{
              position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: "#9EADA3", padding: 2,
            }}
            title="Resetear a default"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {showDrop && (
        <div
          ref={dropRef}
          style={{
            position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
            maxHeight: 200, overflowY: "auto",
            backgroundColor: "white", border: "1px solid #DFE4E0",
            borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 10,
          }}
        >
          {/* Default option */}
          <button
            onClick={() => { onClear(); setShowDrop(false); setQuery(""); }}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "8px 12px", fontSize: 12, border: "none",
              backgroundColor: !value ? "rgba(255,212,20,0.1)" : "transparent",
              cursor: "pointer", color: "#7D8F84", fontStyle: "italic",
            }}
            onMouseEnter={(e) => { if (value) e.currentTarget.style.backgroundColor = "#F7F8F7"; }}
            onMouseLeave={(e) => { if (value) e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            Default (Inter)
          </button>

          {filtered.length === 0 && (
            <div style={{ padding: "12px", fontSize: 11, color: "#9EADA3", textAlign: "center" }}>
              No se encontraron fuentes
            </div>
          )}

          {filtered.map((font) => (
            <button
              key={font}
              onClick={() => {
                onSelect(font);
                setShowDrop(false);
                setQuery("");
              }}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                width: "100%", textAlign: "left",
                padding: "8px 12px", fontSize: 13, border: "none",
                backgroundColor: font === value ? "rgba(255,212,20,0.1)" : "transparent",
                cursor: "pointer", color: "#04202C",
                fontFamily: `"${font}", sans-serif`,
              }}
              onMouseEnter={(e) => { if (font !== value) e.currentTarget.style.backgroundColor = "#F7F8F7"; }}
              onMouseLeave={(e) => { if (font !== value) e.currentTarget.style.backgroundColor = font === value ? "rgba(255,212,20,0.1)" : "transparent"; }}
            >
              <span>{font}</span>
              {font === value && <span style={{ fontSize: 10, color: "#04202C" }}>&#10003;</span>}
            </button>
          ))}

          {query.trim() && !FONT_CATALOG.some((f) => f.toLowerCase() === query.trim().toLowerCase()) && (
            <>
              <div style={{ borderTop: "1px solid #EFF2F0", margin: "4px 0" }} />
              <button
                onClick={() => {
                  const custom = query.trim();
                  loadGoogleFont(custom);
                  onSelect(custom);
                  setShowDrop(false);
                  setQuery("");
                }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "8px 12px", fontSize: 12, border: "none",
                  backgroundColor: "transparent", cursor: "pointer",
                  color: "#3B82F6",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EFF6FF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                + Usar "{query.trim()}" de Google Fonts
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────── */
interface TypoEditableProps {
  typoKey: string;
  defaultColor?: string;
  defaultSize?: string;
  defaultWeight?: string;
  alwaysEditable?: boolean;
  children: (style: CSSProperties, openEditor: () => void, hasOverrides: boolean) => ReactNode;
}

export function TypoEditable({ typoKey, defaultColor, defaultSize, defaultWeight, alwaysEditable, children }: TypoEditableProps) {
  const { getOverride, setOverride, removeOverride, editMode } = useColorOverrides();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const key = "typo." + typoKey;
  const colorOv = getOverride(key, "color");
  const sizeOv = getOverride(key, "fontSize");
  const weightOv = getOverride(key, "fontWeight");
  const fontOv = getOverride(key, "fontFamily");

  const curColor = colorOv || defaultColor || "";
  const curSize = sizeOv || defaultSize || "";
  const curWeight = weightOv || defaultWeight || "";
  const curFont = fontOv || "";

  const hasOv = !!(colorOv || sizeOv || weightOv || fontOv);

  const style: CSSProperties = {};
  if (colorOv) style.color = colorOv;
  if (sizeOv) style.fontSize = sizeOv;
  if (weightOv) style.fontWeight = Number(weightOv);
  if (fontOv) { style.fontFamily = `"${fontOv}", sans-serif`; loadGoogleFont(fontOv); }

  const openEditor = useCallback(() => setOpen(true), []);
  const closeEditor = useCallback(() => setOpen(false), []);

  const resetAll = useCallback(() => {
    removeOverride(key, "color");
    removeOverride(key, "fontSize");
    removeOverride(key, "fontWeight");
    removeOverride(key, "fontFamily");
  }, [key, removeOverride]);

  const isEditable = alwaysEditable || editMode;

  if (!isEditable) return <>{children(style, () => {}, hasOv)}</>;

  return (
    <div
      ref={triggerRef}
      style={{
        position: "relative",
        border: hasOv ? "2px solid #04202C" : "1px dashed #C9D1C8",
        borderRadius: 8,
        padding: 4,
        cursor: "pointer",
        transition: "border 0.2s",
      }}
      onClick={openEditor}
    >
      {children(style, openEditor, hasOv)}

      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        style={{
          position: "absolute", right: 4, top: 4, zIndex: 20,
          display: "flex", alignItems: "center", gap: 3,
          padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600,
          backgroundColor: hasOv ? "#04202C" : "#7D8F84",
          color: hasOv ? "#04202C" : "#FFFFFF",
          border: "none", cursor: "pointer",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        <Pencil size={9} />
        <span>Aa</span>
      </button>

      {open && (
        <PortalTypoPicker
          triggerRef={triggerRef}
          typoKey={typoKey}
          curFont={curFont}
          curColor={curColor}
          curSize={curSize}
          curWeight={curWeight}
          defaultColor={defaultColor}
          defaultSize={defaultSize}
          defaultWeight={defaultWeight}
          hasOv={hasOv}
          weightOv={weightOv}
          onSetOverride={(prop, val) => setOverride(key, prop, val)}
          onRemoveOverride={(prop) => removeOverride(key, prop)}
          onResetAll={resetAll}
          onClose={closeEditor}
        />
      )}
    </div>
  );
}

/* ─── Portal picker (isolated from parent event tree) ──────────── */
function PortalTypoPicker({
  triggerRef,
  typoKey,
  curFont,
  curColor,
  curSize,
  curWeight,
  defaultColor,
  defaultSize,
  defaultWeight,
  hasOv,
  weightOv,
  onSetOverride,
  onRemoveOverride,
  onResetAll,
  onClose,
}: {
  triggerRef: React.RefObject<HTMLDivElement | null>;
  typoKey: string;
  curFont: string;
  curColor: string;
  curSize: string;
  curWeight: string;
  defaultColor?: string;
  defaultSize?: string;
  defaultWeight?: string;
  hasOv: boolean;
  weightOv: string | undefined;
  onSetOverride: (prop: string, val: string) => void;
  onRemoveOverride: (prop: string) => void;
  onResetAll: () => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    function calcPos() {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const popupW = 320;
      const popupH = 480;
      let left = rect.left;
      let top = rect.bottom + 8;
      if (left + popupW > window.innerWidth - 12) left = window.innerWidth - popupW - 12;
      if (left < 8) left = 8;
      if (top + popupH > window.innerHeight) top = rect.top - popupH - 8;
      if (top < 8) top = 8;
      setPos({ top, left });
    }
    calcPos();
    window.addEventListener("scroll", calcPos, true);
    window.addEventListener("resize", calcPos);
    return () => {
      window.removeEventListener("scroll", calcPos, true);
      window.removeEventListener("resize", calcPos);
    };
  }, [triggerRef]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return createPortal(
    <div
      ref={containerRef}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 99999,
        backgroundColor: "white",
        borderRadius: 12,
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        border: "1px solid #DFE4E0",
        padding: 16,
        width: 310,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#304040" }}>Tipografia: {typoKey}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {hasOv && (
            <button onClick={onResetAll} style={{ color: "#9EADA3", cursor: "pointer", background: "none", border: "none", padding: 2 }} title="Resetear">
              <RotateCcw size={12} />
            </button>
          )}
          <button onClick={onClose} style={{ color: "#9EADA3", cursor: "pointer", background: "none", border: "none", padding: 2 }}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Font Family — searchable */}
      <label style={{ display: "block", fontSize: 10, fontWeight: 500, color: "#7D8F84", marginBottom: 4 }}>Fuente</label>
      <FontSearch
        value={curFont}
        onSelect={(font) => {
          onSetOverride("fontFamily", font);
          loadGoogleFont(font);
        }}
        onClear={() => onRemoveOverride("fontFamily")}
      />

      {/* Color */}
      <label style={{ display: "block", fontSize: 10, fontWeight: 500, color: "#7D8F84", marginBottom: 4 }}>Color</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="color"
          value={curColor || "#04202C"}
          onChange={(e) => onSetOverride("color", e.target.value)}
          style={{ width: 32, height: 32, borderRadius: 4, border: "1px solid #DFE4E0", cursor: "pointer", padding: 2 }}
        />
        <input
          type="text"
          value={curColor}
          onChange={(e) => onSetOverride("color", e.target.value)}
          placeholder={defaultColor || "#04202C"}
          style={{ flex: 1, padding: "4px 8px", border: "1px solid #DFE4E0", borderRadius: 4, fontSize: 12, fontFamily: "monospace" }}
        />
      </div>

      {/* Size */}
      <label style={{ display: "block", fontSize: 10, fontWeight: 500, color: "#7D8F84", marginBottom: 4 }}>Tamano (px)</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="range" min={8} max={72}
          value={parseInt(curSize) || parseInt(defaultSize || "14")}
          onChange={(e) => onSetOverride("fontSize", e.target.value + "px")}
          style={{ flex: 1 }}
        />
        <input
          type="number"
          value={parseInt(curSize) || parseInt(defaultSize || "14")}
          onChange={(e) => onSetOverride("fontSize", e.target.value + "px")}
          min={8} max={72}
          style={{ width: 56, padding: "4px 8px", border: "1px solid #DFE4E0", borderRadius: 4, fontSize: 12, fontFamily: "monospace", textAlign: "center" as const }}
        />
      </div>

      {/* Weight */}
      <label style={{ display: "block", fontSize: 10, fontWeight: 500, color: "#7D8F84", marginBottom: 4 }}>Peso</label>
      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        {WEIGHTS.map((w) => {
          const active = curWeight === w.value || (!weightOv && defaultWeight === w.value);
          return (
            <button
              key={w.value}
              onClick={() => onSetOverride("fontWeight", w.value)}
              style={{
                flex: 1, padding: "6px 4px", fontSize: 10, fontWeight: 500, borderRadius: 6,
                border: active ? "1px solid #04202C" : "1px solid #DFE4E0",
                backgroundColor: active ? "rgba(255,212,20,0.1)" : "white",
                color: active ? "#04202C" : "#7D8F84", cursor: "pointer",
              }}
            >
              {w.label}
            </button>
          );
        })}
      </div>

      {/* Preview — adaptive background based on text brightness */}
      {(() => {
        const hex = curColor || defaultColor || "#04202C";
        const r = parseInt(hex.slice(1, 3), 16) || 0;
        const g = parseInt(hex.slice(3, 5), 16) || 0;
        const b = parseInt(hex.slice(5, 7), 16) || 0;
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const isLight = luminance > 0.6;
        const previewBg = isLight ? "#04202C" : "#F7F8F7";
        const labelColor = isLight ? "#7D8F84" : "#9EADA3";
        const borderColor = isLight ? "#304040" : "#EFF2F0";
        return (
          <div style={{ padding: 10, backgroundColor: previewBg, borderRadius: 8, border: `1px solid ${borderColor}`, transition: "background-color 0.2s" }}>
            <p style={{ fontSize: 10, color: labelColor, marginBottom: 4, marginTop: 0 }}>Preview</p>
            <p style={{
              color: hex,
              fontSize: curSize || defaultSize,
              fontWeight: Number(curWeight || defaultWeight || 400),
              fontFamily: curFont ? `"${curFont}", sans-serif` : "inherit",
              margin: 0,
            }}>
              Texto de ejemplo Aa 123
            </p>
          </div>
        );
      })()}
    </div>,
    document.body
  );
}
