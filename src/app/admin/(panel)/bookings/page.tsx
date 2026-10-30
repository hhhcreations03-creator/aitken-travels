import Link from "next/link";
import { getRoom } from "@/lib/rooms";
import { listBookings } from "@/lib/booking/bookings";
import { emailConfigured } from "@/lib/booking/config";
import { changeStatus } from "@/app/admin/actions";
import { nights } from "@/lib/booking/dates";
import { BOOKING_STATUSES, STATUS_LABELS } from "@/lib/booking/validation";
import { Empty, LinkButton, PageTitle, StatusBadge, adminBtnOutline, adminBtnPrimary, adminInput, adminLabel, money, shortDate, dateTime } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
const PAGE = 50;

export default async function BookingsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const filter = {
    status: searchParams.status || undefined,
    q: searchParams.q || undefined,
    from: searchParams.from || undefined,
    to: searchParams.to || undefined,
    sort: (searchParams.sort === "arrival" ? "arrival" : "created") as "arrival" | "created",
  };
  const { rows, total } = await listBookings({ ...filter, limit: PAGE, offset: (page - 1) * PAGE });
  const qs = (extra: Record<string, string | number>) => {
    const p = new URLSearchParams();
    Object.entries({ ...filter, ...extra }).forEach(([k, v]) => v !== undefined && v !== "" && p.set(k, String(v)));
    return `?${p}`;
  };
  const canEmail = emailConfigured();
  const tabs = [{ v: "", l: "All" }, { v: "active", l: "Active" }, ...BOOKING_STATUSES.map((s) => ({ v: s, l: STATUS_LABELS[s] }))];

  return (
    <div>
      <PageTitle title="Bookings">
        <a href={`/admin/export${qs({})}`} className={adminBtnOutline}>Export CSV</a>
        <LinkButton href="/admin/bookings/new" primary>New booking</LinkButton>
      </PageTitle>

      <nav aria-label="Filter by status" className="mb-4 flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <Link key={t.v} href={qs({ status: t.v, page: 1 })} aria-current={(filter.status ?? "") === t.v ? "true" : undefined}
            className={`rounded-full border px-3 py-1 text-[13px] ${(filter.status ?? "") === t.v ? "border-forest bg-forest text-ivory" : "border-[color:var(--line)] bg-white text-charcoal-soft hover:border-forest"}`}>
            {t.l}
          </Link>
        ))}
      </nav>

      <details className="group mb-6 rounded-[4px] border border-[color:var(--line)] bg-white md:hidden" open={Boolean(filter.q || filter.from || filter.to)}>
        <summary className="flex min-h-[44px] cursor-pointer items-center justify-between px-4 text-[14px] font-medium text-charcoal">
          Search and filter
          <span aria-hidden="true" className="text-charcoal-mute transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="border-t border-[color:var(--line-soft)] p-4">
          <Filters filter={filter} idPrefix="m-" />
        </div>
      </details>
      <div className="mb-6 hidden rounded-[4px] border border-[color:var(--line)] bg-white p-4 md:block">
        <Filters filter={filter} idPrefix="d-" />
      </div>

      {rows.length > 0 && (
        <ul className="grid gap-3 md:hidden">
          {rows.map((b) => (
            <li key={b.id} className="rounded-[4px] border border-[color:var(--line)] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/admin/bookings/${b.id}`} className="block truncate text-[15px] font-medium text-charcoal underline-offset-2 hover:underline">{b.guest_name}</Link>
                  <p className="text-[12.5px] text-charcoal-mute">{b.ref}, {b.source}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <p className="mt-3 text-[14px] text-charcoal">{getRoom(b.room_slug)?.shortName ?? b.room_slug}{b.rooms > 1 ? ` x${b.rooms}` : ""}</p>
              <p className="text-[13.5px] text-charcoal-soft">
                {shortDate(b.check_in)} to {shortDate(b.check_out)}, {nights(b.check_in, b.check_out)} nights, {b.adults}{b.children ? ` + ${b.children}` : ""} guests
              </p>
              <p className="mt-1 text-[12.5px] text-charcoal-mute">Received {dateTime(b.created_at)}{b.quoted_total != null ? `, ${money(b.quoted_total, b.currency)}` : ""}</p>
              <div className="mt-3 flex gap-2">
                {b.status === "pending" && (
                  <form action={changeStatus} className="flex-1">
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="to" value="confirmed" />
                    {canEmail && b.email && <input type="hidden" name="notify" value="on" />}
                    <button className={`${adminBtnPrimary} w-full`} aria-label={`Confirm booking ${b.ref}${canEmail && b.email ? " and email the guest" : ""}`}>Confirm</button>
                  </form>
                )}
                <Link href={`/admin/bookings/${b.id}`} className={`${adminBtnOutline} flex-1`} aria-label={`Open booking ${b.ref}`}>{b.status === "pending" ? "Review" : "Open"}</Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={`relative overflow-x-auto rounded-[4px] border border-[color:var(--line)] bg-white ${rows.length ? "hidden md:block" : ""}`}>
        {rows.length ? (
          <table className="w-full min-w-[980px] text-left text-[13.5px]">
            <thead className="border-b border-[color:var(--line)] bg-[#FAF8F4] text-[12.5px] text-charcoal-soft">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Reference</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Guest</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Room</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Stay</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Guests</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Total</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Received</th>
                <th scope="col" className="px-4 py-2.5 font-medium"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.id} className="border-b border-[color:var(--line-soft)] last:border-0 hover:bg-ivory/60">
                  <td className="px-4 py-3"><Link href={`/admin/bookings/${b.id}`} className="font-medium text-forest underline-offset-2 hover:underline">{b.ref}</Link></td>
                  <td className="px-4 py-3"><Link href={`/admin/bookings/${b.id}`} className="text-charcoal underline-offset-2 hover:underline">{b.guest_name}</Link><span className="block text-[12.5px] text-charcoal-mute">{b.source}</span></td>
                  <td className="px-4 py-3">{getRoom(b.room_slug)?.shortName ?? b.room_slug}{b.rooms > 1 ? ` x${b.rooms}` : ""}</td>
                  <td className="whitespace-nowrap px-4 py-3">{shortDate(b.check_in)} to {shortDate(b.check_out)}<span className="block text-[12.5px] text-charcoal-mute">{nights(b.check_in, b.check_out)} nights</span></td>
                  <td className="px-4 py-3 tabular-nums">{b.adults}{b.children ? ` + ${b.children}` : ""}</td>
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums">{money(b.quoted_total, b.currency)}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-charcoal-soft">{dateTime(b.created_at)}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="flex justify-end gap-2">
                      {b.status === "pending" && (
                        <form action={changeStatus}>
                          <input type="hidden" name="id" value={b.id} />
                          <input type="hidden" name="to" value="confirmed" />
                          {canEmail && b.email && <input type="hidden" name="notify" value="on" />}
                          <button className={adminBtnPrimary} aria-label={`Confirm booking ${b.ref}${canEmail && b.email ? " and email the guest" : ""}`}>Confirm</button>
                        </form>
                      )}
                      <Link href={`/admin/bookings/${b.id}`} className={adminBtnOutline} aria-label={`Open booking ${b.ref}`}>{b.status === "pending" ? "Review" : "Open"}</Link>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty>No bookings match these filters.</Empty>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-[13px] text-charcoal-soft">
        <span>{total} booking{total === 1 ? "" : "s"}</span>
        <span className="flex gap-2">
          {page > 1 && <Link href={qs({ page: page - 1 })} className={adminBtnOutline}>Previous</Link>}
          {page * PAGE < total && <Link href={qs({ page: page + 1 })} className={adminBtnOutline}>Next</Link>}
        </span>
      </div>
    </div>
  );
}

function Filters({ filter, idPrefix }: { idPrefix: string; filter: { status?: string; q?: string; from?: string; to?: string; sort: "arrival" | "created" } }) {
  return (
    <form className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] sm:items-end" role="search">
        {filter.status && <input type="hidden" name="status" value={filter.status} />}
        <div><label htmlFor={`${idPrefix}q`} className={adminLabel}>Search</label><input id={`${idPrefix}q`} name="q" defaultValue={filter.q} placeholder="Name, email, phone or reference" className={adminInput} /></div>
        <div><label htmlFor={`${idPrefix}from`} className={adminLabel}>Staying from</label><input id={`${idPrefix}from`} name="from" type="date" defaultValue={filter.from} className={adminInput} /></div>
        <div><label htmlFor={`${idPrefix}to`} className={adminLabel}>Staying until</label><input id={`${idPrefix}to`} name="to" type="date" defaultValue={filter.to} className={adminInput} /></div>
        <div><label htmlFor={`${idPrefix}sort`} className={adminLabel}>Sort by</label>
          <select id={`${idPrefix}sort`} name="sort" defaultValue={filter.sort} className={adminInput}><option value="created">Newest first</option><option value="arrival">Arrival date</option></select>
        </div>
        <div className="flex gap-2"><button className={adminBtnPrimary}>Apply</button><Link href="/admin/bookings" className={adminBtnOutline}>Clear</Link></div>
    </form>
  );
}
