import Link from "next/link";
import { getRoom } from "@/lib/rooms";
import { HOTEL_TZ } from "@/lib/booking/config";
import { addDays, todayIn, nights } from "@/lib/booking/dates";
import { dashboardStats, listBookings, type Booking } from "@/lib/booking/bookings";
import { Empty, LinkButton, PageTitle, Panel, StatusBadge, shortDate, dateTime } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

function Row({ b, show }: { b: Booking; show: "arrival" | "departure" | "created" }) {
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
          {show === "created" ? `${shortDate(b.check_in)} to ${shortDate(b.check_out)}, sent ${dateTime(b.created_at)}` : show === "arrival" ? `Leaves ${shortDate(b.check_out)}` : `Arrived ${shortDate(b.check_in)}`}
          <StatusBadge status={b.status} />
        </span>
      </Link>
    </li>
  );
}

export default async function Dashboard() {
  const today = todayIn(HOTEL_TZ);
  const [stats, pending, arrivals, departures, upcoming] = await Promise.all([
    dashboardStats(today),
    listBookings({ status: "pending", sort: "arrival", limit: 20 }),
    listBookings({ status: "active", from: today, to: today, sort: "arrival", limit: 50 }),
    listBookings({ status: "active", from: addDays(today, -60), to: today, sort: "arrival", limit: 200 }),
    listBookings({ status: "active", from: addDays(today, 1), to: addDays(today, 7), sort: "arrival", limit: 50 }),
  ]);
  const arrivingToday = arrivals.rows.filter((b) => b.check_in === today);
  const leavingToday = departures.rows.filter((b) => b.check_out === today);
  const nextWeek = upcoming.rows.filter((b) => b.check_in > today);

  const tiles = [
    { label: "Awaiting confirmation", value: stats.pending, href: "/admin/bookings?status=pending", strong: stats.pending > 0 },
    { label: "Arriving today", value: stats.arrivals, href: `/admin/bookings?status=active&from=${today}&to=${today}` },
    { label: "Leaving today", value: stats.departures, href: "/admin/calendar" },
    { label: "In house", value: stats.inhouse, href: "/admin/bookings?status=checked_in" },
    { label: "Arrivals in next 30 days", value: stats.upcoming, href: "/admin/bookings?status=active&sort=arrival" },
  ];

  return (
    <div>
      <PageTitle title="Dashboard">
        <LinkButton href="/admin/bookings/new" primary>New booking</LinkButton>
        <LinkButton href="/admin/calendar">Calendar</LinkButton>
      </PageTitle>
      <ul className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        {tiles.map((t) => (
          <li key={t.label}>
            <Link href={t.href} className={`block rounded-[4px] border p-4 hover:border-forest ${t.strong ? "border-[#E9C46A] bg-[#FBF3DF]" : "border-[color:var(--line)] bg-white"}`}>
              <span className="block font-display text-[2rem] leading-none text-forest tabular-nums">{t.value}</span>
              <span className="mt-2 block text-[13px] text-charcoal-soft">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Awaiting confirmation" action={<Link href="/admin/bookings?status=pending" className="text-[13px] text-forest underline">View all</Link>}>
          {pending.rows.length ? <ul className="-mx-2">{pending.rows.map((b) => <Row key={b.id} b={b} show="created" />)}</ul> : <Empty>No requests waiting.</Empty>}
        </Panel>
        <div className="grid gap-6">
          <Panel title={`Arriving today, ${shortDate(today)}`}>
            {arrivingToday.length ? <ul className="-mx-2">{arrivingToday.map((b) => <Row key={b.id} b={b} show="arrival" />)}</ul> : <Empty>No arrivals today.</Empty>}
          </Panel>
          <Panel title="Leaving today">
            {leavingToday.length ? <ul className="-mx-2">{leavingToday.map((b) => <Row key={b.id} b={b} show="departure" />)}</ul> : <Empty>No departures today.</Empty>}
          </Panel>
          <Panel title="Arriving in the next 7 days">
            {nextWeek.length ? <ul className="-mx-2">{nextWeek.map((b) => <Row key={b.id} b={b} show="arrival" />)}</ul> : <Empty>No arrivals in the next week.</Empty>}
          </Panel>
        </div>
      </div>
    </div>
  );
}
