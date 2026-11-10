import { NextRequest, NextResponse } from "next/server";
import { currentAdmin } from "@/lib/booking/auth";
import { bookingConfigured } from "@/lib/booking/config";
import { syncMailbox } from "@/lib/inbox/mailbox";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Called by the admin inbox in the background when it opens, so new email is
 * filed without anyone pressing a button. Reads at most once a minute.
 */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return NextResponse.json({ error: "Cross-origin request blocked" }, { status: 403 });
  if (!(await currentAdmin())) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  if (!bookingConfigured()) return NextResponse.json({ ok: true, imported: 0, skipped: "not_configured" });
  const result = await syncMailbox();
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
