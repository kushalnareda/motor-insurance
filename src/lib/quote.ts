import type { FormState, Quote } from "./types";

function depreciationFactor(year: number): number {
  const age = new Date().getFullYear() - (year || new Date().getFullYear());
  if (age <= 0) return 0.95;
  if (age === 1) return 0.85;
  if (age === 2) return 0.8;
  if (age === 3) return 0.7;
  if (age === 4) return 0.6;
  if (age === 5) return 0.5;
  return 0.4;
}

function baseIDV(year: number, idvPref: FormState["idv_preference"]): number {
  const exShowroom = 800000;
  const dep = depreciationFactor(year);
  const mult = idvPref === "Low" ? 0.92 : idvPref === "High" ? 1.1 : 1.0;
  return Math.round(exShowroom * dep * mult);
}

function tpPremium(fuel: FormState["fuel_type"], variant: string): number {
  const cc = (variant.match(/(\d{3,4})\s*cc/i) || [])[1];
  const ccN = +cc || 1200;
  let base = ccN <= 1000 ? 2094 : ccN <= 1500 ? 3416 : 7897;
  if (fuel === "EV") base = Math.round(base * 0.85);
  return base;
}

export function calcQuote(s: FormState): Quote {
  const year = +s.manufacture_year || new Date().getFullYear();
  const idv = baseIDV(year, s.idv_preference);
  let od = idv * 0.027;

  const ncb =
    parseInt((s.ncb_percentage || "0").toString().replace("%", "")) / 100 || 0;
  od = od * (1 - ncb);

  if (s.fuel_type === "Diesel") od *= 1.1;
  if (s.fuel_type === "CNG" && s.cng_kit === "Yes") od *= 1.05;
  if (s.ownership === "Corporate") od *= 1.15;

  const claimsRaw = s.claims_in_last_3_years === "3+" ? 3 : parseInt(s.claims_in_last_3_years) || 0;
  od *= 1 + Math.min(claimsRaw * 0.1, 0.3);

  const tp = tpPremium(s.fuel_type, s.variant);
  const total = Math.round(od + tp);
  const lo = Math.round(total * 0.9);
  const hi = Math.round(total * 1.1);

  const insurers = [
    { name: "Acko", price: Math.round(total * 0.92) },
    { name: "Digit", price: Math.round(total * 1.0) },
    { name: "HDFC Ergo", price: Math.round(total * 1.07) },
  ];

  return {
    idv,
    od: Math.round(od),
    tp,
    total,
    lo,
    hi,
    ncb_applied: ncb * 100,
    insurers,
  };
}

export function fmtINR(n: number): string {
  return "₹ " + n.toLocaleString("en-IN");
}
