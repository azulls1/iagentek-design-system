import { useState, useRef, useEffect } from "react";
import { Layers, ChevronDown, Check, Plus } from "lucide-react";
import { useColorOverrides } from "../contexts/ColorOverrideContext";
import { CreateFromFileModal } from "./CreateFromFileModal";

export function CompanySelector() {
  const { templates, activeTemplate, setActiveTemplate } = useColorOverrides();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = templates.find((t) => t.id === activeTemplate) || templates[0];

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

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
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-nxt-200 z-[9999] overflow-hidden">
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
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3 h-3 rounded-full ring-1 ring-nxt-200 flex-shrink-0" style={{ backgroundColor: t.color }} />
                  <span className="truncate">{t.name}</span>
                </div>
                {activeTemplate === t.id && <Check size={14} className="text-pine flex-shrink-0" />}
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

      <CreateFromFileModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => setShowModal(false)}
      />
    </div>
  );
}
