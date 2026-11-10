import Link from "next/link";
import { createManualBooking } from "../../../actions";
import { BookingForm, type BookingPrefill } from "@/components/admin/BookingForm";
import { PageTitle, Panel } from "@/components/admin/ui";
import { getSettings } from "@/lib/booking/settings";
import { getThread, type Thread } from "@/lib/inbox/threads";
import { ROOMS } from "@/lib/rooms";

export const dynamic = "force-dynamic";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Tue, 18 Nov 2026" or "2026-11-18" (as the website forms write dates) to "2026-11-18". */
function isoFrom(text: string | undefined): string | undefined {
  if (!text) return undefined;
  const iso = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (iso) return iso[0];
  const m = text.match(/\b(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})\b/);
  if (!m) return undefined;
  const month = MONTHS.indexOf(m[2].toLowerCase());
  return month < 0 ? undefined : `${m[3]}-${String(month + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

/** What an enquiry already tells us about the stay, so the team doesn't retype it. */
function prefillFrom(t: Thread): BookingPrefill {
  const get = (...labels: string[]) => t.details?.find(([k]) => labels.some((l) => k.toLowerCase() === l.toLowerCase()))?.[1];
  const count = (v: string | undefined) => (v && /^\d+$/.test(v.trim()) ? Number(v.trim()) : undefined);
  const roomName = get("Room");
  return {
    guestName: t.guest_name ?? undefined,
    email: t.guest_email ?? undefined,
    phone: t.guest_phone ?? undefined,
    roomSlug: ROOMS.find((r) => r.name === roomName)?.slug,
    checkIn: isoFrom(get("Check-in", "Preferred check-in")),
    checkOut: isoFrom(get("Check-out", "Preferred check-out")),
    adults: count(get("Adults", "Estimated guests", "Group size")),
    children: count(get("Children")),
    rooms: count(get("Rooms", "Rooms required")),
    requests: get("Requests", "Additional requirements", "Accommodation requirements"),
    source: "email",
  };
}

export default async function NewBookingPage({ searchParams }: { searchParams: { thread?: string } }) {
  const [settings, thread] = await Promise.all([getSettings(), searchParams.thread ? getThread(searchParams.thread) : null]);
  return (
    <div className="max-w-[1000px]">
      <PageTitle title="New booking" />
      {thread ? (
        <p className="mb-6 max-w-[70ch] text-[14px] text-charcoal-soft">
          From the conversation <Link href={`/admin/inbox/${thread.id}`} className="text-forest underline">{thread.subject}</Link> ({thread.ref}). What the guest told us is filled in; check it before saving. The booking stays linked to that conversation.
        </p>
      ) : (
        <p className="mb-6 max-w-[60ch] text-[14px] text-charcoal-soft">
          Add bookings taken by phone, WhatsApp, email or at the desk, and bookings from Booking.com, so the website never offers the same room twice.
        </p>
      )}
      <Panel>
        <BookingForm action={createManualBooking} currency={settings.currency} submitLabel="Create booking" isNew threadId={thread?.id} prefill={thread ? prefillFrom(thread) : undefined} />
      </Panel>
    </div>
  );
}
