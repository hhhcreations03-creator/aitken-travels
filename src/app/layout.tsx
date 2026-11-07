import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { MAPS_LINK, SITE } from "@/lib/site";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
  applicationName: SITE.name,
  title: {
    default: "The Lavish Haven | Luxury Boutique Hotel in Ahangama, Sri Lanka",
    template: "%s | The Lavish Haven",
  },
  description:
    "Luxury boutique hotel in Ahangama, Sri Lanka, two minutes' walk from Kabalana Beach: 23 rooms and suites around a palm-shaded pool, with yoga and an in-house restaurant.",
  keywords: [
    "The Lavish Haven",
    "hotels in Ahangama",
    "Ahangama hotel",
    "where to stay in Ahangama",
    "hotel with pool Ahangama",
    "boutique hotel Ahangama",
    "luxury boutique hotel Ahangama",
    "luxury boutique hotel Sri Lanka",
    "luxury hotel Ahangama",
    "boutique hotel Sri Lanka south coast",
    "luxury hotel near Galle",
    "Kabalana Beach hotel",
    "hotel near Kabalana",
    "surf stay Ahangama",
    "Ahangama accommodation",
    "group accommodation Ahangama",
  ],
  category: "travel",
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: SITE.name,
    url: "/",
    title: "The Lavish Haven, Ahangama",
    description:
      "Luxury boutique hotel in Ahangama, Sri Lanka, two minutes' walk from Kabalana Beach: 23 rooms and suites around a palm-shaded pool, with yoga and an in-house restaurant.",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "The Lavish Haven pool and courtyard at dusk, Ahangama", type: "image/jpeg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Lavish Haven, Ahangama",
    description:
      "Luxury boutique hotel in Ahangama, Sri Lanka, two minutes' walk from Kabalana Beach: 23 rooms and suites around a palm-shaded pool, with yoga and an in-house restaurant.",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "The Lavish Haven pool and courtyard at dusk, Ahangama" }],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { title: SITE.name, statusBarStyle: "default" },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "_5KBqgS8CUwt4YRxTpLY0swL_A4wVnvSW3efqgx4Cdo",
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = {
  themeColor: "#1E3A2F",
  width: "device-width",
  initialScale: 1,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}/#website`,
  name: SITE.name,
  alternateName: ["Lavish Haven", "The Lavish Haven Ahangama"],
  url: `${SITE.url}/`,
};

const hotelSchema = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  "@id": `${SITE.url}/#hotel`,
  name: SITE.name,
  alternateName: ["Lavish Haven Ahangama", "The Lavish Haven Luxury Boutique Hotel"],
  slogan: "A luxury boutique hotel in Ahangama, Sri Lanka",
  url: `${SITE.url}/`,
  sameAs: [SITE.bookingUrl],
  description:
    "Luxury boutique hotel in Ahangama, Sri Lanka, two minutes' walk from Kabalana Beach, with an outdoor pool, yoga classes and an in-house restaurant.",
  image: [`${SITE.url}/og.jpg?v=2`, `${SITE.url}/images/property/pool-dusk-wide.webp`],
  logo: `${SITE.url}/brand/logo.png`,
  hasMap: MAPS_LINK,
  email: SITE.email,
  telephone: SITE.whatsappE164,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.locality,
    addressRegion: "Southern Province",
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.countryCode,
  },
  checkinTime: "14:00",
  containsPlace: {
    "@type": "Restaurant",
    name: `Restaurant at ${SITE.name}`,
    servesCuisine: ["Sri Lankan", "Indian", "Chinese", "British", "Mediterranean"],
    address: { "@type": "PostalAddress", streetAddress: SITE.address.street, addressLocality: SITE.address.locality, postalCode: SITE.address.postalCode, addressCountry: SITE.address.countryCode },
  },
  containedInPlace: { "@type": "Place", name: "Ahangama, Sri Lanka" },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Outdoor swimming pool", value: true },
    { "@type": "LocationFeatureSpecification", name: "On-site restaurant", value: true },
    { "@type": "LocationFeatureSpecification", name: "Room service", value: true },
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
        <Analytics />
        <SpeedInsights />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([websiteSchema, hotelSchema]) }} />
      </body>
    </html>
  );
}
