// Cliente de assets via Edge Function (presigned URLs).
// Las credenciales de MinIO YA NO viven en el bundle: la Edge Function
// `iagentek-storage-presign` firma las URLs server-side y ademas obliga
// al user a operar SOLO en su namespace `users/<userId>/`.
//
// Lectura de objetos: el bucket tiene policy `download` (anonymous GetObject),
// asi que para leer hacemos fetch directo a `${ENDPOINT}/${BUCKET}/${key}`.

import { supabase } from "./supabase";

const ENDPOINT = import.meta.env.VITE_MINIO_ENDPOINT as string;
export const BUCKET = (import.meta.env.VITE_MINIO_BUCKET as string) || "iagentek-designsystem-assets";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

const PRESIGN_URL = `${SUPABASE_URL}/functions/v1/iagentek-storage-presign`;

export interface AssetFile {
  key: string;
  name: string;
  url: string;
  size: number;
  lastModified: Date;
  type: "logo" | "favicon" | "icon" | "other";
}

export interface ProjectFolder {
  name: string;
  displayName: string;
}

export interface AssetScope {
  userId: string;
  templateId: string;
}

interface PresignResponse {
  url?: string;
  method?: "PUT" | "DELETE";
  objects?: { key: string; size: number; lastModified: string; etag: string }[];
  error?: string;
}

function objectUrl(key: string): string {
  return `${ENDPOINT}/${BUCKET}/${key}`;
}

function scopePrefix(scope: AssetScope): string {
  return `users/${scope.userId}/templates/${scope.templateId}/`;
}

async function callPresign(body: {
  action: "upload" | "delete" | "list";
  key?: string;
  prefix?: string;
  contentType?: string;
}): Promise<PresignResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error("Sesion no disponible");
  const res = await fetch(PRESIGN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as PresignResponse;
  if (!res.ok) throw new Error(json.error || `presign HTTP ${res.status}`);
  return json;
}

/* ── Clasificacion automatica ───────────────────────────── */

export const TYPE_FOLDERS: Record<string, string> = { logo: "logos", favicon: "favicons", icon: "icons", other: "otros" };
const FOLDER_TYPES: Record<string, AssetFile["type"]> = { logos: "logo", favicons: "favicon", icons: "icon", otros: "other" };
const LEGACY_FOLDERS = new Set(["logos", "favicons", "icons"]);

export function classifyAsset(name: string): AssetFile["type"] {
  const lower = name.toLowerCase();
  const ext = lower.split(".").pop() || "";
  if (ext === "ico") return "favicon";
  if (lower.includes("favicon")) return "favicon";
  if (lower.includes("apple-touch-icon")) return "icon";
  if (lower.includes("android-chrome")) return "icon";
  if (lower.includes("icon")) return "icon";
  if (ext === "svg") return "icon";
  if (ext === "webmanifest" || (ext === "json" && lower.includes("manifest"))) return "icon";
  if (lower.includes("logo")) return "logo";
  return "logo";
}

/* ── Operaciones ────────────────────────────────────────── */

async function putObject(key: string, file: File): Promise<void> {
  const { url } = await callPresign({ action: "upload", key, contentType: file.type });
  if (!url) throw new Error("Edge Function did not return URL");
  const buf = await file.arrayBuffer();
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: new Uint8Array(buf),
  });
  if (!res.ok) throw new Error(`Upload failed: HTTP ${res.status}`);
}

async function putBytes(key: string, bytes: Uint8Array, contentType: string): Promise<void> {
  const { url } = await callPresign({ action: "upload", key, contentType });
  if (!url) throw new Error("Edge Function did not return URL");
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: bytes,
  });
  if (!res.ok) throw new Error(`Upload failed: HTTP ${res.status}`);
}

export async function deleteAsset(key: string): Promise<void> {
  const { url } = await callPresign({ action: "delete", key });
  if (!url) throw new Error("Edge Function did not return URL");
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error(`Delete failed: HTTP ${res.status}`);
}

async function listPrefix(prefix: string): Promise<NonNullable<PresignResponse["objects"]>> {
  const { objects } = await callPresign({ action: "list", prefix });
  return objects || [];
}

/* ── Funciones de proyectos ─────────────────────────────── */

export async function listProjects(scope: AssetScope): Promise<ProjectFolder[]> {
  const prefix = scopePrefix(scope);
  const objects = await listPrefix(prefix);

  const projects: ProjectFolder[] = [];
  const seen = new Set<string>();
  let hasLegacy = false;

  for (const obj of objects) {
    const after = obj.key.slice(prefix.length);
    const firstSeg = after.split("/")[0];
    if (!firstSeg || seen.has(firstSeg)) continue;
    seen.add(firstSeg);
    if (LEGACY_FOLDERS.has(firstSeg)) {
      hasLegacy = true;
    } else {
      projects.push({
        name: firstSeg,
        displayName: firstSeg.charAt(0).toUpperCase() + firstSeg.slice(1).replace(/-/g, " "),
      });
    }
  }

  if (hasLegacy) {
    projects.unshift({ name: "_general", displayName: "General" });
  }

  projects.sort((a, b) => {
    if (a.name === "_general") return -1;
    if (b.name === "_general") return 1;
    return a.displayName.localeCompare(b.displayName);
  });

  return projects;
}

export async function createProject(scope: AssetScope, name: string): Promise<void> {
  const key = `${scopePrefix(scope)}${name}/.placeholder`;
  await putBytes(key, new Uint8Array([0x20]), "application/octet-stream");
}

export async function listProjectAssets(scope: AssetScope, project: string): Promise<{
  logos: AssetFile[];
  favicons: AssetFile[];
  icons: AssetFile[];
}> {
  const result: { logos: AssetFile[]; favicons: AssetFile[]; icons: AssetFile[] } = {
    logos: [], favicons: [], icons: [],
  };
  const base = scopePrefix(scope);

  const fetches = (["logos", "favicons", "icons"] as const).map(async (typeFolder) => {
    const prefix = project === "_general"
      ? `${base}${typeFolder}/`
      : `${base}${project}/${typeFolder}/`;
    const objects = await listPrefix(prefix);

    result[typeFolder] = objects
      .filter((obj) => {
        if (obj.size <= 0) return false;
        if (obj.key.endsWith("/.placeholder")) return false;
        if (project === "_general") {
          const afterPrefix = obj.key.slice(prefix.length);
          return !afterPrefix.includes("/");
        }
        return true;
      })
      .map((obj) => ({
        key: obj.key,
        name: obj.key.split("/").pop() || obj.key,
        url: objectUrl(obj.key),
        size: obj.size,
        lastModified: new Date(obj.lastModified),
        type: FOLDER_TYPES[typeFolder] || ("other" as AssetFile["type"]),
      }));
  });

  await Promise.all(fetches);
  return result;
}

export async function uploadAssetToProject(
  file: File,
  scope: AssetScope,
  project: string,
  typeOverride?: AssetFile["type"],
): Promise<AssetFile> {
  const type = typeOverride || classifyAsset(file.name);
  const typeFolder = TYPE_FOLDERS[type] || "otros";
  const projectPrefix = project === "_general" ? typeFolder : `${project}/${typeFolder}`;
  const key = `${scopePrefix(scope)}${projectPrefix}/${Date.now()}-${file.name}`;

  await putObject(key, file);

  return {
    key,
    name: file.name,
    url: objectUrl(key),
    size: file.size,
    lastModified: new Date(),
    type,
  };
}

export async function moveAsset(
  sourceKey: string,
  scope: AssetScope,
  targetProject: string,
  targetType: AssetFile["type"],
): Promise<void> {
  const fileName = sourceKey.split("/").pop() || sourceKey;
  const typeFolder = TYPE_FOLDERS[targetType] || "otros";
  const targetProjectPrefix = targetProject === "_general" ? typeFolder : `${targetProject}/${typeFolder}`;
  const targetKey = `${scopePrefix(scope)}${targetProjectPrefix}/${fileName}`;

  // GET via download policy publica del bucket; despues PUT presigned y DELETE presigned.
  const res = await fetch(objectUrl(sourceKey));
  if (!res.ok) throw new Error(`Read source failed: HTTP ${res.status}`);
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  const buf = new Uint8Array(await res.arrayBuffer());

  await putBytes(targetKey, buf, contentType);
  await deleteAsset(sourceKey);
}

/* ── Funciones legacy (compatibilidad con codigo de showcase) ──── */

export async function uploadAsset(file: File, folder = "logos"): Promise<AssetFile> {
  // En el modelo nuevo no se usa el folder global "logos". Esta firma sigue
  // disponible solo para no romper imports antiguos; redirige al primer template.
  void folder;
  throw new Error("uploadAsset (legacy) eliminado. Usa uploadAssetToProject(file, scope, project).");
}

export async function listAssets(_folder = ""): Promise<AssetFile[]> {
  throw new Error("listAssets (legacy) eliminado. Usa listProjectAssets(scope, project).");
}
