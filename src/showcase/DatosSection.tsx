import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { ColorEditable } from "../components/ColorEditable";
import { resolveDefaultBg } from "../utils/tailwindColorMap";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function Section({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10 sm:mb-12">
      <h2 className="text-xl sm:text-2xl font-bold text-nxt-900 mb-1">
        {title}
      </h2>
      {description && (
        <p className="text-xs sm:text-sm text-nxt-500 mb-4 sm:mb-6">
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

/** Highlight matching text in a string */
function HighlightText({
  text,
  query,
  highlightClass,
}: {
  text: string;
  query: string;
  highlightClass?: string;
}) {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className={highlightClass ?? "bg-yellow-200/80 text-inherit rounded-sm px-0.5"}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  { label: "Total Sitios", value: "156", color: "border-forest" },
  { label: "Activos", value: "142", color: "border-success" },
  { label: "Con Monitoreo", value: "128", color: "border-info" },
  { label: "Sin Monitoreo", value: "14", color: "border-warning" },
  { label: "Baja", value: "3", color: "border-error" },
];

type RowData = {
  rpu: string;
  nombre: string;
  division: string;
  tarifa: string;
  status: string;
  consumo: string;
};

const rows: RowData[] = [
  {
    rpu: "120450987612",
    nombre: "Centro Comercial Norte",
    division: "Norte",
    tarifa: "HM",
    status: "Activo",
    consumo: "12,450 kWh",
  },
  {
    rpu: "098712345678",
    nombre: "Planta Industrial Sur",
    division: "Sur",
    tarifa: "GDMTH",
    status: "Activo",
    consumo: "87,200 kWh",
  },
  {
    rpu: "234509871234",
    nombre: "Oficinas Corporativas",
    division: "Centro",
    tarifa: "GDMTO",
    status: "Monitoreo",
    consumo: "5,890 kWh",
  },
  {
    rpu: "345612098745",
    nombre: "Sucursal Peninsular",
    division: "Peninsular",
    tarifa: "HM",
    status: "Sin Monitoreo",
    consumo: "3,210 kWh",
  },
  {
    rpu: "456789012345",
    nombre: "Almacen Logistico",
    division: "Centro",
    tarifa: "DIST",
    status: "Baja",
    consumo: "0 kWh",
  },
];

/* Compact rows for 3-col view: show 5 rows */
const compactRows = rows.slice(0, 5);

const statusStyles: Record<string, string> = {
  Activo: "bg-success/10 text-success",
  Monitoreo: "bg-info/10 text-info",
  "Sin Monitoreo": "bg-warning/10 text-warning",
  Baja: "bg-error/10 text-error",
};

type LogEntry = {
  ts: string;
  level: string;
  msg: string;
  requestId?: string;
  stack?: string;
  source?: string;
};

const logLines: LogEntry[] = [
  {
    ts: "2026-04-14 08:12:01",
    level: "INFO",
    msg: "Servicio iniciado correctamente en puerto 3000",
    requestId: "req-001-abc",
    source: "server.ts:42",
  },
  {
    ts: "2026-04-14 08:12:02",
    level: "INFO",
    msg: "Conexion a Supabase establecida (pool: 10)",
    requestId: "req-002-def",
    source: "db/connect.ts:18",
  },
  {
    ts: "2026-04-14 08:12:05",
    level: "INFO",
    msg: "Cache Redis conectado â€” latencia 2ms",
    requestId: "req-003-ghi",
    source: "cache/redis.ts:31",
  },
  {
    ts: "2026-04-14 08:13:42",
    level: "WARN",
    msg: "Rate limit cercano al umbral para IP 192.168.1.45 (85/100)",
    requestId: "req-004-jkl",
    source: "middleware/rateLimit.ts:67",
  },
  {
    ts: "2026-04-14 08:14:10",
    level: "ERROR",
    msg: "Timeout al consultar API CFE â€” reintentando (1/3)",
    requestId: "req-005-mno",
    source: "services/cfe.ts:112",
    stack:
      "Error: ETIMEDOUT\n    at CFEService.fetch (services/cfe.ts:112)\n    at SyncWorker.run (workers/sync.ts:45)\n    at async main (index.ts:8)",
  },
  {
    ts: "2026-04-14 08:14:12",
    level: "INFO",
    msg: "Reintento exitoso â€” datos CFE actualizados",
    requestId: "req-006-pqr",
    source: "services/cfe.ts:128",
  },
  {
    ts: "2026-04-14 08:15:00",
    level: "WARN",
    msg: "Certificado SSL expira en 15 dias â€” renovar antes del 2026-04-29",
    requestId: "req-007-stu",
    source: "middleware/ssl.ts:23",
  },
  {
    ts: "2026-04-14 08:15:33",
    level: "ERROR",
    msg: "Error de parseo en archivo CSV linea 847: columna 'tarifa' vacia",
    requestId: "req-008-vwx",
    source: "parsers/csv.ts:89",
    stack:
      "ParseError: Empty column 'tarifa' at row 847\n    at CSVParser.parse (parsers/csv.ts:89)\n    at ImportJob.run (jobs/import.ts:34)",
  },
];

/* Compact logs for 3-col view: show 6 entries */
const compactLogs = logLines.slice(0, 6);

const levelColor: Record<string, string> = {
  INFO: "text-sky-400",
  WARN: "text-amber-400",
  ERROR: "text-red-400",
};

const levelColorLight: Record<string, string> = {
  INFO: "text-sky-600",
  WARN: "text-amber-600",
  ERROR: "text-red-600",
};

type SortDir = "asc" | "desc";
type ColKey = keyof RowData;
const colKeys: ColKey[] = ["rpu", "nombre", "division", "tarifa", "status", "consumo"];
const colLabels: Record<ColKey, string> = {
  rpu: "RPU",
  nombre: "Nombre",
  division: "Division",
  tarifa: "Tarifa",
  status: "Status",
  consumo: "Consumo",
};

/* ------------------------------------------------------------------ */
/*  Hook: sortable + filterable table state                            */
/* ------------------------------------------------------------------ */

function useTableState() {
  const [search, setSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [flashRow, setFlashRow] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState<ColKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = useCallback(
    (col: ColKey) => {
      if (sortCol === col) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortCol(col);
        setSortDir("asc");
      }
    },
    [sortCol]
  );

  const handleRowClick = useCallback(
    (rpu: string) => {
      setSelectedRow((prev) => (prev === rpu ? null : rpu));
      setFlashRow(rpu);
      setTimeout(() => setFlashRow(null), 400);
    },
    []
  );

  const filteredAndSorted = useMemo(() => {
    let data = [...compactRows];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.rpu.toLowerCase().includes(q) ||
          r.nombre.toLowerCase().includes(q) ||
          r.division.toLowerCase().includes(q) ||
          r.tarifa.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          r.consumo.toLowerCase().includes(q)
      );
    }
    if (sortCol) {
      data.sort((a, b) => {
        const aVal = a[sortCol].toLowerCase();
        const bVal = b[sortCol].toLowerCase();
        const cmp = aVal.localeCompare(bVal);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return data;
  }, [search, sortCol, sortDir]);

  return {
    search,
    setSearch,
    selectedRow,
    flashRow,
    sortCol,
    sortDir,
    handleSort,
    handleRowClick,
    filteredAndSorted,
  };
}

/* ------------------------------------------------------------------ */
/*  Hook: log viewer state                                             */
/* ------------------------------------------------------------------ */

function useLogState() {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(["ALL"])
  );
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);
  const [logSearch, setLogSearch] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);

  const toggleFilter = useCallback((level: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (level === "ALL") {
        return new Set(["ALL"]);
      }
      next.delete("ALL");
      if (next.has(level)) {
        next.delete(level);
        if (next.size === 0) return new Set(["ALL"]);
      } else {
        next.add(level);
      }
      return next;
    });
  }, []);

  const toggleExpand = useCallback((idx: number) => {
    setExpandedEntry((prev) => (prev === idx ? null : idx));
  }, []);

  const filteredLogs = useMemo(() => {
    let data = compactLogs;
    if (!activeFilters.has("ALL")) {
      data = data.filter((l) => activeFilters.has(l.level));
    }
    if (logSearch.trim()) {
      const q = logSearch.toLowerCase();
      data = data.filter(
        (l) =>
          l.msg.toLowerCase().includes(q) ||
          l.level.toLowerCase().includes(q) ||
          l.ts.toLowerCase().includes(q)
      );
    }
    return data;
  }, [activeFilters, logSearch]);

  // Auto-scroll to bottom when filters change
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [filteredLogs]);

  return {
    activeFilters,
    toggleFilter,
    expandedEntry,
    toggleExpand,
    logSearch,
    setLogSearch,
    filteredLogs,
    bodyRef,
  };
}

/* ------------------------------------------------------------------ */
/*  Sort Arrow component                                               */
/* ------------------------------------------------------------------ */

function SortArrow({
  col,
  sortCol,
  sortDir,
  colorClass,
}: {
  col: ColKey;
  sortCol: ColKey | null;
  sortDir: SortDir;
  colorClass?: string;
}) {
  const isActive = sortCol === col;
  return (
    <span
      className={`inline-flex ml-1 transition-all duration-200 ${
        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
      } ${colorClass ?? ""}`}
    >
      {isActive && sortDir === "desc" ? (
        <ChevronDown className="w-3 h-3" />
      ) : (
        <ChevronUp className="w-3 h-3" />
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  DatosSection                                                       */
/* ------------------------------------------------------------------ */

export function DatosSection({ scrollTo }: { scrollTo?: string }) {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTo]);

  // Table states for each mode
  const tableLight = useTableState();
  const tableGrad = useTableState();
  const tableDark = useTableState();

  // Log states for each mode
  const logLight = useLogState();
  const logGrad = useLogState();
  const logDark = useLogState();

  return (
    <>
      {/* == Data Table ================================================= */}
      <Section
        id="tablas"
        title="Data Table"
        description="Tabla de datos completa con: barra de estadisticas superior (filtro rapido por estado), toolbar (busqueda + filtros + export), tabla con ordenamiento, badges de estado por fila, y paginacion. Patron usado en Apollo (Facturas), Atlas (Monitoreo) y CFE-Recibos (tabla de RPUs)."
      >
        <div>
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Tablas</h3>
          <p className="text-xs text-nxt-400 mb-4">Tabla de datos con ordenamiento por columnas, busqueda en tiempo real, seleccion de filas y paginacion.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* ===== Light ===== */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">
              Light
            </h4>
            <div className="nxt-card p-5 h-full overflow-hidden">
              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {stats.slice(0, 3).map((s) => (
                  <ColorEditable key={s.label} elementKey={`datos.stat-${s.label.toLowerCase()}`} defaultBg={resolveDefaultBg(s.color)} showProperties={["bg"]}>
                    {(styles, _openPicker, _currentHex) => (
                      <div
                        className={`nxt-card p-2.5 border-l-4 ${s.color}`}
                        style={styles.backgroundColor ? { borderLeftColor: styles.backgroundColor } : undefined}
                      >
                        <p className="text-xs text-nxt-500 uppercase tracking-wide">
                          {s.label}
                        </p>
                        <p className="text-sm font-bold text-nxt-900">{s.value}</p>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-nxt-400" />
                  <input
                    type="text"
                    value={tableLight.search}
                    onChange={(e) => tableLight.setSearch(e.target.value)}
                    className="w-full bg-nxt-50 border border-nxt-200 rounded-nxt-lg pl-8 pr-3 py-1.5 text-xs text-nxt-800 placeholder-nxt-400 focus:outline-none focus:ring-1 focus:ring-forest transition-all duration-200"
                    placeholder="Buscar sitio..."
                  />
                </div>
                <button className="px-2.5 py-1.5 text-xs rounded-nxt-lg border border-nxt-200 text-nxt-600 hover:bg-nxt-50 transition-all duration-200 cursor-pointer active:scale-95">
                  Filtros
                </button>
                <button className="px-2.5 py-1.5 text-xs rounded-nxt-lg border border-nxt-200 text-nxt-600 hover:bg-nxt-50 transition-all duration-200 cursor-pointer active:scale-95">
                  Export
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-nxt-lg border border-nxt-200">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-nxt-200 bg-nxt-50">
                      {colKeys.map((col) => (
                        <th
                          key={col}
                          onClick={() => tableLight.handleSort(col)}
                          className="px-3 py-2 font-semibold text-nxt-600 text-[10px] uppercase tracking-wide cursor-pointer select-none group transition-all duration-200 hover:bg-nxt-100"
                        >
                          <span className="inline-flex items-center">
                            {colLabels[col]}
                            <SortArrow
                              col={col}
                              sortCol={tableLight.sortCol}
                              sortDir={tableLight.sortDir}
                            />
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableLight.filteredAndSorted.map((r) => (
                      <tr
                        key={r.rpu}
                        onClick={() => tableLight.handleRowClick(r.rpu)}
                        className={`border-b border-nxt-100 cursor-pointer transition-colors duration-150 ${
                          tableLight.selectedRow === r.rpu
                            ? "bg-forest/10 border-l-2 border-l-forest"
                            : "hover:bg-nxt-50/60"
                        } ${
                          tableLight.flashRow === r.rpu
                            ? "animate-[flashHighlight_0.4s_ease-out]"
                            : ""
                        }`}
                      >
                        <td className="px-3 py-2 text-nxt-500 font-mono">
                          {r.rpu}
                        </td>
                        <td className="px-3 py-2 font-medium text-nxt-900">
                          {r.nombre}
                        </td>
                        <td className="px-3 py-2 text-nxt-600">
                          {r.division}
                        </td>
                        <td className="px-3 py-2 text-nxt-600">{r.tarifa}</td>
                        <td className="px-3 py-2">
                          <ColorEditable elementKey={`datos.status-l-${r.rpu}`} defaultBg={resolveDefaultBg(statusStyles[r.status] ?? "")} showProperties={["bg"]}>
                            {(styles, _openPicker, _currentHex) => (
                              <span
                                className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer ${
                                  statusStyles[r.status] ?? ""
                                }`}
                                style={styles}
                              >
                                {r.status}
                              </span>
                            )}
                          </ColorEditable>
                        </td>
                        <td className="px-3 py-2 text-nxt-600">{r.consumo}</td>
                      </tr>
                    ))}
                    {tableLight.filteredAndSorted.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-6 text-center text-nxt-400 text-xs"
                        >
                          Sin resultados para "{tableLight.search}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-3 px-1">
                <p className="text-xs text-nxt-500">
                  1-{tableLight.filteredAndSorted.length} de 156
                </p>
                <div className="flex items-center gap-1">
                  <button className="px-2.5 py-1 text-xs rounded border border-nxt-200 text-nxt-400 hover:bg-nxt-50 transition-all duration-200 cursor-pointer active:scale-95">
                    Ant
                  </button>
                  <button className="px-2.5 py-1 text-xs rounded bg-forest text-white font-medium cursor-pointer active:scale-95">
                    1
                  </button>
                  <button className="px-2.5 py-1 text-xs rounded border border-nxt-200 text-nxt-600 hover:bg-nxt-50 transition-all duration-200 cursor-pointer active:scale-95">
                    Sig
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Gradiente ===== */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">
              Gradiente
            </h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full overflow-hidden">
              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {stats.slice(0, 3).map((s) => (
                  <ColorEditable key={s.label} elementKey={`datos.stat-g-${s.label.toLowerCase()}`} defaultBg={resolveDefaultBg(s.color)} showProperties={["bg"]}>
                    {(styles, openPicker, _currentHex) => (
                      <div
                        onClick={openPicker}
                        className={`bg-white/10 backdrop-blur-sm rounded-nxt-lg p-2.5 border-l-4 ${s.color} cursor-pointer`}
                        style={styles.backgroundColor ? { borderLeftColor: styles.backgroundColor } : undefined}
                      >
                        <p className="text-xs text-gray-300 uppercase tracking-wide">
                          {s.label}
                        </p>
                        <p className="text-sm font-bold text-white">{s.value}</p>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={tableGrad.search}
                    onChange={(e) => tableGrad.setSearch(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-nxt-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-forest transition-all duration-200"
                    placeholder="Buscar sitio..."
                  />
                </div>
                <button className="px-2.5 py-1.5 text-xs rounded-nxt-lg border border-white/20 text-gray-300 hover:bg-white/10 transition-all duration-200 cursor-pointer active:scale-95">
                  Filtros
                </button>
                <button className="px-2.5 py-1.5 text-xs rounded-nxt-lg border border-white/20 text-gray-300 hover:bg-white/10 transition-all duration-200 cursor-pointer active:scale-95">
                  Export
                </button>
              </div>

              {/* Table */}
              <div className="bg-white/10 backdrop-blur-sm rounded-nxt-lg overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-white/20 bg-white/5">
                      {colKeys.map((col) => (
                        <th
                          key={col}
                          onClick={() => tableGrad.handleSort(col)}
                          className="px-3 py-2 font-semibold text-gray-300 text-[10px] uppercase tracking-wide cursor-pointer select-none group transition-all duration-200 hover:bg-white/10"
                        >
                          <span className="inline-flex items-center">
                            {colLabels[col]}
                            <SortArrow
                              col={col}
                              sortCol={tableGrad.sortCol}
                              sortDir={tableGrad.sortDir}
                              colorClass="text-gray-300"
                            />
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableGrad.filteredAndSorted.map((r) => (
                      <tr
                        key={r.rpu}
                        onClick={() => tableGrad.handleRowClick(r.rpu)}
                        className={`border-b border-white/10 cursor-pointer transition-colors duration-150 ${
                          tableGrad.selectedRow === r.rpu
                            ? "bg-forest/20 border-l-2 border-l-forest"
                            : "hover:bg-white/5"
                        } ${
                          tableGrad.flashRow === r.rpu
                            ? "animate-[flashHighlight_0.4s_ease-out]"
                            : ""
                        }`}
                      >
                        <td className="px-3 py-2 text-gray-400 font-mono">
                          {r.rpu}
                        </td>
                        <td className="px-3 py-2 font-medium text-white">
                          {r.nombre}
                        </td>
                        <td className="px-3 py-2 text-gray-300">
                          {r.division}
                        </td>
                        <td className="px-3 py-2 text-gray-300">{r.tarifa}</td>
                        <td className="px-3 py-2">
                          <ColorEditable elementKey={`datos.status-g-${r.rpu}`} defaultBg={resolveDefaultBg(statusStyles[r.status] ?? "")} showProperties={["bg"]}>
                            {(styles, _openPicker, _currentHex) => (
                              <span
                                className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer ${
                                  statusStyles[r.status] ?? ""
                                }`}
                                style={styles}
                              >
                                {r.status}
                              </span>
                            )}
                          </ColorEditable>
                        </td>
                        <td className="px-3 py-2 text-gray-300">
                          {r.consumo}
                        </td>
                      </tr>
                    ))}
                    {tableGrad.filteredAndSorted.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-6 text-center text-gray-400 text-xs"
                        >
                          Sin resultados para "{tableGrad.search}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-3 px-1">
                <p className="text-xs text-gray-400">
                  1-{tableGrad.filteredAndSorted.length} de 156
                </p>
                <div className="flex items-center gap-1">
                  <button className="px-2.5 py-1 text-xs rounded border border-white/20 text-gray-400 hover:bg-white/10 transition-all duration-200 cursor-pointer active:scale-95">
                    Ant
                  </button>
                  <button className="px-2.5 py-1 text-xs rounded bg-forest text-white font-medium cursor-pointer active:scale-95">
                    1
                  </button>
                  <button className="px-2.5 py-1 text-xs rounded border border-white/20 text-gray-300 hover:bg-white/10 transition-all duration-200 cursor-pointer active:scale-95">
                    Sig
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== Dark ===== */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">
              Dark
            </h4>
            <div className="bg-forest rounded-nxt-xl p-5 h-full overflow-hidden">
              {/* Stats bar */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {stats.slice(0, 3).map((s) => (
                  <ColorEditable key={s.label} elementKey={`datos.stat-d-${s.label.toLowerCase()}`} defaultBg={resolveDefaultBg(s.color)} showProperties={["bg"]}>
                    {(styles, openPicker, _currentHex) => (
                      <div
                        onClick={openPicker}
                        className={`bg-bark rounded-nxt-lg p-2.5 border-l-4 ${s.color} cursor-pointer`}
                        style={styles.backgroundColor ? { borderLeftColor: styles.backgroundColor } : undefined}
                      >
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {s.label}
                        </p>
                        <p className="text-sm font-bold text-white">{s.value}</p>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                  <input
                    type="text"
                    value={tableDark.search}
                    onChange={(e) => tableDark.setSearch(e.target.value)}
                    className="w-full bg-forest border border-evergreen rounded-nxt-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-forest transition-all duration-200"
                    placeholder="Buscar sitio..."
                  />
                </div>
                <button className="px-2.5 py-1.5 text-xs rounded-nxt-lg border border-evergreen text-gray-400 hover:bg-evergreen transition-all duration-200 cursor-pointer active:scale-95">
                  Filtros
                </button>
                <button className="px-2.5 py-1.5 text-xs rounded-nxt-lg border border-evergreen text-gray-400 hover:bg-evergreen transition-all duration-200 cursor-pointer active:scale-95">
                  Export
                </button>
              </div>

              {/* Table */}
              <div className="bg-bark rounded-nxt-lg overflow-x-auto border border-evergreen">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-evergreen bg-bark">
                      {colKeys.map((col) => (
                        <th
                          key={col}
                          onClick={() => tableDark.handleSort(col)}
                          className="px-3 py-2 font-semibold text-gray-400 text-[10px] uppercase tracking-wide cursor-pointer select-none group transition-all duration-200 hover:bg-evergreen"
                        >
                          <span className="inline-flex items-center">
                            {colLabels[col]}
                            <SortArrow
                              col={col}
                              sortCol={tableDark.sortCol}
                              sortDir={tableDark.sortDir}
                              colorClass="text-gray-400"
                            />
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableDark.filteredAndSorted.map((r) => (
                      <tr
                        key={r.rpu}
                        onClick={() => tableDark.handleRowClick(r.rpu)}
                        className={`border-b border-evergreen cursor-pointer transition-colors duration-150 ${
                          tableDark.selectedRow === r.rpu
                            ? "bg-forest/20 border-l-2 border-l-forest"
                            : "hover:bg-[#333333]"
                        } ${
                          tableDark.flashRow === r.rpu
                            ? "animate-[flashHighlight_0.4s_ease-out]"
                            : ""
                        }`}
                      >
                        <td className="px-3 py-2 text-gray-500 font-mono">
                          {r.rpu}
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-300">
                          {r.nombre}
                        </td>
                        <td className="px-3 py-2 text-gray-300">
                          {r.division}
                        </td>
                        <td className="px-3 py-2 text-gray-300">{r.tarifa}</td>
                        <td className="px-3 py-2">
                          <ColorEditable elementKey={`datos.status-d-${r.rpu}`} defaultBg={resolveDefaultBg(statusStyles[r.status] ?? "")} showProperties={["bg"]}>
                            {(styles, _openPicker, _currentHex) => (
                              <span
                                className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer ${
                                  statusStyles[r.status] ?? ""
                                }`}
                                style={styles}
                              >
                                {r.status}
                              </span>
                            )}
                          </ColorEditable>
                        </td>
                        <td className="px-3 py-2 text-gray-300">
                          {r.consumo}
                        </td>
                      </tr>
                    ))}
                    {tableDark.filteredAndSorted.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-6 text-center text-gray-500 text-xs"
                        >
                          Sin resultados para "{tableDark.search}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-3 px-1">
                <p className="text-xs text-gray-500">
                  1-{tableDark.filteredAndSorted.length} de 156
                </p>
                <div className="flex items-center gap-1">
                  <button className="px-2.5 py-1 text-xs rounded border border-evergreen text-gray-500 hover:bg-evergreen transition-all duration-200 cursor-pointer active:scale-95">
                    Ant
                  </button>
                  <button className="px-2.5 py-1 text-xs rounded bg-forest text-white font-medium cursor-pointer active:scale-95">
                    1
                  </button>
                  <button className="px-2.5 py-1 text-xs rounded border border-evergreen text-gray-300 hover:bg-evergreen transition-all duration-200 cursor-pointer active:scale-95">
                    Sig
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* == Log Viewer ================================================= */}
      <Section
        id="log-viewer"
        title="Log Viewer"
        description="Visor de logs en tiempo real con tema oscuro. Filtros por nivel (ALL, INFO, WARN, ERROR). Fuente monospace con timestamp, nivel coloreado y mensaje. Usado en Apollo (logs de sincronizacion) y Atlas (monitoreo de servicios)."
      >
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Log Viewer</h3>
          <p className="text-xs text-nxt-400 mb-4">Visor de logs tipo terminal con filtros por nivel, busqueda con highlight y entradas expandibles.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* ===== Light ===== */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">
              Light
            </h4>
            <div className="nxt-card p-5 h-full overflow-hidden">
              {/* Header */}
              <div className="bg-nxt-100 rounded-t-nxt-lg px-3 py-2.5 flex flex-col gap-2 mb-0">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-nxt-400" />
                    <input
                      type="text"
                      value={logLight.logSearch}
                      onChange={(e) => logLight.setLogSearch(e.target.value)}
                      className="w-full bg-white border border-nxt-200 rounded-nxt-lg pl-8 pr-3 py-1.5 text-xs text-nxt-800 placeholder-nxt-400 focus:outline-none focus:ring-1 focus:ring-forest transition-all duration-200"
                      placeholder="Buscar en logs..."
                    />
                  </div>
                  <div className="flex gap-1">
                    {["ALL", "INFO", "WARN", "ERROR"].map((level) => (
                      <ColorEditable key={level} elementKey={`datos.logbtn-l-${level.toLowerCase()}`} defaultBg={resolveDefaultBg("bg-forest")} showProperties={["bg"]}>
                        {(styles, _openPicker, _currentHex) => (
                          <button
                            onClick={() => logLight.toggleFilter(level)}
                            className={`px-2 py-1 text-xs font-medium rounded cursor-pointer transition-all duration-200 active:scale-95 ${
                              logLight.activeFilters.has(level)
                                ? "bg-forest text-white shadow-sm"
                                : "bg-white text-nxt-500 hover:text-nxt-700 border border-nxt-200 hover:border-nxt-300"
                            }`}
                            style={logLight.activeFilters.has(level) ? styles : undefined}
                          >
                            {level}
                          </button>
                        )}
                      </ColorEditable>
                    ))}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div
                ref={logLight.bodyRef}
                className="bg-nxt-50 rounded-b-nxt-lg p-3 font-mono text-xs leading-relaxed space-y-0.5 max-h-[280px] overflow-y-auto"
              >
                {logLight.filteredLogs.map((log) => {
                  const globalIdx = compactLogs.indexOf(log);
                  const isExpanded = logLight.expandedEntry === globalIdx;
                  return (
                    <div
                      key={globalIdx}
                      className="transition-all duration-200 animate-[fadeSlideIn_0.25s_ease-out]"
                    >
                      <div
                        onClick={() => logLight.toggleExpand(globalIdx)}
                        className={`flex gap-2 cursor-pointer rounded px-1 py-0.5 transition-all duration-200 hover:bg-nxt-100 ${
                          isExpanded ? "bg-nxt-100" : ""
                        }`}
                      >
                        <span className="text-nxt-400 shrink-0">
                          {log.ts.slice(11)}
                        </span>
                        <ColorEditable elementKey={`datos.loglevel-l-${globalIdx}`} defaultBg={resolveDefaultBg(levelColorLight[log.level] ?? "text-nxt-500")} showProperties={["bg"]}>
                          {(styles, _openPicker, _currentHex) => (
                            <span
                              className={`shrink-0 font-bold w-12 text-right cursor-pointer ${
                                levelColorLight[log.level] ?? "text-nxt-500"
                              }`}
                              style={styles.backgroundColor ? { color: styles.backgroundColor } : undefined}
                            >
                              {log.level}
                            </span>
                          )}
                        </ColorEditable>
                        <span className="text-nxt-700">
                          <HighlightText text={log.msg} query={logLight.logSearch} />
                        </span>
                      </div>
                      {/* Expanded details */}
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isExpanded
                            ? "max-h-40 opacity-100 mt-1 mb-1"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="ml-[4.5rem] pl-3 border-l-2 border-nxt-200 space-y-0.5 text-[10px]">
                          {log.requestId && (
                            <p className="text-nxt-500">
                              <span className="text-nxt-400">Request ID:</span>{" "}
                              {log.requestId}
                            </p>
                          )}
                          {log.source && (
                            <p className="text-nxt-500">
                              <span className="text-nxt-400">Source:</span>{" "}
                              {log.source}
                            </p>
                          )}
                          {log.stack && (
                            <pre className="text-red-500/80 whitespace-pre-wrap mt-1">
                              {log.stack}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {logLight.filteredLogs.length === 0 && (
                  <p className="text-nxt-400 text-center py-4">
                    Sin logs que coincidan
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ===== Gradiente ===== */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">
              Gradiente
            </h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full overflow-hidden">
              {/* Header */}
              <div className="bg-white/10 backdrop-blur-sm rounded-t-nxt-lg px-3 py-2.5 flex flex-col gap-2 mb-0">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={logGrad.logSearch}
                      onChange={(e) => logGrad.setLogSearch(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-nxt-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-forest transition-all duration-200"
                      placeholder="Buscar en logs..."
                    />
                  </div>
                  <div className="flex gap-1">
                    {["ALL", "INFO", "WARN", "ERROR"].map((level) => (
                      <ColorEditable key={level} elementKey={`datos.logbtn-g-${level.toLowerCase()}`} defaultBg={resolveDefaultBg("bg-forest")} showProperties={["bg"]}>
                        {(styles, _openPicker, _currentHex) => (
                          <button
                            onClick={() => logGrad.toggleFilter(level)}
                            className={`px-2 py-1 text-xs font-medium rounded cursor-pointer transition-all duration-200 active:scale-95 ${
                              logGrad.activeFilters.has(level)
                                ? "bg-forest text-white shadow-sm"
                                : "bg-transparent text-gray-300 hover:text-white border border-white/20 hover:border-white/40"
                            }`}
                            style={logGrad.activeFilters.has(level) ? styles : undefined}
                          >
                            {level}
                          </button>
                        )}
                      </ColorEditable>
                    ))}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div
                ref={logGrad.bodyRef}
                className="bg-black/30 backdrop-blur-sm rounded-b-nxt-lg p-3 font-mono text-xs leading-relaxed space-y-0.5 max-h-[280px] overflow-y-auto"
              >
                {logGrad.filteredLogs.map((log) => {
                  const globalIdx = compactLogs.indexOf(log);
                  const isExpanded = logGrad.expandedEntry === globalIdx;
                  return (
                    <div
                      key={globalIdx}
                      className="transition-all duration-200 animate-[fadeSlideIn_0.25s_ease-out]"
                    >
                      <div
                        onClick={() => logGrad.toggleExpand(globalIdx)}
                        className={`flex gap-2 cursor-pointer rounded px-1 py-0.5 transition-all duration-200 hover:bg-white/10 ${
                          isExpanded ? "bg-white/10" : ""
                        }`}
                      >
                        <span className="text-gray-400 shrink-0">
                          {log.ts.slice(11)}
                        </span>
                        <ColorEditable elementKey={`datos.loglevel-g-${globalIdx}`} defaultBg={resolveDefaultBg(levelColor[log.level] ?? "text-gray-400")} showProperties={["bg"]}>
                          {(styles, _openPicker, _currentHex) => (
                            <span
                              className={`shrink-0 font-bold w-12 text-right cursor-pointer ${
                                levelColor[log.level] ?? "text-gray-400"
                              }`}
                              style={styles.backgroundColor ? { color: styles.backgroundColor } : undefined}
                            >
                              {log.level}
                            </span>
                          )}
                        </ColorEditable>
                        <span className="text-gray-200">
                          <HighlightText
                            text={log.msg}
                            query={logGrad.logSearch}
                            highlightClass="bg-yellow-400/30 text-inherit rounded-sm px-0.5"
                          />
                        </span>
                      </div>
                      {/* Expanded details */}
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isExpanded
                            ? "max-h-40 opacity-100 mt-1 mb-1"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="ml-[4.5rem] pl-3 border-l-2 border-white/20 space-y-0.5 text-[10px]">
                          {log.requestId && (
                            <p className="text-gray-300">
                              <span className="text-gray-400">
                                Request ID:
                              </span>{" "}
                              {log.requestId}
                            </p>
                          )}
                          {log.source && (
                            <p className="text-gray-300">
                              <span className="text-gray-400">Source:</span>{" "}
                              {log.source}
                            </p>
                          )}
                          {log.stack && (
                            <pre className="text-red-300/80 whitespace-pre-wrap mt-1">
                              {log.stack}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {logGrad.filteredLogs.length === 0 && (
                  <p className="text-gray-400 text-center py-4">
                    Sin logs que coincidan
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ===== Dark ===== */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">
              Dark
            </h4>
            <div className="bg-forest rounded-nxt-xl p-5 h-full overflow-hidden">
              {/* Header */}
              <div className="bg-bark rounded-t-nxt-lg px-3 py-2.5 flex flex-col gap-2 mb-0 border border-evergreen border-b-0">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                    <input
                      type="text"
                      value={logDark.logSearch}
                      onChange={(e) => logDark.setLogSearch(e.target.value)}
                      className="w-full bg-forest border border-evergreen rounded-nxt-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-forest transition-all duration-200"
                      placeholder="Buscar en logs..."
                    />
                  </div>
                  <div className="flex gap-1">
                    {["ALL", "INFO", "WARN", "ERROR"].map((level) => (
                      <ColorEditable key={level} elementKey={`datos.logbtn-d-${level.toLowerCase()}`} defaultBg={resolveDefaultBg("bg-forest")} showProperties={["bg"]}>
                        {(styles, _openPicker, _currentHex) => (
                          <button
                            onClick={() => logDark.toggleFilter(level)}
                            className={`px-2 py-1 text-xs font-medium rounded cursor-pointer transition-all duration-200 active:scale-95 ${
                              logDark.activeFilters.has(level)
                                ? "bg-forest text-white shadow-sm"
                                : "bg-forest text-gray-400 hover:text-gray-200 border border-evergreen hover:border-gray-500"
                            }`}
                            style={logDark.activeFilters.has(level) ? styles : undefined}
                          >
                            {level}
                          </button>
                        )}
                      </ColorEditable>
                    ))}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div
                ref={logDark.bodyRef}
                className="bg-[#111111] rounded-b-nxt-lg p-3 font-mono text-xs leading-relaxed space-y-0.5 max-h-[280px] overflow-y-auto border border-evergreen border-t-0"
              >
                {logDark.filteredLogs.map((log) => {
                  const globalIdx = compactLogs.indexOf(log);
                  const isExpanded = logDark.expandedEntry === globalIdx;
                  return (
                    <div
                      key={globalIdx}
                      className="transition-all duration-200 animate-[fadeSlideIn_0.25s_ease-out]"
                    >
                      <div
                        onClick={() => logDark.toggleExpand(globalIdx)}
                        className={`flex gap-2 cursor-pointer rounded px-1 py-0.5 transition-all duration-200 hover:bg-bark ${
                          isExpanded ? "bg-bark" : ""
                        }`}
                      >
                        <span className="text-gray-500 shrink-0">
                          {log.ts.slice(11)}
                        </span>
                        <ColorEditable elementKey={`datos.loglevel-d-${globalIdx}`} defaultBg={resolveDefaultBg(levelColor[log.level] ?? "text-gray-400")} showProperties={["bg"]}>
                          {(styles, _openPicker, _currentHex) => (
                            <span
                              className={`shrink-0 font-bold w-12 text-right cursor-pointer ${
                                levelColor[log.level] ?? "text-gray-400"
                              }`}
                              style={styles.backgroundColor ? { color: styles.backgroundColor } : undefined}
                            >
                              {log.level}
                            </span>
                          )}
                        </ColorEditable>
                        <span className="text-gray-300">
                          <HighlightText
                            text={log.msg}
                            query={logDark.logSearch}
                            highlightClass="bg-yellow-400/30 text-inherit rounded-sm px-0.5"
                          />
                        </span>
                      </div>
                      {/* Expanded details */}
                      <div
                        className={`overflow-hidden transition-all duration-200 ${
                          isExpanded
                            ? "max-h-40 opacity-100 mt-1 mb-1"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="ml-[4.5rem] pl-3 border-l-2 border-evergreen space-y-0.5 text-[10px]">
                          {log.requestId && (
                            <p className="text-gray-400">
                              <span className="text-gray-500">
                                Request ID:
                              </span>{" "}
                              {log.requestId}
                            </p>
                          )}
                          {log.source && (
                            <p className="text-gray-400">
                              <span className="text-gray-500">Source:</span>{" "}
                              {log.source}
                            </p>
                          )}
                          {log.stack && (
                            <pre className="text-red-400/80 whitespace-pre-wrap mt-1">
                              {log.stack}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {logDark.filteredLogs.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Sin logs que coincidan
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Keyframe styles injected via a style tag */}
      <style>{`
        @keyframes flashHighlight {
          0% { background-color: rgba(var(--color-primary), 0.3); }
          100% { background-color: transparent; }
        }
        @keyframes fadeSlideIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
