import type { Metadata } from "next";
import Link from "next/link";
import { ContactContent } from "./ContactContent";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Us | Aitken Travels — Get in Touch",
  description: "Contact Aitken Travels for transport services across Sri Lanka. Reach us via WhatsApp, email, or phone. We respond within 1 hour.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Aitken Travels",
    description: "Get in touch with Aitken Travels for bookings, inquiries, and support.",
    type: "website",
    siteName: "Aitken Travels",
  },
  twitter: {
    card: "summary_large_image",
    site: "@aitkentravels",
  },
};

export default function ContactPage() {
  const contactJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact Aitken Travels",
      description:
        "Contact Aitken Travels for transport services across Sri Lanka. Reach us via WhatsApp, email, or phone.",
      url: "https://www.aitkentravels.com/contact",
      mainEntity: {
        "@type": "Organization",
        name: "Aitken Travels",
        telephone: "+94770813690",
        email: "travelsaitken@gmail.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.aitkentravels.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Contact",
          item: "https://www.aitkentravels.com/contact",
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-[100] py-3">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto px-6 md:px-10 2xl:px-24">
          <Link href="/" className="flex items-center min-h-[44px] -mt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Aitken Travels" className="h-40 md:h-44 w-auto object-contain" />
          </Link>
          <div className="hidden md:flex items-center gap-8 -mt-6">
            {[{ label: "Home", href: "/" }, { label: "Services", href: "/#services" }, { label: "Fleet", href: "/#fleet" }, { label: "Blog", href: "/blog" }, { label: "Contact", href: "/contact" }].map((item) => (
              <Link key={item.label} href={item.href} className={`text-[13px] font-medium min-h-[44px] flex items-center ${item.label === "Contact" ? "text-white" : "text-white/80 hover:text-white"} transition-colors`}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative min-h-[380px] md:min-h-[420px] flex items-end overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 2xl:px-24 pb-12 md:pb-16 pt-32">
            <div className="max-w-[1600px] mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-300" />
                <span className="font-mono text-[12px] tracking-[0.16em] uppercase font-semibold text-primary-300">Get in touch</span>
                <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-300 to-primary-400" />
              </div>
              <h1 className="font-display font-bold text-white leading-[1.05] text-[clamp(36px,5vw,56px)]">
                We&apos;d love to hear{" "}<span className="text-primary-300">from you</span>
              </h1>
              <p className="text-[16px] md:text-[18px] text-white/50 mt-4 max-w-[480px] mx-auto leading-relaxed">
                Have a question or ready to book? Reach out and we&apos;ll get back to you within the hour.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content (client component for form) */}
        <ContactContent />
      </main>

      <Footer />
    </>
  );
}
