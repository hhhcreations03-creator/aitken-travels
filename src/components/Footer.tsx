import Link from "next/link";
import { Logo } from "./Logo";
import { MAPS_LINK, NAV, SITE, whatsappUrl } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-forest text-ivory">
      <div className="wrap py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo light />
            <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-sand/85">
              A boutique hotel on Welhengoda Road, a short walk from Kabalana Beach on Sri Lanka&rsquo;s southern coast.
            </p>
            <Link href="/enquire" className="btn-ivory mt-8">Enquire About Your Stay</Link>
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
              <li><Link className="text-ivory/85 hover:text-ivory" href="/enquire">Availability enquiry</Link></li>
            </ul>
          </nav>

          <div>
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

        <div className="mt-14 flex flex-col gap-3 border-t border-ivory/10 pt-6 text-[13px] text-sand-deep/80 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} The Lavish Haven, Ahangama. All rights reserved.</p>
          <p>Enquiries are confirmed directly by the hotel team. This site does not take payments.</p>
        </div>
      </div>
    </footer>
  );
}
