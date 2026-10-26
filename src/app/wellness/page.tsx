import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ImageBlock } from "@/components/ImageBlock";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wellness & Experiences",
  description: "An outdoor pool, yoga classes and a spa and wellness area at The Lavish Haven, Ahangama. Sessions and treatments are arranged on request; enquire directly.",
  alternates: { canonical: "/wellness" },
};

interface Experience {
  title: string;
  body: string;
  image: { src: string; alt: string };
  enquiry: string;
  confirmed: string;
}

const EXPERIENCES: Experience[] = [
  {
    title: "The pool",
    body: "A long outdoor pool runs through the middle of the house, overlooked by balconies on two floors. It's open year-round, has a shallow end, and there are loungers and a sun terrace around it for the hours when you're not in it.",
    image: { src: "/images/property/aerial-pool-swimmer.webp", alt: "Top-down aerial of a swimmer in the pool" },
    enquiry: "Hello The Lavish Haven, I'd like to ask about the pool and relaxation facilities during my stay.",
    confirmed: "Open to all guests throughout the stay.",
  },
  {
    title: "Yoga",
    body: "Yoga classes are offered at the Haven, on the terrace or by the pool. Sessions suit surfers working out tight shoulders as much as guests who simply want a slow start to the day. Tell us your level and preferred times when you enquire.",
    image: { src: "/images/wellness/yoga-stretch.webp", alt: "A side stretch on the covered terrace" },
    enquiry: "Hello The Lavish Haven, I'd like to enquire about yoga classes during my stay.\n\nDates: \nNumber of people: \nExperience level: ",
    confirmed: "Arranged on request. Schedule and any cost confirmed by the team.",
  },
  {
    title: "Spa and wellness",
    body: "The hotel has a spa and wellness area. Treatments are arranged on request rather than from a fixed menu, so let the team know what you'd like and when, and they'll confirm what's available during your dates.",
    image: { src: "/images/details/amenities-bottles.webp", alt: "Bathroom amenity bottles with the Haven's palm motif" },
    enquiry: "Hello The Lavish Haven, I'd like to enquire about spa or wellness treatments during my stay.\n\nDates: \nWhat I'm interested in: ",
    confirmed: "Arranged on request. Availability and pricing confirmed by the team.",
  },
  {
    title: "Slow afternoons",
    body: "Reading on a lounger, a fresh king coconut from the restaurant, an early dinner under the lanterns. Ahangama's cafés and surf shops are a short walk away when you want them, and Galle Fort and Weligama are close enough for a day trip.",
    image: { src: "/images/wellness/poolside-reading-coconut.webp", alt: "Reading with a fresh coconut beside the pool" },
    enquiry: "Hello The Lavish Haven, I'd like some help planning days out during my stay.",
    confirmed: "Ask the team for local recommendations and transport options.",
  },
];

export default function WellnessPage() {
  return (
    <>
      <Header overlay />
      <main id="main">
        <PageHero
          kicker="Wellness & Experiences"
          title="Slow mornings, long afternoons"
          intro="A pool at the centre of the house, yoga on the terrace and a wellness area for treatments on request. Nothing here is on a timetable unless you want it to be."
          image={{ src: "/images/wellness/yoga-balcony-reach.webp", alt: "A yoga pose on a first-floor balcony, palm fronds behind" }}
        >
          <a href={whatsappUrl("Hello The Lavish Haven, I'd like to ask about wellness and experiences during my stay.")} target="_blank" rel="noopener noreferrer" className="btn-ivory">Enquire on WhatsApp</a>
        </PageHero>

        {EXPERIENCES.map((x, i) => (
          <Section key={x.title} tone={i % 2 === 0 ? "ivory" : "deep"}>
            <div className={`grid gap-10 lg:grid-cols-12 lg:items-center`}>
              <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <ImageBlock src={x.image.src} alt={x.image.alt} aspect="aspect-[4/3]" sizes="(min-width: 1024px) 50vw, 100vw" priority={i === 0} />
              </div>
              <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-1" : "lg:col-start-8"}`}>
                <h2 className="display-lg text-forest">{x.title}</h2>
                <p className="body mt-5">{x.body}</p>
                <p className="small mt-4 text-charcoal-mute">{x.confirmed}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href={whatsappUrl(x.enquiry)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">Enquire on WhatsApp</a>
                  <Link href="/contact" className="btn-outline">Ask by email</Link>
                </div>
              </div>
            </div>
          </Section>
        ))}

        <Section tone="forest">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h2 className="display-lg">Wellness retreats for groups</h2>
              <p className="lede mt-5 !text-sand">Bringing a yoga group or a retreat? The house works well taken over by one party, with the pool, terrace and restaurant at your disposal. Tell us the dates and numbers and the team will confirm what&rsquo;s possible.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:col-start-9 lg:justify-end">
              <Link href="/groups" className="btn-ivory">Plan a group retreat</Link>
            </div>
          </div>
        </Section>
      </main>
      <WhatsAppFloat />
    </>
  );
}
