import { useState } from "react";
import { Package, RefreshCw } from "lucide-react";
import JSZip from "jszip";
import { useColorOverrides, type Template } from "../contexts/ColorOverrideContext";
import { listProjects, listProjectAssets, type AssetScope } from "../lib/minio";
import { log } from "../lib/logger";

/* ── Base tokens ──────────────────────────────────────── */

const BASE_COLORS = {
  primary: { DEFAULT: "#04202C", light: "#5B7065", hover: "#1A3036", active: "#021519" },
  forest: { "50": "#F7F8F7", "100": "#EFF2F0", "200": "#DFE4E0", "300": "#C9D1C8", "400": "#9EADA3", "500": "#7D8F84", "600": "#5B7065", "700": "#304040", "800": "#1A3036", "900": "#04202C" },
  success: { DEFAULT: "#059669", light: "#BBF7D0", border: "#86EFAC" },
  warning: { DEFAULT: "#D97706", light: "#FDE68A", border: "#FDE047" },
  error: { DEFAULT: "#DC2626", light: "#FECACA", border: "#FCA5A5" },
  info: { DEFAULT: "#2563EB", light: "#BFDBFE", border: "#93C5FD" },
};

function applyOverrides(overrides: Record<string, string>) {
  const colors = JSON.parse(JSON.stringify(BASE_COLORS));
  for (const [key, value] of Object.entries(overrides)) {
    const parts = key.split(".");
    if (parts.length >= 2) {
      const colorGroup = parts[0];
      const shade = parts.slice(1).join(".");
      if (colors[colorGroup]) {
        if (shade === "default" || shade === "DEFAULT") colors[colorGroup].DEFAULT = value;
        else colors[colorGroup][shade] = value;
      }
    }
  }
  return colors;
}

/* ── File generators ──────────────────────────────────── */

function generateTokensJSON(template: Template, colors: ReturnType<typeof applyOverrides>) {
  return JSON.stringify({
    name: template.name + " Design System",
    version: "1.0.0",
    source: "Forest Design System Playground",
    template: { id: template.id, name: template.name, color: template.color },
    lastUpdated: new Date().toISOString().split("T")[0],
    colors: {
      primary: colors.primary,
      gray: colors.forest,
      status: { success: colors.success, warning: colors.warning, error: colors.error, info: colors.info },
    },
  }, null, 2);
}

function generateTokensCSS(template: Template, colors: ReturnType<typeof applyOverrides>) {
  return "/**\n" +
    " * " + template.name.toUpperCase() + " - Design System Tokens\n" +
    " * Generado desde Forest Design System Playground\n" +
    " * " + new Date().toISOString().split("T")[0] + "\n" +
    " */\n\n:root {\n" +
    "  /* --- Color de marca --- */\n" +
    "  --forest-brand: " + template.color + ";\n\n" +
    "  /* --- Colores Primarios --- */\n" +
    "  --forest-primary: " + colors.primary.DEFAULT + ";\n" +
    "  --forest-primary-light: " + colors.primary.light + ";\n" +
    "  --forest-primary-hover: " + colors.primary.hover + ";\n" +
    "  --forest-primary-active: " + colors.primary.active + ";\n\n" +
    "  /* --- Escala de grises --- */\n" +
    Object.entries(colors.forest).map(([k, v]) => "  --forest-" + k + ": " + v + ";").join("\n") + "\n\n" +
    "  /* --- Estados --- */\n" +
    "  --forest-success: " + colors.success.DEFAULT + ";\n" +
    "  --forest-success-light: " + colors.success.light + ";\n" +
    "  --forest-success-border: " + colors.success.border + ";\n" +
    "  --forest-warning: " + colors.warning.DEFAULT + ";\n" +
    "  --forest-warning-light: " + colors.warning.light + ";\n" +
    "  --forest-warning-border: " + colors.warning.border + ";\n" +
    "  --forest-error: " + colors.error.DEFAULT + ";\n" +
    "  --forest-error-light: " + colors.error.light + ";\n" +
    "  --forest-error-border: " + colors.error.border + ";\n" +
    "  --forest-info: " + colors.info.DEFAULT + ";\n" +
    "  --forest-info-light: " + colors.info.light + ";\n" +
    "  --forest-info-border: " + colors.info.border + ";\n" +
    "}\n";
}

function generateTailwindPreset(template: Template, colors: ReturnType<typeof applyOverrides>) {
  const indent = (obj: Record<string, string>, spaces: number) => {
    const pad = " ".repeat(spaces);
    return "{\n" + Object.entries(obj).map(([k, v]) => pad + "  '" + k + "': '" + v + "',").join("\n") + "\n" + pad + "}";
  };
  return "/**\n" +
    " * " + template.name + " - Tailwind CSS Preset\n" +
    " * Generado desde Forest Design System Playground\n" +
    " *\n" +
    " * Uso: presets: [require('./" + template.id + "-design-system/tailwind-preset.js')]\n" +
    " */\n\n" +
    "module.exports = {\n" +
    "  theme: {\n" +
    "    extend: {\n" +
    "      colors: {\n" +
    "        primary: " + indent(colors.primary, 8) + ",\n" +
    "        forest: " + indent(colors.forest, 8) + ",\n" +
    "        success: " + indent(colors.success, 8) + ",\n" +
    "        warning: " + indent(colors.warning, 8) + ",\n" +
    "        error: " + indent(colors.error, 8) + ",\n" +
    "        info: " + indent(colors.info, 8) + ",\n" +
    "        brand: '" + template.color + "',\n" +
    "      },\n" +
    "      fontFamily: {\n" +
    "        sans: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],\n" +
    "        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],\n" +
    "      },\n" +
    "    },\n" +
    "  },\n" +
    "  plugins: [],\n" +
    "};\n";
}

function generatePackageJSON(template: Template) {
  const id = template.id.replace(/[^a-z0-9-]/g, "");
  return JSON.stringify({
    name: "@forest/" + id + "-design-system",
    version: "1.0.0",
    description: "Design system para " + template.name + " - generado desde Forest Design System Playground",
    main: "tokens.js",
    exports: {
      ".": "./tokens.js",
      "./css": "./tokens.css",
      "./tailwind": "./tailwind-preset.js",
      "./tokens": "./tokens.json",
    },
    files: ["tokens.js", "tokens.css", "tokens.json", "tailwind-preset.js", "assets"],
  }, null, 2);
}

function generateTokensJS(template: Template, colors: ReturnType<typeof applyOverrides>) {
  return "// " + template.name + " Design System Tokens\n" +
    "// Auto-generated - do not edit manually\n\n" +
    "const tokens = " + JSON.stringify({ colors, brand: template.color }, null, 2) + ";\n\n" +
    "module.exports = tokens;\n" +
    "if (typeof module.exports.default === 'undefined') module.exports.default = tokens;\n";
}

function generateReadme(template: Template) {
  const id = template.id.replace(/[^a-z0-9-]/g, "");
  return "# " + template.name + " Design System\n\n" +
    "Libreria de estilos generada desde [Forest Design System Playground](https://playground.iagentek.dev).\n\n" +
    "## Uso con Tailwind CSS\n\n" +
    "```js\n// tailwind.config.js\nmodule.exports = {\n  presets: [require('./" + id + "-design-system/tailwind-preset.js')],\n}\n```\n\n" +
    "## Uso con CSS Variables\n\n" +
    "```html\n<link rel=\"stylesheet\" href=\"./" + id + "-design-system/tokens.css\" />\n```\n\n" +
    "## Uso con JavaScript\n\n" +
    "```js\nconst tokens = require('./" + id + "-design-system/tokens.js');\nconsole.log(tokens.colors.primary.DEFAULT);\n```\n\n" +
    "## Assets\n\n" +
    "- `assets/{proyecto}/logos/` — Logos\n" +
    "- `assets/{proyecto}/favicons/` — Favicons\n" +
    "- `assets/{proyecto}/icons/` — Iconos\n\n" +
    "---\n" +
    "Generado: " + new Date().toISOString().split("T")[0] + " | Plantilla: " + template.name + "\n";
}

/* ── Download asset ───────────────────────────────────── */

async function fetchAssetBlob(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

/* ── Main export ──────────────────────────────────────── */

async function exportLibrary(
  template: Template,
  scope: AssetScope,
  overrides: Record<string, string>,
  onProgress: (msg: string) => void,
): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder(template.id + "-design-system")!;
  const colors = applyOverrides(overrides);

  onProgress("Generando tokens...");
  folder.file("tokens.json", generateTokensJSON(template, colors));
  folder.file("tokens.css", generateTokensCSS(template, colors));
  folder.file("tokens.js", generateTokensJS(template, colors));
  folder.file("tailwind-preset.js", generateTailwindPreset(template, colors));
  folder.file("package.json", generatePackageJSON(template));
  folder.file("README.md", generateReadme(template));

  onProgress("Descargando assets...");
  try {
    const projects = await listProjects(scope);
    for (const project of projects) {
      const assets = await listProjectAssets(scope, project.name);
      const allAssets = [...assets.logos, ...assets.favicons, ...assets.icons];
      for (const asset of allAssets) {
        onProgress(asset.name.replace(/^\d+-/, ""));
        const blob = await fetchAssetBlob(asset.url);
        if (blob) {
          const typePath = asset.type === "logo" ? "logos" : asset.type === "favicon" ? "favicons" : "icons";
          folder.file("assets/" + project.name + "/" + typePath + "/" + asset.name.replace(/^\d+-/, ""), blob);
        }
      }
    }
  } catch (e) {
    log.error("ExportLibrary", "Error downloading assets", { e });
  }

  onProgress("Comprimiendo...");
  return await zip.generateAsync({ type: "blob" });
}

/* ── Component ────────────────────────────────────────── */

export function ExportLibraryButton({ userId }: { userId: string }) {
  const { activeTemplate, templates, overrides } = useColorOverrides();
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState("");

  const current = templates.find((c) => c.id === activeTemplate);
  if (!current) return null;

  const handleExport = async () => {
    setExporting(true);
    try {
      const scope: AssetScope = { userId, templateId: current.id };
      const blob = await exportLibrary(current, scope, overrides, setProgress);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = current.id + "-design-system.zip";
      a.click();
      URL.revokeObjectURL(url);
      setProgress("");
    } catch (e) {
      log.error("ExportLibrary", "Export error", { e });
      setProgress("Error");
      setTimeout(() => setProgress(""), 3000);
    }
    setExporting(false);
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-nxt-300 hover:text-white hover:bg-white/10 transition-all text-xs font-medium disabled:opacity-50"
      title={"Exportar libreria de " + current.name}
    >
      {exporting ? (
        <>
          <RefreshCw size={13} className="animate-spin" />
          <span className="hidden sm:inline max-w-[120px] truncate">{progress || "Exportando..."}</span>
        </>
      ) : (
        <>
          <Package size={13} />
          <span className="hidden sm:inline">Exportar</span>
        </>
      )}
    </button>
  );
}
