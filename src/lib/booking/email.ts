import "server-only";
import nodemailer from "nodemailer";
import { SITE } from "@/lib/site";
import { getRoom } from "@/lib/rooms";
import { emailConfigured } from "./config";
import { formatDate, nights } from "./dates";
import type { Booking } from "./bookings";
import { logEvent } from "./bookings";

function transport() {
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const hotelInbox = () => process.env.ENQUIRY_TO || SITE.email;

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

async function send(bookingId: string, to: string, subject: string, text: string, replyTo?: string) {
  if (!emailConfigured()) {
    await logEvent(bookingId, "system", "email skipped", `Email is not configured; "${subject}" not sent to ${to}`);
    return false;
  }
  try {
    await transport().sendMail({ from: `"${SITE.name}" <${process.env.SMTP_USER}>`, to, subject, text, replyTo });
    await logEvent(bookingId, "system", "email sent", `"${subject}" to ${to}`);
    return true;
  } catch (e) {
    await logEvent(bookingId, "system", "email failed", `"${subject}" to ${to}: ${e instanceof Error ? e.message : "error"}`);
    return false;
  }
}

export async function emailNewRequest(b: Booking, manageUrl: string) {
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

${summary(b)}

Guest: ${b.guest_name}
Email: ${b.email}
Phone: ${b.phone}${b.country ? `\nCountry: ${b.country}` : ""}${b.arrival_time ? `\nArrival time: ${b.arrival_time}` : ""}${b.requests ? `\n\nRequests:\n${b.requests}` : ""}

Confirm or decline: ${SITE.url}/admin/bookings/${b.id}`;

  await Promise.all([
    send(b.id, b.email, `Booking request received: ${b.ref}`, guest, hotelInbox()),
    send(b.id, hotelInbox(), `New booking request ${b.ref}: ${b.guest_name}, ${b.check_in} to ${b.check_out}`, hotel, b.email),
  ]);
}

export async function emailStatusChange(b: Booking, message?: string) {
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
  return send(b.id, b.email, subject, `Dear ${b.guest_name},\n\n${body}${message ? `\n\n${message}` : ""}\n\nThe Lavish Haven\n${SITE.whatsappDisplay}`, hotelInbox());
}

export async function emailGuestCancelled(b: Booking) {
  await send(b.id, hotelInbox(), `Guest cancelled ${b.ref}: ${b.guest_name}`, `The guest cancelled their booking request.\n\n${summary(b)}\n\n${SITE.url}/admin/bookings/${b.id}`);
}
