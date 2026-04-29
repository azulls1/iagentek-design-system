// Cliente de la Edge Function `iagentek-template-from-input`.
// Auto-detecta el tipo de archivo y devuelve roles de diseno (primary,
// secondary, accent, background, text) extraidos de la fuente.

import { supabase } from "./supabase";
import { log } from "./logger";

export type ColorRoles = {
  primary: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
};

export type ExtractResult = {
  roles: ColorRoles;
  suggestedName: string;
  source: "txt" | "image" | "pdf";
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ENDPOINT = `${SUPABASE_URL}/functions/v1/iagentek-template-from-input`;

interface EdgeResponse {
  roles?: { primary?: string; secondary?: string; accent?: string; background?: string; text?: string };
  suggestedName?: string;
  source?: string;
  error?: string;
}

async function callEndpoint(body: Record<string, unknown>): Promise<EdgeResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Sesion no disponible");
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as EdgeResponse;
  if (!res.ok) throw new Error(json.error || `Edge function HTTP ${res.status}`);
  return json;
}

function parseResult(raw: EdgeResponse, fallbackSource: ExtractResult["source"]): ExtractResult {
  const r = raw.roles || {};
  if (typeof r.primary !== "string" || !/^#[0-9A-F]{6}$/i.test(r.primary)) {
    throw new Error("La respuesta no incluye un color primary valido");
  }
  const valid = (v: unknown): v is string => typeof v === "string" && /^#[0-9A-F]{6}$/i.test(v);
  const roles: ColorRoles = { primary: r.primary.toUpperCase() };
  if (valid(r.secondary))  roles.secondary  = r.secondary.toUpperCase();
  if (valid(r.accent))     roles.accent     = r.accent.toUpperCase();
  if (valid(r.background)) roles.background = r.background.toUpperCase();
  if (valid(r.text))       roles.text       = r.text.toUpperCase();

  const suggestedName =
    (typeof raw.suggestedName === "string" && raw.suggestedName.trim()) || "Plantilla";
  const source =
    raw.source === "txt" || raw.source === "image" || raw.source === "pdf"
      ? raw.source
      : fallbackSource;
  return { roles, suggestedName, source };
}

/* ── PDF helpers (lazy-load pdfjs) ─────────────────────────── */

let pdfjsConfigured = false;
async function loadPdfjs() {
  // @ts-ignore - dynamic import sin types installed
  const pdfjs = await import("pdfjs-dist");
  if (!pdfjsConfigured) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    pdfjsConfigured = true;
  }
  return pdfjs;
}

async function pdfPage1ToPngDataUrl(file: File): Promise<string> {
  const pdfjs = await loadPdfjs();
  const arrayBuffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear contexto canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL("image/png");
}

/* ── File reader helpers ───────────────────────────────────── */

function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Error leyendo el archivo"));
    reader.readAsText(file);
  });
}

function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Error leyendo la imagen"));
    reader.readAsDataURL(file);
  });
}

/* ── Public API ────────────────────────────────────────────── */

export async function extractFromFile(file: File): Promise<ExtractResult> {
  const lower = file.name.toLowerCase();
  const type = file.type;

  try {
    if (type === "text/plain" || lower.endsWith(".txt")) {
      const text = await readTextFile(file);
      const raw = await callEndpoint({ source: "txt", text, filename: file.name });
      return parseResult(raw, "txt");
    }
    if (type.startsWith("image/")) {
      const dataUrl = await readImageAsDataUrl(file);
      const raw = await callEndpoint({ source: "image", imageBase64: dataUrl, filename: file.name });
      return parseResult(raw, "image");
    }
    if (type === "application/pdf" || lower.endsWith(".pdf")) {
      const pageDataUrl = await pdfPage1ToPngDataUrl(file);
      const raw = await callEndpoint({ source: "image", imageBase64: pageDataUrl, filename: file.name });
      return parseResult(raw, "pdf");
    }
    throw new Error(`Tipo de archivo no soportado: ${type || lower}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error procesando el archivo";
    log.error("templateFromFile", "extractFromFile failed", { name: file.name, type, msg });
    throw e instanceof Error ? e : new Error(msg);
  }
}
