import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section, Heading } from "@/components/Section";
import { RoomCard } from "@/components/RoomCard";
import { ImageBlock } from "@/components/ImageBlock";
import { GalleryGrid } from "@/components/GalleryGrid";
import { GuestRatings } from "@/components/GuestRatings";
import { ROOMS } from "@/lib/rooms";
import { GALLERY } from "@/lib/gallery";
import { MAPS_LINK, SITE, whatsappUrl } from "@/lib/site";
import { NEARBY } from "@/lib/nearby";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "The Lavish Haven | Luxury Boutique Hotel in Ahangama, Sri Lanka",
  socialTitle: "The Lavish Haven, Ahangama",
  description: "A luxury boutique hotel in Ahangama, Sri Lanka, two minutes' walk from Kabalana Beach. 23 rooms and suites appointed to luxury standards, around a palm-shaded pool, with yoga, a lantern-lit restaurant and Ahangama's best cafés minutes away.",
  path: "/",
});

const FAQ: Array<[string, string]> = [
  ["Are there good restaurants nearby?", "Yes. Cactus, Thileni's, Manori's Kitchen, Vertigo Pizzeria Italiana, The Protein House and Kai Ahangama are all within about five minutes by tuk-tuk, and our team will happily arrange the ride."],
  ["Where is The Lavish Haven?", `At ${SITE.address.street}, ${SITE.address.locality} ${SITE.address.postalCode}, on Sri Lanka's south coast between Galle and Weligama.`],
  ["How far is the hotel from the beach?", "Kabalana Beach, Ahangama's best-known surf break, is about two minutes' walk from the hotel."],
  ["What kinds of rooms are there?", "23 rooms and suites across twelve room types: king rooms with a patio or balcony, family suites, and a two-bedroom suite. Every room is appointed to luxury standards, with air conditioning, Wi-Fi, a walk-in shower and its own outdoor space."],
  ["Is there a pool and a restaurant?", "Yes. The rooms gather around an outdoor pool, and the open-air restaurant serves breakfast and Sri Lankan, Indian, Chinese, British and Mediterranean dishes. Yoga classes run on the terrace."],
  ["What time is check-in, and is there parking?", `Check-in is from ${SITE.checkIn}. Free private parking is available on site.`],
  ["How do I book?", "Choose your dates on our booking page and send a request. Our team confirms availability and your rate personally. No payment is taken online."],
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};

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
          kicker="Luxury boutique hotel in Ahangama, Sri Lanka"
          kickerInTitle
          title="A day here begins with the sound of the sea"
          intro="Turn off the coast road, follow a quiet lane through the coconut palms, and the world slows to the pace of the tide. This is The Lavish Haven: 23 rooms and suites, one pool, and the whole of Sri Lanka's south coast at your door."
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
              <p className="font-display text-[1.1rem] italic text-olive-deep">Arrival</p>
              <h2 className="display-lg mt-3 text-forest">The moment the gate closes behind you</h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="lede">
                The tuk-tuks and the traffic fall away somewhere along Welhengoda Road. Then the gate opens onto a courtyard of stone and palms, and a long pool holds the sky still. Someone from our team is already there to take your bags. Somewhere above you, a balcony door stands open, waiting.
              </p>
              <p className="body mt-6">
                That is the feeling we built the Haven around: a small, private house where every room opens to the air and every day is yours to shape. Kabalana Beach is two minutes away on foot. Galle Fort and Weligama are an easy drive. Between them lies whatever kind of stay you came for: waves, rest, or long days with the people you love.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px]">
                <Link href="/about" className="textlink">Our story</Link>
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
            <Heading title="Rooms & Suites" lead="23 rooms and suites, each appointed to luxury standards: polished concrete, teak doors, high gabled ceilings, crisp white linen and a walk-in shower. Every one opens onto its own patio or balcony, so the first thing you see each morning is green, and the last thing you hear at night is the palms." />
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
              <p className="font-display text-[1.1rem] italic text-sand">Dawn</p>
              <h2 className="display-lg mt-3">First light, and the sets are rolling in</h2>
              <p className="lede mt-5 !text-ivory/85">
                Before the village wakes, you can hear it from your room: the low, steady roll of the swell at Kabalana, Ahangama&rsquo;s best-known break, two minutes down the lane. Paddle out while the water is glass. Come back salt-dried and hungry. The pool will still be still, and breakfast will be waiting.
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
              <p className="font-display text-[1.1rem] italic text-olive-deep">Midday</p>
              <h2 className="display-lg mt-3 text-forest">The hours that belong to no one</h2>
              <p className="lede mt-5">A mat unrolled on a balcony among the palm fronds. A slow length of the pool. A book you finally finish. This is the part of the day when nothing is asked of you.</p>
              <p className="body mt-5">
                Yoga classes run on the terrace, and our spa and wellness area is there when you want to be looked after. Treatments are arranged around you rather than from a fixed menu: tell us what you have in mind and our team will confirm what&rsquo;s available during your stay.
              </p>
              <Link href="/wellness" className="btn-outline mt-8">Wellness at the Haven</Link>
            </div>
          </div>
        </Section>

        {/* Dining */}
        <Section tone="deep">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-4">
              <p className="font-display text-[1.1rem] italic text-olive-deep">Dusk</p>
              <h2 className="display-lg mt-3 text-forest">When the lanterns come on</h2>
              <p className="lede mt-5">As the light turns gold, the woven lanterns over the open-air restaurant flicker on, one by one. The pool goes dark blue. Someone orders another round, and nobody is in a hurry to leave.</p>
              <p className="body mt-5">Our kitchen cooks across the island and beyond: Sri Lankan and Indian curries beside Chinese, British and Mediterranean plates. Mornings bring continental, full English and vegetarian breakfasts with fresh fruit, and room service, packed lunches and kids&rsquo; meals are always on offer. Tell us about any dietary needs and we&rsquo;ll take care of them.</p>
              <Link href="/dining" className="btn-outline mt-8">About the restaurant</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:col-span-7 lg:col-start-6">
              <ImageBlock src="/images/dining/restaurant-lanterns.webp" alt="The restaurant at night, lit by woven lanterns" aspect="aspect-[4/5]" sizes="(min-width: 1024px) 30vw, 50vw" />
              <ImageBlock src="/images/dining/drink-service.webp" alt="A cold drink arriving on a wooden tray by the pool" aspect="aspect-[4/5]" sizes="(min-width: 1024px) 30vw, 50vw" className="mt-10" />
            </div>
          </div>
        </Section>

        {/* Nearby restaurants */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-display text-[1.1rem] italic text-olive-deep">Night</p>
              <h2 className="display-lg mt-3 text-forest">Or let a tuk-tuk carry you into the village</h2>
              <p className="lede mt-5">Some evenings call for adventure. Ahangama has become one of the south coast&rsquo;s most loved places to eat, and its best tables are all within about five minutes by tuk-tuk of our gate.</p>
              <p className="body mt-5">Tell our team where you&rsquo;d like to go and we&rsquo;ll call your ride. When the night is done, the Haven is waiting, quiet and lit by the pool.</p>
              <a href={whatsappUrl("Hello The Lavish Haven, could you recommend a restaurant nearby and arrange a tuk-tuk?")} target="_blank" rel="noopener noreferrer" className="btn-outline mt-8">Ask us to book a tuk-tuk</a>
            </div>
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
              {NEARBY.map((p) => (
                <div key={p.name} className="rule-soft pt-4">
                  <dt>
                    <span className="font-display text-[1.35rem] text-forest">{p.name}</span>
                    <span className="mt-1 block text-[13px] uppercase tracking-[0.08em] text-charcoal-soft">{p.kind}</span>
                  </dt>
                  <dd className="body mt-3">{p.story}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        {/* Groups */}
        <Section tone="forest">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p className="font-display text-[1.1rem] italic text-sand">Groups & Events</p>
              <h2 className="display-lg mt-3">A house you can make your own</h2>
              <p className="lede mt-5 !text-sand">
                23 rooms and suites on two floors, one courtyard, one pool. Bring the whole party, a surf crew, a yoga retreat, three generations of one family, and for a few days the Haven becomes your private house by the sea.
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
            <Heading title="Gallery" lead="No staging, no filters: the house, the rooms and the coast, just as they'll be waiting for you." />
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
              <p className="lede mt-5">A fishing village that the surfers found, and never quite left. Between Galle and Weligama, it still keeps time with the tide: stilt fishermen at dawn, cafés by mid-morning, and sunsets that stop conversation.</p>
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

        {/* Questions */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="display-lg text-forest">Staying in Ahangama</h2>
              <p className="body mt-5">A few things guests often ask before they arrive.</p>
            </div>
            <dl className="lg:col-span-7 lg:col-start-6">
              {FAQ.map(([q, a]) => (
                <div key={q} className="border-b border-[color:var(--line-soft)] py-5 first:pt-0">
                  <dt className="font-display text-[1.25rem] text-forest">{q}</dt>
                  <dd className="body mt-2">{a}</dd>
                </div>
              ))}
            </dl>
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        </Section>

        {/* Final CTA */}
        <Section tone="deep">
          <div className="mx-auto max-w-[48rem] text-center">
            <h2 className="display-lg text-forest">Your chapter starts here</h2>
            <p className="lede mt-5">Tell us your dates, who&rsquo;s coming and what you hope to find here. We&rsquo;ll reply personally, confirm your room, and have everything ready for the moment you arrive.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/book" className="btn-forest">Book Your Stay</Link>
              <a href={whatsappUrl("Hello The Lavish Haven, I'd like to ask about a stay.")} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">WhatsApp</a>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
