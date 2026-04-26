import { NextResponse } from "next/server";
import { VAHAN_DB } from "@/lib/vahan-mock";
import { RE_REG } from "@/lib/validate";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ reg: string }> },
) {
  const { reg: rawReg } = await ctx.params;
  const reg = (rawReg || "").toUpperCase();
  if (!RE_REG.test(reg)) {
    return NextResponse.json({ error: "invalid_format" }, { status: 400 });
  }
  await new Promise((r) => setTimeout(r, 1500));
  const v = VAHAN_DB[reg];
  if (!v) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ reg_number: reg, ...v });
}
