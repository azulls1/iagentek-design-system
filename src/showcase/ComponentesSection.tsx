import { useEffect, useRef, useState } from "react";
import {
  Plus, Download, RefreshCw, Trash2, CheckCircle, AlertTriangle, XCircle, Info,
  Activity, Clock, CircleDot, Shield, Zap, MoreHorizontal, ArrowRight, Server,
  TrendingUp, TrendingDown, X, Loader2, Inbox, Eye, ChevronRight, Sparkles, MousePointer,
  Wifi, WifiOff, Battery, BatteryCharging, BatteryFull, Bell, BellRing, BellOff,
  Cloud, CloudOff, Database, HardDrive, Cpu, MemoryStick, Globe, Lock, Unlock,
  UserCheck, UserX, Mail, MailOpen, Package, Rocket, Bug, Wrench, Settings,
  Play, Pause, Square, SkipForward, Volume2, VolumeX, Heart, Star, Flame,
  FileCheck, FileWarning, FileX, Send, MessageSquare, PhoneCall, PhoneOff,
  Milestone, Timer, CalendarCheck, CalendarX, Tag, Bookmark, Archive
} from "lucide-react";
import { ColorEditable } from "../components/ColorEditable";
import { resolveDefaultBg, resolveDominantColor, resolveHoverColor } from "../utils/tailwindColorMap";

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
    <section id={id} className="mb-10 sm:mb-12 pt-8 border-t-2 border-nxt-200 first:border-t-0 first:pt-0">
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

/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Toast types                                                        */
/* ------------------------------------------------------------------ */

interface Toast {
  id: number;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  exiting?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function ComponentesSection({ scrollTo }: { scrollTo?: string }) {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTo]);

  /* ---- Toast state ---- */
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastId, setToastId] = useState(0);

  const addToast = (type: Toast["type"], title: string, message: string) => {
    const id = toastId + 1;
    setToastId(id);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
  };

  const toastIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success": return <CheckCircle className="w-5 h-5 text-success" />;
      case "error":   return <XCircle className="w-5 h-5 text-error" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "info":    return <Info className="w-5 h-5 text-info" />;
    }
  };

  const toastAccent = (type: Toast["type"]) => {
    switch (type) {
      case "success": return "bg-success";
      case "error":   return "bg-error";
      case "warning": return "bg-warning";
      case "info":    return "bg-info";
    }
  };

  /* ---- Tabs state ---- */
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["General", "Monitoreo", "Historial", "Configuracion"];

  /* ---- Buttons: selection state (toggle) ---- */
  const [selectedBtn, setSelectedBtn] = useState<string | null>(null);
  const handleBtnClick = (id: string) => {
    setSelectedBtn(prev => prev === id ? null : id);
  };

  /* ---- Badges: toggleable active set ---- */
  const [activeBadges, setActiveBadges] = useState<Set<string>>(new Set([
    "filled-success", "filled-warning", "filled-error", "filled-info", "filled-primary", "filled-neutral",
    "light-success", "light-warning", "light-error", "light-info", "light-neutral",
    "outline-success", "outline-warning", "outline-error", "outline-info", "outline-neutral",
    "icon-0", "icon-1", "icon-2", "icon-3", "icon-4", "icon-5", "icon-6", "icon-7",
    "pill-0", "pill-1", "pill-2", "pill-3", "pill-4", "pill-5", "pill-6", "pill-7",
  ]));
  const toggleBadge = (id: string) => {
    setActiveBadges((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* ---- Status cards: selected card ---- */
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  /* ---- Service health: expanded service ---- */
  const [expandedService, setExpandedService] = useState<string | null>(null);

  /* ---- Icon catalog: selected icon ---- */
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedCtx, setSelectedCtx] = useState<string | null>(null);

  /* ---- Progress bars: animated on mount ---- */
  const [progressAnimated, setProgressAnimated] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!progressRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setProgressAnimated(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(progressRef.current);
    return () => observer.disconnect();
  }, []);

  /* ---- Skeleton: simular carga toggle ---- */
  const [showSkeleton, setShowSkeleton] = useState(false);
  const handleSimularCarga = () => {
    setShowSkeleton(true);
    setTimeout(() => setShowSkeleton(false), 2000);
  };

  /* ---- Button group: active period ---- */
  const [activePeriod, setActivePeriod] = useState(0);

  return (
    <div className="space-y-2">
      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      {/* 1. BOTONES                                                    */}
      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      <Section id="botones" title="Botones" description="Solid, outline, ghost, link, icon-only, pill, con badge, grupos y estados. Hover con lift y glow de color.">
        {/* Solid */}
        <h3 className="text-sm font-semibold text-nxt-700 mb-1">Solid</h3>
        <p className="text-xs text-nxt-400 mb-4">Botones con fondo solido de color. Para acciones principales y secundarias.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "solid-l-primary", cls: "nxt-btn-primary", icon: Plus, label: "Primary" },
                  { id: "solid-l-secondary", cls: "nxt-btn-secondary", icon: Download, label: "Secondary" },
                  { id: "solid-l-danger", cls: "nxt-btn-danger", icon: Trash2, label: "Danger" },
                  { id: "solid-l-success", cls: "nxt-btn-success", icon: CheckCircle, label: "Success" },
                  { id: "solid-l-info", cls: "nxt-btn-info", icon: Info, label: "Info" },
                  { id: "solid-l-warning", cls: "nxt-btn-warning", icon: AlertTriangle, label: "Warning" },
                ].map((btn) => (
                  <ColorEditable key={btn.id} elementKey={`componentes.${btn.id}`} defaultBg={resolveDominantColor(btn.cls)} hasHover={true} defaultHoverBg={resolveHoverColor(btn.cls)}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button
                          className={`${btn.cls} cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2`}
                          style={styles}
                          onClick={openPicker}
                          {...hoverHandlers}
                        >
                          <btn.icon className="w-4 h-4" /> {btn.label}
                        </button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-2">
                {[
                  { id: "solid-g-primary", cls: "nxt-btn-primary", icon: Plus, label: "Primary" },
                  { id: "solid-g-secondary", cls: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-white/30 text-white border border-white/30 transition-all duration-nxt-fast hover:bg-white/40 shadow-lg", icon: Download, label: "Secondary" },
                  { id: "solid-g-ghost", cls: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-white/30 text-white transition-all duration-nxt-fast hover:bg-white/40", icon: RefreshCw, label: "Ghost" },
                  { id: "solid-g-danger", cls: "nxt-btn-danger", icon: Trash2, label: "Danger" },
                ].map((btn) => (
                  <ColorEditable key={btn.id} elementKey={`componentes.${btn.id}`} defaultBg={resolveDominantColor(btn.cls)} hasHover={true} defaultHoverBg={resolveHoverColor(btn.cls)}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button
                          className={`${btn.cls} cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2`}
                          style={styles}
                          onClick={openPicker}
                          {...hoverHandlers}
                        >
                          <btn.icon className="w-4 h-4" /> {btn.label}
                        </button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "solid-d-primary", cls: "nxt-btn-primary", icon: Plus, label: "Primary" },
                  { id: "solid-d-secondary", cls: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-bark text-gray-200 border border-pine transition-all duration-nxt-fast hover:bg-evergreen", icon: Download, label: "Secondary" },
                  { id: "solid-d-danger", cls: "nxt-btn-danger", icon: Trash2, label: "Danger" },
                  { id: "solid-d-success", cls: "nxt-btn-success", icon: CheckCircle, label: "Success" },
                  { id: "solid-d-info", cls: "nxt-btn-info", icon: Info, label: "Info" },
                ].map((btn) => (
                  <ColorEditable key={btn.id} elementKey={`componentes.${btn.id}`} defaultBg={resolveDominantColor(btn.cls)} hasHover={true} defaultHoverBg={resolveHoverColor(btn.cls)}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button
                          className={`${btn.cls} cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2`}
                          style={styles}
                          onClick={openPicker}
                          {...hoverHandlers}
                        >
                          <btn.icon className="w-4 h-4" /> {btn.label}
                        </button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Outline */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Outline</h3>
          <p className="text-xs text-nxt-400 mb-4">Solo borde, sin fondo. Para acciones de menor jerarquia.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "out-l-primary", cls: "nxt-btn-outline-primary", icon: Plus, label: "Primary" },
                  { id: "out-l-danger", cls: "nxt-btn-outline-danger", icon: Trash2, label: "Danger" },
                  { id: "out-l-ghost", cls: "nxt-btn-ghost", icon: RefreshCw, label: "Ghost" },
                  { id: "out-l-link", cls: "nxt-btn-link", icon: ArrowRight, label: "Link" },
                ].map((btn) => (
                  <ColorEditable key={btn.id} elementKey={`componentes.${btn.id}`} defaultBg={resolveDominantColor(btn.cls)} hasHover={true} defaultHoverBg={resolveHoverColor(btn.cls)}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className={`${btn.cls} cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2`} style={styles} onClick={openPicker} {...hoverHandlers}>
                          <btn.icon className="w-4 h-4" /> {btn.label}
                        </button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-2">
                {[
                  { id: "out-g-primary", cls: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-transparent border-2 border-white text-white transition-all hover:bg-white/20", icon: Plus, label: "Primary" },
                  { id: "out-g-danger", cls: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-transparent border-2 border-red-400 text-red-300 transition-all hover:bg-red-400/20", icon: Trash2, label: "Danger" },
                  { id: "out-g-ghost", cls: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-white/30 text-white transition-all duration-nxt-fast hover:bg-white/40", icon: RefreshCw, label: "Ghost" },
                  { id: "out-g-link", cls: "inline-flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white hover:underline", icon: ArrowRight, label: "Link" },
                ].map((btn) => (
                  <ColorEditable key={btn.id} elementKey={`componentes.${btn.id}`} defaultBg={resolveDominantColor(btn.cls)} hasHover={true} defaultHoverBg={resolveHoverColor(btn.cls)}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className={`${btn.cls} cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2`} style={styles} onClick={openPicker} {...hoverHandlers}>
                          {btn.label === "Link" ? <>{btn.label} <btn.icon className="w-3.5 h-3.5" /></> : <><btn.icon className="w-4 h-4" /> {btn.label}</>}
                        </button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "out-d-primary", cls: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-transparent border-2 border-pine text-pine transition-all hover:bg-pine hover:text-white", icon: Zap, label: "Outline Primary" },
                  { id: "out-d-danger", cls: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-transparent border-2 border-red-500 text-red-400 transition-all hover:bg-red-500 hover:text-white", icon: Trash2, label: "Outline Danger" },
                  { id: "out-d-ghost", cls: "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-transparent text-gray-400 transition-all duration-nxt-fast hover:bg-bark hover:text-gray-200", icon: RefreshCw, label: "Ghost" },
                  { id: "out-d-link", cls: "inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:underline", icon: ArrowRight, label: "Link" },
                ].map((btn) => (
                  <ColorEditable key={btn.id} elementKey={`componentes.${btn.id}`} defaultBg={resolveDominantColor(btn.cls)} hasHover={true} defaultHoverBg={resolveHoverColor(btn.cls)}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className={`${btn.cls} cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2`} style={styles} onClick={openPicker} {...hoverHandlers}>
                          {btn.label === "Link" ? <>{btn.label} <btn.icon className="w-3.5 h-3.5" /></> : <><btn.icon className="w-4 h-4" /> {btn.label}</>}
                        </button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tamanos */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Tamanos</h3>
          <p className="text-xs text-nxt-400 mb-4">Tres tamanos disponibles: small, default y large.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap items-center gap-2">
                <ColorEditable elementKey="componentes.size-l-small" defaultBg={resolveDominantColor("nxt-btn-primary")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-primary")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-primary text-xs px-3 py-1.5 cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-3 h-3" /> Small</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.size-l-default" defaultBg={resolveDominantColor("nxt-btn-primary")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-primary")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-primary cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-4 h-4" /> Default</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.size-l-large" defaultBg={resolveDominantColor("nxt-btn-primary")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-primary")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-primary text-base px-6 py-3 cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-5 h-5" /> Large</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap items-center gap-2">
                <ColorEditable elementKey="componentes.size-g-small" defaultBg={resolveDominantColor("bg-primary-light")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-primary-light")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-nxt-md bg-primary-light text-white cursor-pointer active:scale-95 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-3 h-3" /> Small</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.size-g-default" defaultBg={resolveDominantColor("bg-primary-light")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-primary-light")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-primary-light text-white cursor-pointer active:scale-95 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-4 h-4" /> Default</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.size-g-large" defaultBg={resolveDominantColor("bg-primary-light")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-primary-light")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-nxt-md bg-primary-light text-white cursor-pointer active:scale-95 transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-5 h-5" /> Large</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap items-center gap-2">
                <ColorEditable elementKey="componentes.size-d-small" defaultBg={resolveDominantColor("bg-[#04202C]")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#04202C]")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-nxt-md bg-pine text-white cursor-pointer active:scale-95 transition-all hover:shadow-lg hover:shadow-primary/20" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-3 h-3" /> Small</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.size-d-default" defaultBg={resolveDominantColor("bg-[#04202C]")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#04202C]")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-pine text-white cursor-pointer active:scale-95 transition-all hover:shadow-lg hover:shadow-primary/20" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-4 h-4" /> Default</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.size-d-large" defaultBg={resolveDominantColor("bg-[#04202C]")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#04202C]")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-medium rounded-nxt-md bg-pine text-white cursor-pointer active:scale-95 transition-all hover:shadow-lg hover:shadow-primary/20" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-5 h-5" /> Large</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
        </div>

        {/* Pill / Rounded */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Pill (redondeados)</h3>
          <p className="text-xs text-nxt-400 mb-4">Botones con bordes completamente redondeados.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "pill-l-pri", cls: "nxt-btn-primary nxt-btn-pill", label: "Primary Pill" },
                  { id: "pill-l-sec", cls: "nxt-btn-secondary nxt-btn-pill", label: "Secondary Pill" },
                  { id: "pill-l-info", cls: "nxt-btn-info nxt-btn-pill", label: "Info Pill" },
                  { id: "pill-l-danger", cls: "nxt-btn-danger nxt-btn-pill", label: "Danger Pill" },
                ].map((btn) => (
                  <ColorEditable key={btn.id} elementKey={`componentes.${btn.id}`} defaultBg={resolveDominantColor(btn.cls)} hasHover={true} defaultHoverBg={resolveHoverColor(btn.cls)}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className={`${btn.cls} cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2`} style={styles} onClick={openPicker} {...hoverHandlers}>{btn.label}</button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-2">
                <ColorEditable elementKey="componentes.pill-g-white" defaultBg={resolveDominantColor("bg-primary-light")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-primary-light")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-primary-light text-white transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Rocket className="w-4 h-4" /> Primary Pill</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.pill-g-glass" defaultBg={resolveDominantColor("bg-white/30")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-white/30")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-white/30 text-white border border-white/30 transition-all duration-300 hover:bg-white/40 shadow-lg cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Globe className="w-4 h-4" /> Secondary Pill</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.pill-g-info" defaultBg={resolveDominantColor("bg-blue-400")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-blue-400")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-blue-400 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Info className="w-4 h-4" /> Info Pill</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.pill-g-danger" defaultBg={resolveDominantColor("bg-red-400")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-red-400")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-red-400 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Trash2 className="w-4 h-4" /> Danger Pill</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-2">
                <ColorEditable elementKey="componentes.pill-d-pri" defaultBg={resolveDominantColor("bg-[#04202C]")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#04202C]")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-pine text-white transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}>Primary Pill</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.pill-d-sec" defaultBg={resolveDominantColor("bg-[#1A3036]")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#1A3036]")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-bark text-gray-200 border border-pine transition-all hover:bg-evergreen cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}>Secondary Pill</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.pill-d-info" defaultBg={resolveDominantColor("bg-blue-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-blue-500")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-blue-500 text-white transition-all hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}>Info Pill</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.pill-d-danger" defaultBg={resolveDominantColor("bg-red-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-red-500")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-red-500 text-white transition-all hover:shadow-lg hover:shadow-red-500/20 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}>Danger Pill</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
        </div>

        {/* Icon only */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Icon only</h3>
          <p className="text-xs text-nxt-400 mb-4">Botones cuadrados o circulares que contienen solo un icono.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap items-center gap-2">
                <ColorEditable elementKey="componentes.ico-l-plus" defaultBg={resolveDominantColor("bg-forest")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-forest")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-icon bg-forest text-white hover:bg-bark cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-l-dl" defaultBg={resolveDominantColor("bg-nxt-100")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-nxt-100")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-icon bg-nxt-100 text-nxt-600 hover:bg-nxt-200 cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2" style={styles} onClick={openPicker} {...hoverHandlers}><Download className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-l-del" defaultBg={resolveDominantColor("bg-error")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-error")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-icon bg-error text-white hover:bg-red-700 cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2" style={styles} onClick={openPicker} {...hoverHandlers}><Trash2 className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-l-chk" defaultBg={resolveDominantColor("bg-success")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-success")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-icon bg-success text-white hover:bg-green-800 cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2" style={styles} onClick={openPicker} {...hoverHandlers}><CheckCircle className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-l-info" defaultBg={resolveDominantColor("bg-info")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-info")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-icon bg-info text-white hover:bg-blue-700 cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2" style={styles} onClick={openPicker} {...hoverHandlers}><Info className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-l-set" defaultBg={resolveDominantColor("bg-forest")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-forest")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-icon rounded-full bg-forest text-white hover:bg-bark cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2" style={styles} onClick={openPicker} {...hoverHandlers}><Settings className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap items-center gap-2">
                <ColorEditable elementKey="componentes.ico-g-plus" defaultBg={resolveDominantColor("bg-primary-light")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-primary-light")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-nxt-md bg-primary-light text-white flex items-center justify-center transition-all shadow-lg shadow-primary/30 hover:shadow-xl cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-g-dl" defaultBg={resolveDominantColor("bg-gray-100")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-gray-100")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-nxt-md bg-gray-100 text-gray-700 flex items-center justify-center transition-all shadow-lg hover:shadow-xl cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Download className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-g-del" defaultBg={resolveDominantColor("bg-red-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-red-500")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-nxt-md bg-red-500 text-white flex items-center justify-center transition-all shadow-lg shadow-red-500/40 hover:bg-red-600 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Trash2 className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-g-chk" defaultBg={resolveDominantColor("bg-green-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-green-500")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-nxt-md bg-green-500 text-white flex items-center justify-center transition-all shadow-lg shadow-green-500/40 hover:bg-green-600 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><CheckCircle className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-g-info" defaultBg={resolveDominantColor("bg-blue-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-blue-500")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-nxt-md bg-blue-500 text-white flex items-center justify-center transition-all shadow-lg shadow-blue-500/40 hover:bg-blue-600 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Info className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-g-set" defaultBg={resolveDominantColor("bg-primary-light")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-primary-light")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center transition-all shadow-lg shadow-primary/30 hover:shadow-xl cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Settings className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap items-center gap-2">
                <ColorEditable elementKey="componentes.ico-d-plus" defaultBg={resolveDominantColor("bg-[#04202C]")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#04202C]")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-nxt-md bg-pine text-white flex items-center justify-center transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-d-dl" defaultBg={resolveDominantColor("bg-gray-100")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-gray-100")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-nxt-md bg-gray-100 text-gray-700 flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Download className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-d-del" defaultBg={resolveDominantColor("bg-red-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-red-500")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-nxt-md bg-red-500 text-white flex items-center justify-center hover:bg-red-600 cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Trash2 className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-d-chk" defaultBg={resolveDominantColor("bg-green-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-green-500")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-nxt-md bg-green-500 text-white flex items-center justify-center hover:bg-green-600 cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><CheckCircle className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-d-info" defaultBg={resolveDominantColor("bg-blue-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-blue-500")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-nxt-md bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Info className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.ico-d-set" defaultBg={resolveDominantColor("bg-[#04202C]")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#04202C]")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-full bg-pine text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Settings className="w-4 h-4" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
        </div>

        {/* Con badge / counter */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Con badge</h3>
          <p className="text-xs text-nxt-400 mb-4">Botones con contador de notificaciones.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap items-center gap-3">
                <ColorEditable elementKey="componentes.badge-l-notif" defaultBg={resolveDominantColor("nxt-btn-primary")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-primary")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-primary relative cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}>
                        Notificaciones
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">5</span>
                      </button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.badge-l-msg" defaultBg={resolveDominantColor("nxt-btn-secondary")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-secondary")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-secondary relative cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}>
                        Mensajes
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-info text-white text-[10px] font-bold rounded-full flex items-center justify-center">12</span>
                      </button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.badge-l-bell" defaultBg={resolveDefaultBg("bg-nxt-100")} hasHover={true} defaultHoverBg={resolveDefaultBg("bg-nxt-200")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-icon bg-nxt-100 text-nxt-600 hover:bg-nxt-200 relative cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}>
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-white" />
                      </button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap items-center gap-3">
                <ColorEditable elementKey="componentes.badge-g-notif" defaultBg={resolveDefaultBg("bg-primary-light")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-primary-light")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-primary-light text-white relative cursor-pointer active:scale-95 transition-all shadow-lg shadow-primary/30" style={styles} onClick={openPicker} {...hoverHandlers}>
                        Notificaciones
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">5</span>
                      </button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.badge-g-msg" defaultBg={resolveDefaultBg("bg-blue-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-blue-500")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-blue-500 text-white relative cursor-pointer active:scale-95 transition-all shadow-lg shadow-blue-500/40" style={styles} onClick={openPicker} {...hoverHandlers}>
                        Mensajes
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-300 text-blue-900 text-[10px] font-bold rounded-full flex items-center justify-center">12</span>
                      </button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.badge-g-bell" defaultBg={resolveDefaultBg("bg-gray-100")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-gray-100")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-nxt-md bg-gray-100 text-gray-700 flex items-center justify-center relative cursor-pointer active:scale-95 transition-all shadow-lg hover:shadow-xl" style={styles} onClick={openPicker} {...hoverHandlers}>
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-100" />
                      </button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap items-center gap-3">
                <ColorEditable elementKey="componentes.badge-d-notif" defaultBg={resolveDominantColor("nxt-btn-primary")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-primary")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-primary relative cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}>
                        Notificaciones
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">5</span>
                      </button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.badge-d-msg" defaultBg="#1A3036" hasHover={true} defaultHoverBg="#304040">
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-bark text-gray-200 border border-pine relative cursor-pointer active:scale-95 transition-all hover:bg-evergreen" style={styles} onClick={openPicker} {...hoverHandlers}>
                        Mensajes
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">12</span>
                      </button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.badge-d-bell" defaultBg="#1A3036" hasHover={true} defaultHoverBg="#304040">
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-10 h-10 rounded-nxt-md bg-bark text-gray-200 border border-pine flex items-center justify-center relative cursor-pointer active:scale-95 transition-all hover:bg-evergreen" style={styles} onClick={openPicker} {...hoverHandlers}>
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-forest" />
                      </button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
        </div>

        {/* Button group */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Grupos</h3>
          <p className="text-xs text-nxt-400 mb-4">Botones agrupados para acciones relacionadas o toggles.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex rounded-nxt-md overflow-hidden border border-nxt-200">
                  {["Dia", "Semana", "Mes"].map((label, i) => (
                    <ColorEditable key={label} elementKey={`componentes.seg-l-${label.toLowerCase()}`} defaultBg={resolveDominantColor("bg-forest")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-forest")}>
                      {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                        <div className="relative flex flex-col items-center gap-1">
                          <button onClick={openPicker} className={`px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 ${activePeriod === i ? "bg-forest text-white" : "bg-white text-nxt-600 hover:bg-nxt-50"} ${i < 2 ? "border-r border-nxt-200" : ""}`} style={styles} {...hoverHandlers}>{label}</button>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                        </div>
                      )}
                    </ColorEditable>
                  ))}
                </div>
                <div className="inline-flex rounded-nxt-md overflow-hidden border border-nxt-200">
                  <ColorEditable elementKey="componentes.grp-l-eye" defaultBg={resolveDominantColor("bg-white")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-white")}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className="nxt-btn-icon bg-white text-nxt-600 hover:bg-nxt-50 rounded-none border-r border-nxt-200 cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Eye className="w-4 h-4" /></button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                  <ColorEditable elementKey="componentes.grp-l-dl" defaultBg={resolveDominantColor("bg-white")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-white")}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className="nxt-btn-icon bg-white text-nxt-600 hover:bg-nxt-50 rounded-none border-r border-nxt-200 cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Download className="w-4 h-4" /></button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                  <ColorEditable elementKey="componentes.grp-l-del" defaultBg={resolveDominantColor("bg-white")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-white")}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className="nxt-btn-icon bg-white text-nxt-600 hover:bg-nxt-50 rounded-none cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Trash2 className="w-4 h-4" /></button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-3">
                <div className="inline-flex rounded-nxt-md overflow-hidden border border-white/20">
                  {["Dia", "Semana", "Mes"].map((label, i) => (
                    <ColorEditable key={label} elementKey={`componentes.seg-g-${label.toLowerCase()}`} defaultBg={resolveDominantColor("bg-primary-light")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-primary-light")}>
                      {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                        <div className="relative flex flex-col items-center gap-1">
                          <button onClick={openPicker} className={`px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 ${activePeriod === i ? "bg-primary-light text-white" : "bg-white/30 text-white hover:bg-white/40"} ${i < 2 ? "border-r border-white/20" : ""}`} style={styles} {...hoverHandlers}>{label}</button>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                        </div>
                      )}
                    </ColorEditable>
                  ))}
                </div>
                <div className="inline-flex rounded-nxt-md overflow-hidden border border-white/20">
                  <ColorEditable elementKey="componentes.grp-g-eye" defaultBg={resolveDominantColor("bg-white/30")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-white/30")}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className="w-9 h-9 bg-white/30 text-white hover:bg-white/40 flex items-center justify-center border-r border-white/20 cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Eye className="w-4 h-4" /></button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                  <ColorEditable elementKey="componentes.grp-g-dl" defaultBg={resolveDominantColor("bg-white/30")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-white/30")}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className="w-9 h-9 bg-white/30 text-white hover:bg-white/40 flex items-center justify-center border-r border-white/20 cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Download className="w-4 h-4" /></button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                  <ColorEditable elementKey="componentes.grp-g-del" defaultBg={resolveDominantColor("bg-white/30")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-white/30")}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className="w-9 h-9 bg-white/30 text-white hover:bg-white/40 flex items-center justify-center cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Trash2 className="w-4 h-4" /></button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex rounded-nxt-md overflow-hidden border border-evergreen">
                  {["Dia", "Semana", "Mes"].map((label, i) => (
                    <ColorEditable key={label} elementKey={`componentes.seg-d-${label.toLowerCase()}`} defaultBg={resolveDominantColor("bg-[#04202C]")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#04202C]")}>
                      {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                        <div className="relative flex flex-col items-center gap-1">
                          <button onClick={openPicker} className={`px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 ${activePeriod === i ? "bg-pine text-white" : "bg-bark text-gray-300 hover:bg-evergreen"} ${i < 2 ? "border-r border-evergreen" : ""}`} style={styles} {...hoverHandlers}>{label}</button>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                        </div>
                      )}
                    </ColorEditable>
                  ))}
                </div>
                <div className="inline-flex rounded-nxt-md overflow-hidden border border-evergreen">
                  <ColorEditable elementKey="componentes.grp-d-eye" defaultBg={resolveDominantColor("bg-[#1A3036]")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#1A3036]")}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className="w-9 h-9 bg-bark text-gray-300 hover:bg-evergreen flex items-center justify-center border-r border-evergreen cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Eye className="w-4 h-4" /></button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                  <ColorEditable elementKey="componentes.grp-d-dl" defaultBg={resolveDominantColor("bg-[#1A3036]")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#1A3036]")}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className="w-9 h-9 bg-bark text-gray-300 hover:bg-evergreen flex items-center justify-center border-r border-evergreen cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Download className="w-4 h-4" /></button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                  <ColorEditable elementKey="componentes.grp-d-del" defaultBg={resolveDominantColor("bg-[#1A3036]")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#1A3036]")}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className="w-9 h-9 bg-bark text-gray-300 hover:bg-evergreen flex items-center justify-center cursor-pointer active:scale-95 transition-all" style={styles} onClick={openPicker} {...hoverHandlers}><Trash2 className="w-4 h-4" /></button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient buttons */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Gradiente</h3>
          <p className="text-xs text-nxt-400 mb-4">Fondos con degradado de color para CTAs destacados.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "grad-l-bc", icon: Zap, label: "Blue Ã¢â€ â€™ Cyan", gradient: "from-blue-600 to-cyan-500" },
                  { id: "grad-l-ro", icon: Activity, label: "Rose Ã¢â€ â€™ Orange", gradient: "from-rose-500 to-orange-400" },
                  { id: "grad-l-gt", icon: Shield, label: "Green Ã¢â€ â€™ Teal", gradient: "from-emerald-500 to-teal-400" },
                  { id: "grad-l-pp", icon: Sparkles, label: "Purple Ã¢â€ â€™ Pink", gradient: "from-purple-600 to-pink-500" },
                ].map((btn) => (
                  <ColorEditable key={btn.id} elementKey={`componentes.${btn.id}`} defaultBg={resolveDominantColor(`bg-gradient-to-r ${btn.gradient}`)} hasHover={true} defaultHoverBg={resolveHoverColor(`bg-gradient-to-r ${btn.gradient}`)}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md text-white bg-gradient-to-r ${btn.gradient} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer active:scale-95`} style={styles} onClick={openPicker} {...hoverHandlers}>
                          <btn.icon className="w-4 h-4" /> {btn.label}
                        </button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-2">
                {[
                  { id: "grad-g-bc", icon: Zap, label: "Blue Ã¢â€ â€™ Cyan", gradient: "from-blue-500 to-cyan-400", ring: "ring-blue-300/50" },
                  { id: "grad-g-ro", icon: Activity, label: "Rose Ã¢â€ â€™ Orange", gradient: "from-rose-500 to-orange-400", ring: "ring-rose-300/50" },
                  { id: "grad-g-gt", icon: Shield, label: "Green Ã¢â€ â€™ Teal", gradient: "from-emerald-500 to-teal-400", ring: "ring-emerald-300/50" },
                  { id: "grad-g-pp", icon: Sparkles, label: "Purple Ã¢â€ â€™ Pink", gradient: "from-purple-500 to-pink-400", ring: "ring-purple-300/50" },
                ].map((btn) => (
                  <ColorEditable key={btn.id} elementKey={`componentes.${btn.id}`} defaultBg={resolveDominantColor(`bg-gradient-to-r ${btn.gradient}`)} hasHover={true} defaultHoverBg={resolveHoverColor(`bg-gradient-to-r ${btn.gradient}`)}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-nxt-md text-white bg-gradient-to-r ${btn.gradient} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl shadow-lg ring-2 ${btn.ring} cursor-pointer active:scale-95`} style={styles} onClick={openPicker} {...hoverHandlers}>
                          <btn.icon className="w-4 h-4" /> {btn.label}
                        </button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "grad-d-bc", icon: Zap, label: "Blue Ã¢â€ â€™ Cyan", gradient: "from-blue-600 to-cyan-500", shadow: "shadow-blue-500/30" },
                  { id: "grad-d-ro", icon: Activity, label: "Rose Ã¢â€ â€™ Orange", gradient: "from-rose-500 to-orange-400", shadow: "shadow-rose-500/30" },
                  { id: "grad-d-gt", icon: Shield, label: "Green Ã¢â€ â€™ Teal", gradient: "from-emerald-500 to-teal-400", shadow: "shadow-emerald-500/30" },
                  { id: "grad-d-pp", icon: Sparkles, label: "Purple Ã¢â€ â€™ Pink", gradient: "from-purple-600 to-pink-500", shadow: "shadow-purple-500/30" },
                ].map((btn) => (
                  <ColorEditable key={btn.id} elementKey={`componentes.${btn.id}`} defaultBg={resolveDominantColor(`bg-gradient-to-r ${btn.gradient}`)} hasHover={true} defaultHoverBg={resolveHoverColor(`bg-gradient-to-r ${btn.gradient}`)}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="relative flex flex-col items-center gap-1">
                        <button className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md text-white bg-gradient-to-r ${btn.gradient} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${btn.shadow} shadow-md cursor-pointer active:scale-95`} style={styles} onClick={openPicker} {...hoverHandlers}>
                          <btn.icon className="w-4 h-4" /> {btn.label}
                        </button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAB (Floating Action Button) */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">FAB (Floating Action)</h3>
          <p className="text-xs text-nxt-400 mb-4">Floating Action Buttons Ã¢â‚¬â€ botones flotantes circulares para la accion principal.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap items-center gap-3">
                <ColorEditable elementKey="componentes.fab-l-plus" defaultBg={resolveDefaultBg("bg-forest")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-forest")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-12 h-12 rounded-full bg-forest text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-6 h-6" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.fab-l-arrow" defaultBg={resolveDefaultBg("bg-info")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-info")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-12 h-12 rounded-full bg-info text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><ArrowRight className="w-6 h-6" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.fab-l-crear" defaultBg={resolveDefaultBg("bg-forest")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-forest")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="h-12 px-5 rounded-full bg-forest text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-sm font-semibold cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-5 h-5" /> Crear</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap items-center gap-3">
                <ColorEditable elementKey="componentes.fab-g-plus" defaultBg={resolveDefaultBg("bg-primary-light")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-primary-light")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-12 h-12 rounded-full bg-primary-light text-white flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-6 h-6" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.fab-g-arrow" defaultBg={resolveDefaultBg("bg-blue-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-blue-500")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-1 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><ArrowRight className="w-6 h-6" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.fab-g-crear" defaultBg={resolveDefaultBg("bg-primary-light")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-primary-light")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="h-12 px-5 rounded-full bg-primary-light text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 text-sm font-semibold cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-5 h-5" /> Crear</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap items-center gap-3">
                <ColorEditable elementKey="componentes.fab-d-plus" defaultBg="#04202C" hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#04202C]")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-12 h-12 rounded-full bg-pine text-white flex items-center justify-center shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-6 h-6" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.fab-d-arrow" defaultBg={resolveDefaultBg("bg-blue-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-blue-500")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><ArrowRight className="w-6 h-6" /></button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.fab-d-crear" defaultBg="#04202C" hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#04202C]")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="h-12 px-5 rounded-full bg-pine text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 text-sm font-semibold cursor-pointer active:scale-95" style={styles} onClick={openPicker} {...hoverHandlers}><Plus className="w-5 h-5" /> Crear</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
        </div>

        {/* Estados */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Estados</h3>
          <p className="text-xs text-nxt-400 mb-4">Disabled, loading y feedback de exito.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap items-center gap-2">
                <ColorEditable elementKey="componentes.est-l-disabled" defaultBg={resolveDominantColor("nxt-btn-primary")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-primary cursor-not-allowed" disabled style={styles} onClick={openPicker}><Plus className="w-4 h-4" /> Disabled</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.est-l-loading" defaultBg={resolveDominantColor("nxt-btn-primary")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-primary")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-primary cursor-pointer active:scale-95 transition-all duration-200" style={styles} onClick={openPicker} {...hoverHandlers}><Loader2 className="w-4 h-4 animate-spin" /> Cargando...</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.est-l-saved" defaultBg={resolveDominantColor("nxt-btn-success")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-success")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-success cursor-pointer active:scale-95 transition-all duration-200" style={styles} onClick={openPicker} {...hoverHandlers}><CheckCircle className="w-4 h-4" /> Guardado!</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap items-center gap-2">
                <ColorEditable elementKey="componentes.est-g-disabled" defaultBg={resolveDefaultBg("bg-primary-light/50")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-primary-light/50 text-white cursor-not-allowed" disabled style={styles} onClick={openPicker}><Plus className="w-4 h-4" /> Disabled</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.est-g-loading" defaultBg={resolveDefaultBg("bg-primary-light")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-primary-light")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-primary-light text-white shadow-lg shadow-primary/30 cursor-pointer active:scale-95 transition-all duration-200" style={styles} onClick={openPicker} {...hoverHandlers}><Loader2 className="w-4 h-4 animate-spin" /> Cargando...</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.est-g-saved" defaultBg={resolveDefaultBg("bg-green-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-green-500")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-nxt-md bg-green-500 text-white shadow-lg shadow-green-500/40 cursor-pointer active:scale-95 transition-all duration-200" style={styles} onClick={openPicker} {...hoverHandlers}><CheckCircle className="w-4 h-4" /> Guardado!</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap items-center gap-2">
                <ColorEditable elementKey="componentes.est-d-disabled" defaultBg={resolveDominantColor("nxt-btn-primary")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-primary cursor-not-allowed" disabled style={styles} onClick={openPicker}><Plus className="w-4 h-4" /> Disabled</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.est-d-loading" defaultBg={resolveDominantColor("nxt-btn-primary")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-primary")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-primary cursor-pointer active:scale-95 transition-all duration-200" style={styles} onClick={openPicker} {...hoverHandlers}><Loader2 className="w-4 h-4 animate-spin" /> Cargando...</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.est-d-saved" defaultBg={resolveDominantColor("nxt-btn-success")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-success")}>
                  {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                    <div className="relative flex flex-col items-center gap-1">
                      <button className="nxt-btn-success cursor-pointer active:scale-95 transition-all duration-200" style={styles} onClick={openPicker} {...hoverHandlers}><CheckCircle className="w-4 h-4" /> Guardado!</button>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      {/* 2. BADGES & STATUS                                            */}
      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      <Section id="badges" title="Badges & Status" description="Indicadores de estado completos: filled, light, outline, dot, pill, icon badges, contadores, semaforo, service health, status cards e iconos de infraestructura. Haz click en los badges para activar/desactivar.">

        {/* Filled (fondo solido, texto blanco) */}
        <h3 className="text-sm font-semibold text-nxt-700 mb-1">Filled (solid) <span className="text-[10px] font-normal text-nxt-400">- click para toggle</span></h3>
        <p className="text-xs text-nxt-400 mb-4">Fondo solido de color con texto blanco. Maxima visibilidad.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "filled-success", icon: CheckCircle, label: "Activo", cls: "bg-success text-white" },
                  { id: "filled-warning", icon: AlertTriangle, label: "Pendiente", cls: "bg-warning text-white" },
                  { id: "filled-error", icon: XCircle, label: "Error", cls: "bg-error text-white" },
                  { id: "filled-info", icon: Info, label: "Info", cls: "bg-info text-white" },
                  { id: "filled-primary", icon: Zap, label: "Primary", cls: "bg-forest text-white" },
                  { id: "filled-neutral", icon: CircleDot, label: "Neutral", cls: "bg-nxt-700 text-white" },
                ].map((b) => (
                  <ColorEditable key={b.id} elementKey={`componentes.${b.id}`} defaultBg={resolveDefaultBg(b.cls)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-nxt-md ${b.cls} cursor-pointer transition-all duration-300 select-none ${activeBadges.has(b.id) ? "opacity-100 scale-100" : "opacity-50 scale-95"}`}
                          style={styles}
                        >
                          <b.icon className="w-3.5 h-3.5" /> {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-2">
                {[
                  { id: "filled-g-act", icon: CheckCircle, label: "Activo", cls: "bg-green-400 text-gray-900 font-bold shadow-xl shadow-green-400/50 ring-1 ring-green-300/50" },
                  { id: "filled-g-pend", icon: AlertTriangle, label: "Pendiente", cls: "bg-amber-400 text-gray-900 font-bold shadow-xl shadow-amber-400/50 ring-1 ring-amber-300/50" },
                  { id: "filled-g-err", icon: XCircle, label: "Error", cls: "bg-red-400 text-white font-bold shadow-xl shadow-red-400/50 ring-1 ring-red-300/50" },
                  { id: "filled-g-info", icon: Info, label: "Info", cls: "bg-blue-400 text-white font-bold shadow-xl shadow-blue-400/50 ring-1 ring-blue-300/50" },
                  { id: "filled-g-pri", icon: Zap, label: "Primary", cls: "bg-primary-light text-white font-bold shadow-xl shadow-primary/40 ring-1 ring-primary-light/50" },
                  { id: "filled-g-neu", icon: CircleDot, label: "Neutral", cls: "bg-white text-gray-700 font-bold shadow-xl ring-1 ring-white/50" },
                ].map((b) => (
                  <ColorEditable key={b.id} elementKey={`componentes.${b.id}`} defaultBg={resolveDefaultBg(b.cls)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-nxt-md ${b.cls} cursor-pointer transition-all duration-300 select-none shadow-md ${activeBadges.has(b.id) ? "opacity-100 scale-100" : "opacity-50 scale-95"}`}
                          style={styles}
                        >
                          <b.icon className="w-3.5 h-3.5" /> {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "filled-d-act", icon: CheckCircle, label: "Activo", cls: "bg-green-500 text-white shadow-lg shadow-green-500/30" },
                  { id: "filled-d-pend", icon: AlertTriangle, label: "Pendiente", cls: "bg-amber-500 text-white shadow-lg shadow-amber-500/30" },
                  { id: "filled-d-err", icon: XCircle, label: "Error", cls: "bg-red-500 text-white shadow-lg shadow-red-500/30" },
                  { id: "filled-d-info", icon: Info, label: "Info", cls: "bg-blue-500 text-white shadow-lg shadow-blue-500/30" },
                  { id: "filled-d-pri", icon: Zap, label: "Primary", cls: "bg-primary-light text-white shadow-lg shadow-primary/30" },
                  { id: "filled-d-neutral", icon: CircleDot, label: "Neutral", cls: "bg-gray-500 text-white shadow-lg shadow-gray-500/30" },
                ].map((b) => (
                  <ColorEditable key={b.id} elementKey={`componentes.${b.id}`} defaultBg={resolveDefaultBg(b.cls)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-nxt-md ${b.cls} cursor-pointer transition-all duration-300 select-none ${activeBadges.has(b.id) ? "opacity-100 scale-100" : "opacity-50 scale-95"}`}
                          style={styles}
                        >
                          <b.icon className="w-3.5 h-3.5" /> {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Light (fondo de color estado) */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Light (fondo estado)</h3>
          <p className="text-xs text-nxt-400 mb-4">Fondo del color de estado con borde. Menor contraste que filled.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { id: "light-success", icon: CheckCircle, label: "Activo", cls: "bg-success-light text-success border border-success-border" },
                  { id: "light-warning", icon: AlertTriangle, label: "Pendiente", cls: "bg-warning-light text-warning border border-warning-border" },
                  { id: "light-error", icon: XCircle, label: "Error", cls: "bg-error-light text-error border border-error-border" },
                  { id: "light-info", icon: Info, label: "Info", cls: "bg-info-light text-info border border-info-border" },
                  { id: "light-neutral", icon: CircleDot, label: "Neutral", cls: "bg-nxt-200 text-nxt-700 border border-nxt-300" },
                ].map((b) => (
                  <ColorEditable key={b.id} elementKey={`componentes.${b.id}`} defaultBg={resolveDefaultBg(b.cls)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-nxt-md ${b.cls} cursor-pointer transition-all duration-300 select-none ${activeBadges.has(b.id) ? "opacity-100 scale-100" : "opacity-50 scale-95"}`}
                          style={styles}
                        >
                          <b.icon className="w-3.5 h-3.5" /> {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-2 sm:gap-3">
                {[
                  { icon: CheckCircle, label: "Activo", cls: "bg-green-500/40 text-green-200 border border-green-400/50 shadow-md shadow-green-500/20" },
                  { icon: AlertTriangle, label: "Pendiente", cls: "bg-amber-500/40 text-amber-200 border border-amber-400/50 shadow-md shadow-amber-500/20" },
                  { icon: XCircle, label: "Error", cls: "bg-red-500/40 text-red-200 border border-red-400/50 shadow-md shadow-red-500/20" },
                  { icon: Info, label: "Info", cls: "bg-blue-500/40 text-blue-200 border border-blue-400/50 shadow-md shadow-blue-500/20" },
                  { icon: CircleDot, label: "Neutral", cls: "bg-white/30 text-white border border-white/40 shadow-md" },
                ].map((b, i) => (
                  <ColorEditable key={`badge-light-grad-${i}`} elementKey={`componentes.badge-light-grad-${i}`} defaultBg={resolveDefaultBg(b.cls)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-nxt-md ${b.cls} cursor-pointer transition-all duration-300 select-none`}
                          style={styles}
                        >
                          <b.icon className="w-3.5 h-3.5" /> {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { icon: CheckCircle, label: "Activo", cls: "bg-green-500/30 text-green-400 border border-green-500/50 shadow-md shadow-green-500/20" },
                  { icon: AlertTriangle, label: "Pendiente", cls: "bg-amber-500/30 text-amber-400 border border-amber-500/50 shadow-md shadow-amber-500/20" },
                  { icon: XCircle, label: "Error", cls: "bg-red-500/30 text-red-400 border border-red-500/50 shadow-md shadow-red-500/20" },
                  { icon: Info, label: "Info", cls: "bg-blue-500/30 text-blue-400 border border-blue-500/50 shadow-md shadow-blue-500/20" },
                  { icon: CircleDot, label: "Neutral", cls: "bg-gray-500/30 text-gray-300 border border-gray-500/50 shadow-md" },
                ].map((b, i) => (
                  <ColorEditable key={`badge-light-dark-${i}`} elementKey={`componentes.badge-light-dark-${i}`} defaultBg={resolveDefaultBg(b.cls)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-nxt-md ${b.cls} cursor-pointer transition-all duration-300 select-none`}
                          style={styles}
                        >
                          <b.icon className="w-3.5 h-3.5" /> {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Outline */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Outline</h3>
          <p className="text-xs text-nxt-400 mb-4">Solo borde de 2px sin fondo. Sutil y elegante.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { id: "outline-success", icon: CheckCircle, label: "Activo", cls: "border-2 border-success text-success" },
                  { id: "outline-warning", icon: AlertTriangle, label: "Pendiente", cls: "border-2 border-warning text-warning" },
                  { id: "outline-error", icon: XCircle, label: "Error", cls: "border-2 border-error text-error" },
                  { id: "outline-info", icon: Info, label: "Info", cls: "border-2 border-info text-info" },
                  { id: "outline-neutral", icon: CircleDot, label: "Neutral", cls: "border-2 border-nxt-400 text-nxt-600" },
                ].map((b) => (
                  <ColorEditable key={b.id} elementKey={`componentes.${b.id}`} defaultBg={resolveDefaultBg(b.cls)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-nxt-md ${b.cls} cursor-pointer transition-all duration-300 select-none ${activeBadges.has(b.id) ? "opacity-100 scale-100" : "opacity-50 scale-95"}`}
                          style={styles}
                        >
                          <b.icon className="w-3.5 h-3.5" /> {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-2 sm:gap-3">
                {[
                  { icon: CheckCircle, label: "Activo", cls: "border-2 border-green-400 text-green-300 shadow-md shadow-green-400/20" },
                  { icon: AlertTriangle, label: "Pendiente", cls: "border-2 border-amber-400 text-amber-300 shadow-md shadow-amber-400/20" },
                  { icon: XCircle, label: "Error", cls: "border-2 border-red-400 text-red-300 shadow-md shadow-red-400/20" },
                  { icon: Info, label: "Info", cls: "border-2 border-blue-400 text-blue-300 shadow-md shadow-blue-400/20" },
                  { icon: CircleDot, label: "Neutral", cls: "border-2 border-white/50 text-white shadow-md" },
                ].map((b, i) => (
                  <ColorEditable key={`badge-outline-grad-${i}`} elementKey={`componentes.badge-outline-grad-${i}`} defaultBg={resolveDefaultBg(b.cls)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-nxt-md ${b.cls} cursor-pointer transition-all duration-300 select-none`}
                          style={styles}
                        >
                          <b.icon className="w-3.5 h-3.5" /> {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { icon: CheckCircle, label: "Activo", cls: "border-2 border-green-500 text-green-400 shadow-md shadow-green-500/20" },
                  { icon: AlertTriangle, label: "Pendiente", cls: "border-2 border-amber-500 text-amber-400 shadow-md shadow-amber-500/20" },
                  { icon: XCircle, label: "Error", cls: "border-2 border-red-500 text-red-400 shadow-md shadow-red-500/20" },
                  { icon: Info, label: "Info", cls: "border-2 border-blue-500 text-blue-400 shadow-md shadow-blue-500/20" },
                  { icon: CircleDot, label: "Neutral", cls: "border-2 border-gray-500 text-gray-400 shadow-md" },
                ].map((b, i) => (
                  <ColorEditable key={`badge-outline-dark-${i}`} elementKey={`componentes.badge-outline-dark-${i}`} defaultBg={resolveDefaultBg(b.cls)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-nxt-md ${b.cls} cursor-pointer transition-all duration-300 select-none`}
                          style={styles}
                        >
                          <b.icon className="w-3.5 h-3.5" /> {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dot badges */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Dot (punto + texto)</h3>
          <p className="text-xs text-nxt-400 mb-4">Indicador minimo Ã¢â‚¬â€ solo un punto de color y texto.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-3">
                <ColorEditable elementKey="componentes.dot-l-conectado" defaultBg={resolveDefaultBg("bg-success")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-nxt-700 cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-success" style={styles} /> Conectado</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.dot-l-espera" defaultBg={resolveDefaultBg("bg-warning")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-nxt-700 cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-warning" style={styles} /> En espera</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.dot-l-desconectado" defaultBg={resolveDefaultBg("bg-error")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-nxt-700 cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-error" style={styles} /> Desconectado</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.dot-l-sincronizando" defaultBg={resolveDefaultBg("bg-info")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-nxt-700 cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-info" style={styles} /> Sincronizando</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.dot-l-inactivo" defaultBg={resolveDefaultBg("bg-nxt-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-nxt-700 cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-nxt-400" style={styles} /> Inactivo</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-3">
                <ColorEditable elementKey="componentes.dot-g-conectado" defaultBg={resolveDefaultBg("bg-green-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-white cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-md shadow-green-400/40" style={styles} /> Conectado</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.dot-g-espera" defaultBg={resolveDefaultBg("bg-amber-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-white cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/40" style={styles} /> En espera</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.dot-g-desconectado" defaultBg={resolveDefaultBg("bg-red-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-white cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-md shadow-red-400/40" style={styles} /> Desconectado</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.dot-g-sincronizando" defaultBg={resolveDefaultBg("bg-blue-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-white cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-md shadow-blue-400/40" style={styles} /> Sincronizando</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.dot-g-inactivo" defaultBg={resolveDefaultBg("bg-gray-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-white/60 cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-gray-400" style={styles} /> Inactivo</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-3">
                <ColorEditable elementKey="componentes.dot-d-conectado" defaultBg={resolveDefaultBg("bg-green-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-md shadow-green-400/30" style={styles} /> Conectado</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.dot-d-espera" defaultBg={resolveDefaultBg("bg-amber-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400/30" style={styles} /> En espera</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.dot-d-desconectado" defaultBg={resolveDefaultBg("bg-red-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-md shadow-red-400/30" style={styles} /> Desconectado</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.dot-d-sincronizando" defaultBg={resolveDefaultBg("bg-blue-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-md shadow-blue-400/30" style={styles} /> Sincronizando</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.dot-d-inactivo" defaultBg={resolveDefaultBg("bg-gray-500")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-500 cursor-pointer" onClick={openPicker}><span className="w-2.5 h-2.5 rounded-full bg-gray-500" style={styles} /> Inactivo</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
        </div>

        {/* Icon badges */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Icon badges</h3>
          <p className="text-xs text-nxt-400 mb-4">Icono dentro de circulo de color + texto descriptivo.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { icon: Wifi, label: "Conectado", bg: "bg-success-light", ring: "ring-success-border", text: "text-success", iconBg: "bg-success" },
                  { icon: WifiOff, label: "Sin red", bg: "bg-error-light", ring: "ring-error-border", text: "text-error", iconBg: "bg-error" },
                  { icon: Cloud, label: "En la nube", bg: "bg-info-light", ring: "ring-info-border", text: "text-info", iconBg: "bg-info" },
                  { icon: CloudOff, label: "Offline", bg: "bg-nxt-200", ring: "ring-nxt-300", text: "text-nxt-600", iconBg: "bg-nxt-500" },
                  { icon: Lock, label: "Protegido", bg: "bg-success-light", ring: "ring-success-border", text: "text-success", iconBg: "bg-success" },
                  { icon: Unlock, label: "Abierto", bg: "bg-warning-light", ring: "ring-warning-border", text: "text-warning", iconBg: "bg-warning" },
                  { icon: BellRing, label: "Alerta", bg: "bg-error-light", ring: "ring-error-border", text: "text-error", iconBg: "bg-error" },
                  { icon: BellOff, label: "Silenciado", bg: "bg-nxt-200", ring: "ring-nxt-300", text: "text-nxt-600", iconBg: "bg-nxt-500" },
                ].map((b, i) => {
                  const badgeId = `icon-${i}`;
                  return (
                    <ColorEditable key={i} elementKey={`componentes.icon-l-${i}`} defaultBg={resolveDefaultBg(b.iconBg)}>
                      {(styles, openPicker, currentHex) => (
                        <div className="flex flex-col items-center gap-1">
                          <span
                            onClick={openPicker}
                            className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-nxt-lg ${b.bg} ${b.text} ring-1 ${b.ring} cursor-pointer transition-all duration-300 select-none ${activeBadges.has(badgeId) ? "opacity-100 scale-100" : "opacity-50 scale-95"}`}
                          >
                            <span className={`w-5 h-5 rounded-full ${b.iconBg} flex items-center justify-center`} style={styles}>
                              <b.icon className="w-3 h-3 text-white" />
                            </span>
                            {b.label}
                          </span>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                        </div>
                      )}
                    </ColorEditable>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-2 sm:gap-3">
                {[
                  { icon: Wifi, label: "Conectado", iconBg: "bg-green-400" },
                  { icon: WifiOff, label: "Sin red", iconBg: "bg-red-400" },
                  { icon: Cloud, label: "En la nube", iconBg: "bg-blue-400" },
                  { icon: CloudOff, label: "Offline", iconBg: "bg-gray-500" },
                  { icon: Lock, label: "Protegido", iconBg: "bg-green-400" },
                  { icon: Unlock, label: "Abierto", iconBg: "bg-amber-400" },
                  { icon: BellRing, label: "Alerta", iconBg: "bg-red-400" },
                  { icon: BellOff, label: "Silenciado", iconBg: "bg-gray-500" },
                ].map((b, i) => (
                  <ColorEditable key={i} elementKey={`componentes.icon-g-${i}`} defaultBg={resolveDefaultBg(b.iconBg)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-nxt-lg bg-white/30 text-white ring-1 ring-white/30 cursor-pointer transition-all duration-300 select-none"
                        >
                          <span className={`w-5 h-5 rounded-full ${b.iconBg} flex items-center justify-center`} style={styles}>
                            <b.icon className="w-3 h-3 text-white" />
                          </span>
                          {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { icon: Wifi, label: "Conectado", iconBg: "bg-green-500", bg: "bg-green-500/10", ring: "ring-green-500/30", text: "text-green-400" },
                  { icon: WifiOff, label: "Sin red", iconBg: "bg-red-500", bg: "bg-red-500/10", ring: "ring-red-500/30", text: "text-red-400" },
                  { icon: Cloud, label: "En la nube", iconBg: "bg-blue-500", bg: "bg-blue-500/10", ring: "ring-blue-500/30", text: "text-blue-400" },
                  { icon: CloudOff, label: "Offline", iconBg: "bg-[#5B7065]", bg: "bg-[#1A3036]", ring: "ring-[#5B7065]", text: "text-gray-400" },
                  { icon: Lock, label: "Protegido", iconBg: "bg-green-500", bg: "bg-green-500/10", ring: "ring-green-500/30", text: "text-green-400" },
                  { icon: Unlock, label: "Abierto", iconBg: "bg-amber-500", bg: "bg-amber-500/10", ring: "ring-amber-500/30", text: "text-amber-400" },
                  { icon: BellRing, label: "Alerta", iconBg: "bg-red-500", bg: "bg-red-500/10", ring: "ring-red-500/30", text: "text-red-400" },
                  { icon: BellOff, label: "Silenciado", iconBg: "bg-[#5B7065]", bg: "bg-[#1A3036]", ring: "ring-[#5B7065]", text: "text-gray-400" },
                ].map((b, i) => (
                  <ColorEditable key={i} elementKey={`componentes.icon-d-${i}`} defaultBg={resolveDefaultBg(b.iconBg)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-nxt-lg ${b.bg} ${b.text} ring-1 ${b.ring} cursor-pointer transition-all duration-300 select-none`}
                        >
                          <span className={`w-5 h-5 rounded-full ${b.iconBg} flex items-center justify-center`} style={styles}>
                            <b.icon className="w-3 h-3 text-white" />
                          </span>
                          {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pill + Tags */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Pill / Tags</h3>
          <p className="text-xs text-nxt-400 mb-4">Etiquetas redondeadas para categorias, versiones y ambientes.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { icon: Rocket, label: "Produccion", cls: "bg-success text-white" },
                  { icon: Globe, label: "Staging", cls: "bg-info text-white" },
                  { icon: Eye, label: "Preview", cls: "bg-warning text-white" },
                  { icon: Archive, label: "Draft", cls: "bg-nxt-600 text-white" },
                  { icon: Bug, label: "Beta", cls: "bg-purple-600 text-white" },
                  { icon: Star, label: "Nuevo", cls: "bg-forest text-white" },
                  { icon: Flame, label: "Hot", cls: "bg-rose-500 text-white" },
                  { icon: Tag, label: "v2.1.0", cls: "bg-cyan-600 text-white" },
                ].map((b, i) => {
                  const badgeId = `pill-${i}`;
                  return (
                    <ColorEditable key={i} elementKey={`componentes.pill-l-${i}`} defaultBg={resolveDefaultBg(b.cls)}>
                      {(styles, openPicker, currentHex) => (
                        <div className="flex flex-col items-center gap-1">
                          <span
                            onClick={openPicker}
                            className={`inline-flex items-center gap-1 px-3 py-0.5 text-xs font-semibold rounded-full ${b.cls} cursor-pointer transition-all duration-300 select-none ${activeBadges.has(badgeId) ? "opacity-100 scale-100" : "opacity-50 scale-95"}`}
                            style={styles}
                          >
                            <b.icon className="w-3 h-3" /> {b.label}
                          </span>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                        </div>
                      )}
                    </ColorEditable>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-2 sm:gap-3">
                {[
                  { icon: Rocket, label: "Produccion", cls: "bg-green-400 text-white" },
                  { icon: Globe, label: "Staging", cls: "bg-blue-400 text-white" },
                  { icon: Eye, label: "Preview", cls: "bg-amber-400 text-white" },
                  { icon: Archive, label: "Draft", cls: "bg-gray-500 text-white shadow-lg shadow-gray-500/30" },
                  { icon: Bug, label: "Beta", cls: "bg-purple-400 text-white" },
                  { icon: Star, label: "Nuevo", cls: "bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/40" },
                  { icon: Flame, label: "Hot", cls: "bg-rose-400 text-white" },
                  { icon: Tag, label: "v2.1.0", cls: "bg-cyan-400 text-white" },
                ].map((b, i) => (
                  <ColorEditable key={i} elementKey={`componentes.pill-g-${i}`} defaultBg={resolveDefaultBg(b.cls)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className={`inline-flex items-center gap-1 px-3 py-0.5 text-xs font-semibold rounded-full ${b.cls} cursor-pointer transition-all duration-300 select-none`}
                          style={styles}
                        >
                          <b.icon className="w-3 h-3" /> {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { icon: Rocket, label: "Produccion", cls: "bg-green-500/20 text-green-400 border border-green-500/30" },
                  { icon: Globe, label: "Staging", cls: "bg-blue-500/20 text-blue-400 border border-blue-500/30" },
                  { icon: Eye, label: "Preview", cls: "bg-amber-500/20 text-amber-400 border border-amber-500/30" },
                  { icon: Archive, label: "Draft", cls: "bg-evergreen text-gray-300 border border-pine" },
                  { icon: Bug, label: "Beta", cls: "bg-purple-500/20 text-purple-400 border border-purple-500/30" },
                  { icon: Star, label: "Nuevo", cls: "bg-pine/20 text-pine border border-pine/40" },
                  { icon: Flame, label: "Hot", cls: "bg-rose-500/20 text-rose-400 border border-rose-500/30" },
                  { icon: Tag, label: "v2.1.0", cls: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" },
                ].map((b, i) => (
                  <ColorEditable key={i} elementKey={`componentes.pill-d-${i}`} defaultBg={resolveDefaultBg(b.cls)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          onClick={openPicker}
                          className={`inline-flex items-center gap-1 px-3 py-0.5 text-xs font-semibold rounded-full ${b.cls} cursor-pointer transition-all duration-300 select-none`}
                          style={styles}
                        >
                          <b.icon className="w-3 h-3" /> {b.label}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Counter badges */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Contadores</h3>
          <p className="text-xs text-nxt-400 mb-4">Numero en circulo para notificaciones y alertas pendientes.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap items-center gap-4">
                <ColorEditable elementKey="componentes.cnt-l-mensajes" defaultBg={resolveDefaultBg("bg-info")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-nxt-700 cursor-pointer" onClick={openPicker}>
                        <Mail className="w-4 h-4" /> Mensajes <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-info text-white min-w-[20px] text-center" style={styles}>7</span>
                      </span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.cnt-l-alertas" defaultBg={resolveDefaultBg("bg-warning")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-nxt-700 cursor-pointer" onClick={openPicker}>
                        <Bell className="w-4 h-4" /> Alertas <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-warning text-white min-w-[20px] text-center" style={styles}>3</span>
                      </span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.cnt-l-bugs" defaultBg={resolveDefaultBg("bg-error")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-nxt-700 cursor-pointer" onClick={openPicker}>
                        <Bug className="w-4 h-4" /> Bugs <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-error text-white min-w-[20px] text-center" style={styles}>42</span>
                      </span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.cnt-l-updates" defaultBg={resolveDefaultBg("bg-success")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-nxt-700 cursor-pointer" onClick={openPicker}>
                        <Package className="w-4 h-4" /> Updates <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-success text-white min-w-[20px] text-center" style={styles}>99+</span>
                      </span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap items-center gap-4">
                <ColorEditable elementKey="componentes.cnt-g-mensajes" defaultBg={resolveDefaultBg("bg-blue-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-white cursor-pointer" onClick={openPicker}>
                        <Mail className="w-4 h-4" /> Mensajes <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-400 text-white min-w-[20px] text-center" style={styles}>7</span>
                      </span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.cnt-g-alertas" defaultBg={resolveDefaultBg("bg-amber-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-white cursor-pointer" onClick={openPicker}>
                        <Bell className="w-4 h-4" /> Alertas <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-400 text-white min-w-[20px] text-center" style={styles}>3</span>
                      </span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.cnt-g-bugs" defaultBg={resolveDefaultBg("bg-red-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-white cursor-pointer" onClick={openPicker}>
                        <Bug className="w-4 h-4" /> Bugs <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-400 text-white min-w-[20px] text-center" style={styles}>42</span>
                      </span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.cnt-g-updates" defaultBg={resolveDefaultBg("bg-green-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-white cursor-pointer" onClick={openPicker}>
                        <Package className="w-4 h-4" /> Updates <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-400 text-white min-w-[20px] text-center" style={styles}>99+</span>
                      </span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap items-center gap-4">
                <ColorEditable elementKey="componentes.cnt-d-mensajes" defaultBg={resolveDefaultBg("bg-blue-500")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer" onClick={openPicker}>
                        <Mail className="w-4 h-4" /> Mensajes <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-500 text-white min-w-[20px] text-center" style={styles}>7</span>
                      </span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.cnt-d-alertas" defaultBg={resolveDefaultBg("bg-amber-500")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer" onClick={openPicker}>
                        <Bell className="w-4 h-4" /> Alertas <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-white min-w-[20px] text-center" style={styles}>3</span>
                      </span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.cnt-d-bugs" defaultBg={resolveDefaultBg("bg-red-500")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer" onClick={openPicker}>
                        <Bug className="w-4 h-4" /> Bugs <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white min-w-[20px] text-center" style={styles}>42</span>
                      </span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.cnt-d-updates" defaultBg={resolveDefaultBg("bg-green-500")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer" onClick={openPicker}>
                        <Package className="w-4 h-4" /> Updates <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-green-500 text-white min-w-[20px] text-center" style={styles}>99+</span>
                      </span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
        </div>

        {/* Semaforo live */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Semaforo live</h3>
          <p className="text-xs text-nxt-400 mb-4">Indicador con animacion ping para estado en tiempo real.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-3">
                <ColorEditable elementKey="componentes.sem-l-online" defaultBg={resolveDefaultBg("bg-success")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-nxt-lg bg-success-light border border-success-border cursor-pointer" onClick={openPicker}>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-success" style={styles} />
                        </span>
                        <span className="text-sm font-semibold text-success">ONLINE</span>
                      </div>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.sem-l-degradado" defaultBg={resolveDefaultBg("bg-warning")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-nxt-lg bg-warning-light border border-warning-border cursor-pointer" onClick={openPicker}>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-warning" style={styles} />
                        </span>
                        <span className="text-sm font-semibold text-warning">DEGRADADO</span>
                      </div>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.sem-l-offline" defaultBg={resolveDefaultBg("bg-error")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-nxt-lg bg-error-light border border-error-border cursor-pointer" onClick={openPicker}>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-error" style={styles} />
                        </span>
                        <span className="text-sm font-semibold text-error">OFFLINE</span>
                      </div>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-3">
                <ColorEditable elementKey="componentes.sem-g-online" defaultBg={resolveDefaultBg("bg-green-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-nxt-lg bg-white/30 border border-white/30 cursor-pointer" onClick={openPicker}>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" style={styles} />
                        </span>
                        <span className="text-sm font-semibold text-green-400">ONLINE</span>
                      </div>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.sem-g-degradado" defaultBg={resolveDefaultBg("bg-amber-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-nxt-lg bg-white/30 border border-white/30 cursor-pointer" onClick={openPicker}>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" style={styles} />
                        </span>
                        <span className="text-sm font-semibold text-amber-400">DEGRADADO</span>
                      </div>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.sem-g-offline" defaultBg={resolveDefaultBg("bg-red-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-nxt-lg bg-white/30 border border-white/30 cursor-pointer" onClick={openPicker}>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400" style={styles} />
                        </span>
                        <span className="text-sm font-semibold text-red-400">OFFLINE</span>
                      </div>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-3">
                <ColorEditable elementKey="componentes.sem-d-online" defaultBg={resolveDefaultBg("bg-green-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-nxt-lg bg-green-500/15 border border-green-500/30 cursor-pointer" onClick={openPicker}>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" style={styles} />
                        </span>
                        <span className="text-sm font-semibold text-green-400">ONLINE</span>
                      </div>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.sem-d-degradado" defaultBg={resolveDefaultBg("bg-amber-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-nxt-lg bg-amber-500/15 border border-amber-500/30 cursor-pointer" onClick={openPicker}>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" style={styles} />
                        </span>
                        <span className="text-sm font-semibold text-amber-400">DEGRADADO</span>
                      </div>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
                <ColorEditable elementKey="componentes.sem-d-offline" defaultBg={resolveDefaultBg("bg-red-400")}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-nxt-lg bg-red-500/15 border border-red-500/30 cursor-pointer" onClick={openPicker}>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-400" style={styles} />
                        </span>
                        <span className="text-sm font-semibold text-red-400">OFFLINE</span>
                      </div>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              </div>
            </div>
          </div>
        </div>

        {/* Status cards */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Status cards <span className="text-[10px] font-normal text-nxt-400">- click para seleccionar</span></h3>
          <p className="text-xs text-nxt-400 mb-4">Cards con gradiente de color para metricas de estado en light, gradiente y dark.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Online", value: "142", icon: CheckCircle, border: "border-success", bg: "bg-success-light", iconBg: "bg-success", iconColor: "text-success" },
                  { label: "Warning", value: "12", icon: AlertTriangle, border: "border-warning", bg: "bg-warning-light", iconBg: "bg-warning", iconColor: "text-warning" },
                  { label: "Critical", value: "3", icon: XCircle, border: "border-error", bg: "bg-error-light", iconBg: "bg-error", iconColor: "text-error" },
                  { label: "Unknown", value: "6", icon: CircleDot, border: "border-nxt-400", bg: "bg-nxt-200", iconBg: "bg-nxt-500", iconColor: "text-nxt-500" },
                ].map((s) => (
                  <ColorEditable key={s.label} elementKey={`componentes.status-l-${s.label.toLowerCase()}`} defaultBg={resolveDefaultBg(s.bg)}>
                    {(styles, openPicker, currentHex) => (
                      <div
                        onClick={openPicker}
                        className={`${s.bg} border-2 ${s.border} rounded-nxt-xl p-3 text-center transition-all duration-300 hover:shadow-md cursor-pointer ${
                          selectedCard === `light-${s.label}` ? "ring-2 ring-offset-2 ring-forest scale-105 shadow-lg" : ""
                        }`}
                        style={styles}
                      >
                        <div className={`w-8 h-8 rounded-full ${s.iconBg} flex items-center justify-center mx-auto mb-1`}>
                          <s.icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xl font-bold text-nxt-900 tabular-nums">{s.value}</p>
                        <p className="text-[10px] font-medium text-nxt-600 mt-0.5">{s.label}</p>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 grid grid-cols-2 gap-3">
                {[
                  { label: "Online", value: "142", icon: CheckCircle, gradient: "from-emerald-500 via-green-500 to-teal-500" },
                  { label: "Warning", value: "12", icon: AlertTriangle, gradient: "from-amber-500 via-yellow-500 to-orange-400" },
                  { label: "Critical", value: "3", icon: XCircle, gradient: "from-red-500 via-rose-500 to-pink-500" },
                  { label: "Info", value: "28", icon: Info, gradient: "from-blue-500 via-indigo-500 to-cyan-500" },
                ].map((s) => (
                  <ColorEditable key={s.label} elementKey={`componentes.status-g-${s.label.toLowerCase()}`} defaultBg={resolveDefaultBg(`bg-gradient-to-br ${s.gradient}`)}>
                    {(styles, openPicker, currentHex) => (
                      <div
                        onClick={openPicker}
                        className={`bg-gradient-to-br ${s.gradient} rounded-nxt-xl p-3 text-white text-center relative overflow-hidden cursor-pointer transition-all duration-300 ${
                          selectedCard === `grad-${s.label}` ? "ring-2 ring-offset-2 ring-white scale-105 shadow-lg" : ""
                        }`}
                        style={styles}
                      >
                        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white/10 pointer-events-none" />
                        <div className="relative z-10">
                          <div className="w-8 h-8 rounded-nxt-lg bg-white/20 flex items-center justify-center mx-auto mb-1">
                            <s.icon className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-xl font-bold tabular-nums">{s.value}</p>
                          <p className="text-[10px] text-white/70 font-medium mt-0.5">{s.label}</p>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                        </div>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Online", value: "142", icon: CheckCircle, iconBg: "bg-green-500/20", iconColor: "text-green-400", valueColor: "text-green-400" },
                  { label: "Warning", value: "12", icon: AlertTriangle, iconBg: "bg-amber-500/20", iconColor: "text-amber-400", valueColor: "text-amber-400" },
                  { label: "Critical", value: "3", icon: XCircle, iconBg: "bg-red-500/20", iconColor: "text-red-400", valueColor: "text-red-400" },
                  { label: "Info", value: "28", icon: Info, iconBg: "bg-blue-500/20", iconColor: "text-blue-400", valueColor: "text-blue-400" },
                ].map((s) => (
                  <ColorEditable key={s.label} elementKey={`componentes.status-d-${s.label.toLowerCase()}`} defaultBg={resolveDefaultBg(s.iconBg)}>
                    {(styles, openPicker, currentHex) => (
                      <div
                        onClick={openPicker}
                        className={`bg-bark border border-evergreen rounded-nxt-xl p-3 text-center cursor-pointer transition-all duration-300 ${
                          selectedCard === `dark-${s.label}` ? "ring-2 ring-offset-2 ring-forest ring-offset-forest scale-105 shadow-lg" : ""
                        }`}
                        style={styles}
                      >
                        <div className={`w-8 h-8 rounded-full ${s.iconBg} flex items-center justify-center mx-auto mb-1`}>
                          <s.icon className={`w-4 h-4 ${s.iconColor}`} />
                        </div>
                        <p className={`text-xl font-bold ${s.valueColor} tabular-nums`}>{s.value}</p>
                        <p className="text-[10px] font-medium text-gray-500 mt-0.5">{s.label}</p>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Service health Ã¢â‚¬â€ wider row since it has table-like content */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Service health <span className="text-[10px] font-normal text-nxt-400">- click para expandir detalles</span></h3>
          <p className="text-xs text-nxt-400 mb-4">Tabla de servicios con latencia y estado de salud.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="border border-nxt-200 rounded-nxt-xl overflow-hidden divide-y divide-nxt-100 h-full">
              {[
                { name: "API Gateway", status: "Healthy", latency: "12ms", icon: Globe, dot: "bg-success", badge: "bg-success text-white", uptime: "99.99%", lastIncident: "Hace 45 dias", responseP95: "18ms", requests: "1.2M/dia" },
                { name: "Auth Service", status: "Healthy", latency: "8ms", icon: Lock, dot: "bg-success", badge: "bg-success text-white", uptime: "99.95%", lastIncident: "Hace 12 dias", responseP95: "15ms", requests: "800K/dia" },
                { name: "PostgreSQL", status: "Healthy", latency: "5ms", icon: Database, dot: "bg-success", badge: "bg-success text-white", uptime: "99.99%", lastIncident: "Hace 90 dias", responseP95: "8ms", requests: "2.5M/dia" },
                { name: "Redis Cache", status: "Degraded", latency: "145ms", icon: Zap, dot: "bg-warning", badge: "bg-warning text-white", uptime: "98.50%", lastIncident: "Hace 2 horas", responseP95: "200ms", requests: "5M/dia" },
                { name: "Worker Queue", status: "Offline", latency: "---", icon: Cpu, dot: "bg-error", badge: "bg-error text-white", uptime: "95.20%", lastIncident: "Ahora mismo", responseP95: "---", requests: "0/dia" },
              ].map((svc) => (
                <ColorEditable key={svc.name} elementKey={`componentes.svc-l-${svc.name.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg(svc.badge)}>
                  {(styles, openPicker, currentHex) => (
                    <div>
                      <div
                        onClick={openPicker}
                        className="flex items-center justify-between px-4 py-3 hover:bg-nxt-50 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${svc.dot}`} />
                          <svc.icon className="w-4 h-4 text-nxt-500" />
                          <span className="text-sm font-medium text-nxt-800">{svc.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                          <span className="text-xs font-mono text-nxt-500">{svc.latency}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${svc.badge}`} style={styles}>{svc.status}</span>
                          <ChevronRight className={`w-4 h-4 text-nxt-400 transition-transform duration-300 ${expandedService === `light-${svc.name}` ? "rotate-90" : ""}`} />
                        </div>
                      </div>
                      <div className={`overflow-hidden transition-all duration-300 ${expandedService === `light-${svc.name}` ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className="px-4 pb-3 pt-1 bg-nxt-50 border-t border-nxt-100">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div><span className="text-nxt-500">Uptime:</span> <span className="font-semibold text-nxt-700">{svc.uptime}</span></div>
                            <div><span className="text-nxt-500">Ultimo incidente:</span> <span className="font-semibold text-nxt-700">{svc.lastIncident}</span></div>
                            <div><span className="text-nxt-500">P95 respuesta:</span> <span className="font-semibold text-nxt-700">{svc.responseP95}</span></div>
                            <div><span className="text-nxt-500">Requests:</span> <span className="font-semibold text-nxt-700">{svc.requests}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </ColorEditable>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl h-full overflow-hidden relative">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 divide-y divide-white/10">
                {[
                  { name: "API Gateway", status: "Healthy", latency: "12ms", icon: Globe, dot: "bg-green-400", badge: "bg-green-400 text-gray-900 shadow-md shadow-green-400/30" },
                  { name: "Auth Service", status: "Healthy", latency: "8ms", icon: Lock, dot: "bg-green-400", badge: "bg-green-400 text-gray-900 shadow-md shadow-green-400/30" },
                  { name: "PostgreSQL", status: "Healthy", latency: "5ms", icon: Database, dot: "bg-green-400", badge: "bg-green-400 text-gray-900 shadow-md shadow-green-400/30" },
                  { name: "Redis Cache", status: "Degraded", latency: "145ms", icon: Zap, dot: "bg-amber-400", badge: "bg-amber-400 text-gray-900 shadow-md shadow-amber-400/30" },
                  { name: "Worker Queue", status: "Offline", latency: "---", icon: Cpu, dot: "bg-red-400", badge: "bg-red-400 text-white shadow-md shadow-red-400/30" },
                ].map((svc) => (
                  <ColorEditable key={svc.name} elementKey={`componentes.svc-g-${svc.name.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg(svc.badge)}>
                    {(styles, openPicker, currentHex) => (
                      <div>
                        <div
                          onClick={openPicker}
                          className="flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full ${svc.dot}`} />
                            <svc.icon className="w-4 h-4 text-white/60" />
                            <span className="text-sm font-medium text-white">{svc.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                            <span className="text-xs font-mono text-white/50">{svc.latency}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${svc.badge}`} style={styles}>{svc.status}</span>
                            <ChevronRight className={`w-4 h-4 text-white/40 transition-transform duration-300 ${expandedService === `grad-${svc.name}` ? "rotate-90" : ""}`} />
                          </div>
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ${expandedService === `grad-${svc.name}` ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                          <div className="px-4 pb-3 pt-1 bg-white/5 border-t border-white/10">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div><span className="text-white/50">Uptime:</span> <span className="font-semibold text-white">{svc.uptime}</span></div>
                              <div><span className="text-white/50">Ultimo incidente:</span> <span className="font-semibold text-white">{svc.lastIncident}</span></div>
                              <div><span className="text-white/50">P95 respuesta:</span> <span className="font-semibold text-white">{svc.responseP95}</span></div>
                              <div><span className="text-white/50">Requests:</span> <span className="font-semibold text-white">{svc.requests}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl h-full overflow-hidden">
              <div className="divide-y divide-bark">
                {[
                  { name: "API Gateway", status: "Healthy", latency: "12ms", icon: Globe, dot: "bg-green-400", badge: "bg-green-500/20 text-green-400", uptime: "99.99%", lastIncident: "Hace 45 dias", responseP95: "18ms", requests: "1.2M/dia" },
                  { name: "Auth Service", status: "Healthy", latency: "8ms", icon: Lock, dot: "bg-green-400", badge: "bg-green-500/20 text-green-400", uptime: "99.95%", lastIncident: "Hace 12 dias", responseP95: "15ms", requests: "800K/dia" },
                  { name: "PostgreSQL", status: "Healthy", latency: "5ms", icon: Database, dot: "bg-green-400", badge: "bg-green-500/20 text-green-400", uptime: "99.99%", lastIncident: "Hace 90 dias", responseP95: "8ms", requests: "2.5M/dia" },
                  { name: "Redis Cache", status: "Degraded", latency: "145ms", icon: Zap, dot: "bg-amber-400", badge: "bg-amber-500/20 text-amber-400", uptime: "98.50%", lastIncident: "Hace 2 horas", responseP95: "200ms", requests: "5M/dia" },
                  { name: "Worker Queue", status: "Offline", latency: "---", icon: Cpu, dot: "bg-red-400", badge: "bg-red-500/20 text-red-400", uptime: "95.20%", lastIncident: "Ahora mismo", responseP95: "---", requests: "0/dia" },
                ].map((svc) => (
                  <ColorEditable key={svc.name} elementKey={`componentes.svc-d-${svc.name.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg(svc.badge)}>
                    {(styles, openPicker, currentHex) => (
                      <div>
                        <div
                          onClick={openPicker}
                          className="flex items-center justify-between px-4 py-3 hover:bg-bark transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full ${svc.dot}`} />
                            <svc.icon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-200">{svc.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                            <span className="text-xs font-mono text-gray-500">{svc.latency}</span>
                            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${svc.badge}`} style={styles}>{svc.status}</span>
                            <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${expandedService === `dark-${svc.name}` ? "rotate-90" : ""}`} />
                          </div>
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ${expandedService === `dark-${svc.name}` ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                          <div className="px-4 pb-3 pt-1 bg-bark border-t border-evergreen">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div><span className="text-gray-500">Uptime:</span> <span className="font-semibold text-gray-300">{svc.uptime}</span></div>
                              <div><span className="text-gray-500">Ultimo incidente:</span> <span className="font-semibold text-gray-300">{svc.lastIncident}</span></div>
                              <div><span className="text-gray-500">P95 respuesta:</span> <span className="font-semibold text-gray-300">{svc.responseP95}</span></div>
                              <div><span className="text-gray-500">Requests:</span> <span className="font-semibold text-gray-300">{svc.requests}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Infra status icons */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Infra status icons</h3>
          <p className="text-xs text-nxt-400 mb-4">Cards de estado de infraestructura con icono, nombre y status.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Database, label: "Database", status: "online", bg: "bg-success-light", iconBg: "bg-success", dot: "bg-success", text: "text-success" },
                  { icon: Server, label: "API", status: "online", bg: "bg-success-light", iconBg: "bg-success", dot: "bg-success", text: "text-success" },
                  { icon: HardDrive, label: "Storage", status: "warning", bg: "bg-warning-light", iconBg: "bg-warning", dot: "bg-warning", text: "text-warning" },
                  { icon: Cpu, label: "CPU", status: "high", bg: "bg-error-light", iconBg: "bg-error", dot: "bg-error", text: "text-error" },
                  { icon: Globe, label: "CDN", status: "online", bg: "bg-success-light", iconBg: "bg-success", dot: "bg-success", text: "text-success" },
                  { icon: Shield, label: "Firewall", status: "active", bg: "bg-info-light", iconBg: "bg-info", dot: "bg-info", text: "text-info" },
                ].map((item) => (
                  <ColorEditable key={item.label} elementKey={`componentes.infra-l-${item.label.toLowerCase()}`} defaultBg={resolveDefaultBg(item.iconBg)}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className={`${item.bg} rounded-nxt-lg p-2.5 flex flex-col items-center gap-1.5 transition-all duration-200 hover:shadow-md cursor-pointer active:scale-95`}>
                        <div className={`w-8 h-8 rounded-nxt-md ${item.iconBg} flex items-center justify-center`} style={styles}>
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-semibold text-nxt-800">{item.label}</span>
                        <span className={`inline-flex items-center gap-1 text-[9px] font-semibold ${item.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} /> {item.status}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 grid grid-cols-3 gap-2">
                {[
                  { icon: Database, label: "Database", status: "online", iconBg: "bg-green-400", dot: "bg-green-400", text: "text-green-300" },
                  { icon: Server, label: "API", status: "online", iconBg: "bg-green-400", dot: "bg-green-400", text: "text-green-300" },
                  { icon: HardDrive, label: "Storage", status: "warning", iconBg: "bg-amber-400", dot: "bg-amber-400", text: "text-amber-300" },
                  { icon: Cpu, label: "CPU", status: "high", iconBg: "bg-red-400", dot: "bg-red-400", text: "text-red-300" },
                  { icon: Globe, label: "CDN", status: "online", iconBg: "bg-green-400", dot: "bg-green-400", text: "text-green-300" },
                  { icon: Shield, label: "Firewall", status: "active", iconBg: "bg-blue-400", dot: "bg-blue-400", text: "text-blue-300" },
                ].map((item) => (
                  <ColorEditable key={item.label} elementKey={`componentes.infra-g-${item.label.toLowerCase()}`} defaultBg={resolveDefaultBg(item.iconBg)}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className="bg-white/15 rounded-nxt-lg p-2.5 flex flex-col items-center gap-1.5 transition-all duration-200 hover:bg-white/25 cursor-pointer active:scale-95">
                        <div className={`w-8 h-8 rounded-nxt-md ${item.iconBg} flex items-center justify-center shadow-md shadow-${item.iconBg}/30`} style={styles}>
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-semibold text-white">{item.label}</span>
                        <span className={`inline-flex items-center gap-1 text-[9px] font-semibold ${item.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} /> {item.status}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: Database, label: "Database", status: "online", iconBg: "bg-green-500", dot: "bg-green-400", text: "text-green-400" },
                  { icon: Server, label: "API", status: "online", iconBg: "bg-green-500", dot: "bg-green-400", text: "text-green-400" },
                  { icon: HardDrive, label: "Storage", status: "warning", iconBg: "bg-amber-500", dot: "bg-amber-400", text: "text-amber-400" },
                  { icon: Cpu, label: "CPU", status: "high", iconBg: "bg-red-500", dot: "bg-red-400", text: "text-red-400" },
                  { icon: Globe, label: "CDN", status: "online", iconBg: "bg-green-500", dot: "bg-green-400", text: "text-green-400" },
                  { icon: Shield, label: "Firewall", status: "active", iconBg: "bg-blue-500", dot: "bg-blue-400", text: "text-blue-400" },
                ].map((item) => (
                  <ColorEditable key={item.label} elementKey={`componentes.infra-d-${item.label.toLowerCase()}`} defaultBg={resolveDefaultBg(item.iconBg)}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className="bg-bark border border-evergreen rounded-nxt-lg p-2.5 flex flex-col items-center gap-1.5 transition-all duration-200 hover:border-pine cursor-pointer active:scale-95">
                        <div className={`w-8 h-8 rounded-nxt-md ${item.iconBg} flex items-center justify-center`} style={styles}>
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-semibold text-gray-200">{item.label}</span>
                        <span className={`inline-flex items-center gap-1 text-[9px] font-semibold ${item.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} /> {item.status}
                        </span>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      {/* 2.5 ICONOS                                                    */}
      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      <Section id="iconos" title="Iconos" description="Libreria de iconos Lucide usados en el design system. Tamanos, colores, con fondo circular, con badge y en contexto de UI. Click en un icono del catalogo para ver detalles.">

          {/* Tamanos */}
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Tamanos</h3>
          <p className="text-xs text-nxt-400 mb-4">Cinco tamanos de icono: 12px, 16px, 20px, 24px y 32px.</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
              <div className="nxt-card p-4 h-full">
                <div className="flex flex-wrap items-end gap-4">
                  {[
                    { size: "w-3 h-3", label: "12px (xs)" },
                    { size: "w-4 h-4", label: "16px (sm)" },
                    { size: "w-5 h-5", label: "20px (md)" },
                    { size: "w-6 h-6", label: "24px (lg)" },
                    { size: "w-8 h-8", label: "32px (xl)" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col items-center gap-1">
                      <Activity className={`${s.size} text-nxt-700`} />
                      <span className="text-[10px] text-nxt-400">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
              <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                <div className="relative z-10 flex flex-wrap items-end gap-4">
                  {[
                    { size: "w-3 h-3", label: "12px (xs)" },
                    { size: "w-4 h-4", label: "16px (sm)" },
                    { size: "w-5 h-5", label: "20px (md)" },
                    { size: "w-6 h-6", label: "24px (lg)" },
                    { size: "w-8 h-8", label: "32px (xl)" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col items-center gap-1">
                      <Activity className={`${s.size} text-white`} />
                      <span className="text-[10px] text-white/60">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
              <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
                <div className="flex flex-wrap items-end gap-4">
                  {[
                    { size: "w-3 h-3", label: "12px (xs)" },
                    { size: "w-4 h-4", label: "16px (sm)" },
                    { size: "w-5 h-5", label: "20px (md)" },
                    { size: "w-6 h-6", label: "24px (lg)" },
                    { size: "w-8 h-8", label: "32px (xl)" },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col items-center gap-1">
                      <Activity className={`${s.size} text-gray-300`} />
                      <span className="text-[10px] text-gray-500">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Colores */}
          <div className="border-t border-nxt-200 pt-6 mt-6">
            <h3 className="text-sm font-semibold text-nxt-700 mb-1">Colores</h3>
            <p className="text-xs text-nxt-400 mb-4">Paleta de colores aplicados a iconos: default, primary, estados y muted.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
              <div className="nxt-card p-4 h-full">
                <div className="flex flex-wrap gap-3">
                  {[
                    { color: "text-nxt-900", label: "Default" },
                    { color: "text-forest", label: "Primary" },
                    { color: "text-success", label: "Success" },
                    { color: "text-warning", label: "Warning" },
                    { color: "text-error", label: "Error" },
                    { color: "text-info", label: "Info" },
                    { color: "text-nxt-400", label: "Muted" },
                  ].map((c) => (
                    <div key={c.label} className="flex flex-col items-center gap-1">
                      <Shield className={`w-5 h-5 ${c.color}`} />
                      <span className="text-[10px] text-nxt-400">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
              <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                <div className="relative z-10 flex flex-wrap gap-3">
                  {[
                    { color: "text-white", label: "Default" },
                    { color: "text-primary-light", label: "Primary" },
                    { color: "text-green-400", label: "Success" },
                    { color: "text-amber-400", label: "Warning" },
                    { color: "text-red-400", label: "Error" },
                    { color: "text-blue-300", label: "Info" },
                    { color: "text-white/40", label: "Muted" },
                  ].map((c) => (
                    <div key={c.label} className="flex flex-col items-center gap-1">
                      <Shield className={`w-5 h-5 ${c.color}`} />
                      <span className="text-[10px] text-white/60">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
              <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
                <div className="flex flex-wrap gap-3">
                  {[
                    { color: "text-gray-200", label: "Default" },
                    { color: "text-primary-light", label: "Primary" },
                    { color: "text-green-400", label: "Success" },
                    { color: "text-amber-400", label: "Warning" },
                    { color: "text-red-400", label: "Error" },
                    { color: "text-blue-400", label: "Info" },
                    { color: "text-gray-600", label: "Muted" },
                  ].map((c) => (
                    <div key={c.label} className="flex flex-col items-center gap-1">
                      <Shield className={`w-5 h-5 ${c.color}`} />
                      <span className="text-[10px] text-gray-500">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Con fondo (icon containers) */}
          <div className="border-t border-nxt-200 pt-6 mt-6">
            <h3 className="text-sm font-semibold text-nxt-700 mb-1">Con fondo (containers)</h3>
            <p className="text-xs text-nxt-400 mb-4">Iconos dentro de contenedores con fondo solido, light o circular.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
              <div className="nxt-card p-4 h-full">
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Database, bg: "bg-info", lightBg: "bg-info-light", color: "text-info" },
                    { icon: Server, bg: "bg-success", lightBg: "bg-success-light", color: "text-success" },
                    { icon: Shield, bg: "bg-warning", lightBg: "bg-warning-light", color: "text-warning" },
                    { icon: Bug, bg: "bg-error", lightBg: "bg-error-light", color: "text-error" },
                    { icon: Zap, bg: "bg-forest", lightBg: "bg-pine/30", color: "text-forest" },
                    { icon: Settings, bg: "bg-nxt-600", lightBg: "bg-nxt-200", color: "text-nxt-600" },
                  ].map((item, i) => (
                    <ColorEditable key={i} elementKey={`componentes.icont-l-${i}`} defaultBg={resolveDefaultBg(item.bg)}>
                      {(styles, openPicker, currentHex) => (
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={openPicker}>
                            <div className={`w-9 h-9 rounded-nxt-lg ${item.bg} flex items-center justify-center`} style={styles}>
                              <item.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className={`w-9 h-9 rounded-nxt-lg ${item.lightBg} flex items-center justify-center`}>
                              <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center`} style={styles}>
                              <item.icon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                        </div>
                      )}
                    </ColorEditable>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
              <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                <div className="relative z-10 flex flex-wrap gap-3">
                  {[
                    { icon: Database, bg: "bg-white/30" },
                    { icon: Server, bg: "bg-white/30" },
                    { icon: Shield, bg: "bg-white/30" },
                    { icon: Bug, bg: "bg-white/30" },
                    { icon: Zap, bg: "bg-white/30" },
                    { icon: Settings, bg: "bg-white/30" },
                  ].map((item, i) => (
                    <ColorEditable key={i} elementKey={`componentes.icont-g-${i}`} defaultBg={resolveDefaultBg(item.bg)}>
                      {(styles, openPicker, currentHex) => (
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={openPicker}>
                            <div className={`w-9 h-9 rounded-nxt-lg ${item.bg} border border-white/20 flex items-center justify-center`} style={styles}>
                              <item.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="w-9 h-9 rounded-nxt-lg bg-white/20 flex items-center justify-center">
                              <item.icon className="w-5 h-5 text-white/80" />
                            </div>
                            <div className={`w-9 h-9 rounded-full ${item.bg} border border-white/20 flex items-center justify-center`} style={styles}>
                              <item.icon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                        </div>
                      )}
                    </ColorEditable>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
              <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: Database, bg: "bg-blue-500", dimBg: "bg-blue-500/15", color: "text-blue-400" },
                    { icon: Server, bg: "bg-green-500", dimBg: "bg-green-500/15", color: "text-green-400" },
                    { icon: Shield, bg: "bg-amber-500", dimBg: "bg-amber-500/15", color: "text-amber-400" },
                    { icon: Bug, bg: "bg-red-500", dimBg: "bg-red-500/15", color: "text-red-400" },
                    { icon: Zap, bg: "bg-pine", dimBg: "bg-pine/15", color: "text-pine" },
                    { icon: Settings, bg: "bg-[#5B7065]", dimBg: "bg-[#304040]", color: "text-gray-400" },
                  ].map((item, i) => (
                    <ColorEditable key={i} elementKey={`componentes.icont-d-${i}`} defaultBg={resolveDefaultBg(item.bg)}>
                      {(styles, openPicker, currentHex) => (
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={openPicker}>
                            <div className={`w-9 h-9 rounded-nxt-lg ${item.bg} flex items-center justify-center`} style={styles}>
                              <item.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className={`w-9 h-9 rounded-nxt-lg ${item.dimBg} flex items-center justify-center`}>
                              <item.icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <div className={`w-9 h-9 rounded-full ${item.bg} flex items-center justify-center`} style={styles}>
                              <item.icon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                        </div>
                      )}
                    </ColorEditable>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Catalogo completo Ã¢â‚¬â€ wide row (too large for 3 cols) */}
          <div className="border-t border-nxt-200 pt-6 mt-6">
            <h3 className="text-sm font-semibold text-nxt-700 mb-1">Catalogo (infraestructura, comunicacion, acciones)</h3>
            <p className="text-xs text-nxt-400 mb-4">Todos los iconos Lucide del design system. Click para ver detalles.</p>
          </div>
          <div className="nxt-card p-4 sm:p-6 mb-8">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {[
                { icon: Database, name: "Database" }, { icon: Server, name: "Server" }, { icon: HardDrive, name: "HardDrive" },
                { icon: Cpu, name: "Cpu" }, { icon: MemoryStick, name: "Memory" }, { icon: Globe, name: "Globe" },
                { icon: Cloud, name: "Cloud" }, { icon: CloudOff, name: "CloudOff" }, { icon: Wifi, name: "Wifi" },
                { icon: WifiOff, name: "WifiOff" }, { icon: Shield, name: "Shield" }, { icon: Lock, name: "Lock" },
                { icon: Unlock, name: "Unlock" }, { icon: Activity, name: "Activity" }, { icon: Zap, name: "Zap" },
                { icon: Bell, name: "Bell" }, { icon: BellRing, name: "BellRing" }, { icon: BellOff, name: "BellOff" },
                { icon: Mail, name: "Mail" }, { icon: MailOpen, name: "MailOpen" }, { icon: Send, name: "Send" },
                { icon: MessageSquare, name: "Message" }, { icon: PhoneCall, name: "PhoneCall" }, { icon: PhoneOff, name: "PhoneOff" },
                { icon: UserCheck, name: "UserCheck" }, { icon: UserX, name: "UserX" }, { icon: CheckCircle, name: "Check" },
                { icon: XCircle, name: "XCircle" }, { icon: AlertTriangle, name: "Alert" }, { icon: Info, name: "Info" },
                { icon: Bug, name: "Bug" }, { icon: Wrench, name: "Wrench" }, { icon: Settings, name: "Settings" },
                { icon: Package, name: "Package" }, { icon: Rocket, name: "Rocket" }, { icon: Flame, name: "Flame" },
                { icon: Heart, name: "Heart" }, { icon: Star, name: "Star" }, { icon: Bookmark, name: "Bookmark" },
                { icon: Tag, name: "Tag" }, { icon: FileCheck, name: "FileCheck" }, { icon: FileWarning, name: "FileWarn" },
                { icon: FileX, name: "FileX" }, { icon: Download, name: "Download" }, { icon: RefreshCw, name: "Refresh" },
                { icon: Eye, name: "Eye" }, { icon: Trash2, name: "Trash" }, { icon: Plus, name: "Plus" },
                { icon: Play, name: "Play" }, { icon: Pause, name: "Pause" }, { icon: Square, name: "Stop" },
                { icon: Timer, name: "Timer" }, { icon: Clock, name: "Clock" }, { icon: CalendarCheck, name: "CalCheck" },
                { icon: Archive, name: "Archive" }, { icon: Milestone, name: "Milestone" }, { icon: Battery, name: "Battery" },
                { icon: BatteryCharging, name: "Charging" }, { icon: BatteryFull, name: "BatFull" },
                { icon: Volume2, name: "Volume" }, { icon: VolumeX, name: "Mute" },
                { icon: TrendingUp, name: "TrendUp" }, { icon: TrendingDown, name: "TrendDown" },
              ].map((item) => (
                <div
                  key={item.name}
                  onClick={() => setSelectedIcon(selectedIcon === item.name ? null : item.name)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-nxt-md transition-all duration-200 cursor-pointer ${
                    selectedIcon === item.name
                      ? "bg-forest/20 ring-2 ring-forest shadow-md"
                      : "hover:bg-nxt-100"
                  }`}
                  title={item.name}
                >
                  <item.icon className={`w-5 h-5 ${selectedIcon === item.name ? "text-forest" : "text-nxt-700"}`} />
                  <span className="text-[9px] text-nxt-400 truncate w-full text-center">{item.name}</span>
                </div>
              ))}
            </div>
            {/* Selected icon info bar */}
            <div className={`mt-3 overflow-hidden transition-all duration-300 ${selectedIcon ? "max-h-16 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="flex items-center gap-3 px-4 py-2 rounded-nxt-lg bg-forest/10 border border-forest/30">
                <span className="text-sm font-semibold text-nxt-800">Seleccionado:</span>
                <span className="text-sm font-mono text-forest">{selectedIcon}</span>
                <span className="text-xs text-nxt-500 ml-2">Clase: <code className="bg-nxt-100 px-1.5 py-0.5 rounded text-[11px]">lucide-react/{selectedIcon}</code></span>
              </div>
            </div>
          </div>

          {/* Iconos en contexto */}
          <div className="border-t border-nxt-200 pt-6 mt-6">
            <h3 className="text-sm font-semibold text-nxt-700 mb-1">En contexto de UI</h3>
            <p className="text-xs text-nxt-400 mb-4">Iconos usados dentro de elementos de navegacion, alertas y menus.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Light */}
            <div>
              <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
              <div className="nxt-card p-4 h-full">
                <div className="space-y-3">
                  {[
                    { id: "ctx-l-mon", icon: Activity, title: "Monitoreo", desc: "Estado de red y alertas", iconColor: "text-info", type: "nav" },
                    { id: "ctx-l-cert", icon: AlertTriangle, title: "Certificado por expirar", desc: "El SSL vence en 7 dias", iconColor: "text-warning", type: "alert" },
                    { id: "ctx-l-user", icon: null, title: "S. Hernandez", desc: "shernandez@iagentek.com", iconColor: "", type: "user" },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCtx(selectedCtx === item.id ? null : item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-nxt-lg cursor-pointer transition-all duration-300 active:scale-[0.98] ${
                        "bg-nxt-50 border border-nxt-200 hover:bg-nxt-100"
                      } ${selectedCtx === item.id ? "!bg-forest/20 !border-forest ring-2 ring-forest ring-offset-2 scale-[1.02]" : ""}`}
                    >
                      {item.type === "user" ? (
                        <div className="w-9 h-9 rounded-full bg-forest flex items-center justify-center"><span className="text-sm font-bold text-nxt-700">SH</span></div>
                      ) : (
                        <item.icon className={`w-5 h-5 ${item.iconColor} flex-shrink-0`} />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${item.type === "alert" ? "text-warning" : "text-nxt-800"}`}>{item.title}</p>
                        <p className={`text-xs ${item.type === "alert" ? "text-nxt-600" : "text-nxt-500"}`}>{item.desc}</p>
                      </div>
                      {item.type !== "alert" && <ChevronRight className={`w-4 h-4 text-nxt-400 transition-transform duration-300 ${selectedCtx === item.id ? "rotate-90" : ""}`} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Gradiente */}
            <div>
              <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
              <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  {[
                    { id: "ctx-g-mon", icon: Activity, title: "Monitoreo", desc: "Estado de red y alertas", iconColor: "text-cyan-300", type: "nav" },
                    { id: "ctx-g-cert", icon: AlertTriangle, title: "Certificado por expirar", desc: "El SSL vence en 7 dias", iconColor: "text-amber-400", type: "alert" },
                    { id: "ctx-g-user", icon: null, title: "S. Hernandez", desc: "shernandez@iagentek.com", iconColor: "", type: "user" },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCtx(selectedCtx === item.id ? null : item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-nxt-lg cursor-pointer transition-all duration-300 active:scale-[0.98] ${
                        "bg-white/20 border border-white/20 hover:bg-white/30"
                      } ${selectedCtx === item.id ? "!bg-white/30 !border-white/60 ring-2 ring-white/60 ring-offset-2 ring-offset-slate-700 scale-[1.02]" : ""}`}
                    >
                      {item.type === "user" ? (
                        <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center"><span className="text-sm font-bold text-white">SH</span></div>
                      ) : (
                        <item.icon className={`w-5 h-5 ${item.iconColor} flex-shrink-0`} />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${item.type === "alert" ? "text-amber-300" : "text-white"}`}>{item.title}</p>
                        <p className="text-xs text-white/60">{item.desc}</p>
                      </div>
                      {item.type !== "alert" && <ChevronRight className={`w-4 h-4 text-white/40 transition-transform duration-300 ${selectedCtx === item.id ? "rotate-90" : ""}`} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Dark */}
            <div>
              <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
              <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
                <div className="space-y-3">
                  {[
                    { id: "ctx-d-mon", icon: Activity, title: "Monitoreo", desc: "Estado de red y alertas", iconColor: "text-blue-400", type: "nav" },
                    { id: "ctx-d-cert", icon: AlertTriangle, title: "Certificado por expirar", desc: "El SSL vence en 7 dias", iconColor: "text-amber-400", type: "alert" },
                    { id: "ctx-d-user", icon: null, title: "S. Hernandez", desc: "shernandez@iagentek.com", iconColor: "", type: "user" },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedCtx(selectedCtx === item.id ? null : item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-nxt-lg cursor-pointer transition-all duration-300 active:scale-[0.98] ${
                        "bg-bark border border-evergreen hover:bg-evergreen"
                      } ${selectedCtx === item.id ? "!bg-pine/15 !border-pine ring-2 ring-pine ring-offset-2 ring-offset-surface-darkest scale-[1.02]" : ""}`}
                    >
                      {item.type === "user" ? (
                        <div className="w-9 h-9 rounded-full bg-pine flex items-center justify-center"><span className="text-sm font-bold text-white">SH</span></div>
                      ) : (
                        <item.icon className={`w-5 h-5 ${item.iconColor} flex-shrink-0`} />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${item.type === "alert" ? "text-amber-400" : "text-gray-200"}`}>{item.title}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      {item.type !== "alert" && <ChevronRight className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${selectedCtx === item.id ? "rotate-90" : ""}`} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </Section>

      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      {/* 3. CARDS                                                      */}
      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      <Section id="cards" title="Cards" description="Contenedor principal de informacion. Variantes inspiradas en Apollo: KPI strip, acceso rapido con gradientes, estado de sistema, basicas e interactivas.">

        {/* -- KPI STRIP (Apollo Dashboard top) -- */}
        <h3 className="text-sm font-semibold text-nxt-700 mb-1">KPI Strip (Apollo)</h3>
        <p className="text-xs text-nxt-400 mb-4">Fila de metricas clave del dashboard principal de Apollo.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Centros de Carga", value: "11,623", icon: Server, color: "#2563EB" },
                  { label: "Hosts Icinga", value: "7,604", icon: Activity, color: "#059669" },
                  { label: "Salud de Red", value: "46.7%", subtitle: "En linea", icon: Shield, color: "#059669" },
                  { label: "Tickets Abiertos", value: "54,794", icon: CircleDot, color: "#D97706" },
                ].map((m) => (
                  <ColorEditable key={m.label} elementKey={`componentes.kpi-l-${m.label.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={m.color}>
                    {(styles, openPicker, currentHex) => (
                      <div
                        onClick={openPicker}
                        className="bg-nxt-50 border border-nxt-200 rounded-nxt-xl p-3 cursor-pointer transition-all duration-200 hover:bg-nxt-100 hover:border-forest hover:shadow-md active:scale-95"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <m.icon style={{ color: m.color, ...styles }} className="w-4 h-4" />
                          <span className="text-[10px] font-medium text-nxt-500">{m.label}</span>
                        </div>
                        <p className="text-xl font-bold text-nxt-900 tabular-nums">{m.value}</p>
                        {m.subtitle && <p className="text-[10px] text-nxt-400 mt-0.5">{m.subtitle}</p>}
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 grid grid-cols-2 gap-3">
                {[
                  { label: "Centros de Carga", value: "11,623", icon: Server },
                  { label: "Hosts Icinga", value: "7,604", icon: Activity },
                  { label: "Salud de Red", value: "46.7%", subtitle: "En linea", icon: Shield },
                  { label: "Tickets Abiertos", value: "54,794", icon: CircleDot },
                ].map((m) => (
                  <ColorEditable key={m.label} elementKey={`componentes.kpi-g-${m.label.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={undefined}>
                    {(styles, openPicker, currentHex) => (
                      <div
                        onClick={openPicker}
                        className="bg-white/20 border border-white/20 rounded-nxt-xl p-3 cursor-pointer transition-all duration-200 hover:bg-white/30 active:scale-95"
                        style={styles}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <m.icon className="w-4 h-4 text-white/70" />
                          <span className="text-[10px] font-medium text-white/60">{m.label}</span>
                        </div>
                        <p className="text-xl font-bold text-white tabular-nums">{m.value}</p>
                        {m.subtitle && <p className="text-[10px] text-white/50 mt-0.5">{m.subtitle}</p>}
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Centros de Carga", value: "11,623", icon: Server, color: "text-blue-400" },
                  { label: "Hosts Icinga", value: "7,604", icon: Activity, color: "text-green-400" },
                  { label: "Salud de Red", value: "46.7%", subtitle: "En linea", icon: Shield, color: "text-emerald-400" },
                  { label: "Tickets Abiertos", value: "54,794", icon: CircleDot, color: "text-amber-400" },
                ].map((m) => (
                  <ColorEditable key={m.label} elementKey={`componentes.kpi-d-${m.label.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg(m.color)}>
                    {(styles, openPicker, currentHex) => (
                      <div
                        onClick={openPicker}
                        className="bg-bark border border-evergreen rounded-nxt-xl p-3 cursor-pointer transition-all duration-200 hover:bg-evergreen active:scale-95"
                        style={styles}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <m.icon className={`w-4 h-4 ${m.color}`} />
                          <span className="text-[10px] font-medium text-gray-500">{m.label}</span>
                        </div>
                        <p className="text-xl font-bold text-gray-200 tabular-nums">{m.value}</p>
                        {m.subtitle && <p className="text-[10px] text-gray-600 mt-0.5">{m.subtitle}</p>}
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* -- ACCESO RAPIDO -- Gradient cards (Apollo navigation) -- */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Acceso rapido Ã¢â‚¬â€ Gradientes (Apollo)</h3>
          <p className="text-xs text-nxt-400 mb-4">Cards de navegacion con gradiente, icono y descripcion para acceso rapido a modulos.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Mapa de Comunicacion", desc: "Centros de carga en tiempo real", icon: Activity, iconBg: "bg-info-light", iconColor: "text-info" },
                  { name: "Portabilidad", desc: "Metricas y cumplimiento", icon: TrendingUp, iconBg: "bg-success-light", iconColor: "text-success" },
                  { name: "Monitoreo", desc: "Estado de red y alertas", icon: Shield, iconBg: "bg-warning-light", iconColor: "text-warning" },
                  { name: "Flow Engine", desc: "Orquestacion de datos", icon: RefreshCw, iconBg: "bg-error-light", iconColor: "text-error" },
                ].map((card) => (
                  <ColorEditable key={card.name} elementKey={`componentes.card-l-${card.name.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg(card.iconBg)}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className="bg-nxt-50 border border-nxt-200 rounded-nxt-xl p-3 cursor-pointer transition-all duration-200 hover:bg-nxt-100 hover:shadow-md active:scale-95" style={styles}>
                        <div className={`w-8 h-8 rounded-nxt-lg ${card.iconBg} flex items-center justify-center mb-2`}>
                          <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                        </div>
                        <h4 className="text-xs font-bold text-nxt-800 mb-0.5">{card.name}</h4>
                        <p className="text-[10px] text-nxt-500 leading-relaxed">{card.desc}</p>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 grid grid-cols-2 gap-3">
                {[
                  { name: "Mapa de Comunicacion", desc: "Centros de carga en tiempo real", icon: Activity },
                  { name: "Portabilidad", desc: "Metricas y cumplimiento", icon: TrendingUp },
                  { name: "Monitoreo", desc: "Estado de red y alertas", icon: Shield },
                  { name: "Flow Engine", desc: "Orquestacion de datos", icon: RefreshCw },
                ].map((card) => (
                  <ColorEditable key={card.name} elementKey={`componentes.card-g-${card.name.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={undefined}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className="bg-white/20 border border-white/20 rounded-nxt-xl p-3 cursor-pointer transition-all duration-200 hover:bg-white/30 active:scale-95 relative overflow-hidden" style={styles}>
                        <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white/5 pointer-events-none" />
                        <div className="relative z-10">
                          <div className="w-8 h-8 rounded-nxt-lg bg-white/30 flex items-center justify-center mb-2 border border-white/20">
                            <card.icon className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="text-xs font-bold text-white mb-0.5">{card.name}</h4>
                          <p className="text-[10px] text-white/60 leading-relaxed">{card.desc}</p>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                        </div>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Mapa de Comunicacion", desc: "Centros de carga en tiempo real", icon: Activity, iconBg: "bg-blue-500/20", iconColor: "text-blue-400" },
                  { name: "Portabilidad", desc: "Metricas y cumplimiento", icon: TrendingUp, iconBg: "bg-green-500/20", iconColor: "text-green-400" },
                  { name: "Monitoreo", desc: "Estado de red y alertas", icon: Shield, iconBg: "bg-amber-500/20", iconColor: "text-amber-400" },
                  { name: "Flow Engine", desc: "Orquestacion de datos", icon: RefreshCw, iconBg: "bg-red-500/20", iconColor: "text-red-400" },
                ].map((card) => (
                  <ColorEditable key={card.name} elementKey={`componentes.card-d-${card.name.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg(card.iconBg)}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className="bg-bark border border-evergreen rounded-nxt-xl p-3 cursor-pointer transition-all duration-200 hover:bg-evergreen active:scale-95" style={styles}>
                        <div className={`w-8 h-8 rounded-nxt-lg ${card.iconBg} flex items-center justify-center mb-2`}>
                          <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                        </div>
                        <h4 className="text-xs font-bold text-gray-200 mb-0.5">{card.name}</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed">{card.desc}</p>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* -- ESTADO DEL SISTEMA -- Dark gradient (Apollo VistaGeneral cache) -- */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Estado del sistema</h3>
          <p className="text-xs text-nxt-400 mb-4">Card oscura con metricas de recursos del servidor en tiempo real.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <h4 className="text-sm font-bold text-nxt-800 mb-3">Recursos del servidor</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "CPU", value: "23%", color: "text-success", bg: "bg-success-light", border: "border-success-border" },
                  { label: "RAM", value: "67%", color: "text-warning", bg: "bg-warning-light", border: "border-warning-border" },
                  { label: "Disco", value: "45%", color: "text-info", bg: "bg-info-light", border: "border-info-border" },
                  { label: "Red", value: "12ms", color: "text-forest", bg: "bg-pine/30", border: "border-forest" },
                ].map((s) => (
                  <ColorEditable key={s.label} elementKey={`componentes.stat-l-${s.label.toLowerCase()}`} defaultBg={resolveDefaultBg(s.bg)}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className={`${s.bg} border ${s.border} rounded-nxt-lg p-3 text-center cursor-pointer transition-all duration-200 hover:shadow-md`} style={styles}>
                        <p className={`text-lg font-bold ${s.color} tabular-nums`}>{s.value}</p>
                        <p className="text-xs text-nxt-600">{s.label}</p>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <h4 className="text-sm font-bold text-white mb-3">Recursos del servidor</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "CPU", value: "23%", color: "text-green-400" },
                    { label: "RAM", value: "67%", color: "text-amber-400" },
                    { label: "Disco", value: "45%", color: "text-blue-400" },
                    { label: "Red", value: "12ms", color: "text-cyan-400" },
                  ].map((s) => (
                    <ColorEditable key={s.label} elementKey={`componentes.stat-g-${s.label.toLowerCase()}`} defaultBg={undefined}>
                      {(styles, openPicker, currentHex) => (
                        <div onClick={openPicker} className="bg-white/20 rounded-nxt-lg p-3 text-center cursor-pointer transition-all duration-200 hover:bg-white/30" style={styles}>
                          <p className={`text-lg font-bold ${s.color} tabular-nums`}>{s.value}</p>
                          <p className="text-xs text-white/70">{s.label}</p>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                        </div>
                      )}
                    </ColorEditable>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <h4 className="text-sm font-bold text-gray-200 mb-3">Recursos del servidor</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "CPU", value: "23%", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
                  { label: "RAM", value: "67%", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
                  { label: "Disco", value: "45%", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
                  { label: "Red", value: "12ms", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
                ].map((s) => (
                  <ColorEditable key={s.label} elementKey={`componentes.stat-d-${s.label.toLowerCase()}`} defaultBg={resolveDefaultBg(s.bg)}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className={`${s.bg} border ${s.border} rounded-nxt-lg p-3 text-center cursor-pointer transition-all duration-200 hover:bg-bark`} style={styles}>
                        <p className={`text-lg font-bold ${s.color} tabular-nums`}>{s.value}</p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* -- GRADIENTE POR ESTADO -- Health / status cards -- */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Gradiente por estado</h3>
          <p className="text-xs text-nxt-400 mb-4">Cards con fondo gradiente suave segun color de estado.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Health Score", value: "98.5%", subtitle: "Sistemas saludables", gradient: "from-green-50 to-emerald-50", border: "border-green-200", dot: "bg-green-500", text: "text-green-700", valueColor: "text-green-800" },
                  { label: "Alertas activas", value: "3", subtitle: "2 warnings, 1 info", gradient: "from-amber-50 to-yellow-50", border: "border-amber-200", dot: "bg-amber-500", text: "text-amber-700", valueColor: "text-amber-800" },
                  { label: "Errores criticos", value: "0", subtitle: "Sin incidentes", gradient: "from-red-50 to-rose-50", border: "border-red-200", dot: "bg-red-500", text: "text-red-700", valueColor: "text-red-800" },
                  { label: "Cobertura", value: "87%", subtitle: "142 de 163 hosts", gradient: "from-blue-50 to-cyan-50", border: "border-blue-200", dot: "bg-blue-500", text: "text-blue-700", valueColor: "text-blue-800" },
                ].map((card) => (
                  <ColorEditable key={card.label} elementKey={`componentes.health-l-${card.label.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={undefined}>
                    {(styles, openPicker, currentHex) => (
                      <div
                        onClick={openPicker}
                        className={`rounded-nxt-xl border ${card.border} bg-gradient-to-br ${card.gradient} p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer active:scale-95`}
                        style={styles}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${card.dot}`} />
                          <span className={`text-[10px] font-medium ${card.text}`}>{card.label}</span>
                        </div>
                        <p className={`text-xl font-bold ${card.valueColor} tabular-nums`}>{card.value}</p>
                        <p className={`text-[10px] ${card.text} opacity-70 mt-0.5`}>{card.subtitle}</p>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 grid grid-cols-2 gap-3">
                {[
                  { label: "Health Score", value: "98.5%", subtitle: "Sistemas saludables", gradient: "from-emerald-500 to-green-500" },
                  { label: "Alertas activas", value: "3", subtitle: "2 warnings, 1 info", gradient: "from-amber-500 to-yellow-500" },
                  { label: "Errores criticos", value: "0", subtitle: "Sin incidentes", gradient: "from-red-500 to-rose-500" },
                  { label: "Cobertura", value: "87%", subtitle: "142 de 163 hosts", gradient: "from-blue-500 to-cyan-500" },
                ].map((card) => (
                  <ColorEditable key={card.label} elementKey={`componentes.health-g-${card.label.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={undefined}>
                    {(styles, openPicker, currentHex) => (
                      <div
                        onClick={openPicker}
                        className={`rounded-nxt-xl bg-gradient-to-br ${card.gradient} p-3 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer active:scale-95 relative overflow-hidden`}
                        style={styles}
                      >
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/10 pointer-events-none" />
                        <div className="relative z-10">
                          <span className="text-[10px] font-medium text-white/70">{card.label}</span>
                          <p className="text-xl font-bold tabular-nums">{card.value}</p>
                          <p className="text-[10px] text-white/60 mt-0.5">{card.subtitle}</p>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                        </div>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Health Score", value: "98.5%", subtitle: "Sistemas saludables", dot: "bg-green-400", text: "text-green-400", valueColor: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
                  { label: "Alertas activas", value: "3", subtitle: "2 warnings, 1 info", dot: "bg-amber-400", text: "text-amber-400", valueColor: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
                  { label: "Errores criticos", value: "0", subtitle: "Sin incidentes", dot: "bg-red-400", text: "text-red-400", valueColor: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
                  { label: "Cobertura", value: "87%", subtitle: "142 de 163 hosts", dot: "bg-blue-400", text: "text-blue-400", valueColor: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
                ].map((card) => (
                  <ColorEditable key={card.label} elementKey={`componentes.health-d-${card.label.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg(card.bg)}>
                    {(styles, openPicker, currentHex) => (
                      <div
                        onClick={openPicker}
                        className={`rounded-nxt-xl ${card.bg} border ${card.border} p-3 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer active:scale-95`}
                        style={styles}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${card.dot}`} />
                          <span className={`text-[10px] font-medium ${card.text}`}>{card.label}</span>
                        </div>
                        <p className={`text-xl font-bold ${card.valueColor} tabular-nums`}>{card.value}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">{card.subtitle}</p>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* -- BASICAS -- Card, borde lateral, hero -- */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Basicas</h3>
          <p className="text-xs text-nxt-400 mb-4">Card estandar, con borde lateral de estado y hero card oscura.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="space-y-3">
                <div className="border border-nxt-200 rounded-nxt-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-nxt-200">
                    <h4 className="text-sm font-semibold text-nxt-800">Card basica</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-nxt-600">Contenido del cuerpo con texto descriptivo.</p>
                  </div>
                  <div className="px-4 py-3 border-t border-nxt-200 bg-nxt-50">
                    <span className="text-xs text-nxt-400">Footer - Metadata</span>
                  </div>
                </div>
                <div className="border border-nxt-200 border-l-4 border-l-success rounded-nxt-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-nxt-200">
                    <h4 className="text-sm font-semibold text-nxt-800">Card con borde</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-nxt-600">Borde izquierdo de color para indicar estado.</p>
                  </div>
                  <div className="px-4 py-3 border-t border-nxt-200 bg-nxt-50">
                    <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle className="w-3 h-3" /> Completado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="bg-white/20 border border-white/20 rounded-nxt-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/20">
                    <h4 className="text-sm font-semibold text-white">Card basica</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-white/70">Contenido del cuerpo con texto descriptivo.</p>
                  </div>
                  <div className="px-4 py-3 border-t border-white/20 bg-white/10">
                    <span className="text-xs text-white/50">Footer - Metadata</span>
                  </div>
                </div>
                <div className="bg-white/20 border border-white/20 border-l-4 border-l-green-400 rounded-nxt-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/20">
                    <h4 className="text-sm font-semibold text-white">Card con borde</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-white/70">Borde izquierdo de color para indicar estado.</p>
                  </div>
                  <div className="px-4 py-3 border-t border-white/20 bg-white/10">
                    <span className="inline-flex items-center gap-1 text-xs text-green-300"><CheckCircle className="w-3 h-3" /> Completado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="space-y-3">
                <div className="bg-bark border border-evergreen rounded-nxt-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-evergreen">
                    <h4 className="text-sm font-semibold text-gray-200">Card basica</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-400">Contenido del cuerpo con texto descriptivo.</p>
                  </div>
                  <div className="px-4 py-3 border-t border-evergreen bg-forest">
                    <span className="text-xs text-gray-600">Footer - Metadata</span>
                  </div>
                </div>
                <div className="bg-bark border border-evergreen border-l-4 border-l-green-500 rounded-nxt-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-evergreen">
                    <h4 className="text-sm font-semibold text-gray-200">Card con borde</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-400">Borde izquierdo de color para indicar estado.</p>
                  </div>
                  <div className="px-4 py-3 border-t border-evergreen bg-forest">
                    <span className="inline-flex items-center gap-1 text-xs text-green-400"><CheckCircle className="w-3 h-3" /> Completado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -- INTERACTIVAS -- Hover lift -- */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Interactivas (hover lift)</h3>
          <p className="text-xs text-nxt-400 mb-4">Cards con efecto lift al hover y feedback tactil al click.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="space-y-3">
                {[
                  { name: "Apollo", desc: "Asistente IA para atencion al cliente", icon: Zap, color: "text-forest" },
                  { name: "Atlas", desc: "Dashboard de monitoreo de sistemas", icon: Activity, color: "text-info" },
                  { name: "CFE-Recibos", desc: "Digitalizacion de recibos CFE", icon: Server, color: "text-success" },
                ].map((item) => (
                  <ColorEditable key={item.name} elementKey={`componentes.interactive-l-${item.name.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={undefined}>
                    {(styles, openPicker, currentHex) => (
                      <div
                        onClick={openPicker}
                        className="border border-nxt-200 rounded-nxt-xl p-3 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                        style={styles}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-nxt-lg bg-nxt-100 flex items-center justify-center ${item.color}`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-nxt-800">{item.name}</h4>
                            <p className="text-[10px] text-nxt-500">{item.desc}</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-nxt-400" />
                        </div>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 space-y-3">
                {[
                  { name: "Apollo", desc: "Asistente IA para atencion al cliente", icon: Zap },
                  { name: "Atlas", desc: "Dashboard de monitoreo de sistemas", icon: Activity },
                  { name: "CFE-Recibos", desc: "Digitalizacion de recibos CFE", icon: Server },
                ].map((item) => (
                  <ColorEditable key={item.name} elementKey={`componentes.interactive-g-${item.name.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={undefined}>
                    {(styles, openPicker, currentHex) => (
                      <div
                        onClick={openPicker}
                        className="bg-white/20 border border-white/20 rounded-nxt-xl p-3 cursor-pointer transition-all duration-300 hover:bg-white/30 active:scale-[0.98]"
                        style={styles}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-nxt-lg bg-white/30 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-white">{item.name}</h4>
                            <p className="text-[10px] text-white/60">{item.desc}</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                        </div>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="space-y-3">
                {[
                  { name: "Apollo", desc: "Asistente IA para atencion al cliente", icon: Zap, iconBg: "bg-pine/20", iconColor: "text-pine" },
                  { name: "Atlas", desc: "Dashboard de monitoreo de sistemas", icon: Activity, iconBg: "bg-blue-500/20", iconColor: "text-blue-400" },
                  { name: "CFE-Recibos", desc: "Digitalizacion de recibos CFE", icon: Server, iconBg: "bg-green-500/20", iconColor: "text-green-400" },
                ].map((item) => (
                  <ColorEditable key={item.name} elementKey={`componentes.interactive-d-${item.name.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg(item.iconBg)}>
                    {(styles, openPicker, currentHex) => (
                      <div
                        onClick={openPicker}
                        className="bg-bark border border-evergreen rounded-nxt-xl p-3 cursor-pointer transition-all duration-300 hover:bg-evergreen active:scale-[0.98]"
                        style={styles}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-nxt-lg ${item.iconBg} flex items-center justify-center`}>
                            <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-gray-200">{item.name}</h4>
                            <p className="text-[10px] text-gray-500">{item.desc}</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                        </div>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* -- METRICAS / KPI -- Con tendencia -- */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Metricas / KPI</h3>
          <p className="text-xs text-nxt-400 mb-4">Cards con valor, icono y tendencia porcentual vs mes anterior.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Solicitudes", value: "1,247", trend: "+12.5%", up: true, icon: Activity, iconBg: "bg-info-light", iconColor: "text-info" },
                  { label: "Tiempo respuesta", value: "1.2s", trend: "-8.3%", up: false, icon: Clock, iconBg: "bg-success-light", iconColor: "text-success" },
                  { label: "Errores", value: "23", trend: "+3.1%", up: true, icon: XCircle, iconBg: "bg-error-light", iconColor: "text-error" },
                  { label: "Uptime", value: "99.9%", trend: "+0.1%", up: true, icon: Shield, iconBg: "bg-warning-light", iconColor: "text-warning" },
                ].map((m) => (
                  <ColorEditable key={m.label} elementKey={`componentes.trend-l-${m.label.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg(m.iconBg)}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className="border border-nxt-200 rounded-nxt-xl p-3 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-95">
                        <div className="flex items-start justify-between mb-1">
                          <div className={`w-8 h-8 rounded-nxt-lg ${m.iconBg} flex items-center justify-center`} style={styles}>
                            <m.icon className={`w-4 h-4 ${m.iconColor}`} />
                          </div>
                          <MoreHorizontal className="w-4 h-4 text-nxt-400" />
                        </div>
                        <p className="text-[10px] text-nxt-500 mb-0.5">{m.label}</p>
                        <p className="text-lg font-bold text-nxt-900 tabular-nums">{m.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {m.up ? <TrendingUp className="w-3 h-3 text-success" /> : <TrendingDown className="w-3 h-3 text-error" />}
                          <span className={`text-[10px] font-medium ${m.up && m.label !== "Errores" ? "text-success" : "text-error"}`}>{m.trend}</span>
                        </div>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 grid grid-cols-2 gap-3">
                {[
                  { label: "Solicitudes", value: "1,247", trend: "+12.5%", up: true, icon: Activity },
                  { label: "Tiempo respuesta", value: "1.2s", trend: "-8.3%", up: false, icon: Clock },
                  { label: "Errores", value: "23", trend: "+3.1%", up: true, icon: XCircle },
                  { label: "Uptime", value: "99.9%", trend: "+0.1%", up: true, icon: Shield },
                ].map((m) => (
                  <ColorEditable key={m.label} elementKey={`componentes.trend-g-${m.label.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={undefined}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className="bg-white/20 border border-white/20 rounded-nxt-xl p-3 cursor-pointer transition-all duration-300 hover:bg-white/30 active:scale-95" style={styles}>
                        <div className="flex items-start justify-between mb-1">
                          <div className="w-8 h-8 rounded-nxt-lg bg-white/30 flex items-center justify-center">
                            <m.icon className="w-4 h-4 text-white" />
                          </div>
                          <MoreHorizontal className="w-4 h-4 text-white/40" />
                        </div>
                        <p className="text-[10px] text-white/60 mb-0.5">{m.label}</p>
                        <p className="text-lg font-bold text-white tabular-nums">{m.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {m.up ? <TrendingUp className="w-3 h-3 text-white/80" /> : <TrendingDown className="w-3 h-3 text-white/80" />}
                          <span className="text-[10px] font-medium text-white/70">{m.trend}</span>
                        </div>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Solicitudes", value: "1,247", trend: "+12.5%", up: true, icon: Activity, iconBg: "bg-blue-500/15", iconColor: "text-blue-400" },
                  { label: "Tiempo respuesta", value: "1.2s", trend: "-8.3%", up: false, icon: Clock, iconBg: "bg-green-500/15", iconColor: "text-green-400" },
                  { label: "Errores", value: "23", trend: "+3.1%", up: true, icon: XCircle, iconBg: "bg-red-500/15", iconColor: "text-red-400" },
                  { label: "Uptime", value: "99.9%", trend: "+0.1%", up: true, icon: Shield, iconBg: "bg-amber-500/15", iconColor: "text-amber-400" },
                ].map((m) => (
                  <ColorEditable key={m.label} elementKey={`componentes.trend-d-${m.label.toLowerCase().replace(/\s+/g, "-")}`} defaultBg={resolveDefaultBg(m.iconBg)}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className="bg-bark border border-evergreen rounded-nxt-xl p-3 cursor-pointer transition-all duration-300 hover:bg-evergreen active:scale-95">
                        <div className="flex items-start justify-between mb-1">
                          <div className={`w-8 h-8 rounded-nxt-lg ${m.iconBg} flex items-center justify-center`} style={styles}>
                            <m.icon className={`w-4 h-4 ${m.iconColor}`} />
                          </div>
                          <MoreHorizontal className="w-4 h-4 text-gray-600" />
                        </div>
                        <p className="text-[10px] text-gray-500 mb-0.5">{m.label}</p>
                        <p className="text-lg font-bold text-gray-200 tabular-nums">{m.value}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {m.up ? <TrendingUp className="w-3 h-3 text-green-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
                          <span className={`text-[10px] font-medium ${m.up && m.label !== "Errores" ? "text-green-400" : "text-red-400"}`}>{m.trend}</span>
                        </div>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      {/* 4. ALERTAS & TOAST                                            */}
      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      <Section id="alertas-toast" title="Alertas & Toast" description="Alertas: mensajes inline persistentes con borde lateral de color. Toast: notificaciones flotantes temporales con slide-in/out, auto-dismiss a 5s, progress bar y boton de cierre. Los toast se apilan en la esquina inferior derecha.">
        {/* Inline alerts Ã¢â‚¬â€ 3-col grid */}
        <h3 className="text-sm font-semibold text-nxt-700 mb-1">Alertas inline</h3>
        <p className="text-xs text-nxt-400 mb-4">Mensajes persistentes con borde lateral de color e icono.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full space-y-2">
              {[
                { icon: CheckCircle, title: "Operacion exitosa", msg: "Proceso completado.", border: "border-l-success", bg: "bg-success-light", text: "text-success" },
                { icon: AlertTriangle, title: "Atencion requerida", msg: "Certificado expira en 7 dias.", border: "border-l-warning", bg: "bg-warning-light", text: "text-warning" },
                { icon: XCircle, title: "Error critico", msg: "Conexion perdida.", border: "border-l-error", bg: "bg-error-light", text: "text-error" },
                { icon: Info, title: "Informacion", msg: "Nueva version disponible.", border: "border-l-info", bg: "bg-info-light", text: "text-info" },
              ].map((a, i) => (
                <ColorEditable key={`alert-light-${i}`} elementKey={`componentes.alert-light-${i}`} defaultBg={resolveDefaultBg(a.bg)}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col gap-1">
                      <div onClick={openPicker} className={`flex items-start gap-2 p-2.5 rounded-nxt-md border-l-4 ${a.border} ${a.bg} cursor-pointer`} style={styles}>
                        <a.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${a.text}`} />
                        <div>
                          <p className={`text-xs font-semibold ${a.text}`}>{a.title}</p>
                          <p className="text-[11px] text-nxt-600 mt-0.5">{a.msg}</p>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              ))}
            </div>
          </div>
          {/* Gradiente */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 space-y-2">
                {[
                  { icon: CheckCircle, title: "Operacion exitosa", msg: "Proceso completado.", border: "border-l-green-400" },
                  { icon: AlertTriangle, title: "Atencion", msg: "Certificado por expirar.", border: "border-l-amber-400" },
                  { icon: XCircle, title: "Error critico", msg: "Conexion perdida.", border: "border-l-red-400" },
                ].map((a, i) => (
                  <ColorEditable key={`alert-grad-${i}`} elementKey={`componentes.alert-grad-${i}`} defaultBg={resolveDefaultBg("bg-white/20")}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col gap-1">
                        <div onClick={openPicker} className={`flex items-start gap-2 p-2.5 rounded-nxt-md border-l-4 ${a.border} bg-white/20 cursor-pointer`} style={styles}>
                          <a.icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-white" />
                          <div>
                            <p className="text-xs font-semibold text-white">{a.title}</p>
                            <p className="text-[11px] text-white/60 mt-0.5">{a.msg}</p>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full space-y-2">
              {[
                { icon: CheckCircle, title: "Operacion exitosa", msg: "Proceso completado.", border: "border-l-green-400", bg: "bg-green-500/10", text: "text-green-400" },
                { icon: AlertTriangle, title: "Atencion requerida", msg: "Certificado expira en 7 dias.", border: "border-l-amber-400", bg: "bg-amber-500/10", text: "text-amber-400" },
                { icon: XCircle, title: "Error critico", msg: "Conexion perdida.", border: "border-l-red-400", bg: "bg-red-500/10", text: "text-red-400" },
                { icon: Info, title: "Informacion", msg: "Nueva version disponible.", border: "border-l-blue-400", bg: "bg-blue-500/10", text: "text-blue-400" },
              ].map((a, i) => (
                <ColorEditable key={`alert-dark-${i}`} elementKey={`componentes.alert-dark-${i}`} defaultBg={resolveDefaultBg(a.bg)}>
                  {(styles, openPicker, currentHex) => (
                    <div className="flex flex-col gap-1">
                      <div onClick={openPicker} className={`flex items-start gap-2 p-2.5 rounded-nxt-md border-l-4 ${a.border} ${a.bg} cursor-pointer`} style={styles}>
                        <a.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${a.text}`} />
                        <div>
                          <p className={`text-xs font-semibold ${a.text}`}>{a.title}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{a.msg}</p>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              ))}
            </div>
          </div>
        </div>

        {/* Toast trigger buttons */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Toast (Click para probar)</h3>
          <p className="text-xs text-nxt-400 mb-4">Notificaciones temporales flotantes con auto-dismiss a 5s.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-2">
                <button className="nxt-btn-primary text-xs cursor-pointer active:scale-95 transition-all" onClick={() => addToast("success", "Guardado", "Cambios guardados.")}><CheckCircle className="w-3.5 h-3.5" /> Success</button>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-error text-white hover:bg-red-700 transition-all cursor-pointer active:scale-95" onClick={() => addToast("error", "Error", "No se pudo completar.")}><XCircle className="w-3.5 h-3.5" /> Error</button>
                <button className="nxt-btn-secondary text-xs cursor-pointer active:scale-95 transition-all" onClick={() => addToast("warning", "Advertencia", "Latencia alta.")}><AlertTriangle className="w-3.5 h-3.5" /> Warning</button>
                <button className="nxt-btn-ghost text-xs cursor-pointer active:scale-95 transition-all" onClick={() => addToast("info", "Info", "Version actualizada.")}><Info className="w-3.5 h-3.5" /> Info</button>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-green-400 text-gray-900 shadow-lg shadow-green-400/30 cursor-pointer active:scale-95 transition-all" onClick={() => addToast("success", "Guardado", "Cambios guardados.")}><CheckCircle className="w-3.5 h-3.5" /> Success</button>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-red-400 text-white shadow-lg shadow-red-400/30 cursor-pointer active:scale-95 transition-all" onClick={() => addToast("error", "Error", "No se pudo completar.")}><XCircle className="w-3.5 h-3.5" /> Error</button>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-amber-400 text-gray-900 shadow-lg shadow-amber-400/30 cursor-pointer active:scale-95 transition-all" onClick={() => addToast("warning", "Advertencia", "Latencia alta.")}><AlertTriangle className="w-3.5 h-3.5" /> Warning</button>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-blue-400 text-white shadow-lg shadow-blue-400/30 cursor-pointer active:scale-95 transition-all" onClick={() => addToast("info", "Info", "Version actualizada.")}><Info className="w-3.5 h-3.5" /> Info</button>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-green-500 text-white shadow-lg shadow-green-500/30 cursor-pointer active:scale-95 transition-all" onClick={() => addToast("success", "Guardado", "Cambios guardados.")}><CheckCircle className="w-3.5 h-3.5" /> Success</button>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-red-500 text-white shadow-lg shadow-red-500/30 cursor-pointer active:scale-95 transition-all" onClick={() => addToast("error", "Error", "No se pudo completar.")}><XCircle className="w-3.5 h-3.5" /> Error</button>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-amber-500 text-white shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95 transition-all" onClick={() => addToast("warning", "Advertencia", "Latencia alta.")}><AlertTriangle className="w-3.5 h-3.5" /> Warning</button>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-blue-500 text-white shadow-lg shadow-blue-500/30 cursor-pointer active:scale-95 transition-all" onClick={() => addToast("info", "Info", "Version actualizada.")}><Info className="w-3.5 h-3.5" /> Info</button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      {/* 5. TABS                                                       */}
      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      <Section id="tabs" title="Tabs" description="Navegacion por pestanas. Tab activo con fondo amarillo semitransparente y borde inferior. Usado en Apollo (Settings, Portabilidad), Atlas (Monitoreo RPU), CFE-Recibos (navegacion de secciones). Los 3 modos responden al mismo estado.">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card overflow-hidden h-full">
              <div className="flex border-b border-nxt-200 relative">
                {tabs.map((tab, i) => (
                  <ColorEditable key={tab} elementKey={`componentes.tab-l-${i}`} defaultBg={resolveDefaultBg("bg-forest")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-forest")}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => { openPicker(); setActiveTab(i); }}
                          className={`px-3 sm:px-4 py-2.5 text-xs font-medium transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 ${
                            activeTab === i
                              ? "nxt-tab-active"
                              : "text-nxt-500 hover:text-nxt-700 hover:bg-nxt-50"
                          }`}
                          style={activeTab === i ? styles : undefined}
                          {...hoverHandlers}
                        >
                          {tab}
                        </button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
              <div className="p-4">
                <p className="text-xs text-nxt-600">
                  Contenido de <span className="font-semibold text-nxt-800">{tabs[activeTab]}</span>.
                </p>
              </div>
            </div>
          </div>
          {/* Gradiente */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl overflow-hidden h-full relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex border-b border-white/20">
                  {tabs.map((tab, i) => (
                    <ColorEditable key={tab} elementKey={`componentes.tab-g-${i}`} defaultBg={resolveDefaultBg("bg-white/30")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-white/30")}>
                      {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => { openPicker(); setActiveTab(i); }}
                            className={`px-3 sm:px-4 py-2.5 text-xs font-medium transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 ${
                              activeTab === i
                                ? "bg-white/30 text-white border-b-2 border-white"
                                : "text-white/60 hover:text-white hover:bg-white/20"
                            }`}
                            style={activeTab === i ? styles : undefined}
                            {...hoverHandlers}
                          >
                            {tab}
                          </button>
                          <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                        </div>
                      )}
                    </ColorEditable>
                  ))}
                </div>
                <div className="p-4">
                  <p className="text-xs text-white/80">
                    Contenido de <span className="font-semibold text-white">{tabs[activeTab]}</span> en vista gradiente.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl overflow-hidden h-full">
              <div className="flex border-b border-evergreen">
                {tabs.map((tab, i) => (
                  <ColorEditable key={tab} elementKey={`componentes.tab-d-${i}`} defaultBg={resolveDefaultBg("bg-[#04202C]")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-[#04202C]")}>
                    {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => { openPicker(); setActiveTab(i); }}
                          className={`px-3 sm:px-4 py-2.5 text-xs font-medium transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 ${
                            activeTab === i
                              ? "bg-pine/20 text-pine border-b-2 border-pine rounded-t-nxt-pill"
                              : "text-gray-500 hover:text-gray-300 hover:bg-bark"
                          }`}
                          style={activeTab === i ? styles : undefined}
                          {...hoverHandlers}
                        >
                          {tab}
                        </button>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}{hoverHex ? ` Ã¢â€ â€™ ${hoverHex}` : ""}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400">
                  Contenido de <span className="font-semibold text-gray-200">{tabs[activeTab]}</span> en vista dark mode.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      {/* 6. TOOLTIPS & MODAL                                           */}
      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      <Section id="tooltips-modals" title="Tooltips & Modal" description="Tooltip: informacion contextual al hover, posicion top o bottom. Modal: dialogo de confirmacion con overlay, header, body y footer con acciones. Z-index: tooltip (1070), modal (1050)">
        {/* Tooltips */}
        <h3 className="text-sm font-semibold text-nxt-700 mb-1">Tooltips (hover)</h3>
        <p className="text-xs text-nxt-400 mb-4">Informacion contextual al hover con posicion top o bottom.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap gap-3">
                <div className="relative group">
                  <button className="nxt-btn-secondary text-xs cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2">
                    <Eye className="w-3.5 h-3.5" /> Tooltip arriba
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-nxt-900 text-white text-xs rounded-nxt-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-nxt-fast">
                    Informacion adicional
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-nxt-900" />
                  </div>
                </div>
                <div className="relative group">
                  <button className="nxt-btn-secondary text-xs cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2">
                    <Info className="w-3.5 h-3.5" /> Tooltip abajo
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-nxt-900 text-white text-xs rounded-nxt-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-nxt-fast">
                    Detalle del elemento
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-nxt-900" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-3">
                <div className="relative group">
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-white/30 text-white border border-white/30 cursor-pointer active:scale-95 transition-all duration-200 hover:bg-white/40">
                    <Eye className="w-3.5 h-3.5" /> Tooltip arriba
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white text-slate-700 text-xs rounded-nxt-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-nxt-fast shadow-lg">
                    Informacion adicional
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
                  </div>
                </div>
                <div className="relative group">
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-white/30 text-white border border-white/30 cursor-pointer active:scale-95 transition-all duration-200 hover:bg-white/40">
                    <Info className="w-3.5 h-3.5" /> Tooltip abajo
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-white text-slate-700 text-xs rounded-nxt-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-nxt-fast shadow-lg">
                    Detalle del elemento
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-3">
                <div className="relative group">
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-bark text-gray-300 border border-evergreen cursor-pointer active:scale-95 transition-all duration-200 hover:bg-evergreen">
                    <Eye className="w-3.5 h-3.5" /> Tooltip arriba
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-200 text-gray-900 text-xs rounded-nxt-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-nxt-fast shadow-lg">
                    Informacion adicional
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-200" />
                  </div>
                </div>
                <div className="relative group">
                  <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-nxt-md bg-bark text-gray-300 border border-evergreen cursor-pointer active:scale-95 transition-all duration-200 hover:bg-evergreen">
                    <Info className="w-3.5 h-3.5" /> Tooltip abajo
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-200 text-gray-900 text-xs rounded-nxt-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-nxt-fast shadow-lg">
                    Detalle del elemento
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Static Modal preview */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Modal (preview estatico)</h3>
          <p className="text-xs text-nxt-400 mb-4">Dialogo de confirmacion con overlay, header, body y footer con acciones.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full bg-nxt-50">
              <div className="bg-white rounded-nxt-lg shadow-nxt-lg border border-nxt-200 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-nxt-200">
                  <h3 className="text-sm font-semibold text-nxt-900">Confirmar accion</h3>
                  <button className="w-7 h-7 flex items-center justify-center rounded-nxt-md hover:bg-nxt-100 text-nxt-400 transition-colors cursor-pointer active:scale-95">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-nxt-600">Estas a punto de eliminar este registro. Esta accion no se puede deshacer.</p>
                </div>
                <div className="flex justify-end gap-2 px-4 py-2.5 border-t border-nxt-200 bg-nxt-50">
                  <button className="nxt-btn-ghost text-xs cursor-pointer active:scale-95 transition-all duration-200">Cancelar</button>
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-nxt-md bg-error text-white hover:bg-red-700 transition-all cursor-pointer active:scale-95">
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="bg-white/20 backdrop-blur-sm rounded-nxt-lg border border-white/20 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/20">
                    <h3 className="text-sm font-semibold text-white">Confirmar accion</h3>
                    <button className="w-7 h-7 flex items-center justify-center rounded-nxt-md hover:bg-white/20 text-white/60 transition-colors cursor-pointer active:scale-95">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-xs text-white/70">Estas a punto de eliminar este registro. Esta accion no se puede deshacer.</p>
                  </div>
                  <div className="flex justify-end gap-2 px-4 py-2.5 border-t border-white/20 bg-white/10">
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-nxt-md bg-white/20 text-white border border-white/30 hover:bg-white/30 transition-all cursor-pointer active:scale-95">Cancelar</button>
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-nxt-md bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer active:scale-95">
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="bg-bark rounded-nxt-lg border border-evergreen overflow-hidden shadow-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-evergreen">
                  <h3 className="text-sm font-semibold text-gray-200">Confirmar accion</h3>
                  <button className="w-7 h-7 flex items-center justify-center rounded-nxt-md hover:bg-evergreen text-gray-500 transition-colors cursor-pointer active:scale-95">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-400">Estas a punto de eliminar este registro. Esta accion no se puede deshacer.</p>
                </div>
                <div className="flex justify-end gap-2 px-4 py-2.5 border-t border-evergreen bg-forest">
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-nxt-md bg-evergreen text-gray-300 hover:bg-pine transition-all cursor-pointer active:scale-95">Cancelar</button>
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-nxt-md bg-red-500 text-white hover:bg-red-600 transition-all cursor-pointer active:scale-95">
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      {/* 7. PROGRESS & SPINNERS                                        */}
      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      <Section id="progress-spinners" title="Progress & Spinners" description="Progress: barra de progreso lineal con 5 colores (primary, success, warning, error, info) y 3 grosores (4px, 8px, 12px). Spinner: indicador de carga circular con 4 tamanos (16-48px). Usar progress para operaciones con porcentaje conocido, spinner para indeterminadas.">
        {/* Barras de progreso */}
        <h3 className="text-sm font-semibold text-nxt-700 mb-1">Barras de progreso <span className="text-[10px] font-normal text-nxt-400">- animadas al entrar en vista</span></h3>
        <p className="text-xs text-nxt-400 mb-4">Barra de progreso lineal con 5 colores y animacion al entrar en viewport.</p>
        <div ref={progressRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full space-y-2">
              {[
                { label: "Default", pct: 68, color: "bg-forest" },
                { label: "Success", pct: 85, color: "bg-success" },
                { label: "Warning", pct: 52, color: "bg-warning" },
                { label: "Error", pct: 23, color: "bg-error" },
                { label: "Info", pct: 90, color: "bg-info" },
              ].map((bar) => (
                <ColorEditable key={bar.label} elementKey={`componentes.progress-l-${bar.label.toLowerCase()}`} defaultBg={resolveDefaultBg(bar.color)}>
                  {(styles, openPicker, currentHex) => (
                    <div onClick={openPicker} className="cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-nxt-600">{bar.label}</span>
                        <span className="text-[11px] font-medium text-nxt-700">{bar.pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-nxt-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bar.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: progressAnimated ? `${bar.pct}%` : "0%", ...styles }}
                        />
                      </div>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              ))}
            </div>
          </div>
          {/* Gradiente */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
              <div className="relative z-10 space-y-2">
                {[75, 50, 25].map((v) => (
                  <ColorEditable key={v} elementKey={`componentes.progress-g-${v}`} defaultBg={resolveDefaultBg("bg-primary-light")}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className="flex items-center gap-3 cursor-pointer">
                        <span className="text-[11px] text-white/70 w-8">{v}%</span>
                        <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-light rounded-full transition-all duration-1000 ease-out shadow-sm shadow-primary/30"
                            style={{ width: progressAnimated ? `${v}%` : "0%", ...styles }}
                          />
                        </div>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full space-y-2">
              {[
                { label: "CPU", value: 78, color: "bg-green-400" },
                { label: "RAM", value: 65, color: "bg-amber-400" },
                { label: "Disco", value: 92, color: "bg-red-400" },
                { label: "Red", value: 34, color: "bg-blue-400" },
              ].map((p) => (
                <ColorEditable key={p.label} elementKey={`componentes.progress-d-${p.label.toLowerCase()}`} defaultBg={resolveDefaultBg(p.color)}>
                  {(styles, openPicker, currentHex) => (
                    <div onClick={openPicker} className="flex items-center gap-3 cursor-pointer">
                      <span className="text-[11px] text-gray-500 w-10">{p.label}</span>
                      <div className="flex-1 h-2 bg-bark rounded-full overflow-hidden">
                        <div
                          className={`h-full ${p.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: progressAnimated ? `${p.value}%` : "0%", ...styles }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 w-8 text-right tabular-nums">{p.value}%</span>
                      <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                    </div>
                  )}
                </ColorEditable>
              ))}
            </div>
          </div>
        </div>

        {/* Tamanos Ã¢â‚¬â€ single row, light only */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Tamanos</h3>
          <p className="text-xs text-nxt-400 mb-4">Tres grosores de barra: slim (4px), default (8px) y thick (12px).</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="space-y-3">
                {[
                  { label: "Slim (4px)", h: "h-1" },
                  { label: "Default (8px)", h: "h-2" },
                  { label: "Thick (12px)", h: "h-3" },
                ].map((size, i) => (
                  <ColorEditable key={size.label} elementKey={`componentes.psize-l-${i}`} defaultBg={resolveDefaultBg("bg-forest")}>
                    {(styles, openPicker, currentHex) => (
                      <div key={size.label} onClick={openPicker} className="cursor-pointer">
                        <span className="text-xs text-nxt-500 mb-1 block">{size.label}</span>
                        <div className={`w-full ${size.h} bg-nxt-200 rounded-full overflow-hidden`}>
                          <div className="h-full bg-forest rounded-full transition-all duration-1000 ease-out" style={{ width: progressAnimated ? "70%" : "0%", ...styles }} />
                        </div>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 space-y-3">
                {[
                  { label: "Slim (4px)", h: "h-1" },
                  { label: "Default (8px)", h: "h-2" },
                  { label: "Thick (12px)", h: "h-3" },
                ].map((size, i) => (
                  <ColorEditable key={size.label} elementKey={`componentes.psize-g-${i}`} defaultBg={resolveDefaultBg("bg-primary-light")}>
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className="cursor-pointer">
                        <span className="text-xs text-white/70 mb-1 block">{size.label}</span>
                        <div className={`w-full ${size.h} bg-white/30 rounded-full overflow-hidden`}>
                          <div className="h-full bg-primary-light rounded-full transition-all duration-1000 ease-out shadow-sm shadow-primary/30" style={{ width: progressAnimated ? "70%" : "0%", ...styles }} />
                        </div>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="space-y-3">
                {[
                  { label: "Slim (4px)", h: "h-1" },
                  { label: "Default (8px)", h: "h-2" },
                  { label: "Thick (12px)", h: "h-3" },
                ].map((size, i) => (
                  <ColorEditable key={size.label} elementKey={`componentes.psize-d-${i}`} defaultBg="#04202C">
                    {(styles, openPicker, currentHex) => (
                      <div onClick={openPicker} className="cursor-pointer">
                        <span className="text-xs text-gray-500 mb-1 block">{size.label}</span>
                        <div className={`w-full ${size.h} bg-bark rounded-full overflow-hidden`}>
                          <div className="h-full bg-pine rounded-full transition-all duration-1000 ease-out" style={{ width: progressAnimated ? "70%" : "0%", ...styles }} />
                        </div>
                        <span className="text-[8px] font-mono text-nxt-400">{currentHex}</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Spinners */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Spinners</h3>
          <p className="text-xs text-nxt-400 mb-4">Indicadores de carga circular con 4 tamanos (16-48px) y multiples colores.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex flex-wrap items-end gap-4 mb-3">
                {[16, 24, 32, 48].map((size) => (
                  <div key={size} className="flex flex-col items-center gap-1">
                    <Loader2 className="animate-spin text-forest" style={{ width: size, height: size }} />
                    <span className="text-[10px] text-nxt-400">{size}px</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {[
                  { label: "Success", color: "text-success" },
                  { label: "Warning", color: "text-warning" },
                  { label: "Error", color: "text-error" },
                  { label: "Info", color: "text-info" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-1">
                    <Loader2 className={`w-6 h-6 animate-spin ${s.color}`} />
                    <span className="text-[10px] text-nxt-400">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Gradiente */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
              <div className="relative z-10 flex flex-wrap gap-4 items-end">
                {["sm", "md", "lg"].map((sz) => (
                  <div key={sz} className="flex flex-col items-center gap-1">
                    <Loader2 className={`animate-spin text-white ${sz === "sm" ? "w-4 h-4" : sz === "md" ? "w-6 h-6" : "w-8 h-8"}`} />
                    <span className="text-[10px] text-white/60">{sz}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className="flex flex-wrap gap-6">
                {[
                  { label: "Primary", color: "border-t-primary-light" },
                  { label: "Success", color: "border-t-green-400" },
                  { label: "Error", color: "border-t-red-400" },
                  { label: "Info", color: "border-t-blue-400" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-1">
                    <div className={`w-6 h-6 border-2 border-evergreen ${s.color} rounded-full animate-spin`} />
                    <span className="text-[10px] text-gray-500">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      {/* 8. SKELETON & EMPTY STATE                                     */}
      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      <Section id="skeleton-empty" title="Skeleton & Empty State" description="Skeleton: placeholders animados con shimmer mientras cargan los datos. Variantes: stats, tabla, chart, cards de sistema. Empty State: pantalla cuando no hay resultados, con icono, mensaje y CTA. Usado en Apollo (Dashboard loading) y Atlas (tabla de monitoreo)">

        {/* Simular carga toggle */}
        <div className="mb-4">
          <button
            onClick={handleSimularCarga}
            disabled={showSkeleton}
            className={`nxt-btn-primary text-xs cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 ${showSkeleton ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {showSkeleton ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Cargando...</> : <><RefreshCw className="w-3.5 h-3.5" /> Simular carga (2s)</>}
          </button>
        </div>

        {/* Skeleton: Stats grid Ã¢â‚¬â€ 3-col comparison */}
        <h3 className="text-sm font-semibold text-nxt-700 mb-1">Skeleton - Stats Grid</h3>
        <p className="text-xs text-nxt-400 mb-4">Placeholders animados con shimmer para grids de estadisticas.</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className={`transition-all duration-500 ${showSkeleton ? "opacity-100" : "opacity-0 absolute pointer-events-none"}`}>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="nxt-card p-3">
                      <div className="nxt-skeleton h-3 w-16 mb-2" />
                      <div className="nxt-skeleton h-6 w-20 mb-1" />
                      <div className="nxt-skeleton h-2 w-12" />
                    </div>
                  ))}
                </div>
              </div>
              <div className={`transition-all duration-500 ${showSkeleton ? "opacity-0 absolute pointer-events-none" : "opacity-100"}`}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Solicitudes", value: "1,247", color: "text-info" },
                    { label: "Latencia", value: "12ms", color: "text-success" },
                    { label: "Errores", value: "3", color: "text-error" },
                    { label: "Uptime", value: "99.9%", color: "text-forest" },
                  ].map((stat) => (
                    <div key={stat.label} className="nxt-card p-3">
                      <p className="text-[11px] text-nxt-500 mb-1">{stat.label}</p>
                      <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Gradiente */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className={`relative z-10 transition-all duration-500 ${showSkeleton ? "opacity-100" : "opacity-0 absolute pointer-events-none"}`}>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white/20 rounded-nxt-xl p-3">
                      <div className="h-3 w-16 bg-white/30 rounded mb-2" />
                      <div className="h-6 w-20 bg-white/30 rounded mb-1" />
                      <div className="h-2 w-12 bg-white/20 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className={`relative z-10 transition-all duration-500 ${showSkeleton ? "opacity-0 absolute pointer-events-none" : "opacity-100"}`}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "CPU", value: "23%" },
                    { label: "RAM", value: "67%" },
                    { label: "Disco", value: "45%" },
                    { label: "Red", value: "12ms" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/20 rounded-nxt-xl p-3 text-center">
                      <p className="text-lg font-bold text-white">{stat.value}</p>
                      <p className="text-[10px] text-white/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-4 h-full">
              <div className={`transition-all duration-500 ${showSkeleton ? "opacity-100" : "opacity-0 absolute pointer-events-none"}`}>
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-bark border border-evergreen rounded-nxt-xl p-3">
                      <div className="h-3 w-16 bg-evergreen rounded mb-2" style={{ animation: "nxt-shimmer 1.5s ease-in-out infinite", backgroundSize: "200% 100%", background: "linear-gradient(90deg, #304040 25%, #5B7065 50%, #304040 75%)" }} />
                      <div className="h-6 w-20 bg-evergreen rounded" style={{ animation: "nxt-shimmer 1.5s ease-in-out infinite 0.2s", backgroundSize: "200% 100%", background: "linear-gradient(90deg, #304040 25%, #5B7065 50%, #304040 75%)" }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className={`transition-all duration-500 ${showSkeleton ? "opacity-0 absolute pointer-events-none" : "opacity-100"}`}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Online", value: "142", color: "text-green-400" },
                    { label: "Warning", value: "12", color: "text-amber-400" },
                    { label: "Critical", value: "3", color: "text-red-400" },
                    { label: "Info", value: "28", color: "text-blue-400" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-bark border border-evergreen rounded-nxt-xl p-3 text-center">
                      <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-[10px] text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton: Table Ã¢â‚¬â€ wider row (complex content) */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Skeleton - Tabla</h3>
          <p className="text-xs text-nxt-400 mb-4">Placeholder animado para tablas de datos mientras cargan.</p>
        </div>
        <div className="nxt-card overflow-hidden mb-8 relative">
          <div className={`transition-all duration-500 ${showSkeleton ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}`}>
            <div className="grid grid-cols-4 gap-3 p-3 sm:p-4 bg-nxt-50 border-b border-nxt-200">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="nxt-skeleton h-3 w-full" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, row) => (
              <div key={row} className="grid grid-cols-4 gap-3 p-3 sm:p-4 border-b border-nxt-100 last:border-b-0">
                {Array.from({ length: 4 }).map((_, col) => (
                  <div key={col} className="nxt-skeleton h-3 w-full" style={{ opacity: 1 - row * 0.1 }} />
                ))}
              </div>
            ))}
          </div>
          <div className={`transition-all duration-500 ${showSkeleton ? "opacity-0 absolute inset-0 pointer-events-none" : "opacity-100"}`}>
            <div className="grid grid-cols-4 gap-3 p-3 sm:p-4 bg-nxt-50 border-b border-nxt-200 text-xs font-semibold text-nxt-600">
              <span>Servicio</span><span>Estado</span><span>Latencia</span><span>Uptime</span>
            </div>
            {[
              { name: "API Gateway", status: "Healthy", latency: "12ms", uptime: "99.99%" },
              { name: "Auth Service", status: "Healthy", latency: "8ms", uptime: "99.95%" },
              { name: "PostgreSQL", status: "Healthy", latency: "5ms", uptime: "99.99%" },
              { name: "Redis Cache", status: "Degraded", latency: "145ms", uptime: "98.50%" },
              { name: "Worker Queue", status: "Offline", latency: "---", uptime: "95.20%" },
            ].map((row) => (
              <div key={row.name} className="grid grid-cols-4 gap-3 p-3 sm:p-4 border-b border-nxt-100 last:border-b-0 text-xs text-nxt-600">
                <span className="font-medium text-nxt-800">{row.name}</span>
                <span>{row.status}</span>
                <span className="font-mono">{row.latency}</span>
                <span>{row.uptime}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton: Chart bars Ã¢â‚¬â€ wider row */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Skeleton - Chart</h3>
          <p className="text-xs text-nxt-400 mb-4">Placeholder animado para graficas de barras mientras cargan los datos.</p>
        </div>
        <div className="nxt-card p-3 sm:p-4 mb-8 relative">
          <div className={`transition-all duration-500 ${showSkeleton ? "opacity-100" : "opacity-0 absolute inset-0 p-3 sm:p-4 pointer-events-none"}`}>
            <div className="flex items-end gap-2 h-32">
              {[40, 65, 50, 80, 35, 70, 55, 90, 45, 60, 75, 85].map((h, i) => (
                <div key={i} className="flex-1">
                  <div className="nxt-skeleton w-full rounded-t-sm" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className={`transition-all duration-500 ${showSkeleton ? "opacity-0 absolute inset-0 p-3 sm:p-4 pointer-events-none" : "opacity-100"}`}>
            <div className="flex items-end gap-2 h-32">
              {[40, 65, 50, 80, 35, 70, 55, 90, 45, 60, 75, 85].map((h, i) => (
                <div key={i} className="flex-1">
                  <div className="w-full bg-forest rounded-t-sm transition-all duration-700" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skeleton: System cards Ã¢â‚¬â€ wider row */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Skeleton - Cards de sistema</h3>
          <p className="text-xs text-nxt-400 mb-4">Placeholders animados para cards de proyecto mientras cargan.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8 relative">
          <div className={`contents transition-all duration-500 ${showSkeleton ? "" : "hidden"}`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`nxt-card p-3 sm:p-4 transition-all duration-500 ${showSkeleton ? "opacity-100" : "opacity-0"}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="nxt-skeleton w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="nxt-skeleton h-4 w-28 mb-1.5" />
                    <div className="nxt-skeleton h-3 w-20" />
                  </div>
                </div>
                <div className="nxt-skeleton h-3 w-full mb-2" />
                <div className="nxt-skeleton h-3 w-3/4" />
              </div>
            ))}
          </div>
          <div className={`contents transition-all duration-500 ${showSkeleton ? "hidden" : ""}`}>
            {[
              { name: "Apollo", desc: "Asistente IA para atencion al cliente", icon: Zap, color: "text-forest", initials: "AP" },
              { name: "Atlas", desc: "Dashboard de monitoreo de sistemas", icon: Activity, color: "text-info", initials: "AT" },
              { name: "CFE-Recibos", desc: "Digitalizacion de recibos CFE", icon: Server, color: "text-success", initials: "CF" },
            ].map((card) => (
              <div key={card.name} className={`nxt-card p-3 sm:p-4 transition-all duration-500 ${showSkeleton ? "opacity-0" : "opacity-100"}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-nxt-100 flex items-center justify-center ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-nxt-800">{card.name}</p>
                    <p className="text-xs text-nxt-500">{card.desc}</p>
                  </div>
                </div>
                <p className="text-xs text-nxt-600">Estado: Activo</p>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State Ã¢â‚¬â€ 3-col comparison */}
        <div className="border-t border-nxt-200 pt-6 mt-6">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Empty State</h3>
          <p className="text-xs text-nxt-400 mb-4">Pantalla cuando no hay resultados, con icono, mensaje y CTA.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-nxt-100 flex items-center justify-center mb-3">
                <Inbox className="w-6 h-6 text-nxt-400" />
              </div>
              <h4 className="text-sm font-semibold text-nxt-800 mb-1">Sin resultados</h4>
              <p className="text-xs text-nxt-500 mb-3">
                No se encontraron registros.
              </p>
              <button className="nxt-btn-primary text-xs cursor-pointer active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2">
                <RefreshCw className="w-3.5 h-3.5" /> Limpiar filtros
              </button>
            </div>
          </div>
          {/* Gradiente */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-6 h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center mb-3">
                  <Inbox className="w-6 h-6 text-white/70" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">Sin resultados</h4>
                <p className="text-xs text-white/60 mb-3">
                  Intenta ajustar los parametros.
                </p>
                <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-nxt-md bg-white text-indigo-700 hover:shadow-lg transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2">
                  <RefreshCw className="w-3.5 h-3.5" /> Limpiar filtros
                </button>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-surface-darkest rounded-nxt-xl p-6 h-full flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-evergreen flex items-center justify-center mb-3">
                <Inbox className="w-6 h-6 text-gray-500" />
              </div>
              <h4 className="text-sm font-semibold text-gray-200 mb-1">Sin resultados</h4>
              <p className="text-xs text-gray-500 mb-3">
                No se encontraron registros.
              </p>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-nxt-md bg-pine text-white hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                <RefreshCw className="w-3.5 h-3.5" /> Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      {/* TOAST CONTAINER (fixed)                                       */}
      {/* Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-nxt-lg shadow-nxt-lg border border-nxt-200 overflow-hidden ${
                t.exiting ? "animate-toast-exit" : "animate-toast-enter"
              }`}
            >
              <div className="flex items-start gap-3 p-3 sm:p-4">
                {/* Icon container */}
                <div className="flex-shrink-0 mt-0.5">{toastIcon(t.type)}</div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-nxt-900">{t.title}</p>
                  <p className="text-xs text-nxt-500 mt-0.5">{t.message}</p>
                </div>
                {/* Close button */}
                <button
                  onClick={() => removeToast(t.id)}
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-nxt-md hover:bg-nxt-100 text-nxt-400 transition-colors cursor-pointer active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Progress bar */}
              <div className="h-1 w-full bg-nxt-100">
                <div className={`h-full ${toastAccent(t.type)} animate-toast-progress`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
