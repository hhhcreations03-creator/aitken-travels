import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { BookingFlow, type FlowRoom } from "@/components/booking/BookingFlow";
import { AvailabilityForm } from "@/components/forms/AvailabilityForm";
import { ROOMS } from "@/lib/rooms";
import { SITE, whatsappUrl } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { bookingConfigured, HOTEL_TZ, LIMITS } from "@/lib/booking/config";
import { todayIn } from "@/lib/booking/dates";
import { getSettings } from "@/lib/booking/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMeta({
  title: "Book Your Stay | The Lavish Haven, Ahangama",
  socialTitle: "Book your stay at The Lavish Haven",
  description: "Check live availability for rooms and suites at The Lavish Haven in Ahangama and send a booking request direct to the hotel. No payment taken online.",
  path: "/book",
});

async function loadSettings() {
  if (!bookingConfigured()) return null;
  try {
    const s = await getSettings();
    return s.onlineBooking ? s : null;
  } catch (e) {
    console.error("booking settings unavailable", e);
    return null;
  }
}

export default async function BookPage({ searchParams }: { searchParams: { room?: string } }) {
  const settings = await loadSettings();
  const rooms: FlowRoom[] = ROOMS.map((r) => ({ slug: r.slug, name: r.name, beds: r.beds, sizeSqm: r.sizeSqm, floor: r.floor, outdoor: r.outdoor, image: r.images[0] }));
  const initialRoom = ROOMS.some((r) => r.slug === searchParams.room) ? searchParams.room : undefined;

  return (
    <>
      <Header />
      <main id="main" className="pt-[72px] lg:pt-[84px]">
        <Section>
          <div className="mb-10 max-w-[44rem]">
            <h1 className="display-lg text-forest">Book your stay</h1>
            <p className="lede mt-4">
              {settings
                ? "Choose your dates, find the room that feels right and send us your booking request. We hold it for you while our team confirms, and nothing is charged online."
                : "Tell us your dates and the room you have in mind, and our team will personally confirm availability and your rate."}
            </p>
          </div>
          {settings ? (
            <BookingFlow
              rooms={rooms}
              initialRoom={initialRoom}
              today={todayIn(HOTEL_TZ)}
              maxNights={LIMITS.maxNights}
              maxRooms={LIMITS.maxRoomsPerBooking}
              currency={settings.currency}
              policyNote={settings.policyNote}
            />
          ) : (
            <div className="max-w-[48rem]">
              <Suspense fallback={<p className="body">Loading the form…</p>}>
                <AvailabilityForm />
              </Suspense>
            </div>
          )}
          <p className="small mt-12 text-charcoal-mute">
            Questions first? Email <a className="textlink" href={`mailto:${SITE.email}`}>{SITE.email}</a> or <a className="textlink" href={whatsappUrl("Hello The Lavish Haven, I have a question about booking.")} target="_blank" rel="noopener noreferrer">WhatsApp {SITE.whatsappDisplay}</a>.
          </p>
        </Section>
      </main>
    </>
  );
}
