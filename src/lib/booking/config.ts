import { databaseUrl } from "./db";

/** Online booking needs a database. Without one, the site falls back to enquiries. */
export function bookingConfigured(): boolean {
  return Boolean(databaseUrl());
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH && (process.env.SESSION_SECRET?.length ?? 0) >= 32);
}

export function emailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

/** Hotel's local time zone; "today" for availability is Sri Lanka's today. */
export const HOTEL_TZ = "Asia/Colombo";

export const LIMITS = {
  maxNights: 30,
  maxMonthsAhead: 18,
  maxRoomsPerBooking: 6,
  /** Imported calendars older than this are refreshed before an availability check. */
  icalStaleMinutes: 15,
};
