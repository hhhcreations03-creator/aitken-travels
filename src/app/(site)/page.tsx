import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section, Heading } from "@/components/Section";
import { RoomCard } from "@/components/RoomCard";
import { ImageBlock } from "@/components/ImageBlock";
import { GalleryGrid } from "@/components/GalleryGrid";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { GuestRatings } from "@/components/GuestRatings";
import { ROOMS } from "@/lib/rooms";
import { GALLERY } from "@/lib/gallery";
import { MAPS_LINK, whatsappUrl } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "The Lavish Haven | Boutique Hotel in Ahangama, Sri Lanka",
  socialTitle: "The Lavish Haven, Ahangama",
  description: "A boutique hotel in Ahangama, a short walk from Kabalana Beach. Calm king rooms and family suites around an outdoor pool, with yoga and a restaurant.",
  path: "/",
});

const FEATURED = ["superior-king-balcony-garden-pool-view", "family-suite-patio", "two-bedroom-suite"];

export default function HomePage() {
  const featured = FEATURED.map((s) => ROOMS.find((r) => r.slug === s)!).filter(Boolean);
  const preview = [
    GALLERY[0].images[1],
    GALLERY[1].images[0],
    GALLERY[2].images[1],
    GALLERY[4].images[0],
    GALLERY[5].images[1],
    GALLERY[3].images[0],
  ];

  return (
    <>
      <Header overlay />
      <main id="main">
        <PageHero
          tall
          title="Where the palms meet the southern sea"
          intro="The Lavish Haven is a boutique stay in Ahangama, where quiet comfort, warm hospitality and the slow rhythm of Sri Lanka's south coast meet."
          image={{ src: "/images/property/pool-dusk-wide.webp", alt: "The Lavish Haven at dusk: the pool lit from below, balconies glowing under the gabled roofs" }}
        >
          <Link href="/book" className="btn-ivory">Book Your Stay</Link>
          <Link href="/rooms" className="btn-outline-light">Explore Rooms</Link>
        </PageHero>

        <GuestRatings />

        {/* Introduction */}
        <Section>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">A quiet house around a pool, a short walk from the surf</h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="lede">
                On Welhengoda Road in Ahangama, set back from the coast road among coconut palms, the house gathers around a long outdoor pool. Rooms and suites open onto patios and balconies, and at its heart are the restaurant, the lounge and the garden, where the days drift easily from one to the next.
              </p>
              <p className="body mt-6">
                Kabalana Beach and its well-loved surf break are a short walk away, and Galle Fort and Weligama are close enough for an easy day out. Come for a few nights of waves, a gentle reset on the yoga mat, or a longer stay with the people you love. Our team will help you choose the rooms that suit you.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px]">
                <Link href="/about" className="textlink">About the Haven</Link>
                <Link href="/location" className="textlink">Where we are</Link>
              </div>
            </div>
          </div>
          <div className="mt-16 grid gap-4 md:grid-cols-12">
            <ImageBlock src="/images/property/aerial-pool-building.webp" alt="Aerial view of The Lavish Haven: green roofs, the pool and surrounding palms" aspect="aspect-[16/10]" sizes="(min-width: 768px) 66vw, 100vw" className="md:col-span-8" />
            <ImageBlock src="/images/property/lobby-staircase.webp" alt="Lobby with timber staircase, rattan chairs and a tree growing through the floor" aspect="aspect-[16/10] md:aspect-auto md:h-full" sizes="(min-width: 768px) 33vw, 100vw" className="md:col-span-4" />
          </div>
        </Section>

        {/* Rooms */}
        <Section tone="deep">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Heading title="Rooms & Suites" lead="King rooms that open onto patios and balconies, family suites with room for everyone, and a two-bedroom suite beneath the roof. Each has air conditioning, a private bathroom and a little outdoor space to call your own." />
            <Link href="/rooms" className="btn-outline shrink-0">See all rooms</Link>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((room, i) => <RoomCard key={room.slug} room={room} priority={i === 0} />)}
          </div>
        </Section>

        {/* Surf */}
        <section className="relative overflow-hidden bg-forest text-ivory">
          <Image src="/images/property/aerial-coast-surf.webp" alt="Aerial view of the Ahangama coastline with waves breaking along the reef" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-forest-deep/60" aria-hidden="true" />
          <div className="wrap relative py-24 lg:py-36">
            <div className="max-w-[44rem]">
              <p className="font-display text-[1.1rem] italic text-sand">Surf Retreats</p>
              <h2 className="display-lg mt-3">The waves are a short walk from the door</h2>
              <p className="lede mt-5 !text-ivory/85">
                Kabalana, Ahangama&rsquo;s best-known break, waits at the end of the lane. Let your days follow the swell: early mornings on the water, long afternoons by the pool. If you&rsquo;d like help finding your way into the local surf scene, simply let us know.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/surf-retreats" className="btn-ivory">Plan a surf retreat</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Wellness */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="grid grid-cols-2 gap-4 lg:col-span-7">
              <ImageBlock src="/images/wellness/yoga-balcony-reach.webp" alt="Yoga on a first-floor balcony among palm fronds" aspect="aspect-[3/4]" sizes="(min-width: 1024px) 30vw, 50vw" className="mt-10" />
              <ImageBlock src="/images/wellness/pool-swim.webp" alt="A guest stepping into the pool" aspect="aspect-[3/4]" sizes="(min-width: 1024px) 30vw, 50vw" />
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="display-lg text-forest">Wellness & Experiences</h2>
              <p className="lede mt-5">An outdoor pool, yoga classes and a spa and wellness area, for days that move at a gentler pace.</p>
              <p className="body mt-5">
                Begin the morning on the mat or in the cool of the pool. Treatments and sessions are arranged on request, so share what you have in mind when you enquire and our team will confirm what&rsquo;s available during your stay.
              </p>
              <Link href="/wellness" className="btn-outline mt-8">Wellness at the Haven</Link>
            </div>
          </div>
        </Section>

        {/* Dining */}
        <Section tone="deep">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-4">
              <h2 className="display-lg text-forest">Dining</h2>
              <p className="lede mt-5">An open-air restaurant beside the pool, where breakfast meets the morning light and the menu wanders from Sri Lankan and Indian to Chinese, British and Mediterranean cooking.</p>
              <p className="body mt-5">Breakfast brings continental, full English and vegetarian options with fresh fruit. Kids&rsquo; meals, packed lunches and room service are all available, and if you have dietary needs, tell us when you enquire and we&rsquo;ll take care of them.</p>
              <Link href="/dining" className="btn-outline mt-8">About the restaurant</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:col-span-7 lg:col-start-6">
              <ImageBlock src="/images/dining/restaurant-lanterns.webp" alt="The restaurant at night, lit by woven lanterns" aspect="aspect-[4/5]" sizes="(min-width: 1024px) 30vw, 50vw" />
              <ImageBlock src="/images/dining/drink-service.webp" alt="A cold drink arriving on a wooden tray by the pool" aspect="aspect-[4/5]" sizes="(min-width: 1024px) 30vw, 50vw" className="mt-10" />
            </div>
          </div>
        </Section>

        {/* Groups */}
        <Section tone="forest">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="font-display text-[1.1rem] italic text-sand">Groups & Events</p>
              <h2 className="display-lg mt-3">Gather everyone together</h2>
              <p className="lede mt-5 !text-sand">
                With rooms and suites across two floors around a single pool, the Haven is made for staying together: surf trips, yoga retreats, and families and friends who travel as one.
              </p>
              <p className="body mt-5 !text-ivory/80">
                Share your dates, the size of your group and how you&rsquo;d like to spend your time. Our team will shape a room plan around you and confirm what the house can offer for your dates.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/groups" className="btn-ivory">Plan a group stay</Link>
                <a href={whatsappUrl("Hello The Lavish Haven, I'm organising a group stay and would like to enquire.")} target="_blank" rel="noopener noreferrer" className="btn-outline-light">WhatsApp the team</a>
              </div>
            </div>
            <div className="lg:col-span-6">
              <ImageBlock src="/images/property/pool-daytime.webp" alt="The pool and courtyard by day, balconies on two floors" aspect="aspect-[4/3]" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </div>
        </Section>

        {/* Gallery */}
        <Section>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Heading title="Gallery" lead="The house, the rooms and the coast, just as you'll find them." />
            <Link href="/gallery" className="btn-outline shrink-0">Open the gallery</Link>
          </div>
          <div className="mt-12">
            <GalleryGrid images={preview} />
          </div>
        </Section>

        {/* Location */}
        <Section tone="deep">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <ImageBlock src="/images/property/aerial-ocean-horizon.webp" alt="Aerial view over the palms of Ahangama to the Indian Ocean" aspect="aspect-[16/10]" sizes="(min-width: 1024px) 58vw, 100vw" />
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="display-lg text-forest">Ahangama</h2>
              <p className="lede mt-5">A surf village on the south coast, between Galle and Weligama, where life keeps time with the tide.</p>
              <address className="body mt-5 not-italic">
                166/2 Welhengoda Road<br />Ahangama 80650, Sri Lanka
              </address>
              <p className="body mt-3">Kabalana Beach is a short walk away, and Galle Fort and Weligama are close by for a day of exploring.</p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px]">
                <Link href="/location" className="textlink">Location and directions</Link>
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="textlink">Open in Google Maps</a>
              </div>
            </div>
          </div>
        </Section>

        {/* Final CTA */}
        <Section>
          <div className="mx-auto max-w-[48rem] text-center">
            <h2 className="display-lg text-forest">Your stay, shaped around you</h2>
            <p className="lede mt-5">Tell us your dates, who&rsquo;s coming and what you hope to find here. Our team will confirm availability and arrangements with you personally.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/book" className="btn-forest">Book Your Stay</Link>
              <a href={whatsappUrl("Hello The Lavish Haven, I'd like to ask about a stay.")} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">WhatsApp</a>
            </div>
          </div>
        </Section>
      </main>
      <WhatsAppFloat />
    </>
  );
}
