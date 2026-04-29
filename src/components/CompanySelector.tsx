import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Layers, ChevronDown, Check, Plus, X } from "lucide-react";
import { useColorOverrides } from "../contexts/ColorOverrideContext";

function slugify(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function CompanySelector() {
  const { templates, activeTemplate, setActiveTemplate, addTemplate } = useColorOverrides();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#04202C");
  const ref = useRef<HTMLDivElement>(null);

  const current = templates.find((t) => t.id === activeTemplate) || templates[0];

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const slug = slugify(name);
  const idTaken = templates.some((t) => t.id === slug);
  const canCreate = slug.length > 0 && !idTaken && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color);

  const handleCreate = () => {
    if (!canCreate) return;
    addTemplate({ id: slug, name: name.trim(), color });
    setActiveTemplate(slug);
    setShowModal(false);
    setName("");
    setColor("#04202C");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-fog hover:text-white hover:bg-white/10 transition-colors"
      >
        <Layers size={14} />
        <span className="hidden sm:inline">{current.name}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-lg border border-nxt-200 z-[9999] overflow-hidden">
          <p className="px-3 py-2 text-[10px] font-bold text-nxt-400 uppercase tracking-wider border-b border-nxt-100 font-display">
            Plantilla
          </p>
          <div className="max-h-72 overflow-y-auto">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => { setActiveTemplate(t.id); setOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-nxt-700 hover:bg-nxt-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full ring-1 ring-nxt-200" style={{ backgroundColor: t.color }} />
                  <span>{t.name}</span>
                </div>
                {activeTemplate === t.id && <Check size={14} className="text-pine" />}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setOpen(false); setShowModal(true); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-pine hover:bg-pine/5 border-t border-nxt-100 transition-colors font-medium"
          >
            <Plus size={14} />
            Nueva plantilla
          </button>
        </div>
      )}

      {showModal && createPortal(
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-nxt-900">Nueva plantilla</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-nxt-400 hover:text-nxt-600 p-1 rounded transition-colors"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            <label className="block text-[11px] font-medium text-nxt-600 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && canCreate) handleCreate(); }}
              placeholder="Ej. Mi marca"
              className="w-full px-3 py-2 border border-nxt-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest mb-1"
              autoFocus
            />
            <p className="text-[10px] text-nxt-400 mb-4">
              ID: <span className="font-mono text-nxt-600">{slug || "(escribe un nombre)"}</span>
              {idTaken && <span className="text-error ml-2">ya existe</span>}
            </p>

            <label className="block text-[11px] font-medium text-nxt-600 mb-1">Color base</label>
            <div className="flex items-center gap-2 mb-4">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-9 rounded-lg cursor-pointer border border-nxt-200 p-0.5"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  let v = e.target.value;
                  if (!v.startsWith("#")) v = "#" + v;
                  v = "#" + v.slice(1).replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
                  setColor(v);
                }}
                className="flex-1 text-xs font-mono px-2 py-2 rounded-lg bg-nxt-50 text-nxt-800 border border-nxt-200 focus:outline-none focus:ring-2 focus:ring-forest/30"
                placeholder="#000000"
              />
              <div
                className="w-9 h-9 rounded-lg ring-1 ring-nxt-200"
                style={{ backgroundColor: color }}
                aria-hidden
              />
            </div>
            <p className="text-[10px] text-nxt-400 mb-4">
              La paleta completa se genera automaticamente desde este color base.
            </p>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 text-xs font-medium text-nxt-600 hover:bg-nxt-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={!canCreate}
                className="px-4 py-1.5 text-xs font-medium text-white bg-forest hover:bg-bark disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Crear y activar
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
