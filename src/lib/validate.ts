export const RE_REG = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{1,4}$/;
export const RE_MOB = /^[6-9]\d{9}$/;
export const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const THROWAWAY = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "trashmail.com",
  "fakeinbox.com",
  "throwawaymail.com",
];

export function isRepeatingMobile(m: string): boolean {
  if (!m) return false;
  if (/^(\d)\1{9}$/.test(m)) return true;
  return ["0123456789", "1234567890", "9876543210"].includes(m);
}

export function emailDomainBad(e: string): boolean {
  const d = (e.split("@")[1] || "").toLowerCase();
  return THROWAWAY.includes(d);
}

export function parseDDMMYYYY(s: string): Date | null {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const dd = +m[1], mm = +m[2], yyyy = +m[3];
  if (mm < 1 || mm > 12) return null;
  if (dd < 1 || dd > 31) return null;
  if (yyyy < 1900 || yyyy > 2100) return null;
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getDate() !== dd || d.getMonth() !== mm - 1 || d.getFullYear() !== yyyy)
    return null;
  return d;
}

export function daysSince(d: Date): number {
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

export type ExpiryCheck =
  | { ok: true; date: Date; break_in: boolean; days: number }
  | { ok: false; reason: string };

export function validateExpiry(s: string): ExpiryCheck {
  if (!s) return { ok: false, reason: "Enter expiry as DD/MM/YYYY." };
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(s))
    return { ok: false, reason: "Use format DD/MM/YYYY." };
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)!;
  const dd = +m[1], mm = +m[2], yyyy = +m[3];
  if (mm < 1 || mm > 12)
    return { ok: false, reason: "Month must be between 01 and 12." };
  if (dd < 1 || dd > 31)
    return { ok: false, reason: "Day must be between 01 and 31." };
  if (yyyy < 1990 || yyyy > new Date().getFullYear() + 2)
    return { ok: false, reason: "Year looks off — check again." };
  const d = parseDDMMYYYY(s);
  if (!d) return { ok: false, reason: "That date doesn't exist." };

  const days = daysSince(d);
  // Past > 5 years ago = unrealistic for a motor renewal
  if (days > 365 * 5)
    return { ok: false, reason: "Expiry too far in the past." };
  // Future > 1 year = unrealistic
  if (days < -365)
    return { ok: false, reason: "Expiry too far in the future." };
  return { ok: true, date: d, days, break_in: days > 90 };
}
