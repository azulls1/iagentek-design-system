import { useState } from "react";
import {
  Activity, AlertTriangle, CheckCircle, XCircle, Bell,
  Clock, TrendingUp, TrendingDown, RefreshCw, Filter,
  ChevronDown, Eye, Zap, Thermometer, Cpu, HardDrive,
  Wifi, ArrowRight, BarChart3
} from "lucide-react";

const alerts = [
  { id: 1, severity: "critical", service: "n8n Workflows", message: "Latencia superior a 800ms por mas de 5 minutos", time: "hace 2 min", acknowledged: false },
  { id: 2, severity: "warning", service: "Python API", message: "Uso de CPU al 67% — umbral de alerta: 70%", time: "hace 8 min", acknowledged: false },
  { id: 3, severity: "info", service: "Flower (Celery)", message: "Servicio detenido manualmente por admin", time: "hace 12 min", acknowledged: true },
  { id: 4, severity: "critical", service: "Flower (Celery)", message: "Worker offline — sin respuesta a health check", time: "hace 12 min", acknowledged: true },
  { id: 5, severity: "warning", service: "MinIO Storage", message: "Disco al 78% de capacidad", time: "hace 25 min", acknowledged: false },
  { id: 6, severity: "info", service: "Redis Cache", message: "Flush de cache completado exitosamente", time: "hace 1 hora", acknowledged: true },
];

const metrics = [
  { label: "Requests/min", value: "1,247", trend: "+8%", up: true, icon: Zap },
  { label: "Latencia Prom.", value: "134ms", trend: "-12ms", up: false, icon: Clock },
  { label: "Error Rate", value: "0.3%", trend: "+0.1%", up: true, icon: AlertTriangle },
  { label: "Uptime Global", value: "99.87%", trend: "+0.02%", up: true, icon: CheckCircle },
];

const logEntries = [
  { time: "14:32:15", level: "error", service: "n8n", message: "Timeout en workflow 'sync-apollo-data' despues de 30s" },
  { time: "14:32:10", level: "warn", service: "api", message: "Rate limit alcanzado para IP 10.0.1.45 — 429 enviado" },
  { time: "14:32:08", level: "info", service: "redis", message: "Key expirada: session:usr_2451 (TTL=3600s)" },
  { time: "14:32:05", level: "info", service: "nginx", message: "GET /api/v1/rpus 200 — 45ms — 10.0.1.22" },
  { time: "14:32:02", level: "error", service: "n8n", message: "Webhook fallido: POST /webhook/cfe-sync — connection refused" },
  { time: "14:31:58", level: "info", service: "api", message: "POST /api/v1/tasks — 201 Created — user: shernandez" },
  { time: "14:31:55", level: "warn", service: "minio", message: "Disco /data2 al 78.3% — threshold 80%" },
  { time: "14:31:50", level: "info", service: "supabase", message: "Query ejecutado en 12ms — SELECT * FROM rpus WHERE region='norte'" },
  { time: "14:31:45", level: "success", service: "api", message: "Health check OK — todos los servicios respondieron" },
  { time: "14:31:40", level: "info", service: "nginx", message: "GET /api/v1/health 200 — 3ms — 10.0.1.1" },
];

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, { bg: string; text: string; icon: typeof AlertTriangle }> = {
    critical: { bg: "bg-error-light", text: "text-error", icon: XCircle },
    warning: { bg: "bg-warning-light", text: "text-warning", icon: AlertTriangle },
    info: { bg: "bg-info-light", text: "text-info", icon: Eye },
  };
  const s = map[severity] || map.info;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-nxt-md font-medium ${s.bg} ${s.text}`}>
      <s.icon size={12} /> {severity === "critical" ? "Critico" : severity === "warning" ? "Alerta" : "Info"}
    </span>
  );
}

function LogLevel({ level }: { level: string }) {
  const colors: Record<string, string> = {
    error: "text-error",
    warn: "text-warning",
    info: "text-info",
    success: "text-success",
  };
  return <span className={`font-mono text-xs font-bold uppercase w-14 inline-block ${colors[level] || "text-nxt-500"}`}>{level}</span>;
}

export function MonitoreoView() {
  const [alertFilter, setAlertFilter] = useState("all");
  const [liveLog, setLiveLog] = useState(true);

  const filteredAlerts = alerts.filter((a) => {
    if (alertFilter === "all") return true;
    if (alertFilter === "active") return !a.acknowledged;
    return a.severity === alertFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-nxt-900">Monitoreo</h1>
          <p className="text-sm text-nxt-500">Metricas en tiempo real, alertas y logs del sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-success">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> En vivo
          </span>
          <button className="nxt-btn-ghost text-xs"><RefreshCw size={14} /> Actualizar</button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="nxt-card p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <m.icon size={16} className="text-nxt-400" />
              <span className={`text-xs font-medium ${
                m.label === "Error Rate" ? (m.up ? "text-error" : "text-success") :
                m.up ? "text-success" : "text-error"
              }`}>
                {m.up ? <TrendingUp size={12} className="inline" /> : <TrendingDown size={12} className="inline" />} {m.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-nxt-900">{m.value}</p>
            <p className="text-xs text-nxt-500">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Sparkline-style resource bars */}
      <div className="nxt-card p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-nxt-700 mb-4">Recursos del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "CPU Total", value: 42, icon: Cpu, color: "bg-info" },
            { label: "Memoria", value: 68, icon: HardDrive, color: "bg-warning" },
            { label: "Disco", value: 55, icon: HardDrive, color: "bg-primary" },
          ].map((r) => (
            <div key={r.label}>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="flex items-center gap-1.5 text-nxt-600"><r.icon size={14} /> {r.label}</span>
                <span className="font-mono font-semibold text-nxt-800">{r.value}%</span>
              </div>
              <div className="w-full h-3 bg-nxt-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-nxt-slow ${r.color}`}
                  style={{ width: `${r.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2-column: Alerts + Log Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Alerts */}
        <div className="nxt-card overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-nxt-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-nxt-600" />
              <h3 className="font-semibold text-nxt-900 text-sm">Alertas</h3>
              <span className="nxt-badge-error text-xs">{alerts.filter((a) => !a.acknowledged).length} activas</span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {["all", "active", "critical", "warning"].map((f) => (
                <button
                  key={f}
                  onClick={() => setAlertFilter(f)}
                  className={`px-2 py-1 text-xs rounded-nxt-md transition-colors ${
                    alertFilter === f ? "bg-nxt-200 text-nxt-800 font-medium" : "text-nxt-400 hover:text-nxt-600"
                  }`}
                >
                  {f === "all" ? "Todas" : f === "active" ? "Activas" : f === "critical" ? "Criticas" : "Alertas"}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-nxt-100 max-h-[400px] overflow-y-auto">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 hover:bg-nxt-50 cursor-pointer ${alert.acknowledged ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <SeverityBadge severity={alert.severity} />
                      <span className="text-xs font-medium text-nxt-700 truncate">{alert.service}</span>
                    </div>
                    <p className="text-sm text-nxt-600 break-words">{alert.message}</p>
                    <p className="text-xs text-nxt-400 mt-1">{alert.time}</p>
                  </div>
                  {!alert.acknowledged && (
                    <button className="text-xs text-info hover:underline flex-shrink-0 mt-1">Reconocer</button>
                  )}
                </div>
              </div>
            ))}
            {filteredAlerts.length === 0 && (
              <div className="p-8 text-center text-nxt-400 text-sm">Sin alertas en esta categoria</div>
            )}
          </div>
        </div>

        {/* Log Viewer */}
        <div className="nxt-card overflow-hidden">
          <div className="p-3 bg-nxt-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-primary" />
              <span className="text-sm font-semibold text-white">Log Viewer</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLiveLog(!liveLog)}
                className={`text-xs px-2 py-1 rounded-nxt-md ${
                  liveLog ? "bg-success/20 text-success" : "bg-nxt-700 text-nxt-400"
                }`}
              >
                {liveLog ? "LIVE" : "PAUSED"}
              </button>
            </div>
          </div>
          <div className="bg-nxt-900 max-h-[370px] overflow-y-auto font-mono text-[10px] sm:text-xs">
            {logEntries.map((entry, i) => (
              <div key={i} className="px-3 py-1.5 hover:bg-nxt-800 flex gap-3 border-b border-nxt-800/50">
                <span className="text-nxt-500 flex-shrink-0">{entry.time}</span>
                <LogLevel level={entry.level} />
                <span className="text-nxt-400 flex-shrink-0 w-16">[{entry.service}]</span>
                <span className="text-nxt-300 break-all">{entry.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Response time timeline */}
      <div className="nxt-card overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-nxt-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-semibold text-nxt-900 text-sm flex items-center gap-2">
            <BarChart3 size={16} className="text-nxt-400" /> Tiempo de Respuesta (ultimos 30 min)
          </h3>
          <div className="flex items-center gap-3 text-xs text-nxt-500 flex-wrap">
            <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-primary inline-block" /> API</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-info inline-block" /> DB</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-warning inline-block" /> n8n</span>
          </div>
        </div>
        <div className="p-3 sm:p-4">
          {/* Simple bar chart visualization */}
          <div className="flex items-end gap-1 h-32">
            {[35, 42, 38, 55, 48, 62, 45, 120, 85, 45, 38, 42, 50, 65, 48, 42, 38, 55, 250, 180, 95, 52, 45, 40, 38, 42, 45, 48, 42, 38].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5">
                <div
                  className={`w-full rounded-t transition-all ${
                    v > 150 ? "bg-error" : v > 80 ? "bg-warning" : "bg-primary"
                  }`}
                  style={{ height: `${Math.min((v / 250) * 100, 100)}%` }}
                  title={`${v}ms`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-nxt-400">
            <span>14:00</span>
            <span>14:10</span>
            <span>14:20</span>
            <span>14:30</span>
          </div>
        </div>
      </div>
    </div>
  );
}
