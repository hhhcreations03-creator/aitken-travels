import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section, Heading } from "@/components/Section";
import { ImageBlock } from "@/components/ImageBlock";
import { RoomCard } from "@/components/RoomCard";
import { SurfRetreatForm } from "@/components/forms/SurfRetreatForm";
import { ROOMS } from "@/lib/rooms";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Surf Stays near Kabalana Beach | The Lavish Haven",
  socialTitle: "Surf Retreats at The Lavish Haven",
  description: "Wake two minutes' walk from Kabalana, Ahangama's best-known break. Rooms for solo surfers, couples and crews, with a pool and yoga to come home to.",
  path: "/surf-retreats",
});

const PICKS = ["deluxe-king-patio-pool-view", "family-suite-patio", "two-bedroom-suite"];

export default function SurfRetreatsPage() {
  const rooms = PICKS.map((s) => ROOMS.find((r) => r.slug === s)!);
  return (
    <>
      <Header overlay />
      <main id="main">
        <PageHero
          kicker="Surf Retreats"
          title="Sleep two minutes from Kabalana"
          intro="You hear it before you see it: the swell at Kabalana, two minutes down the lane. Paddle out at first light, come home to breakfast by the pool, sleep through the heat, and go again when the wind lies down. Repeat until you have to leave."
          image={{ src: "/images/property/aerial-coast-surf.webp", alt: "Aerial view of the Ahangama coastline, waves breaking along the reef beyond the palms" }}
        >
          <a href="#retreat-enquiry" className="btn-ivory">Enquire about a surf retreat</a>
        </PageHero>

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">The wave at the end of the road</h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="lede">Kabalana Beach, home to one of the south coast&rsquo;s most loved waves, is about two minutes from our door on foot. Close enough to check the surf in your sandals, and close enough to hear the sets from your bed.</p>
              <p className="body mt-5">
                Around us, the village keeps surf shops, cafés and board hire within easy reach. We don&rsquo;t run a surf school of our own, but if you&rsquo;d like lessons, guiding or boards, mention it when you enquire and our team will let you know what they can help arrange locally for your dates.
              </p>
              <p className="body mt-5">Then comes the best part of any surf trip: coming home. Salt-dried and sun-warmed, you walk back into a quiet house, with a pool to loosen tired arms, a late breakfast waiting, a lounger in the shade, and yoga on the terrace to keep shoulders supple for tomorrow&rsquo;s session.</p>
            </div>
          </div>
          <div className="rail-md rail-photos mt-10 grid gap-4 sm:mt-16 md:grid-cols-3">
            <ImageBlock src="/images/property/aerial-coastline.webp" alt="Aerial of the Ahangama coastline and village" aspect="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" />
            <ImageBlock src="/images/property/pool-daytime.webp" alt="The hotel pool by day" aspect="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" />
            <ImageBlock src="/images/wellness/yoga-poolside.webp" alt="Yoga beside the pool" aspect="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" />
          </div>
        </Section>

        <Section tone="deep">
          <Heading title="Rooms that suit a surf trip" lead="Ground-floor rooms with patios for slipping out at dawn, suites with two beds for friends sharing the trip, and the two-bedroom suite for a small crew under one roof." />
          <div className="rail-md mt-10 grid gap-10 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => <RoomCard key={room.slug} room={room} />)}
          </div>
          <Link href="/rooms" className="btn-outline mt-12">All rooms and suites</Link>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">What awaits you between sessions</h2>
            </div>
            <ul className="body grid gap-x-10 gap-y-4 lg:col-span-6 lg:col-start-7 sm:grid-cols-2">
              {[
                "Outdoor pool, open year-round",
                "Sun terrace, garden and loungers",
                "Complimentary breakfast, cooked to order (all-day menu coming soon)",
                "Yoga classes on request",
                "Spa and wellness area, treatments on request",
                "Free Wi-Fi throughout",
                "Free private parking",
                "Laundry service and luggage storage",
                "Airport pick-up and shuttle can be arranged (charges apply)",
                "Car rental on request",
              ].map((f) => (
                <li key={f} className="flex gap-3"><span aria-hidden="true" className="mt-[12px] h-px w-3 shrink-0 bg-olive" />{f}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section tone="deep" id="retreat-enquiry">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="display-lg text-forest">Plan a surf retreat</h2>
              <p className="lede mt-5">Tell us your dates, who&rsquo;s coming and the trip you have in mind. Our team will confirm rooms and what can be arranged locally, and help shape the rest.</p>
              <div className="mt-8 hidden lg:block">
                <ImageBlock src="/images/property/aerial-ocean-horizon.webp" alt="Aerial view over palms to the ocean horizon" aspect="aspect-[4/5]" sizes="30vw" />
              </div>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <SurfRetreatForm />
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
