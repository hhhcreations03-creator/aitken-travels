import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoom } from "@/lib/rooms";
import { SITE } from "@/lib/site";
import { addNote, changeStatus, editBooking } from "../../../actions";
import { BookingForm } from "@/components/admin/BookingForm";
import { PageTitle, Panel, StatusBadge, adminBtn, adminBtnDanger, adminBtnOutline, adminBtnPrimary, adminInput, dateTime, money } from "@/components/admin/ui";
import { TRANSITIONS, bookingEvents, getBookingById } from "@/lib/booking/bookings";
import { formatDate, nights } from "@/lib/booking/dates";
import { STATUS_LABELS, type BookingStatus } from "@/lib/booking/validation";
import { emailConfigured } from "@/lib/booking/config";
import { getSettings } from "@/lib/booking/settings";

export const dynamic = "force-dynamic";

const ACTION_LABEL: Partial<Record<BookingStatus, string>> = {
  confirmed: "Confirm booking",
  declined: "Decline request",
  cancelled: "Cancel booking",
  checked_in: "Check in",
  completed: "Check out",
  pending: "Move back to awaiting confirmation",
};
const NOTIFIES: BookingStatus[] = ["confirmed", "declined", "cancelled"];

function waLink(phone: string, text: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return digits.length >= 8 ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : null;
}

export default async function BookingDetail({ params, searchParams }: { params: { id: string }; searchParams: { edit?: string } }) {
  const b = await getBookingById(params.id);
  if (!b) notFound();
  const [events, settings] = await Promise.all([bookingEvents(b.id), getSettings()]);
  const room = getRoom(b.room_slug);
  const n = nights(b.check_in, b.check_out);
  const canEmail = emailConfigured();
  const confirmText = `Hello ${b.guest_name.split(" ")[0]}, this is The Lavish Haven about your booking ${b.ref} (${formatDate(b.check_in)} to ${formatDate(b.check_out)}, ${room?.name ?? b.room_slug}). `;
  const wa = b.phone ? waLink(b.phone, confirmText) : null;

  return (
    <div>
      <p className="mb-2 text-[13px]"><Link href="/admin/bookings" className="text-forest underline">All bookings</Link></p>
      <PageTitle title={`${b.ref}, ${b.guest_name}`}>
        <StatusBadge status={b.status} />
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-6">
          <Panel title="Stay">
            <dl className="grid gap-x-6 gap-y-4 text-[14px] sm:grid-cols-3">
              <div className="sm:col-span-3"><dt className="text-[12.5px] text-charcoal-mute">Room</dt><dd>{room?.name ?? b.room_slug}{b.rooms > 1 ? `, ${b.rooms} rooms` : ""}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Check-in</dt><dd>{formatDate(b.check_in)}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Check-out</dt><dd>{formatDate(b.check_out)}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Nights</dt><dd>{n}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Guests</dt><dd>{b.adults} adult{b.adults === 1 ? "" : "s"}{b.children ? `, ${b.children} child${b.children === 1 ? "" : "ren"}` : ""}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Arrival time</dt><dd>{b.arrival_time || "–"}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Total</dt><dd>{money(b.quoted_total, b.currency)}</dd></div>
              <div className="sm:col-span-3"><dt className="text-[12.5px] text-charcoal-mute">Guest requests</dt><dd className="whitespace-pre-wrap">{b.requests || "–"}</dd></div>
              {b.internal_notes && <div className="sm:col-span-3"><dt className="text-[12.5px] text-charcoal-mute">Internal notes</dt><dd className="whitespace-pre-wrap">{b.internal_notes}</dd></div>}
            </dl>
          </Panel>

          <details open={searchParams.edit === "1"} className="rounded-[4px] border border-[color:var(--line)] bg-white">
            <summary className="cursor-pointer px-5 py-3.5 text-[15px] font-semibold text-charcoal">Edit booking</summary>
            <div className="border-t border-[color:var(--line-soft)] p-5">
              <BookingForm action={editBooking} booking={b} currency={settings.currency} submitLabel="Save changes" />
            </div>
          </details>

          <Panel title="Activity">
            <form action={addNote} className="mb-4 flex gap-2">
              <input type="hidden" name="id" value={b.id} />
              <label htmlFor="note" className="sr-only">Add a note</label>
              <input id="note" name="note" placeholder="Add a note, for example: called guest, deposit received" className={adminInput} />
              <button className={adminBtnOutline}>Add</button>
            </form>
            <ol className="grid gap-3 text-[13.5px]">
              {events.map((e, i) => (
                <li key={i} className="border-l-2 border-[color:var(--line)] pl-3">
                  <p><span className="font-medium text-charcoal">{e.action}</span> <span className="text-charcoal-mute">by {e.actor}, {dateTime(e.at)}</span></p>
                  {e.detail && <p className="whitespace-pre-wrap text-charcoal-soft">{e.detail}</p>}
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="grid h-fit gap-6">
          <Panel title="Status">
            <p className="mb-4 text-[14px] text-charcoal-soft">Currently <strong className="text-charcoal">{STATUS_LABELS[b.status]}</strong>.</p>
            <div className="grid gap-3">
              {TRANSITIONS[b.status].map((to) => (
                <form key={to} action={changeStatus} className="grid gap-2 rounded-[3px] border border-[color:var(--line-soft)] p-3">
                  <input type="hidden" name="id" value={b.id} />
                  <input type="hidden" name="to" value={to} />
                  {NOTIFIES.includes(to) && (
                    <>
                      <label htmlFor={`msg-${to}`} className="sr-only">Message to guest</label>
                      <textarea id={`msg-${to}`} name="message" rows={2} placeholder={to === "confirmed" ? "Optional message, for example the confirmed rate or payment details" : "Optional message to the guest"} className={adminInput} />
                      <label className="flex items-center gap-2 text-[13px] text-charcoal-soft">
                        <input type="checkbox" name="notify" defaultChecked={canEmail} disabled={!canEmail} className="h-4 w-4 accent-[#1E3A2F]" />
                        {canEmail ? "Email the guest" : "Email isn't set up; contact the guest below"}
                      </label>
                    </>
                  )}
                  <button className={to === "cancelled" || to === "declined" ? adminBtnDanger : to === "pending" ? adminBtnOutline : adminBtnPrimary}>{ACTION_LABEL[to]}</button>
                </form>
              ))}
            </div>
          </Panel>

          <Panel title="Guest">
            <dl className="grid gap-3 text-[14px]">
              <div><dt className="text-[12.5px] text-charcoal-mute">Name</dt><dd>{b.guest_name}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Email</dt><dd>{b.email ? <a className="text-forest underline" href={`mailto:${b.email}?subject=${encodeURIComponent(`Your booking ${b.ref} at The Lavish Haven`)}`}>{b.email}</a> : "–"}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Phone</dt><dd>{b.phone ? <a className="text-forest underline" href={`tel:${b.phone.replace(/[^\d+]/g, "")}`}>{b.phone}</a> : "–"}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Country</dt><dd>{b.country || "–"}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Source</dt><dd>{b.source}</dd></div>
              <div><dt className="text-[12.5px] text-charcoal-mute">Received</dt><dd>{dateTime(b.created_at)}</dd></div>
            </dl>
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className={`${adminBtn} mt-4 w-full bg-whatsapp text-white hover:bg-[#188247]`}>WhatsApp the guest</a>}
            <p className="mt-3 text-[12.5px] text-charcoal-mute">Guests can view and cancel their booking from the link in their confirmation email at {SITE.url.replace("https://", "")}/booking/{b.ref}.</p>
          </Panel>
        </div>
      </div>
    </div>
  );
}

