"use client";
import { useEffect, useState } from "react";
import { initialState, FormState } from "@/lib/types";
import { Progress } from "./ui";
import Step1Vehicle from "./steps/Step1Vehicle";
import Step2Policy from "./steps/Step2Policy";
import Step3Quote from "./steps/Step3Quote";
import Step4Contact from "./steps/Step4Contact";
import StepDone from "./steps/StepDone";
import LoadingCard from "./LoadingCard";

const STORAGE_KEY = "miqf_state_v1";

export default function QuoteForm() {
  const [state, setStateRaw] = useState<FormState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let next: FormState | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as FormState;
        if (parsed && parsed.step) {
          parsed.loading_label = null;
          next = parsed;
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStateRaw(
      next ?? { ...initialState, start_ts: Date.now() },
    );
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  function setState(patch: Partial<FormState>) {
    setStateRaw((s) => ({ ...s, ...patch }));
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setStateRaw({ ...initialState, start_ts: Date.now() });
  }

  return (
    <div className="mx-auto w-full max-w-[520px] px-4 py-5 pb-24">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-500">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-white">
              Motor Insurance
            </h1>
            <p className="text-xs text-white/40">Quick Quote</p>
          </div>
        </div>
        <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white/70">
          {state.step >= 5 ? "Done" : `Step ${state.step} / 4`}
        </span>
      </header>

      <Progress step={state.step} />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className="p-5 sm:p-6">
          {state.loading_label ? (
            <LoadingCard
              label={state.loading_label}
              variant={state.step === 4 ? "lead" : "quote"}
            />
          ) : (
            <>
              {state.step === 1 && (
                <Step1Vehicle state={state} setState={setState} />
              )}
              {state.step === 2 && (
                <Step2Policy state={state} setState={setState} />
              )}
              {state.step === 3 && (
                <Step3Quote state={state} setState={setState} />
              )}
              {state.step === 4 && (
                <Step4Contact state={state} setState={setState} />
              )}
              {state.step >= 5 && <StepDone state={state} reset={reset} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
