import { useEffect, useRef, useState, useCallback } from "react";
import {
  Bell, Mail, ShoppingCart, MessageCircle, Settings, X, ChevronDown,
  Plus, Minus, Trash2, User, UserPlus, UserMinus, Check, AlertTriangle,
  ExternalLink, MoreHorizontal, Phone, MapPin, Calendar, Star
} from "lucide-react";
import { ColorEditable } from "../components/ColorEditable";
import { resolveDefaultBg, resolveDominantColor, resolveHoverColor } from "../utils/tailwindColorMap";

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
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
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type StatusType = "online" | "busy" | "away" | "offline";
type PopoverPosition = "top" | "bottom" | "left" | "right";

interface PersonData {
  id: number;
  name: string;
  initials: string;
  color: string;
  status: StatusType;
}

/* ------------------------------------------------------------------ */
/*  People data                                                        */
/* ------------------------------------------------------------------ */

const PEOPLE: PersonData[] = [
  { id: 1, name: "Ana Torres", initials: "AT", color: "bg-blue-500", status: "online" },
  { id: 2, name: "Carlos Mendez", initials: "CM", color: "bg-emerald-500", status: "busy" },
  { id: 3, name: "Laura Rios", initials: "LR", color: "bg-purple-500", status: "away" },
  { id: 4, name: "Diego Vargas", initials: "DV", color: "bg-orange-500", status: "online" },
  { id: 5, name: "Sofia Paredes", initials: "SP", color: "bg-pink-500", status: "offline" },
  { id: 6, name: "Marco Fuentes", initials: "MF", color: "bg-teal-500", status: "online" },
  { id: 7, name: "Elena Cruz", initials: "EC", color: "bg-indigo-500", status: "busy" },
  { id: 8, name: "Roberto Salazar", initials: "RS", color: "bg-red-500", status: "away" },
  { id: 9, name: "Patricia Mora", initials: "PM", color: "bg-cyan-500", status: "online" },
  { id: 10, name: "Javier Herrera", initials: "JH", color: "bg-amber-600", status: "offline" },
];

/* ------------------------------------------------------------------ */
/*  Avatar component                                                   */
/* ------------------------------------------------------------------ */

const AVATAR_SIZES: Record<AvatarSize, { box: string; text: string; px: number; dot: string; dotPos: string }> = {
  xs: { box: "w-6 h-6", text: "text-[8px]", px: 24, dot: "w-2 h-2", dotPos: "-bottom-0 -right-0" },
  sm: { box: "w-8 h-8", text: "text-[10px]", px: 32, dot: "w-2.5 h-2.5", dotPos: "-bottom-0.5 -right-0.5" },
  md: { box: "w-10 h-10", text: "text-xs", px: 40, dot: "w-3 h-3", dotPos: "-bottom-0.5 -right-0.5" },
  lg: { box: "w-12 h-12", text: "text-sm", px: 48, dot: "w-3.5 h-3.5", dotPos: "-bottom-0.5 -right-0.5" },
  xl: { box: "w-16 h-16", text: "text-lg", px: 64, dot: "w-4 h-4", dotPos: "-bottom-0.5 -right-0.5" },
};

const STATUS_COLORS: Record<StatusType, string> = {
  online: "bg-green-500",
  busy: "bg-red-500",
  away: "bg-yellow-400",
  offline: "bg-gray-400",
};

function Avatar({
  person,
  size = "md",
  showStatus = false,
  showTooltip = false,
  onClick,
  dark = false,
}: {
  person: PersonData;
  size?: AvatarSize;
  showStatus?: boolean;
  showTooltip?: boolean;
  onClick?: () => void;
  dark?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const s = AVATAR_SIZES[size];

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`${s.box} ${person.color} rounded-full flex items-center justify-center text-white font-semibold ${s.text} select-none ring-2 ${dark ? "ring-nxt-800" : "ring-white"} ${onClick ? "cursor-pointer hover:ring-forest transition-all" : ""}`}
        onClick={onClick}
        title={!showTooltip ? person.name : undefined}
      >
        {person.initials}
      </div>
      {showStatus && (
        <span
          className={`absolute ${s.dotPos} ${s.dot} ${STATUS_COLORS[person.status]} rounded-full border-2 ${dark ? "border-nxt-800" : "border-white"}`}
        />
      )}
      {showTooltip && hovered && (
        <div className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap z-50 shadow-lg ${dark ? "bg-nxt-700 text-white" : "bg-nxt-900 text-white"}`}>
          {person.name}
          <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${dark ? "border-t-nxt-700" : "border-t-nxt-900"}`} />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AvatarGroup component                                              */
/* ------------------------------------------------------------------ */

function AvatarGroup({
  people,
  max = 4,
  size = "md",
  showTooltip = true,
  dark = false,
}: {
  people: PersonData[];
  max?: number;
  size?: AvatarSize;
  showTooltip?: boolean;
  dark?: boolean;
}) {
  const s = AVATAR_SIZES[size];
  const shown = people.slice(0, max);
  const overflow = people.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {shown.map((p) => (
        <Avatar key={p.id} person={p} size={size} showTooltip={showTooltip} dark={dark} />
      ))}
      {overflow > 0 && (
        <div
          className={`${s.box} rounded-full flex items-center justify-center ${s.text} font-semibold ring-2 ${dark ? "ring-nxt-800 bg-nxt-600 text-nxt-200" : "ring-white bg-nxt-200 text-nxt-600"} select-none`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NotificationBadge component                                        */
/* ------------------------------------------------------------------ */

function NotifBadge({
  count,
  dot = false,
  position = "top-right",
  pulse = false,
  children,
}: {
  count?: number;
  dot?: boolean;
  position?: "top-right" | "top-left" | "bottom-right";
  pulse?: boolean;
  children: React.ReactNode;
}) {
  const posClass =
    position === "top-right"
      ? "-top-1.5 -right-1.5"
      : position === "top-left"
        ? "-top-1.5 -left-1.5"
        : "-bottom-1.5 -right-1.5";

  const displayText = count !== undefined ? (count > 99 ? "99+" : String(count)) : "";
  const isVisible = dot || (count !== undefined && count > 0);

  return (
    <div className="relative inline-flex">
      {children}
      {isVisible && (
        <span
          className={`absolute ${posClass} flex items-center justify-center ${
            dot
              ? "w-2.5 h-2.5"
              : displayText.length >= 3
                ? "min-w-[22px] h-[18px] px-1"
                : "w-[18px] h-[18px]"
          } bg-error text-white text-[9px] font-bold rounded-full ${pulse ? "animate-pulse" : ""}`}
        >
          {!dot && displayText}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Popover component                                                  */
/* ------------------------------------------------------------------ */

function Popover({
  trigger,
  position = "bottom",
  open,
  onToggle,
  onClose,
  children,
  width = "w-64",
}: {
  trigger: React.ReactNode;
  position?: PopoverPosition;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  const posClasses: Record<PopoverPosition, string> = {
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses: Record<PopoverPosition, string> = {
    bottom: "-top-1.5 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-b-[6px] border-transparent border-b-white",
    top: "-bottom-1.5 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-white",
    left: "-right-1.5 top-1/2 -translate-y-1/2 border-t-[6px] border-b-[6px] border-l-[6px] border-transparent border-l-white",
    right: "-left-1.5 top-1/2 -translate-y-1/2 border-t-[6px] border-b-[6px] border-r-[6px] border-transparent border-r-white",
  };

  return (
    <div ref={ref} className="relative inline-flex">
      <div onClick={onToggle} className="cursor-pointer">
        {trigger}
      </div>
      {open && (
        <div className={`absolute ${posClasses[position]} ${width} z-50`}>
          <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
          <div className="bg-white rounded-xl border border-nxt-200 shadow-lg">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function FeedbackExtraSection({ scrollTo }: { scrollTo?: string }) {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTo]);

  /* ---- Avatar Group state ---- */
  const [groupMembers, setGroupMembers] = useState<PersonData[]>(PEOPLE.slice(0, 5));
  const [statusOverrides, setStatusOverrides] = useState<Record<number, StatusType>>({});
  const [showStatusDots, setShowStatusDots] = useState(true);

  const addMember = () => {
    const available = PEOPLE.filter((p) => !groupMembers.some((m) => m.id === p.id));
    if (available.length > 0) {
      setGroupMembers((prev) => [...prev, available[0]]);
    }
  };

  const removeMember = () => {
    if (groupMembers.length > 1) {
      setGroupMembers((prev) => prev.slice(0, -1));
    }
  };

  const cycleStatus = (personId: number) => {
    const order: StatusType[] = ["online", "busy", "away", "offline"];
    setStatusOverrides((prev) => {
      const current = prev[personId] ?? PEOPLE.find((p) => p.id === personId)?.status ?? "online";
      const idx = order.indexOf(current);
      const next = order[(idx + 1) % order.length];
      return { ...prev, [personId]: next };
    });
  };

  const getPersonWithStatus = (p: PersonData): PersonData => ({
    ...p,
    status: statusOverrides[p.id] ?? p.status,
  });

  /* ---- Notification Badge state ---- */
  const [bellCount, setBellCount] = useState(3);
  const [mailCount, setMailCount] = useState(12);
  const [cartCount, setCartCount] = useState(0);
  const [msgCount, setMsgCount] = useState(99);
  const [settingsCount, setSettingsCount] = useState(150);
  const [pulsing, setPulsing] = useState<string | null>(null);

  const triggerPulse = (key: string) => {
    setPulsing(key);
    setTimeout(() => setPulsing(null), 2000);
  };

  /* ---- Popover state ---- */
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [confirmResult, setConfirmResult] = useState<string | null>(null);

  const togglePopover = useCallback((id: string) => {
    setOpenPopover((prev) => (prev === id ? null : id));
  }, []);

  const closePopovers = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <div className="space-y-2">
      {/* ============================================================= */}
      {/* 1. AVATAR GROUP                                                */}
      {/* ============================================================= */}
      <Section
        id="avatar-group"
        title="Avatar Group"
        description="Avatares individuales con iniciales, indicadores de estado, grupos apilados con overflow y tooltips interactivos."
      >
        {/* --- Single avatars + sizes --- */}
        <h3 className="text-sm font-semibold text-nxt-700 mb-1">Avatares individuales y tamanos</h3>
        <p className="text-xs text-nxt-400 mb-4">Cinco tamanos disponibles: xs (24px), sm (32px), md (40px), lg (48px), xl (64px).</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex items-end gap-4 flex-wrap">
                {(["xs", "sm", "md", "lg", "xl"] as AvatarSize[]).map((sz) => (
                  <ColorEditable key={`avatar-size-l-${sz}`} elementKey={`feedback.avatar-size-l-${sz}`} defaultBg={resolveDominantColor(PEOPLE[0].color)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1.5">
                        <Avatar person={getPersonWithStatus(PEOPLE[0])} size={sz} showStatus showTooltip />
                        <span className="text-[9px] font-mono text-nxt-400">{sz} ({AVATAR_SIZES[sz].px}px)</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          {/* Gradient */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-end gap-4 flex-wrap">
                {(["xs", "sm", "md", "lg", "xl"] as AvatarSize[]).map((sz) => (
                  <ColorEditable key={`avatar-size-g-${sz}`} elementKey={`feedback.avatar-size-g-${sz}`} defaultBg={resolveDominantColor(PEOPLE[1].color)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1.5">
                        <Avatar person={getPersonWithStatus(PEOPLE[1])} size={sz} showStatus showTooltip dark />
                        <span className="text-[9px] font-mono text-nxt-400">{sz} ({AVATAR_SIZES[sz].px}px)</span>
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
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full">
              <div className="flex items-end gap-4 flex-wrap">
                {(["xs", "sm", "md", "lg", "xl"] as AvatarSize[]).map((sz) => (
                  <ColorEditable key={`avatar-size-d-${sz}`} elementKey={`feedback.avatar-size-d-${sz}`} defaultBg={resolveDominantColor(PEOPLE[2].color)}>
                    {(styles, openPicker, currentHex) => (
                      <div className="flex flex-col items-center gap-1.5">
                        <Avatar person={getPersonWithStatus(PEOPLE[2])} size={sz} showStatus showTooltip dark />
                        <span className="text-[9px] font-mono text-nxt-500">{sz} ({AVATAR_SIZES[sz].px}px)</span>
                      </div>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- Status indicators --- */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Indicadores de estado</h3>
          <p className="text-xs text-nxt-400 mb-4">Online (verde), busy (rojo), away (amarillo), offline (gris). Click en cada avatar para cambiar su estado.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light - Click para cambiar estado</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex items-center gap-5 flex-wrap">
                {PEOPLE.slice(0, 4).map((p) => {
                  const person = getPersonWithStatus(p);
                  return (
                    <ColorEditable key={`status-l-${p.id}`} elementKey={`feedback.avatar-status-l-${p.id}`} defaultBg={resolveDominantColor(p.color)}>
                      {(styles, openPicker, currentHex) => (
                        <div className="flex flex-col items-center gap-1.5">
                          <Avatar person={person} size="lg" showStatus showTooltip onClick={() => cycleStatus(p.id)} />
                          <span className="text-[10px] text-nxt-600 font-medium">{person.name.split(" ")[0]}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            person.status === "online" ? "bg-green-100 text-green-700" :
                            person.status === "busy" ? "bg-red-100 text-red-700" :
                            person.status === "away" ? "bg-yellow-100 text-yellow-700" :
                            "bg-gray-100 text-gray-500"
                          }`}>
                            {person.status}
                          </span>
                        </div>
                      )}
                    </ColorEditable>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Gradient */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente - Click para cambiar estado</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-5 flex-wrap">
                {PEOPLE.slice(0, 4).map((p) => {
                  const person = getPersonWithStatus(p);
                  return (
                    <ColorEditable key={`status-g-${p.id}`} elementKey={`feedback.avatar-status-g-${p.id}`} defaultBg={resolveDominantColor(p.color)}>
                      {(styles, openPicker, currentHex) => (
                        <div className="flex flex-col items-center gap-1.5">
                          <Avatar person={person} size="lg" showStatus showTooltip dark onClick={() => cycleStatus(p.id)} />
                          <span className="text-[10px] text-nxt-300 font-medium">{person.name.split(" ")[0]}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            person.status === "online" ? "bg-green-900/40 text-green-400" :
                            person.status === "busy" ? "bg-red-900/40 text-red-400" :
                            person.status === "away" ? "bg-yellow-900/40 text-yellow-400" :
                            "bg-nxt-700 text-nxt-400"
                          }`}>
                            {person.status}
                          </span>
                        </div>
                      )}
                    </ColorEditable>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark - Click para cambiar estado</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full">
              <div className="flex items-center gap-5 flex-wrap">
                {PEOPLE.slice(4, 8).map((p) => {
                  const person = getPersonWithStatus(p);
                  return (
                    <ColorEditable key={`status-d-${p.id}`} elementKey={`feedback.avatar-status-d-${p.id}`} defaultBg={resolveDominantColor(p.color)}>
                      {(styles, openPicker, currentHex) => (
                        <div className="flex flex-col items-center gap-1.5">
                          <Avatar person={person} size="lg" showStatus showTooltip dark onClick={() => cycleStatus(p.id)} />
                          <span className="text-[10px] text-nxt-300 font-medium">{person.name.split(" ")[0]}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            person.status === "online" ? "bg-green-900/40 text-green-400" :
                            person.status === "busy" ? "bg-red-900/40 text-red-400" :
                            person.status === "away" ? "bg-yellow-900/40 text-yellow-400" :
                            "bg-nxt-700 text-nxt-400"
                          }`}>
                            {person.status}
                          </span>
                        </div>
                      )}
                    </ColorEditable>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* --- Avatar groups with overflow --- */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Grupos apilados con overflow</h3>
          <p className="text-xs text-nxt-400 mb-4">Grupos de 3, 5 y 8 personas con badge +N para los que no se muestran. Hover para ver nombre.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-nxt-500 font-medium w-16">3 people</span>
                <AvatarGroup people={PEOPLE.slice(0, 3).map(getPersonWithStatus)} max={3} size="md" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-nxt-500 font-medium w-16">5 people</span>
                <AvatarGroup people={PEOPLE.slice(0, 5).map(getPersonWithStatus)} max={3} size="md" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-nxt-500 font-medium w-16">8 people</span>
                <AvatarGroup people={PEOPLE.slice(0, 8).map(getPersonWithStatus)} max={4} size="md" />
              </div>
            </div>
          </div>
          {/* Gradient */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-nxt-300 font-medium w-16">3 people</span>
                  <AvatarGroup people={PEOPLE.slice(0, 3).map(getPersonWithStatus)} max={3} size="md" dark />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-nxt-300 font-medium w-16">5 people</span>
                  <AvatarGroup people={PEOPLE.slice(0, 5).map(getPersonWithStatus)} max={3} size="md" dark />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-nxt-300 font-medium w-16">8 people</span>
                  <AvatarGroup people={PEOPLE.slice(0, 8).map(getPersonWithStatus)} max={4} size="md" dark />
                </div>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-nxt-400 font-medium w-16">3 people</span>
                <AvatarGroup people={PEOPLE.slice(0, 3).map(getPersonWithStatus)} max={3} size="md" dark />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-nxt-400 font-medium w-16">5 people</span>
                <AvatarGroup people={PEOPLE.slice(0, 5).map(getPersonWithStatus)} max={3} size="md" dark />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-nxt-400 font-medium w-16">8 people</span>
                <AvatarGroup people={PEOPLE.slice(0, 8).map(getPersonWithStatus)} max={4} size="md" dark />
              </div>
            </div>
          </div>
        </div>

        {/* --- Interactive group builder --- */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Constructor interactivo</h3>
          <p className="text-xs text-nxt-400 mb-4">Agrega o elimina miembros del grupo. Toggle para indicadores de estado.</p>
        </div>

        <div className="nxt-card p-5 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <ColorEditable elementKey="feedback.avatar-add-btn" defaultBg={resolveDominantColor("bg-green-600")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-green-600")}>
              {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                <button
                  onClick={addMember}
                  disabled={groupMembers.length >= PEOPLE.length}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-success text-white hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={styles}
                  {...hoverHandlers}
                >
                  <UserPlus className="w-3.5 h-3.5" /> Agregar
                </button>
              )}
            </ColorEditable>
            <ColorEditable elementKey="feedback.avatar-remove-btn" defaultBg={resolveDominantColor("bg-red-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-red-500")}>
              {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                <button
                  onClick={removeMember}
                  disabled={groupMembers.length <= 1}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-error text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={styles}
                  {...hoverHandlers}
                >
                  <UserMinus className="w-3.5 h-3.5" /> Eliminar
                </button>
              )}
            </ColorEditable>
            <button
              onClick={() => setShowStatusDots((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                showStatusDots
                  ? "bg-forest text-white border-bark"
                  : "bg-white text-nxt-600 border-nxt-300 hover:bg-nxt-50"
              }`}
            >
              {showStatusDots ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5 h-3.5" />}
              Estado
            </button>
            <span className="text-xs text-nxt-400">
              {groupMembers.length} / {PEOPLE.length} miembros
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {/* Shown individually */}
            <div className="flex items-center -space-x-1">
              {groupMembers.map((p) => (
                <Avatar
                  key={p.id}
                  person={getPersonWithStatus(p)}
                  size="lg"
                  showStatus={showStatusDots}
                  showTooltip
                  onClick={() => cycleStatus(p.id)}
                />
              ))}
            </div>

            <div className="h-10 w-px bg-nxt-200" />

            {/* As group with max=4 */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-nxt-400 font-medium uppercase tracking-wider">Grupo (max 4)</span>
              <AvatarGroup people={groupMembers.map(getPersonWithStatus)} max={4} size="lg" showTooltip />
            </div>

            <div className="h-10 w-px bg-nxt-200" />

            {/* As group with max=3 */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-nxt-400 font-medium uppercase tracking-wider">Grupo (max 3)</span>
              <AvatarGroup people={groupMembers.map(getPersonWithStatus)} max={3} size="md" showTooltip />
            </div>
          </div>
        </div>

      </Section>

      {/* ============================================================= */}
      {/* 2. NOTIFICATION BADGE                                          */}
      {/* ============================================================= */}
      <Section
        id="notification-badge"
        title="Notification Badge"
        description="Badges de notificacion con conteo, punto indicador, posiciones multiples, pulso animado y combinaciones con iconos, avatares y botones."
      >
        {/* --- Dot vs Number --- */}
        <h3 className="text-sm font-semibold text-nxt-700 mb-1">Tipos de badge</h3>
        <p className="text-xs text-nxt-400 mb-4">Punto rojo sin numero, con conteo numerico (1-99) y overflow 99+.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex items-center gap-8 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-dot-l" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge dot>
                        <Bell className="w-6 h-6 text-nxt-600" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Dot</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-count3-l" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={3}>
                        <Bell className="w-6 h-6 text-nxt-600" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Count: 3</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-count42-l" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={42}>
                        <Mail className="w-6 h-6 text-nxt-600" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Count: 42</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-count99-l" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={99}>
                        <MessageCircle className="w-6 h-6 text-nxt-600" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Count: 99</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-overflow-l" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={150}>
                        <ShoppingCart className="w-6 h-6 text-nxt-600" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Count: 99+</span>
                </div>
              </div>
            </div>
          </div>
          {/* Gradient */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-8 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-dot-g" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge dot>
                        <Bell className="w-6 h-6 text-white/80" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Dot</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-count3-g" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={3}>
                        <Bell className="w-6 h-6 text-white/80" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Count: 3</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-count42-g" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={42}>
                        <Mail className="w-6 h-6 text-white/80" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Count: 42</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-count99-g" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={99}>
                        <MessageCircle className="w-6 h-6 text-white/80" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Count: 99</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-overflow-g" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={150}>
                        <ShoppingCart className="w-6 h-6 text-white/80" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Count: 99+</span>
                </div>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full">
              <div className="flex items-center gap-8 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-dot-d" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge dot>
                        <Bell className="w-6 h-6 text-nxt-300" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-500">Dot</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-count3-d" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={3}>
                        <Bell className="w-6 h-6 text-nxt-300" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-500">Count: 3</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-count42-d" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={42}>
                        <Mail className="w-6 h-6 text-nxt-300" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-500">Count: 42</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-count99-d" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={99}>
                        <MessageCircle className="w-6 h-6 text-nxt-300" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-500">Count: 99</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ColorEditable elementKey="feedback.badge-overflow-d" defaultBg={resolveDominantColor("bg-red-500")}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={150}>
                        <ShoppingCart className="w-6 h-6 text-nxt-300" />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-500">Count: 99+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Badge positions --- */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Posiciones del badge</h3>
          <p className="text-xs text-nxt-400 mb-4">Top-right (default), top-left y bottom-right.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex items-center gap-10 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <NotifBadge count={5} position="top-right">
                    <div className="w-10 h-10 bg-nxt-100 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-nxt-600" />
                    </div>
                  </NotifBadge>
                  <span className="text-[9px] text-nxt-400">top-right</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NotifBadge count={5} position="top-left">
                    <div className="w-10 h-10 bg-nxt-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-nxt-600" />
                    </div>
                  </NotifBadge>
                  <span className="text-[9px] text-nxt-400">top-left</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NotifBadge count={5} position="bottom-right">
                    <div className="w-10 h-10 bg-nxt-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-nxt-600" />
                    </div>
                  </NotifBadge>
                  <span className="text-[9px] text-nxt-400">bottom-right</span>
                </div>
              </div>
            </div>
          </div>
          {/* Gradient */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-10 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <NotifBadge count={5} position="top-right">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white/80" />
                    </div>
                  </NotifBadge>
                  <span className="text-[9px] text-nxt-400">top-right</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NotifBadge count={5} position="top-left">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white/80" />
                    </div>
                  </NotifBadge>
                  <span className="text-[9px] text-nxt-400">top-left</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NotifBadge count={5} position="bottom-right">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white/80" />
                    </div>
                  </NotifBadge>
                  <span className="text-[9px] text-nxt-400">bottom-right</span>
                </div>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full">
              <div className="flex items-center gap-10 flex-wrap">
                <div className="flex flex-col items-center gap-2">
                  <NotifBadge count={5} position="top-right">
                    <div className="w-10 h-10 bg-nxt-700 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-nxt-300" />
                    </div>
                  </NotifBadge>
                  <span className="text-[9px] text-nxt-500">top-right</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NotifBadge count={5} position="top-left">
                    <div className="w-10 h-10 bg-nxt-700 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-nxt-300" />
                    </div>
                  </NotifBadge>
                  <span className="text-[9px] text-nxt-500">top-left</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <NotifBadge count={5} position="bottom-right">
                    <div className="w-10 h-10 bg-nxt-700 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-nxt-300" />
                    </div>
                  </NotifBadge>
                  <span className="text-[9px] text-nxt-500">bottom-right</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Pulse animation --- */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Animacion de pulso</h3>
          <p className="text-xs text-nxt-400 mb-4">Click en "Nueva notificacion" para activar el pulso durante 2 segundos.</p>
        </div>

        <div className="nxt-card p-5 mb-8">
          <div className="flex items-center gap-6 flex-wrap">
            <NotifBadge count={bellCount} pulse={pulsing === "bell"}>
              <Bell className="w-7 h-7 text-nxt-600" />
            </NotifBadge>
            <NotifBadge count={mailCount} pulse={pulsing === "mail"}>
              <Mail className="w-7 h-7 text-nxt-600" />
            </NotifBadge>
            <div className="h-8 w-px bg-nxt-200" />
            <ColorEditable elementKey="feedback.badge-pulse-bell" defaultBg={resolveDominantColor("nxt-btn-primary")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-primary")}>
              {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                <button
                  onClick={() => {
                    setBellCount((c) => c + 1);
                    triggerPulse("bell");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-forest text-white hover:bg-bark transition-colors"
                  style={styles}
                  {...hoverHandlers}
                >
                  <Plus className="w-3.5 h-3.5" /> Nueva en Bell
                </button>
              )}
            </ColorEditable>
            <ColorEditable elementKey="feedback.badge-pulse-mail" defaultBg={resolveDominantColor("bg-blue-600")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-blue-600")}>
              {(styles, openPicker, currentHex, hoverHandlers, hoverHex) => (
                <button
                  onClick={() => {
                    setMailCount((c) => c + 1);
                    triggerPulse("mail");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-info text-white hover:bg-blue-700 transition-colors"
                  style={styles}
                  {...hoverHandlers}
                >
                  <Plus className="w-3.5 h-3.5" /> Nueva en Mail
                </button>
              )}
            </ColorEditable>
          </div>
        </div>

        {/* --- Badge on various icons --- */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Badges en distintos iconos</h3>
          <p className="text-xs text-nxt-400 mb-4">Bell, Mail, ShoppingCart, MessageCircle, Settings con conteos diferentes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex items-center gap-6 flex-wrap">
                {[
                  { icon: Bell, count: bellCount, label: "Bell" },
                  { icon: Mail, count: mailCount, label: "Mail" },
                  { icon: ShoppingCart, count: cartCount, label: "Cart" },
                  { icon: MessageCircle, count: msgCount, label: "Messages" },
                  { icon: Settings, count: settingsCount, label: "Settings" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5">
                    <NotifBadge count={item.count}>
                      <item.icon className="w-6 h-6 text-nxt-600" />
                    </NotifBadge>
                    <span className="text-[9px] text-nxt-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Gradient */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-6 flex-wrap">
                {[
                  { icon: Bell, count: bellCount, label: "Bell" },
                  { icon: Mail, count: mailCount, label: "Mail" },
                  { icon: ShoppingCart, count: cartCount, label: "Cart" },
                  { icon: MessageCircle, count: msgCount, label: "Messages" },
                  { icon: Settings, count: settingsCount, label: "Settings" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5">
                    <NotifBadge count={item.count}>
                      <item.icon className="w-6 h-6 text-white/80" />
                    </NotifBadge>
                    <span className="text-[9px] text-nxt-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full">
              <div className="flex items-center gap-6 flex-wrap">
                {[
                  { icon: Bell, count: bellCount, label: "Bell" },
                  { icon: Mail, count: mailCount, label: "Mail" },
                  { icon: ShoppingCart, count: cartCount, label: "Cart" },
                  { icon: MessageCircle, count: msgCount, label: "Messages" },
                  { icon: Settings, count: settingsCount, label: "Settings" },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5">
                    <NotifBadge count={item.count}>
                      <item.icon className="w-6 h-6 text-nxt-300" />
                    </NotifBadge>
                    <span className="text-[9px] text-nxt-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- Badge on avatar and button --- */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Badge en avatar y boton</h3>
          <p className="text-xs text-nxt-400 mb-4">Badges combinados con avatares y botones.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex flex-col items-center gap-1.5">
                  <ColorEditable elementKey="feedback.badge-avatar-l" defaultBg={resolveDominantColor(PEOPLE[0].color)}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={3}>
                        <Avatar person={getPersonWithStatus(PEOPLE[0])} size="lg" showStatus={false} />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Avatar + badge</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <ColorEditable elementKey="feedback.badge-avatar-dot-l" defaultBg={resolveDominantColor(PEOPLE[2].color)}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge dot>
                        <Avatar person={getPersonWithStatus(PEOPLE[2])} size="md" showStatus={false} />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Avatar + dot</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <NotifBadge count={bellCount}>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-nxt-100 text-nxt-700 hover:bg-nxt-200 transition-colors">
                      <Bell className="w-4 h-4" /> Notificaciones
                    </button>
                  </NotifBadge>
                  <span className="text-[9px] text-nxt-400">Button + badge</span>
                </div>
              </div>
            </div>
          </div>
          {/* Gradient */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-6 flex-wrap">
                <div className="flex flex-col items-center gap-1.5">
                  <ColorEditable elementKey="feedback.badge-avatar-g" defaultBg={resolveDominantColor(PEOPLE[3].color)}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={3}>
                        <Avatar person={getPersonWithStatus(PEOPLE[3])} size="lg" showStatus={false} dark />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Avatar + badge</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <ColorEditable elementKey="feedback.badge-avatar-dot-g" defaultBg={resolveDominantColor(PEOPLE[5].color)}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge dot>
                        <Avatar person={getPersonWithStatus(PEOPLE[5])} size="md" showStatus={false} dark />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-400">Avatar + dot</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <NotifBadge count={bellCount}>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                      <Bell className="w-4 h-4" /> Notificaciones
                    </button>
                  </NotifBadge>
                  <span className="text-[9px] text-nxt-400">Button + badge</span>
                </div>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex flex-col items-center gap-1.5">
                  <ColorEditable elementKey="feedback.badge-avatar-d" defaultBg={resolveDominantColor(PEOPLE[6].color)}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge count={3}>
                        <Avatar person={getPersonWithStatus(PEOPLE[6])} size="lg" showStatus={false} dark />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-500">Avatar + badge</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <ColorEditable elementKey="feedback.badge-avatar-dot-d" defaultBg={resolveDominantColor(PEOPLE[8].color)}>
                    {(styles, openPicker, currentHex) => (
                      <NotifBadge dot>
                        <Avatar person={getPersonWithStatus(PEOPLE[8])} size="md" showStatus={false} dark />
                      </NotifBadge>
                    )}
                  </ColorEditable>
                  <span className="text-[9px] text-nxt-500">Avatar + dot</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <NotifBadge count={bellCount}>
                    <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-nxt-700 text-nxt-200 hover:bg-nxt-600 transition-colors">
                      <Bell className="w-4 h-4" /> Notificaciones
                    </button>
                  </NotifBadge>
                  <span className="text-[9px] text-nxt-500">Button + badge</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Interactive counter --- */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Control interactivo</h3>
          <p className="text-xs text-nxt-400 mb-4">Incrementa, decrementa o limpia los contadores de cada icono.</p>
        </div>

        <div className="nxt-card p-5 mb-8">
          <div className="space-y-4">
            {[
              { key: "bell", icon: Bell, label: "Bell", count: bellCount, set: setBellCount },
              { key: "mail", icon: Mail, label: "Mail", count: mailCount, set: setMailCount },
              { key: "cart", icon: ShoppingCart, label: "Cart", count: cartCount, set: setCartCount },
              { key: "msg", icon: MessageCircle, label: "Messages", count: msgCount, set: setMsgCount },
              { key: "settings", icon: Settings, label: "Settings", count: settingsCount, set: setSettingsCount },
            ].map((item) => (
              <div key={item.key} className="flex items-center gap-4">
                <div className="w-20 flex items-center gap-2">
                  <NotifBadge count={item.count} pulse={pulsing === item.key}>
                    <item.icon className="w-5 h-5 text-nxt-600" />
                  </NotifBadge>
                  <span className="text-xs text-nxt-600 font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ColorEditable elementKey={`feedback.counter-add-${item.key}`} defaultBg={resolveDominantColor("bg-green-600")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-green-600")}>
                    {(styles, openPicker, currentHex, hoverHandlers) => (
                      <button
                        onClick={() => {
                          item.set((c: number) => c + 1);
                          triggerPulse(item.key);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-success text-white hover:bg-green-700 transition-colors text-xs"
                        style={styles}
                        {...hoverHandlers}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </ColorEditable>
                  <ColorEditable elementKey={`feedback.counter-sub-${item.key}`} defaultBg={resolveDominantColor("bg-yellow-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-yellow-500")}>
                    {(styles, openPicker, currentHex, hoverHandlers) => (
                      <button
                        onClick={() => item.set((c: number) => Math.max(0, c - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-warning text-white hover:bg-yellow-700 transition-colors text-xs"
                        style={styles}
                        {...hoverHandlers}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </ColorEditable>
                  <ColorEditable elementKey={`feedback.counter-clear-${item.key}`} defaultBg={resolveDominantColor("bg-red-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-red-500")}>
                    {(styles, openPicker, currentHex, hoverHandlers) => (
                      <button
                        onClick={() => item.set(0)}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-error text-white hover:bg-red-700 transition-colors text-xs"
                        style={styles}
                        {...hoverHandlers}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </ColorEditable>
                  <span className="text-xs text-nxt-400 font-mono ml-2 w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </Section>

      {/* ============================================================= */}
      {/* 3. POPOVER                                                     */}
      {/* ============================================================= */}
      <Section
        id="popover"
        title="Popover"
        description="Popovers con contenido enriquecido, multiples posiciones, botones de accion, tarjetas de perfil y confirmaciones. Click fuera para cerrar."
      >
        {/* --- Basic popover + positions --- */}
        <h3 className="text-sm font-semibold text-nxt-700 mb-1">Posiciones</h3>
        <p className="text-xs text-nxt-400 mb-4">Top, bottom, left, right. Click en cada boton para abrir el popover.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex items-center justify-center gap-6 flex-wrap py-16">
                {(["top", "bottom"] as PopoverPosition[]).map((pos) => (
                  <Popover
                    key={pos}
                    position={pos}
                    open={openPopover === `pos-l-${pos}`}
                    onToggle={() => togglePopover(`pos-l-${pos}`)}
                    onClose={closePopovers}
                    trigger={
                      <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-nxt-100 text-nxt-700 hover:bg-nxt-200 border border-nxt-200 transition-colors capitalize">
                        {pos}
                      </button>
                    }
                  >
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-nxt-900 mb-1">Popover {pos}</h4>
                      <p className="text-xs text-nxt-500">Este popover aparece en posicion <span className="font-semibold text-nxt-700">{pos}</span> del elemento trigger.</p>
                    </div>
                  </Popover>
                ))}
              </div>
            </div>
          </div>
          {/* Gradient */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-center justify-center gap-6 flex-wrap py-16">
                {(["left", "right"] as PopoverPosition[]).map((pos) => (
                  <Popover
                    key={pos}
                    position={pos}
                    open={openPopover === `pos-g-${pos}`}
                    onToggle={() => togglePopover(`pos-g-${pos}`)}
                    onClose={closePopovers}
                    trigger={
                      <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-white/20 text-white hover:bg-white/30 border border-white/20 transition-colors capitalize">
                        {pos}
                      </button>
                    }
                  >
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-nxt-900 mb-1">Popover {pos}</h4>
                      <p className="text-xs text-nxt-500">Este popover aparece en posicion <span className="font-semibold text-nxt-700">{pos}</span> del elemento trigger.</p>
                    </div>
                  </Popover>
                ))}
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full">
              <div className="flex items-center justify-center gap-6 flex-wrap py-16">
                {(["top", "bottom", "left", "right"] as PopoverPosition[]).map((pos) => (
                  <Popover
                    key={pos}
                    position={pos}
                    open={openPopover === `pos-d-${pos}`}
                    onToggle={() => togglePopover(`pos-d-${pos}`)}
                    onClose={closePopovers}
                    trigger={
                      <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-nxt-700 text-nxt-200 hover:bg-nxt-600 border border-nxt-600 transition-colors capitalize">
                        {pos}
                      </button>
                    }
                  >
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-nxt-900 mb-1">Popover {pos}</h4>
                      <p className="text-xs text-nxt-500">Este popover aparece en posicion <span className="font-semibold text-nxt-700">{pos}</span> del elemento trigger.</p>
                    </div>
                  </Popover>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- With close button --- */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Con boton de cerrar</h3>
          <p className="text-xs text-nxt-400 mb-4">Popover con header, contenido y boton X para cerrar.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex items-center gap-6 flex-wrap py-4">
                <Popover
                  position="bottom"
                  open={openPopover === "close-btn-l"}
                  onToggle={() => togglePopover("close-btn-l")}
                  onClose={closePopovers}
                  trigger={
                    <ColorEditable elementKey="feedback.popover-notif-l" defaultBg={resolveDominantColor("nxt-btn-primary")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-primary")}>
                      {(styles, openPicker, currentHex, hoverHandlers) => (
                        <button
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-forest text-white hover:bg-bark transition-colors"
                          style={styles}
                          {...hoverHandlers}
                        >
                          <Bell className="w-3.5 h-3.5" /> Notificaciones
                        </button>
                      )}
                    </ColorEditable>
                  }
                  width="w-72"
                >
                  <div className="flex items-center justify-between p-3 border-b border-nxt-100">
                    <h4 className="text-sm font-semibold text-nxt-900">Notificaciones</h4>
                    <button
                      onClick={closePopovers}
                      className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-nxt-100 text-nxt-400 hover:text-nxt-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3 space-y-2">
                    {[
                      { text: "Ana Torres te mencion\u00f3 en un comentario", time: "Hace 5 min" },
                      { text: "Nuevo deploy completado exitosamente", time: "Hace 15 min" },
                      { text: "Carlos Mendez actualiz\u00f3 el proyecto", time: "Hace 1 hora" },
                    ].map((notif, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-nxt-50 cursor-pointer transition-colors">
                        <div className="w-2 h-2 rounded-full bg-info mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-nxt-700">{notif.text}</p>
                          <span className="text-[10px] text-nxt-400">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-nxt-100">
                    <button className="w-full text-center text-xs text-info hover:text-blue-800 font-medium py-1 transition-colors">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </Popover>
              </div>
            </div>
          </div>
          {/* Gradient */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-6 flex-wrap py-4">
                <Popover
                  position="bottom"
                  open={openPopover === "close-btn-g"}
                  onToggle={() => togglePopover("close-btn-g")}
                  onClose={closePopovers}
                  trigger={
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                      <Bell className="w-3.5 h-3.5" /> Notificaciones
                    </button>
                  }
                  width="w-72"
                >
                  <div className="flex items-center justify-between p-3 border-b border-nxt-100">
                    <h4 className="text-sm font-semibold text-nxt-900">Notificaciones</h4>
                    <button
                      onClick={closePopovers}
                      className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-nxt-100 text-nxt-400 hover:text-nxt-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3 space-y-2">
                    {[
                      { text: "Ana Torres te mencion\u00f3 en un comentario", time: "Hace 5 min" },
                      { text: "Nuevo deploy completado exitosamente", time: "Hace 15 min" },
                    ].map((notif, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-nxt-50 cursor-pointer transition-colors">
                        <div className="w-2 h-2 rounded-full bg-info mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-nxt-700">{notif.text}</p>
                          <span className="text-[10px] text-nxt-400">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-nxt-100">
                    <button className="w-full text-center text-xs text-info hover:text-blue-800 font-medium py-1 transition-colors">
                      Ver todas
                    </button>
                  </div>
                </Popover>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full">
              <div className="flex items-center gap-6 flex-wrap py-4">
                <Popover
                  position="bottom"
                  open={openPopover === "close-btn-d"}
                  onToggle={() => togglePopover("close-btn-d")}
                  onClose={closePopovers}
                  trigger={
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-nxt-700 text-nxt-200 hover:bg-nxt-600 transition-colors">
                      <Bell className="w-3.5 h-3.5" /> Notificaciones
                    </button>
                  }
                  width="w-72"
                >
                  <div className="flex items-center justify-between p-3 border-b border-nxt-100">
                    <h4 className="text-sm font-semibold text-nxt-900">Notificaciones</h4>
                    <button
                      onClick={closePopovers}
                      className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-nxt-100 text-nxt-400 hover:text-nxt-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="p-3 space-y-2">
                    {[
                      { text: "Ana Torres te mencion\u00f3 en un comentario", time: "Hace 5 min" },
                      { text: "Carlos Mendez actualiz\u00f3 el proyecto", time: "Hace 1 hora" },
                    ].map((notif, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-nxt-50 cursor-pointer transition-colors">
                        <div className="w-2 h-2 rounded-full bg-info mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-nxt-700">{notif.text}</p>
                          <span className="text-[10px] text-nxt-400">{notif.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-nxt-100">
                    <button className="w-full text-center text-xs text-info hover:text-blue-800 font-medium py-1 transition-colors">
                      Ver todas
                    </button>
                  </div>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* --- With action buttons --- */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Con botones de accion</h3>
          <p className="text-xs text-nxt-400 mb-4">Footer con acciones primaria y secundaria.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex items-center gap-6 flex-wrap py-4">
                <Popover
                  position="bottom"
                  open={openPopover === "action-btns-l"}
                  onToggle={() => togglePopover("action-btns-l")}
                  onClose={closePopovers}
                  trigger={
                    <ColorEditable elementKey="feedback.popover-action-l" defaultBg={resolveDominantColor("bg-gray-800")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-gray-800")}>
                      {(styles, openPicker, currentHex, hoverHandlers) => (
                        <button
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-nxt-800 text-white hover:bg-nxt-700 transition-colors"
                          style={styles}
                          {...hoverHandlers}
                        >
                          <Settings className="w-3.5 h-3.5" /> Configuracion
                        </button>
                      )}
                    </ColorEditable>
                  }
                  width="w-72"
                >
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-nxt-900 mb-2">Preferencias de notificacion</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Notificaciones por email", default: true },
                        { label: "Notificaciones push", default: false },
                        { label: "Sonido de alerta", default: true },
                      ].map((pref) => (
                        <ToggleRow key={pref.label} label={pref.label} defaultChecked={pref.default} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 p-3 border-t border-nxt-100">
                    <button
                      onClick={closePopovers}
                      className="px-3 py-1.5 text-xs font-medium rounded-md text-nxt-600 hover:bg-nxt-100 transition-colors"
                    >
                      Cancelar
                    </button>
                    <ColorEditable elementKey="feedback.popover-save-l" defaultBg={resolveDominantColor("nxt-btn-primary")} hasHover={true} defaultHoverBg={resolveHoverColor("nxt-btn-primary")}>
                      {(styles, openPicker, currentHex, hoverHandlers) => (
                        <button
                          onClick={closePopovers}
                          className="px-3 py-1.5 text-xs font-medium rounded-md bg-forest text-white hover:bg-bark transition-colors"
                          style={styles}
                          {...hoverHandlers}
                        >
                          Guardar cambios
                        </button>
                      )}
                    </ColorEditable>
                  </div>
                </Popover>
              </div>
            </div>
          </div>
          {/* Gradient */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-6 flex-wrap py-4">
                <Popover
                  position="bottom"
                  open={openPopover === "action-btns-g"}
                  onToggle={() => togglePopover("action-btns-g")}
                  onClose={closePopovers}
                  trigger={
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors">
                      <Settings className="w-3.5 h-3.5" /> Configuracion
                    </button>
                  }
                  width="w-72"
                >
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-nxt-900 mb-2">Preferencias de notificacion</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Notificaciones por email", default: true },
                        { label: "Sonido de alerta", default: true },
                      ].map((pref) => (
                        <ToggleRow key={pref.label} label={pref.label} defaultChecked={pref.default} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 p-3 border-t border-nxt-100">
                    <button
                      onClick={closePopovers}
                      className="px-3 py-1.5 text-xs font-medium rounded-md text-nxt-600 hover:bg-nxt-100 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={closePopovers}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-forest text-white hover:bg-bark transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                </Popover>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full">
              <div className="flex items-center gap-6 flex-wrap py-4">
                <Popover
                  position="bottom"
                  open={openPopover === "action-btns-d"}
                  onToggle={() => togglePopover("action-btns-d")}
                  onClose={closePopovers}
                  trigger={
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-nxt-700 text-nxt-200 hover:bg-nxt-600 transition-colors">
                      <Settings className="w-3.5 h-3.5" /> Configuracion
                    </button>
                  }
                  width="w-72"
                >
                  <div className="p-4">
                    <h4 className="text-sm font-semibold text-nxt-900 mb-2">Preferencias de notificacion</h4>
                    <div className="space-y-3">
                      {[
                        { label: "Notificaciones por email", default: true },
                        { label: "Notificaciones push", default: false },
                      ].map((pref) => (
                        <ToggleRow key={pref.label} label={pref.label} defaultChecked={pref.default} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 p-3 border-t border-nxt-100">
                    <button
                      onClick={closePopovers}
                      className="px-3 py-1.5 text-xs font-medium rounded-md text-nxt-600 hover:bg-nxt-100 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={closePopovers}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-forest text-white hover:bg-bark transition-colors"
                    >
                      Guardar
                    </button>
                  </div>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* --- Rich content: Profile card --- */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Tarjeta de perfil (contenido enriquecido)</h3>
          <p className="text-xs text-nxt-400 mb-4">Popover con avatar, nombre, rol y acciones rapidas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex items-center gap-4 flex-wrap py-8">
                {PEOPLE.slice(0, 3).map((person) => (
                  <ColorEditable key={`profile-l-${person.id}`} elementKey={`feedback.popover-profile-l-${person.id}`} defaultBg={resolveDominantColor(person.color)}>
                    {(styles, openPicker, currentHex) => (
                      <Popover
                        position="bottom"
                        open={openPopover === `profile-${person.id}`}
                        onToggle={() => togglePopover(`profile-${person.id}`)}
                        onClose={closePopovers}
                        width="w-64"
                        trigger={
                          <Avatar person={getPersonWithStatus(person)} size="lg" showStatus showTooltip={false} />
                        }
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 ${person.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                              {person.initials}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-nxt-900">{person.name}</h4>
                              <p className="text-[11px] text-nxt-500">Ingeniero de Software</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[person.status]}`} />
                                <span className="text-[10px] text-nxt-400 capitalize">{person.status}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-2 text-[11px] text-nxt-500">
                              <Mail className="w-3 h-3" />
                              <span>{person.name.toLowerCase().replace(" ", ".")}@forest.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-nxt-500">
                              <MapPin className="w-3 h-3" />
                              <span>Ciudad de Mexico, MX</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-nxt-500">
                              <Calendar className="w-3 h-3" />
                              <span>Miembro desde Ene 2025</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 border-t border-nxt-100">
                          <button className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-md bg-forest text-white hover:bg-bark transition-colors">
                            <MessageCircle className="w-3 h-3" /> Mensaje
                          </button>
                          <button className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-md bg-nxt-100 text-nxt-700 hover:bg-nxt-200 transition-colors">
                            <Phone className="w-3 h-3" /> Llamar
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-nxt-100 text-nxt-400 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </Popover>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          {/* Gradient */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-4 flex-wrap py-8">
                {PEOPLE.slice(3, 6).map((person) => (
                  <ColorEditable key={`profile-g-${person.id}`} elementKey={`feedback.popover-profile-g-${person.id}`} defaultBg={resolveDominantColor(person.color)}>
                    {(styles, openPicker, currentHex) => (
                      <Popover
                        position="bottom"
                        open={openPopover === `profile-grad-${person.id}`}
                        onToggle={() => togglePopover(`profile-grad-${person.id}`)}
                        onClose={closePopovers}
                        width="w-64"
                        trigger={
                          <Avatar person={getPersonWithStatus(person)} size="lg" showStatus showTooltip={false} dark />
                        }
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 ${person.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                              {person.initials}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-nxt-900">{person.name}</h4>
                              <p className="text-[11px] text-nxt-500">Ingeniero de Software</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[person.status]}`} />
                                <span className="text-[10px] text-nxt-400 capitalize">{person.status}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-2 text-[11px] text-nxt-500">
                              <Mail className="w-3 h-3" />
                              <span>{person.name.toLowerCase().replace(" ", ".")}@forest.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-nxt-500">
                              <MapPin className="w-3 h-3" />
                              <span>Ciudad de Mexico, MX</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 border-t border-nxt-100">
                          <button className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-md bg-forest text-white hover:bg-bark transition-colors">
                            <MessageCircle className="w-3 h-3" /> Mensaje
                          </button>
                          <button className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-md bg-nxt-100 text-nxt-700 hover:bg-nxt-200 transition-colors">
                            <Phone className="w-3 h-3" /> Llamar
                          </button>
                        </div>
                      </Popover>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full">
              <div className="flex items-center gap-4 flex-wrap py-8">
                {PEOPLE.slice(6, 9).map((person) => (
                  <ColorEditable key={`profile-d-${person.id}`} elementKey={`feedback.popover-profile-d-${person.id}`} defaultBg={resolveDominantColor(person.color)}>
                    {(styles, openPicker, currentHex) => (
                      <Popover
                        position="bottom"
                        open={openPopover === `profile-dark-${person.id}`}
                        onToggle={() => togglePopover(`profile-dark-${person.id}`)}
                        onClose={closePopovers}
                        width="w-64"
                        trigger={
                          <Avatar person={getPersonWithStatus(person)} size="lg" showStatus showTooltip={false} dark />
                        }
                      >
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 ${person.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                              {person.initials}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-nxt-900">{person.name}</h4>
                              <p className="text-[11px] text-nxt-500">Ingeniero de Software</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[person.status]}`} />
                                <span className="text-[10px] text-nxt-400 capitalize">{person.status}</span>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-2 text-[11px] text-nxt-500">
                              <Mail className="w-3 h-3" />
                              <span>{person.name.toLowerCase().replace(" ", ".")}@forest.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-nxt-500">
                              <MapPin className="w-3 h-3" />
                              <span>Ciudad de Mexico, MX</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 border-t border-nxt-100">
                          <button className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-md bg-forest text-white hover:bg-bark transition-colors">
                            <MessageCircle className="w-3 h-3" /> Mensaje
                          </button>
                          <button className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-md bg-nxt-100 text-nxt-700 hover:bg-nxt-200 transition-colors">
                            <Phone className="w-3 h-3" /> Llamar
                          </button>
                        </div>
                      </Popover>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- Confirmation popover --- */}
        <div className="border-t border-nxt-200 pt-6 mt-2">
          <h3 className="text-sm font-semibold text-nxt-700 mb-1">Popover de confirmacion</h3>
          <p className="text-xs text-nxt-400 mb-4">Patron "Estas seguro?" con acciones Si/No. Resultado mostrado debajo.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Light */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-4 h-full">
              <div className="flex items-center gap-6 flex-wrap py-4">
                <Popover
                  position="bottom"
                  open={openPopover === "confirm-delete"}
                  onToggle={() => togglePopover("confirm-delete")}
                  onClose={closePopovers}
                  width="w-72"
                  trigger={
                    <ColorEditable elementKey="feedback.popover-delete" defaultBg={resolveDominantColor("bg-red-500")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-red-500")}>
                      {(styles, openPicker, currentHex, hoverHandlers) => (
                        <button
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-error text-white hover:bg-red-700 transition-colors"
                          style={styles}
                          {...hoverHandlers}
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar proyecto
                        </button>
                      )}
                    </ColorEditable>
                  }
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-error" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-nxt-900 mb-1">Eliminar proyecto?</h4>
                        <p className="text-xs text-nxt-500">Esta accion no se puede deshacer. Se eliminaran todos los datos asociados permanentemente.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 p-3 border-t border-nxt-100">
                    <button
                      onClick={() => {
                        setConfirmResult("Cancelado");
                        closePopovers();
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-md text-nxt-600 hover:bg-nxt-100 transition-colors"
                    >
                      No, cancelar
                    </button>
                    <button
                      onClick={() => {
                        setConfirmResult("Eliminado exitosamente");
                        closePopovers();
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-error text-white hover:bg-red-700 transition-colors"
                    >
                      Si, eliminar
                    </button>
                  </div>
                </Popover>

                {confirmResult && (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg ${
                    confirmResult.includes("exitosamente")
                      ? "bg-success/10 text-success"
                      : "bg-nxt-100 text-nxt-600"
                  }`}>
                    {confirmResult.includes("exitosamente") ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {confirmResult}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Gradient */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-4 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-6 flex-wrap py-4">
                <Popover
                  position="bottom"
                  open={openPopover === "confirm-publish"}
                  onToggle={() => togglePopover("confirm-publish")}
                  onClose={closePopovers}
                  width="w-72"
                  trigger={
                    <ColorEditable elementKey="feedback.popover-publish" defaultBg={resolveDominantColor("bg-green-600")} hasHover={true} defaultHoverBg={resolveHoverColor("bg-green-600")}>
                      {(styles, openPicker, currentHex, hoverHandlers) => (
                        <button
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-success text-white hover:bg-green-700 transition-colors"
                          style={styles}
                          {...hoverHandlers}
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Publicar cambios
                        </button>
                      )}
                    </ColorEditable>
                  }
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-nxt-900 mb-1">Publicar cambios?</h4>
                        <p className="text-xs text-nxt-500">Los cambios seran visibles para todos los usuarios inmediatamente.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 p-3 border-t border-nxt-100">
                    <button
                      onClick={() => {
                        setConfirmResult("Publicacion cancelada");
                        closePopovers();
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-md text-nxt-600 hover:bg-nxt-100 transition-colors"
                    >
                      No, volver
                    </button>
                    <button
                      onClick={() => {
                        setConfirmResult("Publicado exitosamente");
                        closePopovers();
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-success text-white hover:bg-green-700 transition-colors"
                    >
                      Si, publicar
                    </button>
                  </div>
                </Popover>
              </div>
            </div>
          </div>
          {/* Dark */}
          <div>
            <h4 className="text-[10px] font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-nxt-800 rounded-nxt-xl p-4 h-full">
              <div className="flex items-center gap-6 flex-wrap py-4">
                <Popover
                  position="bottom"
                  open={openPopover === "confirm-delete-d"}
                  onToggle={() => togglePopover("confirm-delete-d")}
                  onClose={closePopovers}
                  width="w-72"
                  trigger={
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-error text-white hover:bg-red-700 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  }
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-error" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-nxt-900 mb-1">Eliminar proyecto?</h4>
                        <p className="text-xs text-nxt-500">Esta accion no se puede deshacer.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 p-3 border-t border-nxt-100">
                    <button
                      onClick={closePopovers}
                      className="px-3 py-1.5 text-xs font-medium rounded-md text-nxt-600 hover:bg-nxt-100 transition-colors"
                    >
                      No, cancelar
                    </button>
                    <button
                      onClick={closePopovers}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-error text-white hover:bg-red-700 transition-colors"
                    >
                      Si, eliminar
                    </button>
                  </div>
                </Popover>

                <Popover
                  position="bottom"
                  open={openPopover === "confirm-publish-d"}
                  onToggle={() => togglePopover("confirm-publish-d")}
                  onClose={closePopovers}
                  width="w-72"
                  trigger={
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-success text-white hover:bg-green-700 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Publicar
                    </button>
                  }
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-nxt-900 mb-1">Publicar cambios?</h4>
                        <p className="text-xs text-nxt-500">Los cambios seran visibles inmediatamente.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 p-3 border-t border-nxt-100">
                    <button
                      onClick={closePopovers}
                      className="px-3 py-1.5 text-xs font-medium rounded-md text-nxt-600 hover:bg-nxt-100 transition-colors"
                    >
                      No, volver
                    </button>
                    <button
                      onClick={closePopovers}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-success text-white hover:bg-green-700 transition-colors"
                    >
                      Si, publicar
                    </button>
                  </div>
                </Popover>
              </div>
            </div>
          </div>
        </div>

      </Section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-nxt-600">{label}</span>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative w-9 h-5 rounded-full transition-colors ${on ? "bg-forest" : "bg-nxt-300"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            on ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
