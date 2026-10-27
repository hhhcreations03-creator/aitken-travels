import { z } from "zod";
import { ISO_DATE, isValidDate } from "./dates";

const date = z.string().regex(ISO_DATE, "Use the format YYYY-MM-DD.").refine(isValidDate, "That date doesn't exist.");
const trimmed = (max: number) => z.string().trim().max(max);

export const searchSchema = z.object({
  checkIn: date,
  checkOut: date,
  adults: z.coerce.number().int().min(1).max(60),
  children: z.coerce.number().int().min(0).max(60).default(0),
  rooms: z.coerce.number().int().min(1).max(20).default(1),
});

export const guestSchema = z.object({
  name: trimmed(120).min(2, "Add your full name."),
  email: z.string().trim().toLowerCase().email("Add a valid email address.").max(200),
  phone: trimmed(40).min(6, "Add a phone or WhatsApp number with country code.").regex(/^[+\d][\d\s().-]{5,}$/, "Use digits, spaces and an optional leading +."),
  country: trimmed(80).optional().or(z.literal("")),
  arrivalTime: trimmed(40).optional().or(z.literal("")),
  requests: trimmed(2000).optional().or(z.literal("")),
});

export const bookingRequestSchema = searchSchema.extend({
  room: z.string().trim().min(1).max(120),
  guest: guestSchema,
  /** Must be true: the guest accepts that this is a request confirmed by the hotel. */
  agree: z.literal(true, { message: "Please confirm you've read how booking works." }),
  /** Honeypot: must be empty. */
  website: z.string().max(0).optional().or(z.literal("")),
  /** Milliseconds the form was open; very fast submissions are treated as bots. */
  elapsedMs: z.coerce.number().optional(),
});

export type SearchInput = z.infer<typeof searchSchema>;
export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

export const BOOKING_STATUSES = ["pending", "confirmed", "checked_in", "completed", "cancelled", "declined"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];
/** Statuses that occupy inventory. */
export const HOLDING_STATUSES: BookingStatus[] = ["pending", "confirmed", "checked_in"];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Awaiting confirmation",
  confirmed: "Confirmed",
  checked_in: "Checked in",
  completed: "Checked out",
  cancelled: "Cancelled",
  declined: "Declined",
};

export const BOOKING_SOURCES = ["website", "phone", "whatsapp", "email", "walk-in", "booking.com", "other"] as const;
