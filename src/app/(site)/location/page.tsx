import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ImageBlock } from "@/components/ImageBlock";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MAPS_EMBED, MAPS_LINK, SITE, whatsappUrl } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Location & Directions | The Lavish Haven, Ahangama",
  socialTitle: "Finding The Lavish Haven, Ahangama",
  description: "Find us at 166/2 Welhengoda Road, Ahangama, between Galle and Weligama, two minutes' walk from Kabalana Beach. Airport transfers on request.",
  path: "/location",
});

export default function LocationPage() {
  return (
    <>
      <Header overlay />
      <main id="main">
        <PageHero
          kicker="Location"
          title="Ahangama, on the south coast"
          intro="Between Galle and Weligama, where the palms lean toward the sea, a short walk from Kabalana Beach."
          image={{ src: "/images/property/aerial-coastline.webp", alt: "Aerial view of the Ahangama coastline and village from above the hotel" }}
        >
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="btn-ivory">Open in Google Maps</a>
        </PageHero>

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="display-md text-forest">Address</h2>
              <address className="mt-4 text-[17px] not-italic leading-relaxed">
                The Lavish Haven<br />
                {SITE.address.street}<br />
                {SITE.address.locality} {SITE.address.postalCode}<br />
                {SITE.address.country}
              </address>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px]">
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="textlink">Directions in Google Maps</a>
                <a href={whatsappUrl("Hello The Lavish Haven, could you help me with directions and transport to the hotel?")} target="_blank" rel="noopener noreferrer" className="textlink">Ask about transport</a>
              </div>

              <h2 className="display-md mt-12 text-forest">Kabalana Beach</h2>
              <p className="body mt-4">Kabalana Beach is about a two-minute walk away, according to the hotel&rsquo;s listing, close enough to hear the swell. It&rsquo;s one of the south coast&rsquo;s best-known surf breaks: a sweep of sand, with cafés and surf shops along the road behind it.</p>

              <h2 className="display-md mt-12 text-forest">Getting here</h2>
              <ul className="body mt-4 space-y-3">
                <li>We can arrange airport pick-up and drop-off for a charge, so your journey ends gently. Ask for a quote when you enquire.</li>
                <li>Koggala&rsquo;s domestic airport is listed as about 5 km away; most international arrivals come through Colombo&rsquo;s Bandaranaike International Airport and travel south by road.</li>
                <li>Galle Fort and Weligama are both nearby, each worth a slow day out. Car rental is available on request.</li>
              </ul>
              <p className="small mt-4 text-charcoal-mute">Journey times and transfer prices are confirmed by the hotel team.</p>
            </div>

            <div className="lg:col-span-8">
              <div className="img-frame aspect-[4/3] lg:aspect-[16/11]">
                <iframe
                  title="Map showing The Lavish Haven, Ahangama"
                  src={MAPS_EMBED}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </div>
          </div>
        </Section>

        <Section tone="deep" compact>
          <div className="grid gap-4 md:grid-cols-3">
            <ImageBlock src="/images/property/aerial-coast-surf.webp" alt="Waves breaking along the Ahangama reef" aspect="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" />
            <ImageBlock src="/images/property/aerial-ocean-horizon.webp" alt="Palms and rooftops stretching to the ocean" aspect="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" />
            <ImageBlock src="/images/property/aerial-palms.webp" alt="The hotel among coconut palms from above" aspect="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" />
          </div>
        </Section>

        <Section>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className="display-lg text-forest">Let us guide you here</h2>
              <p className="lede mt-4">Our team can arrange your transfer and suggest the easiest route, so you arrive rested and ready for the coast.</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <Link href="/contact" className="btn-forest">Contact the Haven</Link>
            </div>
          </div>
        </Section>
      </main>
      <WhatsAppFloat />
    </>
  );
}
