import { ROOMS } from "@/lib/rooms";
import type { Booking } from "@/lib/booking/bookings";
import { BOOKING_SOURCES } from "@/lib/booking/validation";
import { adminBtnPrimary, adminInput, adminLabel } from "./ui";

/** Values to start a new booking with, e.g. from an enquiry. */
export interface BookingPrefill {
  roomSlug?: string;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  adults?: number;
  children?: number;
  guestName?: string;
  email?: string;
  phone?: string;
  requests?: string;
  source?: string;
}

interface Props {
  action: (f: FormData) => Promise<void>;
  booking?: Booking;
  prefill?: BookingPrefill;
  /** The conversation this booking is created from; it gets linked. */
  threadId?: string;
  currency: string;
  submitLabel: string;
  isNew?: boolean;
}

function Field({ id, label, children, className = "" }: { id: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={adminLabel}>{label}</label>
      {children}
    </div>
  );
}

export function BookingForm({ action, booking: b, prefill: p = {}, threadId, currency, submitLabel, isNew = false }: Props) {
  return (
    <form action={action} className="grid gap-5">
      {b && <input type="hidden" name="id" value={b.id} />}
      {threadId && <input type="hidden" name="threadId" value={threadId} />}
      <fieldset className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <legend className="mb-3 text-[14px] font-semibold text-charcoal">Stay</legend>
        <Field id="roomSlug" label="Room type" className="sm:col-span-2">
          <select id="roomSlug" name="roomSlug" required defaultValue={b?.room_slug ?? p.roomSlug} className={adminInput}>
            {ROOMS.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
          </select>
        </Field>
        <Field id="checkIn" label="Check-in"><input id="checkIn" name="checkIn" type="date" required defaultValue={b?.check_in ?? p.checkIn} className={adminInput} /></Field>
        <Field id="checkOut" label="Check-out"><input id="checkOut" name="checkOut" type="date" required defaultValue={b?.check_out ?? p.checkOut} className={adminInput} /></Field>
        <Field id="rooms" label="Rooms"><input id="rooms" name="rooms" type="number" min={1} max={20} required defaultValue={b?.rooms ?? p.rooms ?? 1} className={adminInput} /></Field>
        <Field id="adults" label="Adults"><input id="adults" name="adults" type="number" min={1} max={60} required defaultValue={b?.adults ?? p.adults ?? 2} className={adminInput} /></Field>
        <Field id="children" label="Children"><input id="children" name="children" type="number" min={0} max={60} required defaultValue={b?.children ?? p.children ?? 0} className={adminInput} /></Field>
        <Field id="arrivalTime" label="Arrival time"><input id="arrivalTime" name="arrivalTime" defaultValue={b?.arrival_time ?? ""} className={adminInput} /></Field>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <legend className="mb-3 text-[14px] font-semibold text-charcoal">Guest</legend>
        <Field id="guestName" label="Name" className="sm:col-span-2"><input id="guestName" name="guestName" required defaultValue={b?.guest_name ?? p.guestName} className={adminInput} /></Field>
        <Field id="email" label="Email"><input id="email" name="email" type="email" defaultValue={b?.email ?? p.email} className={adminInput} /></Field>
        <Field id="phone" label="Phone or WhatsApp"><input id="phone" name="phone" type="tel" defaultValue={b?.phone ?? p.phone} className={adminInput} /></Field>
        <Field id="country" label="Country"><input id="country" name="country" defaultValue={b?.country ?? ""} className={adminInput} /></Field>
        <Field id="requests" label="Guest requests" className="sm:col-span-2 lg:col-span-3"><textarea id="requests" name="requests" rows={2} defaultValue={b?.requests ?? p.requests ?? ""} className={adminInput} /></Field>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <legend className="mb-3 text-[14px] font-semibold text-charcoal">Price and notes</legend>
        <Field id="quotedTotal" label="Total for the stay"><input id="quotedTotal" name="quotedTotal" type="number" min={0} step="0.01" defaultValue={b?.quoted_total ?? ""} placeholder="Leave blank if not agreed" className={adminInput} /></Field>
        <Field id="currency" label="Currency"><input id="currency" name="currency" maxLength={3} defaultValue={b?.currency ?? currency} className={`${adminInput} uppercase`} /></Field>
        {isNew && (
          <>
            <Field id="source" label="Source">
              <select id="source" name="source" defaultValue={p.source ?? "phone"} className={adminInput}>
                {BOOKING_SOURCES.filter((s) => s !== "website").map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field id="status" label="Status">
              <select id="status" name="status" defaultValue="confirmed" className={adminInput}>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Awaiting confirmation</option>
                <option value="checked_in">Checked in</option>
              </select>
            </Field>
          </>
        )}
        <Field id="internalNotes" label="Internal notes (never shown to the guest)" className="sm:col-span-2 lg:col-span-4"><textarea id="internalNotes" name="internalNotes" rows={2} defaultValue={b?.internal_notes ?? ""} className={adminInput} /></Field>
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--line-soft)] pt-4">
        <label className="flex items-center gap-2 text-[13.5px] text-charcoal-soft">
          <input type="checkbox" name="allowOverbook" className="h-4 w-4 accent-[#9B3B2E]" />
          Allow overbooking (save even if no room is free)
        </label>
        <button type="submit" className={adminBtnPrimary}>{submitLabel}</button>
      </div>
    </form>
  );
}
