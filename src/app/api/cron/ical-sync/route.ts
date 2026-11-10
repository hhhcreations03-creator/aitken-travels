import { NextRequest, NextResponse } from "next/server";
import { bookingConfigured } from "@/lib/booking/config";
import { syncAllFeeds } from "@/lib/booking/ical";
import { syncMailbox } from "@/lib/inbox/mailbox";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Called daily by Vercel Cron with "Authorization: Bearer <CRON_SECRET>": refreshes channel calendars and files new email. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return new NextResponse("Unauthorized", { status: 401 });
  if (!bookingConfigured()) return NextResponse.json({ skipped: "no database" });
  const results = await syncAllFeeds(false);
  const mail = await syncMailbox({ force: true }).catch((e) => ({ ok: false as const, error: e instanceof Error ? e.message : "error" }));
  return NextResponse.json({ synced: results.length, failed: results.filter((r) => !r.ok).length, mail });
}
