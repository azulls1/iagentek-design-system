/**
 * Brand tokens whose Tailwind classes resolve through CSS variables.
 * For these, prefer reading the live `--color-*` value at lookup time so
 * the color picker reflects the ACTIVE template's palette, not the
 * iagentek defaults baked into twColorMap.
 */
const BRAND_TOKENS = new Set([
  "primary", "primary-light", "primary-hover", "primary-active",
  "forest", "evergreen", "pine", "fog", "moss", "bark", "midnight",
  "nxt-50", "nxt-100", "nxt-200", "nxt-300", "nxt-400", "nxt-500",
  "nxt-600", "nxt-700", "nxt-800", "nxt-900",
  "nav-bg", "page", "surface", "surface-dark", "surface-darker", "surface-darkest",
]);

function readCssVar(name: string): string | undefined {
  if (typeof window === "undefined" || !document?.documentElement) return undefined;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || undefined;
}

/** Resolve a brand token (without `bg-`/`text-` prefix) via live CSS var, fallback to map. */
function resolveBrandToken(token: string, prefix: "bg" | "text"): string | undefined {
  if (!BRAND_TOKENS.has(token)) return undefined;
  return readCssVar(`--color-${token}`) || twColorMap[`${prefix}-${token}`];
}

/**
 * Mapa de clases Tailwind/forest → hex values
 * Basado en Forest Design System tokens. For brand tokens, used as fallback
 * when CSS vars are not available (SSR or pre-mount).
 */
export const twColorMap: Record<string, string> = {
  // Primary (Forest)
  "bg-primary": "#04202C",
  "bg-primary-light": "#5B7065",
  "bg-primary-hover": "#1A3036",
  "bg-primary-active": "#021519",
  // Forest named
  "bg-forest": "#04202C",
  "bg-evergreen": "#304040",
  "bg-pine": "#5B7065",
  "bg-fog": "#C9D1C8",
  "bg-moss": "#9EADA3",
  "bg-bark": "#1A3036",
  "bg-midnight": "#021519",
  // Gray scale (forest-tinted)
  "bg-nxt-50": "#F7F8F7",
  "bg-nxt-100": "#EFF2F0",
  "bg-nxt-200": "#DFE4E0",
  "bg-nxt-300": "#C9D1C8",
  "bg-nxt-400": "#9EADA3",
  "bg-nxt-500": "#7D8F84",
  "bg-nxt-600": "#5B7065",
  "bg-nxt-700": "#304040",
  "bg-nxt-800": "#1A3036",
  "bg-nxt-900": "#04202C",
  // Status
  "bg-success": "#059669",
  "bg-success-light": "#ECFDF5",
  "bg-warning": "#D97706",
  "bg-warning-light": "#FFFBEB",
  "bg-error": "#DC2626",
  "bg-error-light": "#FEF2F2",
  "bg-info": "#2563EB",
  "bg-info-light": "#EFF6FF",
  // Nav
  "bg-nav-bg": "#04202C",
  // Surfaces
  "bg-page": "#F7F8F7",
  "bg-surface": "#FFFFFF",
  "bg-surface-dark": "#304040",
  "bg-surface-darker": "#1A3036",
  "bg-surface-darkest": "#021519",
  // Text
  "text-primary": "#04202C",
  "text-forest": "#04202C",
  "text-evergreen": "#304040",
  "text-pine": "#5B7065",
  "text-fog": "#C9D1C8",
  "text-moss": "#9EADA3",
  "text-bark": "#1A3036",
  "text-nxt-50": "#F7F8F7",
  "text-nxt-100": "#EFF2F0",
  "text-nxt-200": "#DFE4E0",
  "text-nxt-300": "#C9D1C8",
  "text-nxt-400": "#9EADA3",
  "text-nxt-500": "#7D8F84",
  "text-nxt-600": "#5B7065",
  "text-nxt-700": "#304040",
  "text-nxt-800": "#1A3036",
  "text-nxt-900": "#04202C",
  "text-success": "#059669",
  "text-warning": "#D97706",
  "text-error": "#DC2626",
  "text-info": "#2563EB",
  "text-white": "#FFFFFF",
  // Button classes → bg hex
  "nxt-btn-primary": "#04202C",
  "nxt-btn-secondary": "#EFF2F0",
  "nxt-btn-danger": "#DC2626",
  "nxt-btn-success": "#059669",
  "nxt-btn-info": "#2563EB",
  "nxt-btn-warning": "#D97706",
  "nxt-btn-ghost": "transparent",
  // Tailwind standard palette (used in outline/gradient buttons)
  "bg-red-400": "#F87171", "bg-red-500": "#EF4444", "bg-red-600": "#DC2626",
  "bg-blue-400": "#60A5FA", "bg-blue-500": "#3B82F6", "bg-blue-600": "#2563EB",
  "bg-green-400": "#4ADE80", "bg-green-500": "#22C55E", "bg-green-600": "#16A34A",
  "bg-amber-400": "#FBBF24", "bg-amber-500": "#F59E0B",
  "bg-yellow-300": "#FDE047", "bg-yellow-400": "#FACC15",
  "bg-gray-400": "#9EADA3", "bg-gray-500": "#7D8F84",
  "bg-purple-500": "#A855F7", "bg-purple-600": "#9333EA",
  "bg-pink-500": "#EC4899",
  "bg-cyan-400": "#22D3EE", "bg-cyan-500": "#06B6D4",
  "text-red-300": "#FCA5A5", "text-red-400": "#F87171",
  "text-blue-400": "#60A5FA",
  "text-green-400": "#4ADE80",
  "text-amber-400": "#FBBF24",
  "text-gray-200": "#DFE4E0", "text-gray-300": "#C9D1C8", "text-gray-400": "#9EADA3",
  "text-cyan-400": "#22D3EE",
};

/**
 * Extrae el hex de background de una cadena de clases Tailwind.
 * Busca en orden: clase nxt-btn-*, bg-[#hex], bg-<token>
 */
export function resolveDefaultBg(cls: string): string | undefined {
  // 1. nxt-btn-* class
  const btnMatch = cls.match(/nxt-btn-(\w+)/);
  if (btnMatch) return twColorMap[`nxt-btn-${btnMatch[1]}`];

  // 2. Arbitrary bg-[#hex]
  const arbMatch = cls.match(/bg-\[(#[0-9a-fA-F]{3,8})\]/);
  if (arbMatch) return arbMatch[1];

  // 3. Known bg-<token> classes — prefer live CSS vars for brand tokens
  const bgClasses = cls.split(/\s+/).filter((c) => c.startsWith("bg-") && !c.startsWith("bg-transparent") && !c.startsWith("bg-white/"));
  for (const bgCls of bgClasses) {
    const clean = bgCls.replace(/\/\d+$/, "");
    const token = clean.replace(/^bg-/, "");
    const brand = resolveBrandToken(token, "bg");
    if (brand) return brand;
    if (twColorMap[clean]) return twColorMap[clean];
  }

  return undefined;
}

/**
 * Extrae el color dominante de una cadena de clases: bg → border → text.
 * Para botones outline/ghost/link que no tienen bg, busca border o text color.
 */
export function resolveDominantColor(cls: string): string | undefined {
  // 1. Try background first
  const bg = resolveDefaultBg(cls);
  if (bg && bg !== "transparent") return bg;

  // 2-3. Border colors (skip border-2, border-l-*, border-transparent, border-white/*)
  const borderClasses = cls.split(/\s+/).filter((c) =>
    c.startsWith("border-") &&
    !c.startsWith("border-l-") && !c.startsWith("border-r-") &&
    !c.startsWith("border-t-") && !c.startsWith("border-b-") &&
    !/^border-\d/.test(c) && !c.startsWith("border-transparent") &&
    !/^border-white/.test(c) && !/^border-\[#/.test(c)
  );
  for (const bCls of borderClasses) {
    const mapped = bCls.replace("border-", "bg-").replace(/\/\d+$/, "");
    const token = mapped.replace(/^bg-/, "");
    const brand = resolveBrandToken(token, "bg");
    if (brand) return brand;
    if (twColorMap[mapped]) return twColorMap[mapped];
  }

  // 3b. Arbitrary border-[#hex]
  const borderArb2 = cls.match(/border-\[(#[0-9a-fA-F]{3,8})\]/);
  if (borderArb2) return borderArb2[1];

  // 4. Arbitrary text-[#hex]
  const textArb = cls.match(/text-\[(#[0-9a-fA-F]{3,8})\]/);
  if (textArb) return textArb[1];

  // 5. Known text-<color> classes — prefer live CSS vars for brand tokens
  const textClasses = cls.split(/\s+/).filter((c) => c.startsWith("text-") && !c.startsWith("text-[") && !c.startsWith("text-sm") && !c.startsWith("text-xs") && !c.startsWith("text-base") && !c.startsWith("text-lg") && !c.startsWith("text-center"));
  for (const tCls of textClasses) {
    const token = tCls.replace(/^text-/, "");
    const brand = resolveBrandToken(token, "text");
    if (brand) return brand;
    if (twColorMap[tCls]) return twColorMap[tCls];
  }

  return undefined;
}

/**
 * Extrae el color de fondo en hover de una cadena de clases.
 * Solo busca hover:bg-* — el color de RELLENO al hacer hover.
 */
export function resolveHoverColor(cls: string): string | undefined {
  // hover:bg-[#hex]
  const hoverBgArb = cls.match(/hover:bg-\[(#[0-9a-fA-F]{3,8})\]/);
  if (hoverBgArb) return hoverBgArb[1];

  // hover:bg-<token> (skip hover:bg-white/* opacity variants) — prefer live CSS vars
  const hoverBgAll = cls.match(/hover:bg-([^\s]+)/g) || [];
  for (const hb of hoverBgAll) {
    const token = hb.replace("hover:bg-", "");
    if (/^white\/\d+$/.test(token)) continue;
    const cleanToken = token.replace(/\/\d+$/, "");
    const brand = resolveBrandToken(cleanToken, "bg");
    if (brand) return brand;
    const mapped = `bg-${cleanToken}`;
    if (twColorMap[mapped]) return twColorMap[mapped];
  }

  return undefined;
}

/**
 * Extrae el hex de text color de una cadena de clases Tailwind.
 */
export function resolveDefaultText(cls: string): string | undefined {
  // 1. Arbitrary text-[#hex]
  const arbMatch = cls.match(/text-\[(#[0-9a-fA-F]{3,8})\]/);
  if (arbMatch) return arbMatch[1];

  // 2. Known text-<token> classes — prefer live CSS vars for brand tokens
  const textClasses = cls.split(/\s+/).filter((c) => c.startsWith("text-") && !c.startsWith("text-["));
  for (const txCls of textClasses) {
    const token = txCls.replace(/^text-/, "");
    const brand = resolveBrandToken(token, "text");
    if (brand) return brand;
    if (twColorMap[txCls]) return twColorMap[txCls];
  }

  return undefined;
}
