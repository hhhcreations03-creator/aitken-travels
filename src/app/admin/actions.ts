"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ROOMS } from "@/lib/rooms";
import { assertSameOrigin, checkCredentials, endSession, hashLooksValid, requireAdmin, startSession } from "@/lib/booking/auth";
import { adminConfigured } from "@/lib/booking/config";
import { rateLimit } from "@/lib/booking/ratelimit";
import { createBooking, setStatus, updateBooking, logEvent, getBookingById } from "@/lib/booking/bookings";
import { emailStatusChange } from "@/lib/booking/email";
import { BOOKING_STATUSES, type BookingStatus } from "@/lib/booking/validation";
import { isValidDate } from "@/lib/booking/dates";
import { db } from "@/lib/booking/db";
import { ensureSchema } from "@/lib/booking/schema";
import { syncFeed } from "@/lib/booking/ical";
import { saveSettings } from "@/lib/booking/settings";
import { HOTEL_TZ } from "@/lib/booking/config";
import { todayIn, formatDate } from "@/lib/booking/dates";
import { addMessage, getThread, linkBooking, markRead, setNeedsReply, setThreadStatus, threadForBooking } from "@/lib/inbox/threads";
import { sendToGuest } from "@/lib/inbox/mailer";
import { syncMailbox } from "@/lib/inbox/mailbox";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const num = (f: FormData, k: string) => Number(str(f, k));
const optNum = (f: FormData, k: string) => (str(f, k) === "" ? null : Number(str(f, k)));
const back = (path: string, params: Record<string, string>) => redirect(`${path}?${new URLSearchParams(params)}`);

/* ---------- session ---------- */

export async function login(formData: FormData) {
  assertSameOrigin();
  const next = str(formData, "next");
  const safeNext = next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  if (!adminConfigured()) back("/admin/login", { error: "Admin login isn't set up yet. See the setup notes below." });
  if (!hashLooksValid()) back("/admin/login", { error: "The ADMIN_PASSWORD_HASH setting in Vercel isn't in the right format. It should be one line starting with scrypt:. Run npm run admin:password again, paste the new value, then redeploy." });
  if (!(await rateLimit("login", 8, 15).catch(() => true))) back("/admin/login", { error: "Too many attempts. Wait 15 minutes and try again." });
  const email = str(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(email, password)) back("/admin/login", { error: "That email and password don't match.", ...(next ? { next } : {}) });
  await startSession(email);
  redirect(safeNext);
}

export async function logout() {
  assertSameOrigin();
  endSession();
  redirect("/admin/login");
}

/* ---------- bookings ---------- */

const bookingForm = z.object({
  roomSlug: z.string().refine((s) => ROOMS.some((r) => r.slug === s), "Choose a room."),
  checkIn: z.string().refine(isValidDate, "Check-in date is invalid."),
  checkOut: z.string().refine(isValidDate, "Check-out date is invalid."),
  rooms: z.number().int().min(1).max(20),
  adults: z.number().int().min(1).max(60),
  children: z.number().int().min(0).max(60),
  guestName: z.string().min(2, "Add the guest's name.").max(120),
  email: z.string().email("Add a valid email.").max(200).or(z.literal("")),
  phone: z.string().max(40),
  country: z.string().max(80),
  arrivalTime: z.string().max(40),
  requests: z.string().max(2000),
  quotedTotal: z.number().min(0).nullable(),
  currency: z.string().regex(/^[A-Z]{3}$/),
  internalNotes: z.string().max(4000),
  allowOverbook: z.boolean(),
});

function readBookingForm(f: FormData) {
  return bookingForm.safeParse({
    roomSlug: str(f, "roomSlug"),
    checkIn: str(f, "checkIn"),
    checkOut: str(f, "checkOut"),
    rooms: num(f, "rooms"),
    adults: num(f, "adults"),
    children: num(f, "children"),
    guestName: str(f, "guestName"),
    email: str(f, "email").toLowerCase(),
    phone: str(f, "phone"),
    country: str(f, "country"),
    arrivalTime: str(f, "arrivalTime"),
    requests: str(f, "requests"),
    quotedTotal: optNum(f, "quotedTotal"),
    currency: str(f, "currency").toUpperCase() || "USD",
    internalNotes: str(f, "internalNotes"),
    allowOverbook: f.get("allowOverbook") === "on",
  });
}

export async function createManualBooking(formData: FormData) {
  assertSameOrigin();
  const admin = await requireAdmin();
  const parsed = readBookingForm(formData);
  if (!parsed.success) back("/admin/bookings/new", { error: parsed.error.issues[0].message });
  const v = parsed.data!;
  if (v.checkOut <= v.checkIn) back("/admin/bookings/new", { error: "Check-out must be after check-in." });
  if (!v.email && !v.phone) back("/admin/bookings/new", { error: "Add an email or a phone number." });
  const status = (BOOKING_STATUSES as readonly string[]).includes(str(formData, "status")) ? (str(formData, "status") as BookingStatus) : "confirmed";
  const result = await createBooking({
    roomSlug: v.roomSlug, checkIn: v.checkIn, checkOut: v.checkOut, rooms: v.rooms, adults: v.adults, children: v.children,
    guestName: v.guestName, email: v.email, phone: v.phone, country: v.country, arrivalTime: v.arrivalTime, requests: v.requests,
    quotedTotal: v.quotedTotal, currency: v.currency, internalNotes: v.internalNotes,
    status, source: str(formData, "source") || "phone", actor: admin.email, allowOverbook: v.allowOverbook,
  });
  const fromThread = str(formData, "threadId");
  if (!result.ok) back("/admin/bookings/new", { error: "Not enough rooms free on those nights. Tick “Allow overbooking” to save it anyway.", ...(fromThread ? { thread: fromThread } : {}) });
  if (result.ok) {
    const enquiry = fromThread ? await getThread(fromThread) : null;
    if (enquiry && !enquiry.booking_id) {
      await linkBooking(enquiry.id, result.booking.id);
      await addMessage({ threadId: enquiry.id, direction: "note", channel: "system", author: admin.email, body: `Booking ${result.booking.ref} created from this enquiry.`, delivery: "logged" });
    } else {
      await threadForBooking(result.booking);
    }
  }
  revalidatePath("/admin", "layout");
  back(`/admin/bookings/${result.ok ? result.booking.id : ""}`, { msg: `Booking ${result.ok ? result.booking.ref : ""} created.` });
}

export async function editBooking(formData: FormData) {
  assertSameOrigin();
  const admin = await requireAdmin();
  const id = str(formData, "id");
  const parsed = readBookingForm(formData);
  if (!parsed.success) back(`/admin/bookings/${id}`, { error: parsed.error.issues[0].message, edit: "1" });
  const v = parsed.data!;
  if (v.checkOut <= v.checkIn) back(`/admin/bookings/${id}`, { error: "Check-out must be after check-in.", edit: "1" });
  const result = await updateBooking(id, {
    roomSlug: v.roomSlug, checkIn: v.checkIn, checkOut: v.checkOut, rooms: v.rooms, adults: v.adults, children: v.children,
    guestName: v.guestName, email: v.email, phone: v.phone, country: v.country || null, arrivalTime: v.arrivalTime || null,
    requests: v.requests || null, quotedTotal: v.quotedTotal, currency: v.currency, internalNotes: v.internalNotes || null,
    allowOverbook: v.allowOverbook,
  }, admin.email);
  if (!result.ok) back(`/admin/bookings/${id}`, { error: result.reason === "unavailable" ? "Not enough rooms free for the new dates or room. Tick “Allow overbooking” to save anyway." : "Booking not found.", edit: "1" });
  revalidatePath("/admin", "layout");
  back(`/admin/bookings/${id}`, { msg: "Changes saved." });
}

export async function changeStatus(formData: FormData) {
  assertSameOrigin();
  const admin = await requireAdmin();
  const id = str(formData, "id");
  const to = str(formData, "to") as BookingStatus;
  const notify = formData.get("notify") === "on";
  const message = str(formData, "message");
  if (!(BOOKING_STATUSES as readonly string[]).includes(to)) back(`/admin/bookings/${id}`, { error: "Unknown status." });
  if (to === "checked_in") {
    const current = await getBookingById(id);
    const today = todayIn(HOTEL_TZ);
    if (current && current.check_in > today) back(`/admin/bookings/${id}`, { error: `Check-in opens on the arrival date, ${formatDate(current.check_in)}. To change the dates, edit the booking.` });
  }
  const result = await setStatus(id, to, admin.email, message || undefined);
  if (!result.ok) {
    back(`/admin/bookings/${id}`, {
      error: result.reason === "unavailable" ? "The room is no longer free for these dates, so this booking can't be reopened." : "That status change isn't allowed from the current status.",
    });
  }
  let sent = false;
  if (notify && result.ok && result.booking.email) sent = await emailStatusChange(result.booking, message || undefined, admin.email);
  // Deciding on a request answers it, whether the guest heard by email or by WhatsApp.
  if (result.ok && ["confirmed", "declined", "cancelled"].includes(to)) {
    const t = await threadForBooking(result.booking);
    await setNeedsReply(t.id, false);
    await markRead(t.id);
  }
  revalidatePath("/admin", "layout");
  back(`/admin/bookings/${id}`, { msg: `Status updated.${notify ? (sent ? " Guest emailed." : " Email not sent; use WhatsApp or email below.") : ""}` });
}

export async function addNote(formData: FormData) {
  assertSameOrigin();
  const admin = await requireAdmin();
  const id = str(formData, "id");
  const note = str(formData, "note").slice(0, 2000);
  if (note && (await getBookingById(id))) await logEvent(id, admin.email, "note", note);
  back(`/admin/bookings/${id}`, { msg: "Note added." });
}

/* ---------- rooms and settings ---------- */

export async function saveRoomTypes(formData: FormData) {
  assertSameOrigin();
  await requireAdmin();
  await ensureSchema();
  const d = await db();
  for (const room of ROOMS) {
    const units = num(formData, `units:${room.slug}`);
    const maxGuests = num(formData, `max:${room.slug}`);
    const rate = optNum(formData, `rate:${room.slug}`);
    const active = formData.get(`active:${room.slug}`) === "on";
    if (!Number.isInteger(units) || units < 0 || units > 50 || !Number.isInteger(maxGuests) || maxGuests < 1 || maxGuests > 20 || (rate !== null && (Number.isNaN(rate) || rate < 0)))
      back("/admin/rooms", { error: `Check the values for ${room.shortName}.` });
    await d.query(`UPDATE room_types SET units = $2, max_guests = $3, nightly_rate = $4, active = $5, updated_at = now() WHERE slug = $1`, [room.slug, units, maxGuests, rate, active]);
  }
  revalidatePath("/admin", "layout");
  back("/admin/rooms", { msg: "Room settings saved." });
}

export async function saveBookingSettings(formData: FormData) {
  assertSameOrigin();
  await requireAdmin();
  const currency = str(formData, "currency").toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) back("/admin/settings", { error: "Currency must be a three-letter code such as USD or LKR." });
  await saveSettings({ onlineBooking: formData.get("onlineBooking") === "on", currency, policyNote: str(formData, "policyNote").slice(0, 600) || undefined });
  revalidatePath("/", "layout");
  back("/admin/settings", { msg: "Settings saved." });
}

/* ---------- blocks and calendar sync ---------- */

export async function addBlock(formData: FormData) {
  assertSameOrigin();
  await requireAdmin();
  const room = str(formData, "roomSlug");
  const start = str(formData, "startDate");
  const end = str(formData, "endDate");
  const units = num(formData, "units") || 1;
  if (!isValidDate(start) || !isValidDate(end) || end <= start) back("/admin/availability", { error: "Choose a start date and a later end date." });
  const slugs = room === "all" ? ROOMS.map((r) => r.slug) : ROOMS.some((r) => r.slug === room) ? [room] : [];
  if (!slugs.length) back("/admin/availability", { error: "Choose a room." });
  await ensureSchema();
  const d = await db();
  const reason = str(formData, "reason").slice(0, 200) || "Closed";
  await d.transaction(slugs.map((s) => ({
    text: `INSERT INTO blocks (room_slug, start_date, end_date, units, reason, source) VALUES ($1, $2::date, $3::date, $4, $5, 'manual')`,
    params: [s, start, end, room === "all" ? 50 : units, reason],
  })));
  revalidatePath("/admin", "layout");
  back("/admin/availability", { msg: "Dates closed." });
}

export async function removeBlock(formData: FormData) {
  assertSameOrigin();
  await requireAdmin();
  const d = await db();
  await d.query(`DELETE FROM blocks WHERE id = $1 AND source = 'manual'`, [str(formData, "id")]);
  revalidatePath("/admin", "layout");
  back("/admin/availability", { msg: "Dates reopened." });
}

export async function addFeed(formData: FormData) {
  assertSameOrigin();
  await requireAdmin();
  const room = str(formData, "roomSlug");
  const url = str(formData, "url");
  let parsedUrl: URL | null = null;
  try { parsedUrl = new URL(url); } catch { /* handled below */ }
  if (!ROOMS.some((r) => r.slug === room) || !parsedUrl || !["https:", "http:", "webcal:"].includes(parsedUrl.protocol))
    back("/admin/availability", { error: "Choose a room and paste the calendar link (https://…)." });
  await ensureSchema();
  const d = await db();
  const [row] = await d.query<{ id: string }>(
    `INSERT INTO ical_feeds (room_slug, name, url) VALUES ($1, $2, $3) RETURNING id`,
    [room, str(formData, "name").slice(0, 80) || "Booking.com", url.replace(/^webcal:/, "https:")]
  );
  const r = await syncFeed(row.id);
  revalidatePath("/admin", "layout");
  back("/admin/availability", r.ok ? { msg: `Calendar connected. ${r.events} upcoming booking${r.events === 1 ? "" : "s"} imported.` } : { error: `Calendar saved, but the first sync failed: ${r.error}` });
}

export async function syncFeedNow(formData: FormData) {
  assertSameOrigin();
  await requireAdmin();
  const r = await syncFeed(str(formData, "id"));
  revalidatePath("/admin", "layout");
  back("/admin/availability", r.ok ? { msg: `Synced. ${r.events} upcoming booking${r.events === 1 ? "" : "s"}.` } : { error: `Sync failed: ${r.error}` });
}

export async function removeFeed(formData: FormData) {
  assertSameOrigin();
  await requireAdmin();
  const d = await db();
  await d.query(`DELETE FROM ical_feeds WHERE id = $1`, [str(formData, "id")]);
  revalidatePath("/admin", "layout");
  back("/admin/availability", { msg: "Calendar disconnected and its imported dates removed." });
}

/* ---------- inbox ---------- */

const threadPath = (f: FormData, id: string) => {
  const to = str(f, "returnTo");
  return to.startsWith("/admin/") && !to.startsWith("//") ? to : `/admin/inbox/${id}`;
};

export async function sendReply(formData: FormData) {
  assertSameOrigin();
  const admin = await requireAdmin();
  const id = str(formData, "threadId");
  const path = threadPath(formData, id);
  const body = str(formData, "body").slice(0, 20000);
  const thread = await getThread(id);
  if (!thread) back("/admin/inbox", { error: "Conversation not found." });
  if (!body) back(path, { error: "Write a reply first." });
  const subject = str(formData, "subject") || `Re: ${thread!.subject.replace(/^re:\s*/i, "")}`;
  const r = await sendToGuest({ threadId: id, subject, text: body, author: admin.email });
  if (r.sent && formData.get("close") === "on") await setThreadStatus(id, "closed");
  revalidatePath("/admin", "layout");
  if (r.sent) back(path, { msg: `Reply sent to ${thread!.guest_email}.` });
  else back(path, {
    error:
      r.reason === "no_address"
        ? "This guest has no email address, so nothing was sent. Your reply is kept in the conversation; send it on WhatsApp and log it."
        : r.reason === "not_configured"
          ? "Email sending isn't set up, so nothing was sent. Your reply is kept in the conversation. See Settings."
          : `Gmail didn't accept the email, so nothing was sent: ${r.error ?? "unknown error"}. Your reply is kept in the conversation.`,
  });
}

export async function logContact(formData: FormData) {
  assertSameOrigin();
  const admin = await requireAdmin();
  const id = str(formData, "threadId");
  const path = threadPath(formData, id);
  const channel = str(formData, "channel") === "phone" ? "phone" : "whatsapp";
  const direction = str(formData, "direction") === "in" ? "in" : "out";
  const body = str(formData, "body").slice(0, 10000);
  if (!body || !(await getThread(id))) back(path, { error: "Write what was said first." });
  await addMessage({ threadId: id, direction, channel, author: admin.email, body, delivery: "logged" });
  revalidatePath("/admin", "layout");
  back(path, { msg: `${channel === "phone" ? "Call" : "WhatsApp message"} logged.` });
}

export async function addThreadNote(formData: FormData) {
  assertSameOrigin();
  const admin = await requireAdmin();
  const id = str(formData, "threadId");
  const path = threadPath(formData, id);
  const body = str(formData, "body").slice(0, 4000);
  if (body && (await getThread(id))) await addMessage({ threadId: id, direction: "note", channel: "system", author: admin.email, body, delivery: "logged" });
  back(path, { msg: "Note added." });
}

export async function updateThread(formData: FormData) {
  assertSameOrigin();
  await requireAdmin();
  const id = str(formData, "threadId");
  const path = threadPath(formData, id);
  if (!(await getThread(id))) back("/admin/inbox", { error: "Conversation not found." });
  const action = str(formData, "do");
  const done: Record<string, string> = {
    close: "Conversation closed. It reopens by itself if the guest writes again.",
    reopen: "Conversation reopened.",
    spam: "Marked as spam.",
    answered: "Marked as answered.",
    needs_reply: "Marked as needing a reply.",
    unread: "Marked as unread.",
  };
  if (action === "close") await setThreadStatus(id, "closed");
  else if (action === "reopen") await setThreadStatus(id, "open");
  else if (action === "spam") await setThreadStatus(id, "spam");
  else if (action === "answered") await setNeedsReply(id, false);
  else if (action === "needs_reply") await setNeedsReply(id, true);
  else if (action === "unread") await markRead(id, true);
  else back(path, { error: "Unknown action." });
  revalidatePath("/admin", "layout");
  back(action === "unread" || action === "spam" ? "/admin/inbox" : path, { msg: done[action] });
}

export async function checkMailNow() {
  assertSameOrigin();
  await requireAdmin();
  const r = await syncMailbox({ force: true });
  revalidatePath("/admin", "layout");
  if (!r.ok) back("/admin/inbox", { error: `Couldn't read the mailbox: ${r.error}` });
  if (r.ok && r.skipped === "not_configured") back("/admin/inbox", { error: "The mailbox isn't connected yet. See Settings for the two values to add." });
  if (r.ok && r.skipped === "busy") back("/admin/inbox", { msg: "Mail is already being checked. Refresh in a moment." });
  back("/admin/inbox", { msg: r.ok && r.imported ? `${r.imported} new email${r.imported === 1 ? "" : "s"} filed.` : "No new email." });
}
