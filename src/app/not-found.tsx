import Link from "next/link";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="pt-[72px] lg:pt-[84px]">
        <Section>
          <div className="max-w-[40rem]">
            <h1 className="display-lg text-forest">That page isn&rsquo;t here</h1>
            <p className="lede mt-5">The link may be out of date. Try the rooms, or send an enquiry and the team will point you the right way.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="btn-forest">Back to the homepage</Link>
              <Link href="/rooms" className="btn-outline">Rooms & Suites</Link>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
