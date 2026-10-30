import Link from "next/link";
import { getRoom } from "@/lib/rooms";
import { HOTEL_TZ } from "@/lib/booking/config";
import { addDays, isValidDate, todayIn } from "@/lib/booking/dates";
import { occupancy } from "@/lib/booking/availability";
import { listBookings } from "@/lib/booking/bookings";
import { PageTitle, adminBtnOutline, StatusBadge } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
const DAYS = 21;

export default async function CalendarPage({ searchParams }: { searchParams: { start?: string } }) {
  const today = todayIn(HOTEL_TZ);
  const start = searchParams.start && isValidDate(searchParams.start) ? searchParams.start : today;
  const end = addDays(start, DAYS);
  const [cells, bookings] = await Promise.all([occupancy(start, end), listBookings({ status: "active", from: start, to: addDays(end, -1), sort: "arrival", limit: 500 })]);
  const days = Array.from({ length: DAYS }, (_, i) => addDays(start, i));
  const bySlug = new Map<string, Map<string, { used: number; units: number }>>();
  for (const c of cells) {
    if (!bySlug.has(c.slug)) bySlug.set(c.slug, new Map());
    bySlug.get(c.slug)!.set(c.night, { used: Number(c.used), units: Number(c.units) });
  }
  const label = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", timeZone: "UTC" });
  const month = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <div>
      <PageTitle title="Calendar">
        <Link href={`/admin/calendar?start=${addDays(start, -DAYS)}`} className={adminBtnOutline}>Earlier</Link>
        <Link href="/admin/calendar" className={adminBtnOutline}>Today</Link>
        <Link href={`/admin/calendar?start=${end}`} className={adminBtnOutline}>Later</Link>
      </PageTitle>
      <p className="mb-4 text-[14px] text-charcoal-soft">
        {month(start)}{month(start) !== month(addDays(end, -1)) ? ` to ${month(addDays(end, -1))}` : ""}. Each cell shows rooms taken out of rooms available that night, including closed dates and imported calendars.
      </p>
      <div className="relative overflow-x-auto rounded-[4px] border border-[color:var(--line)] bg-white">
        <table className="w-full min-w-[1100px] border-collapse text-[12.5px]">
          <thead>
            <tr className="bg-[#FAF8F4]">
              <th scope="col" className="sticky left-0 z-10 min-w-[150px] sm:min-w-[220px] bg-[#FAF8F4] px-3 py-2 text-left font-medium text-charcoal-soft">Room type</th>
              {days.map((d) => (
                <th key={d} scope="col" className={`px-1 py-2 text-center font-medium ${d === today ? "text-forest" : "text-charcoal-soft"}`}>
                  <span className="block whitespace-nowrap">{label(d)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(bySlug.entries()).map(([slug, nightsMap]) => (
              <tr key={slug} className="border-t border-[color:var(--line-soft)]">
                <th scope="row" className="sticky left-0 z-10 bg-white px-3 py-2 text-left font-normal text-charcoal">{getRoom(slug)?.shortName ?? slug}</th>
                {days.map((d) => {
                  const c = nightsMap.get(d) ?? { used: 0, units: 0 };
                  const full = c.used >= c.units;
                  const over = c.used > c.units;
                  const tone = c.units === 0 ? "bg-[#ECEAE5] text-charcoal-mute" : over ? "bg-[#9B3B2E] text-white" : full ? "bg-forest text-ivory" : c.used > 0 ? "bg-[#DCE7DF] text-forest" : "text-charcoal-mute";
                  return (
                    <td key={d} className="p-0.5 text-center">
                      <span className={`block rounded-[2px] py-1.5 tabular-nums ${tone}`} title={`${c.used} of ${c.units} taken`}>{c.units === 0 ? "–" : `${c.used}/${c.units}`}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-3 flex flex-wrap gap-4 text-[12.5px] text-charcoal-soft">
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[2px] bg-[#DCE7DF]" /> Partly booked</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[2px] bg-forest" /> Full</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[2px] bg-[#9B3B2E]" /> Overbooked</li>
        <li className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-[2px] bg-[#ECEAE5]" /> No rooms set</li>
      </ul>

      <h2 className="mb-3 mt-10 text-[15px] font-semibold text-charcoal">Bookings in this period</h2>
      <ul className="grid gap-2">
        {bookings.rows.map((b) => (
          <li key={b.id}>
            <Link href={`/admin/bookings/${b.id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-[3px] border border-[color:var(--line)] bg-white px-4 py-2.5 text-[13.5px] hover:border-forest">
              <span><span className="font-medium">{b.guest_name}</span> <span className="text-charcoal-mute">{b.ref}</span> <span className="text-charcoal-soft">{getRoom(b.room_slug)?.shortName}{b.rooms > 1 ? ` x${b.rooms}` : ""}</span></span>
              <span className="flex items-center gap-3 text-charcoal-soft">{b.check_in} to {b.check_out}<StatusBadge status={b.status} /></span>
            </Link>
          </li>
        ))}
        {!bookings.rows.length && <li className="text-[14px] text-charcoal-mute">No bookings in this period.</li>}
      </ul>
    </div>
  );
}
