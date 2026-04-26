"use client";
import { useEffect, useState } from "react";

const QUOTE_STAGES = [
  "Pulling vehicle history…",
  "Matching across insurers…",
  "Applying NCB and discounts…",
  "Comparing premiums…",
];

const LEAD_STAGES = [
  "Locking your quote…",
  "Verifying details…",
  "Almost there…",
];

export default function LoadingCard({
  label,
  variant = "quote",
}: {
  label: string;
  variant?: "quote" | "lead";
}) {
  const stages = variant === "lead" ? LEAD_STAGES : QUOTE_STAGES;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => Math.min(i + 1, stages.length - 1)),
      550,
    );
    return () => clearInterval(t);
  }, [stages.length]);

  return (
    <div className="step-enter flex flex-col items-center py-6 text-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-sky-400 border-r-violet-400" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-sky-500/20 to-violet-500/20 blur-md" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-white">{label}</h2>
      <ul className="mt-4 w-full max-w-xs space-y-2 text-left">
        {stages.map((s, i) => (
          <li
            key={s}
            className={
              "flex items-center gap-2 text-sm transition " +
              (i < idx
                ? "text-white/40"
                : i === idx
                  ? "text-white"
                  : "text-white/25")
            }
          >
            <span
              className={
                "inline-flex h-4 w-4 flex-none items-center justify-center rounded-full text-[10px] " +
                (i < idx
                  ? "bg-emerald-500/30 text-emerald-300"
                  : i === idx
                    ? "bg-sky-500/30 text-sky-200"
                    : "bg-white/5 text-white/30")
              }
            >
              {i < idx ? "✓" : i === idx ? "•" : ""}
            </span>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
