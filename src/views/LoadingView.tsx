import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { UserDropdown } from "../components/UserDropdown";

export function LoadingView() {
  const [variant, setVariant] = useState<"apollo" | "atlas" | "cfe">("apollo");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Selector de variante */}
      <div className="bg-nxt-800 text-white px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-4 text-sm z-50 sticky top-0 overflow-x-auto scrollbar-hide">
        <span className="text-nxt-400 text-xs flex-shrink-0">Variante:</span>
        {(["apollo", "atlas", "cfe"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded-nxt-md text-[10px] sm:text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              variant === v ? "bg-forest text-white" : "text-nxt-300 hover:text-white"
            }`}
          >
            {v === "apollo" ? "Apollo" : v === "atlas" ? "Atlas" : "CFE"}
            <span className="hidden sm:inline">{v === "apollo" ? " (Full-screen)" : v === "atlas" ? " (Skeleton)" : " (Spinner)"}</span>
          </button>
        ))}
      </div>

      {variant === "apollo" && <LoaderApollo />}
      {variant === "atlas" && <LoaderAtlas />}
      {variant === "cfe" && <LoaderCFE />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// APOLLO: Full-screen overlay con sello + orbitas + dots
// Basado en ApolloLoader.js + ApolloLoader.css
// ═══════════════════════════════════════════════════════════════
function LoaderApollo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 1));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="flex-1 flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a1a1a 0%, #1A3036 40%, #333333 70%, #1A3036 100%)",
        minHeight: "calc(100vh - 36px)",
      }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Sello con orbitas — replica exacta del patron Apollo */}
        <div className="relative w-[180px] h-[180px] flex items-center justify-center" style={{ animation: "seal-fade-in 0.6s ease-out" }}>
          {/* Orbita 1 — exterior */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid rgba(255, 212, 20, 0.12)",
              borderTopColor: "rgba(255, 212, 20, 0.7)",
              animation: "orbit-spin 3s linear infinite",
            }}
          />
          {/* Orbita 2 — media */}
          <div
            className="absolute rounded-full"
            style={{
              inset: "15%",
              border: "2px solid rgba(255, 255, 255, 0.05)",
              borderTopColor: "rgba(255, 255, 255, 0.4)",
              animation: "orbit-spin 2.2s linear infinite reverse",
            }}
          />
          {/* Orbita 3 — interior */}
          <div
            className="absolute rounded-full"
            style={{
              inset: "30%",
              border: "2px solid rgba(255, 212, 20, 0.1)",
              borderTopColor: "rgba(255, 212, 20, 0.45)",
              animation: "orbit-spin 1.5s linear infinite",
            }}
          />
          {/* Sello central */}
          <img src="/images/logo_ia_withe.webp" alt="IAgentek" className="relative z-10 w-16 h-16 object-contain" style={{ animation: "seal-pulse 3s ease-in-out infinite" }} />
        </div>

        {/* Texto */}
        <div className="text-center">
          <p className="text-white/80 text-sm">Cargando plataforma...</p>
        </div>

        {/* Dots animados — patron Apollo */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-forest"
              style={{
                animation: "dot-bounce 1.4s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* by forest */}
        <div className="flex items-center gap-2 opacity-50">
          <span className="text-white text-xs">by</span>
          <span className="text-white text-sm font-semibold">forest</span>
        </div>

        {/* Progress bar opcional */}
        <div className="w-[200px] h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #48bb78 0%, #38a169 100%)",
            }}
          />
        </div>
      </div>

      {/* Isotipo decorativo */}
      <div className="absolute -bottom-8 -right-8 opacity-[0.08]">
        <img src="/images/logo_ia_withe.webp" alt="" className="w-[220px] h-[220px] object-contain opacity-100" />
      </div>

      <style>{`
        @keyframes orbit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes seal-fade-in { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes seal-pulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255, 200, 50, 0.2)); }
          50% { filter: drop-shadow(0 0 40px rgba(255, 200, 50, 0.4)); }
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ATLAS: Skeleton placeholders + LoadingState spinner
// Basado en skeleton.tsx + LoadingState.tsx
// ═══════════════════════════════════════════════════════════════
function LoaderAtlas() {
  return (
    <div className="flex-1 bg-nxt-50 min-h-screen">
      {/* Fake navbar */}
      <div className="bg-white border-b border-nxt-200/50 backdrop-blur-md sticky top-[36px] z-40">
        <div className="h-0.5 bg-forest" />
        <div className="flex items-center justify-between px-6 h-[56px]">
          <div className="h-4 w-20 bg-nxt-200 rounded animate-pulse" />
          <div className="flex gap-4">
            {[80, 60, 90, 50].map((w, i) => (
              <div key={i} className="h-3 bg-nxt-100 rounded animate-pulse" style={{ width: w }} />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-nxt-200 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Page header skeleton */}
        <div>
          <div className="h-6 w-40 bg-nxt-200 rounded animate-pulse mb-2" />
          <div className="h-3 w-64 bg-nxt-100 rounded animate-pulse" />
        </div>

        {/* Inline loading state — patron Atlas LoadingState.tsx */}
        <div className="flex items-center justify-center py-4">
          <svg className="h-5 w-5 animate-spin text-nxt-400 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span className="text-sm text-nxt-500">Cargando datos de monitoreo...</span>
        </div>

        {/* KPI skeleton — 6 cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-nxt-200 p-4 shadow-sm">
              <div className="w-8 h-8 rounded-md bg-nxt-200 animate-pulse mb-3" />
              <div className="h-5 w-12 bg-nxt-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-16 bg-nxt-100 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* 2-column skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Service health skeleton */}
          <div className="bg-white rounded-lg border border-nxt-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-nxt-200 flex justify-between">
              <div className="h-4 w-32 bg-nxt-200 rounded animate-pulse" />
              <div className="h-5 w-20 bg-nxt-100 rounded animate-pulse" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-nxt-100">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-nxt-200 animate-pulse" />
                  <div className="h-3 bg-nxt-200 rounded animate-pulse" style={{ width: 100 + i * 20 }} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-10 bg-nxt-100 rounded animate-pulse" />
                  <div className="h-5 w-14 bg-nxt-100 rounded-md animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Timeline skeleton */}
          <div className="bg-white rounded-lg border border-nxt-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-nxt-200">
              <div className="h-4 w-40 bg-nxt-200 rounded animate-pulse" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-nxt-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-nxt-200 animate-pulse" />
                  <div>
                    <div className="h-3 bg-nxt-200 rounded animate-pulse mb-1.5" style={{ width: 120 + i * 15 }} />
                    <div className="h-2 w-24 bg-nxt-100 rounded animate-pulse" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-5 w-16 bg-nxt-100 rounded-md animate-pulse mb-1" />
                  <div className="h-2 w-12 bg-nxt-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-lg border border-nxt-200 shadow-sm overflow-hidden">
          <div className="p-3 border-b border-nxt-200 flex gap-3">
            <div className="h-8 flex-1 max-w-sm bg-nxt-100 rounded-md animate-pulse" />
            <div className="h-8 w-20 bg-nxt-100 rounded-md animate-pulse" />
          </div>
          <div className="bg-nxt-50 border-b border-nxt-200 px-4 py-3 flex gap-6">
            {[30, 80, 120, 60, 60, 50].map((w, i) => (
              <div key={i} className="h-3 bg-nxt-200 rounded animate-pulse" style={{ width: w }} />
            ))}
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-4 py-3.5 border-b border-nxt-100 flex gap-6 items-center">
              <div className="w-4 h-4 bg-nxt-100 rounded animate-pulse" />
              <div className="h-3 w-20 bg-nxt-200 rounded animate-pulse" />
              <div className="h-3 flex-1 max-w-[180px] bg-nxt-100 rounded animate-pulse" />
              <div className="h-3 w-14 bg-nxt-100 rounded animate-pulse" />
              <div className="h-5 w-14 bg-nxt-100 rounded-md animate-pulse" />
              <div className="h-3 w-16 bg-nxt-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CFE-RECIBOS: Spinner inline dentro de alertas
// Basado en .spinner CSS + alert--info pattern
// ═══════════════════════════════════════════════════════════════
function LoaderCFE() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s >= 5 ? 0 : s + 1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { msg: "Consultando RPU en portal CFE...", status: "loading" },
    { msg: "Descargando XML desde portal CFE...", status: "loading" },
    { msg: "Procesando PDF y extrayendo datos...", status: "loading" },
    { msg: "Enviando solicitud al SAT...", status: "loading" },
    { msg: "Sincronizacion completada: 154/156 exitosas", status: "success" },
    { msg: "Error de conexion con servicio externo", status: "error" },
  ];

  return (
    <div className="flex-1 min-h-screen" style={{ backgroundColor: "var(--nxt-bg-darkest, #04202C)" }}>
      {/* Fake navbar oscuro tipo CFE */}
      <div className="bg-nxt-700 border-b border-nxt-600 h-14 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2">
          <img src="/images/logo_ia_withe.webp" alt="IAgentek" className="h-[18px] w-[18px] object-contain" />
          <span className="text-white font-bold text-sm">CFE Recibos</span>
        </div>
        <div className="flex gap-4">
          {["Dashboard", "Sitios", "Facturas", "Mapa"].map((t) => (
            <span key={t} className="text-nxt-300 text-sm hover:text-white cursor-pointer">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <UserDropdown size="sm" onLogout={() => window.location.reload()} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h2 className="text-xl font-bold text-white">Estados de Carga — Patron CFE-Recibos</h2>
        <p className="text-sm text-white/50">Spinner inline (16px) dentro de alertas tipo nxt-alert</p>

        {/* Spinner individual */}
        <div className="bg-white/[0.03] border border-white/10 rounded-nxt-lg p-6">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Spinner 16px (border-spin)</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <SpinnerCFE />
              <span className="text-sm text-white/60">Default</span>
            </div>
            <div className="flex items-center gap-2">
              <SpinnerCFE size={24} />
              <span className="text-sm text-white/60">24px</span>
            </div>
            <div className="flex items-center gap-2">
              <SpinnerCFE size={32} />
              <span className="text-sm text-white/60">32px</span>
            </div>
          </div>
        </div>

        {/* Secuencia de alertas con spinner */}
        <div className="bg-white/[0.03] border border-white/10 rounded-nxt-lg p-6">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Alertas con spinner (secuencia en vivo)</h3>
          <div className="space-y-3">
            {steps.map((s, i) => {
              const isActive = i === step;
              const isDone = i < step;
              const isPending = i > step;

              if (isPending) return null;

              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-nxt-md text-sm border-l-[3px] transition-all ${
                    s.status === "error" && isActive
                      ? "bg-error-light text-error border-l-error"
                      : isDone
                      ? "bg-success-light text-success border-l-success opacity-60"
                      : "bg-info-light text-info border-l-info"
                  }`}
                >
                  {isActive && s.status === "loading" && <SpinnerCFE />}
                  {isActive && s.status === "success" && <CheckCircle size={16} />}
                  {isActive && s.status === "error" && <span className="text-error font-bold">!</span>}
                  {isDone && <CheckCircle size={16} className="text-success" />}
                  <span>{s.msg}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botones con estado de carga */}
        <div className="bg-white/[0.03] border border-white/10 rounded-nxt-lg p-6">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Botones con estado de carga</h3>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-forest hover:bg-bark text-nxt-700 font-medium text-sm rounded-nxt-md">
              <SpinnerCFE /> Consultando...
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white/70 font-medium text-sm rounded-nxt-md border border-white/10">
              <SpinnerCFE /> Procesando PDF...
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white font-medium text-sm rounded-nxt-md opacity-50 cursor-not-allowed">
              Subiendo 5 archivos...
            </button>
          </div>
        </div>

        {/* Progress bar tipo bulk upload */}
        <div className="bg-white/[0.03] border border-white/10 rounded-nxt-lg p-6">
          <h3 className="text-sm font-semibold text-white/70 mb-4">Carga masiva (bulk upload)</h3>
          <BulkUploadDemo />
        </div>
      </div>

      <style>{`
        @keyframes cfe-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Spinner CFE (replica exacta: border-spin 0.8s) ──────────
function SpinnerCFE({ size = 16 }: { size?: number }) {
  return (
    <span
      className="inline-block rounded-full flex-shrink-0"
      style={{
        width: size,
        height: size,
        border: "3px solid var(--nxt-border-light, #DFE4E0)",
        borderTopColor: "var(--nxt-primary, #04202C)",
        animation: "cfe-spin 0.8s linear infinite",
        verticalAlign: "middle",
      }}
    />
  );
}

// ─── Bulk upload demo ─────────────────────────────────────────
function BulkUploadDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 3));
    }, 150);
    return () => clearInterval(timer);
  }, []);

  const results = [
    { name: "factura_enero_2026.pdf", status: "ok" },
    { name: "factura_febrero_2026.pdf", status: "ok" },
    { name: "factura_marzo_2026.pdf", status: "dup" },
    { name: "factura_abril_2026.xml", status: "ok" },
    { name: "factura_corrupta.pdf", status: "err" },
  ];

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/50">Subiendo 5 archivos...</span>
        <span className="text-white/50">{Math.min(progress, 100)}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-forest rounded-full transition-all duration-100"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Resultados */}
      <div className="space-y-1 mt-3">
        {results.map((r, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2 rounded-nxt-md bg-white/[0.03]">
            <span className="text-sm text-white/60 font-mono">{r.name}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
              r.status === "ok" ? "bg-success-light text-success" :
              r.status === "dup" ? "bg-warning-light text-warning" :
              "bg-error-light text-error"
            }`}>
              {r.status === "ok" ? "OK" : r.status === "dup" ? "Duplicado" : "Error"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
