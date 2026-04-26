"use client";
import { useState } from "react";
import type { FormState, FuelType, VehicleData } from "@/lib/types";
import { RE_REG } from "@/lib/validate";
import { Field, PrimaryBtn, Segmented, Toggle, inputCls } from "../ui";

type Props = {
  state: FormState;
  setState: (p: Partial<FormState>) => void;
};

export default function Step1Vehicle({ state, setState }: Props) {
  const [regErr, setRegErr] = useState("");
  const [vahanMsg, setVahanMsg] = useState("");

  async function lookupReg() {
    const reg = state.reg_number.trim().toUpperCase();
    if (!reg) return;
    if (!RE_REG.test(reg)) {
      setRegErr("Format: DL09CA1234");
      setState({ vahan_status: "idle" });
      return;
    }
    setRegErr("");
    setVahanMsg("Fetching vehicle details...");
    setState({ vahan_status: "loading" });
    try {
      const res = await fetch(`/api/vahan/${reg}`);
      if (res.ok) {
        const v = (await res.json()) as VehicleData & { reg_number: string };
        setVahanMsg(`✓ Found: ${v.make} ${v.model}`);
        setState({
          vahan_status: "ok",
          make: v.make,
          model: v.model,
          variant: v.variant,
          manufacture_year: String(v.manufacture_year),
          fuel_type: v.fuel_type,
        });
      } else {
        setVahanMsg("Couldn't auto-fetch - fill manually.");
        setState({ vahan_status: "fail" });
      }
    } catch {
      setVahanMsg("Couldn't auto-fetch - fill manually.");
      setState({ vahan_status: "fail" });
    }
  }

  function retry() {
    lookupReg();
  }

  function next() {
    if (!RE_REG.test(state.reg_number)) {
      setRegErr("Enter a valid reg number.");
      return;
    }
    if (
      !state.make ||
      !state.model ||
      !state.variant ||
      !state.manufacture_year ||
      !state.fuel_type
    ) {
      setRegErr("Fill all vehicle details to continue.");
      return;
    }
    setState({ step: 2 });
  }

  const locked = state.vahan_status === "ok";
  const showFields =
    state.vahan_status === "ok" || state.vahan_status === "fail";

  return (
    <div className="step-enter">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
          Tell us about your vehicle
        </h2>
        <p className="mt-1.5 text-sm text-white/50">
          Enter your reg number - we'll fetch the details
        </p>
      </div>

      <div className="mb-5">
        <label className="mb-2.5 block text-xs font-medium text-white/70">
          Ownership Type
        </label>
        <Toggle<"Individual" | "Corporate">
          value={state.ownership}
          options={["Individual", "Corporate"]}
          onChange={(v) => setState({ ownership: v })}
        />
      </div>

      <Field label="Registration Number" error={regErr}>
        <div className="relative">
          <input
            className={inputCls + " uppercase tracking-widest pr-12 font-mono text-[16px]"}
            placeholder="DL09CA1234"
            value={state.reg_number}
            autoCapitalize="characters"
            autoComplete="off"
            onChange={(e) =>
              setState({
                reg_number: e.target.value.toUpperCase().replace(/\s+/g, ""),
              })
            }
            onBlur={lookupReg}
          />
          {state.vahan_status === "loading" && (
            <span
              aria-hidden
              className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border-2 border-white/20 border-t-sky-400"
            />
          )}
          {state.vahan_status === "ok" && (
            <span className="absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center">
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </div>
        {vahanMsg && (
          <p className={`mt-2 text-xs ${state.vahan_status === "ok" ? "text-emerald-400" : "text-white/50"}`}>
            {vahanMsg}
          </p>
        )}
        {state.vahan_status === "fail" && (
          <button
            type="button"
            onClick={retry}
            className="mt-2 text-xs text-sky-400 hover:text-sky-300"
          >
            Retry auto-fetch
          </button>
        )}
      </Field>

      {showFields && (
        <div className="animate-fade-in mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Make">
              <input
                className={inputCls}
                value={state.make}
                disabled={locked}
                onChange={(e) => setState({ make: e.target.value })}
              />
            </Field>
            <Field label="Model">
              <input
                className={inputCls}
                value={state.model}
                disabled={locked}
                onChange={(e) => setState({ model: e.target.value })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Variant">
              <input
                className={inputCls}
                value={state.variant}
                disabled={locked}
                onChange={(e) => setState({ variant: e.target.value })}
              />
            </Field>
            <Field label="Year">
              <input
                className={inputCls}
                value={state.manufacture_year}
                disabled={locked}
                inputMode="numeric"
                maxLength={4}
                onChange={(e) =>
                  setState({ manufacture_year: e.target.value.replace(/\D/g, "").slice(0, 4) })
                }
              />
            </Field>
          </div>
          <Field label="Fuel Type">
            <select
              className={inputCls}
              value={state.fuel_type}
              disabled={locked}
              onChange={(e) =>
                setState({ fuel_type: e.target.value as FuelType })
              }
            >
              <option value="">Select fuel type</option>
              {(["Petrol", "Diesel", "CNG", "EV"] as FuelType[]).map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </Field>
          {state.fuel_type === "CNG" && (
            <Field label="External CNG Kit Fitted?">
              <Segmented<"No" | "Yes">
                value={state.cng_kit}
                options={[{ v: "No" }, { v: "Yes" }]}
                onChange={(v) => setState({ cng_kit: v })}
              />
            </Field>
          )}
        </div>
      )}

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        value={state.honeypot}
        onChange={(e) => setState({ honeypot: e.target.value })}
      />

      <div className="mt-6 flex gap-3">
        <PrimaryBtn onClick={next}>Continue</PrimaryBtn>
      </div>
    </div>
  );
}
