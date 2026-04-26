import type { FormState, Tier } from "./types";
import { emailDomainBad, isRepeatingMobile } from "./validate";

export type RiskResult = {
  score: number;
  signals: string[];
  tier: Tier;
};

export function computeRisk(s: FormState): RiskResult {
  let score = 0;
  const sig: string[] = [];

  if (s.honeypot && s.honeypot.length) {
    score += 100;
    sig.push("honeypot_filled");
  }

  const elapsed = (Date.now() - s.start_ts) / 1000;
  if (elapsed < 8) {
    score += 80;
    sig.push("submit_under_8s");
  } else if (elapsed < 20) {
    score += 30;
    sig.push("submit_under_20s");
  }

  if (isRepeatingMobile(s.mobile_number)) {
    score += 60;
    sig.push("repeating_mobile");
  }

  if (emailDomainBad(s.email_address)) {
    score += 60;
    sig.push("throwaway_email");
  }

  const ncb =
    parseInt((s.ncb_percentage || "0").toString().replace("%", "")) || 0;
  const claims = s.claims_in_last_3_years === "3+" ? 3 : parseInt(s.claims_in_last_3_years) || 0;
  if (ncb > 0 && claims > 0) {
    score += 60;
    sig.push("ncb_claims_contradiction");
  }

  if (s.break_in && ncb > 0) {
    score += 20;
    sig.push("breakin_with_ncb");
  }

  if (s.full_name && (s.full_name.trim().length < 3 || /\d/.test(s.full_name))) {
    score += 20;
    sig.push("name_anomaly");
  }

  const tier: Tier = score > 100 ? "Low Quality" : score >= 50 ? "Medium" : "High";
  return { score, signals: sig, tier };
}
