import { useState, useRef } from "react";
import { Upload, X, RefreshCw, FileArchive } from "lucide-react";
import JSZip from "jszip";
import { supabase } from "../lib/supabase";
import { useColorOverrides } from "../contexts/ColorOverrideContext";
import { createProject, uploadAssetToProject, type AssetScope } from "../lib/minio";
import { log } from "../lib/logger";

/* ── Parse imported ZIP ───────────────────────────────── */

interface ImportedData {
  templateId: string;
  templateName: string;
  templateColor: string;
  overrides: Record<string, string>;
  assets: { path: string; name: string; data: Uint8Array; contentType: string }[];
}

const MIME_MAP: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif",
  svg: "image/svg+xml", ico: "image/x-icon", webp: "image/webp", webmanifest: "application/manifest+json",
};

function guessMime(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return MIME_MAP[ext] || "application/octet-stream";
}

// Convert tokens.json colors back to override keys
function tokensToOverrides(colors: Record<string, any>): Record<string, string> {
  const overrides: Record<string, string> = {};
  const BASE_DEFAULTS: Record<string, Record<string, string>> = {
    primary: { DEFAULT: "#04202C", light: "#5B7065", hover: "#1A3036", active: "#021519" },
    forest: { "50": "#F7F8F7", "100": "#EFF2F0", "200": "#DFE4E0", "300": "#C9D1C8", "400": "#9EADA3", "500": "#7D8F84", "600": "#5B7065", "700": "#304040", "800": "#1A3036", "900": "#04202C" },
    success: { DEFAULT: "#059669", light: "#BBF7D0", border: "#86EFAC" },
    warning: { DEFAULT: "#D97706", light: "#FDE68A", border: "#FDE047" },
    error: { DEFAULT: "#DC2626", light: "#FECACA", border: "#FCA5A5" },
    info: { DEFAULT: "#2563EB", light: "#BFDBFE", border: "#93C5FD" },
  };

  // Map JSON structure back to flat overrides
  const colorMap: Record<string, Record<string, string>> = {};
  if (colors.primary) colorMap.primary = colors.primary;
  if (colors.gray) colorMap.forest = colors.gray;
  if (colors.status) {
    if (colors.status.success) colorMap.success = colors.status.success;
    if (colors.status.warning) colorMap.warning = colors.status.warning;
    if (colors.status.error) colorMap.error = colors.status.error;
    if (colors.status.info) colorMap.info = colors.status.info;
  }
  // Direct color groups (from tokens.js format)
  for (const key of ["primary", "forest", "success", "warning", "error", "info"]) {
    if (colors[key] && !colorMap[key]) colorMap[key] = colors[key];
  }

  for (const [group, shades] of Object.entries(colorMap)) {
    const base = BASE_DEFAULTS[group] || {};
    for (const [shade, value] of Object.entries(shades as Record<string, string>)) {
      if (typeof value === "string" && base[shade] && value.toUpperCase() !== base[shade].toUpperCase()) {
        overrides[group + "." + shade] = value;
      }
    }
  }

  return overrides;
}

async function parseZip(file: File): Promise<ImportedData> {
  const zip = await JSZip.loadAsync(file);
  let templateId = "";
  let templateName = "";
  let templateColor = "#04202C";
  let overrides: Record<string, string> = {};
  const assets: ImportedData["assets"] = [];

  // Find the root folder name
  const entries = Object.keys(zip.files);
  const rootFolder = entries[0]?.split("/")[0] || "";

  // Try to read tokens.json
  const tokensPath = rootFolder ? rootFolder + "/tokens.json" : "tokens.json";
  const tokensFile = zip.file(tokensPath);
  if (tokensFile) {
    try {
      const tokensText = await tokensFile.async("text");
      const tokens = JSON.parse(tokensText);
      if (tokens.template || tokens.company) {
        const src = tokens.template || tokens.company;
        templateId = src.id || "";
        templateName = src.name || "";
        templateColor = src.color || "#04202C";
      }
      if (tokens.colors) {
        overrides = tokensToOverrides(tokens.colors);
      }
    } catch { /* ignore parse errors */ }
  }

  // Fallback: derive from folder name
  if (!templateId && rootFolder) {
    templateId = rootFolder.replace(/-design-system$/, "");
    templateName = templateId.charAt(0).toUpperCase() + templateId.slice(1).replace(/-/g, " ");
  }

  // Collect assets
  const assetPrefix = rootFolder ? rootFolder + "/assets/" : "assets/";
  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    if (!path.startsWith(assetPrefix)) continue;
    const relativePath = path.slice(assetPrefix.length);
    if (!relativePath || relativePath.startsWith(".")) continue;
    const data = await entry.async("uint8array");
    const name = relativePath.split("/").pop() || relativePath;
    assets.push({ path: relativePath, name, data, contentType: guessMime(name) });
  }

  return { templateId, templateName, templateColor, overrides, assets };
}

/* ── Import logic ─────────────────────────────────────── */

async function importLibrary(
  data: ImportedData,
  userId: string,
  onProgress: (msg: string) => void,
) {
  const { templateId, templateName, templateColor, overrides, assets } = data;
  const scope: AssetScope = { userId, templateId };

  // 1. Create company in Supabase
  onProgress("Creando plantilla...");
  const short = templateName.slice(0, 2).toUpperCase();
  const { data: existingCompanies } = await supabase.from("iagentek-designsystem-templates").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const maxOrder = existingCompanies?.[0]?.sort_order ?? -1;

  await supabase.from("iagentek-designsystem-templates").upsert({
    id: templateId,
    name: templateName,
    color: templateColor,
    short,
    sort_order: maxOrder + 1,
  });

  // 2. Save color overrides
  onProgress("Guardando colores...");
  await supabase.from("iagentek-designsystem-overrides").upsert({
    id: templateId,
    overrides,
    updated_at: new Date().toISOString(),
  });

  // 3. Upload assets to MinIO
  if (assets.length > 0) {
    // Group assets by project folder
    const projectSet = new Set<string>();
    for (const asset of assets) {
      const parts = asset.path.split("/");
      if (parts.length >= 2) projectSet.add(parts[0]);
    }

    for (const project of projectSet) {
      onProgress("Creando carpeta " + project + "...");
      await createProject(scope, project);
    }

    for (const asset of assets) {
      onProgress("Subiendo " + asset.name + "...");
      const parts = asset.path.split("/");
      const project = parts.length >= 2 ? parts[0] : "_general";
      // Create a File-like object from Uint8Array
      const blob = new Blob([asset.data], { type: asset.contentType });
      const file = new File([blob], asset.name, { type: asset.contentType });
      await uploadAssetToProject(file, scope, project);
    }
  }

  onProgress("Listo!");
}

/* ── Component ────────────────────────────────────────── */

export function ImportLibraryButton({ userId }: { userId: string }) {
  const { templates, addTemplate, setActiveTemplate } = useColorOverrides();
  const [showModal, setShowModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState("");
  const [preview, setPreview] = useState<ImportedData | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".zip")) {
      setError("Solo se aceptan archivos .zip");
      return;
    }
    setError("");
    try {
      const data = await parseZip(file);
      if (!data.templateId) {
        setError("No se encontro informacion de plantilla en el ZIP");
        return;
      }
      setPreview(data);
    } catch (e) {
      setError("Error al leer el ZIP");
      log.error("ImportLibrary", "Error reading ZIP", { e });
    }
  };

  const handleImport = async () => {
    if (!preview) return;
    setImporting(true);
    setError("");
    try {
      await importLibrary(preview, userId, setProgress);
      // Reload page to pick up new company
      window.location.reload();
    } catch (e) {
      log.error("ImportLibrary", "Import error", { e });
      setError("Error al importar: " + (e as Error).message);
      setImporting(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setError("");
    setProgress("");
    setShowModal(false);
  };

  const exists = preview && templates.some((c) => c.id === preview.templateId);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-nxt-300 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
        title="Importar libreria"
      >
        <Upload size={13} />
        <span className="hidden sm:inline">Importar</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in" onClick={reset}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 animate-zoom-in" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-nxt-100">
              <div className="flex items-center gap-2">
                <FileArchive size={18} className="text-forest" />
                <h3 className="text-sm font-semibold text-nxt-800">Importar libreria</h3>
              </div>
              <button onClick={reset} className="text-nxt-400 hover:text-nxt-600"><X size={16} /></button>
            </div>

            <div className="p-5">
              {!preview ? (
                <>
                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                    onClick={() => fileRef.current?.click()}
                    className={"border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all " +
                      (dragOver ? "border-forest bg-forest/10" : "border-nxt-300 hover:border-forest hover:bg-forest/5")}
                  >
                    <input ref={fileRef} type="file" accept=".zip" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ""; }} className="hidden" />
                    <Upload className={"w-8 h-8 mx-auto mb-3 " + (dragOver ? "text-forest" : "text-nxt-400")} />
                    <p className="text-sm font-medium text-nxt-700">Arrastra un ZIP o haz clic</p>
                    <p className="text-xs text-nxt-400 mt-1">Archivo .zip exportado desde el Design System</p>
                  </div>
                  {error && <p className="text-xs text-error mt-3">{error}</p>}
                </>
              ) : (
                <>
                  {/* Preview */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-nxt-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full flex-shrink-0 ring-1 ring-nxt-200" style={{ backgroundColor: preview.templateColor }} />
                      <div>
                        <p className="text-sm font-semibold text-nxt-800">{preview.templateName}</p>
                        <p className="text-[10px] text-nxt-400">ID: {preview.templateId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-nxt-50 rounded-lg">
                        <p className="text-lg font-bold text-nxt-800">{Object.keys(preview.overrides).length}</p>
                        <p className="text-[10px] text-nxt-400">Overrides</p>
                      </div>
                      <div className="p-2 bg-nxt-50 rounded-lg">
                        <p className="text-lg font-bold text-nxt-800">{preview.assets.length}</p>
                        <p className="text-[10px] text-nxt-400">Assets</p>
                      </div>
                      <div className="p-2 bg-nxt-50 rounded-lg">
                        <p className="text-lg font-bold text-nxt-800">{new Set(preview.assets.map((a) => a.path.split("/")[0])).size}</p>
                        <p className="text-[10px] text-nxt-400">Proyectos</p>
                      </div>
                    </div>

                    {exists && (
                      <div className="p-2 bg-warning/10 border border-warning/20 rounded-lg">
                        <p className="text-xs text-warning">La plantilla "{preview.templateName}" ya existe. Se actualizaran los colores y assets.</p>
                      </div>
                    )}

                    {error && <p className="text-xs text-error">{error}</p>}

                    {importing && (
                      <div className="flex items-center gap-2 p-2 bg-info/10 border border-info/20 rounded-lg">
                        <RefreshCw size={12} className="animate-spin text-info" />
                        <p className="text-xs text-info">{progress}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 justify-end mt-4">
                    <button onClick={() => setPreview(null)} disabled={importing} className="px-3 py-1.5 text-xs font-medium text-nxt-600 hover:bg-nxt-100 rounded-lg transition-colors disabled:opacity-40">
                      Atras
                    </button>
                    <button
                      onClick={handleImport}
                      disabled={importing}
                      className="px-4 py-1.5 text-xs font-medium text-white bg-forest hover:bg-bark disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {importing ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} />}
                      {importing ? "Importando..." : exists ? "Actualizar" : "Importar"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
