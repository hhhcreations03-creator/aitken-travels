import { beforeAll, describe, expect, it } from "vitest";
import { db } from "@/lib/booking/db";
import { nightly, sourceMix, summarise } from "@/lib/pms/metrics";
import { addBooking, setupHotel, SLUG_A, SLUG_B } from "./helpers";

describe("performance metrics", () => {
  beforeAll(async () => {
    const d = await setupHotel();
    // Capacity 5 rooms a night. Window: 1–4 Jan 2027 (3 nights).
    await addBooking({ slug: SLUG_A, in: "2027-01-01", out: "2027-01-04", total: 300 }); // 3 nights, 100/night
    await addBooking({ slug: SLUG_B, in: "2027-01-02", out: "2027-01-03", rooms: 2, total: 400, status: "checked_in", source: "phone" }); // 2 room-nights, 400 on the 2nd
    await addBooking({ slug: SLUG_A, in: "2027-01-01", out: "2027-01-02", status: "pending" }); // on hold, not sold
    await addBooking({ slug: SLUG_A, in: "2027-01-01", out: "2027-01-03", status: "cancelled" }); // ignored
    await addBooking({ slug: SLUG_A, in: "2027-01-03", out: "2027-01-04", total: null }); // sold, no price
    // One room of A closed for maintenance on the 3rd.
    await d.query(`INSERT INTO blocks (room_slug, start_date, end_date, units, source) VALUES ($1, '2027-01-03', '2027-01-04', 1, 'manual')`, [SLUG_A]);
    // An OTA calendar stay on B for the 1st.
    const [f] = await d.query<{ id: string }>(`INSERT INTO ical_feeds (room_slug, name, url) VALUES ($1, 'Booking.com', 'https://example.com/x.ics') RETURNING id`, [SLUG_B]);
    await d.query(`INSERT INTO blocks (room_slug, start_date, end_date, units, source, feed_id, external_uid) VALUES ($1, '2027-01-01', '2027-01-02', 1, 'ical', $2, 'u1')`, [SLUG_B, f.id]);
  });

  it("counts sold, held, closed and OTA nights per night", async () => {
    const rows = await nightly("2027-01-01", "2027-01-04", "USD");
    expect(rows.map((r) => r.night)).toEqual(["2027-01-01", "2027-01-02", "2027-01-03"]);
    expect(rows.map((r) => r.capacity)).toEqual([5, 5, 5]);
    expect(rows.map((r) => r.closed)).toEqual([0, 0, 1]);
    expect(rows.map((r) => r.sold)).toEqual([2, 3, 2]); // 1st: A + OTA; 2nd: A + 2×B; 3rd: A + unpriced A
    expect(rows.map((r) => r.otaBlocked)).toEqual([1, 0, 0]);
    expect(rows.map((r) => r.pending)).toEqual([1, 0, 0]);
    expect(rows.map((r) => r.revenue)).toEqual([100, 500, 100]);
    expect(rows.map((r) => r.pricedNights)).toEqual([1, 3, 1]);
  });

  it("derives occupancy, ADR and RevPAR", async () => {
    const s = summarise(await nightly("2027-01-01", "2027-01-04", "USD"));
    expect(s.available).toBe(14); // 15 − 1 closed
    expect(s.sold).toBe(7);
    expect(s.revenue).toBe(700);
    expect(s.occupancy).toBeCloseTo(0.5);
    expect(s.adr).toBeCloseTo(700 / 5); // only priced nights
    expect(s.revpar).toBeCloseTo(50);
  });

  it("never reports more than 100% when calendars overlap", async () => {
    const d = await db();
    const [f] = await d.query<{ id: string }>(`SELECT id FROM ical_feeds LIMIT 1`);
    await d.query(`INSERT INTO blocks (room_slug, start_date, end_date, units, source, feed_id, external_uid) VALUES ($1, '2027-01-02', '2027-01-03', 5, 'ical', $2, 'u2')`, [SLUG_B, f.id]);
    const [, second] = await nightly("2027-01-01", "2027-01-04", "USD");
    expect(second.sold).toBe(5);
    await d.query(`DELETE FROM blocks WHERE external_uid = 'u2'`);
  });

  it("groups booking sources, including OTA calendars", async () => {
    const mix = await sourceMix("2000-01-01", "2100-01-01", "USD");
    const by = Object.fromEntries(mix.map((m) => [m.source, m]));
    expect(by.website.bookings).toBe(3); // two confirmed + one pending (cancelled excluded)
    expect(by.phone.roomNights).toBe(2);
    expect(by.phone.revenue).toBe(400);
    expect(by["Booking.com"].roomNights).toBe(1);
  });
});
