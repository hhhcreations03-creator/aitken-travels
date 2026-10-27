import "server-only";
import { db } from "./db";
import { ensureSchema } from "./schema";

export interface RoomTypeRow {
  slug: string;
  units: number;
  max_guests: number;
  nightly_rate: number | null;
  active: boolean;
  sort_order: number;
}

export async function roomTypes(includeInactive = false): Promise<RoomTypeRow[]> {
  await ensureSchema();
  const d = await db();
  return d.query<RoomTypeRow & Record<string, unknown>>(
    `SELECT slug, units, max_guests, nightly_rate::float8 AS nightly_rate, active, sort_order
       FROM room_types ${includeInactive ? "" : "WHERE active"} ORDER BY sort_order`
  );
}

/**
 * SQL returning, per room type, the fewest units free on any night of the stay.
 * Counts holding bookings (pending, confirmed, checked in) and blocks, night by night.
 * Params: $1 check_in, $2 check_out, $3 booking id to ignore (or null).
 */
export const AVAILABILITY_SQL = `
  WITH nights AS (
    SELECT d::date AS night FROM generate_series($1::date, $2::date - 1, interval '1 day') AS d
  ),
  usage AS (
    SELECT rt.slug, n.night,
      COALESCE((SELECT SUM(b.rooms) FROM bookings b
                 WHERE b.room_slug = rt.slug
                   AND b.status IN ('pending','confirmed','checked_in')
                   AND b.check_in <= n.night AND b.check_out > n.night
                   AND ($3::uuid IS NULL OR b.id <> $3::uuid)), 0)
    + LEAST(rt.units, COALESCE((SELECT SUM(k.units) FROM blocks k
                 WHERE k.room_slug = rt.slug
                   AND k.start_date <= n.night AND k.end_date > n.night), 0)) AS used
    FROM room_types rt CROSS JOIN nights n
  )
  SELECT rt.slug, rt.units, GREATEST(0, MIN(rt.units - u.used))::int AS available
    FROM room_types rt JOIN usage u ON u.slug = rt.slug
   GROUP BY rt.slug, rt.units`;

export async function availability(checkIn: string, checkOut: string, ignoreBookingId: string | null = null): Promise<Map<string, number>> {
  await ensureSchema();
  const d = await db();
  const rows = await d.query<{ slug: string; available: number }>(AVAILABILITY_SQL, [checkIn, checkOut, ignoreBookingId]);
  return new Map(rows.map((r) => [r.slug, Number(r.available)]));
}

export interface OccupancyCell {
  slug: string;
  night: string;
  used: number;
  units: number;
}

/** Night-by-night usage for the admin calendar. */
export async function occupancy(from: string, to: string): Promise<OccupancyCell[]> {
  await ensureSchema();
  const d = await db();
  return d.query<OccupancyCell & Record<string, unknown>>(
    `WITH nights AS (SELECT d::date AS night FROM generate_series($1::date, $2::date - 1, interval '1 day') AS d)
     SELECT rt.slug, n.night::text AS night, rt.units,
       (COALESCE((SELECT SUM(b.rooms) FROM bookings b WHERE b.room_slug = rt.slug
                  AND b.status IN ('pending','confirmed','checked_in')
                  AND b.check_in <= n.night AND b.check_out > n.night), 0)
      + LEAST(rt.units, COALESCE((SELECT SUM(k.units) FROM blocks k WHERE k.room_slug = rt.slug
                  AND k.start_date <= n.night AND k.end_date > n.night), 0)))::int AS used
       FROM room_types rt CROSS JOIN nights n
      ORDER BY rt.sort_order, n.night`,
    [from, to]
  );
}
