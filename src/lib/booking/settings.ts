import "server-only";
import { db } from "./db";
import { ensureSchema } from "./schema";

export interface BookingSettings {
  /** When false, the website takes enquiries instead of booking requests. */
  onlineBooking: boolean;
  currency: string;
  /** Shown to guests before they submit. */
  policyNote: string;
}

const DEFAULTS: BookingSettings = {
  onlineBooking: true,
  currency: "USD",
  policyNote:
    "This is a booking request. We hold the room while our team confirms availability and your rate, usually within 24 hours. No payment is taken online.",
};

export async function getSettings(): Promise<BookingSettings> {
  await ensureSchema();
  const d = await db();
  const rows = await d.query<{ key: string; value: string }>(`SELECT key, value FROM settings`);
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    onlineBooking: map.onlineBooking ? map.onlineBooking === "true" : DEFAULTS.onlineBooking,
    currency: map.currency || DEFAULTS.currency,
    policyNote: map.policyNote || DEFAULTS.policyNote,
  };
}

export async function saveSettings(s: Partial<BookingSettings>) {
  await ensureSchema();
  const d = await db();
  for (const [key, value] of Object.entries(s)) {
    if (value === undefined) continue;
    await d.query(`INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`, [key, String(value)]);
  }
}
