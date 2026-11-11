import Link from "next/link";
import { getRoom } from "@/lib/rooms";
import { HOTEL_TZ } from "@/lib/booking/config";
import { addDays, todayIn, nights } from "@/lib/booking/dates";
import { dashboardStats, listBookings, type Booking } from "@/lib/booking/bookings";
import { ChartPanel, Empty, LinkButton, Panel, StatCard, StatusBadge, money, pct, shortDate, dateTime } from "@/components/admin/ui";
import { BarChart, Donut, LineChart, Meter } from "@/components/admin/charts";
import { cancellationStats, feedAlerts, nightly, pickup, sourceMix, summarise } from "@/lib/pms/metrics";
import { getSettings } from "@/lib/booking/settings";
import { formatDate } from "@/lib/booking/dates";
import { inboxCounts, listThreads } from "@/lib/inbox/threads";
import { KindBadge } from "@/components/admin/inbox/Conversation";

export const dynamic = "force-dynamic";

function Row({ b, show }: { b: Booking; show: "arrival" | "departure" | "created" | "upcoming" }) {
  return (
    <li>
      <Link href={`/admin/bookings/${b.id}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[3px] px-2 py-2.5 hover:bg-ivory">
        <span className="min-w-0">
          <span className="font-medium text-charcoal">{b.guest_name}</span>
          <span className="ml-2 text-[13px] text-charcoal-mute">{b.ref}</span>
          <span className="block truncate text-[13px] text-charcoal-soft">
            {getRoom(b.room_slug)?.shortName ?? b.room_slug}{b.rooms > 1 ? ` x${b.rooms}` : ""}, {b.adults + b.children} guest{b.adults + b.children === 1 ? "" : "s"}, {nights(b.check_in, b.check_out)} nights
          </span>
        </span>
        <span className="flex items-center gap-3 text-[13px] text-charcoal-soft">
          {show === "created" ? `${shortDate(b.check_in)} to ${shortDate(b.check_out)}, sent ${dateTime(b.created_at)}` : show === "upcoming" ? `${shortDate(b.check_in)} to ${shortDate(b.check_out)}` : show === "arrival" ? `Leaves ${shortDate(b.check_out)}` : `Arrived ${shortDate(b.check_in)}`}
          <StatusBadge status={b.status} />
        </span>
      </Link>
    </li>
  );
}

const SOURCE_LABELS: Record<string, string> = { website: "Website", phone: "Phone", whatsapp: "WhatsApp", email: "Email", "walk-in": "Walk-in", "booking.com": "Booking.com", other: "Other" };
const tick = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const monthStart = (iso: string) => `${iso.slice(0, 8)}01`;
const nextMonth = (iso: string) => {
  const d = new Date(`${monthStart(iso)}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + 1);
  return d.toISOString().slice(0, 10);
};
const prevMonth = (iso: string) => {
  const d = new Date(`${monthStart(iso)}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() - 1);
  return d.toISOString().slice(0, 10);
};
const change = (now: number | null, before: number | null) => (now === null || before === null || before === 0 ? null : (now - before) / before);

export default async function Dashboard() {
  const today = todayIn(HOTEL_TZ);
  const { currency } = await getSettings();
  const m0 = monthStart(today);
  const m1 = nextMonth(today);
  const dayOfMonth = Number(today.slice(8, 10));
  const lm0 = prevMonth(today);
  const lmSameDay = addDays(lm0, dayOfMonth);
  const [stats, pending, arrivals, departures, upcoming, counts, waiting, trend, month, lastMonthToDate, mix, pick, cancels, alerts] = await Promise.all([
    dashboardStats(today),
    listBookings({ status: "pending", sort: "arrival", limit: 8 }),
    listBookings({ status: "active", arriving: today, sort: "arrival", limit: 50 }),
    listBookings({ status: "active", departing: today, sort: "arrival", limit: 50 }),
    listBookings({ status: "active", from: addDays(today, 1), to: addDays(today, 7), sort: "arrival", limit: 50 }),
    inboxCounts(),
    listThreads({ view: "needs_reply", limit: 5 }),
    nightly(addDays(today, -14), addDays(today, 30), currency),
    nightly(m0, m1, currency),
    nightly(lm0, lmSameDay, currency),
    sourceMix(addDays(today, -90), addDays(today, 1), currency),
    pickup(addDays(today, -29), addDays(today, 1)),
    cancellationStats(addDays(today, -30), addDays(today, 1)),
    feedAlerts(),
  ]);
  const tonight = trend.find((r) => r.night === today);
  const sellable = tonight ? Math.max(0, tonight.capacity - tonight.closed) : 0;
  const occTonight = tonight && sellable ? tonight.sold / sellable : null;
  const freeTonight = tonight ? Math.max(0, sellable - tonight.sold - tonight.pending) : 0;
  const monthAll = summarise(month);
  const monthToDate = summarise(month.filter((r) => r.night < addDays(today, 1)));
  const lastToDate = summarise(lastMonthToDate);
  const next30 = summarise(trend.filter((r) => r.night > today));
  const nextWeek = upcoming.rows.filter((b) => b.check_in > today);
  const monthName = formatDate(today, { month: "long" });
  const todayIndex = trend.findIndex((r) => r.night === today);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-charcoal-mute">{formatDate(today, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          <h1 className="mt-1 font-display text-[2rem] leading-tight text-forest">Today at the Haven</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/admin/bookings/new" primary>New booking</LinkButton>
          <LinkButton href="/admin/calendar">Calendar</LinkButton>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="rounded-[6px] border border-[#9B3B2E]/30 bg-[#FBEDEA] px-5 py-4 text-[14px] text-[#7A2E24]">
          <p className="font-medium">{alerts.length === 1 ? "One imported calendar needs attention" : `${alerts.length} imported calendars need attention`}</p>
          <ul className="mt-1.5 space-y-1 text-[13.5px]">
            {alerts.map((a) => (
              <li key={a.id}>
                {a.name} ({getRoom(a.room_slug)?.shortName ?? a.room_slug}): {a.last_error ? a.last_error : a.last_synced_at ? `last synced ${dateTime(a.last_synced_at)}` : "never synced"}.{" "}
                <Link href="/admin/availability" className="underline">Open closures &amp; sync</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <li className="col-span-2 md:col-span-1">
          <StatCard label="Occupancy tonight" value={pct(occTonight)} hint={tonight ? `${tonight.sold} of ${sellable} rooms sold, ${freeTonight} free${tonight.pending ? `, ${tonight.pending} on hold` : ""}${tonight.closed ? `, ${tonight.closed} closed` : ""}` : "No rooms set up"} href="/admin/calendar">
            {occTonight !== null && <span className="mt-3 block"><Meter value={occTonight} label="Occupancy tonight" /></span>}
          </StatCard>
        </li>
        <li><StatCard label="Arriving today" value={stats.arrivals} href={`/admin/bookings?status=active&arriving=${today}&sort=arrival`} /></li>
        <li><StatCard label="Leaving today" value={stats.departures} href={`/admin/bookings?status=active&departing=${today}&sort=arrival`} /></li>
        <li><StatCard label="In house" value={stats.inhouse} href="/admin/bookings?status=checked_in" /></li>
        <li><StatCard label="Awaiting confirmation" value={stats.pending} href="/admin/bookings?status=pending" tone={stats.pending > 0 ? "attention" : "plain"} /></li>
        <li><StatCard label="Need a reply" value={counts.needsReply} href="/admin/inbox" tone={counts.needsReply > 0 ? "attention" : "plain"} /></li>
      </ul>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartPanel title="Occupancy" subtitle="Last 14 days and the next 30. The dashed line is today." figure={<span className="text-right text-[12.5px] text-charcoal-soft">Next 30 days<br /><span className="font-display text-[1.4rem] text-forest">{pct(next30.occupancy)}</span></span>}>
            <LineChart
              caption="Occupancy by night"
              data={trend.map((r) => {
                const avail = Math.max(1, r.capacity - r.closed);
                return { label: formatDate(r.night, { weekday: "short", day: "numeric", month: "short" }), tick: tick(r.night), values: [r.sold / avail, (r.sold + r.pending) / avail] };
              })}
              series={[{ name: "Sold" }, { name: "Sold and on hold", color: "#C9A86A" }]}
              format="percent"
              max={1}
              marker={todayIndex >= 0 ? todayIndex : undefined}
            />
          </ChartPanel>
        </div>
        <section className="rounded-[6px] border border-[color:var(--line)] bg-white p-5">
          <h2 className="text-[15px] font-semibold text-charcoal">{monthName} so far</h2>
          <p className="mt-0.5 text-[12.5px] text-charcoal-mute">Room revenue from confirmed stays, in {currency}</p>
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
            <div>
              <dt className="text-[12.5px] text-charcoal-soft">Revenue to date</dt>
              <dd className="mt-1 font-display text-[1.5rem] leading-none text-forest tabular-nums">{money(monthToDate.revenue, currency)}</dd>
              {change(monthToDate.revenue, lastToDate.revenue) !== null && <dd className="mt-1 text-[12px] text-charcoal-mute">{(change(monthToDate.revenue, lastToDate.revenue) ?? 0) >= 0 ? "+" : ""}{pct(change(monthToDate.revenue, lastToDate.revenue))} vs same point last month</dd>}
            </div>
            <div>
              <dt className="text-[12.5px] text-charcoal-soft">On the books for {monthName}</dt>
              <dd className="mt-1 font-display text-[1.5rem] leading-none text-forest tabular-nums">{money(monthAll.revenue, currency)}</dd>
            </div>
            <div>
              <dt className="text-[12.5px] text-charcoal-soft">ADR</dt>
              <dd className="mt-1 font-display text-[1.5rem] leading-none text-forest tabular-nums">{monthToDate.adr === null ? "–" : money(Math.round(monthToDate.adr), currency)}</dd>
              <dd className="mt-1 text-[12px] text-charcoal-mute">Average rate per room sold</dd>
            </div>
            <div>
              <dt className="text-[12.5px] text-charcoal-soft">RevPAR</dt>
              <dd className="mt-1 font-display text-[1.5rem] leading-none text-forest tabular-nums">{monthToDate.revpar === null ? "–" : money(Math.round(monthToDate.revpar), currency)}</dd>
              <dd className="mt-1 text-[12px] text-charcoal-mute">Revenue per available room</dd>
            </div>
          </dl>
          <p className="mt-5 border-t border-[color:var(--line-soft)] pt-3 text-[12px] leading-relaxed text-charcoal-mute">
            Stays imported from OTA calendars count toward occupancy, but carry no price until they are entered as reservations.
          </p>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartPanel title="Requests and cancellations" subtitle="Bookings created per day, last 30 days" figure={<span className="text-right text-[12.5px] text-charcoal-soft">Cancellation rate, 30 days<br /><span className="font-display text-[1.4rem] text-forest">{pct(cancels.rate)}</span> <span className="text-charcoal-mute">({cancels.cancelled} of {cancels.total})</span></span>}>
            <BarChart
              caption="Bookings created and cancelled per day"
              data={pick.map((r) => ({ label: formatDate(r.day, { weekday: "short", day: "numeric", month: "short" }), tick: tick(r.day), values: [r.created, r.cancelled] }))}
              series={[{ name: "New bookings" }, { name: "Cancelled", color: "#B5694A" }]}
            />
          </ChartPanel>
        </div>
        <ChartPanel title="Where bookings come from" subtitle="Room nights booked in the last 90 days">
          {mix.length ? (
            <Donut
              caption="Room nights by booking source"
              items={mix.map((m) => ({ label: SOURCE_LABELS[m.source] ?? m.source, value: m.roomNights, note: m.revenue ? money(m.revenue, currency) : undefined }))}
              format="count"
              centre={`${mix.reduce((n, m) => n + m.roomNights, 0)} nights`}
            />
          ) : <Empty>No bookings in the last 90 days.</Empty>}
        </ChartPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={`Arriving today (${arrivals.rows.length})`} action={<Link href={`/admin/bookings?status=active&arriving=${today}&sort=arrival`} className="text-[13px] text-forest underline">View all</Link>}>
          {arrivals.rows.length ? <ul className="-mx-2">{arrivals.rows.map((b) => <Row key={b.id} b={b} show="arrival" />)}</ul> : <Empty>No arrivals today.</Empty>}
        </Panel>
        <Panel title={`Leaving today (${departures.rows.length})`} action={<Link href={`/admin/bookings?status=active&departing=${today}&sort=arrival`} className="text-[13px] text-forest underline">View all</Link>}>
          {departures.rows.length ? <ul className="-mx-2">{departures.rows.map((b) => <Row key={b.id} b={b} show="departure" />)}</ul> : <Empty>No departures today.</Empty>}
        </Panel>
        <Panel title="Awaiting confirmation" action={<Link href="/admin/bookings?status=pending" className="text-[13px] text-forest underline">View all</Link>}>
          {pending.rows.length ? <ul className="-mx-2">{pending.rows.map((b) => <Row key={b.id} b={b} show="created" />)}</ul> : <Empty>No requests waiting.</Empty>}
        </Panel>
        <Panel title="Arriving in the next 7 days">
          {nextWeek.length ? <ul className="-mx-2">{nextWeek.map((b) => <Row key={b.id} b={b} show="upcoming" />)}</ul> : <Empty>No arrivals in the next week.</Empty>}
        </Panel>
      </div>

      <Panel title="Conversations that need a reply" action={<Link href="/admin/inbox" className="text-[13px] text-forest underline">Open inbox</Link>}>
        {waiting.rows.length ? (
          <ul className="-mx-2">
            {waiting.rows.map((t) => (
              <li key={t.id}>
                <Link href={`/admin/inbox/${t.id}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[3px] px-2 py-2.5 hover:bg-ivory">
                  <span className="min-w-0">
                    <span className={`${t.unread ? "font-semibold" : "font-medium"} text-charcoal`}>{t.guest_name || t.guest_email || "Unknown guest"}</span>
                    <span className="ml-2 text-[13px] text-charcoal-mute">{t.subject}</span>
                    {t.last_snippet && <span className="block truncate text-[13px] text-charcoal-soft">{t.last_snippet}</span>}
                  </span>
                  <span className="flex items-center gap-3 text-[13px] text-charcoal-soft">{dateTime(t.last_message_at)}<KindBadge kind={t.kind} /></span>
                </Link>
              </li>
            ))}
          </ul>
        ) : <Empty>Every conversation has been answered.</Empty>}
      </Panel>
    </div>
  );
}
