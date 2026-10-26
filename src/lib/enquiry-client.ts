export type SubmitResult =
  | { status: "sent" }
  | { status: "unconfigured" }
  | { status: "error"; message: string };

export interface EnquiryPayload {
  subject: string;
  body: string;
  replyTo?: string;
  name?: string;
  /** Honeypot. Leave empty. */
  website?: string;
}

export async function submitEnquiry(payload: EnquiryPayload): Promise<SubmitResult> {
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { status: "sent" };
    if (res.status === 503) return { status: "unconfigured" };
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    return { status: "error", message: data.error || "The message could not be sent." };
  } catch {
    return { status: "error", message: "The message could not be sent. Check your connection and try again." };
  }
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn + "T00:00:00").getTime();
  const b = new Date(checkOut + "T00:00:00").getTime();
  return Math.round((b - a) / 86400000);
}

/** Returns an error message for a date range, or null when valid. */
export function validateDates(checkIn: string, checkOut: string): { checkIn?: string; checkOut?: string } {
  const errors: { checkIn?: string; checkOut?: string } = {};
  const today = todayISO();
  if (!checkIn) errors.checkIn = "Choose a check-in date.";
  else if (checkIn < today) errors.checkIn = "Check-in can't be in the past.";
  if (!checkOut) errors.checkOut = "Choose a check-out date.";
  else if (checkIn && checkOut <= checkIn) errors.checkOut = "Check-out must be after check-in.";
  return errors;
}

export function formatDateLong(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}
