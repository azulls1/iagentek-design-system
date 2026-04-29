import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { generatePalette, OFFICIAL_FOREST_PALETTE } from "../lib/paletteGenerator";
import { log } from "../lib/logger";

type ColorOverrideMap = Record<string, string>;
type AllOverridesMap = Record<string, ColorOverrideMap>;

export interface ColorRoles {
  primary: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
}

export interface Template {
  id: string;
  name: string;
  color: string;
  palette?: Record<string, string>;
  roles?: ColorRoles;
}

export const DEFAULT_TEMPLATES: Template[] = [
  { id: "iagentek", name: "IAgentek", color: "#04202C", palette: OFFICIAL_FOREST_PALETTE },
  { id: "fresco-y-brillante", name: "Fresco y Brillante", color: "#FF420E" },
  { id: "sutil-y-profesional", name: "Sutil y Profesional", color: "#336B87" },
  { id: "oscuro-y-terroso", name: "Oscuro y Terroso", color: "#BA5536" },
  { id: "nitido-y-dramatico", name: "Nitido y Dramatico", color: "#598234" },
  { id: "azules-frios", name: "Azules Frios", color: "#07575B" },
  { id: "aire-libre-y-natural", name: "Aire Libre y Natural", color: "#2E4600" },
  { id: "verde-azulado-acuoso", name: "Verde-Azulado Acuoso", color: "#004445" },
];

interface ColorOverrideContextValue {
  overrides: ColorOverrideMap;
  getOverride: (elementKey: string, property: string) => string | undefined;
  setOverride: (elementKey: string, property: string, hex: string) => void;
  removeOverride: (elementKey: string, property: string) => void;
  resetAll: () => void;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  isLoading: boolean;
  overrideCount: number;
  activeTemplate: string;
  setActiveTemplate: (id: string) => void;
  templates: Template[];
  addTemplate: (template: Template) => void;
}

const ColorOverrideContext = createContext<ColorOverrideContextValue | null>(null);

function storageKey(userId: string) {
  return `iagentek-overrides-${userId}`;
}

function templatesKey(userId: string) {
  return `iagentek-templates-${userId}`;
}

// Detect old flat format ({"key.prop":"#hex", ...}) vs new nested
// ({templateId: {"key.prop":"#hex", ...}}) and migrate flat → nested,
// assuming legacy data belongs to the iagentek default template.
function migrateOverrides(raw: unknown): AllOverridesMap {
  if (!raw || typeof raw !== "object") return {};
  const obj = raw as Record<string, unknown>;
  const looksFlat = Object.values(obj).some((v) => typeof v === "string");
  if (looksFlat) return { iagentek: obj as ColorOverrideMap };
  // Already nested — narrow types defensively.
  const out: AllOverridesMap = {};
  for (const [tplId, val] of Object.entries(obj)) {
    if (val && typeof val === "object") out[tplId] = val as ColorOverrideMap;
  }
  return out;
}

interface ProviderProps {
  children: ReactNode;
  userId?: string;
}

export function ColorOverrideProvider({ children, userId }: ProviderProps) {
  const [allOverrides, setAllOverrides] = useState<AllOverridesMap>({});
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();
  const [activeTemplate, setActiveTemplateState] = useState("iagentek");
  const [templates, setTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);

  const uid = userId || "anonymous";

  // Active-template slice exposed to consumers — recomputes when template changes.
  const overrides = useMemo<ColorOverrideMap>(
    () => allOverrides[activeTemplate] || {},
    [allOverrides, activeTemplate],
  );

  const handleSetActiveTemplate = useCallback((id: string) => {
    setActiveTemplateState(id);
    try {
      localStorage.setItem('iagentek-active-template-' + uid, id);
    } catch { /* ignore */ }
  }, [uid]);

  const addTemplate = useCallback((template: Template) => {
    setTemplates((prev) => {
      if (prev.some((t) => t.id === template.id)) return prev;
      const next = [...prev, template];
      // Persist to Supabase (preferred) and localStorage (fallback / cache).
      const custom = next.filter((t) => !DEFAULT_TEMPLATES.some((d) => d.id === t.id));
      try { localStorage.setItem(templatesKey(uid), JSON.stringify(custom)); } catch { /* ignore */ }
      if (useSupabase && uid !== "anonymous") {
        // Stuff `roles` inside the `palette` jsonb under a sentinel key so we
        // dont need a schema migration. On load we extract __roles__ back out.
        const paletteWithRoles: Record<string, unknown> = { ...(template.palette || {}) };
        if (template.roles) paletteWithRoles.__roles__ = template.roles;
        supabase
          .from("iagentek-designsystem-templates")
          .upsert({
            id: template.id,
            name: template.name,
            color: template.color,
            sort_order: 0,
            user_id: uid,
            palette: paletteWithRoles,
          })
          .then(({ error }) => {
            if (error) log.warn("ColorOverride", "template persist (supabase)", { msg: error.message });
          });
      }
      return next;
    });
  }, [uid, useSupabase]);

  // --- Load overrides + custom templates on mount / user change ---
  useEffect(() => {
    let cancelled = false;

    async function load() {
      // Hydrate templates from localStorage cache first (fast path, no flicker).
      try {
        const customJson = localStorage.getItem(templatesKey(uid));
        if (customJson) {
          const custom = JSON.parse(customJson) as Template[];
          if (!cancelled) setTemplates([...DEFAULT_TEMPLATES, ...custom]);
        }
      } catch { /* ignore */ }

      try {
        const stored = localStorage.getItem('iagentek-active-template-' + uid);
        if (stored && !cancelled) setActiveTemplateState(stored);
      } catch { /* ignore */ }

      // Try Supabase for both templates and overrides.
      let supabaseOk = false;
      try {
        const { data: tplData, error: tplErr } = await supabase
          .from("iagentek-designsystem-templates")
          .select("id, name, color, palette")
          .eq("user_id", uid);
        if (!tplErr && Array.isArray(tplData) && !cancelled) {
          const custom: Template[] = tplData.map((row) => {
            const tpl: Template = {
              id: String(row.id),
              name: String(row.name),
              color: String(row.color),
            };
            // Extract roles from palette.__roles__ sentinel if present.
            const pal = row.palette as Record<string, unknown> | null | undefined;
            if (pal && typeof pal === "object" && pal.__roles__) {
              tpl.roles = pal.__roles__ as ColorRoles;
              const { __roles__, ...rest } = pal;
              void __roles__;
              if (Object.keys(rest).length > 0) tpl.palette = rest as Record<string, string>;
            } else if (pal && typeof pal === "object") {
              tpl.palette = pal as Record<string, string>;
            }
            return tpl;
          });
          setTemplates([...DEFAULT_TEMPLATES, ...custom]);
          try { localStorage.setItem(templatesKey(uid), JSON.stringify(custom)); } catch { /* ignore */ }
          supabaseOk = true;
        }
      } catch { /* network / auth */ }

      try {
        const { data, error } = await supabase
          .from("iagentek-designsystem-overrides")
          .select("overrides")
          .eq("id", uid)
          .maybeSingle();

        if (!cancelled && !error) {
          if (data) setAllOverrides(migrateOverrides(data.overrides));
          setUseSupabase(true);
          setIsLoading(false);
          return;
        }
      } catch {
        // Supabase not available
      }

      if (!cancelled) {
        setUseSupabase(supabaseOk);
        try {
          const stored = localStorage.getItem(storageKey(uid));
          if (stored) setAllOverrides(migrateOverrides(JSON.parse(stored)));
        } catch { /* ignore */ }
        setIsLoading(false);
      }
    }

    setAllOverrides({});
    setIsLoading(true);
    load();
    return () => { cancelled = true; };
  }, [uid]);

  // --- Apply template palette + roles to :root CSS variables ---
  useEffect(() => {
    const current = templates.find((t) => t.id === activeTemplate);
    if (!current) return;
    const palette = { ...generatePalette(current.color), ...(current.palette || {}) };
    // Si el template tiene roles, sobrescriben los slots semanticos.
    // - primary    → la paleta completa ya viene de current.color; nada extra.
    // - secondary  → --color-secondary, --color-pine (alias historico)
    // - accent     → --color-accent
    // - background → --color-page, --color-background
    // - text       → --color-text-primary
    if (current.roles) {
      const r = current.roles;
      if (r.secondary)  { palette['color-secondary']    = r.secondary;  palette['color-pine']     = r.secondary; }
      if (r.accent)     { palette['color-accent']       = r.accent; }
      if (r.background) { palette['color-page']         = r.background; palette['color-background'] = r.background; }
      if (r.text)       { palette['color-text-primary'] = r.text; }
    }
    const root = document.documentElement;
    for (const [key, value] of Object.entries(palette)) {
      root.style.setProperty('--' + key, value);
    }
  }, [activeTemplate, templates]);

  // --- Debounced persist of the full nested map (per-user) ---
  const persist = useCallback(
    (next: AllOverridesMap) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        if (useSupabase) {
          await supabase
            .from("iagentek-designsystem-overrides")
            .upsert({ id: uid, overrides: next, updated_at: new Date().toISOString() });
        } else {
          localStorage.setItem(storageKey(uid), JSON.stringify(next));
        }
      }, 500);
    },
    [useSupabase, uid],
  );

  const getOverride = useCallback(
    (elementKey: string, property: string) => overrides[`${elementKey}.${property}`],
    [overrides],
  );

  const setOverride = useCallback(
    (elementKey: string, property: string, hex: string) => {
      setAllOverrides((prev) => {
        const tplSlice = prev[activeTemplate] || {};
        const nextSlice = { ...tplSlice, [`${elementKey}.${property}`]: hex };
        const nextAll = { ...prev, [activeTemplate]: nextSlice };
        persist(nextAll);
        return nextAll;
      });
    },
    [activeTemplate, persist],
  );

  const removeOverride = useCallback(
    (elementKey: string, property: string) => {
      setAllOverrides((prev) => {
        const tplSlice = prev[activeTemplate] || {};
        if (!(`${elementKey}.${property}` in tplSlice)) return prev;
        const nextSlice = { ...tplSlice };
        delete nextSlice[`${elementKey}.${property}`];
        const nextAll = { ...prev };
        if (Object.keys(nextSlice).length === 0) delete nextAll[activeTemplate];
        else nextAll[activeTemplate] = nextSlice;
        persist(nextAll);
        return nextAll;
      });
    },
    [activeTemplate, persist],
  );

  // Reset only the ACTIVE template's overrides; other templates are untouched.
  const resetAll = useCallback(() => {
    setAllOverrides((prev) => {
      if (!prev[activeTemplate]) return prev;
      const nextAll = { ...prev };
      delete nextAll[activeTemplate];
      persist(nextAll);
      return nextAll;
    });
  }, [activeTemplate, persist]);

  return (
    <ColorOverrideContext.Provider
      value={{
        overrides,
        getOverride,
        setOverride,
        removeOverride,
        resetAll,
        editMode,
        setEditMode,
        isLoading,
        overrideCount: Object.keys(overrides).length,
        activeTemplate,
        setActiveTemplate: handleSetActiveTemplate,
        templates,
        addTemplate,
      }}
    >
      {children}
    </ColorOverrideContext.Provider>
  );
}

export function useColorOverrides() {
  const ctx = useContext(ColorOverrideContext);
  if (!ctx) throw new Error("useColorOverrides must be used within ColorOverrideProvider");
  return ctx;
}
