import { db } from "@/lib/booking/db";
import { ensureSchema } from "@/lib/booking/schema";
import { ROOMS } from "@/lib/rooms";

export const SLUG_A = ROOMS[0].slug;
export const SLUG_B = ROOMS[1].slug;

/** Fresh schema with two active room types (3 and 2 units) and every other type inactive. */
export async function setupHotel() {
  await ensureSchema();
  const d = await db();
  await d.query(`UPDATE room_types SET active = false, units = 0`);
  await d.query(`UPDATE room_types SET active = true, units = 3, nightly_rate = 100 WHERE slug = $1`, [SLUG_A]);
  await d.query(`UPDATE room_types SET active = true, units = 2, nightly_rate = 200 WHERE slug = $1`, [SLUG_B]);
  return d;
}

let seq = 0;
export async function addBooking(o: { slug: string; in: string; out: string; rooms?: number; status?: string; total?: number | null; source?: string; currency?: string; created?: string }) {
  const d = await db();
  seq += 1;
  const [row] = await d.query<{ id: string }>(
    `INSERT INTO bookings (ref, room_slug, check_in, check_out, rooms, adults, guest_name, email, phone, status, source, quoted_total, currency, created_at)
     VALUES ($1, $2, $3, $4, $5, 2, 'Test Guest', 'guest@example.com', '+94700000000', $6, $7, $8, $9, COALESCE($10::timestamptz, now()))
     RETURNING id`,
    [`LH-T${String(seq).padStart(5, "0")}`, o.slug, o.in, o.out, o.rooms ?? 1, o.status ?? "confirmed", o.source ?? "website", o.total === undefined ? 300 : o.total, o.currency ?? "USD", o.created ?? null]
  );
  return row.id;
}
