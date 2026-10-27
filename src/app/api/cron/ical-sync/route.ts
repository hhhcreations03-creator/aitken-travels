import { NextRequest, NextResponse } from "next/server";
import { bookingConfigured } from "@/lib/booking/config";
import { syncAllFeeds } from "@/lib/booking/ical";

export const dynamic = "force-dynamic";

/** Called by Vercel Cron with "Authorization: Bearer <CRON_SECRET>". */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new NextResponse("Unauthorized", { status: 401 });
  if (!bookingConfigured()) return NextResponse.json({ skipped: "no database" });
  const results = await syncAllFeeds(false);
  return NextResponse.json({ synced: results.length, failed: results.filter((r) => !r.ok).length });
}
