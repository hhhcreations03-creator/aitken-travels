import "server-only";
import { db } from "@/lib/booking/db";
import { ensureSchema } from "@/lib/booking/schema";

/**
 * Hotel performance figures, shared by the dashboard, reports and channel
 * analytics so every screen agrees.
 *
 * Definitions:
 * - Capacity: units of every active room type, per night.
 * - Closed: units blocked by hand (maintenance, owner use) — not sellable.
 * - Sold: room-nights of confirmed, checked-in and completed bookings, plus
 *   nights blocked by an imported OTA calendar (those are OTA reservations).
 * - Pending: room-nights held by requests not yet confirmed.
 * - Room revenue: each booking's quoted total spread evenly over its nights,
 *   counted only for bookings in the hotel's currency.
 * - Occupancy = sold / (capacity − closed). ADR = revenue / sold nights with a
 *   price. RevPAR = revenue / (capacity − closed).
 */

export const SOLD_STATUSES = ["confirmed", "checked_in", "completed"] as const;

export interface NightRow {
  night: string;
  capacity: number;
  closed: number;
  sold: number;
  /** Of `sold`, nights coming from imported OTA calendars (no price known). */
  otaBlocked: number;
  pending: number;
  revenue: number;
  /** Sold nights that carry a price, for ADR. */
  pricedNights: number;
}

const NIGHTS_SQL = `
  WITH nights AS (
    SELECT d::date AS night FROM generate_series($1::date, $2::date - 1, interval '1 day') AS d
  ),
  rt AS (SELECT slug, units FROM room_types WHERE active)
  SELECT n.night::text AS night,
    (SELECT COALESCE(SUM(units), 0) FROM rt)::int AS capacity,
    (SELECT COALESCE(SUM(LEAST(rt.units, (
        SELECT COALESCE(SUM(k.units), 0) FROM blocks k
         WHERE k.room_slug = rt.slug AND k.source = 'manual'
           AND k.start_date <= n.night AND k.end_date > n.night))), 0) FROM rt)::int AS closed,
    (SELECT COALESCE(SUM(b.rooms), 0) FROM bookings b JOIN rt ON rt.slug = b.room_slug
      WHERE b.status IN ('confirmed','checked_in','completed')
        AND b.check_in <= n.night AND b.check_out > n.night)::int AS booked,
    (SELECT COALESCE(SUM(k.units), 0) FROM blocks k JOIN rt ON rt.slug = k.room_slug
      WHERE k.source = 'ical' AND k.start_date <= n.night AND k.end_date > n.night)::int AS ota_blocked,
    (SELECT COALESCE(SUM(b.rooms), 0) FROM bookings b JOIN rt ON rt.slug = b.room_slug
      WHERE b.status = 'pending' AND b.check_in <= n.night AND b.check_out > n.night)::int AS pending,
    (SELECT COALESCE(SUM(b.quoted_total / (b.check_out - b.check_in)), 0) FROM bookings b
      WHERE b.status IN ('confirmed','checked_in','completed') AND b.quoted_total IS NOT NULL AND b.currency = $3
        AND b.check_in <= n.night AND b.check_out > n.night)::float8 AS revenue,
    (SELECT COALESCE(SUM(b.rooms), 0) FROM bookings b
      WHERE b.status IN ('confirmed','checked_in','completed') AND b.quoted_total IS NOT NULL AND b.currency = $3
        AND b.check_in <= n.night AND b.check_out > n.night)::int AS priced
  FROM nights n
  ORDER BY n.night`;

/** One row per night in [from, to). */
export async function nightly(from: string, to: string, currency: string): Promise<NightRow[]> {
  await ensureSchema();
  const d = await db();
  const rows = await d.query<Record<string, unknown>>(NIGHTS_SQL, [from, to, currency]);
  return rows.map((r) => {
    const capacity = Number(r.capacity);
    const closed = Number(r.closed);
    const otaBlocked = Number(r.ota_blocked);
    return {
      night: String(r.night),
      capacity,
      closed,
      // A calendar can't sell more than the hotel has; cap so occupancy stays ≤ 100%.
      sold: Math.min(capacity - closed, Number(r.booked) + otaBlocked),
      otaBlocked,
      pending: Number(r.pending),
      revenue: Math.round(Number(r.revenue) * 100) / 100,
      pricedNights: Number(r.priced),
    };
  });
}

export interface Summary {
  nights: number;
  available: number;
  sold: number;
  revenue: number;
  occupancy: number | null;
  adr: number | null;
  revpar: number | null;
}

export function summarise(rows: NightRow[]): Summary {
  const available = rows.reduce((n, r) => n + Math.max(0, r.capacity - r.closed), 0);
  const sold = rows.reduce((n, r) => n + r.sold, 0);
  const priced = rows.reduce((n, r) => n + r.pricedNights, 0);
  const revenue = Math.round(rows.reduce((n, r) => n + r.revenue, 0) * 100) / 100;
  return {
    nights: rows.length,
    available,
    sold,
    revenue,
    occupancy: available ? sold / available : null,
    adr: priced ? revenue / priced : null,
    revpar: available ? revenue / available : null,
  };
}

export interface SourceRow {
  source: string;
  bookings: number;
  roomNights: number;
  revenue: number;
}

/**
 * Bookings made in [from, to) by where they came from, plus stays imported
 * from each OTA calendar (named after the feed), counted by arrival date.
 */
export async function sourceMix(from: string, to: string, currency: string): Promise<SourceRow[]> {
  await ensureSchema();
  const d = await db();
  const rows = await d.query<Record<string, unknown>>(
    `SELECT source, count(*)::int AS bookings, SUM(rooms * (check_out - check_in))::int AS room_nights,
            COALESCE(SUM(quoted_total) FILTER (WHERE currency = $3), 0)::float8 AS revenue
       FROM bookings
      WHERE status IN ('pending','confirmed','checked_in','completed')
        AND created_at >= $1::date AND created_at < $2::date
      GROUP BY source
     UNION ALL
     SELECT f.name AS source, count(*)::int, SUM(k.units * (k.end_date - k.start_date))::int, 0::float8
       FROM blocks k JOIN ical_feeds f ON f.id = k.feed_id
      WHERE k.source = 'ical' AND k.start_date >= $1::date AND k.start_date < $2::date
      GROUP BY f.name`,
    [from, to, currency]
  );
  const merged = new Map<string, SourceRow>();
  for (const r of rows) {
    const key = String(r.source);
    const prev = merged.get(key) ?? { source: key, bookings: 0, roomNights: 0, revenue: 0 };
    prev.bookings += Number(r.bookings);
    prev.roomNights += Number(r.room_nights);
    prev.revenue += Number(r.revenue);
    merged.set(key, prev);
  }
  return Array.from(merged.values()).sort((a, b) => b.roomNights - a.roomNights);
}

export interface PickupRow {
  day: string;
  created: number;
  cancelled: number;
}

/** Requests received and cancellations per day in [from, to). */
export async function pickup(from: string, to: string): Promise<PickupRow[]> {
  await ensureSchema();
  const d = await db();
  const rows = await d.query<Record<string, unknown>>(
    `WITH days AS (SELECT d::date AS day FROM generate_series($1::date, $2::date - 1, interval '1 day') AS d)
     SELECT day::text AS day,
       (SELECT count(*) FROM bookings b WHERE (b.created_at AT TIME ZONE 'Asia/Colombo')::date = day)::int AS created,
       (SELECT count(DISTINCT e.booking_id) FROM booking_events e
         WHERE e.action LIKE '%→ cancelled' AND (e.at AT TIME ZONE 'Asia/Colombo')::date = day)::int AS cancelled
       FROM days ORDER BY day`,
    [from, to]
  );
  return rows.map((r) => ({ day: String(r.day), created: Number(r.created), cancelled: Number(r.cancelled) }));
}

/** Cancellation rate for bookings created in [from, to). */
export async function cancellationStats(from: string, to: string) {
  await ensureSchema();
  const d = await db();
  const [r] = await d.query<{ total: number; cancelled: number; declined: number }>(
    `SELECT count(*)::int AS total,
            count(*) FILTER (WHERE status = 'cancelled')::int AS cancelled,
            count(*) FILTER (WHERE status = 'declined')::int AS declined
       FROM bookings WHERE created_at >= $1::date AND created_at < $2::date`,
    [from, to]
  );
  const total = Number(r?.total ?? 0);
  const cancelled = Number(r?.cancelled ?? 0);
  return { total, cancelled, declined: Number(r?.declined ?? 0), rate: total ? cancelled / total : null };
}

export interface FeedHealth {
  id: string;
  name: string;
  room_slug: string;
  last_synced_at: string | null;
  last_error: string | null;
}

/** Imported calendars that failed or haven't synced in a day. */
export async function feedAlerts(): Promise<FeedHealth[]> {
  await ensureSchema();
  const d = await db();
  return d.query<FeedHealth & Record<string, unknown>>(
    `SELECT id, name, room_slug, last_synced_at::text AS last_synced_at, last_error FROM ical_feeds
      WHERE last_error IS NOT NULL OR last_synced_at IS NULL OR last_synced_at < now() - interval '24 hours'
      ORDER BY name`
  );
}
