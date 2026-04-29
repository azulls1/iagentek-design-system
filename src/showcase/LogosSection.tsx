import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Upload, Trash2, Download, Image, Star, Copy, Check,
  FolderOpen, RefreshCw, Plus, ArrowLeft, ChevronRight,
  Folder, X, MoveRight, CheckSquare, Square, XCircle,
} from "lucide-react";
import {
  uploadAssetToProject, listProjects, listProjectAssets,
  deleteAsset, createProject, moveAsset, TYPE_FOLDERS,
  type AssetFile, type ProjectFolder,
} from "../lib/minio";
import { useColorOverrides } from "../contexts/ColorOverrideContext";
import { log } from "../lib/logger";

/* ── Helpers ────────────────────────────────────────────── */

const TYPE_LABELS: Record<string, string> = { logo: "Logo", favicon: "Favicon", icon: "Icono", other: "Otro" };
const TYPE_BADGE: Record<string, string> = {
  logo: "bg-forest/20 text-yellow-700",
  favicon: "bg-info/20 text-info",
  icon: "bg-success/20 text-success",
  other: "bg-nxt-200 text-nxt-600",
};
const TYPE_OPTIONS: { value: AssetFile["type"]; label: string }[] = [
  { value: "logo", label: "Logos" },
  { value: "favicon", label: "Favicons" },
  { value: "icon", label: "Iconos" },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SectionHeader({ id, title, description, children }: { id?: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 sm:mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-nxt-900 mb-1">{title}</h2>
      {description && <p className="text-xs sm:text-sm text-nxt-500 mb-4 sm:mb-6">{description}</p>}
      {children}
    </section>
  );
}

/* ── Componente principal ───────────────────────────────── */

export function LogosSection({ scrollTo, userId }: { scrollTo?: string; userId: string }) {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTo]);

  const { activeTemplate } = useColorOverrides();
  const scope = useMemo(() => ({ userId, templateId: activeTemplate }), [userId, activeTemplate]);

  /* state */
  const [projects, setProjects] = useState<ProjectFolder[]>([]);
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState("");
  const [projectAssets, setProjectAssets] = useState<{ logos: AssetFile[]; favicons: AssetFile[]; icons: AssetFile[] }>({
    logos: [], favicons: [], icons: [],
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploadResults, setUploadResults] = useState<{ name: string; type: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* selection state */
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  /* move modal state */
  const [movingAssets, setMovingAssets] = useState<AssetFile[]>([]);
  const [moveTargetProject, setMoveTargetProject] = useState("");
  const [moveTargetType, setMoveTargetType] = useState<AssetFile["type"]>("logo");
  const [allProjects, setAllProjects] = useState<ProjectFolder[]>([]);
  const [movingInProgress, setMovingInProgress] = useState(false);

  /* all assets flat */
  const allAssets = [...projectAssets.logos, ...projectAssets.favicons, ...projectAssets.icons];
  const hasSelection = selectedKeys.size > 0;

  /* loaders */
  const loadProjects = useCallback(async () => {
    setLoading(true);
    try { setProjects(await listProjects(scope)); } catch (e) { log.error("Logos", "loading projects", { e }); }
    setLoading(false);
  }, [scope]);

  const loadAssets = useCallback(async (project: string) => {
    setLoading(true);
    try { setProjectAssets(await listProjectAssets(scope, project)); } catch (e) { log.error("Logos", "loading assets", { e }); }
    setLoading(false);
  }, [scope]);

  // Reset view when scope (user or template) changes; keep first-render load.
  const isFirstScopeRender = useRef(true);
  useEffect(() => {
    if (isFirstScopeRender.current) {
      isFirstScopeRender.current = false;
      // First render: just load projects (no reset needed since state is already initial).
      loadProjects();
      return;
    }
    // Subsequent scope changes: clear current view and reload projects list.
    setCurrentProject(null);
    setCurrentProjectName("");
    setProjectAssets({ logos: [], favicons: [], icons: [] });
    setSelectedKeys(new Set());
    setUploadResults([]);
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope.userId, scope.templateId]);

  // Load assets when entering a project (or reload if scope changed while inside one — handled by reset above).
  useEffect(() => {
    if (currentProject) loadAssets(currentProject);
  }, [currentProject, loadAssets]);

  /* selection helpers */
  const toggleSelect = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const selectAllAssets = () => {
    setSelectedKeys(new Set(allAssets.map((a) => a.key)));
  };

  const deselectAll = () => setSelectedKeys(new Set());

  const getSelectedAssets = (): AssetFile[] => allAssets.filter((a) => selectedKeys.has(a.key));

  /* handlers */
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !currentProject) return;
    setUploading(true);
    setUploadResults([]);
    try {
      const results = await Promise.all(Array.from(files).map((f) => uploadAssetToProject(f, scope, currentProject)));
      setUploadResults(results.map((r) => ({ name: r.name, type: r.type })));
      await loadAssets(currentProject);
      setTimeout(() => setUploadResults([]), 4000);
    } catch (e) { log.error("Logos", "Upload error", { e }); }
    setUploading(false);
  };

  const handleDelete = async (key: string) => {
    try {
      await deleteAsset(key);
      if (currentProject) await loadAssets(currentProject);
    } catch (e) { log.error("Logos", "Delete error", { e }); }
  };

  const handleBulkDelete = async () => {
    if (selectedKeys.size === 0) return;
    setMovingInProgress(true);
    try {
      await Promise.all([...selectedKeys].map((key) => deleteAsset(key)));
      setSelectedKeys(new Set());
      if (currentProject) await loadAssets(currentProject);
    } catch (e) { log.error("Logos", "Bulk delete error", { e }); }
    setMovingInProgress(false);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCreateFolder = async () => {
    const slug = newFolderName.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!slug) return;
    try {
      await createProject(scope, slug);
      const display = newFolderName.trim();
      setShowNewFolder(false);
      setNewFolderName("");
      setCurrentProjectName(display);
      setCurrentProject(slug);
    } catch (e) { log.error("Logos", "Error creating folder", { e }); }
  };

  const openProject = (p: ProjectFolder) => { setCurrentProject(p.name); setCurrentProjectName(p.displayName); setSelectedKeys(new Set()); };
  const goBack = () => { setCurrentProject(null); setCurrentProjectName(""); setProjectAssets({ logos: [], favicons: [], icons: [] }); setSelectedKeys(new Set()); };

  /* move handlers */
  const openMoveModal = async (assets: AssetFile[]) => {
    if (assets.length === 0) return;
    setMovingAssets(assets);
    setMoveTargetType(assets[0].type);
    setMoveTargetProject(currentProject || "_general");
    try {
      const prjs = await listProjects(scope);
      setAllProjects(prjs);
    } catch (e) { log.error("Logos", "Error loading projects for move", { e }); }
  };

  const openMoveForSelection = () => openMoveModal(getSelectedAssets());
  const openMoveForSingle = (asset: AssetFile) => openMoveModal([asset]);

  const handleMove = async () => {
    if (movingAssets.length === 0 || !moveTargetProject) return;
    setMovingInProgress(true);
    try {
      await Promise.all(movingAssets.map((a) => moveAsset(a.key, scope, moveTargetProject, moveTargetType)));
      setMovingAssets([]);
      setSelectedKeys(new Set());
      if (currentProject) await loadAssets(currentProject);
    } catch (e) { log.error("Logos", "Move error", { e }); }
    setMovingInProgress(false);
  };

  /* ── Subcomponentes ───────────────────────────────────── */

  const AssetCard = ({ asset }: { asset: AssetFile }) => {
    const isSelected = selectedKeys.has(asset.key);
    return (
      <div className={`nxt-card p-3 group hover:shadow-md transition-all relative ${isSelected ? "ring-2 ring-forest ring-offset-1" : ""}`}>
        {/* checkbox */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleSelect(asset.key); }}
          className={`absolute top-2 left-2 z-10 w-5 h-5 rounded flex items-center justify-center transition-all ${
            isSelected
              ? "bg-forest text-white shadow-sm"
              : "bg-white/80 border border-nxt-300 text-transparent hover:border-forest hover:text-forest opacity-0 group-hover:opacity-100"
          }`}
        >
          {isSelected ? <Check size={12} strokeWidth={3} /> : <Check size={12} />}
        </button>

        {/* preview */}
        <div className="w-full aspect-square bg-nxt-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-nxt-100">
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='8' height='8' fill='%23f0f0f0'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23f0f0f0'/%3E%3C/svg%3E\")", backgroundSize: "16px 16px" }}
          >
            <img src={asset.url} alt={asset.name} className="max-w-[80%] max-h-[80%] object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
        </div>
        {/* info */}
        <p className="text-xs font-medium text-nxt-700 truncate mb-0.5" title={asset.name}>{asset.name.replace(/^\d+-/, "")}</p>
        <p className="text-[10px] text-nxt-400 mb-2">{formatSize(asset.size)}</p>
        {/* actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => copyUrl(asset.url)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[10px] font-medium rounded bg-nxt-100 text-nxt-600 hover:bg-forest/20 hover:text-forest transition-colors" title="Copiar URL">
            {copied === asset.url ? <Check size={10} /> : <Copy size={10} />}
            {copied === asset.url ? "Copiado" : "URL"}
          </button>
          <button onClick={() => openMoveForSingle(asset)} className="flex items-center justify-center px-2 py-1 rounded bg-nxt-100 text-nxt-600 hover:bg-warning/20 hover:text-warning transition-colors" title="Mover a otra carpeta">
            <MoveRight size={10} />
          </button>
          <a href={asset.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-2 py-1 rounded bg-nxt-100 text-nxt-600 hover:bg-info/20 hover:text-info transition-colors" title="Descargar">
            <Download size={10} />
          </a>
          <button onClick={() => handleDelete(asset.key)} className="flex items-center justify-center px-2 py-1 rounded bg-nxt-100 text-nxt-600 hover:bg-error/20 hover:text-error transition-colors" title="Eliminar">
            <Trash2 size={10} />
          </button>
        </div>
      </div>
    );
  };

  const TypeSection = ({ label, icon, assets }: { label: string; icon: React.ReactNode; assets: AssetFile[] }) => {
    const allSelected = assets.length > 0 && assets.every((a) => selectedKeys.has(a.key));
    const someSelected = assets.some((a) => selectedKeys.has(a.key));

    const toggleTypeSelection = () => {
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        if (allSelected) {
          assets.forEach((a) => next.delete(a.key));
        } else {
          assets.forEach((a) => next.add(a.key));
        }
        return next;
      });
    };

    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-nxt-200">
          {icon}
          <h3 className="text-sm font-semibold text-nxt-700">{label}</h3>
          <span className="text-xs text-nxt-400 bg-nxt-100 px-2 py-0.5 rounded-full">{assets.length}</span>
          {assets.length > 0 && (
            <button
              onClick={toggleTypeSelection}
              className="ml-auto flex items-center gap-1 text-[10px] text-nxt-400 hover:text-forest transition-colors"
              title={allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
            >
              {allSelected ? <CheckSquare size={12} /> : someSelected ? <CheckSquare size={12} className="opacity-50" /> : <Square size={12} />}
              {allSelected ? "Deseleccionar" : "Seleccionar"}
            </button>
          )}
        </div>
        {assets.length === 0 ? (
          <p className="text-xs text-nxt-400 py-4 text-center">Sin {label.toLowerCase()} en esta carpeta</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {assets.map((a) => <AssetCard key={a.key} asset={a} />)}
          </div>
        )}
      </div>
    );
  };

  /* ── Selection toolbar (floating) ── */
  const SelectionToolbar = () => {
    if (!hasSelection) return null;
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-nxt-800 text-white rounded-xl shadow-xl border border-nxt-700">
          <span className="text-xs font-medium mr-1">
            {selectedKeys.size} seleccionado{selectedKeys.size > 1 ? "s" : ""}
          </span>

          <div className="w-px h-4 bg-nxt-600" />

          {/* select all */}
          <button
            onClick={selectAllAssets}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg hover:bg-nxt-700 transition-colors"
            title="Seleccionar todo"
          >
            <CheckSquare size={12} />
            Todo
          </button>

          {/* move */}
          <button
            onClick={openMoveForSelection}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg bg-forest text-white hover:bg-bark transition-colors"
            title="Mover seleccionados"
          >
            <MoveRight size={12} />
            Mover
          </button>

          {/* delete */}
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg hover:bg-error/20 hover:text-error transition-colors"
            title="Eliminar seleccionados"
          >
            <Trash2 size={12} />
            Eliminar
          </button>

          <div className="w-px h-4 bg-nxt-600" />

          {/* cancel */}
          <button
            onClick={deselectAll}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg hover:bg-nxt-700 transition-colors"
            title="Cancelar seleccion"
          >
            <XCircle size={12} />
          </button>
        </div>
      </div>
    );
  };

  const UploadZone = () => (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
      onClick={() => fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 mb-6 ${
        dragOver ? "border-forest bg-forest/10 scale-[1.01] shadow-lg" : "border-nxt-300 hover:border-forest hover:bg-forest/5"
      }`}
    >
      <input ref={fileInputRef} type="file" multiple accept="image/*,.ico,.svg" onChange={(e) => { handleUpload(e.target.files); e.target.value = ""; }} className="hidden" />
      {uploading ? (
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="w-7 h-7 text-forest animate-spin" />
          <p className="text-sm font-medium text-nxt-700">Subiendo...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Upload className={`w-6 h-6 transition-colors ${dragOver ? "text-forest" : "text-nxt-400"}`} />
          <p className="text-sm font-medium text-nxt-700">Arrastra archivos aqui o haz clic para seleccionar</p>
          <p className="text-xs text-nxt-400">PNG, SVG, ICO, JPG, WEBP — se clasifican automaticamente en logos, favicons o iconos</p>
        </div>
      )}
    </div>
  );

  const UploadResultsBanner = () => {
    if (uploadResults.length === 0) return null;
    return (
      <div className="mb-4 p-3 bg-success/10 border border-success/20 rounded-lg animate-fade-in">
        <p className="text-xs font-medium text-success mb-1.5">{uploadResults.length} archivo{uploadResults.length > 1 ? "s" : ""} subido{uploadResults.length > 1 ? "s" : ""} y clasificado{uploadResults.length > 1 ? "s" : ""}</p>
        <div className="flex flex-wrap gap-1.5">
          {uploadResults.map((r, i) => (
            <span key={i} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${TYPE_BADGE[r.type] || TYPE_BADGE.other}`}>
              {r.name} &rarr; {TYPE_LABELS[r.type] || r.type}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const NewFolderModal = () => {
    if (!showNewFolder) return null;
    const slug = newFolderName.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in" onClick={() => setShowNewFolder(false)}>
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 animate-zoom-in" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-nxt-800">Nueva carpeta de proyecto</h3>
            <button onClick={() => setShowNewFolder(false)} className="text-nxt-400 hover:text-nxt-600"><X size={16} /></button>
          </div>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            placeholder="Nombre del proyecto (ej: apollo, atlas)"
            className="w-full px-3 py-2 border border-nxt-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest mb-1"
            autoFocus
          />
          <p className="text-[10px] text-nxt-400 mb-4">
            Carpeta: <span className="font-mono text-nxt-600">{slug || "nombre"}/</span>
          </p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowNewFolder(false)} className="px-3 py-1.5 text-xs font-medium text-nxt-600 hover:bg-nxt-100 rounded-lg transition-colors">Cancelar</button>
            <button onClick={handleCreateFolder} disabled={!slug} className="px-4 py-1.5 text-xs font-medium text-nxt-900 bg-forest hover:bg-bark disabled:opacity-40 rounded-lg transition-colors">Crear</button>
          </div>
        </div>
      </div>
    );
  };

  /* ── Move modal (single & bulk) ── */
  const MoveModal = () => {
    if (movingAssets.length === 0) return null;
    const isSingle = movingAssets.length === 1;
    const firstAsset = movingAssets[0];
    const currentTypeFolder = TYPE_FOLDERS[firstAsset.type] || "otros";
    const targetTypeFolder = TYPE_FOLDERS[moveTargetType] || "otros";
    const fromLabel = currentProjectName || "General";
    const toProject = allProjects.find((p) => p.name === moveTargetProject);
    const toLabel = toProject?.displayName || moveTargetProject;
    const isSameLocation = moveTargetProject === (currentProject || "_general") && (isSingle ? moveTargetType === firstAsset.type : false);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in" onClick={() => setMovingAssets([])}>
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 animate-zoom-in" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-nxt-800">
              {isSingle ? "Mover archivo" : `Mover ${movingAssets.length} archivos`}
            </h3>
            <button onClick={() => setMovingAssets([])} className="text-nxt-400 hover:text-nxt-600"><X size={16} /></button>
          </div>

          {/* file preview */}
          {isSingle ? (
            <div className="flex items-center gap-3 p-3 bg-nxt-50 rounded-lg mb-4">
              <div className="w-10 h-10 rounded bg-white border border-nxt-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={firstAsset.url} alt="" className="max-w-[80%] max-h-[80%] object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-nxt-700 truncate">{firstAsset.name.replace(/^\d+-/, "")}</p>
                <p className="text-[10px] text-nxt-400">{fromLabel} / {currentTypeFolder}</p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-nxt-50 rounded-lg mb-4">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {movingAssets.slice(0, 8).map((a) => (
                  <div key={a.key} className="w-8 h-8 rounded bg-white border border-nxt-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={a.url} alt="" className="max-w-[80%] max-h-[80%] object-contain" />
                  </div>
                ))}
                {movingAssets.length > 8 && (
                  <div className="w-8 h-8 rounded bg-nxt-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-nxt-500">+{movingAssets.length - 8}</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-nxt-400">{movingAssets.length} archivos desde {fromLabel}</p>
            </div>
          )}

          {/* target project */}
          <label className="block text-[11px] font-medium text-nxt-600 mb-1">Carpeta destino</label>
          <select
            value={moveTargetProject}
            onChange={(e) => setMoveTargetProject(e.target.value)}
            className="w-full px-3 py-2 border border-nxt-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest mb-3 bg-white"
          >
            {allProjects.map((p) => (
              <option key={p.name} value={p.name}>{p.displayName}</option>
            ))}
          </select>

          {/* target type */}
          <label className="block text-[11px] font-medium text-nxt-600 mb-1">Clasificacion</label>
          <div className="flex gap-2 mb-4">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMoveTargetType(opt.value)}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  moveTargetType === opt.value
                    ? "border-forest bg-forest/10 text-nxt-800"
                    : "border-nxt-200 text-nxt-500 hover:border-nxt-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* preview move path */}
          <div className="p-2 bg-info/5 border border-info/20 rounded-lg mb-4">
            <p className="text-[10px] text-info flex items-center gap-1">
              <MoveRight size={10} />
              <span className="font-medium">{fromLabel}</span>
              <span>&rarr;</span>
              <span className="font-medium">{toLabel}/{targetTypeFolder}</span>
            </p>
          </div>

          {/* actions */}
          <div className="flex gap-2 justify-end">
            <button onClick={() => setMovingAssets([])} className="px-3 py-1.5 text-xs font-medium text-nxt-600 hover:bg-nxt-100 rounded-lg transition-colors">Cancelar</button>
            <button
              onClick={handleMove}
              disabled={isSameLocation || movingInProgress}
              className="px-4 py-1.5 text-xs font-medium text-nxt-900 bg-forest hover:bg-bark disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {movingInProgress ? <RefreshCw size={12} className="animate-spin" /> : <MoveRight size={12} />}
              {movingInProgress ? "Moviendo..." : isSingle ? "Mover" : `Mover ${movingAssets.length}`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SkeletonGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="nxt-card p-4 animate-pulse">
          <div className="w-full aspect-square bg-nxt-100 rounded-lg mb-3" />
          <div className="h-3 bg-nxt-100 rounded mb-2" />
          <div className="h-2 bg-nxt-100 rounded w-2/3" />
        </div>
      ))}
    </div>
  );

  const SkeletonFolders = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="nxt-card p-6 animate-pulse">
          <div className="w-12 h-12 bg-nxt-100 rounded-xl mb-3 mx-auto" />
          <div className="h-3 bg-nxt-100 rounded w-2/3 mx-auto" />
        </div>
      ))}
    </div>
  );

  /* ── Vista: dentro de un proyecto ─────────────────────── */

  if (currentProject) {
    const total = projectAssets.logos.length + projectAssets.favicons.length + projectAssets.icons.length;

    return (
      <>
        <SectionHeader
          id="logos-favicons"
          title="Logos & Favicons"
          description="Gestiona logos, favicons e iconos organizados por proyecto."
        >
          {/* breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <button onClick={goBack} className="flex items-center gap-1 text-xs font-medium text-nxt-500 hover:text-forest transition-colors">
              <ArrowLeft size={14} />
              Carpetas
            </button>
            <ChevronRight size={12} className="text-nxt-300" />
            <div className="flex items-center gap-1.5">
              <Folder size={14} className="text-forest" />
              <span className="text-xs font-semibold text-nxt-800">{currentProjectName}</span>
            </div>
            <span className="text-[10px] text-nxt-400 bg-nxt-100 px-2 py-0.5 rounded-full">
              {total} archivo{total !== 1 ? "s" : ""}
            </span>
            <div className="flex-1" />
            <button onClick={() => loadAssets(currentProject)} className="text-nxt-400 hover:text-nxt-600 p-1.5 transition-colors" title="Recargar">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* upload */}
          <UploadZone />
          <UploadResultsBanner />

          {/* assets by type */}
          {loading ? <SkeletonGrid /> : (
            <>
              <TypeSection label="Logos" icon={<Image size={16} className="text-forest" />} assets={projectAssets.logos} />
              <TypeSection label="Favicons" icon={<Star size={16} className="text-info" />} assets={projectAssets.favicons} />
              <TypeSection label="Iconos" icon={<FolderOpen size={16} className="text-success" />} assets={projectAssets.icons} />
            </>
          )}
        </SectionHeader>

        {/* guia de uso */}
        <SectionHeader id="logos-uso" title="Uso en proyectos" description="Como usar los assets subidos en Apollo, Atlas y otros proyectos.">
          <div className="nxt-card p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-nxt-700 mb-2">HTML / Favicon</h3>
              <pre className="bg-nxt-50 border border-nxt-200 rounded-lg p-3 text-xs font-mono text-nxt-700 overflow-x-auto">
{`<link rel="icon" href="https://storage.iagentek.dev/iagentek-assets/favicons/mi-favicon.ico" />
<link rel="apple-touch-icon" href="https://storage.iagentek.dev/iagentek-assets/logos/mi-logo.png" />`}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-nxt-700 mb-2">React / JSX</h3>
              <pre className="bg-nxt-50 border border-nxt-200 rounded-lg p-3 text-xs font-mono text-nxt-700 overflow-x-auto">
{`<img src="https://storage.iagentek.dev/iagentek-assets/logos/mi-logo.png" alt="Logo" />
// o con variable de entorno:
<img src={\`\${import.meta.env.VITE_MINIO_ENDPOINT}/iagentek-assets/logos/mi-logo.png\`} alt="Logo" />`}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-nxt-700 mb-2">CSS</h3>
              <pre className="bg-nxt-50 border border-nxt-200 rounded-lg p-3 text-xs font-mono text-nxt-700 overflow-x-auto">
{`background-image: url('https://storage.iagentek.dev/iagentek-assets/logos/mi-logo.png');`}
              </pre>
            </div>
          </div>
        </SectionHeader>

        <SelectionToolbar />
        <MoveModal />
      </>
    );
  }

  /* ── Vista: explorador de carpetas ────────────────────── */

  return (
    <>
      <SectionHeader
        id="logos-favicons"
        title="Logos & Favicons"
        description="Organiza logos, favicons e iconos por proyecto. Selecciona una carpeta para ver y subir assets."
      >
        {loading ? <SkeletonFolders /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.map((p) => (
              <button
                key={p.name}
                onClick={() => openProject(p)}
                className="nxt-card p-6 text-center hover:shadow-md hover:border-forest/30 transition-all group cursor-pointer text-left"
              >
                <div className="w-14 h-14 rounded-xl bg-forest/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-forest/20 transition-colors">
                  {p.name === "_general"
                    ? <FolderOpen size={26} className="text-forest" />
                    : <Folder size={26} className="text-forest" />
                  }
                </div>
                <p className="text-sm font-semibold text-nxt-800 text-center">{p.displayName}</p>
                <p className="text-[10px] text-nxt-400 text-center mt-0.5">
                  {p.name === "_general" ? "Archivos sin proyecto" : "Proyecto"}
                </p>
              </button>
            ))}

            {/* boton nueva carpeta */}
            <button
              onClick={() => setShowNewFolder(true)}
              className="border-2 border-dashed border-nxt-300 rounded-xl p-6 text-center hover:border-forest hover:bg-forest/5 transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-xl bg-nxt-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-forest/10 transition-colors">
                <Plus size={26} className="text-nxt-400 group-hover:text-forest transition-colors" />
              </div>
              <p className="text-sm font-medium text-nxt-500 group-hover:text-forest transition-colors">Nueva carpeta</p>
              <p className="text-[10px] text-nxt-400 mt-0.5">Crear proyecto</p>
            </button>
          </div>
        )}

        {/* refresh */}
        <div className="flex justify-center mt-4">
          <button onClick={loadProjects} className="flex items-center gap-1.5 text-xs text-nxt-400 hover:text-nxt-600 transition-colors">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Actualizar
          </button>
        </div>
      </SectionHeader>

      <NewFolderModal />
    </>
  );
}
