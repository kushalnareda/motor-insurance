"use client";
import type { FormState } from "@/lib/types";
import { calcQuote, fmtINR } from "@/lib/quote";
import { GhostBtn, PrimaryBtn } from "../ui";

type Props = {
  state: FormState;
  setState: (p: Partial<FormState>) => void;
};

export default function Step3Quote({ state, setState }: Props) {
  const q = state.quote || calcQuote(state);

  return (
    <div className="step-enter">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Your Quote</h2>
        <p className="mt-1.5 text-sm text-white/50">
          Indicative pricing - final price after insurer confirmation
        </p>
      </div>

      <div className="mb-5 overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-violet-500/10 to-transparent p-6 text-center">
        <div className="text-xs font-medium uppercase tracking-wider text-white/50">
          Estimated Premium
        </div>
        <div className="mt-2 bg-gradient-to-r from-sky-300 via-violet-300 to-purple-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          {fmtINR(q.lo)} - {fmtINR(q.hi)}
        </div>
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/50">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            / year
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            NCB: {q.ncb_applied}%
          </span>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="text-xs font-medium uppercase tracking-wider text-white/40">
          Top Insurers
        </div>
        {q.insurers.map((i) => (
          <div
            key={i.name}
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-all hover:border-sky-500/30 hover:bg-sky-500/5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <span className="text-xs font-bold text-white/70">
                  {i.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-white">{i.name}</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {fmtINR(i.price)}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-5 flex justify-between rounded-xl bg-white/5 px-4 py-3 text-xs text-white/50">
        <span className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          IDV: {fmtINR(q.idv)}
        </span>
        <span className="flex items-center gap-3">
          <span>OD: {fmtINR(q.od)}</span>
          <span className="text-white/30">|</span>
          <span>TP: {fmtINR(q.tp)}</span>
        </span>
      </div>

      <div className="flex gap-3">
        <GhostBtn onClick={() => setState({ step: 2 })}>Back</GhostBtn>
        <PrimaryBtn onClick={() => setState({ step: 4 })}>
          Proceed with Quote
        </PrimaryBtn>
      </div>
    </div>
  );
}
