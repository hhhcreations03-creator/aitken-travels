import "server-only";
import crypto from "node:crypto";
import { db } from "./db";
import { ensureSchema } from "./schema";
import { AVAILABILITY_SQL } from "./availability";
import type { BookingStatus } from "./validation";
import { nights } from "./dates";

export interface Booking {
  id: string;
  ref: string;
  room_slug: string;
  check_in: string;
  check_out: string;
  rooms: number;
  adults: number;
  children: number;
  guest_name: string;
  email: string;
  phone: string;
  country: string | null;
  arrival_time: string | null;
  requests: string | null;
  status: BookingStatus;
  source: string;
  quoted_total: number | null;
  currency: string;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

const COLUMNS = `id, ref, room_slug, check_in::text AS check_in, check_out::text AS check_out, rooms, adults, children,
  guest_name, email, phone, country, arrival_time, requests, status, source, quoted_total::float8 AS quoted_total,
  currency, internal_notes, created_at::text AS created_at, updated_at::text AS updated_at`;

/** Booking reference such as LH-7K3P9Q, avoiding easily confused characters. */
export function newRef(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(6);
  return "LH-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function newGuestToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(24).toString("base64url");
  return { token, hash: hashToken(token) };
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export interface CreateBookingInput {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  guestName: string;
  email: string;
  phone: string;
  country?: string | null;
  arrivalTime?: string | null;
  requests?: string | null;
  status?: BookingStatus;
  source?: string;
  quotedTotal?: number | null;
  currency?: string;
  internalNotes?: string | null;
  actor: string;
  /** Admin can deliberately overbook; the website never can. */
  allowOverbook?: boolean;
}

export type CreateResult =
  | { ok: true; booking: Booking; guestToken: string }
  | { ok: false; reason: "unavailable" };

/**
 * Creates a booking only if enough units are free on every night.
 * The availability check and the insert run in one transaction behind a
 * per-room-type advisory lock, so concurrent requests cannot both take the
 * last room.
 */
export async function createBooking(input: CreateBookingInput): Promise<CreateResult> {
  await ensureSchema();
  const d = await db();
  const { token, hash } = newGuestToken();
  const ref = newRef();
  const status = input.status ?? "pending";
  const holds = ["pending", "confirmed", "checked_in"].includes(status);
  const guard = holds && !input.allowOverbook;

  const insert = `
    INSERT INTO bookings (ref, room_slug, check_in, check_out, rooms, adults, children, guest_name, email, phone,
      country, arrival_time, requests, status, source, quoted_total, currency, internal_notes, guest_token_hash)
    SELECT $1, $2, $3::date, $4::date, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
    ${guard ? `WHERE (SELECT available FROM (${AVAILABILITY_SQL.replace(/\$1/g, "$3").replace(/\$2/g, "$4").replace(/\$3::uuid/g, "NULL::uuid")}) a WHERE a.slug = $2) >= $5` : ""}
    RETURNING ${COLUMNS}`;

  const [, rows] = await d.transaction([
    { text: `SELECT pg_advisory_xact_lock(hashtext($1))`, params: [`room:${input.roomSlug}`] },
    {
      text: insert,
      params: [
        ref, input.roomSlug, input.checkIn, input.checkOut, input.rooms, input.adults, input.children,
        input.guestName, input.email, input.phone, input.country || null, input.arrivalTime || null,
        input.requests || null, status, input.source ?? "website", input.quotedTotal ?? null,
        input.currency ?? "USD", input.internalNotes || null, hash,
      ],
    },
  ]);
  const booking = rows[0] as unknown as Booking | undefined;
  if (!booking) return { ok: false, reason: "unavailable" };
  await logEvent(booking.id, input.actor, "created", `${status} via ${input.source ?? "website"}`);
  return { ok: true, booking, guestToken: token };
}

export async function logEvent(bookingId: string, actor: string, action: string, detail?: string | null) {
  const d = await db();
  await d.query(`INSERT INTO booking_events (booking_id, actor, action, detail) VALUES ($1, $2, $3, $4)`, [bookingId, actor, action, detail ?? null]);
}

export async function getBookingById(id: string): Promise<Booking | null> {
  await ensureSchema();
  const d = await db();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return ((await d.query(`SELECT ${COLUMNS} FROM bookings WHERE id = $1`, [id]))[0] as unknown as Booking) ?? null;
}

/** Looks up a booking for a guest; requires the private token from their confirmation link. */
export async function getBookingForGuest(ref: string, token: string): Promise<Booking | null> {
  await ensureSchema();
  const d = await db();
  const rows = await d.query(`SELECT ${COLUMNS}, guest_token_hash FROM bookings WHERE ref = $1`, [ref.toUpperCase()]);
  const row = rows[0] as unknown as (Booking & { guest_token_hash: string | null }) | undefined;
  if (!row || !row.guest_token_hash || !token) return null;
  const a = Buffer.from(row.guest_token_hash, "hex");
  const b = Buffer.from(hashToken(token), "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const { guest_token_hash: _omit, ...booking } = row;
  void _omit;
  return booking;
}

export interface ListFilter {
  status?: string;
  q?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
  sort?: "created" | "arrival";
}

export async function listBookings(f: ListFilter = {}): Promise<{ rows: Booking[]; total: number }> {
  await ensureSchema();
  const d = await db();
  const where: string[] = [];
  const params: unknown[] = [];
  const p = (v: unknown) => {
    params.push(v);
    return `$${params.length}`;
  };
  if (f.status === "active") where.push(`status IN ('pending','confirmed','checked_in')`);
  else if (f.status) where.push(`status = ${p(f.status)}`);
  if (f.q) {
    const like = p(`%${f.q.trim()}%`);
    where.push(`(ref ILIKE ${like} OR guest_name ILIKE ${like} OR email ILIKE ${like} OR phone ILIKE ${like})`);
  }
  if (f.from) where.push(`check_out > ${p(f.from)}::date`);
  if (f.to) where.push(`check_in <= ${p(f.to)}::date`);
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const order = f.sort === "arrival" ? "check_in ASC, created_at ASC" : "created_at DESC";
  const total = Number((await d.query<{ n: number }>(`SELECT count(*)::int AS n FROM bookings ${w}`, params))[0]?.n ?? 0);
  const rows = (await d.query(
    `SELECT ${COLUMNS} FROM bookings ${w} ORDER BY ${order} LIMIT ${p(f.limit ?? 50)} OFFSET ${p(f.offset ?? 0)}`,
    params
  )) as unknown as Booking[];
  return { rows, total };
}

export async function bookingEvents(bookingId: string) {
  const d = await db();
  return d.query<{ at: string; actor: string; action: string; detail: string | null }>(
    `SELECT at::text AS at, actor, action, detail FROM booking_events WHERE booking_id = $1 ORDER BY at DESC, id DESC`,
    [bookingId]
  );
}

/** Allowed status changes. */
export const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "declined", "cancelled"],
  confirmed: ["checked_in", "cancelled", "pending"],
  checked_in: ["completed", "confirmed"],
  completed: ["checked_in"],
  cancelled: ["pending"],
  declined: ["pending"],
};

export type UpdateResult = { ok: true; booking: Booking } | { ok: false; reason: "not_found" | "invalid_transition" | "unavailable" };

export async function setStatus(id: string, to: BookingStatus, actor: string, note?: string): Promise<UpdateResult> {
  const current = await getBookingById(id);
  if (!current) return { ok: false, reason: "not_found" };
  if (!TRANSITIONS[current.status].includes(to)) return { ok: false, reason: "invalid_transition" };
  const d = await db();
  // Re-opening a cancelled or declined booking takes inventory again, so re-check it.
  const reopening = ["cancelled", "declined"].includes(current.status) && to === "pending";
  const guard = reopening
    ? `AND (SELECT available FROM (${AVAILABILITY_SQL.replace(/\$1/g, "$4").replace(/\$2/g, "$5").replace(/\$3::uuid/g, "$1::uuid")}) a WHERE a.slug = $6) >= $7`
    : "";
  const params: unknown[] = [id, to, current.status];
  if (reopening) params.push(current.check_in, current.check_out, current.room_slug, current.rooms);
  const [, rows] = await d.transaction([
    { text: `SELECT pg_advisory_xact_lock(hashtext($1))`, params: [`room:${current.room_slug}`] },
    {
      text: `UPDATE bookings SET status = $2, updated_at = now() WHERE id = $1 AND status = $3 ${guard} RETURNING ${COLUMNS}`,
      params,
    },
  ]);
  const booking = rows[0] as unknown as Booking | undefined;
  if (!booking) return { ok: false, reason: reopening ? "unavailable" : "invalid_transition" };
  await logEvent(id, actor, `status: ${current.status} → ${to}`, note);
  return { ok: true, booking };
}

export interface EditInput {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  guestName: string;
  email: string;
  phone: string;
  country: string | null;
  arrivalTime: string | null;
  requests: string | null;
  quotedTotal: number | null;
  currency: string;
  internalNotes: string | null;
  allowOverbook: boolean;
}

/** Edits a booking, re-checking availability for its new dates and room unless overbooking is allowed. */
export async function updateBooking(id: string, input: EditInput, actor: string): Promise<UpdateResult> {
  const current = await getBookingById(id);
  if (!current) return { ok: false, reason: "not_found" };
  const d = await db();
  const holds = ["pending", "confirmed", "checked_in"].includes(current.status);
  const guard =
    holds && !input.allowOverbook
      ? `AND (SELECT available FROM (${AVAILABILITY_SQL.replace(/\$1/g, "$3").replace(/\$2/g, "$4").replace(/\$3::uuid/g, "$1::uuid")}) a WHERE a.slug = $2) >= $5`
      : "";
  const slugs = Array.from(new Set([current.room_slug, input.roomSlug])).sort();
  const [, , rows] = await d.transaction([
    { text: `SELECT pg_advisory_xact_lock(hashtext($1))`, params: [`room:${slugs[0]}`] },
    { text: `SELECT pg_advisory_xact_lock(hashtext($1))`, params: [`room:${slugs[1] ?? slugs[0]}`] },
    {
      text: `UPDATE bookings SET room_slug = $2, check_in = $3::date, check_out = $4::date, rooms = $5, adults = $6, children = $7,
               guest_name = $8, email = $9, phone = $10, country = $11, arrival_time = $12, requests = $13,
               quoted_total = $14, currency = $15, internal_notes = $16, updated_at = now()
             WHERE id = $1 ${guard}
             RETURNING ${COLUMNS}`,
      params: [
        id, input.roomSlug, input.checkIn, input.checkOut, input.rooms, input.adults, input.children,
        input.guestName, input.email, input.phone, input.country, input.arrivalTime, input.requests,
        input.quotedTotal, input.currency, input.internalNotes,
      ],
    },
  ]);
  const booking = rows[0] as unknown as Booking | undefined;
  if (!booking) return { ok: false, reason: "unavailable" };
  const changes: string[] = [];
  if (current.room_slug !== booking.room_slug) changes.push(`room ${current.room_slug} → ${booking.room_slug}`);
  if (current.check_in !== booking.check_in || current.check_out !== booking.check_out)
    changes.push(`dates ${current.check_in}–${current.check_out} → ${booking.check_in}–${booking.check_out}`);
  if (current.rooms !== booking.rooms) changes.push(`rooms ${current.rooms} → ${booking.rooms}`);
  if (current.quoted_total !== booking.quoted_total) changes.push(`total ${current.quoted_total ?? "–"} → ${booking.quoted_total ?? "–"}`);
  await logEvent(id, actor, "edited", changes.join("; ") || "details updated");
  return { ok: true, booking };
}

export function quote(nightlyRate: number | null, checkIn: string, checkOut: string, rooms: number): number | null {
  if (nightlyRate === null || nightlyRate === undefined) return null;
  return Math.round(nightlyRate * nights(checkIn, checkOut) * rooms * 100) / 100;
}

export async function dashboardStats(today: string) {
  await ensureSchema();
  const d = await db();
  const [row] = await d.query<{ pending: number; arrivals: number; departures: number; inhouse: number; upcoming: number }>(
    `SELECT
       count(*) FILTER (WHERE status = 'pending')::int AS pending,
       count(*) FILTER (WHERE status IN ('confirmed','pending') AND check_in = $1::date)::int AS arrivals,
       count(*) FILTER (WHERE status IN ('checked_in','confirmed') AND check_out = $1::date)::int AS departures,
       count(*) FILTER (WHERE status = 'checked_in')::int AS inhouse,
       count(*) FILTER (WHERE status IN ('confirmed','pending') AND check_in > $1::date AND check_in <= $1::date + 30)::int AS upcoming
     FROM bookings`,
    [today]
  );
  return row;
}
