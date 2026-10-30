import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ImageBlock } from "@/components/ImageBlock";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About Us | The Lavish Haven, Boutique Hotel in Ahangama",
  socialTitle: "About The Lavish Haven",
  description: "A boutique hotel in Ahangama, Sri Lanka: rooms and suites around a pool among coconut palms, a short walk from the surf at Kabalana Beach.",
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
    "The Lavish Haven stands on Welhengoda Road in Ahangama, a short lane back from the coast road on Sri Lanka's southern shore, where the noise of traffic gives way to palms and birdsong. The house rises on two floors around a long outdoor pool: timber balconies and railings above, stone-paved patios and planting below, and a restaurant that opens onto the courtyard, so the water is never far from view.",
    "Inside, the rooms speak a quiet language of polished concrete, teak doors, high gabled ceilings and crisp white linen. Each one opens onto its own patio or balcony, and the suites add a second bed, a second room or a kitchenette. The lobby, with its timber staircase and a tree growing up through the floor, is where the day tends to settle, and where guests find themselves drifting as the light softens.",
    "Ahangama has become one of the south coast's best-loved surf villages, and Kabalana Beach, its most popular break, is a few minutes' walk from our door. Around it, the village hums with cafés, surf shops and small restaurants, and Galle Fort and Weligama are close enough for an unhurried day out.",
  ],
};

export default function AboutPage() {
  return (
    <>
      <Header overlay />
      <main id="main">
        <PageHero
          kicker="About Us"
          title="The Lavish Haven"
          intro="A boutique hotel in Ahangama, held in the shade of coconut palms, a short walk from the waves of Kabalana Beach."
          image={{ src: "/images/property/aerial-green-roofs.webp", alt: "Aerial view over coconut palms to the hotel's green roofs and pool" }}
        />

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">{STORY.heading}</h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              {STORY.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "lede" : "body mt-5"}>{p}</p>
              ))}
            </div>
          </div>
        </Section>

        <Section tone="deep" compact>
          <div className="grid gap-4 md:grid-cols-3">
            <ImageBlock src="/images/property/lobby-staircase.webp" alt="The lobby staircase with a tree growing through the floor" aspect="aspect-[4/5]" sizes="(min-width: 768px) 33vw, 100vw" />
            <ImageBlock src="/images/rooms/superior-king/balcony-palms.webp" alt="Balcony chairs framed by palms" aspect="aspect-[4/5]" sizes="(min-width: 768px) 33vw, 100vw" className="md:mt-12" />
            <ImageBlock src="/images/rooms/more/balcony-gable.webp" alt="A balcony beneath the white gabled roof" aspect="aspect-[4/5]" sizes="(min-width: 768px) 33vw, 100vw" />
          </div>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">How we host</h2>
            </div>
            <dl className="lg:col-span-6 lg:col-start-7 grid gap-6 sm:grid-cols-2">
              {[
                ["Front desk", "Someone is always here for you, day and night, with luggage storage and laundry."],
                ["Getting here", "Airport pick-up and shuttle services can be arranged for a charge; car rental on request."],
                ["Families", "Family suites, kids' meals, cots on request and an outdoor play area, so little ones feel at home too."],
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
              <h2 className="display-lg">Come and find your place by the pool</h2>
              <p className="lede mt-4 !text-sand">Tell us your dates and who&rsquo;s travelling with you. Our team will reply personally with availability and every arrangement for your stay.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <Link href="/book" className="btn-ivory">Book Your Stay</Link>
            </div>
          </div>
        </Section>
      </main>
      <WhatsAppFloat />
    </>
  );
}
