"use client";
import { useState, useRef, useEffect } from "react";
import type { FormState, IDVPref, Quote } from "@/lib/types";
import { validateExpiry } from "@/lib/validate";
import { INDIAN_CITIES, isKnownCity } from "@/lib/cities";
import { Field, GhostBtn, PrimaryBtn, Segmented, WarnBox, inputCls } from "../ui";

type Props = {
  state: FormState;
  setState: (p: Partial<FormState>) => void;
};

const NCB_OPTIONS = ["", "0%", "20%", "25%", "35%", "45%", "50%"];

function CityDropdown({
  value,
  onChange,
  onSelect,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = INDIAN_CITIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 10);

  useEffect(() => {
    setHighlighted(0);
  }, [search]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => (h < filtered.length - 1 ? h + 1 : h));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => (h > 0 ? h - 1 : h));
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSelect(filtered[highlighted]);
      setOpen(false);
      setSearch("");
    } else if (e.key === "Tab") {
      onSelect(filtered[highlighted]);
      setOpen(false);
      setSearch("");
    }
  }

  return (
    <div ref={ref} className="relative">
      <input
        className={inputCls}
        placeholder="e.g. Delhi"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {open && (value || search) && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-[#1a1a2e] py-1 shadow-xl">
          <div className="border-b border-white/10 px-2 pb-2">
            <input
              ref={searchRef}
              className="w-full rounded bg-white/5 px-2 py-1.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-0 focus:border-sky-400/50"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-white/50">No cities found</div>
            ) : (
              filtered.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  className={`w-full px-3 py-2 text-left text-sm ${
                    i === highlighted
                      ? "bg-sky-500/30 text-white"
                      : "text-white/80 hover:bg-sky-500/20 hover:text-white"
                  }`}
                  onClick={() => {
                    onSelect(c);
                    setOpen(false);
                    setSearch("");
                  }}
                  onMouseEnter={() => setHighlighted(i)}
                >
                  {c}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Step2Policy({ state, setState }: Props) {
  const [err, setErr] = useState("");
  const [expiryErr, setExpiryErr] = useState("");
  const [cityHint, setCityHint] = useState("");

  function onExpiryChange(raw: string) {
    let v = raw.replace(/[^\d/]/g, "");
    if (v.length === 2 && state.previous_policy_expiry_date.length < 2) v += "/";
    if (v.length === 5 && state.previous_policy_expiry_date.length < 5) v += "/";
    if (v.length > 10) v = v.slice(0, 10);
    setState({ previous_policy_expiry_date: v });
  }

  function checkExpiry() {
    if (!state.previous_policy_expiry_date) return;
    const r = validateExpiry(state.previous_policy_expiry_date);
    if (!r.ok) {
      setExpiryErr(r.reason);
      setState({ break_in: false });
      return;
    }
    setExpiryErr("");
    if (r.break_in) {
      setState({ break_in: true, ncb_percentage: "0%" });
    } else {
      setState({ break_in: false });
    }
  }

  function checkCity() {
    const v = state.city_of_registration.trim();
    if (!v) {
      setCityHint("");
      return;
    }
    if (!isKnownCity(v)) {
      setCityHint("Not in our RTO list — premium may need manual review.");
    } else {
      setCityHint("");
    }
  }

  async function next() {
    if (!state.city_of_registration.trim()) {
      setErr("Enter your city.");
      return;
    }
    const r = validateExpiry(state.previous_policy_expiry_date);
    if (!r.ok) {
      setExpiryErr(r.reason);
      setErr(r.reason);
      return;
    }
    if (!state.ncb_percentage) {
      setErr("Select NCB %.");
      return;
    }
    setErr("");
    setState({ loading_label: "Matching you with insurers" });
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ state }),
      });
      const data = (await res.json()) as { quote: Quote };
      setState({ quote: data.quote, step: 3, loading_label: null });
    } catch {
      setErr("Couldn't fetch quote. Try again.");
      setState({ loading_label: null });
    }
  }

  return (
    <div className="step-enter">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Policy Details</h2>
        <p className="mt-1.5 text-sm text-white/50">
          A few details so we can price it right
        </p>
      </div>

      <Field label="City of Registration" hint={cityHint || undefined}>
        <CityDropdown
          value={state.city_of_registration}
          onChange={(v) => setState({ city_of_registration: v })}
          onSelect={(c) => {
            setState({ city_of_registration: c });
            setCityHint("");
          }}
        />
      </Field>

      <Field
        label="Previous Policy Expiry"
        error={expiryErr || undefined}
      >
        <div className="relative">
          <input
            className={inputCls + " font-mono tracking-wider"}
            inputMode="numeric"
            placeholder="DD/MM/YYYY"
            maxLength={10}
            value={state.previous_policy_expiry_date}
            onChange={(e) => {
              onExpiryChange(e.target.value);
              if (expiryErr) setExpiryErr("");
            }}
            onBlur={checkExpiry}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30">
            DD/MM/YYYY
          </span>
        </div>
      </Field>

      {state.break_in && !expiryErr && (
        <WarnBox>
          Your NCB may have lapsed - final discount subject to verification
        </WarnBox>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label="No Claim Bonus (NCB)">
          <select
            className={inputCls}
            value={state.ncb_percentage}
            onChange={(e) => setState({ ncb_percentage: e.target.value })}
          >
            {NCB_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {v || "Select NCB"}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Claims (Last 3 Years)">
          <select
            className={inputCls}
            value={state.claims_in_last_3_years}
            onChange={(e) =>
              setState({
                claims_in_last_3_years: e.target.value as FormState["claims_in_last_3_years"],
              })
            }
          >
            {(["0", "1", "2", "3+"] as const).map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="IDV Preference">
        <Segmented<IDVPref>
          value={state.idv_preference}
          onChange={(v) => setState({ idv_preference: v })}
          options={[
            { v: "Low", title: "Cheaper, lower payout" },
            { v: "Market", title: "Balanced" },
            { v: "High", title: "Max payout, costlier" },
          ]}
        />
      </Field>

      {err && <p className="mt-2 text-xs text-rose-400">{err}</p>}

      <div className="mt-6 flex gap-3">
        <GhostBtn onClick={() => setState({ step: 1 })}>Back</GhostBtn>
        <PrimaryBtn onClick={next}>Get Quote</PrimaryBtn>
      </div>
    </div>
  );
}
