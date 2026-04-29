import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Plus, Palette, FileText, Image as ImageIcon, FileType, Sparkles,
  X, Check, Loader2, Upload,
} from "lucide-react";
import { useColorOverrides } from "../contexts/ColorOverrideContext";
import {
  extractFromTxt,
  extractFromImage,
  extractFromPdf,
  type TemplateInputResult,
} from "../lib/templateFromFile";
import { log } from "../lib/logger";

type Tab = "color" | "txt" | "image" | "pdf" | "blank";

interface NewTemplateModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (template: { id: string; name: string; color: string }) => void;
}

const TAB_DEFS: { kind: Tab; label: string; hint: string; Icon: typeof FileText }[] = [
  { kind: "color", label: "Color base",   hint: "Un hex genera toda la paleta",  Icon: Palette },
  { kind: "txt",   label: "Texto",        hint: "Archivo .txt con hex",          Icon: FileText },
  { kind: "image", label: "Imagen",       hint: "PNG, JPG, WEBP",                Icon: ImageIcon },
  { kind: "pdf",   label: "PDF",          hint: "Brandbook o guia",              Icon: FileType },
  { kind: "blank", label: "En blanco",    hint: "Plantilla base, edita despues", Icon: Sparkles },
];

const ACCEPT_BY_KIND: Record<Exclude<Tab, "color" | "blank">, string> = {
  txt: ".txt,text/plain",
  image: "image/png,image/jpeg,image/webp",
  pdf: "application/pdf",
};

const DEFAULT_BLANK_COLOR = "#04202C";

function randomSuffix(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 4; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const safe = base || "plantilla";
  return `${safe}-${randomSuffix()}`;
}

function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Error leyendo el archivo"));
    reader.readAsText(file);
  });
}

export function CreateFromFileModal({ open, onClose, onCreated }: NewTemplateModalProps) {
  const { addTemplate, setActiveTemplate, setEditMode } = useColorOverrides();

  const [tab, setTab] = useState<Tab>("color");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<TemplateInputResult | null>(null);
  const [editedName, setEditedName] = useState("");

  // Color base state
  const [colorBase, setColorBase] = useState(DEFAULT_BLANK_COLOR);

  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setProcessing(false);
    setResult(null);
    setEditedName("");
    setColorBase(DEFAULT_BLANK_COLOR);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  // Cambiar tab limpia el estado intermedio.
  useEffect(() => {
    setResult(null);
    setError("");
    setProcessing(false);
    if (fileRef.current) fileRef.current.value = "";
    if (tab === "color" && !editedName) setEditedName("Mi marca");
    if (tab === "blank" && !editedName) setEditedName("Plantilla nueva");
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFile = async (file: File) => {
    setError("");
    setResult(null);
    setProcessing(true);
    try {
      let res: TemplateInputResult;
      if (tab === "txt") {
        const text = await readTextFile(file);
        res = await extractFromTxt(text, file.name);
      } else if (tab === "image") {
        res = await extractFromImage(file);
      } else if (tab === "pdf") {
        res = await extractFromPdf(file);
      } else {
        return;
      }
      setResult(res);
      setEditedName(res.suggestedName || "");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error procesando el archivo";
      setError(msg);
      log.error("NewTemplateModal", "handleFile failed", { tab, msg });
    } finally {
      setProcessing(false);
    }
  };

  // Color base derivation: para tabs no-archivo construimos un "result virtual"
  // para reutilizar el preview + el handleCreate.
  const effectiveResult: TemplateInputResult | null = useMemo(() => {
    if (tab === "color") {
      const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(colorBase) ? colorBase.toUpperCase() : null;
      return hex ? { colors: [hex], suggestedName: editedName, source: "txt" } : null;
    }
    if (tab === "blank") {
      return { colors: [DEFAULT_BLANK_COLOR], suggestedName: editedName, source: "txt" };
    }
    return result;
  }, [tab, colorBase, result, editedName]);

  const canCreate = useMemo(() => {
    if (!effectiveResult) return false;
    if (editedName.trim().length === 0) return false;
    return /^#([0-9A-F]{3}|[0-9A-F]{6})$/.test(effectiveResult.colors[0] || "");
  }, [effectiveResult, editedName]);

  const handleCreate = () => {
    if (!effectiveResult || !canCreate) return;
    const name = editedName.trim();
    const id = slugify(name);
    const color = effectiveResult.colors[0];
    try {
      addTemplate({ id, name, color });
      setActiveTemplate(id);
      // Si la plantilla es "en blanco", entramos en edit mode para que el user empiece a iterar.
      if (tab === "blank") setEditMode(true);
      onCreated?.({ id, name, color });
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error creando la plantilla";
      setError(msg);
      log.error("NewTemplateModal", "handleCreate failed", { msg });
    }
  };

  if (!open) return null;

  const showFileInput = tab === "txt" || tab === "image" || tab === "pdf";
  const acceptAttr = showFileInput ? ACCEPT_BY_KIND[tab as "txt" | "image" | "pdf"] : "";

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-zoom-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-nxt-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center">
              <Plus size={16} className="text-forest" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-nxt-900">Nueva plantilla</h3>
              <p className="text-[11px] text-nxt-500">Elige una fuente para inicializar la paleta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-nxt-400 hover:text-nxt-600 p-1 rounded transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab strip */}
        <div className="flex gap-1 px-4 pt-3 border-b border-nxt-100 flex-shrink-0 overflow-x-auto">
          {TAB_DEFS.map(({ kind, label, Icon }) => {
            const active = tab === kind;
            return (
              <button
                key={kind}
                type="button"
                onClick={() => setTab(kind)}
                className={
                  "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap " +
                  (active
                    ? "border-forest text-forest"
                    : "border-transparent text-nxt-500 hover:text-nxt-700")
                }
                aria-pressed={active}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Body — scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Tab hint */}
          <p className="text-xs text-nxt-500">
            {TAB_DEFS.find((t) => t.kind === tab)?.hint}
          </p>

          {/* COLOR BASE */}
          {tab === "color" && (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-nxt-600 mb-1.5">Color base</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorBase}
                    onChange={(e) => setColorBase(e.target.value.toUpperCase())}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-nxt-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={colorBase}
                    onChange={(e) => {
                      let v = e.target.value;
                      if (!v.startsWith("#")) v = "#" + v;
                      v = "#" + v.slice(1).replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
                      setColorBase(v.toUpperCase());
                    }}
                    className="flex-1 text-sm font-mono px-3 py-2 rounded-lg bg-nxt-50 text-nxt-800 border border-nxt-200 focus:outline-none focus:ring-2 focus:ring-forest/30"
                    placeholder="#000000"
                  />
                  <div
                    className="w-10 h-10 rounded-lg ring-1 ring-nxt-200 flex-shrink-0"
                    style={{ backgroundColor: colorBase }}
                    aria-hidden
                  />
                </div>
                <p className="text-[10px] text-nxt-400 mt-1.5">
                  La paleta completa (50–900) se genera automaticamente desde este color base.
                </p>
              </div>
            </div>
          )}

          {/* FILE TABS (txt/image/pdf) */}
          {showFileInput && (
            <div>
              <label className="block text-[11px] font-medium text-nxt-600 mb-1.5">Archivo</label>
              <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-nxt-200 rounded-lg cursor-pointer hover:border-forest/50 hover:bg-nxt-50 transition-colors">
                <Upload size={20} className="text-nxt-400 mb-2" />
                <span className="text-sm text-nxt-600 font-medium">Click para seleccionar</span>
                <span className="text-[10px] text-nxt-400 mt-0.5">{acceptAttr.replace(/,/g, " · ")}</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept={acceptAttr}
                  disabled={processing}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* BLANK */}
          {tab === "blank" && (
            <div className="p-4 rounded-lg bg-forest/5 border border-forest/20">
              <p className="text-sm text-nxt-700 mb-2">
                <span className="font-semibold">Plantilla en blanco</span> — se crea con el color base de IAgentek y se activa edit mode para que iteres.
              </p>
              <p className="text-xs text-nxt-500">
                Despues de crear, los componentes UI se podran clickear para cambiar colores uno a uno.
              </p>
            </div>
          )}

          {/* Processing */}
          {processing && (
            <div className="flex items-center gap-2 p-3 bg-nxt-50 border border-nxt-100 rounded-lg">
              <Loader2 size={14} className="animate-spin text-forest" />
              <p className="text-xs text-nxt-600">Analizando con IA…</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Preview de paleta */}
          {effectiveResult && !processing && (
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-medium text-nxt-600 mb-2">
                  Colores ({effectiveResult.colors.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {effectiveResult.colors.map((c, i) => (
                    <div key={`${c}-${i}`} className="flex flex-col items-center gap-1">
                      <div
                        className="w-10 h-10 rounded-lg ring-1 ring-nxt-200 shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                      <span className="text-[10px] font-mono text-nxt-500">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-nxt-600 mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-3 py-2 border border-nxt-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
                  placeholder="Mi marca"
                />
                <p className="text-[10px] text-nxt-400 mt-1">
                  ID generado: <span className="font-mono">{slugify(editedName || "plantilla")}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions — sticky */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-nxt-100 bg-nxt-50/50 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-nxt-600 hover:bg-nxt-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={!canCreate || processing}
            className="px-5 py-2 text-xs font-medium text-white bg-forest hover:bg-bark disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Check size={13} />
            {tab === "blank" ? "Crear y empezar a editar" : "Crear y activar"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
