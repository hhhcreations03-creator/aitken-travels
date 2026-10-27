import { NextRequest, NextResponse } from "next/server";
import { bookingConfigured } from "@/lib/booking/config";
import { searchSchema } from "@/lib/booking/validation";
import { stayProblem } from "@/lib/booking/stay";
import { searchRooms } from "@/lib/booking/search";
import { getSettings } from "@/lib/booking/settings";
import { rateLimit } from "@/lib/booking/ratelimit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!bookingConfigured()) return NextResponse.json({ error: "Online booking isn't available yet." }, { status: 503 });
  const parsed = searchSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Check the dates and guest numbers." }, { status: 400 });
  const { checkIn, checkOut, adults, children, rooms } = parsed.data;
  const problem = stayProblem(checkIn, checkOut);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });
  try {
    if (!(await getSettings()).onlineBooking) return NextResponse.json({ error: "Online booking is paused. Please send an enquiry." }, { status: 503 });
    if (!(await rateLimit("search", 60, 5))) return NextResponse.json({ error: "Too many searches. Please wait a few minutes." }, { status: 429 });
    const offers = await searchRooms(checkIn, checkOut, adults + children, rooms);
    return NextResponse.json({ offers }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("availability failed", e);
    return NextResponse.json({ error: "We couldn't check availability just now. Please try again or message us on WhatsApp." }, { status: 500 });
  }
}
