import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoom } from "@/lib/rooms";
import { emailConfigured } from "@/lib/booking/config";
import { getBookingById } from "@/lib/booking/bookings";
import { nights } from "@/lib/booking/dates";
import { db } from "@/lib/booking/db";
import { getThread, markRead, threadMessages, KIND_LABELS } from "@/lib/inbox/threads";
import { updateThread } from "@/app/admin/actions";
import { Panel, StatusBadge, adminBtn, adminBtnDanger, adminBtnOutline, adminBtnPrimary, dateTime, shortDate } from "@/components/admin/ui";
import { Conversation, KindBadge } from "@/components/admin/inbox/Conversation";
import { ReplyBox } from "@/components/admin/inbox/ReplyBox";

export const dynamic = "force-dynamic";

function waLink(phone: string, text: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length >= 8 ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : null;
}

function StateButton({ threadId, action, children, danger = false }: { threadId: string; action: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <form action={updateThread}>
      <input type="hidden" name="threadId" value={threadId} />
      <input type="hidden" name="do" value={action} />
      <button className={`${danger ? adminBtnDanger : adminBtnOutline} w-full`}>{children}</button>
    </form>
  );
}

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const thread = await getThread(params.id);
  if (!thread) notFound();
  const [messages, booking] = await Promise.all([threadMessages(thread.id), thread.booking_id ? getBookingById(thread.booking_id) : null]);
  if (thread.unread) await markRead(thread.id);

  const d = await db();
  const others = thread.guest_email
    ? await d.query<{ id: string; subject: string; ref: string; kind: string; last_message_at: string }>(
        `SELECT id, subject, ref, kind, last_message_at::text AS last_message_at FROM threads
          WHERE lower(guest_email) = lower($1) AND id <> $2 AND status <> 'spam' ORDER BY last_message_at DESC LIMIT 8`,
        [thread.guest_email, thread.id]
      )
    : [];

  const first = thread.guest_name?.split(" ")[0] ?? "";
  const wa = thread.guest_phone ? waLink(thread.guest_phone, `Hello${first ? ` ${first}` : ""}, this is The Lavish Haven about your enquiry ${thread.ref}. `) : null;

  return (
    <div>
      <p className="mb-2 text-[13px]"><Link href="/admin/inbox" className="text-forest underline">Inbox</Link></p>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-[1.75rem] leading-tight text-forest">{thread.subject}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-[13.5px] text-charcoal-soft">
            <KindBadge kind={thread.kind} />
            <span>{thread.ref}</span>
            <span>Started {dateTime(thread.created_at)}</span>
            {thread.status === "closed" && <span className="rounded-full border border-[color:var(--line)] px-2 py-0.5 text-[12px]">Closed</span>}
            {thread.status === "spam" && <span className="rounded-full border border-[#9B3B2E]/40 px-2 py-0.5 text-[12px] text-[#7A2E24]">Spam</span>}
            {thread.status === "open" && thread.needs_reply && <span className="rounded-full border border-[#E9C46A] px-2 py-0.5 text-[12px] font-medium text-[#6B4A0E]">Needs reply</span>}
            {thread.status === "open" && !thread.needs_reply && <span className="rounded-full border border-[color:var(--line)] px-2 py-0.5 text-[12px]">Waiting on guest</span>}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid min-w-0 gap-6">
          <Conversation thread={thread} messages={messages} />
          {thread.status !== "spam" && (
            <ReplyBox threadId={thread.id} subject={thread.subject} guestName={thread.guest_name} guestEmail={thread.guest_email} canEmail={emailConfigured()} />
          )}
        </div>

        <aside className="grid h-fit gap-6">
          <Panel title="Guest">
            <dl className="grid gap-3 text-[14px]">
              <div><dt className="text-[12.5px] text-charcoal-mute">Name</dt><dd>{thread.guest_name || "–"}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Email</dt><dd className="break-all">{thread.guest_email ? <a className="text-forest underline" href={`mailto:${thread.guest_email}`}>{thread.guest_email}</a> : "–"}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Phone</dt><dd>{thread.guest_phone ? <a className="text-forest underline" href={`tel:${thread.guest_phone.replace(/[^\d+]/g, "")}`}>{thread.guest_phone}</a> : "–"}</dd></div>
            </dl>
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className={`${adminBtn} mt-4 w-full bg-whatsapp text-white hover:bg-[#188247]`}>Open WhatsApp chat</a>}
          </Panel>

          {booking ? (
            <Panel title="Booking">
              <p className="flex flex-wrap items-center gap-2 text-[14px]"><span className="font-medium">{booking.ref}</span><StatusBadge status={booking.status} /></p>
              <p className="mt-2 text-[14px] text-charcoal">{getRoom(booking.room_slug)?.name ?? booking.room_slug}{booking.rooms > 1 ? `, ${booking.rooms} rooms` : ""}</p>
              <p className="text-[13.5px] text-charcoal-soft">{shortDate(booking.check_in)} to {shortDate(booking.check_out)}, {nights(booking.check_in, booking.check_out)} nights, {booking.adults + booking.children} guests</p>
              <Link href={`/admin/bookings/${booking.id}`} className={`${adminBtnPrimary} mt-4 w-full`}>Open booking</Link>
            </Panel>
          ) : thread.status !== "spam" ? (
            <Panel title="Booking">
              <p className="text-[13.5px] text-charcoal-soft">No booking yet. When the guest agrees dates and a room, create the booking from here and it stays linked to this conversation.</p>
              <Link href={`/admin/bookings/new?thread=${thread.id}`} className={`${adminBtnPrimary} mt-4 w-full`}>Create booking</Link>
            </Panel>
          ) : null}

          {thread.details && thread.details.length > 0 && (
            <Panel title={`${KIND_LABELS[thread.kind]} details`}>
              <dl className="grid gap-2.5 text-[13.5px]">
                {thread.details.map(([k, v]) => (
                  <div key={k}><dt className="text-[12.5px] text-charcoal-mute">{k}</dt><dd className="whitespace-pre-wrap break-words">{v}</dd></div>
                ))}
              </dl>
            </Panel>
          )}

          <Panel title="Conversation">
            <div className="grid gap-2">
              {thread.status === "open" && (thread.needs_reply
                ? <StateButton threadId={thread.id} action="answered">Mark as answered</StateButton>
                : <StateButton threadId={thread.id} action="needs_reply">Mark as needing a reply</StateButton>)}
              {thread.status === "open" ? <StateButton threadId={thread.id} action="close">Close</StateButton> : <StateButton threadId={thread.id} action="reopen">Reopen</StateButton>}
              <StateButton threadId={thread.id} action="unread">Mark as unread</StateButton>
              {thread.status !== "spam" && thread.kind !== "booking" && <StateButton threadId={thread.id} action="spam" danger>Mark as spam</StateButton>}
            </div>
          </Panel>

          {others.length > 0 && (
            <Panel title="Other conversations with this guest">
              <ul className="grid gap-2 text-[13.5px]">
                {others.map((o) => (
                  <li key={o.id}><Link href={`/admin/inbox/${o.id}`} className="text-forest underline">{o.subject}</Link><span className="block text-[12.5px] text-charcoal-mute">{o.ref}, {dateTime(o.last_message_at)}</span></li>
                ))}
              </ul>
            </Panel>
          )}
        </aside>
      </div>
    </div>
  );
}
