import { NextRequest, NextResponse } from "next/server";
import { currentAdmin } from "@/lib/booking/auth";
import { listBookings } from "@/lib/booking/bookings";
import { getRoom } from "@/lib/rooms";
import { nights } from "@/lib/booking/dates";

export const dynamic = "force-dynamic";

/** Neutralises spreadsheet formula injection and quotes each cell. */
const cell = (v: unknown) => {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req: NextRequest) {
  if (!(await currentAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  const p = req.nextUrl.searchParams;
  const { rows } = await listBookings({
    status: p.get("status") || undefined, q: p.get("q") || undefined, from: p.get("from") || undefined, to: p.get("to") || undefined,
    sort: p.get("sort") === "arrival" ? "arrival" : "created", limit: 10000,
  });
  const header = ["Reference", "Status", "Source", "Room", "Rooms", "Check-in", "Check-out", "Nights", "Adults", "Children", "Guest", "Email", "Phone", "Country", "Arrival time", "Total", "Currency", "Requests", "Internal notes", "Received"];
  const lines = [header.map(cell).join(",")];
  for (const b of rows) {
    lines.push([b.ref, b.status, b.source, getRoom(b.room_slug)?.name ?? b.room_slug, b.rooms, b.check_in, b.check_out, nights(b.check_in, b.check_out), b.adults, b.children, b.guest_name, b.email, b.phone, b.country, b.arrival_time, b.quoted_total, b.currency, b.requests, b.internal_notes, b.created_at].map(cell).join(","));
  }
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse("﻿" + lines.join("\r\n"), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="lavish-haven-bookings-${stamp}.csv"`, "Cache-Control": "no-store" },
  });
}
