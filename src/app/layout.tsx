import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { Footer } from "@/components/Footer";

const display = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "The Lavish Haven | Boutique Hotel in Ahangama, Sri Lanka",
    template: "%s | The Lavish Haven",
  },
  description:
    "The Lavish Haven is a boutique hotel in Ahangama, a short walk from Kabalana Beach. King rooms, family suites, an outdoor pool, yoga and a restaurant. Enquire directly for your stay.",
  keywords: ["Ahangama hotel", "Kabalana Beach hotel", "boutique hotel Sri Lanka", "surf stay Ahangama", "The Lavish Haven", "group accommodation Ahangama"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: SITE.name,
    title: "The Lavish Haven | Boutique Hotel in Ahangama, Sri Lanka",
    description: "A refined coastal escape in Ahangama, a short walk from Kabalana Beach.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "The Lavish Haven pool at dusk" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export const viewport: Viewport = {
  themeColor: "#1E3A2F",
  width: "device-width",
  initialScale: 1,
};

const hotelSchema = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: SITE.name,
  url: SITE.url,
  image: `${SITE.url}/og.jpg`,
  logo: `${SITE.url}/brand/logo.svg`,
  email: SITE.email,
  telephone: SITE.whatsappE164,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.countryCode,
  },
  checkinTime: "14:00",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Outdoor swimming pool", value: true },
    { "@type": "LocationFeatureSpecification", name: "Restaurant", value: true },
    { "@type": "LocationFeatureSpecification", name: "Yoga classes", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free private parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory"
        >
          Skip to content
        </a>
        {children}
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelSchema) }} />
      </body>
    </html>
  );
}
