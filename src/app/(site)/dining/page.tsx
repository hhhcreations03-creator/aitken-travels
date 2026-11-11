import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ImageBlock } from "@/components/ImageBlock";
import { whatsappUrl } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { NEARBY } from "@/lib/nearby";
import { BreakfastMenu } from "@/components/BreakfastMenu";
import { BREAKFAST_DISH_COUNT } from "@/lib/breakfast";

export const metadata: Metadata = pageMeta({
  title: "Restaurant & Breakfast in Ahangama | The Lavish Haven",
  socialTitle: "Dining at The Lavish Haven",
  description: "Complimentary breakfast cooked to order, from coconut roti and egg hoppers to a full English, and an open-air restaurant in Ahangama serving Sri Lankan, Indian, Chinese, British and Mediterranean dishes.",
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
          title="Breakfast by the pool, dinner under the lanterns"
          intro="It starts with coffee and fruit in the morning light, and ends with the lanterns glowing above timber tables while the garden breathes in the evening air. In between, the restaurant is wherever you want it to be: the courtyard, the lounge, or your own balcony."
          image={{ src: "/images/dining/restaurant-lanterns.webp", alt: "The restaurant at night, lit by woven lanterns above timber tables" }}
        >
          <a href="#breakfast" className="btn-ivory">See the breakfast menu</a>
          <a href={diningEnquiry} target="_blank" rel="noopener noreferrer" className="btn-outline-light">Enquire about dining</a>
        </PageHero>

        <Section tone="forest" id="breakfast" className="scroll-mt-16">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6">
              <p className="font-display text-[1.1rem] italic text-sand">Breakfast is on us</p>
              <h2 className="display-lg mt-3">A breakfast unlike any other in Ahangama</h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="lede !text-ivory/85">Every morning of your stay, choose from {BREAKFAST_DISH_COUNT} dishes, each cooked to order by our professional chef and served with fresh fruit, juice or king coconut, and Ceylon tea or coffee. It&rsquo;s all complimentary.</p>
              <p className="body mt-5 !text-ivory/75">Our head chef comes out to the tables to ask how you enjoyed it, and takes what you say back to the kitchen.</p>
            </div>
          </div>
          <div className="mt-10 md:mt-14">
            <BreakfastMenu />
          </div>
          <div className="mt-6">
            <a href="/images/dining/breakfast-menu.webp" target="_blank" rel="noopener" className="text-[14.5px] text-ivory underline decoration-ivory/40 underline-offset-4 hover:decoration-ivory">See the printed menu</a>
          </div>
        </Section>

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">Our in-house restaurant</h2>
              <p className="body mt-4 max-w-[34ch]">The Lavish Haven has its own open-air restaurant beside the pool, so a good meal is never more than a few steps from your room.</p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="lede">Our kitchen tells the island&rsquo;s story, and a few others besides. Sri Lankan and Indian curries share the table with Chinese, British and Mediterranean plates, so everyone can follow their own appetite and still pass the dishes around.</p>
              <p className="body mt-5">Mornings begin with our complimentary breakfast, cooked to order: Sri Lankan, Indian and English plates, eggs any way, bowls and pancakes, always with fresh fruit. Kids&rsquo; meals are available, packed lunches can be arranged for early surf starts or days out, and room service is offered if you&rsquo;d rather linger on your balcony. There&rsquo;s also a coffee house, and a bar and lounge for when the day softens into evening.</p>
              <p className="body mt-5">Share any dietary requirements when you enquire and our team will confirm what the kitchen can prepare for you.</p>
            </div>
          </div>
        </Section>

        <Section tone="deep" compact>
          <div className="rail-md rail-photos grid gap-4 md:grid-cols-12">
            <ImageBlock src="/images/dining/restaurant-terrace.webp" alt="The open-air restaurant terrace by day" aspect="aspect-[4/3]" sizes="(min-width: 768px) 58vw, 100vw" className="md:col-span-7" />
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
                ["Cuisines", "Sri Lankan, Indian, Chinese, British and Mediterranean."],
                ["Families", "Kids' meals available."],
                ["On the move", "Packed lunches and room service on request."],
                ["Drinks", "Coffee house, bar and lounge."],
                ["Dietary needs", "Tell the team in advance and they'll confirm."],
              ].map(([k, v]) => (
                <div key={k} className="rule-soft pt-4">
                  <dt className="text-[15px] font-medium text-forest">{k}</dt>
                  <dd className="body mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="small mt-10 max-w-[60ch] text-charcoal-mute">Menus, prices and serving hours are confirmed by the hotel team at the time of your enquiry.</p>
        </Section>

        <Section tone="deep">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-display text-[1.1rem] italic text-olive-deep">Dining out in Ahangama</p>
              <h2 className="display-lg mt-3 text-forest">Five minutes by tuk-tuk, a whole village of flavour</h2>
              <p className="lede mt-5">Our kitchen will always feed you well. But part of the joy of Ahangama is wandering out for the evening, and the village&rsquo;s most loved places are all within about five minutes of our gate.</p>
              <p className="body mt-5">Just tell our team where you&rsquo;d like to go, and your tuk-tuk will be waiting.</p>
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
              <h2 className="display-lg">Group dinners and long tables</h2>
              <p className="lede mt-4 !text-sand">Travelling together? The restaurant can seat your group around one table, for evenings of shared plates and long conversation. Let our team know your numbers and dates and they&rsquo;ll confirm the arrangements.</p>
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
