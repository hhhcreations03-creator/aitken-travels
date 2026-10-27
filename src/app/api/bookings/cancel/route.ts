import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { bookingConfigured, HOTEL_TZ } from "@/lib/booking/config";
import { getBookingForGuest, setStatus } from "@/lib/booking/bookings";
import { emailGuestCancelled, emailStatusChange } from "@/lib/booking/email";
import { todayIn } from "@/lib/booking/dates";
import { rateLimit } from "@/lib/booking/ratelimit";

export const dynamic = "force-dynamic";

const schema = z.object({ ref: z.string().max(20), token: z.string().max(100) });

export async function POST(req: NextRequest) {
  if (!bookingConfigured()) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  if (!(await rateLimit("cancel", 10, 60))) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  const booking = await getBookingForGuest(parsed.data.ref, parsed.data.token);
  if (!booking) return NextResponse.json({ error: "We couldn't find that booking." }, { status: 404 });
  if (!["pending", "confirmed"].includes(booking.status)) return NextResponse.json({ error: "This booking can no longer be cancelled online." }, { status: 409 });
  if (booking.check_in <= todayIn(HOTEL_TZ)) return NextResponse.json({ error: "Arrival is today or has passed. Please contact the hotel." }, { status: 409 });
  const result = await setStatus(booking.id, "cancelled", "guest", "Cancelled by the guest online");
  if (!result.ok) return NextResponse.json({ error: "This booking can no longer be cancelled online." }, { status: 409 });
  await Promise.all([emailStatusChange(result.booking), emailGuestCancelled(result.booking)]).catch(() => null);
  return NextResponse.json({ ok: true });
}
