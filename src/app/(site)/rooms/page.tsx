import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { RoomCard } from "@/components/RoomCard";
import { ROOMS } from "@/lib/rooms";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Rooms & Suites in Ahangama | The Lavish Haven",
  socialTitle: "Rooms & Suites at The Lavish Haven",
  description: "Twelve rooms and suites near Kabalana Beach in Ahangama, from king rooms with patios to family suites, each with its own outdoor space. Book direct.",
  path: "/rooms",
});

export default function RoomsPage() {
  const doubles = ROOMS.filter((r) => r.category === "Double");
  const families = ROOMS.filter((r) => r.category !== "Double");

  return (
    <>
      <Header overlay />
      <main id="main">
        <PageHero
          kicker="Rooms & Suites"
          title="Twelve ways to stay"
          intro="Each room comes with air conditioning, a private bathroom with a walk-in shower and a patio or balcony of its own. Choose by floor, by view, or by the people you are bringing with you."
          image={{ src: "/images/rooms/superior-king/balcony-wide.webp", alt: "A covered first-floor balcony with timber chairs looking over the garden and pool" }}
        >
          <Link href="/book" className="btn-ivory">Check availability</Link>
          <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-light">View on Booking.com</a>
        </PageHero>

        <Section compact>
          <div className="rule grid gap-y-3 pt-6 text-[14.5px] sm:grid-cols-3">
            <p><span className="text-charcoal-mute">Check-in from</span><br />{SITE.checkIn}</p>
            <p><span className="text-charcoal-mute">In every room</span><br />Air conditioning, Wi-Fi, minibar, kettle, safe</p>
            <p><span className="text-charcoal-mute">How booking works</span><br />Send a request, and our team confirms availability and your rate directly</p>
          </div>
        </Section>

        <Section className="!pt-0">
          <h2 className="display-md text-forest">King rooms</h2>
          <p className="body mt-3 max-w-[60ch]">One king bed in 38 to 47 square metres of calm. Choose the ground floor and a patio at garden level, or the first floor and a balcony among the palms.</p>
          <div className="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {doubles.map((room, i) => <RoomCard key={room.slug} room={room} priority={i < 3} />)}
          </div>
        </Section>

        <Section tone="deep">
          <h2 className="display-md text-forest">Family suites and the two-bedroom suite</h2>
          <p className="body mt-3 max-w-[60ch]">Room for everyone, with two beds or two bedrooms across 39 to 93 square metres. Several have a kitchenette, and every one opens to a patio or balcony.</p>
          <div className="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {families.map((room) => <RoomCard key={room.slug} room={room} />)}
          </div>
        </Section>

        <Section>
          <div className="rule pt-10">
            <h2 className="display-md text-forest">Room register</h2>
            <p className="body mt-3 max-w-[60ch]">All twelve at a glance, to help you find the right fit. Sizes and bed configurations are as published on the hotel&rsquo;s listing.</p>
            <ul className="mt-8 grid gap-4 md:hidden">
              {ROOMS.map((r) => (
                <li key={r.slug} className="border-b border-[color:var(--line-soft)] pb-4">
                  <Link href={`/rooms/${r.slug}`} className="textlink text-[15.5px]">{r.name}</Link>
                  <dl className="mt-3 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1.5 text-[14px]">
                    <dt className="text-charcoal-mute">Floor</dt><dd className="text-charcoal-soft">{r.floor}</dd>
                    <dt className="text-charcoal-mute">Size</dt><dd className="text-charcoal-soft tabular-nums">{r.sizeSqm} m²</dd>
                    <dt className="text-charcoal-mute">Beds</dt><dd className="text-charcoal-soft">{r.beds}</dd>
                    <dt className="text-charcoal-mute">Outdoor</dt><dd className="text-charcoal-soft">{r.outdoor}</dd>
                  </dl>
                  <Link href={`/book?room=${r.slug}`} className="textlink mt-3 inline-block text-[14px]">Check availability</Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 hidden relative overflow-x-auto md:block">
              <table className="w-full min-w-[680px] text-left text-[14.5px]">
                <thead>
                  <tr className="border-b border-[color:var(--line)] text-charcoal-mute">
                    <th scope="col" className="py-3 pr-4 font-medium">Room</th>
                    <th scope="col" className="py-3 pr-4 font-medium">Floor</th>
                    <th scope="col" className="py-3 pr-4 font-medium">Size</th>
                    <th scope="col" className="py-3 pr-4 font-medium">Beds</th>
                    <th scope="col" className="py-3 pr-4 font-medium">Outdoor</th>
                    <th scope="col" className="py-3 font-medium"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {ROOMS.map((r) => (
                    <tr key={r.slug} className="border-b border-[color:var(--line-soft)] align-top">
                      <th scope="row" className="py-3.5 pr-4 font-normal"><Link href={`/rooms/${r.slug}`} className="textlink">{r.name}</Link></th>
                      <td className="py-3.5 pr-4 text-charcoal-soft">{r.floor}</td>
                      <td className="py-3.5 pr-4 text-charcoal-soft tabular-nums">{r.sizeSqm} m²</td>
                      <td className="py-3.5 pr-4 text-charcoal-soft">{r.beds}</td>
                      <td className="py-3.5 pr-4 text-charcoal-soft">{r.outdoor}</td>
                      <td className="py-3.5"><Link href={`/book?room=${r.slug}`} className="textlink whitespace-nowrap">Check availability</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
