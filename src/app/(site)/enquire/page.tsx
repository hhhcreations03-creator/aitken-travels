import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { AvailabilityForm } from "@/components/forms/AvailabilityForm";
import { ImageBlock } from "@/components/ImageBlock";
import { SITE, whatsappUrl } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Check Availability | The Lavish Haven, Ahangama",
  socialTitle: "Check availability at The Lavish Haven",
  description: "Send your dates, room choice and guest numbers to The Lavish Haven. The team confirms availability and rates with you directly by email or WhatsApp.",
  path: "/enquire",
  noindex: true,
});

export default function EnquirePage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-[72px] lg:pt-[84px]">
        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h1 className="display-lg text-forest">Enquire about your stay</h1>
              <p className="lede mt-5">Tell us the room you have in mind, your dates and who&rsquo;s coming. The team replies to confirm availability, the rate and how to book.</p>
              <ul className="body mt-6 space-y-2">
                <li>Reply comes by email or WhatsApp, whichever you prefer.</li>
                <li>Nothing is reserved and no payment is taken until the team confirms with you.</li>
                <li>Not sure which room? Leave it blank and describe your group instead.</li>
              </ul>
              <div className="mt-8 hidden lg:block">
                <ImageBlock src="/images/property/pool-evening.webp" alt="The courtyard and pool in the evening" aspect="aspect-[4/5]" sizes="30vw" />
              </div>
              <p className="small mt-8 text-charcoal-mute">
                Prefer to write directly? <a className="textlink" href={`mailto:${SITE.email}`}>{SITE.email}</a> or <a className="textlink" href={whatsappUrl("Hello The Lavish Haven, I'd like to check availability.")} target="_blank" rel="noopener noreferrer">WhatsApp {SITE.whatsappDisplay}</a>.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <Suspense fallback={<p className="body">Loading the form…</p>}>
                <AvailabilityForm />
              </Suspense>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
