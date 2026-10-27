import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { bookingConfigured } from "@/lib/booking/config";
import { exportIcs, exportToken } from "@/lib/booking/ical";
import { ROOMS } from "@/lib/rooms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug.replace(/\.ics$/, "");
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const expected = exportToken(slug);
  const valid = token.length === expected.length && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  if (!bookingConfigured() || !ROOMS.some((r) => r.slug === slug) || !valid) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(await exportIcs(slug), {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "no-store", "Content-Disposition": `inline; filename="${slug}.ics"` },
  });
}
