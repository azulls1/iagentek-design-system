import { useState, useEffect, useRef, useCallback } from "react";
import {
  Eye,
  EyeOff,
  Search,
  Filter,
  X,
  Upload,
  ChevronDown,
  FileText,
  CheckCircle,
  Trash2,
} from "lucide-react";
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

/* ------------------------------------------------------------------ */
/*  Reusable interactive input with clear + counter                    */
/* ------------------------------------------------------------------ */

function InteractiveInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  maxLength = 100,
  error,
  shake,
  inputClassName,
  labelClassName,
  wrapperClassName,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  error?: string;
  shake?: boolean;
  inputClassName?: string;
  labelClassName?: string;
  wrapperClassName?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={wrapperClassName}>
      <label className={labelClassName || "block text-sm font-medium text-nxt-700 mb-1"}>
        {label}
      </label>
      <div className={`relative ${shake ? "animate-nxt-shake" : ""}`}>
        <input
          type={type}
          className={`${inputClassName || "nxt-input"} w-full transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest ${error ? "border-error focus:ring-error/30" : ""} ${value ? "pr-16" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
        />
        {/* Clear button */}
        <button
          type="button"
          onClick={() => onChange("")}
          className={`absolute right-2 top-1/2 -translate-y-1/2 text-nxt-400 hover:text-nxt-600 transition-all duration-200 active:scale-95 ${value ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
        {/* Character counter */}
        {focused && value.length > 0 && (
          <span className="absolute right-7 top-1/2 -translate-y-1/2 text-[10px] text-nxt-400 transition-opacity duration-200">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-error mt-1 transition-all duration-200">
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Gradient interactive input                                         */
/* ------------------------------------------------------------------ */

function GradientInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  maxLength = 100,
  error,
  shake,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  error?: string;
  shake?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-white mb-1">
        {label}
      </label>
      <div className={`relative ${shake ? "animate-nxt-shake" : ""}`}>
        <input
          type={type}
          className={`w-full rounded-lg border bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/40 ${error ? "border-red-400 focus:ring-red-400/30" : "border-white/20 focus:border-white/50 focus:ring-white/20"} ${value ? "pr-16" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
        />
        <button
          type="button"
          onClick={() => onChange("")}
          className={`absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-all duration-200 active:scale-95 ${value ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
        {focused && value.length > 0 && (
          <span className="absolute right-7 top-1/2 -translate-y-1/2 text-[10px] text-white/50 transition-opacity duration-200">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-200 mt-1 transition-all duration-200">
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dark interactive input                                             */
/* ------------------------------------------------------------------ */

function DarkInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  maxLength = 100,
  error,
  shake,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  error?: string;
  shake?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className={`relative ${shake ? "animate-nxt-shake" : ""}`}>
        <input
          type={type}
          className={`w-full rounded-lg border bg-[#1A3036] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest ${error ? "border-error focus:ring-error/30" : "border-[#304040] focus:border-forest focus:ring-forest/20"} ${value ? "pr-16" : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          maxLength={maxLength}
        />
        <button
          type="button"
          onClick={() => onChange("")}
          className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-all duration-200 active:scale-95 ${value ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
        {focused && value.length > 0 && (
          <span className="absolute right-7 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 transition-opacity duration-200">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-error mt-1 transition-all duration-200">
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Search chip helpers                                                */
/* ------------------------------------------------------------------ */

const AVAILABLE_CHIPS = [
  "Status: Activo",
  "Status: Inactivo",
  "Division: Centro",
  "Division: Norte",
  "Division: Sur",
  "Tarifa: HM",
  "Tarifa: GDMTH",
  "Tarifa: PDBT",
  "Tipo: Solar",
  "Tipo: Eolica",
];

/* ------------------------------------------------------------------ */
/*  FormulariosSection                                                 */
/* ------------------------------------------------------------------ */

export function FormulariosSection({ scrollTo }: { scrollTo?: string }) {
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTo]);

  /* ── Input state (shared across modes) ────────────────────────── */
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorFieldValue, setErrorFieldValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");

  /* ── Validation state ─────────────────────────────────────────── */
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [shakeFields, setShakeFields] = useState<Record<string, boolean>>({});

  const triggerValidation = () => {
    const errors: Record<string, string> = {};
    const shakes: Record<string, boolean> = {};

    if (!nameValue.trim()) {
      errors.name = "El nombre del proyecto es obligatorio.";
      shakes.name = true;
    }
    if (!emailValue.trim()) {
      errors.email = "El correo es obligatorio.";
      shakes.email = true;
    } else if (!emailValue.includes("@")) {
      errors.email = "Formato de correo invalido.";
      shakes.email = true;
    }
    if (!passwordValue.trim()) {
      errors.password = "La contrasena es obligatoria.";
      shakes.password = true;
    }
    if (!errorFieldValue.trim()) {
      errors.errorField = "Este campo es obligatorio.";
      shakes.errorField = true;
    }

    setValidationErrors(errors);
    setShakeFields(shakes);

    // Clear shake after animation
    setTimeout(() => setShakeFields({}), 600);

    // Clear errors after 3s if no issues
    if (Object.keys(errors).length === 0) {
      setValidationErrors({});
    }
  };

  const clearValidation = () => {
    setValidationErrors({});
    setShakeFields({});
  };

  // Clear specific error when user types
  const updateWithClear = (field: string, setter: (v: string) => void) => (v: string) => {
    setter(v);
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  /* ── Search & Chips state ─────────────────────────────────────── */
  const [searchValue, setSearchValue] = useState("");
  const [chips, setChips] = useState([
    "Status: Activo",
    "Division: Centro",
    "Tarifa: HM",
  ]);

  const filteredSuggestions = searchValue.trim()
    ? AVAILABLE_CHIPS.filter(
        (c) =>
          c.toLowerCase().includes(searchValue.toLowerCase()) &&
          !chips.includes(c)
      )
    : [];

  const addChip = (chip: string) => {
    setChips((prev) => [...prev, chip]);
    setSearchValue("");
  };

  const removeChip = (index: number) => {
    setChips((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllChips = () => {
    setChips([]);
    setSearchValue("");
  };

  /* ── Upload / Dropzone state ──────────────────────────────────── */
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const simulateUpload = useCallback((fileName: string) => {
    setUploadedFile({ name: fileName, size: "2.4 MB" });
    setUploadProgress(0);
    setUploadComplete(false);

    let progress = 0;
    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setUploadProgress(100);
        setTimeout(() => setUploadComplete(true), 300);
      } else {
        setUploadProgress(Math.round(progress));
      }
    }, 200);
  }, []);

  const removeFile = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    setUploadedFile(null);
    setUploadProgress(0);
    setUploadComplete(false);
  };

  const handleDropzoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDropzoneDragLeave = () => {
    setDragOver(false);
  };

  const handleDropzoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file.name);
  };

  const handleDropzoneClick = () => {
    if (!uploadedFile) fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) simulateUpload(file.name);
    // Reset so same file can be selected again
    e.target.value = "";
  };

  /* ── Modal state ──────────────────────────────────────────────── */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);

  const openModal = () => {
    setModalOpen(true);
    setModalClosing(false);
    setModalSuccess(false);
  };

  const closeModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setModalClosing(false);
      setModalSuccess(false);
    }, 200);
  };

  const confirmModal = () => {
    setModalSuccess(true);
    setTimeout(() => {
      closeModal();
    }, 1200);
  };

  return (
    <>
      {/* Hidden file input for dropzone */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".csv,.xlsx,.pdf"
        onChange={handleFileSelect}
      />

      {/* ── Inputs ─────────────────────────────────────────────── */}
      <Section
        id="inputs"
        title="Inputs"
        description="Campos de texto, email, password y textarea con estados de focus, error y disabled."
      >
        {/* Validate button */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={triggerValidation}
            className="nxt-btn-primary text-sm px-4 py-2 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest"
          >
            Validar campos
          </button>
          {Object.keys(validationErrors).length > 0 && (
            <button
              onClick={clearValidation}
              className="nxt-btn-outline text-sm px-4 py-2 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest"
            >
              Limpiar errores
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Light */}
          <div>
            <h4 className="text-xs font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-5 h-full space-y-4">
              {/* Text */}
              <InteractiveInput
                label="Nombre del Proyecto"
                placeholder="Ej: Monitor Solar Norte"
                value={nameValue}
                onChange={updateWithClear("name", setNameValue)}
                error={validationErrors.name}
                shake={shakeFields.name}
              />

              {/* Email */}
              <InteractiveInput
                label="Correo electronico"
                type="email"
                placeholder="usuario@forest.com"
                value={emailValue}
                onChange={updateWithClear("email", setEmailValue)}
                error={validationErrors.email}
                shake={shakeFields.email}
              />

              {/* Password with toggle */}
              <div>
                <label className="block text-sm font-medium text-nxt-700 mb-1">
                  Contrasena
                </label>
                <div className={`relative ${shakeFields.password ? "animate-nxt-shake" : ""}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`nxt-input w-full pr-10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest ${validationErrors.password ? "border-error focus:ring-error/30" : ""}`}
                    placeholder="••••••••"
                    value={passwordValue}
                    onChange={(e) => updateWithClear("password", setPasswordValue)(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-nxt-400 hover:text-nxt-600 transition-all duration-200 active:scale-95"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 transition-all duration-200" />
                    ) : (
                      <Eye className="w-4 h-4 transition-all duration-200" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-xs text-error mt-1 transition-all duration-200">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Error state */}
              <InteractiveInput
                label="Campo con error"
                placeholder="Escribe algo..."
                value={errorFieldValue}
                onChange={updateWithClear("errorField", setErrorFieldValue)}
                error={validationErrors.errorField}
                shake={shakeFields.errorField}
              />

              {/* Textarea */}
              <div>
                <label className="block text-sm font-medium text-nxt-700 mb-1">
                  Descripcion
                </label>
                <div className="relative">
                  <textarea
                    className="nxt-input w-full min-h-[80px] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest"
                    placeholder="Descripcion del proyecto..."
                    value={descriptionValue}
                    onChange={(e) => setDescriptionValue(e.target.value)}
                    maxLength={500}
                  />
                  {descriptionValue.length > 0 && (
                    <span className="absolute right-2 bottom-2 text-[10px] text-nxt-400 transition-opacity duration-200">
                      {descriptionValue.length}/500
                    </span>
                  )}
                </div>
              </div>

              {/* Select */}
              <div>
                <label className="block text-sm font-medium text-nxt-700 mb-1">
                  Division
                </label>
                <div className="relative">
                  <select className="nxt-input w-full appearance-none pr-10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest">
                    <option>Seleccionar division...</option>
                    <option>Norte</option>
                    <option>Centro</option>
                    <option>Sur</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nxt-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Gradiente */}
          <div>
            <h4 className="text-xs font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full relative overflow-hidden space-y-4">
              {/* Text */}
              <GradientInput
                label="Nombre del Proyecto"
                placeholder="Ej: Monitor Solar Norte"
                value={nameValue}
                onChange={updateWithClear("name", setNameValue)}
                error={validationErrors.name}
                shake={shakeFields.name}
              />

              {/* Email */}
              <GradientInput
                label="Correo electronico"
                type="email"
                placeholder="usuario@forest.com"
                value={emailValue}
                onChange={updateWithClear("email", setEmailValue)}
                error={validationErrors.email}
                shake={shakeFields.email}
              />

              {/* Password with toggle */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Contrasena
                </label>
                <div className={`relative ${shakeFields.password ? "animate-nxt-shake" : ""}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full rounded-lg border bg-white/10 px-3 py-2 pr-10 text-sm text-white placeholder-white/50 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/40 ${validationErrors.password ? "border-red-400 focus:ring-red-400/30" : "border-white/20 focus:border-white/50 focus:ring-white/20"}`}
                    placeholder="••••••••"
                    value={passwordValue}
                    onChange={(e) => updateWithClear("password", setPasswordValue)(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-all duration-200 active:scale-95"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 transition-all duration-200" />
                    ) : (
                      <Eye className="w-4 h-4 transition-all duration-200" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-xs text-red-200 mt-1 transition-all duration-200">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Error state */}
              <GradientInput
                label="Campo con error"
                placeholder="Escribe algo..."
                value={errorFieldValue}
                onChange={updateWithClear("errorField", setErrorFieldValue)}
                error={validationErrors.errorField}
                shake={shakeFields.errorField}
              />

              {/* Textarea */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Descripcion
                </label>
                <div className="relative">
                  <textarea
                    className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 min-h-[80px] outline-none transition-all duration-200 focus:border-white/50 focus-visible:ring-2 focus-visible:ring-white/40"
                    placeholder="Descripcion del proyecto..."
                    value={descriptionValue}
                    onChange={(e) => setDescriptionValue(e.target.value)}
                    maxLength={500}
                  />
                  {descriptionValue.length > 0 && (
                    <span className="absolute right-2 bottom-2 text-[10px] text-white/50 transition-opacity duration-200">
                      {descriptionValue.length}/500
                    </span>
                  )}
                </div>
              </div>

              {/* Select */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Division
                </label>
                <div className="relative">
                  <select className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white appearance-none pr-10 outline-none transition-all duration-200 focus:border-white/50 focus-visible:ring-2 focus-visible:ring-white/40">
                    <option className="text-nxt-900">Seleccionar division...</option>
                    <option className="text-nxt-900">Norte</option>
                    <option className="text-nxt-900">Centro</option>
                    <option className="text-nxt-900">Sur</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Dark */}
          <div>
            <h4 className="text-xs font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full space-y-4">
              {/* Text */}
              <DarkInput
                label="Nombre del Proyecto"
                placeholder="Ej: Monitor Solar Norte"
                value={nameValue}
                onChange={updateWithClear("name", setNameValue)}
                error={validationErrors.name}
                shake={shakeFields.name}
              />

              {/* Email */}
              <DarkInput
                label="Correo electronico"
                type="email"
                placeholder="usuario@forest.com"
                value={emailValue}
                onChange={updateWithClear("email", setEmailValue)}
                error={validationErrors.email}
                shake={shakeFields.email}
              />

              {/* Password with toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Contrasena
                </label>
                <div className={`relative ${shakeFields.password ? "animate-nxt-shake" : ""}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full rounded-lg border bg-[#1A3036] px-3 py-2 pr-10 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest ${validationErrors.password ? "border-error focus:ring-error/30" : "border-[#304040] focus:border-forest focus:ring-forest/20"}`}
                    placeholder="••••••••"
                    value={passwordValue}
                    onChange={(e) => updateWithClear("password", setPasswordValue)(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-all duration-200 active:scale-95"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 transition-all duration-200" />
                    ) : (
                      <Eye className="w-4 h-4 transition-all duration-200" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-xs text-error mt-1 transition-all duration-200">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Error state */}
              <DarkInput
                label="Campo con error"
                placeholder="Escribe algo..."
                value={errorFieldValue}
                onChange={updateWithClear("errorField", setErrorFieldValue)}
                error={validationErrors.errorField}
                shake={shakeFields.errorField}
              />

              {/* Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Descripcion
                </label>
                <div className="relative">
                  <textarea
                    className="w-full rounded-lg border border-[#304040] bg-[#1A3036] px-3 py-2 text-sm text-white placeholder-gray-500 min-h-[80px] outline-none transition-all duration-200 focus:border-forest focus-visible:ring-2 focus-visible:ring-forest"
                    placeholder="Descripcion del proyecto..."
                    value={descriptionValue}
                    onChange={(e) => setDescriptionValue(e.target.value)}
                    maxLength={500}
                  />
                  {descriptionValue.length > 0 && (
                    <span className="absolute right-2 bottom-2 text-[10px] text-gray-500 transition-opacity duration-200">
                      {descriptionValue.length}/500
                    </span>
                  )}
                </div>
              </div>

              {/* Select */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Division
                </label>
                <div className="relative">
                  <select className="w-full rounded-lg border border-[#304040] bg-[#1A3036] px-3 py-2 text-sm text-white appearance-none pr-10 outline-none transition-all duration-200 focus:border-forest focus-visible:ring-2 focus-visible:ring-forest">
                    <option>Seleccionar division...</option>
                    <option>Norte</option>
                    <option>Centro</option>
                    <option>Sur</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Busqueda y Filtros ─────────────────────────────────── */}
      <div className="border-t border-nxt-200 pt-6 mt-6" />
      <Section
        id="busqueda"
        title="Busqueda y Filtros"
        description="Barra de busqueda con sugerencias y chips de filtro removibles."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Light */}
          <div>
            <h4 className="text-xs font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-5 h-full space-y-4">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nxt-400" />
                <input
                  type="text"
                  className="nxt-input w-full pl-9 pr-8 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-forest"
                  placeholder="Buscar por RPU, nombre..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-nxt-400 hover:text-nxt-600 transition-all duration-200 active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              {filteredSuggestions.length > 0 && (
                <div className="bg-white border border-nxt-200 rounded-lg shadow-lg overflow-hidden transition-all duration-200">
                  {filteredSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => addChip(s)}
                      className="w-full text-left px-3 py-2 text-sm text-nxt-700 hover:bg-forest/5 hover:text-forest transition-all duration-200 active:scale-95"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button className="nxt-btn-outline flex items-center gap-1.5 text-sm transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest">
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>
                {chips.length > 0 && (
                  <button
                    onClick={clearAllChips}
                    className="nxt-btn-outline flex items-center gap-1.5 text-sm text-error border-error/30 hover:bg-error/5 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest"
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpiar todo
                  </button>
                )}
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap gap-2">
                {chips.map((chip, i) => (
                  <ColorEditable key={chip} elementKey={`formularios.chip-l-${i}`} defaultBg="#04202C" showProperties={["bg"]}>
                    {(styles, _openPicker, _currentHex) => (
                      <span
                        className="inline-flex items-center gap-1 bg-forest/10 text-forest text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-200 animate-in fade-in"
                        style={{ animation: "fadeScaleIn 0.2s ease-out", ...styles }}
                      >
                        {chip}
                        <button
                          onClick={() => removeChip(i)}
                          className="hover:bg-forest/20 rounded-full p-0.5 transition-all duration-200 active:scale-95"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>

          {/* Gradiente */}
          <div>
            <h4 className="text-xs font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full relative overflow-hidden space-y-4">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                <input
                  type="text"
                  className="w-full rounded-lg border border-white/20 bg-white/10 pl-9 pr-8 py-2 text-sm text-white placeholder-white/50 outline-none transition-all duration-200 focus:border-white/50 focus-visible:ring-2 focus-visible:ring-white/40"
                  placeholder="Buscar por RPU, nombre..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-all duration-200 active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              {filteredSuggestions.length > 0 && (
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg overflow-hidden transition-all duration-200">
                  {filteredSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => addChip(s)}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-white/40">
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>
                {chips.length > 0 && (
                  <button
                    onClick={clearAllChips}
                    className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-red-300/30 text-red-200 hover:bg-red-400/10 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpiar todo
                  </button>
                )}
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap gap-2">
                {chips.map((chip, i) => (
                  <ColorEditable key={chip} elementKey={`formularios.chip-g-${i}`} defaultBg={resolveDefaultBg("bg-white/20")} showProperties={["bg"]}>
                    {(styles, _openPicker, _currentHex) => (
                      <span
                        className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer"
                        style={{ animation: "fadeScaleIn 0.2s ease-out", ...styles }}
                      >
                        {chip}
                        <button
                          onClick={() => removeChip(i)}
                          className="hover:bg-white/30 rounded-full p-0.5 transition-all duration-200 active:scale-95"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>

          {/* Dark */}
          <div>
            <h4 className="text-xs font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full space-y-4">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  className="w-full rounded-lg border border-[#304040] bg-[#1A3036] pl-9 pr-8 py-2 text-sm text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-forest focus-visible:ring-2 focus-visible:ring-forest"
                  placeholder="Buscar por RPU, nombre..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-all duration-200 active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              {filteredSuggestions.length > 0 && (
                <div className="bg-[#1A3036] border border-[#304040] rounded-lg overflow-hidden transition-all duration-200">
                  {filteredSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => addChip(s)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-forest/10 hover:text-forest transition-all duration-200 active:scale-95"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-[#304040] text-gray-300 hover:bg-[#1A3036] transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest">
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>
                {chips.length > 0 && (
                  <button
                    onClick={clearAllChips}
                    className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-error/30 text-error hover:bg-error/5 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest"
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpiar todo
                  </button>
                )}
              </div>

              {/* Filter chips */}
              <div className="flex flex-wrap gap-2">
                {chips.map((chip, i) => (
                  <ColorEditable key={chip} elementKey={`formularios.chip-d-${i}`} defaultBg={resolveDefaultBg("bg-forest")} showProperties={["bg"]}>
                    {(styles, _openPicker, _currentHex) => (
                      <span
                        className="inline-flex items-center gap-1 bg-forest/20 text-forest text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer"
                        style={{ animation: "fadeScaleIn 0.2s ease-out", ...styles }}
                      >
                        {chip}
                        <button
                          onClick={() => removeChip(i)}
                          className="hover:bg-forest/30 rounded-full p-0.5 transition-all duration-200 active:scale-95"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </ColorEditable>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Inline keyframes for chip animations */}
      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes modalOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.9); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes backdropOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes progressFill {
          from { width: 0%; }
        }
      `}</style>

      {/* ── Upload / Dropzone ──────────────────────────────────── */}
      <div className="border-t border-nxt-200 pt-6 mt-6" />
      <Section
        id="upload-modal"
        title="Upload / Dropzone"
        description="Area de arrastrar y soltar archivos con estados de drag, progreso y completado."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Light */}
          <div>
            <h4 className="text-xs font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card p-5 h-full">
              <ColorEditable elementKey="formularios.dropzone-l" defaultBg={resolveDefaultBg("bg-forest")} showProperties={["bg"]}>
                {(styles, _openPicker, _currentHex) => (
                  <>
                    {!uploadedFile ? (
                      <div
                        onDragOver={handleDropzoneDragOver}
                        onDragLeave={handleDropzoneDragLeave}
                        onDrop={handleDropzoneDrop}
                        onClick={handleDropzoneClick}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                          dragOver
                            ? "border-forest bg-forest/10 scale-[1.02] shadow-lg shadow-forest/10"
                            : "border-nxt-300 hover:border-forest hover:bg-forest/5"
                        }`}
                        style={dragOver && styles.backgroundColor ? { borderColor: styles.backgroundColor, backgroundColor: `${styles.backgroundColor}1a` } : undefined}
                      >
                        <Upload className={`w-8 h-8 mx-auto mb-3 transition-all duration-200 ${dragOver ? "text-forest scale-110" : "text-nxt-400"}`} />
                        <p className="text-sm font-medium text-nxt-700 mb-1">
                          Arrastra archivos aqui o haz clic para seleccionar
                        </p>
                        <p className="text-xs text-nxt-400">
                          CSV, XLSX o PDF -- max. 10 MB
                        </p>
                      </div>
                    ) : (
                      <div className="border-2 border-solid border-nxt-200 rounded-lg p-4 transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center flex-shrink-0" style={styles.backgroundColor ? { backgroundColor: `${styles.backgroundColor}1a` } : undefined}>
                            <FileText className="w-5 h-5 text-forest" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-nxt-700 truncate">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-nxt-400">{uploadedFile.size}</p>
                          </div>
                          {uploadComplete && (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 transition-all duration-200" />
                          )}
                          <button
                            onClick={removeFile}
                            className="text-nxt-400 hover:text-error p-1 rounded transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Progress bar */}
                        {!uploadComplete && (
                          <div className="mt-3 h-2 bg-nxt-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-forest rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${uploadProgress}%`, ...(styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : {}) }}
                            />
                          </div>
                        )}
                        {!uploadComplete && (
                          <p className="text-xs text-nxt-400 mt-1">{uploadProgress}% cargado</p>
                        )}
                        {uploadComplete && (
                          <p className="text-xs text-green-600 mt-2 font-medium transition-all duration-200">
                            Archivo cargado correctamente
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </ColorEditable>
            </div>
          </div>

          {/* Gradiente */}
          <div>
            <h4 className="text-xs font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl p-5 h-full relative overflow-hidden">
              <ColorEditable elementKey="formularios.dropzone-g" defaultBg="#FFFFFF" showProperties={["bg"]}>
                {(styles, _openPicker, _currentHex) => (
                  <>
                    {!uploadedFile ? (
                      <div
                        onDragOver={handleDropzoneDragOver}
                        onDragLeave={handleDropzoneDragLeave}
                        onDrop={handleDropzoneDrop}
                        onClick={handleDropzoneClick}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                          dragOver
                            ? "border-white bg-white/20 scale-[1.02] shadow-lg"
                            : "border-white/30 hover:border-white/60 hover:bg-white/10"
                        }`}
                        style={dragOver && styles.backgroundColor ? { borderColor: styles.backgroundColor, backgroundColor: `${styles.backgroundColor}33` } : undefined}
                      >
                        <Upload className={`w-8 h-8 mx-auto mb-3 transition-all duration-200 ${dragOver ? "text-white scale-110" : "text-white/70"}`} />
                        <p className="text-sm font-medium text-white mb-1">
                          Arrastra archivos aqui o haz clic para seleccionar
                        </p>
                        <p className="text-xs text-white/60">
                          CSV, XLSX o PDF -- max. 10 MB
                        </p>
                      </div>
                    ) : (
                      <div className="border-2 border-solid border-white/20 rounded-lg p-4 transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0" style={styles.backgroundColor ? { backgroundColor: `${styles.backgroundColor}33` } : undefined}>
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-white/60">{uploadedFile.size}</p>
                          </div>
                          {uploadComplete && (
                            <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 transition-all duration-200" />
                          )}
                          <button
                            onClick={removeFile}
                            className="text-white/60 hover:text-white p-1 rounded transition-all duration-200 active:scale-95"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {!uploadComplete && (
                          <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${uploadProgress}%`, ...(styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : {}) }}
                            />
                          </div>
                        )}
                        {!uploadComplete && (
                          <p className="text-xs text-white/60 mt-1">{uploadProgress}% cargado</p>
                        )}
                        {uploadComplete && (
                          <p className="text-xs text-green-200 mt-2 font-medium transition-all duration-200">
                            Archivo cargado correctamente
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </ColorEditable>
            </div>
          </div>

          {/* Dark */}
          <div>
            <h4 className="text-xs font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl p-5 h-full">
              <ColorEditable elementKey="formularios.dropzone-d" defaultBg={resolveDefaultBg("bg-forest")} showProperties={["bg"]}>
                {(styles, _openPicker, _currentHex) => (
                  <>
                    {!uploadedFile ? (
                      <div
                        onDragOver={handleDropzoneDragOver}
                        onDragLeave={handleDropzoneDragLeave}
                        onDrop={handleDropzoneDrop}
                        onClick={handleDropzoneClick}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                          dragOver
                            ? "border-forest bg-forest/10 scale-[1.02] shadow-lg shadow-forest/10"
                            : "border-[#304040] hover:border-forest hover:bg-forest/5"
                        }`}
                        style={dragOver && styles.backgroundColor ? { borderColor: styles.backgroundColor, backgroundColor: `${styles.backgroundColor}1a` } : undefined}
                      >
                        <Upload className={`w-8 h-8 mx-auto mb-3 transition-all duration-200 ${dragOver ? "text-forest scale-110" : "text-gray-500"}`} />
                        <p className="text-sm font-medium text-white mb-1">
                          Arrastra archivos aqui o haz clic para seleccionar
                        </p>
                        <p className="text-xs text-gray-500">
                          CSV, XLSX o PDF -- max. 10 MB
                        </p>
                      </div>
                    ) : (
                      <div className="border-2 border-solid border-[#304040] rounded-lg p-4 transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-forest/20 flex items-center justify-center flex-shrink-0" style={styles.backgroundColor ? { backgroundColor: `${styles.backgroundColor}33` } : undefined}>
                            <FileText className="w-5 h-5 text-forest" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">{uploadedFile.size}</p>
                          </div>
                          {uploadComplete && (
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 transition-all duration-200" />
                          )}
                          <button
                            onClick={removeFile}
                            className="text-gray-500 hover:text-error p-1 rounded transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {!uploadComplete && (
                          <div className="mt-3 h-2 bg-[#1A3036] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-forest rounded-full transition-all duration-300 ease-out"
                              style={{ width: `${uploadProgress}%`, ...(styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : {}) }}
                            />
                          </div>
                        )}
                        {!uploadComplete && (
                          <p className="text-xs text-gray-500 mt-1">{uploadProgress}% cargado</p>
                        )}
                        {uploadComplete && (
                          <p className="text-xs text-green-500 mt-2 font-medium transition-all duration-200">
                            Archivo cargado correctamente
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </ColorEditable>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Modal / Dialog ─────────────────────────────────────── */}
      <div className="border-t border-nxt-200 pt-6 mt-6" />
      <Section
        title="Modal / Dialog"
        description="Dialogo de confirmacion con animacion de entrada/salida y estados de exito."
      >
        {/* Open modal button */}
        <div className="mb-4">
          <button
            onClick={openModal}
            className="nxt-btn-primary text-sm px-4 py-2 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest"
          >
            Abrir Modal
          </button>
        </div>

        {/* Modal overlay */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              animation: modalClosing ? "backdropOut 0.2s ease-out forwards" : "backdropIn 0.2s ease-out forwards",
            }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />
            {/* Modal content */}
            <div
              className="relative bg-white rounded-nxt-xl shadow-2xl max-w-md w-full overflow-hidden"
              style={{
                animation: modalClosing ? "modalOut 0.2s ease-out forwards" : "modalIn 0.2s ease-out forwards",
              }}
            >
              {modalSuccess ? (
                /* Success state */
                <div className="px-5 py-10 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3 transition-all duration-200" />
                  <p className="text-lg font-semibold text-nxt-900">Confirmado</p>
                  <p className="text-sm text-nxt-500 mt-1">La accion se realizo correctamente.</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-nxt-200">
                    <h3 className="text-sm font-semibold text-nxt-900">
                      Confirmar eliminacion
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-nxt-400 hover:text-nxt-600 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="px-5 py-5">
                    <p className="text-sm text-nxt-600">
                      Estas seguro de que deseas eliminar este sitio? Esta accion no se
                      puede deshacer.
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-2 px-5 py-3.5 bg-nxt-50 border-t border-nxt-200">
                    <button
                      onClick={closeModal}
                      className="nxt-btn-outline text-sm px-4 py-2 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={confirmModal}
                      className="nxt-btn-primary text-sm px-4 py-2 bg-error hover:bg-error/90 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest"
                    >
                      Confirmar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Static modal previews (all 3 modes) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Light */}
          <div>
            <h4 className="text-xs font-semibold text-nxt-400 uppercase tracking-wider mb-2">Light</h4>
            <div className="nxt-card overflow-hidden h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-nxt-200">
                <h3 className="text-sm font-semibold text-nxt-900">
                  Confirmar eliminacion
                </h3>
                <button className="text-nxt-400 hover:text-nxt-600 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-5">
                <p className="text-sm text-nxt-600">
                  Estas seguro de que deseas eliminar este sitio? Esta accion no se
                  puede deshacer.
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 px-5 py-3.5 bg-nxt-50 border-t border-nxt-200">
                <button className="nxt-btn-outline text-sm px-4 py-2 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest">
                  Cancelar
                </button>
                <button className="nxt-btn-primary text-sm px-4 py-2 bg-error hover:bg-error/90 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest">
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          {/* Gradiente */}
          <div>
            <h4 className="text-xs font-semibold text-nxt-400 uppercase tracking-wider mb-2">Gradiente</h4>
            <div className="bg-gradient-to-br from-slate-700 via-slate-600 to-cyan-700 rounded-nxt-xl overflow-hidden h-full relative">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/20">
                <h3 className="text-sm font-semibold text-white">
                  Confirmar eliminacion
                </h3>
                <button className="text-white/60 hover:text-white transition-all duration-200 active:scale-95 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-5">
                <p className="text-sm text-white/80">
                  Estas seguro de que deseas eliminar este sitio? Esta accion no se
                  puede deshacer.
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 px-5 py-3.5 border-t border-white/20 bg-black/10">
                <button className="text-sm px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-white/40">
                  Cancelar
                </button>
                <button className="text-sm px-4 py-2 rounded-lg bg-white text-rose-600 font-medium hover:bg-white/90 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-white/40">
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          {/* Dark */}
          <div>
            <h4 className="text-xs font-semibold text-nxt-400 uppercase tracking-wider mb-2">Dark</h4>
            <div className="bg-[#04202C] rounded-nxt-xl overflow-hidden h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#304040]">
                <h3 className="text-sm font-semibold text-white">
                  Confirmar eliminacion
                </h3>
                <button className="text-gray-500 hover:text-gray-300 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-5">
                <p className="text-sm text-gray-300">
                  Estas seguro de que deseas eliminar este sitio? Esta accion no se
                  puede deshacer.
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 px-5 py-3.5 bg-[#111111] border-t border-[#304040]">
                <button className="text-sm px-4 py-2 rounded-lg border border-[#304040] text-gray-300 hover:bg-[#1A3036] transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest">
                  Cancelar
                </button>
                <button className="nxt-btn-primary text-sm px-4 py-2 bg-error hover:bg-error/90 transition-all duration-200 active:scale-95 focus-visible:ring-2 focus-visible:ring-forest">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
