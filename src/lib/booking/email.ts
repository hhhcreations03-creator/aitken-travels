import "server-only";
import { SITE } from "@/lib/site";
import { getRoom } from "@/lib/rooms";
import { formatDate, nights } from "./dates";
import type { Booking } from "./bookings";
import { logEvent } from "./bookings";
import { addMessage, threadForBooking } from "@/lib/inbox/threads";
import { notifyHotel, sendToGuest, type SendOutcome } from "@/lib/inbox/mailer";

/**
 * Booking emails. Each one is stored in the booking's conversation in the
 * admin inbox (see src/lib/inbox), and the outcome is noted in the booking's
 * activity log so the team can see what the guest has and hasn't been sent.
 */

function summary(b: Booking): string {
  const room = getRoom(b.room_slug)?.name ?? b.room_slug;
  const n = nights(b.check_in, b.check_out);
  return [
    `Reference: ${b.ref}`,
    `Room: ${room}${b.rooms > 1 ? ` (x${b.rooms})` : ""}`,
    `Check-in: ${formatDate(b.check_in)} (from ${SITE.checkIn})`,
    `Check-out: ${formatDate(b.check_out)}`,
    `Nights: ${n}`,
    `Guests: ${b.adults} adult${b.adults === 1 ? "" : "s"}${b.children ? `, ${b.children} child${b.children === 1 ? "" : "ren"}` : ""}`,
    b.quoted_total !== null ? `Estimated total: ${b.currency} ${b.quoted_total.toFixed(2)}` : `Rate: confirmed by the hotel`,
  ].join("\n");
}

async function noteOutcome(b: Booking, subject: string, r: SendOutcome) {
  if (r.sent) await logEvent(b.id, "system", "email sent", `"${subject}" to ${b.email}`);
  else if (r.reason === "not_configured") await logEvent(b.id, "system", "email skipped", `Email sending isn't set up; "${subject}" not sent`);
  else if (r.reason === "no_address") await logEvent(b.id, "system", "email skipped", `No guest email; "${subject}" not sent`);
  else await logEvent(b.id, "system", "email failed", `"${subject}" to ${b.email}: ${r.error ?? "error"}`);
}

/** A website booking request: file it in the inbox, acknowledge it to the guest, and tell the hotel. */
export async function emailNewRequest(b: Booking, manageUrl: string) {
  const thread = await threadForBooking(b);
  const details = [
    summary(b),
    "",
    `Guest: ${b.guest_name}`,
    `Email: ${b.email}`,
    `Phone: ${b.phone}`,
    b.country ? `Country: ${b.country}` : "",
    b.arrival_time ? `Arrival time: ${b.arrival_time}` : "",
    b.requests ? `\nRequests:\n${b.requests}` : "",
  ].filter(Boolean).join("\n");

  await addMessage({
    threadId: thread.id,
    direction: "in",
    channel: "web",
    author: "guest",
    fromName: b.guest_name,
    fromAddr: b.email,
    subject: `Booking request ${b.ref}`,
    body: details,
    delivery: "received",
  });

  const subject = `Booking request received: ${b.ref}`;
  const guest = `Dear ${b.guest_name},

Thank you for choosing The Lavish Haven. We've received your booking request and are holding the room while our team confirms it.

${summary(b)}

What happens next
Our team will confirm availability and your rate by email or WhatsApp, usually within 24 hours. Your booking is confirmed only once you hear from us. No payment has been taken.

View or cancel your request:
${manageUrl}

Questions? Reply to this email or message us on WhatsApp: ${SITE.whatsappDisplay}

The Lavish Haven
${SITE.address.street}, ${SITE.address.locality} ${SITE.address.postalCode}, ${SITE.address.country}`;

  const hotel = `New booking request ${b.ref}

${details}

Reply to this email to answer the guest directly; the reply is filed under ${b.ref} in the admin inbox.
Confirm or decline: ${SITE.url}/admin/bookings/${b.id}`;

  const [r] = await Promise.all([
    sendToGuest({ threadId: thread.id, subject, text: guest, storedText: guest.replace(manageUrl, "[the guest's private link to view or cancel]"), automatic: true }),
    notifyHotel(`New booking request ${b.ref}: ${b.guest_name}, ${b.check_in} to ${b.check_out}`, hotel, b.email),
  ]);
  await noteOutcome(b, subject, r);
}

/** The email that goes with a status change made in admin. `author` is the admin who made it. */
export async function emailStatusChange(b: Booking, message?: string, author?: string): Promise<boolean> {
  const lines: Record<string, [string, string] | undefined> = {
    confirmed: [
      `Your stay is confirmed: ${b.ref}`,
      `We're delighted to confirm your stay at The Lavish Haven.\n\n${summary(b)}\n\nCheck-in is from ${SITE.checkIn}. If you'd like an airport transfer or have any requests, just reply to this email.`,
    ],
    declined: [
      `About your booking request ${b.ref}`,
      `Thank you for your interest in The Lavish Haven. Unfortunately we can't confirm this request for the dates below.\n\n${summary(b)}\n\nPlease reply if you'd like us to suggest other dates or rooms.`,
    ],
    cancelled: [
      `Booking cancelled: ${b.ref}`,
      `Your booking at The Lavish Haven has been cancelled.\n\n${summary(b)}\n\nIf this wasn't expected, please reply or contact us on WhatsApp: ${SITE.whatsappDisplay}.`,
    ],
  };
  const entry = lines[b.status];
  if (!entry) return false;
  const [subject, body] = entry;
  const thread = await threadForBooking(b);
  const r = await sendToGuest({
    threadId: thread.id,
    subject,
    text: `Dear ${b.guest_name},\n\n${body}${message ? `\n\n${message}` : ""}\n\nThe Lavish Haven\n${SITE.whatsappDisplay}`,
    author,
    automatic: !author,
  });
  await noteOutcome(b, subject, r);
  return r.sent;
}

/** The guest cancelled from their manage link: record it in the conversation and tell the hotel. */
export async function emailGuestCancelled(b: Booking) {
  const thread = await threadForBooking(b);
  await addMessage({
    threadId: thread.id,
    direction: "in",
    channel: "web",
    author: "guest",
    fromName: b.guest_name,
    fromAddr: b.email,
    body: `The guest cancelled booking ${b.ref} online.\n\n${summary(b)}`,
    delivery: "received",
  });
  await notifyHotel(`Guest cancelled ${b.ref}: ${b.guest_name}`, `The guest cancelled their booking request.\n\n${summary(b)}\n\n${SITE.url}/admin/bookings/${b.id}`, b.email);
}
