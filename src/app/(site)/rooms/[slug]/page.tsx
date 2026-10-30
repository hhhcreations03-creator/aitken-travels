import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { GalleryGrid } from "@/components/GalleryGrid";
import { RoomCard, roomEnquiryMessage } from "@/components/RoomCard";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ROOMS, getRoom } from "@/lib/rooms";
import { SITE, whatsappUrl } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return ROOMS.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const room = getRoom(params.slug);
  if (!room) return {};
  return pageMeta({
    title: roomTitle(room.shortName),
    socialTitle: `${room.name} at The Lavish Haven`,
    description: roomDescription(room),
    path: `/rooms/${room.slug}`,
  });
}

function roomTitle(shortName: string): string {
  const full = `${shortName} | The Lavish Haven, Ahangama`;
  return full.length <= 60 ? full : `${shortName} | The Lavish Haven`;
}

function roomDescription(room: NonNullable<ReturnType<typeof getRoom>>): string {
  const base = `${room.name}: ${room.sizeSqm} m², ${room.beds}, ${room.outdoor.toLowerCase()}.`;
  const tail = " A short walk from Kabalana Beach, Ahangama. Book direct with the hotel.";
  const full = base + tail;
  return full.length <= 158 ? full : `${base} Near Kabalana Beach. Book direct.`;
}

export default function RoomPage({ params }: { params: { slug: string } }) {
  const room = getRoom(params.slug);
  if (!room) notFound();

  const others = ROOMS.filter((r) => r.slug !== room.slug && r.category === room.category).slice(0, 3);
  const schema = {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: room.name,
    description: room.description,
    image: room.images.map((i) => `${SITE.url}${i.src}`),
    floorSize: { "@type": "QuantitativeValue", value: room.sizeSqm, unitCode: "MTK" },
    bed: { "@type": "BedDetails", typeOfBed: room.beds },
    containedInPlace: { "@type": "Hotel", name: SITE.name, url: SITE.url },
  };

  return (
    <>
      <Header overlay />
      <main id="main">
        <PageHero kicker={`${room.floor}, ${room.sizeSqm} m²`} title={room.name} image={room.images[0]}>
          <Link href={`/book?room=${room.slug}`} className="btn-ivory">Check availability</Link>
          <a href={whatsappUrl(roomEnquiryMessage(room))} target="_blank" rel="noopener noreferrer" className="btn-outline-light">Enquire about this room</a>
        </PageHero>

        <Section>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="lede">{room.description}</p>
              <dl className="rule mt-10 grid gap-y-5 pt-8 sm:grid-cols-2">
                <div><dt className="small text-charcoal-mute">Beds</dt><dd className="mt-1 text-[16px]">{room.beds}</dd></div>
                <div><dt className="small text-charcoal-mute">Size</dt><dd className="mt-1 text-[16px]">{room.sizeSqm} m²</dd></div>
                <div><dt className="small text-charcoal-mute">Floor</dt><dd className="mt-1 text-[16px]">{room.floor}</dd></div>
                <div><dt className="small text-charcoal-mute">Outdoor space</dt><dd className="mt-1 text-[16px]">{room.outdoor}</dd></div>
                <div className="sm:col-span-2"><dt className="small text-charcoal-mute">Views</dt><dd className="mt-1 text-[16px]">{room.views.join(", ")}</dd></div>
              </dl>
              <h2 className="display-sm mt-10 text-forest">In the room</h2>
              <ul className="mt-4 grid gap-x-8 gap-y-2 text-[15px] text-charcoal-soft sm:grid-cols-2">
                {room.features.map((f) => (
                  <li key={f} className="flex gap-3"><span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-olive" />{f}</li>
                ))}
              </ul>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="sticky top-28 rounded-[2px] border border-[color:var(--line)] bg-white/50 p-6">
                <h2 className="display-sm text-forest">Stay in this room</h2>
                <p className="body mt-2">Share your dates and our team will confirm availability, your rate and the next steps with you personally. Nothing is confirmed until we reply.</p>
                <div className="mt-6 grid gap-3">
                  <Link href={`/book?room=${room.slug}`} className="btn-forest w-full">Check availability</Link>
                  <a href={whatsappUrl(roomEnquiryMessage(room))} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">Enquire on WhatsApp</a>
                  <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" className="textlink mx-auto mt-2 text-[14px]">Or view on Booking.com</a>
                </div>
              </div>
            </aside>
          </div>
        </Section>

        <Section tone="deep">
          <h2 className="display-md text-forest">Photographs</h2>
          <div className="mt-8">
            <GalleryGrid images={room.images} />
          </div>
        </Section>

        {others.length > 0 && (
          <Section>
            <h2 className="display-md text-forest">Similar rooms</h2>
            <div className="mt-10 grid gap-10 md:grid-cols-2 xl:grid-cols-3">
              {others.map((r) => <RoomCard key={r.slug} room={r} />)}
            </div>
            <Link href="/rooms" className="btn-outline mt-12">All rooms and suites</Link>
          </Section>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </main>
      <WhatsAppFloat />
    </>
  );
}
