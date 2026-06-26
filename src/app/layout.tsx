import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const batangas = localFont({
  src: [{ path: "../../public/fonts/Batangas.otf", weight: "400", style: "normal" }],
  variable: "--font-batangas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aitkentravels.com"),
  title: "Aitken Travels \u2014 Reliable Transport Services Across Sri Lanka",
  description:
    "Aitken Travels provides cars, vans, buses, and bikes for airport transfers, round-island tours, corporate transport, and self-drive rentals across Sri Lanka.",
  keywords: [
    "Sri Lanka transport",
    "car hire Sri Lanka",
    "van rental Sri Lanka",
    "airport transfer Colombo",
    "Aitken Travels",
    "bus rental Sri Lanka",
    "motorbike rental",
    "chauffeur service",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Aitken Travels \u2014 Reliable Transport Services Across Sri Lanka",
    description:
      "Cars, vans, buses & bikes \u2014 your ride across Sri Lanka, handled with care.",
    type: "website",
    locale: "en_US",
    siteName: "Aitken Travels",
  },
  twitter: {
    card: "summary_large_image",
    site: "@aitkentravels",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": ["Organization", "LocalBusiness"],
                name: "Aitken Travels",
                description:
                  "Aitken Travels provides cars, vans, buses, and bikes for airport transfers, round-island tours, corporate transport, and self-drive rentals across Sri Lanka.",
                url: "https://www.aitkentravels.com",
                logo: "https://www.aitkentravels.com/logo.png",
                telephone: "+94770813690",
                email: "travelsaitken@gmail.com",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Galle",
                  addressCountry: "LK",
                },
                sameAs: [
                  "https://www.facebook.com/profile.php?id=61576498498498",
                  "https://www.instagram.com/aitken.travels/",
                  "https://www.tiktok.com/@aitken.travels",
                ],
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.8",
                  reviewCount: "500",
                  bestRating: "5",
                },
                priceRange: "$$",
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Aitken Travels",
                url: "https://www.aitkentravels.com",
                potentialAction: {
                  "@type": "SearchAction",
                  target:
                    "https://www.aitkentravels.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
      </head>
      <body
        className={`${batangas.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
