import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";
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
  openGraph: {
    title: "Aitken Travels \u2014 Reliable Transport Services Across Sri Lanka",
    description:
      "Cars, vans, buses & bikes \u2014 your ride across Sri Lanka, handled with care.",
    type: "website",
    locale: "en_US",
    siteName: "Aitken Travels",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${batangas.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
