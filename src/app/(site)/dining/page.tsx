import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ImageBlock } from "@/components/ImageBlock";
import { whatsappUrl } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Restaurant & Breakfast in Ahangama | The Lavish Haven",
  socialTitle: "Dining at The Lavish Haven",
  description: "Breakfast by the pool and dinner under the lanterns: Sri Lankan, Indian, Chinese, British and Mediterranean dishes at our open-air restaurant in Ahangama.",
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
          intro="Our open-sided restaurant looks out over the pool from the ground floor. Timber tables, woven lanterns and a bar at the back, where the evening air drifts in from the garden."
          image={{ src: "/images/dining/restaurant-lanterns.webp", alt: "The restaurant at night, lit by woven lanterns above timber tables" }}
        >
          <a href={diningEnquiry} target="_blank" rel="noopener noreferrer" className="btn-ivory">Enquire about dining</a>
        </PageHero>

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="display-lg text-forest">The restaurant</h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="lede">Our kitchen cooks across many traditions. Sri Lankan and Indian dishes sit beside Chinese, British and Mediterranean plates, so everyone at the table can follow their own appetite and still share the meal.</p>
              <p className="body mt-5">Mornings begin with breakfast: continental, full English and vegetarian options, with fresh fruit. Kids&rsquo; meals are available, packed lunches can be arranged for early surf starts or days out, and room service is offered if you&rsquo;d rather linger on your balcony. There&rsquo;s also a coffee house, and a bar and lounge for when the day softens into evening.</p>
              <p className="body mt-5">Share any dietary requirements when you enquire and our team will confirm what the kitchen can prepare for you.</p>
            </div>
          </div>
        </Section>

        <Section tone="deep" compact>
          <div className="grid gap-4 md:grid-cols-12">
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
            <dl className="lg:col-span-6 lg:col-start-7 grid gap-6 sm:grid-cols-2">
              {[
                ["Breakfast", "Continental, full English and vegetarian options with fruit."],
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
