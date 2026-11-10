import Link from "next/link";
import { Logo } from "./Logo";
import { MAPS_LINK, NAV, SITE, whatsappUrl } from "@/lib/site";
import { TideLine } from "./Motifs";
import { AhangamaToday } from "./AhangamaToday";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer bg-lagoon text-ivory">
      <div className="pt-6 text-sand/40"><TideLine /></div>
      <div className="wrap py-10 sm:py-14 lg:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <Logo light stacked />
            <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-sand/85">
              A luxury boutique hotel among the palms of Welhengoda Road, Ahangama. Two minutes from the waves, a world away from everything else.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 lg:mt-8">
              <Link href="/book" className="btn-ivory">Book Your Stay</Link>
              <a href={whatsappUrl("Hello The Lavish Haven, I'd like to ask about a stay.")} target="_blank" rel="noopener noreferrer" className="btn-outline-light lg:hidden">WhatsApp</a>
            </div>
          </div>

          <nav aria-label="Footer, pages">
            <h2 className="font-display text-[1.1rem] text-sand">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">
              {NAV.slice(0, 5).map((n) => (
                <li key={n.href}><Link className="text-ivory/85 hover:text-ivory" href={n.href}>{n.label}</Link></li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer, more pages">
            <h2 className="font-display text-[1.1rem] text-sand">The Haven</h2>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">
              {NAV.slice(5).map((n) => (
                <li key={n.href}><Link className="text-ivory/85 hover:text-ivory" href={n.href}>{n.label}</Link></li>
              ))}
              <li><Link className="text-ivory/85 hover:text-ivory" href="/book">Book your stay</Link></li>
            </ul>
          </nav>

          <div className="col-span-2 lg:col-span-1">
            <h2 className="font-display text-[1.1rem] text-sand">Reach us</h2>
            <address className="mt-4 space-y-2.5 text-[14.5px] not-italic text-ivory/85">
              <p>
                <a className="hover:text-ivory" href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
              <p>
                <a className="hover:text-ivory" href={whatsappUrl("Hello The Lavish Haven")} target="_blank" rel="noopener noreferrer">
                  WhatsApp {SITE.whatsappDisplay}
                </a>
              </p>
              <p>
                <a className="hover:text-ivory" href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
                  {SITE.address.street}<br />
                  {SITE.address.locality} {SITE.address.postalCode}, {SITE.address.country}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t lg:mt-14 border-ivory/10 pt-6 text-[13px] text-sand-deep/80 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} The Lavish Haven, Ahangama. All rights reserved.</p>
          <AhangamaToday className="font-display text-[14.5px] italic text-sand/85" />
          <p>Enquiries are confirmed directly by the hotel team. This site does not take payments.</p>
        </div>
      </div>
    </footer>
  );
}
