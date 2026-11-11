import Link from "next/link";
import { KIND_LABELS, inboxCounts, listThreads, type InboxView } from "@/lib/inbox/threads";
import { checkMailNow } from "@/app/admin/actions";
import { Empty, PageTitle, StatusBadge, adminBtnOutline, adminBtnPrimary, adminInput, dateTime } from "@/components/admin/ui";
import { KindBadge } from "@/components/admin/inbox/Conversation";
import { MailSync } from "@/components/admin/inbox/MailSync";
import type { BookingStatus } from "@/lib/booking/validation";

export const dynamic = "force-dynamic";
const PAGE = 50;

const VIEWS: Array<{ v: InboxView; l: string }> = [
  { v: "needs_reply", l: "Needs reply" },
  { v: "waiting", l: "Waiting on guest" },
  { v: "open", l: "All open" },
  { v: "closed", l: "Closed" },
  { v: "spam", l: "Spam" },
  { v: "all", l: "Everything" },
];

export default async function InboxPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const view = (VIEWS.some((x) => x.v === searchParams.view) ? searchParams.view : "needs_reply") as InboxView;
  const kind = searchParams.kind && searchParams.kind in KIND_LABELS ? searchParams.kind : undefined;
  const q = searchParams.q?.trim() || undefined;
  const page = Math.max(1, Number(searchParams.page) || 1);
  const [{ rows, total }, counts] = await Promise.all([
    listThreads({ view: q ? "all" : view, kind, q, limit: PAGE, offset: (page - 1) * PAGE }),
    inboxCounts(),
  ]);
  const qs = (extra: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    Object.entries({ view, kind, q, ...extra }).forEach(([k, v]) => v !== undefined && v !== "" && p.set(k, String(v)));
    return `?${p}`;
  };

  return (
    <div>
      <PageTitle title="Inbox">
        <form action={checkMailNow}><button className={adminBtnOutline}>Check mail now</button></form>
      </PageTitle>
      <div className="-mt-5 mb-6"><MailSync /></div>

      <nav aria-label="Inbox views" className="mb-3 flex flex-wrap gap-1.5">
        {VIEWS.map((t) => (
          <Link key={t.v} href={qs({ view: t.v, page: undefined, q: undefined })} aria-current={!q && view === t.v ? "true" : undefined}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] ${!q && view === t.v ? "border-forest bg-forest text-ivory" : "border-[color:var(--line)] bg-white text-charcoal-soft hover:border-forest"}`}>
            {t.l}
            {t.v === "needs_reply" && counts.needsReply > 0 && <span className={`rounded-full px-1.5 text-[11.5px] font-semibold ${!q && view === t.v ? "bg-ivory text-forest" : "bg-[#E9C46A] text-forest-deep"}`}>{counts.needsReply}</span>}
          </Link>
        ))}
      </nav>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <nav aria-label="Filter by type" className="flex flex-wrap gap-1.5 text-[12.5px]">
          <Link href={qs({ kind: undefined, page: undefined })} className={`rounded-[3px] border px-2.5 py-1 ${!kind ? "border-forest text-forest" : "border-[color:var(--line)] text-charcoal-soft"}`}>All types</Link>
          {Object.entries(KIND_LABELS).map(([k, l]) => (
            <Link key={k} href={qs({ kind: k, page: undefined })} className={`rounded-[3px] border px-2.5 py-1 ${kind === k ? "border-forest text-forest" : "border-[color:var(--line)] text-charcoal-soft"}`}>{l}</Link>
          ))}
        </nav>
        <form role="search" className="ml-auto flex w-full gap-2 sm:w-auto">
          {kind && <input type="hidden" name="kind" value={kind} />}
          <label htmlFor="inbox-q" className="sr-only">Search conversations</label>
          <input id="inbox-q" name="q" defaultValue={q} placeholder="Name, email, reference or words" className={`${adminInput} sm:w-72`} />
          <button className={adminBtnPrimary}>Search</button>
        </form>
      </div>

      {q && <p className="mb-3 text-[13.5px] text-charcoal-soft">Results for &ldquo;{q}&rdquo; across all conversations. <Link href={qs({ q: undefined })} className="text-forest underline">Clear search</Link></p>}

      <div className="overflow-hidden rounded-[4px] border border-[color:var(--line)] bg-white">
        {rows.length ? (
          <ul>
            {rows.map((t) => (
              <li key={t.id} className="border-b border-[color:var(--line-soft)] last:border-0">
                <Link href={`/admin/inbox/${t.id}`} className={`grid gap-1 px-4 py-3.5 hover:bg-ivory/60 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4 ${t.unread ? "bg-[#FBF8F1]" : ""}`}>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      {t.unread && <span className="h-2 w-2 rounded-full bg-forest" aria-label="Unread" />}
                      <span className={`truncate text-[14.5px] ${t.unread ? "font-semibold text-charcoal" : "font-medium text-charcoal"}`}>{t.guest_name || t.guest_email || "Unknown guest"}</span>
                      <KindBadge kind={t.kind} />
                      {t.booking_ref && t.booking_status && <StatusBadge status={t.booking_status as BookingStatus} />}
                      {t.status === "open" && t.needs_reply && <span className="rounded-full border border-[#E9C46A] px-2 py-0.5 text-[11.5px] font-medium text-[#6B4A0E]">Needs reply</span>}
                      {t.status === "closed" && <span className="rounded-full border border-[color:var(--line)] px-2 py-0.5 text-[11.5px] text-charcoal-mute">Closed</span>}
                    </span>
                    <span className="mt-0.5 block truncate text-[13.5px] text-charcoal">{t.subject} <span className="text-charcoal-mute">{t.booking_ref && t.booking_ref !== t.ref ? `${t.ref}, booking ${t.booking_ref}` : t.ref}</span></span>
                    {t.last_snippet && <span className="block truncate text-[13px] text-charcoal-soft">{t.last_snippet}</span>}
                  </span>
                  <span className="whitespace-nowrap text-[12.5px] text-charcoal-mute sm:text-right">{dateTime(t.last_message_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>{q ? "No conversations match that search." : view === "needs_reply" ? "Nothing needs a reply. Nicely done." : "No conversations here."}</Empty>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between text-[13px] text-charcoal-soft">
        <span>{total} conversation{total === 1 ? "" : "s"}</span>
        <span className="flex gap-2">
          {page > 1 && <Link href={qs({ page: page - 1 })} className={adminBtnOutline}>Previous</Link>}
          {page * PAGE < total && <Link href={qs({ page: page + 1 })} className={adminBtnOutline}>Next</Link>}
        </span>
      </div>
    </div>
  );
}
