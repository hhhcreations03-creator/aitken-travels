import "server-only";
import crypto from "node:crypto";
import { db } from "./db";
import { ensureSchema } from "./schema";
import { addDays, isValidDate } from "./dates";
import { LIMITS } from "./config";
import { SITE } from "@/lib/site";

/** Secret token in each room type's export URL, so feeds can't be enumerated. */
export function exportToken(slug: string): string {
  return crypto.createHmac("sha256", process.env.SESSION_SECRET || "unset").update(`ical:${slug}`).digest("base64url").slice(0, 22);
}

export function exportUrl(slug: string): string {
  return `${SITE.url}/api/ical/${slug}?token=${exportToken(slug)}`;
}

interface IcsEvent {
  uid: string;
  start: string;
  end: string;
  summary: string;
}

/** Parses VEVENTs from an iCalendar file, turning DATE or DATE-TIME values into YYYY-MM-DD nights. */
export function parseIcs(text: string): IcsEvent[] {
  const unfolded = text.replace(/\r?\n[ \t]/g, "");
  const events: IcsEvent[] = [];
  for (const block of unfolded.split("BEGIN:VEVENT").slice(1)) {
    const body = block.split("END:VEVENT")[0];
    const field = (name: string) => body.match(new RegExp(`^${name}(?:;[^:\\r\\n]*)?:(.*)$`, "m"))?.[1]?.trim();
    const toDate = (v?: string) => (v ? `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}` : "");
    const start = toDate(field("DTSTART"));
    let end = toDate(field("DTEND"));
    if (!isValidDate(start)) continue;
    if (!isValidDate(end) || end <= start) end = addDays(start, 1);
    events.push({ uid: field("UID") || `${start}-${end}`, start, end, summary: field("SUMMARY") || "Blocked" });
  }
  return events;
}

export async function syncFeed(feedId: string): Promise<{ ok: boolean; events: number; error?: string }> {
  await ensureSchema();
  const d = await db();
  const [feed] = await d.query<{ id: string; room_slug: string; url: string }>(`SELECT id, room_slug, url FROM ical_feeds WHERE id = $1`, [feedId]);
  if (!feed) return { ok: false, events: 0, error: "Feed not found" };
  try {
    const res = await fetch(feed.url, { headers: { "User-Agent": "TheLavishHaven-CalendarSync/1.0" }, cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!text.includes("BEGIN:VCALENDAR")) throw new Error("Not an iCalendar file");
    const today = new Date().toISOString().slice(0, 10);
    const events = parseIcs(text).filter((e) => e.end > today);
    const queries = [
      { text: `DELETE FROM blocks WHERE feed_id = $1`, params: [feed.id] },
      ...events.map((e) => ({
        text: `INSERT INTO blocks (room_slug, start_date, end_date, units, reason, source, feed_id, external_uid)
               VALUES ($1, $2::date, $3::date, 1, $4, 'ical', $5, $6)`,
        params: [feed.room_slug, e.start, e.end, e.summary.slice(0, 200), feed.id, e.uid.slice(0, 300)],
      })),
      { text: `UPDATE ical_feeds SET last_synced_at = now(), last_error = NULL, event_count = $2 WHERE id = $1`, params: [feed.id, events.length] },
    ];
    await d.transaction(queries);
    return { ok: true, events: events.length };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Sync failed";
    await d.query(`UPDATE ical_feeds SET last_error = $2, last_synced_at = now() WHERE id = $1`, [feed.id, msg.slice(0, 300)]);
    return { ok: false, events: 0, error: msg };
  }
}

export async function syncAllFeeds(onlyStale = false) {
  await ensureSchema();
  const d = await db();
  const feeds = await d.query<{ id: string }>(
    onlyStale
      ? `SELECT id FROM ical_feeds WHERE last_synced_at IS NULL OR last_synced_at < now() - ($1 || ' minutes')::interval`
      : `SELECT id FROM ical_feeds`,
    onlyStale ? [String(LIMITS.icalStaleMinutes)] : []
  );
  return Promise.all(feeds.map((f) => syncFeed(f.id)));
}

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
const icsDate = (iso: string) => iso.replace(/-/g, "");

/**
 * Exports one room type's busy nights for other channels (Booking.com, Airbnb).
 * Each event is one unit taken; no guest details are included.
 */
export async function exportIcs(slug: string): Promise<string> {
  await ensureSchema();
  const d = await db();
  const rows = await d.query<{ id: string; start: string; end: string; rooms: number }>(
    `SELECT id::text AS id, check_in::text AS start, check_out::text AS "end", rooms FROM bookings
      WHERE room_slug = $1 AND status IN ('pending','confirmed','checked_in') AND check_out >= current_date
     UNION ALL
     SELECT id::text, start_date::text, end_date::text, units FROM blocks
      WHERE room_slug = $1 AND source = 'manual' AND end_date >= current_date`,
    [slug]
  );
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//The Lavish Haven//Bookings//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-CALNAME:${esc(`${SITE.name} ${slug}`)}`];
  for (const r of rows) {
    for (let i = 0; i < Number(r.rooms); i++) {
      lines.push("BEGIN:VEVENT", `UID:${r.id}-${i}@thelavishhaven.com`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${icsDate(r.start)}`, `DTEND;VALUE=DATE:${icsDate(r.end)}`, "SUMMARY:Not available", "END:VEVENT");
    }
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
