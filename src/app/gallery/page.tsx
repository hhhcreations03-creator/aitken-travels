import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { Section } from "@/components/Section";
import { GalleryTabs } from "@/components/GalleryTabs";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { GALLERY } from "@/lib/gallery";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Photo Gallery | The Lavish Haven, Ahangama",
  socialTitle: "Gallery of The Lavish Haven",
  description: "See The Lavish Haven in photographs: the pool and gardens, the rooms and suites, the restaurant, yoga on the terrace and the surf coast of Ahangama.",
  path: "/gallery",
});

export default function GalleryPage() {
  const total = GALLERY.reduce((n, c) => n + c.images.length, 0);
  return (
    <>
      <Header overlay />
      <main id="main">
        <PageHero
          kicker="Gallery"
          title="The Haven, as it is"
          intro={`${total} photographs of the house, the rooms and the coast around Ahangama.`}
          image={{ src: "/images/property/aerial-night-pool.webp", alt: "Night-time aerial view of the illuminated pool and courtyard" }}
        />
        <Section>
          <GalleryTabs categories={GALLERY} />
        </Section>
      </main>
      <WhatsAppFloat />
    </>
  );
}
