import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ImageBlock } from "@/components/ImageBlock";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dining",
  description: "The restaurant at The Lavish Haven, Ahangama serves breakfast and an international menu beside the pool. Enquire about dining, dietary needs and group meals.",
  alternates: { canonical: "/dining" },
};

export default function DiningPage() {
  const diningEnquiry = whatsappUrl("Hello The Lavish Haven, I'd like to ask about dining at the restaurant.\n\nDates: \nNumber of guests: \nDietary needs or requests: ");
  return (
    <>
      <Header overlay />
      <main id="main">
        <PageHero
          kicker="Dining"
          title="Breakfast by the pool, dinner under the lanterns"
          intro="An open-sided restaurant looks onto the pool from the ground floor, with timber tables, woven lanterns and a bar at the back."
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
              <p className="lede">The kitchen cooks across several traditions: Sri Lankan and Indian dishes alongside Chinese, British and Mediterranean plates, so a table can order in different directions and still eat together.</p>
              <p className="body mt-5">Breakfast is served each morning with continental, full English and vegetarian options and fresh fruit. Kids&rsquo; meals are available, packed lunches can be arranged for early surf starts or day trips, and room service is offered if you&rsquo;d rather eat on your balcony. There&rsquo;s also a coffee house and a bar and lounge area.</p>
              <p className="body mt-5">Tell the team about dietary requirements when you enquire and they&rsquo;ll confirm what the kitchen can do.</p>
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
              <p className="lede mt-4 !text-sand">Travelling as a party? The restaurant can seat a group together. Let the team know numbers and dates and they&rsquo;ll confirm arrangements.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <a href={diningEnquiry} target="_blank" rel="noopener noreferrer" className="btn-ivory">Enquire on WhatsApp</a>
              <Link href="/groups" className="btn-outline-light">Group stays</Link>
            </div>
          </div>
        </Section>
      </main>
      <WhatsAppFloat />
    </>
  );
}
