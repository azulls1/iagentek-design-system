import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Upload, FileText, Image as ImageIcon, FileType, X, Check, Loader2 } from "lucide-react";
import { useColorOverrides } from "../contexts/ColorOverrideContext";
import {
  extractFromTxt,
  extractFromImage,
  extractFromPdf,
  type TemplateInputResult,
} from "../lib/templateFromFile";
import { log } from "../lib/logger";

type SourceKind = "txt" | "image" | "pdf";

interface CreateFromFileModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (template: { id: string; name: string; color: string }) => void;
}

const ACCEPT_BY_KIND: Record<SourceKind, string> = {
  txt: ".txt,text/plain",
  image: "image/png,image/jpeg,image/webp",
  pdf: "application/pdf",
};

const TABS: { kind: SourceKind; label: string; description: string; Icon: typeof FileText }[] = [
  { kind: "txt", label: "Texto", description: "Archivo .txt con la descripcion", Icon: FileText },
  { kind: "image", label: "Imagen", description: "PNG, JPG o WEBP", Icon: ImageIcon },
  { kind: "pdf", label: "PDF", description: "Brandbook o guia de marca", Icon: FileType },
];

// 4-char random suffix to avoid collisions across users.
function randomSuffix(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 4; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
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
    reader.onload = () => {
      const r = reader.result;
      resolve(typeof r === "string" ? r : "");
    };
    reader.onerror = () => reject(new Error("Error leyendo el archivo"));
    reader.readAsText(file);
  });
}

export function CreateFromFileModal({ open, onClose, onCreated }: CreateFromFileModalProps) {
  const { addTemplate, setActiveTemplate } = useColorOverrides();
  const [source, setSource] = useState<SourceKind>("txt");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<TemplateInputResult | null>(null);
  const [editedName, setEditedName] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setProcessing(false);
    setResult(null);
    setEditedName("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  // Reset preview when the source kind changes — a different file will arrive.
  useEffect(() => {
    setResult(null);
    setEditedName("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }, [source]);

  const handleFile = async (file: File) => {
    setError("");
    setResult(null);
    setProcessing(true);
    try {
      let res: TemplateInputResult;
      if (source === "txt") {
        const text = await readTextFile(file);
        res = await extractFromTxt(text, file.name);
      } else if (source === "image") {
        res = await extractFromImage(file);
      } else {
        res = await extractFromPdf(file);
      }
      setResult(res);
      setEditedName(res.suggestedName || "");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error procesando el archivo";
      setError(msg);
      log.error("CreateFromFileModal", "handleFile failed", { source, msg });
    } finally {
      setProcessing(false);
    }
  };

  const canCreate = useMemo(
    () => Boolean(result && editedName.trim().length > 0 && (result.colors[0] || "").startsWith("#")),
    [result, editedName],
  );

  const handleCreate = () => {
    if (!result || !canCreate) return;
    const name = editedName.trim();
    const id = slugify(name);
    const color = result.colors[0];
    try {
      addTemplate({ id, name, color });
      setActiveTemplate(id);
      onCreated?.({ id, name, color });
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error creando la plantilla";
      setError(msg);
      log.error("CreateFromFileModal", "handleCreate failed", { msg });
    }
  };

  if (!open) return null;

  const activeAccept = ACCEPT_BY_KIND[source];

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-nxt-100">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-forest" />
            <h3 className="text-sm font-semibold text-nxt-800">Crear plantilla desde archivo</h3>
          </div>
          <button
            onClick={onClose}
            className="text-nxt-400 hover:text-nxt-600 p-1 rounded transition-colors"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Source selector (radio-tabs) */}
          <div className="grid grid-cols-3 gap-2">
            {TABS.map(({ kind, label, description, Icon }) => {
              const active = source === kind;
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setSource(kind)}
                  className={
                    "flex flex-col items-center gap-1 p-3 rounded-lg border text-center transition-all " +
                    (active
                      ? "border-forest bg-forest/5 text-forest"
                      : "border-nxt-200 bg-white text-nxt-600 hover:border-forest/40 hover:bg-nxt-50")
                  }
                  aria-pressed={active}
                >
                  <Icon size={18} className={active ? "text-forest" : "text-nxt-500"} />
                  <span className="text-xs font-medium">{label}</span>
                  <span className="text-[10px] text-nxt-400 leading-tight">{description}</span>
                </button>
              );
            })}
          </div>

          {/* File picker */}
          <div>
            <label className="block text-[11px] font-medium text-nxt-600 mb-1">Archivo</label>
            <input
              ref={fileRef}
              type="file"
              accept={activeAccept}
              disabled={processing}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
              }}
              className="block w-full text-xs text-nxt-700 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-nxt-100 file:text-nxt-700 hover:file:bg-nxt-200 file:cursor-pointer cursor-pointer disabled:opacity-50"
            />
          </div>

          {/* Processing state */}
          {processing && (
            <div className="flex items-center gap-2 p-3 bg-nxt-50 border border-nxt-100 rounded-lg">
              <Loader2 size={14} className="animate-spin text-forest" />
              <p className="text-xs text-nxt-600">Procesando...</p>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Preview */}
          {result && !processing && (
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-medium text-nxt-600 mb-2">
                  Colores detectados ({result.colors.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.colors.map((c, i) => (
                    <div key={`${c}-${i}`} className="flex flex-col items-center gap-1">
                      <div
                        className="w-8 h-8 rounded-md ring-1 ring-nxt-200"
                        style={{ backgroundColor: c }}
                      />
                      <span className="text-[10px] font-mono text-nxt-500">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-nxt-600 mb-1">
                  Nombre de la plantilla
                </label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-3 py-2 border border-nxt-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
                  placeholder="Mi plantilla"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-nxt-600 hover:bg-nxt-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              disabled={!canCreate || processing}
              className="px-4 py-1.5 text-xs font-medium text-white bg-forest hover:bg-bark disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Check size={12} />
              Crear plantilla
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
