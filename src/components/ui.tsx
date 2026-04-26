"use client";
import { ReactNode, useState } from "react";

export function Progress({ step, total = 4 }: { step: number; total?: number }) {
  const pct = Math.min(100, Math.round((Math.min(step, total) / total) * 100));
  const steps = ["Vehicle", "Policy", "Quote", "Review"];
  return (
    <div className="mb-6 mt-2">
      <div className="mb-3 flex items-center justify-between">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`flex items-center gap-2 text-xs font-medium ${
              i + 1 <= step ? "text-sky-300" : "text-white/30"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                i + 1 < step
                  ? "bg-sky-500 text-white"
                  : i + 1 === step
                  ? "bg-gradient-to-r from-sky-500 to-violet-500 text-white"
                  : "bg-white/10"
              }`}
            >
              {i + 1 < step ? "✓" : i + 1}
            </span>
            <span className="hidden sm:inline">{s}</span>
          </div>
        ))}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full animate-pulse-fast rounded-full bg-gradient-to-r from-sky-400 to-violet-500 transition-all duration-500"
          style={{ width: pct + "%" }}
        />
      </div>
    </div>
  );
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="group mt-4">
      {label && (
        <label className="mb-2 block text-xs font-medium tracking-wide text-white/70 transition group-focus-within:text-sky-300">
          {label}
        </label>
      )}
      <div
        className={`relative transition-all duration-200 ${
          error
            ? "ring-2 ring-rose-500/40"
            : focused
            ? "ring-2 ring-sky-500/30"
            : ""
        }`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {children}
      </div>
      {hint && !error && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-white/40">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {hint}
        </p>
      )}
      {error && (
        <div className="mt-2 flex items-start gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs text-rose-300">{error}</p>
        </div>
      )}
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-[15px] text-white placeholder:text-white/25 outline-none ring-0 focus:outline-none focus:ring-0 focus:border-sky-400/50 focus:bg-white/10 hover:border-white/20 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-50";

export function Toggle<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`relative flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
            value === o
              ? "border-sky-500/50 bg-sky-500/10 text-white shadow-lg shadow-sky-500/10"
              : "border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/10 hover:text-white/70"
          }`}
        >
          {value === o && (
            <span className="flex h-1.5 w-1.5 rounded-full bg-sky-400" />
          )}
          {o}
        </button>
      ))}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { v: T; label?: string; title?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((o, i) => {
        const isSelected = value === o.v;
        return (
          <button
            key={o.v}
            type="button"
            title={o.title}
            onClick={() => onChange(o.v)}
            className={`relative flex-1 rounded-2xl border px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
              isSelected
                ? "border-sky-400/50 bg-gradient-to-r from-sky-500/20 to-violet-500/20 text-white shadow-lg shadow-sky-500/10"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
            }`}
          >
            {o.label || o.v}
            {isSelected && (
              <span className="absolute inset-0 rounded-2xl border border-sky-400/30 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function PrimaryBtn({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const [active, setActive] = useState(false);
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => setActive(false)}
      className={`group relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-violet-500 px-6 py-4 text-[15px] font-semibold text-white shadow-lg shadow-sky-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-sky-500/30 disabled:cursor-not-allowed disabled:opacity-50 ${
        active ? "scale-[0.98]" : "scale-100"
      }`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        <svg
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </span>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
    </button>
  );
}

export function GhostBtn({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex-1 overflow-hidden rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-[15px] font-medium text-white/80 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:text-white"
    >
      <span className="flex items-center justify-center gap-2">
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 17l-5-5m0 0l5-5m-5 5h12"
          />
        </svg>
        {children}
      </span>
    </button>
  );
}

export function WarnBox({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 animate-slide-in rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-4 py-3.5">
      <div className="flex items-start gap-3">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
          <svg
            className="h-3 w-3 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </span>
        <p className="text-[13px] leading-relaxed text-amber-200/90">
          {children}
        </p>
      </div>
    </div>
  );
}

export function Alert({
  variant = "error",
  title,
  children,
}: {
  variant?: "error" | "success" | "warning" | "info";
  title?: string;
  children: ReactNode;
}) {
  const styles = {
    error: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    info: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  };

  const icons = {
    error: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    success: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    warning: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
    info: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  };

  const colors = {
    error: "text-rose-400",
    success: "text-emerald-400",
    warning: "text-amber-400",
    info: "text-sky-400",
  };

  return (
    <div className={`mt-3 flex items-start gap-3 rounded-xl border px-4 py-3 ${styles[variant]}`}>
      <svg className={`mt-0.5 h-5 w-5 shrink-0 ${colors[variant]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icons[variant]}
      </svg>
      <div>
        {title && <p className="font-medium">{title}</p>}
        <p className="text-sm opacity-90">{children}</p>
      </div>
    </div>
  );
}

export function SuccessBox({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 animate-slide-in rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-3.5">
      <div className="flex items-start gap-3">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
          <svg
            className="h-3 w-3 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <p className="text-[13px] leading-relaxed text-emerald-200/90">
          {children}
        </p>
      </div>
    </div>
  );
}
