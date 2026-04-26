import { NextResponse } from "next/server";
import { computeRisk } from "@/lib/risk";
import type { FormState } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as { state: FormState };
  const s = body.state;
  if (!s) return NextResponse.json({ error: "missing_state" }, { status: 400 });

  const risk = computeRisk(s);
  const lead = {
    name: s.full_name,
    mobile: s.mobile_number,
    email: s.email_address,
    ownership: s.ownership,
    vehicle: {
      reg: s.reg_number,
      make: s.make,
      model: s.model,
      variant: s.variant,
      year: s.manufacture_year,
      fuel: s.fuel_type,
      cng_kit: s.cng_kit,
    },
    policy: {
      city: s.city_of_registration,
      expiry: s.previous_policy_expiry_date,
      ncb: s.ncb_percentage,
      claims: s.claims_in_last_3_years,
      break_in: s.break_in,
      idv: s.idv_preference,
    },
    quote: s.quote,
    quality: risk,
    meta: { time_on_form_s: Math.round((Date.now() - s.start_ts) / 1000) },
  };

  console.log("[CRM lead]", JSON.stringify(lead, null, 2));

  return NextResponse.json({ ok: true, risk });
}
