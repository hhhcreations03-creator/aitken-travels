import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ImageBlock } from "@/components/ImageBlock";
import { pageMeta } from "@/lib/seo";
import { ReadMore } from "@/components/ReadMore";

export const metadata: Metadata = pageMeta({
  title: "Our Story | The Lavish Haven, Luxury Boutique Hotel in Ahangama",
  socialTitle: "The story of The Lavish Haven",
  description: "The story of The Lavish Haven, a luxury boutique hotel in Ahangama, Sri Lanka: a private house of 23 rooms and suites around a palm-shaded pool, two minutes from the surf at Kabalana Beach.",
  path: "/about",
});

/**
 * Editable brand story. The paragraphs below are written from verified
 * listing facts and the property photography only. The hotel team can add
 * the personal story (who built the Haven, when it opened, who runs it) here.
 */
const STORY = {
  heading: "A house that gathers around a pool, in a village that gathers around a wave",
  paragraphs: [
    "Every great stay begins with a turn off the main road. Ours is onto Welhengoda Road in Ahangama, a quiet lane on Sri Lanka's southern shore where the noise of the coast road fades into palms and birdsong. At the end of it, behind a gate, a house rises on two floors around a long outdoor pool. Timber balconies above, stone patios and planting below, and a restaurant open to the courtyard, so the water is never out of sight.",
    "We wanted it to feel less like a hotel and more like a beautiful private house you have been lent for a while. So our 23 rooms and suites speak quietly, finished to luxury standards: polished concrete, teak doors, high gabled ceilings, crisp white linen and walk-in showers. Each one opens onto its own patio or balcony. In the lobby, a tree grows straight up through the floor beside the timber staircase, and that is where the day tends to settle as the light softens and guests drift in from the pool.",
    "Outside the gate is Ahangama, a fishing village that became one of the south coast's best-loved surf towns without losing its easy pace. Kabalana Beach, its most famous break, is two minutes from our door. Cafés, surf shops and small kitchens line the road, and Galle Fort and Weligama are close enough for an unhurried day out. Then, when you have had enough of the world, the gate closes behind you again.",
  ],
};

export default function AboutPage() {
  return (
    <>
      <Header overlay />
      <main id="main">
        <PageHero
          kicker="Our Story"
          title="The Lavish Haven"
          intro="23 rooms and suites, one pool and a lane of coconut palms in Ahangama. A small luxury hotel built for one simple idea: that the best holidays feel like coming home to somewhere better."
          image={{ src: "/images/property/aerial-green-roofs.webp", alt: "Aerial view over coconut palms to the hotel's green roofs and pool" }}
        />

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">{STORY.heading}</h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="lede">{STORY.paragraphs[0]}</p>
              <ReadMore label="Read the whole story">
                {STORY.paragraphs.slice(1).map((p, i) => <p key={i} className="body mt-5">{p}</p>)}
              </ReadMore>
            </div>
          </div>
        </Section>

        <Section tone="deep" compact>
          <div className="rail-md rail-photos grid gap-4 md:grid-cols-3">
            <ImageBlock src="/images/property/pool-night-balconies.webp" alt="The pool at night, with lit balconies on two floors beneath the palms" aspect="aspect-[4/5]" sizes="(min-width: 768px) 33vw, 100vw" />
            <ImageBlock src="/images/wellness/poolside-reading-coconut.webp" alt="A guest reading on a striped lounger by the pool, with a fresh coconut" aspect="aspect-[4/5]" sizes="(min-width: 768px) 33vw, 100vw" className="md:mt-12" />
            <ImageBlock src="/images/details/amenity-bottle-leaf.webp" alt="A Lavish Haven toiletry bottle beside a potted plant" aspect="aspect-[4/5]" sizes="(min-width: 768px) 33vw, 100vw" />
          </div>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">How we take care of you</h2>
              <p className="body mt-5">Luxury, to us, is never having to ask twice. These are the small things we have ready before you arrive.</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-5 gap-y-6 lg:col-span-6 lg:col-start-7">
              {[
                ["Front desk", "Someone is always here for you, day and night, with luggage storage and laundry."],
                ["Getting here", "Airport pick-up and shuttle services can be arranged for a charge; car rental on request."],
                ["Families", "Family suites, cots on request and an outdoor play area, so little ones feel at home too."],
                ["Accessibility", "Wheelchair access and facilities for guests with reduced mobility. Share your needs when you enquire and we'll prepare for you."],
                ["Parking", "Free private parking on site."],
                ["House rules", "Check-in from 2:00 PM. No pets. A designated smoking area outside."],
              ].map(([k, v]) => (
                <div key={k} className="rule-soft pt-4">
                  <dt className="text-[15px] font-medium text-forest">{k}</dt>
                  <dd className="body mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        <Section tone="forest">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className="display-lg">There is a lounger by the pool with your name on it</h2>
              <p className="lede mt-4 !text-sand">Tell us your dates and who&rsquo;s travelling with you. Our team will reply personally with availability and every arrangement for your stay.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <Link href="/book" className="btn-ivory">Book Your Stay</Link>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
