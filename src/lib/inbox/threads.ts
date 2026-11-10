import "server-only";
import crypto from "node:crypto";
import { db } from "@/lib/booking/db";
import { ensureSchema } from "@/lib/booking/schema";
import type { Booking } from "@/lib/booking/bookings";

/**
 * The inbox: every conversation with a guest, whatever it started as.
 *
 * A thread is one conversation. It starts from a website booking request, a
 * website enquiry form, a booking added in admin, or an email sent straight to
 * the hotel mailbox. Messages are added as guests write and the team replies,
 * whether from the admin or from Gmail (picked up by the mailbox sync).
 *
 * Reply state, kept on the thread so lists stay fast:
 *   - a message from the guest sets needs_reply and unread, and reopens a closed thread;
 *   - a reply written by the team clears needs_reply;
 *   - automatic emails (acknowledgements, confirmations sent by the system) change neither.
 */

export type ThreadKind = "booking" | "contact" | "group" | "surf" | "availability" | "email";
export type ThreadStatus = "open" | "closed" | "spam";
export type Direction = "in" | "out" | "note";
export type Channel = "web" | "email" | "whatsapp" | "phone" | "system";
export type Delivery = "received" | "sent" | "failed" | "not_sent" | "logged";

export const KIND_LABELS: Record<ThreadKind, string> = {
  booking: "Booking",
  contact: "Contact form",
  group: "Group enquiry",
  surf: "Surf retreat",
  availability: "Availability",
  email: "Email",
};

export interface Thread {
  id: string;
  ref: string;
  kind: ThreadKind;
  subject: string;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  booking_id: string | null;
  status: ThreadStatus;
  needs_reply: boolean;
  unread: boolean;
  details: Array<[string, string]> | null;
  last_message_at: string;
  last_snippet: string | null;
  created_at: string;
  booking_ref?: string | null;
  booking_status?: string | null;
}

export interface Message {
  id: string;
  thread_id: string;
  direction: Direction;
  channel: Channel;
  author: string | null;
  from_name: string | null;
  from_addr: string | null;
  to_addr: string | null;
  subject: string | null;
  body: string;
  message_id: string | null;
  in_reply_to: string | null;
  delivery: Delivery | null;
  error: string | null;
  automatic: boolean;
  at: string;
}

const THREAD_COLS = `t.id, t.ref, t.kind, t.subject, t.guest_name, t.guest_email, t.guest_phone, t.booking_id, t.status,
  t.needs_reply, t.unread, t.details, t.last_message_at::text AS last_message_at, t.last_snippet, t.created_at::text AS created_at,
  b.ref AS booking_ref, b.status AS booking_status`;
const THREAD_FROM = `threads t LEFT JOIN bookings b ON b.id = t.booking_id`;
const MESSAGE_COLS = `id, thread_id, direction, channel, author, from_name, from_addr, to_addr, subject, body, message_id,
  in_reply_to, delivery, error, automatic, at::text AS at`;

/** Matches a booking reference (LH-XXXXXX) or an enquiry reference (EQ-XXXXXX) anywhere in a subject line. */
export const REF_PATTERN = /\b(?:LH|EQ)-[A-HJ-NP-Z2-9]{6}\b/;

export function newEnquiryRef(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  return "EQ-" + Array.from(crypto.randomBytes(6), (b) => alphabet[b % alphabet.length]).join("");
}

/** A Message-ID we can recognise when a guest replies to it. */
export function newMessageId(): string {
  const domain = (process.env.SMTP_USER?.split("@")[1] || "thelavishhaven.com").toLowerCase();
  return `<${crypto.randomUUID()}@${domain}>`;
}

export function snippet(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

export interface CreateThreadInput {
  kind: ThreadKind;
  subject: string;
  ref?: string;
  guestName?: string | null;
  guestEmail?: string | null;
  guestPhone?: string | null;
  bookingId?: string | null;
  details?: Array<[string, string]> | null;
  needsReply?: boolean;
  at?: string;
}

export async function createThread(input: CreateThreadInput): Promise<Thread> {
  await ensureSchema();
  const d = await db();
  const rows = await d.query(
    `INSERT INTO threads (ref, kind, subject, guest_name, guest_email, guest_phone, booking_id, details, needs_reply, unread, last_message_at, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $9, COALESCE($10::timestamptz, now()), COALESCE($10::timestamptz, now()))
     RETURNING id`,
    [
      input.ref ?? newEnquiryRef(),
      input.kind,
      input.subject.slice(0, 300),
      input.guestName || null,
      input.guestEmail?.toLowerCase() || null,
      input.guestPhone || null,
      input.bookingId || null,
      input.details ? JSON.stringify(input.details) : null,
      input.needsReply ?? true,
      input.at ?? null,
    ]
  );
  return (await getThread(String(rows[0].id)))!;
}

export async function getThread(id: string): Promise<Thread | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  await ensureSchema();
  const d = await db();
  return ((await d.query(`SELECT ${THREAD_COLS} FROM ${THREAD_FROM} WHERE t.id = $1`, [id]))[0] as unknown as Thread) ?? null;
}

export async function getThreadByRef(ref: string): Promise<Thread | null> {
  await ensureSchema();
  const d = await db();
  return ((await d.query(`SELECT ${THREAD_COLS} FROM ${THREAD_FROM} WHERE t.ref = $1`, [ref.toUpperCase()]))[0] as unknown as Thread) ?? null;
}

/** The conversation for a booking, created on first use (bookings made before the inbox existed included). */
export async function threadForBooking(b: Booking): Promise<Thread> {
  await ensureSchema();
  const d = await db();
  const existing = await d.query(`SELECT t.id FROM threads t WHERE t.booking_id = $1`, [b.id]);
  if (existing[0]) return (await getThread(String(existing[0].id)))!;
  // A thread may already carry this booking's reference (an enquiry turned into a booking keeps its own ref, so this is rare).
  const byRef = await getThreadByRef(b.ref);
  if (byRef) {
    await d.query(`UPDATE threads SET booking_id = $2 WHERE id = $1 AND booking_id IS NULL`, [byRef.id, b.id]);
    return (await getThread(byRef.id))!;
  }
  return createThread({
    kind: "booking",
    ref: b.ref,
    subject: `Booking ${b.ref}`,
    guestName: b.guest_name,
    guestEmail: b.email || null,
    guestPhone: b.phone || null,
    bookingId: b.id,
    needsReply: b.status === "pending",
  });
}

export interface AddMessageInput {
  threadId: string;
  direction: Direction;
  channel: Channel;
  body: string;
  author?: string | null;
  fromName?: string | null;
  fromAddr?: string | null;
  toAddr?: string | null;
  subject?: string | null;
  messageId?: string | null;
  inReplyTo?: string | null;
  delivery?: Delivery | null;
  error?: string | null;
  /** Sent by the system without a person writing it; doesn't change reply state. */
  automatic?: boolean;
  at?: string;
}

/** Adds a message and updates the thread's reply state. Returns null if this email was already stored. */
export async function addMessage(m: AddMessageInput): Promise<Message | null> {
  await ensureSchema();
  const d = await db();
  const rows = await d.query(
    `INSERT INTO messages (thread_id, direction, channel, author, from_name, from_addr, to_addr, subject, body, message_id, in_reply_to, delivery, error, automatic, at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, COALESCE($15::timestamptz, now()))
     ON CONFLICT (message_id) WHERE message_id IS NOT NULL DO NOTHING
     RETURNING ${MESSAGE_COLS}`,
    [
      m.threadId, m.direction, m.channel, m.author ?? null, m.fromName ?? null, m.fromAddr?.toLowerCase() ?? null, m.toAddr ?? null,
      m.subject ?? null, m.body.slice(0, 50000), m.messageId ?? null, m.inReplyTo ?? null, m.delivery ?? null, m.error ?? null,
      m.automatic ?? false, m.at ?? null,
    ]
  );
  const msg = rows[0] as unknown as Message | undefined;
  if (!msg) return null;

  const fromGuest = m.direction === "in";
  const teamReply = m.direction === "out" && !m.automatic && m.delivery !== "failed" && m.delivery !== "not_sent";
  await d.query(
    `UPDATE threads SET
       last_message_at = GREATEST(last_message_at, $2::timestamptz),
       last_snippet = CASE WHEN $2::timestamptz >= last_message_at OR last_snippet IS NULL THEN $3 ELSE last_snippet END,
       needs_reply = CASE WHEN $4 THEN true WHEN $5 THEN false ELSE needs_reply END,
       unread = CASE WHEN $4 THEN true ELSE unread END,
       status = CASE WHEN $4 AND status = 'closed' THEN 'open' ELSE status END
     WHERE id = $1`,
    [m.threadId, msg.at, snippet(m.body), fromGuest, teamReply]
  );
  return msg;
}

export async function threadMessages(threadId: string): Promise<Message[]> {
  const d = await db();
  return (await d.query(`SELECT ${MESSAGE_COLS} FROM messages WHERE thread_id = $1 ORDER BY at ASC, id ASC`, [threadId])) as unknown as Message[];
}

/** The newest stored email Message-ID in a thread, so a reply can carry In-Reply-To and References. */
export async function replyHeaders(threadId: string): Promise<{ inReplyTo?: string; references?: string[] }> {
  const d = await db();
  const rows = await d.query<{ message_id: string }>(
    `SELECT message_id FROM messages WHERE thread_id = $1 AND message_id IS NOT NULL ORDER BY at ASC LIMIT 20`,
    [threadId]
  );
  const ids = rows.map((r) => r.message_id);
  return ids.length ? { inReplyTo: ids[ids.length - 1], references: ids } : {};
}

export async function findThreadByMessageIds(ids: string[]): Promise<string | null> {
  if (!ids.length) return null;
  const d = await db();
  const rows = await d.query<{ thread_id: string }>(`SELECT thread_id FROM messages WHERE message_id = ANY($1::text[]) ORDER BY at DESC LIMIT 1`, [ids]);
  return rows[0]?.thread_id ?? null;
}

/** The guest's most recent open conversation in the last 60 days, for emails that carry no reference. */
export async function findRecentThreadByEmail(email: string): Promise<string | null> {
  const d = await db();
  const rows = await d.query<{ id: string }>(
    `SELECT id FROM threads WHERE lower(guest_email) = lower($1) AND status = 'open' AND last_message_at > now() - interval '60 days'
     ORDER BY last_message_at DESC LIMIT 1`,
    [email]
  );
  return rows[0]?.id ?? null;
}

export type InboxView = "needs_reply" | "waiting" | "open" | "closed" | "spam" | "all";

export interface ThreadFilter {
  view?: InboxView;
  kind?: string;
  q?: string;
  limit?: number;
  offset?: number;
}

export async function listThreads(f: ThreadFilter = {}): Promise<{ rows: Thread[]; total: number }> {
  await ensureSchema();
  const d = await db();
  const where: string[] = [];
  const params: unknown[] = [];
  const p = (v: unknown) => {
    params.push(v);
    return `$${params.length}`;
  };
  const view = f.view ?? "needs_reply";
  if (view === "needs_reply") where.push(`t.status = 'open' AND t.needs_reply`);
  else if (view === "waiting") where.push(`t.status = 'open' AND NOT t.needs_reply`);
  else if (view === "open") where.push(`t.status = 'open'`);
  else if (view === "closed") where.push(`t.status = 'closed'`);
  else if (view === "spam") where.push(`t.status = 'spam'`);
  else where.push(`t.status <> 'spam'`);
  if (f.kind && f.kind in KIND_LABELS) where.push(`t.kind = ${p(f.kind)}`);
  if (f.q) {
    const like = p(`%${f.q.trim()}%`);
    where.push(`(t.ref ILIKE ${like} OR t.subject ILIKE ${like} OR t.guest_name ILIKE ${like} OR t.guest_email ILIKE ${like} OR t.guest_phone ILIKE ${like} OR b.ref ILIKE ${like}
      OR EXISTS (SELECT 1 FROM messages m WHERE m.thread_id = t.id AND m.body ILIKE ${like}))`);
  }
  const w = `WHERE ${where.join(" AND ")}`;
  const total = Number((await d.query<{ n: number }>(`SELECT count(*)::int AS n FROM ${THREAD_FROM} ${w}`, params))[0]?.n ?? 0);
  const rows = (await d.query(
    `SELECT ${THREAD_COLS} FROM ${THREAD_FROM} ${w} ORDER BY t.last_message_at DESC LIMIT ${p(f.limit ?? 50)} OFFSET ${p(f.offset ?? 0)}`,
    params
  )) as unknown as Thread[];
  return { rows, total };
}

export async function inboxCounts(): Promise<{ needsReply: number; unread: number }> {
  await ensureSchema();
  const d = await db();
  const [r] = await d.query<{ needs_reply: number; unread: number }>(
    `SELECT count(*) FILTER (WHERE status = 'open' AND needs_reply)::int AS needs_reply,
            count(*) FILTER (WHERE status = 'open' AND unread)::int AS unread
       FROM threads`
  );
  return { needsReply: r?.needs_reply ?? 0, unread: r?.unread ?? 0 };
}

export async function markRead(id: string, unread = false) {
  const d = await db();
  await d.query(`UPDATE threads SET unread = $2 WHERE id = $1`, [id, unread]);
}

export async function setThreadStatus(id: string, status: ThreadStatus) {
  const d = await db();
  await d.query(`UPDATE threads SET status = $2, unread = CASE WHEN $2 = 'open' THEN unread ELSE false END WHERE id = $1`, [id, status]);
}

export async function setNeedsReply(id: string, needsReply: boolean) {
  const d = await db();
  await d.query(`UPDATE threads SET needs_reply = $2 WHERE id = $1`, [id, needsReply]);
}

export async function linkBooking(threadId: string, bookingId: string) {
  const d = await db();
  await d.query(`UPDATE threads SET booking_id = $2 WHERE id = $1 AND booking_id IS NULL`, [threadId, bookingId]);
}

/** Fills in the guest's details when a thread was started from an email that only had an address. */
export async function updateGuest(id: string, g: { name?: string | null; email?: string | null; phone?: string | null }) {
  const d = await db();
  await d.query(
    `UPDATE threads SET guest_name = COALESCE(guest_name, $2), guest_email = COALESCE(guest_email, $3), guest_phone = COALESCE(guest_phone, $4) WHERE id = $1`,
    [id, g.name || null, g.email?.toLowerCase() || null, g.phone || null]
  );
}
