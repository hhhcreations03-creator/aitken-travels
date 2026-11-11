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
import { SunMark, TideLine } from "@/components/Motifs";
import { Faq } from "@/components/Faq";
import { BREAKFAST, BREAKFAST_DISH_COUNT } from "@/lib/breakfast";
import { PlateRow } from "@/components/BreakfastMenu";

export const metadata: Metadata = pageMeta({
  title: "The Lavish Haven | Luxury Boutique Hotel in Ahangama, Sri Lanka",
  socialTitle: "The Lavish Haven, Ahangama",
  description: "Luxury boutique hotel in Ahangama, Sri Lanka, two minutes' walk from Kabalana Beach: 23 rooms and suites around a palm-shaded pool, with yoga and an in-house restaurant.",
  path: "/",
});

const FAQ: Array<[string, string]> = [
  ["What makes The Lavish Haven a luxury boutique hotel?", "With 23 rooms and suites around a single pool, the house stays small and personal. Rooms are finished with polished concrete, teak doors, crisp white linen and a walk-in shower, and every one opens onto its own patio or balcony among the palms."],
  ["Where is The Lavish Haven?", `At ${SITE.address.street}, ${SITE.address.locality} ${SITE.address.postalCode}, on Sri Lanka's south coast between Galle and Weligama.`],
  ["How far is the hotel from the beach?", "Kabalana Beach, Ahangama's best-known surf break, is about two minutes' walk from the hotel."],
  ["What kinds of rooms are there?", "23 rooms and suites across twelve room types: king rooms with a patio or balcony, family suites, and a two-bedroom suite. Every room is appointed to luxury standards, with air conditioning, Wi-Fi, a walk-in shower and its own outdoor space."],
  ["Does the hotel have its own restaurant?", "Yes. The Lavish Haven has an open-air restaurant beside the pool. It serves a complimentary breakfast, cooked to order, for every guest, and our all-day menu with lunch and dinner is coming soon."],
  ["Is breakfast included?", "Yes. Breakfast is complimentary for every guest. Choose from Sri Lankan, Indian, English and lighter dishes, each cooked to order by our professional chef and served with a seasonal fruit platter, a fresh juice or king coconut, and Ceylon tea or coffee. Our head chef also comes out to the tables to ask how you enjoyed it."],
  ["Is there daily housekeeping?", "Yes. Every room is cleaned daily by our housekeeping team, whatever the length of your stay."],
  ["Is bed linen provided?", "Yes. Fresh bed linen is provided for every type of stay, from a single night to a long stay, so there is nothing you need to bring."],
  ["What toiletries are in the rooms?", "Each room has toiletries made with handmade, natural fragrances, provided by us as part of your stay."],
  ["Is there a pool?", "Yes. The rooms gather around an outdoor pool in a garden of palms, and yoga classes run on the terrace."],
  ["Are there good restaurants nearby?", "Yes. As well as our own restaurant, Cactus, Thileni's, Manori's Kitchen, Vertigo Pizzeria Italiana, The Protein House and Kai Ahangama are all within about five minutes by tuk-tuk, and our team will happily arrange the ride."],
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
    GALLERY[0].images[3],
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
          kicker={"Luxury boutique hotel in Ahangama, Sri\u00a0Lanka"}
          kickerInTitle
          title="A day here begins with the sound of the sea"
          intro="Turn off the coast road, follow a quiet lane through the coconut palms, and the world slows to the pace of the tide. This is The Lavish Haven: 23 rooms and suites, one pool, and the whole of Sri Lanka's south coast at your door."
          image={{ src: "/images/property/pool-dusk-wide.webp", alt: "The Lavish Haven at dusk: the pool lit from below, balconies glowing under the gabled roofs" }}
        >
          <Link href="/book" className="btn-ivory">Book Your Stay</Link>
          <Link href="/rooms" className="btn-outline-light">Explore Rooms</Link>
        </PageHero>

        <div className="bg-ivory pt-5 text-forest/35"><TideLine /></div>
        <GuestRatings />

        {/* Introduction */}
        <Section>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <p className="flex items-center gap-3 font-display text-[1.1rem] italic text-olive-deep"><SunMark phase="arrival" />Arrival</p>
              <h2 className="display-lg mt-3 text-forest">The moment the gate closes behind you</h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="lede">
                The tuk-tuks and the traffic fall away somewhere along Welhengoda Road. Then the gate opens onto a courtyard of stone and palms, and a long pool holds the sky still. Someone from our team is already there to take your bags. Somewhere above you, a balcony door stands open, waiting.
              </p>
              <p className="body mt-6 hidden md:block">
                That is the feeling we built the Haven around: a small, private house where every room opens to the air and every day is yours to shape. Kabalana Beach is two minutes away on foot. Galle Fort and Weligama are an easy drive. Between them lies whatever kind of stay you came for: waves, rest, or long days with the people you love.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px]">
                <Link href="/about" className="textlink">Our story</Link>
                <Link href="/location" className="textlink">Where we are</Link>
              </div>
            </div>
          </div>
          <div className="rail-md rail-photos mt-10 grid gap-4 sm:mt-16 md:grid-cols-12">
            <ImageBlock src="/images/property/garden-path-pool.webp" alt="Morning sun through the palms over a stone path leading to the pool" aspect="aspect-[16/10]" sizes="(min-width: 768px) 66vw, 100vw" className="md:col-span-8" />
            <ImageBlock src="/images/wellness/poolside-hat.webp" alt="A guest in a straw hat relaxing on a striped lounger by the pool with a cold drink" aspect="aspect-[16/10] md:aspect-auto md:h-full" sizes="(min-width: 768px) 33vw, 100vw" className="md:col-span-4" />
          </div>
        </Section>

        {/* Rooms */}
        <Section tone="deep">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Heading title="Rooms & Suites" lead="23 rooms and suites, each appointed to luxury standards: polished concrete, teak doors, high gabled ceilings, crisp white linen and a walk-in shower. Every one opens onto its own patio or balcony, so the first thing you see each morning is green, and the last thing you hear at night is the palms." />
            <Link href="/rooms" className="btn-outline shrink-0">See all rooms</Link>
          </div>
          <div className="rail-md mt-10 grid gap-10 md:mt-12 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((room, i) => <RoomCard key={room.slug} room={room} priority={i === 0} />)}
          </div>
        </Section>

        {/* Surf */}
        <section className="relative overflow-hidden bg-forest text-ivory">
          <Image src="/images/property/aerial-coast-surf.webp" alt="Aerial view of the Ahangama coastline with waves breaking along the reef" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-forest-deep/60" aria-hidden="true" />
          <div className="wrap relative py-24 lg:py-36">
            <div className="max-w-[44rem]">
              <p className="flex items-center gap-3 font-display text-[1.1rem] italic text-sand"><SunMark phase="dawn" />Dawn</p>
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

        {/* Breakfast */}
        <Section tone="sand">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="flex items-center gap-3 font-display text-[1.1rem] italic text-olive-deep"><SunMark phase="morning" />Morning</p>
              <h2 className="display-lg mt-3 text-forest">Breakfast is on us, and it&rsquo;s a feast</h2>
              <p className="lede mt-5">Choose from {BREAKFAST_DISH_COUNT} dishes, each cooked to order by our professional chef. It&rsquo;s complimentary every morning, a breakfast unlike any other in Ahangama, and our head chef will come by your table to ask how you enjoyed it.</p>
              <PlateRow dishes={["coconut-roti", "shakshuka", "banana-pancakes", "full-english", "tropical-smoothie-bowl"].map((f) => BREAKFAST.flatMap((c) => c.dishes).find((d) => d.image.includes(f))!)} ring="ring-sand" size={72} className="mt-8" />
              <Link href="/dining#breakfast" className="btn-forest mt-8">See the breakfast menu</Link>
            </div>
            <ul className="rail-md rail-narrow grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:self-center">
              {BREAKFAST.filter((c) => ["Sri Lankan favourites", "Indian options", "Eggs & classics", "Sweet morning"].includes(c.title)).map((c) => (
                <li key={c.title} className="rule-soft pt-4 max-md:rounded-[2px] max-md:border-0 max-md:bg-ivory/70 max-md:p-5">
                  <p className="font-display text-[1.05rem] italic text-olive-deep">{c.title}</p>
                  <ul className="mt-2 grid gap-1 font-display text-[1.2rem] leading-snug text-forest">{c.dishes.map((d) => <li key={d.name}>{d.name}</li>)}</ul>
                </li>
              ))}
              <li className="rule-soft pt-4 max-md:rounded-[2px] max-md:border-0 max-md:bg-ivory/70 max-md:p-5 sm:col-span-2">
                <p className="font-display text-[1.05rem] italic text-olive-deep">With every breakfast</p>
                <p className="mt-2 font-display text-[1.2rem] leading-snug text-forest">A seasonal fruit platter, fresh juice or king coconut, and Ceylon tea or coffee</p>
              </li>
            </ul>
          </div>
        </Section>

        {/* Wellness */}
        <Section>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="grid grid-cols-2 gap-4 lg:col-span-7">
              <ImageBlock src="/images/wellness/yoga-balcony-reach.webp" alt="Yoga on a first-floor balcony among palm fronds" aspect="aspect-[3/4]" sizes="(min-width: 1024px) 30vw, 50vw" className="mt-10" />
              <ImageBlock src="/images/wellness/pool-swim.webp" alt="A guest stepping into the pool" aspect="aspect-[3/4]" sizes="(min-width: 1024px) 30vw, 50vw" />
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="flex items-center gap-3 font-display text-[1.1rem] italic text-olive-deep"><SunMark phase="midday" />Midday</p>
              <h2 className="display-lg mt-3 text-forest">The hours that belong to no one</h2>
              <p className="lede mt-5">A mat unrolled on a balcony among the palm fronds. A slow length of the pool. A book you finally finish. This is the part of the day when nothing is asked of you.</p>
              <p className="body mt-5 hidden md:block">
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
              <p className="flex items-center gap-3 font-display text-[1.1rem] italic text-olive-deep"><SunMark phase="dusk" />Dusk</p>
              <h2 className="display-lg mt-3 text-forest">When the lanterns come on</h2>
              <p className="lede mt-5">As the light turns gold, the woven lanterns over our open-air restaurant flicker on, one by one, and the pool goes dark blue. Nobody is in a hurry to be anywhere.</p>
              <p className="body mt-5 hidden md:block">Our all-day menu is coming soon, bringing lunch and dinner to the tables by the pool. Until it arrives, mornings belong to our complimentary breakfast, and evenings to the village&rsquo;s restaurants, five minutes away.</p>
              <Link href="/dining" className="btn-outline mt-8">Our in-house restaurant</Link>
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
              <p className="flex items-center gap-3 font-display text-[1.1rem] italic text-olive-deep"><SunMark phase="night" />Night</p>
              <h2 className="display-lg mt-3 text-forest">Or let a tuk-tuk carry you into the village</h2>
              <p className="lede mt-5">Some evenings call for adventure. Ahangama has become one of the south coast&rsquo;s most loved places to eat, and its best tables are all within about five minutes by tuk-tuk of our gate.</p>
              <p className="body mt-5 hidden md:block">Tell our team where you&rsquo;d like to go and we&rsquo;ll call your ride. When the night is done, the Haven is waiting, quiet and lit by the pool.</p>
              <a href={whatsappUrl("Hello The Lavish Haven, could you recommend a restaurant nearby and arrange a tuk-tuk?")} target="_blank" rel="noopener noreferrer" className="btn-outline mt-8">Ask us to book a tuk-tuk</a>
            </div>
            <dl className="rail-md rail-narrow grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
              {NEARBY.map((p) => (
                <div key={p.name} className="rule-soft pt-4 max-md:rounded-[2px] max-md:border-0 max-md:bg-white/60 max-md:p-5">
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
              <p className="body mt-5 hidden !text-ivory/80 md:block">
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
        <Section tone="lagoon">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <ImageBlock src="/images/property/aerial-ocean-horizon.webp" alt="Aerial view over the palms of Ahangama to the Indian Ocean" aspect="aspect-[16/10]" sizes="(min-width: 1024px) 58vw, 100vw" />
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="display-lg text-ivory">Ahangama</h2>
              <p className="lede mt-5 !text-foam/90">A fishing village that the surfers found, and never quite left. Between Galle and Weligama, it still keeps time with the tide: stilt fishermen at dawn, cafés by mid-morning, and sunsets that stop conversation.</p>
              <address className="body mt-5 not-italic !text-ivory/85">
                166/2 Welhengoda Road<br />Ahangama 80650, Sri Lanka
              </address>
              <p className="body mt-3 hidden !text-ivory/75 md:block">Kabalana Beach is a short walk away, and Galle Fort and Weligama are close by for a day of exploring.</p>
              <p className="mt-8 border-t border-ivory/15 pt-5 font-display text-[1.05rem] italic text-sand/90">
                Along this shore, west to east: Galle Fort, Koggala, <span className="not-italic text-ivory">Ahangama</span>, Midigama, Weligama.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px]">
                <Link href="/location" className="textlink !text-sand">Location and directions</Link>
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="textlink !text-sand">Open in Google Maps</a>
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
            <div className="lg:col-span-7 lg:col-start-6">
              <Faq items={FAQ} />
            </div>
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        </Section>

        {/* Final CTA */}
        <Section tone="foam">
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
