import { NextRequest, NextResponse } from "next/server";
import { ROOMS } from "@/lib/rooms";
import { SITE } from "@/lib/site";
import { bookingConfigured, LIMITS } from "@/lib/booking/config";
import { bookingRequestSchema } from "@/lib/booking/validation";
import { stayProblem } from "@/lib/booking/stay";
import { roomTypes } from "@/lib/booking/availability";
import { createBooking, quote } from "@/lib/booking/bookings";
import { emailNewRequest } from "@/lib/booking/email";
import { getSettings } from "@/lib/booking/settings";
import { rateLimit } from "@/lib/booking/ratelimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!bookingConfigured()) return NextResponse.json({ error: "Online booking isn't available yet." }, { status: 503 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] ??= issue.message;
    return NextResponse.json({ error: "Please check the highlighted details.", fieldErrors }, { status: 400 });
  }
  const input = parsed.data;

  // Bots: honeypot filled or the form submitted implausibly fast. Answer like a success, store nothing.
  if (input.website || (input.elapsedMs !== undefined && input.elapsedMs < 2500)) {
    return NextResponse.json({ ref: "LH-RECEIVED", manageUrl: null });
  }

  const problem = stayProblem(input.checkIn, input.checkOut);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });
  if (!ROOMS.some((r) => r.slug === input.room)) return NextResponse.json({ error: "Choose a room." }, { status: 400 });
  if (input.rooms > LIMITS.maxRoomsPerBooking)
    return NextResponse.json({ error: `For more than ${LIMITS.maxRoomsPerBooking} rooms, please send a group enquiry.` }, { status: 400 });

  try {
    const settings = await getSettings();
    if (!settings.onlineBooking) return NextResponse.json({ error: "Online booking is paused. Please send an enquiry." }, { status: 503 });
    if (!(await rateLimit("booking", 5, 60))) return NextResponse.json({ error: "Too many booking requests from this connection. Please message us on WhatsApp." }, { status: 429 });

    const type = (await roomTypes()).find((t) => t.slug === input.room);
    if (!type) return NextResponse.json({ error: "That room isn't available to book online." }, { status: 400 });
    const guests = input.adults + input.children;
    if (type.max_guests * input.rooms < guests)
      return NextResponse.json({ error: `This room sleeps up to ${type.max_guests} guests. Add a room or choose a larger room.` }, { status: 400 });

    const result = await createBooking({
      roomSlug: input.room,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      rooms: input.rooms,
      adults: input.adults,
      children: input.children,
      guestName: input.guest.name,
      email: input.guest.email,
      phone: input.guest.phone,
      country: input.guest.country || null,
      arrivalTime: input.guest.arrivalTime || null,
      requests: input.guest.requests || null,
      quotedTotal: quote(type.nightly_rate, input.checkIn, input.checkOut, input.rooms),
      currency: settings.currency,
      source: "website",
      actor: "guest",
    });
    if (!result.ok)
      return NextResponse.json({ error: "Sorry, that room has just been taken for some of those nights. Please choose another room or dates." }, { status: 409 });

    const manageUrl = `${SITE.url}/booking/${result.booking.ref}?t=${result.guestToken}`;
    await emailNewRequest(result.booking, manageUrl).catch((e) => console.error("booking email failed", e));
    return NextResponse.json({ ref: result.booking.ref, manageUrl: `/booking/${result.booking.ref}?t=${result.guestToken}` }, { status: 201 });
  } catch (e) {
    console.error("booking failed", e);
    return NextResponse.json({ error: "We couldn't save your request. Please try again or message us on WhatsApp." }, { status: 500 });
  }
}
