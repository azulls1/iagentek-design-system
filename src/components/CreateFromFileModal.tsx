import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { createPortal } from "react-dom";
import {
  Plus, Upload, Settings2, Sparkles, X, Check, Loader2, Trash2,
} from "lucide-react";
import { useColorOverrides } from "../contexts/ColorOverrideContext";
import { extractFromFile } from "../lib/templateFromFile";
import { log } from "../lib/logger";

/* ─── Types ───────────────────────────────────────────── */

type ColorRoles = {
  primary: string;        // required, hex #RRGGBB uppercase
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
};

type RoleKey = keyof ColorRoles;

type Tab = "file" | "manual" | "blank";

interface CreateFromFileModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (template: { id: string; name: string; color: string }) => void;
}

/* ─── Constants ───────────────────────────────────────── */

const DEFAULT_BLANK_COLOR = "#04202C";
const DEFAULT_PRIMARY = "#04202C";
const ACCEPT_ATTR = ".txt,text/plain,image/png,image/jpeg,image/webp,application/pdf";
const HEX_REGEX = /^#[0-9A-F]{6}$/;

const ROLE_DEFS: ReadonlyArray<{
  key: RoleKey;
  label: string;
  description: string;
  required: boolean;
}> = [
  { key: "primary",    label: "Color primario",   description: "Color de marca dominante (botones, links, headers)", required: true  },
  { key: "secondary",  label: "Color secundario", description: "Acento complementario",                              required: false },
  { key: "accent",     label: "Acento",           description: "Highlights, badges, callouts",                       required: false },
  { key: "background", label: "Fondo",            description: "Color base de la pagina",                            required: false },
  { key: "text",       label: "Texto",            description: "Color principal de tipografia",                      required: false },
];

const TAB_DEFS: ReadonlyArray<{ kind: Tab; label: string; emoji: string; Icon: typeof Upload }> = [
  { kind: "file",   label: "Desde archivo", emoji: "\u{1F4E4}", Icon: Upload     },
  { kind: "manual", label: "Manual",        emoji: "\u{1F6E0}", Icon: Settings2  },
  { kind: "blank",  label: "En blanco",     emoji: "✨",    Icon: Sparkles   },
];

/* ─── Helpers ─────────────────────────────────────────── */

function slugify(name: string): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "plantilla";
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `${base}-${suffix}`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function normalizeHexInput(raw: string): string {
  let v = raw.trim();
  if (!v.startsWith("#")) v = "#" + v;
  v = "#" + v.slice(1).replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
  return v.toUpperCase();
}

function isValidHex(v: string | undefined): v is string {
  return typeof v === "string" && HEX_REGEX.test(v);
}

/* ─── Roles preview component ─────────────────────────── */

interface RolesPreviewProps {
  roles: ColorRoles;
}

function RolesPreview({ roles }: RolesPreviewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
      {ROLE_DEFS.map(({ key, label }) => {
        const value = roles[key];
        const filled = isValidHex(value);
        return (
          <div
            key={key}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-nxt-200 bg-white min-w-[100px]"
          >
            <span className="text-[10px] font-semibold tracking-wider text-nxt-500 uppercase">
              {label.replace("Color ", "")}
            </span>
            {filled ? (
              <div
                className="w-[60px] h-[60px] rounded-xl ring-1 ring-nxt-200 shadow-sm"
                style={{ backgroundColor: value }}
                aria-hidden
              />
            ) : (
              <div className="w-[60px] h-[60px] rounded-xl border-2 border-dashed border-nxt-200 flex items-center justify-center text-nxt-300 text-sm">
                &mdash;
              </div>
            )}
            <span className="text-[10px] font-mono text-nxt-600">
              {filled ? value : "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main component ──────────────────────────────────── */

export function CreateFromFileModal({ open, onClose, onCreated }: CreateFromFileModalProps) {
  const { addTemplate, setActiveTemplate, setEditMode } = useColorOverrides();

  const [tab, setTab] = useState<Tab>("file");

  // File-tab state
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [fileRoles, setFileRoles] = useState<ColorRoles | null>(null);
  const [fileSourceLabel, setFileSourceLabel] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  // Manual-tab state — primary always present, others optional
  const [manualRoles, setManualRoles] = useState<ColorRoles>({ primary: DEFAULT_PRIMARY });

  // Shared
  const [editedName, setEditedName] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ─── Reset on close ─────────────────────────────── */

  const reset = () => {
    setTab("file");
    setFile(null);
    setProcessing(false);
    setFileRoles(null);
    setFileSourceLabel("");
    setIsDragging(false);
    setManualRoles({ primary: DEFAULT_PRIMARY });
    setEditedName("");
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  // Tab switching clears intermediate state but keeps user-entered name when reasonable.
  useEffect(() => {
    setError("");
    if (tab === "manual" && !editedName) setEditedName("Mi marca");
    if (tab === "blank" && !editedName) setEditedName("Plantilla nueva");
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── File handling ──────────────────────────────── */

  const handleFile = async (picked: File) => {
    setError("");
    setFileRoles(null);
    setFile(picked);
    setProcessing(true);
    try {
      const result = await extractFromFile(picked);
      setFileRoles(result.roles);
      setEditedName(result.suggestedName || "");
      setFileSourceLabel(result.source);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error procesando el archivo";
      setError(msg);
      log.error("CreateFromFileModal", "extractFromFile failed", { name: picked.name, msg });
    } finally {
      setProcessing(false);
    }
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void handleFile(f);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void handleFile(f);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /* ─── Manual handling ────────────────────────────── */

  const setManualRole = (key: RoleKey, value: string | undefined) => {
    setManualRoles((prev) => {
      const next: ColorRoles = { ...prev };
      if (value === undefined) {
        if (key === "primary") return prev; // primary is required, can't clear
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  /* ─── Active roles for footer/preview ────────────── */

  const activeRoles: ColorRoles | null = useMemo(() => {
    if (tab === "file") return fileRoles;
    if (tab === "manual") return manualRoles;
    return null;
  }, [tab, fileRoles, manualRoles]);

  const canCreate = useMemo(() => {
    if (tab === "blank") return true;
    if (!activeRoles) return false;
    if (!isValidHex(activeRoles.primary)) return false;
    if (editedName.trim().length === 0) return false;
    // Optional roles: must either be unset or a valid hex.
    for (const k of ["secondary", "accent", "background", "text"] as const) {
      const v = activeRoles[k];
      if (v !== undefined && !isValidHex(v)) return false;
    }
    return true;
  }, [tab, activeRoles, editedName]);

  /* ─── Create handler ─────────────────────────────── */

  const finalize = (roles: ColorRoles, name: string, isBlank: boolean) => {
    const id = slugify(name);
    const color = roles.primary;
    try {
      addTemplate({ id, name, color, roles });
      setActiveTemplate(id);
      if (isBlank) setEditMode(true);
      onCreated?.({ id, name, color });
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error creando la plantilla";
      setError(msg);
      log.error("CreateFromFileModal", "addTemplate failed", { msg });
    }
  };

  const handleCreate = () => {
    if (tab === "blank") {
      const name = "Plantilla nueva " + Date.now().toString().slice(-4);
      finalize({ primary: DEFAULT_BLANK_COLOR }, name, true);
      return;
    }
    if (!activeRoles || !canCreate) return;
    finalize(activeRoles, editedName.trim(), false);
  };

  if (!open) return null;

  /* ─── Render ─────────────────────────────────────── */

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl animate-zoom-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cffm-title"
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-nxt-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center">
              <Plus size={16} className="text-forest" />
            </div>
            <div>
              <h3 id="cffm-title" className="text-sm font-semibold text-nxt-900">Nueva plantilla</h3>
              <p className="text-[11px] text-nxt-500">Define los colores principales de la marca</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-nxt-400 hover:text-nxt-600 p-1 rounded transition-colors"
            aria-label="Cerrar"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── Tab strip ─── */}
        <div className="flex gap-1 px-4 pt-3 border-b border-nxt-100 flex-shrink-0 overflow-x-auto">
          {TAB_DEFS.map(({ kind, label, emoji }) => {
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
                <span aria-hidden>{emoji}</span>
                {label}
              </button>
            );
          })}
        </div>

        {/* ─── Body — scrollable ─── */}
        <div className="p-6 space-y-4 overflow-y-auto">

          {/* ── Tab: Desde archivo ── */}
          {tab === "file" && (
            <div className="space-y-4">
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={
                  "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors " +
                  (isDragging
                    ? "border-forest bg-forest/5"
                    : "border-nxt-200 hover:border-forest/50 hover:bg-nxt-50")
                }
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <Upload size={28} className="text-nxt-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-nxt-700">
                  Arrastra un archivo o haz click para seleccionar
                </p>
                <p className="text-[11px] text-nxt-500 mt-1">
                  Acepta .txt, imagen (PNG, JPG, WEBP) o PDF &mdash; el formato se detecta automaticamente
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT_ATTR}
                  disabled={processing}
                  onChange={onFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Selected file info */}
              {file && (
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-nxt-50 border border-nxt-100">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-nxt-800 truncate">{file.name}</p>
                    <p className="text-[10px] text-nxt-500">
                      {formatBytes(file.size)}
                      {fileSourceLabel ? ` · detectado: ${fileSourceLabel}` : ""}
                    </p>
                  </div>
                  {!processing && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setFileRoles(null);
                        setFileSourceLabel("");
                        setError("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-nxt-400 hover:text-nxt-700 p-1 rounded transition-colors"
                      aria-label="Quitar archivo"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              )}

              {/* Processing */}
              {processing && (
                <div className="flex items-center gap-2 p-3 bg-nxt-50 border border-nxt-100 rounded-lg">
                  <Loader2 size={14} className="animate-spin text-forest" />
                  <p className="text-xs text-nxt-600">Analizando con IA...</p>
                </div>
              )}

              {/* Error */}
              {error && !processing && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}

              {/* Result preview */}
              {fileRoles && !processing && (
                <div className="space-y-3">
                  <p className="text-[11px] font-medium text-nxt-600">Roles detectados</p>
                  <RolesPreview roles={fileRoles} />
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Manual ── */}
          {tab === "manual" && (
            <div className="space-y-5">
              {/* Live preview */}
              <div>
                <p className="text-[11px] font-medium text-nxt-600 mb-2">Vista previa</p>
                <RolesPreview roles={manualRoles} />
              </div>

              {/* Role rows */}
              <div className="space-y-2">
                {ROLE_DEFS.map(({ key, label, description, required }) => {
                  const value = manualRoles[key];
                  const isSet = value !== undefined;
                  const valid = isSet ? isValidHex(value) : true;

                  return (
                    <div
                      key={key}
                      className="flex items-center gap-3 p-3 rounded-lg border border-nxt-200 bg-white"
                    >
                      <input
                        type="color"
                        value={isSet && valid ? value : "#FFFFFF"}
                        onChange={(e) => setManualRole(key, e.target.value.toUpperCase())}
                        className="w-10 h-10 rounded-lg cursor-pointer border border-nxt-200 p-0.5 flex-shrink-0"
                        aria-label={`${label} (selector)`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-nxt-800">{label}</span>
                          {required ? (
                            <span className="text-[9px] uppercase tracking-wider text-forest font-bold">
                              requerido
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase tracking-wider text-nxt-400">
                              opcional
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-nxt-500 truncate">{description}</p>
                      </div>
                      <input
                        type="text"
                        value={isSet ? value : ""}
                        placeholder={required ? "#000000" : "(sin definir)"}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw.trim() === "" && !required) {
                            setManualRole(key, undefined);
                            return;
                          }
                          setManualRole(key, normalizeHexInput(raw));
                        }}
                        className={
                          "w-28 text-xs font-mono px-2 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-forest/30 " +
                          (isSet && !valid
                            ? "border-red-300 bg-red-50 text-red-700"
                            : "border-nxt-200 bg-nxt-50 text-nxt-800")
                        }
                        aria-label={`${label} (hex)`}
                      />
                      {!required && isSet ? (
                        <button
                          type="button"
                          onClick={() => setManualRole(key, undefined)}
                          className="text-nxt-400 hover:text-red-500 p-1 rounded transition-colors flex-shrink-0"
                          aria-label={`Limpiar ${label}`}
                          title="Limpiar"
                        >
                          <X size={14} />
                        </button>
                      ) : (
                        <span className="w-[22px] flex-shrink-0" aria-hidden />
                      )}
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Tab: En blanco ── */}
          {tab === "blank" && (
            <div className="space-y-3">
              <div className="p-5 rounded-xl bg-forest/5 border border-forest/20">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-forest/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={16} className="text-forest" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-nxt-800 mb-1">Plantilla en blanco</p>
                    <p className="text-xs text-nxt-600 leading-relaxed">
                      Crea una plantilla base con los colores default de IAgentek y entra en edit mode
                      para iterar visualmente.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreate}
                className="w-full px-5 py-3 text-sm font-medium text-white bg-forest hover:bg-bark rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles size={15} />
                Crear y empezar a editar
              </button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Footer name input — only on file (with result) and manual ── */}
          {((tab === "file" && fileRoles && !processing) || tab === "manual") && (
            <div className="pt-2 border-t border-nxt-100">
              <label className="block text-[11px] font-medium text-nxt-600 mb-1.5">
                Nombre de la plantilla
              </label>
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
          )}
        </div>

        {/* ─── Footer actions — sticky ─── */}
        {tab !== "blank" && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-nxt-100 bg-nxt-50/50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-nxt-600 hover:bg-nxt-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!canCreate || processing}
              className="px-5 py-2 text-xs font-medium text-white bg-forest hover:bg-bark disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Check size={13} />
              Crear y activar
            </button>
          </div>
        )}

        {tab === "blank" && (
          <div className="flex items-center justify-end px-6 py-4 border-t border-nxt-100 bg-nxt-50/50 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-nxt-600 hover:bg-nxt-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
