import { useState } from "react";
import {
  Server, CheckCircle, AlertTriangle, XCircle, Search,
  Filter, RefreshCw, MoreHorizontal, Activity, Clock,
  Wifi, WifiOff, ChevronDown, ArrowUpDown, Eye,
  Plus, Download, Globe, Database, Cpu, HardDrive
} from "lucide-react";

const services = [
  { id: "SVC-001", name: "Supabase (PostgreSQL)", type: "database", host: "db.nxtview.com", status: "healthy", latency: "12ms", uptime: "99.99%", cpu: "23%", memory: "1.2 GB", lastCheck: "hace 15s", region: "US-East" },
  { id: "SVC-002", name: "Python API (FastAPI)", type: "api", host: "api.nxtview.com", status: "healthy", latency: "45ms", uptime: "99.95%", cpu: "67%", memory: "2.8 GB", lastCheck: "hace 30s", region: "US-East" },
  { id: "SVC-003", name: "n8n Workflows", type: "automation", host: "n8n.nxtview.com", status: "degraded", latency: "890ms", uptime: "98.20%", cpu: "89%", memory: "3.4 GB", lastCheck: "hace 45s", region: "US-East" },
  { id: "SVC-004", name: "Redis Cache", type: "cache", host: "redis.nxtview.com", status: "healthy", latency: "3ms", uptime: "100%", cpu: "12%", memory: "512 MB", lastCheck: "hace 10s", region: "US-East" },
  { id: "SVC-005", name: "Icinga Monitoreo", type: "monitoring", host: "icinga.nxtview.com", status: "healthy", latency: "67ms", uptime: "99.80%", cpu: "34%", memory: "1.8 GB", lastCheck: "hace 20s", region: "US-East" },
  { id: "SVC-006", name: "Nginx Proxy", type: "proxy", host: "proxy.nxtview.com", status: "healthy", latency: "8ms", uptime: "99.99%", cpu: "15%", memory: "256 MB", lastCheck: "hace 5s", region: "US-East" },
  { id: "SVC-007", name: "Flower (Celery)", type: "worker", host: "flower.nxtview.com", status: "offline", latency: "—", uptime: "95.40%", cpu: "0%", memory: "0 MB", lastCheck: "hace 12 min", region: "US-East" },
  { id: "SVC-008", name: "MinIO Storage", type: "storage", host: "minio.nxtview.com", status: "healthy", latency: "22ms", uptime: "99.97%", cpu: "28%", memory: "4.1 GB", lastCheck: "hace 25s", region: "US-East" },
];

const typeIcons: Record<string, typeof Server> = {
  database: Database,
  api: Globe,
  automation: Activity,
  cache: HardDrive,
  monitoring: Eye,
  proxy: Globe,
  worker: Cpu,
  storage: HardDrive,
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    healthy: { bg: "bg-success-light", text: "text-success", label: "Saludable" },
    degraded: { bg: "bg-warning-light", text: "text-warning", label: "Degradado" },
    offline: { bg: "bg-error-light", text: "text-error", label: "Offline" },
  };
  const s = map[status] || map.healthy;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-nxt-md font-medium ${s.bg} ${s.text}`}>
      <span className={`w-2 h-2 rounded-full ${
        status === "healthy" ? "bg-success" : status === "degraded" ? "bg-warning" : "bg-error"
      } ${status !== "offline" ? "animate-pulse" : ""}`} />
      {s.label}
    </span>
  );
}

export function ServiciosView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const filtered = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.host.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "todos" || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    total: services.length,
    healthy: services.filter((s) => s.status === "healthy").length,
    degraded: services.filter((s) => s.status === "degraded").length,
    offline: services.filter((s) => s.status === "offline").length,
  };

  const selected = services.find((s) => s.id === selectedService);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-nxt-900">Servicios</h1>
          <p className="text-sm text-nxt-500">Administracion y monitoreo de infraestructura</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="nxt-btn-ghost text-xs"><RefreshCw size={14} /> Sincronizar</button>
          <button className="nxt-btn-primary text-xs"><Plus size={14} /> Agregar Servicio</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Servicios", value: counts.total, icon: Server, color: "text-primary", bg: "bg-primary/10" },
          { label: "Saludables", value: counts.healthy, icon: CheckCircle, color: "text-success", bg: "bg-success-light" },
          { label: "Degradados", value: counts.degraded, icon: AlertTriangle, color: "text-warning", bg: "bg-warning-light" },
          { label: "Offline", value: counts.offline, icon: XCircle, color: "text-error", bg: "bg-error-light" },
        ].map((m) => (
          <div key={m.label} className="nxt-card p-3 sm:p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-nxt-md ${m.bg} flex items-center justify-center`}>
              <m.icon size={18} className={m.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-nxt-900">{m.value}</p>
              <p className="text-xs text-nxt-500">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="nxt-card p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nxt-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o host..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="nxt-input pl-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-nxt-400" />
            {["todos", "healthy", "degraded", "offline"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1.5 text-xs rounded-nxt-md font-medium transition-colors ${
                  filterStatus === f
                    ? "bg-primary/10 text-nxt-800 border border-primary"
                    : "text-nxt-500 hover:bg-nxt-100 border border-transparent"
                }`}
              >
                {f === "todos" ? "Todos" : f === "healthy" ? "Saludables" : f === "degraded" ? "Degradados" : "Offline"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Service list + detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Table */}
        <div className={`${selectedService ? "lg:col-span-2" : "lg:col-span-3"} nxt-card overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-nxt-50 border-b border-nxt-200">
                  <th className="text-left text-xs font-semibold text-nxt-600 px-4 py-3">Servicio</th>
                  <th className="text-left text-xs font-semibold text-nxt-600 px-4 py-3 hidden md:table-cell">Host</th>
                  <th className="text-center text-xs font-semibold text-nxt-600 px-4 py-3">Estado</th>
                  <th className="text-right text-xs font-semibold text-nxt-600 px-4 py-3">Latencia</th>
                  <th className="text-right text-xs font-semibold text-nxt-600 px-4 py-3 hidden lg:table-cell">Uptime</th>
                  <th className="text-center text-xs font-semibold text-nxt-600 px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nxt-100">
                {filtered.map((svc) => {
                  const Icon = typeIcons[svc.type] || Server;
                  return (
                    <tr
                      key={svc.id}
                      onClick={() => setSelectedService(svc.id === selectedService ? null : svc.id)}
                      className={`hover:bg-nxt-50 cursor-pointer transition-colors ${
                        selectedService === svc.id ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-nxt-md bg-nxt-100 flex items-center justify-center">
                            <Icon size={16} className="text-nxt-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-nxt-800 truncate">{svc.name}</p>
                            <p className="text-xs text-nxt-400 font-mono truncate">{svc.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-nxt-500 font-mono">{svc.host}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={svc.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-mono text-nxt-700">{svc.latency}</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className="text-sm text-nxt-600">{svc.uptime}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-nxt-400 hover:text-nxt-600">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-nxt-400">
              <WifiOff size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No se encontraron servicios</p>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="nxt-card p-0 overflow-hidden col-span-1">
            <div className="p-3 sm:p-4 bg-nxt-50 border-b border-nxt-200 flex items-center justify-between">
              <h3 className="font-semibold text-nxt-900 text-sm">Detalle</h3>
              <button onClick={() => setSelectedService(null)} className="text-nxt-400 hover:text-nxt-600">
                <XCircle size={16} />
              </button>
            </div>
            <div className="p-3 sm:p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-nxt-md bg-nxt-100 flex items-center justify-center">
                  {(() => { const Icon = typeIcons[selected.type] || Server; return <Icon size={20} className="text-nxt-600" />; })()}
                </div>
                <div>
                  <p className="font-semibold text-nxt-900">{selected.name}</p>
                  <p className="text-xs text-nxt-400 font-mono">{selected.host}</p>
                </div>
              </div>

              <StatusBadge status={selected.status} />

              <div className="space-y-3 pt-2">
                {[
                  { label: "Latencia", value: selected.latency },
                  { label: "Uptime", value: selected.uptime },
                  { label: "CPU", value: selected.cpu },
                  { label: "Memoria", value: selected.memory },
                  { label: "Region", value: selected.region },
                  { label: "Ultimo Check", value: selected.lastCheck },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-sm">
                    <span className="text-nxt-500">{item.label}</span>
                    <span className="font-medium text-nxt-800 font-mono">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Mini CPU bar */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-nxt-500">CPU</span>
                  <span className="font-mono text-nxt-700">{selected.cpu}</span>
                </div>
                <div className="w-full h-2 bg-nxt-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      parseInt(selected.cpu) > 80 ? "bg-error" : parseInt(selected.cpu) > 60 ? "bg-warning" : "bg-success"
                    }`}
                    style={{ width: selected.cpu }}
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button className="nxt-btn-secondary text-xs flex-1">Logs</button>
                <button className="nxt-btn-primary text-xs flex-1">Reiniciar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
