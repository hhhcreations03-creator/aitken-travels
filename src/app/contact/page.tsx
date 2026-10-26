import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { MAPS_LINK, SITE, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact The Lavish Haven, Ahangama by email at hello@thelavishhaven.com or WhatsApp +94 76 483 2968. 166/2 Welhengoda Road, Ahangama 80650, Sri Lanka.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Header overlay />
      <main id="main">
        <PageHero
          kicker="Contact"
          title="Write to us"
          intro="For stays, groups, dining and anything else. The team replies directly."
          image={{ src: "/images/property/lobby-wide.webp", alt: "The lobby with marble floor, timber balustrades and rattan seating" }}
        />

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <dl className="grid gap-7">
                <div className="rule pt-5">
                  <dt className="small text-charcoal-mute">Email</dt>
                  <dd className="mt-1 text-[17px]"><a className="textlink" href={`mailto:${SITE.email}`}>{SITE.email}</a></dd>
                </div>
                <div className="rule pt-5">
                  <dt className="small text-charcoal-mute">WhatsApp</dt>
                  <dd className="mt-1 text-[17px]"><a className="textlink" href={whatsappUrl("Hello The Lavish Haven")} target="_blank" rel="noopener noreferrer">{SITE.whatsappDisplay}</a></dd>
                  <dd className="mt-3"><a href={whatsappUrl("Hello The Lavish Haven, I'd like to ask about a stay.")} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">Chat on WhatsApp</a></dd>
                </div>
                <div className="rule pt-5">
                  <dt className="small text-charcoal-mute">Address</dt>
                  <dd className="mt-1 text-[17px] leading-relaxed">
                    <address className="not-italic">
                      {SITE.address.street}<br />{SITE.address.locality} {SITE.address.postalCode}<br />{SITE.address.country}
                    </address>
                    <a className="textlink mt-2 inline-block text-[14.5px]" href={MAPS_LINK} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
                  </dd>
                </div>
                <div className="rule pt-5">
                  <dt className="small text-charcoal-mute">Check-in</dt>
                  <dd className="mt-1 text-[17px]">From {SITE.checkIn}</dd>
                </div>
              </dl>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <h2 className="display-md text-forest">Send a message</h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </Section>
      </main>
      <WhatsAppFloat />
    </>
  );
}
