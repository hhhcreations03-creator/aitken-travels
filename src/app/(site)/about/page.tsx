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
  description: "The Lavish Haven is a boutique hotel on Welhengoda Road in Ahangama, set among coconut palms around a pool, a short walk from Kabalana Beach.",
  path: "/about",
});

/**
 * Editable brand story. The paragraphs below are written from verified
 * listing facts and the property photography only. The hotel team can add
 * the personal story (who built the Haven, when it opened, who runs it) here.
 */
const STORY = {
  heading: "A house built around a pool, in a village built around a wave",
  paragraphs: [
    "The Lavish Haven stands on Welhengoda Road in Ahangama, a short lane back from the coast road on Sri Lanka's southern shore. The house is arranged on two floors around a long outdoor pool: timber balconies and railings above, stone-paved patios and planting below, a restaurant open to the courtyard on the ground floor.",
    "Inside, the rooms share a quiet language of polished concrete, teak doors, high gabled ceilings and white linen. Each has its own patio or balcony, and the suites add a second bed, a second room or a kitchenette. The lobby, with its staircase and a tree growing through the floor, is where guests tend to drift at the end of the day.",
    "Ahangama has become one of the south coast's best-loved surf villages, and Kabalana Beach, its most popular break, is a few minutes' walk from the door. The village around it has cafés, surf shops and small restaurants, and Galle Fort and Weligama are close enough for a day out.",
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
          intro="A boutique hotel in Ahangama, set among coconut palms a short walk from Kabalana Beach."
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
                ["Front desk", "Staffed around the clock, with luggage storage and laundry."],
                ["Getting here", "Airport pick-up and shuttle services can be arranged for a charge; car rental on request."],
                ["Families", "Family suites, kids' meals, cots on request and an outdoor play area."],
                ["Accessibility", "Wheelchair access and facilities for guests with reduced mobility. Tell us your needs when you enquire."],
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
              <h2 className="display-lg">Come and see for yourself</h2>
              <p className="lede mt-4 !text-sand">Tell us your dates and who&rsquo;s coming. The team will reply directly with availability and arrangements.</p>
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
