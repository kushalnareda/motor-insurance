"use client";
import type { FormState } from "@/lib/types";
import { fmtINR } from "@/lib/quote";
import { GhostBtn } from "../ui";

type Props = {
  state: FormState;
  reset: () => void;
};

export default function StepDone({ state, reset }: Props) {
  const q = state.quote;
  return (
    <div className="step-enter text-center">
      <div className="mb-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/20">
          <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white">You're All Set!</h2>
      <p className="mx-auto mt-2 max-w-[280px] text-sm text-white/60">
        Your quote has been sent to your email and WhatsApp.</p>

      {q && (
        <div className="mx-auto mt-6 max-w-[280px] overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-violet-500/10 to-transparent p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-white/50">
            Your Quote
          </div>
          <div className="mt-1 bg-gradient-to-r from-sky-300 via-violet-300 to-purple-300 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            {fmtINR(q.lo)} - {fmtINR(q.hi)}
          </div>
          <div className="mt-2 text-xs text-white/50">
            {q.generic ? "Indicative range" : "per year"}
          </div>
        </div>
      )}

      <div className="mx-auto mt-6 max-w-[280px] rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
            <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-sm text-amber-200/90">
            An agent will reach out to you over email and WhatsApp for confirmation and next steps.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={reset}
          className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Start Over
        </button>
      </div>
    </div>
  );
}
