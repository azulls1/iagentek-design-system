import { Palette, RotateCcw } from "lucide-react";
import { useColorOverrides } from "../contexts/ColorOverrideContext";

export function ColorEditToolbar() {
  const { editMode, setEditMode, overrideCount, resetAll } = useColorOverrides();

  return (
    <div className="flex items-center gap-2">
      {overrideCount > 0 && (
        <span className="text-[10px] text-nxt-400 hidden sm:inline">
          {overrideCount} override{overrideCount !== 1 ? "s" : ""}
        </span>
      )}

      {editMode && overrideCount > 0 && (
        <button
          onClick={resetAll}
          className="p-1.5 rounded-md text-nxt-400 hover:text-error hover:bg-white/10 transition-colors"
          title="Resetear colores de esta plantilla"
        >
          <RotateCcw size={14} />
        </button>
      )}

      <button
        onClick={() => setEditMode(!editMode)}
        className={`
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all
          ${editMode
            ? "bg-forest text-white"
            : "text-nxt-300 hover:text-white hover:bg-white/10"
          }
        `}
        title={editMode ? "Desactivar modo editor" : "Activar modo editor de colores"}
      >
        <Palette size={14} />
        <span className="hidden sm:inline">{editMode ? "Editor ON" : "Colores"}</span>
      </button>
    </div>
  );
}
