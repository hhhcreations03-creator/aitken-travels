import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { GuestCancel } from "@/components/booking/GuestCancel";
import { getRoom } from "@/lib/rooms";
import { SITE, whatsappUrl } from "@/lib/site";
import { bookingConfigured, HOTEL_TZ } from "@/lib/booking/config";
import { getBookingForGuest } from "@/lib/booking/bookings";
import { formatDate, nights, todayIn } from "@/lib/booking/dates";
import { STATUS_LABELS } from "@/lib/booking/validation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your booking", robots: { index: false, follow: false } };

const STATUS_COPY: Record<string, string> = {
  pending: "We're holding your room while the team confirms availability and your rate. You'll hear from us by email or WhatsApp, usually within 24 hours.",
  confirmed: "Your stay is confirmed. We look forward to welcoming you.",
  checked_in: "You're checked in. Enjoy your stay.",
  completed: "Thank you for staying with us.",
  cancelled: "This booking has been cancelled.",
  declined: "We couldn't confirm this request. Please contact us and we'll help find other dates or rooms.",
};

export default async function GuestBookingPage({ params, searchParams }: { params: { ref: string }; searchParams: { t?: string } }) {
  const booking = bookingConfigured() && searchParams.t ? await getBookingForGuest(params.ref, searchParams.t).catch(() => null) : null;

  return (
    <>
      <Header />
      <main id="main" className="pt-[72px] lg:pt-[84px]">
        <Section>
          {!booking ? (
            <div className="max-w-[40rem]">
              <h1 className="display-lg text-forest">Booking not found</h1>
              <p className="lede mt-4">Use the full link from your confirmation email. For help, contact us with your reference.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={whatsappUrl(`Hello The Lavish Haven, I'd like to check on my booking ${params.ref}.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">WhatsApp the hotel</a>
                <Link href="/" className="btn-outline">Back to the homepage</Link>
              </div>
            </div>
          ) : (
            <BookingView booking={booking} token={searchParams.t!} />
          )}
        </Section>
      </main>
    </>
  );
}

function BookingView({ booking, token }: { booking: NonNullable<Awaited<ReturnType<typeof getBookingForGuest>>>; token: string }) {
  const room = getRoom(booking.room_slug);
  const n = nights(booking.check_in, booking.check_out);
  const canCancel = ["pending", "confirmed"].includes(booking.status) && booking.check_in > todayIn(HOTEL_TZ);
  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="text-[15px] text-charcoal-soft">Booking {booking.ref}</p>
        <h1 className="display-lg mt-1 text-forest">{STATUS_LABELS[booking.status]}</h1>
        <p className="lede mt-4">{STATUS_COPY[booking.status]}</p>
        <dl className="rule mt-8 grid gap-y-4 pt-6 sm:grid-cols-2">
          <div><dt className="small text-charcoal-mute">Room</dt><dd className="mt-1">{room?.name ?? booking.room_slug}{booking.rooms > 1 ? ` (x${booking.rooms})` : ""}</dd></div>
          <div><dt className="small text-charcoal-mute">Guest</dt><dd className="mt-1">{booking.guest_name}</dd></div>
          <div><dt className="small text-charcoal-mute">Check-in</dt><dd className="mt-1">{formatDate(booking.check_in)}, from {SITE.checkIn}</dd></div>
          <div><dt className="small text-charcoal-mute">Check-out</dt><dd className="mt-1">{formatDate(booking.check_out)}</dd></div>
          <div><dt className="small text-charcoal-mute">Stay</dt><dd className="mt-1">{n} night{n === 1 ? "" : "s"}, {booking.adults} adult{booking.adults === 1 ? "" : "s"}{booking.children ? `, ${booking.children} child${booking.children === 1 ? "" : "ren"}` : ""}</dd></div>
          <div><dt className="small text-charcoal-mute">{booking.status === "confirmed" ? "Total" : "Estimated total"}</dt><dd className="mt-1">{booking.quoted_total !== null ? `${booking.currency} ${booking.quoted_total.toFixed(2)}` : "Confirmed by the hotel"}</dd></div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={whatsappUrl(`Hello The Lavish Haven, this is about my booking ${booking.ref}.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">Message the hotel</a>
          <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Booking ${booking.ref}`)}`} className="btn-outline">Email the hotel</a>
        </div>
        {canCancel && (
          <div className="mt-10">
            <GuestCancel bookingRef={booking.ref} token={token} />
          </div>
        )}
      </div>
      {room && (
        <div className="lg:col-span-4 lg:col-start-9">
          <div className="img-frame aspect-[4/3]">
            <Image src={room.images[0].src} alt={room.images[0].alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
          </div>
          <p className="small mt-3 text-charcoal-soft">{SITE.address.street}, {SITE.address.locality} {SITE.address.postalCode}</p>
        </div>
      )}
    </div>
  );
}
