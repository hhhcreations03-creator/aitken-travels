import { NextRequest, NextResponse } from "next/server";
import { currentAdmin } from "@/lib/booking/auth";
import { bookingConfigured } from "@/lib/booking/config";
import { inboxStamp, mailboxStatus, syncMailbox } from "@/lib/inbox/mailbox";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Called in the background by open admin pages every 30 seconds (and when the
 * tab comes back into view). Files new email, reading Gmail at most every 20
 * seconds however many tabs are open, and returns a stamp that changes when
 * any conversation changes so the page can refresh itself.
 */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return NextResponse.json({ error: "Cross-origin request blocked" }, { status: 403 });
  if (!(await currentAdmin())) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  if (!bookingConfigured()) return NextResponse.json({ ok: true, imported: 0, skipped: "not_configured" });
  const result = await syncMailbox();
  const [stamp, status] = await Promise.all([inboxStamp(), mailboxStatus()]);
  return NextResponse.json({ ...result, stamp, checkedAt: status.lastSyncAt }, { status: result.ok ? 200 : 502 });
}
