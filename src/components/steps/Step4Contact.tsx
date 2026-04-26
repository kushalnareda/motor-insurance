"use client";
import { useState } from "react";
import type { FormState } from "@/lib/types";
import {
  RE_EMAIL,
  RE_MOB,
  emailDomainBad,
  isRepeatingMobile,
} from "@/lib/validate";
import { computeRisk } from "@/lib/risk";
import { Field, GhostBtn, PrimaryBtn, inputCls } from "../ui";

type Props = {
  state: FormState;
  setState: (p: Partial<FormState>) => void;
};

export default function Step4Contact({ state, setState }: Props) {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!state.full_name || state.full_name.trim().length < 2) {
      setErr("Enter your full name");
      return;
    }
    if (!RE_MOB.test(state.mobile_number)) {
      setErr("Enter a valid 10-digit mobile number");
      return;
    }
    if (isRepeatingMobile(state.mobile_number)) {
      setErr("Please enter a valid mobile number");
      return;
    }
    if (!RE_EMAIL.test(state.email_address)) {
      setErr("Enter a valid email address");
      return;
    }
    if (emailDomainBad(state.email_address)) {
      setErr("Please use a valid email domain");
      return;
    }
    setErr("");
    setBusy(true);
    setState({ loading_label: "Locking your quote" });

    const risk = computeRisk(state);
    const updates: Partial<FormState> = {
      risk_score: risk.score,
      risk_signals: risk.signals,
      risk_tier: risk.tier,
    };

    if (risk.tier === "Low Quality" && state.quote) {
      updates.quote = {
        ...state.quote,
        lo: Math.round(state.quote.lo * 0.85),
        hi: Math.round(state.quote.hi * 1.3),
        insurers: [],
        generic: true,
      };
    }

    const minDelay = new Promise((r) => setTimeout(r, 1500));
    try {
      await Promise.all([
        fetch("/api/lead", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ state: { ...state, ...updates } }),
        }),
        minDelay,
      ]);
    } catch {
      // silent - UX must not surface scoring or transport
    }

    setState({ ...updates, step: 5, loading_label: null });
    setBusy(false);
  }

  return (
    <div className="step-enter">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Almost There</h2>
        <p className="mt-1.5 text-sm text-white/50">
          We'll send the detailed quote and lock the price
        </p>
      </div>

      <div className="mb-5 rounded-xl bg-sky-500/10 border border-sky-500/20 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20">
            <svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-sm text-white/80">
            Your quote will be sent to your email and WhatsApp
          </div>
        </div>
      </div>

      <Field label="Full Name" error={err && !state.full_name ? err : undefined}>
        <div className="relative">
          <input
            className={inputCls + " pl-10"}
            placeholder="As per RC"
            value={state.full_name}
            onChange={(e) => {
              setState({ full_name: e.target.value });
              if (err) setErr("");
            }}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
        </div>
      </Field>

      <Field label="Mobile Number" error={err && !RE_MOB.test(state.mobile_number) ? err : undefined}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            +91
          </span>
          <input
            className={inputCls + " pl-12 font-mono tracking-wider"}
            inputMode="numeric"
            maxLength={10}
            placeholder="9876543210"
            value={state.mobile_number}
            onChange={(e) => {
              setState({
                mobile_number: e.target.value.replace(/\D/g, "").slice(0, 10),
              });
              if (err) setErr("");
            }}
          />
        </div>
      </Field>

      <Field label="Email Address" error={err && !RE_EMAIL.test(state.email_address) ? err : undefined}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            className={inputCls + " pl-10"}
            inputMode="email"
            placeholder="you@example.com"
            value={state.email_address}
            onChange={(e) => {
              setState({ email_address: e.target.value.trim() });
              if (err) setErr("");
            }}
          />
        </div>
      </Field>

      <div className="mt-6 flex gap-3">
        <GhostBtn onClick={() => setState({ step: 3 })}>Back</GhostBtn>
        <PrimaryBtn onClick={submit} disabled={busy}>
          {busy ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              Submitting...
            </span>
          ) : (
            "Submit & Get Quote"
          )}
        </PrimaryBtn>
      </div>
    </div>
  );
}
