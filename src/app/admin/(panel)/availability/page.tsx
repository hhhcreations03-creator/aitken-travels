import { ROOMS, getRoom } from "@/lib/rooms";
import { db } from "@/lib/booking/db";
import { ensureSchema } from "@/lib/booking/schema";
import { exportUrl } from "@/lib/booking/ical";
import { addBlock, addFeed, removeBlock, removeFeed, syncFeedNow } from "../../actions";
import { Empty, PageTitle, Panel, adminBtnDanger, adminBtnOutline, adminBtnPrimary, adminInput, adminLabel, dateTime, shortDate } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AvailabilityAdmin() {
  await ensureSchema();
  const d = await db();
  const [blocks, feeds] = await Promise.all([
    d.query<{ id: string; room_slug: string; start_date: string; end_date: string; units: number; reason: string | null }>(
      `SELECT id, room_slug, start_date::text AS start_date, end_date::text AS end_date, units, reason FROM blocks
        WHERE source = 'manual' AND end_date >= current_date ORDER BY start_date, room_slug`
    ),
    d.query<{ id: string; room_slug: string; name: string; url: string; last_synced_at: string | null; last_error: string | null; event_count: number }>(
      `SELECT id, room_slug, name, url, last_synced_at::text AS last_synced_at, last_error, event_count FROM ical_feeds ORDER BY created_at`
    ),
  ]);

  return (
    <div className="grid gap-8">
      <PageTitle title="Closures & calendar sync" />

      <Panel title="Close dates">
        <p className="mb-4 max-w-[70ch] text-[14px] text-charcoal-soft">Take rooms off sale for maintenance, private use or owner stays. Closed nights can&rsquo;t be booked online.</p>
        <form action={addBlock} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_100px_2fr_auto] lg:items-end">
          <div><label htmlFor="b-room" className={adminLabel}>Room</label>
            <select id="b-room" name="roomSlug" className={adminInput}><option value="all">Whole hotel</option>{ROOMS.map((r) => <option key={r.slug} value={r.slug}>{r.shortName}</option>)}</select>
          </div>
          <div><label htmlFor="b-start" className={adminLabel}>First night</label><input id="b-start" name="startDate" type="date" required className={adminInput} /></div>
          <div><label htmlFor="b-end" className={adminLabel}>Reopens on</label><input id="b-end" name="endDate" type="date" required className={adminInput} /></div>
          <div><label htmlFor="b-units" className={adminLabel}>Rooms</label><input id="b-units" name="units" type="number" min={1} max={50} defaultValue={1} className={adminInput} /></div>
          <div><label htmlFor="b-reason" className={adminLabel}>Reason</label><input id="b-reason" name="reason" placeholder="Maintenance" className={adminInput} /></div>
          <button className={adminBtnPrimary}>Close dates</button>
        </form>
        <ul className="mt-5 grid gap-2">
          {blocks.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[3px] border border-[color:var(--line-soft)] px-3 py-2 text-[13.5px]">
              <span><span className="font-medium">{getRoom(b.room_slug)?.shortName ?? b.room_slug}</span> <span className="text-charcoal-soft">{shortDate(b.start_date)} to {shortDate(b.end_date)}, {b.units >= 50 ? "all rooms" : `${b.units} room${b.units === 1 ? "" : "s"}`}{b.reason ? `, ${b.reason}` : ""}</span></span>
              <form action={removeBlock}><input type="hidden" name="id" value={b.id} /><button className={adminBtnOutline}>Reopen</button></form>
            </li>
          ))}
          {!blocks.length && <Empty>No upcoming closures.</Empty>}
        </ul>
      </Panel>

      <Panel title="Import calendars from Booking.com and other channels">
        <div className="mb-4 max-w-[75ch] space-y-2 text-[14px] text-charcoal-soft">
          <p>Paste a channel&rsquo;s calendar export link (iCal, ending in .ics) for a room type. Its bookings then block that room type here, so the website won&rsquo;t sell the same nights twice.</p>
          <p>In the Booking.com extranet, look under <strong>Rates &amp; Availability</strong>, then <strong>Sync calendars</strong>. If that option isn&rsquo;t offered for your property, add Booking.com reservations here as manual bookings with source &ldquo;booking.com&rdquo;.</p>
          <p>Imported calendars refresh every time a guest searches (at most every 15 minutes) and once a day automatically.</p>
        </div>
        <form action={addFeed} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_3fr_auto] lg:items-end">
          <div><label htmlFor="f-room" className={adminLabel}>Room type</label>
            <select id="f-room" name="roomSlug" required className={adminInput}>{ROOMS.map((r) => <option key={r.slug} value={r.slug}>{r.shortName}</option>)}</select>
          </div>
          <div><label htmlFor="f-name" className={adminLabel}>Channel</label><input id="f-name" name="name" defaultValue="Booking.com" className={adminInput} /></div>
          <div><label htmlFor="f-url" className={adminLabel}>Calendar link</label><input id="f-url" name="url" type="url" required placeholder="https://admin.booking.com/hotel/hoteladmin/ical.html?t=…" className={adminInput} /></div>
          <button className={adminBtnPrimary}>Connect</button>
        </form>
        <ul className="mt-5 grid gap-2">
          {feeds.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[3px] border border-[color:var(--line-soft)] px-3 py-2 text-[13.5px]">
              <span className="min-w-0">
                <span className="font-medium">{getRoom(f.room_slug)?.shortName ?? f.room_slug}</span> <span className="text-charcoal-soft">from {f.name}</span>
                <span className={`block text-[12.5px] ${f.last_error ? "text-[#7A2E24]" : "text-charcoal-mute"}`}>
                  {f.last_error ? `Last sync failed: ${f.last_error}` : f.last_synced_at ? `${f.event_count} upcoming, synced ${dateTime(f.last_synced_at)}` : "Not synced yet"}
                </span>
              </span>
              <span className="flex gap-2">
                <form action={syncFeedNow}><input type="hidden" name="id" value={f.id} /><button className={adminBtnOutline}>Sync now</button></form>
                <form action={removeFeed}><input type="hidden" name="id" value={f.id} /><button className={adminBtnDanger}>Disconnect</button></form>
              </span>
            </li>
          ))}
          {!feeds.length && <Empty>No calendars connected.</Empty>}
        </ul>
      </Panel>

      <Panel title="Export calendars to other channels">
        <p className="mb-4 max-w-[75ch] text-[14px] text-charcoal-soft">Give these private links to Booking.com, Airbnb or a channel manager so website bookings and closures block those channels too. Each link covers one room type and shares no guest details.</p>
        <ul className="grid gap-2">
          {ROOMS.map((r) => (
            <li key={r.slug} className="grid gap-1 rounded-[3px] border border-[color:var(--line-soft)] px-3 py-2 text-[13px] sm:grid-cols-[260px_1fr] sm:items-center">
              <span className="font-medium text-charcoal">{r.shortName}</span>
              <input readOnly value={exportUrl(r.slug)} aria-label={`Calendar export link for ${r.shortName}`} className={`${adminInput} font-mono text-[12px]`} />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
