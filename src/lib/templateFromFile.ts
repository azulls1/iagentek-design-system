// Client wrapper around the `iagentek-template-from-input` Edge Function.
//
// Three input shapes are supported: plain text (.txt), raster images, and
// PDFs (rendered to PNG client-side via pdfjs-dist before being sent as an
// image). All three produce the same `TemplateInputResult` shape so callers
// can treat them uniformly.

import { supabase } from "./supabase";
import { log } from "./logger";

export type TemplateInputResult = {
  colors: string[];
  suggestedName: string;
  source: "txt" | "image";
};

type TxtRequest = { source: "txt"; text: string; filename?: string };
type ImageRequest = { source: "image"; imageBase64: string; filename?: string };
type RequestBody = TxtRequest | ImageRequest;

const ENDPOINT_PATH = "/functions/v1/iagentek-template-from-input";

function getEndpoint(): string {
  const base = import.meta.env.VITE_SUPABASE_URL;
  if (!base) throw new Error("VITE_SUPABASE_URL no esta configurado");
  return base.replace(/\/+$/, "") + ENDPOINT_PATH;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    log.error("templateFromFile", "auth.getSession error", { msg: error.message });
    throw new Error("No se pudo obtener la sesion de usuario");
  }
  const token = data.session?.access_token;
  if (!token) throw new Error("Sesion no iniciada");
  return { Authorization: `Bearer ${token}` };
}

function isResultShape(v: unknown): v is TemplateInputResult {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    Array.isArray(o.colors) &&
    o.colors.every((c) => typeof c === "string") &&
    typeof o.suggestedName === "string" &&
    typeof o.source === "string"
  );
}

async function postToEndpoint(body: RequestBody): Promise<TemplateInputResult> {
  const url = getEndpoint();
  const auth = await getAuthHeader();
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...auth },
      body: JSON.stringify(body),
    });
  } catch (e) {
    log.error("templateFromFile", "fetch failed", { e });
    throw new Error("No se pudo contactar el servicio");
  }

  let parsed: unknown = null;
  const rawText = await res.text();
  if (rawText) {
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // ignore — non-JSON body, handled below
    }
  }

  if (!res.ok) {
    const errMsg =
      (parsed && typeof parsed === "object" && "error" in parsed && typeof (parsed as { error: unknown }).error === "string"
        ? (parsed as { error: string }).error
        : null) ||
      (parsed && typeof parsed === "object" && "message" in parsed && typeof (parsed as { message: unknown }).message === "string"
        ? (parsed as { message: string }).message
        : null) ||
      rawText ||
      `HTTP ${res.status}`;
    log.error("templateFromFile", "endpoint error", { status: res.status, errMsg });
    throw new Error(`Error del servicio: ${errMsg}`);
  }

  if (!isResultShape(parsed)) {
    log.error("templateFromFile", "unexpected response shape", { parsed });
    throw new Error("Respuesta inesperada del servicio");
  }
  return parsed;
}

/* ── TXT ─────────────────────────────────────────────── */

export async function extractFromTxt(text: string, filename?: string): Promise<TemplateInputResult> {
  if (!text || text.trim().length === 0) {
    throw new Error("El archivo de texto esta vacio");
  }
  return postToEndpoint({ source: "txt", text, filename });
}

/* ── Image ───────────────────────────────────────────── */

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("No se pudo leer el archivo"));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error("Error leyendo el archivo"));
    reader.readAsDataURL(file);
  });
}

export async function extractFromImage(file: File): Promise<TemplateInputResult> {
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("La imagen supera los 8 MB permitidos");
  }
  const dataUrl = await readFileAsDataUrl(file);
  return postToEndpoint({ source: "image", imageBase64: dataUrl, filename: file.name });
}

/* ── PDF (page 1 → image) ─────────────────────────────── */

let workerConfigured = false;

interface PdfViewport {
  width: number;
  height: number;
}

interface PdfRenderTask {
  promise: Promise<void>;
}

interface PdfPage {
  getViewport(params: { scale: number }): PdfViewport;
  render(params: { canvasContext: CanvasRenderingContext2D; viewport: PdfViewport }): PdfRenderTask;
}

interface PdfDocument {
  numPages: number;
  getPage(pageNumber: number): Promise<PdfPage>;
}

interface PdfLoadingTask {
  promise: Promise<PdfDocument>;
}

interface PdfJsModule {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(src: { data: ArrayBuffer }): PdfLoadingTask;
}

async function loadPdfJs(): Promise<PdfJsModule> {
  const mod = (await import("pdfjs-dist")) as unknown as PdfJsModule;
  if (!workerConfigured) {
    mod.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    workerConfigured = true;
  }
  return mod;
}

export async function extractFromPdf(file: File): Promise<TemplateInputResult> {
  if (file.size > 32 * 1024 * 1024) {
    throw new Error("El PDF supera los 32 MB permitidos");
  }
  const pdfjs = await loadPdfJs();
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  if (doc.numPages < 1) throw new Error("El PDF no tiene paginas");
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale: 2 });

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear el contexto del canvas");

  await page.render({ canvasContext: ctx, viewport }).promise;
  const dataUrl = canvas.toDataURL("image/png");

  // Bytes (rough estimate for 8 MB guard) — base64 is ~4/3 of binary size.
  const approxBytes = Math.floor((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75);
  if (approxBytes > 8 * 1024 * 1024) {
    throw new Error("La pagina renderizada supera los 8 MB permitidos");
  }

  return postToEndpoint({ source: "image", imageBase64: dataUrl, filename: file.name });
}
