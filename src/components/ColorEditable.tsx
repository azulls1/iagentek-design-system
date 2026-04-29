import { useState, useRef, useEffect, useCallback, type ReactNode, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useColorOverrides } from "../contexts/ColorOverrideContext";

export interface StyleOverrides extends CSSProperties {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
}

export interface HoverHandlers {
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => void;
}

interface ColorEditableProps {
  elementKey: string;
  children: (
    styles: StyleOverrides,
    openPicker: () => void,
    currentHex: string,
    hoverHandlers: HoverHandlers,
    hoverHex: string,
  ) => ReactNode;
  defaultBg?: string;
  defaultHoverBg?: string;
  /** false = solo color normal (swatches, cards estáticos). true = normal + hover */
  hasHover?: boolean;
  property?: "bg" | "text" | "border";
  className?: string;
  // legacy props - ignored
  showProperties?: unknown;
  defaultText?: string;
  defaultBorder?: string;
}

const HEX_RE = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export function ColorEditable({
  elementKey,
  children,
  defaultBg,
  defaultHoverBg,
  hasHover = false,
  property = "bg",
  className = "",
}: ColorEditableProps) {
  const { getOverride, setOverride, removeOverride } = useColorOverrides();
  const [pickerOpen, setPickerOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Normal color
  const normalOverride = getOverride(elementKey, property);
  const normalHex = normalOverride || defaultBg || "";

  // Hover color
  const hoverProp = `${property}-hover`;
  const hoverOverride = getOverride(elementKey, hoverProp);
  const hoverHex = hoverOverride || defaultHoverBg || "";

  // Build normal styles
  const styleOverrides: StyleOverrides = {};
  const bgO = getOverride(elementKey, "bg");
  const txtO = getOverride(elementKey, "text");
  const brdO = getOverride(elementKey, "border");
  if (bgO) styleOverrides.backgroundColor = bgO;
  if (txtO) styleOverrides.color = txtO;
  if (brdO) styleOverrides.borderColor = brdO;

  // Build hover styles (used by onMouseEnter)
  const hoverStyles: StyleOverrides = { ...styleOverrides };
  const bgHO = getOverride(elementKey, "bg-hover");
  if (bgHO) hoverStyles.backgroundColor = bgHO;

  // Hover handlers: swap between normal and hover inline styles
  const savedStyles = useRef<Record<string, string>>({});

  const hoverHandlers: HoverHandlers = {
    onMouseEnter: useCallback((e: React.MouseEvent<HTMLElement>) => {
      if (!hasHover) return;
      const el = e.currentTarget;
      // Save current inline values
      savedStyles.current = {
        backgroundColor: el.style.backgroundColor,
      };
      // Apply hover overrides
      if (bgHO) el.style.backgroundColor = bgHO;
      else if (defaultHoverBg) el.style.backgroundColor = defaultHoverBg;
    }, [hasHover, bgHO, defaultHoverBg]),
    onMouseLeave: useCallback((e: React.MouseEvent<HTMLElement>) => {
      if (!hasHover) return;
      const el = e.currentTarget;
      // Restore saved
      el.style.backgroundColor = savedStyles.current.backgroundColor || "";
    }, [hasHover]),
  };

  return (
    <div ref={triggerRef} className={`relative ${className}`}>
      {children(styleOverrides, () => setPickerOpen(!pickerOpen), normalHex, hoverHandlers, hoverHex)}
      {pickerOpen && (
        <PortalColorPicker
          triggerRef={triggerRef}
          hasHover={hasHover}
          normalHex={normalHex}
          hoverHex={hoverHex}
          hasNormalOverride={!!normalOverride}
          hasHoverOverride={!!hoverOverride}
          onSetNormal={(hex) => setOverride(elementKey, property, hex)}
          onSetHover={(hex) => setOverride(elementKey, hoverProp, hex)}
          onResetNormal={() => removeOverride(elementKey, property)}
          onResetHover={() => removeOverride(elementKey, hoverProp)}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Hex input row (reutilizable) ───────────────────────────────
function HexRow({
  label,
  hex,
  hasOverride,
  onSet,
  onReset,
}: {
  label: string;
  hex: string;
  hasOverride: boolean;
  onSet: (v: string) => void;
  onReset: () => void;
}) {
  const [editing, setEditing] = useState(hex || "#ffffff");
  useEffect(() => { setEditing(hex || "#ffffff"); }, [hex]);

  const isValid = HEX_RE.test(editing);
  const safePicker = editing.startsWith("#") ? editing.slice(0, 7) : "#ffffff";

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[10px] font-semibold text-nxt-500 uppercase tracking-wider">{label}</span>
        {hasOverride && (
          <button onClick={onReset} className="text-[9px] text-error hover:underline flex items-center gap-0.5">
            <X size={9} /> reset
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={safePicker}
          onChange={(e) => { onSet(e.target.value); setEditing(e.target.value); }}
          className="w-8 h-8 rounded-lg cursor-pointer border border-nxt-200 p-0.5"
        />
        <input
          type="text"
          value={editing}
          maxLength={9}
          onChange={(e) => {
            let v = e.target.value;
            if (!v.startsWith("#")) v = "#" + v;
            v = "#" + v.slice(1).replace(/[^0-9a-fA-F]/g, "").slice(0, 8);
            setEditing(v);
            if (HEX_RE.test(v)) onSet(v);
          }}
          onKeyDown={(e) => { if (e.key === "Escape") (e.target as HTMLInputElement).blur(); }}
          className={`flex-1 text-xs font-mono px-2 py-1 rounded-lg bg-nxt-50 text-nxt-800 focus:outline-none transition-colors ${
            isValid ? "border border-success focus:ring-2 focus:ring-success/30" : "border-2 border-error focus:ring-2 focus:ring-error/30"
          }`}
          placeholder="#000000"
        />
      </div>
      {!isValid && <p className="text-[9px] text-error mt-0.5">#RGB, #RGBA, #RRGGBB o #RRGGBBAA</p>}
    </div>
  );
}

// ─── Portal picker ──────────────────────────────────────────────
function PortalColorPicker({
  triggerRef,
  hasHover,
  normalHex,
  hoverHex,
  hasNormalOverride,
  hasHoverOverride,
  onSetNormal,
  onSetHover,
  onResetNormal,
  onResetHover,
  onClose,
}: {
  triggerRef: React.RefObject<HTMLDivElement | null>;
  hasHover: boolean;
  normalHex: string;
  hoverHex: string;
  hasNormalOverride: boolean;
  hasHoverOverride: boolean;
  onSetNormal: (hex: string) => void;
  onSetHover: (hex: string) => void;
  onResetNormal: () => void;
  onResetHover: () => void;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const pickerW = hasHover ? 280 : 220;
      const pickerH = hasHover ? 220 : 140;
      let left = rect.left + rect.width / 2 - pickerW / 2;
      if (left < 8) left = 8;
      if (left + pickerW > window.innerWidth - 8) left = window.innerWidth - pickerW - 8;
      let top = rect.bottom + 8;
      if (top + pickerH > window.innerHeight) top = rect.top - pickerH - 8;
      setPos({ top, left });
    }
  }, [triggerRef, hasHover]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return createPortal(
    <div
      ref={containerRef}
      style={{ position: "fixed", top: pos.top, left: pos.left, zIndex: 99999 }}
      className={`bg-white rounded-xl shadow-2xl border border-nxt-200 p-3 ${hasHover ? "min-w-[280px]" : "min-w-[220px]"}`}
      onClick={(e) => e.stopPropagation()}
    >
      {hasHover ? (
        <div className="space-y-3">
          <HexRow label="Normal" hex={normalHex} hasOverride={hasNormalOverride} onSet={onSetNormal} onReset={onResetNormal} />
          <div className="border-t border-nxt-100" />
          <HexRow label="Hover" hex={hoverHex} hasOverride={hasHoverOverride} onSet={onSetHover} onReset={onResetHover} />
        </div>
      ) : (
        <HexRow label="Color" hex={normalHex} hasOverride={hasNormalOverride} onSet={onSetNormal} onReset={onResetNormal} />
      )}

      <div className="flex justify-end pt-2 mt-2 border-t border-nxt-100">
        <button onClick={onClose} className="text-[11px] text-nxt-500 hover:text-nxt-700 px-2 py-0.5 rounded hover:bg-nxt-100">
          Cerrar
        </button>
      </div>
    </div>,
    document.body,
  );
}
