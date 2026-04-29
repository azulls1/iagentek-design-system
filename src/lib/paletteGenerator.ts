// Palette generator: converts a single base hex into a full palette of
// CSS variable values. No external dependencies; uses native HSL math.

interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(hex: string): string {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return h.toUpperCase();
}

function hexToRgb(hex: string): RGB {
  const h = normalizeHex(hex);
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number): string => {
    const v = clamp(Math.round(n), 0, 255);
    return v.toString(16).padStart(2, "0").toUpperCase();
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) * 60;
        break;
      case gn:
        h = ((bn - rn) / delta + 2) * 60;
        break;
      case bn:
        h = ((rn - gn) / delta + 4) * 60;
        break;
    }
  }

  return { h, s: s * 100, l: l * 100 };
}

function hslToRgb({ h, s, l }: HSL): RGB {
  const hNorm = ((h % 360) + 360) % 360 / 360;
  const sNorm = clamp(s, 0, 100) / 100;
  const lNorm = clamp(l, 0, 100) / 100;

  if (sNorm === 0) {
    const v = lNorm * 255;
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q =
    lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
  const p = 2 * lNorm - q;

  const r = hue2rgb(p, q, hNorm + 1 / 3) * 255;
  const g = hue2rgb(p, q, hNorm) * 255;
  const b = hue2rgb(p, q, hNorm - 1 / 3) * 255;

  return { r, g, b };
}

function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

function withLightness(hsl: HSL, lightness: number): HSL {
  return { h: hsl.h, s: hsl.s, l: clamp(lightness, 0, 100) };
}

function tintedGray(hue: number, lightness: number, saturation: number): string {
  return hslToHex({
    h: hue,
    s: clamp(saturation, 0, 100),
    l: clamp(lightness, 0, 100),
  });
}

// Official Forest design system palette — exact values from design-tokens.json.
// Used by the "iagentek" template to bypass the algorithmic generator and
// match the brand swatches 1:1.
export const OFFICIAL_FOREST_PALETTE: Record<string, string> = {
  // Primary
  "color-primary": "#04202C",
  "color-primary-light": "#5B7065",
  "color-primary-hover": "#1A3036",
  "color-primary-active": "#021519",

  // Forest named palette
  "color-forest": "#04202C",
  "color-evergreen": "#304040",
  "color-pine": "#5B7065",
  "color-moss": "#9EADA3",
  "color-fog": "#C9D1C8",
  "color-bark": "#1A3036",
  "color-midnight": "#021519",

  // Nxt scale (Forest gray scale)
  "color-nxt-50": "#F7F8F7",
  "color-nxt-100": "#EFF2F0",
  "color-nxt-200": "#DFE4E0",
  "color-nxt-300": "#C9D1C8",
  "color-nxt-400": "#9EADA3",
  "color-nxt-500": "#7D8F84",
  "color-nxt-600": "#5B7065",
  "color-nxt-700": "#304040",
  "color-nxt-800": "#1A3036",
  "color-nxt-900": "#04202C",

  // Surfaces
  "color-nav-bg": "#04202C",
  "color-page": "#F7F8F7",
  "color-surface": "#FFFFFF",
  "color-surface-dark": "#304040",
  "color-surface-darker": "#1A3036",
  "color-surface-darkest": "#021519",
};

export function generatePalette(baseHex: string): Record<string, string> {
  const base = hexToHsl(baseHex);
  const baseHexNormalized = `#${normalizeHex(baseHex)}`;

  // Primary variants
  const primary = baseHexNormalized;
  const primaryLight = hslToHex(withLightness(base, base.l + 20));
  const primaryHover = hslToHex(withLightness(base, base.l - 8));
  const primaryActive = hslToHex(withLightness(base, base.l - 15));

  // Forest named palette (all derived from base hue & saturation)
  const forest = baseHexNormalized;
  const evergreen = hslToHex(withLightness(base, base.l - 5));
  const pine = hslToHex(withLightness(base, base.l + 15));
  const moss = hslToHex(withLightness(base, base.l + 30));
  const fog = hslToHex(withLightness(base, base.l + 50));
  const bark = hslToHex(withLightness(base, base.l - 10));
  const midnight = hslToHex(withLightness(base, base.l - 15));

  // Nxt scale: tinted grays using base hue, very low saturation,
  // lightness varying from ~97% (nxt-50) to ~8% (nxt-900).
  const nxtStops: Array<{ key: string; l: number; s: number }> = [
    { key: "color-nxt-50", l: 97, s: 4 },
    { key: "color-nxt-100", l: 94, s: 5 },
    { key: "color-nxt-200", l: 86, s: 5 },
    { key: "color-nxt-300", l: 76, s: 6 },
    { key: "color-nxt-400", l: 62, s: 6 },
    { key: "color-nxt-500", l: 48, s: 7 },
    { key: "color-nxt-600", l: 38, s: 7 },
    { key: "color-nxt-700", l: 28, s: 8 },
    { key: "color-nxt-800", l: 18, s: 8 },
    { key: "color-nxt-900", l: 8, s: 8 },
  ];

  const nxtPalette: Record<string, string> = {};
  for (const stop of nxtStops) {
    nxtPalette[stop.key] = tintedGray(base.h, stop.l, stop.s);
  }

  const palette: Record<string, string> = {
    // Primary
    "color-primary": primary,
    "color-primary-light": primaryLight,
    "color-primary-hover": primaryHover,
    "color-primary-active": primaryActive,

    // Forest named palette
    "color-forest": forest,
    "color-evergreen": evergreen,
    "color-pine": pine,
    "color-moss": moss,
    "color-fog": fog,
    "color-bark": bark,
    "color-midnight": midnight,

    // Nxt scale
    ...nxtPalette,

    // Surfaces
    "color-nav-bg": forest,
    "color-page": nxtPalette["color-nxt-50"],
    "color-surface": "#FFFFFF",
    "color-surface-dark": nxtPalette["color-nxt-700"],
    "color-surface-darker": nxtPalette["color-nxt-800"],
    "color-surface-darkest": nxtPalette["color-nxt-900"],
  };

  return palette;
}
