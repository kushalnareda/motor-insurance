import { NextResponse } from "next/server";
import { calcQuote } from "@/lib/quote";
import type { FormState } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as { state: FormState };
  const s = body.state;
  if (!s) return NextResponse.json({ error: "missing_state" }, { status: 400 });

  // Simulate insurer-matching latency.
  const delay = 1400 + Math.floor(Math.random() * 500);
  await new Promise((r) => setTimeout(r, delay));

  const quote = calcQuote(s);
  return NextResponse.json({ quote, matched_insurers: quote.insurers.length });
}
