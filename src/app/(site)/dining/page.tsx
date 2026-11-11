import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ImageBlock } from "@/components/ImageBlock";
import { whatsappUrl } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { NEARBY } from "@/lib/nearby";
import { BREAKFAST_DISH_COUNT } from "@/lib/breakfast";
import { BreakfastMenu, BreakfastIntro } from "@/components/BreakfastMenu";

export const metadata: Metadata = pageMeta({
  title: "Restaurant & Breakfast in Ahangama | The Lavish Haven",
  socialTitle: "Dining at The Lavish Haven",
  description: "Complimentary breakfast cooked to order at our open-air restaurant in Ahangama, from coconut roti and egg hoppers to a full English. Our all-day menu is coming soon.",
  path: "/dining",
});

export default function DiningPage() {
  const diningEnquiry = whatsappUrl("Hello The Lavish Haven, I'd like to ask about dining at the restaurant.\n\nDates: \nNumber of guests: \nDietary needs or requests: ");
  return (
    <>
      <Header overlay />
      <main id="main">
        <PageHero
          kicker="Dining"
          title="Breakfast by the pool, on the house"
          intro="Mornings at the Haven begin at a timber table beside the pool, with a breakfast cooked to order and served with our compliments. Our all-day menu is coming soon, and with it, lunch and dinner under the lanterns."
          image={{ src: "/images/dining/restaurant-terrace.webp", alt: "The open-air restaurant terrace by day" }}
        >
          <a href="#breakfast" className="btn-ivory">See the breakfast menu</a>
          <a href={diningEnquiry} target="_blank" rel="noopener noreferrer" className="btn-outline-light">Enquire about dining</a>
        </PageHero>

        <Section tone="sand" id="breakfast" className="scroll-mt-16">
          <BreakfastIntro dishCount={BREAKFAST_DISH_COUNT} />
          <div className="mt-10 md:mt-14">
            <BreakfastMenu />
          </div>
          <div className="mt-6 flex flex-col gap-5 md:mt-8 md:flex-row md:items-center md:justify-between">
            <p className="flex items-center gap-3 font-display text-[1.15rem] italic text-olive-deep">
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
              Coming soon: our all-day menu, with lunch and dinner by the pool
            </p>
            <a href="/images/dining/breakfast-menu.webp" target="_blank" rel="noopener" className="textlink text-[14.5px]">See the printed menu</a>
          </div>
        </Section>

        {/* Repeats the breakfast story above, so phones skip it. */}
        <Section className="hidden md:block">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">Our in-house restaurant</h2>
              <p className="body mt-4 max-w-[34ch]">The Lavish Haven has its own open-air restaurant beside the pool, so a good meal is never more than a few steps from your room.</p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="lede">For now, our kitchen does one thing and puts everything into it: breakfast. Sixteen dishes, from coconut roti and egg hoppers to shakshuka and a full English, each cooked to order and complimentary for every guest.</p>
              <p className="body mt-5">Our all-day menu is coming soon, bringing lunch and dinner to the same tables by the pool. Until then, some of the south coast&rsquo;s best-loved restaurants are about five minutes from our gate by tuk-tuk, and our team will gladly arrange the ride.</p>
              <p className="body mt-5">Share any dietary requirements before you arrive and our team will confirm what the kitchen can prepare for you.</p>
            </div>
          </div>
        </Section>

        <Section tone="deep" compact>
          <div className="rail-md rail-photos grid gap-4 md:grid-cols-12">
            <ImageBlock src="/images/dining/restaurant-lanterns.webp" alt="The restaurant at night, lit by woven lanterns above timber tables" aspect="aspect-[4/3]" sizes="(min-width: 768px) 58vw, 100vw" className="md:col-span-7" />
            <ImageBlock src="/images/dining/drink-service.webp" alt="A drink served poolside on a wooden tray" aspect="aspect-[4/3] md:aspect-auto md:h-full" sizes="(min-width: 768px) 42vw, 100vw" className="md:col-span-5" />
            <ImageBlock src="/images/dining/restaurant-tables.webp" alt="Restaurant tables beneath the white timber ceiling" aspect="aspect-[4/3]" sizes="(min-width: 768px) 42vw, 100vw" className="md:col-span-5" />
            <ImageBlock src="/images/dining/restaurant-evening.webp" alt="The restaurant terrace lit in the evening" aspect="aspect-[4/3] md:aspect-auto md:h-full" sizes="(min-width: 768px) 58vw, 100vw" className="md:col-span-7" />
          </div>
        </Section>

        <Section>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">Good to know</h2>
            </div>
            <dl className="lg:col-span-6 lg:col-start-7 grid grid-cols-2 gap-x-5 gap-y-6">
              {[
                ["Breakfast", "Complimentary for hotel guests, cooked to order from the menu above."],
                ["All-day menu", "Coming soon, with lunch and dinner by the pool."],
                ["Eating out", "Ahangama's favourite restaurants are about five minutes away by tuk-tuk."],
                ["Dietary needs", "Tell the team in advance and they'll confirm."],
              ].map(([k, v]) => (
                <div key={k} className="rule-soft pt-4">
                  <dt className="text-[15px] font-medium text-forest">{k}</dt>
                  <dd className="body mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="small mt-10 max-w-[60ch] text-charcoal-mute">Breakfast serving hours are confirmed by the hotel team. We&rsquo;ll share the all-day menu here as soon as it launches.</p>
        </Section>

        <Section tone="deep" id="nearby">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-display text-[1.1rem] italic text-olive-deep">Dining out in Ahangama</p>
              <h2 className="display-lg mt-3 text-forest">Five minutes by tuk-tuk, a whole village of flavour</h2>
              <p className="lede mt-5">Our kitchen will always feed you well. But part of the joy of Ahangama is wandering out for the evening, and the village&rsquo;s most loved places are all within about five minutes of our gate.</p>
              <p className="body mt-5 hidden md:block">Just tell our team where you&rsquo;d like to go, and your tuk-tuk will be waiting.</p>
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

        <Section tone="forest">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="display-lg">Long tables for groups</h2>
              <p className="lede mt-4 !text-sand">Travelling together? The restaurant can seat your group around one table for breakfast, and once the all-day menu launches, for long lunches and dinners too. Let our team know your numbers and dates and they&rsquo;ll confirm the arrangements.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <a href={diningEnquiry} target="_blank" rel="noopener noreferrer" className="btn-ivory">Enquire on WhatsApp</a>
              <Link href="/groups" className="btn-outline-light">Group stays</Link>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
