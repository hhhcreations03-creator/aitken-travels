import type { Metadata } from "next";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-data";
import { BlogList } from "./BlogList";

export const metadata: Metadata = {
  title: "Blog | Aitken Travels — Sri Lanka Travel Guides & Tips",
  description:
    "Expert travel guides, tips, and comparisons for Sri Lanka. Plan your perfect trip with insider advice on transport, itineraries, weather, and more from Aitken Travels.",
  keywords: [
    "Sri Lanka travel blog",
    "Sri Lanka travel tips",
    "Sri Lanka itinerary",
    "Sri Lanka transport guide",
    "Aitken Travels blog",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Aitken Travels — Sri Lanka Travel Guides & Tips",
    description:
      "Expert travel guides, tips, and comparisons for Sri Lanka.",
    type: "website",
    siteName: "Aitken Travels",
  },
  twitter: {
    card: "summary_large_image",
    site: "@aitkentravels",
  },
};

export default function BlogPage() {
  const breadcrumbJsonLd = {
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
        name: "Blog",
        item: "https://www.aitkentravels.com/blog",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#FFFBF5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative min-h-[420px] md:min-h-[480px] flex items-end overflow-hidden">
        {/* Background image — Sri Lanka scenic */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1749527834155-c174b504de84?w=1800&q=80)" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/40 to-slate-900/80" />

        {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 pb-12 md:pb-16 pt-32">
          <div className="max-w-[1360px] mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-300" />
              <span className="font-mono text-[12px] tracking-[0.16em] uppercase font-semibold text-primary-300">
                Our Blog
              </span>
              <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-300 to-primary-400" />
            </div>
            <h1 className="font-display font-bold text-white leading-[1.05] text-[clamp(36px,5vw,60px)]">
              Travel guides &amp;{" "}
              <span className="text-primary-300">tips</span>
            </h1>
            <p className="text-[16px] md:text-[18px] text-white/60 mt-4 max-w-[520px] mx-auto leading-relaxed">
              Insider advice, honest comparisons, and practical guides to help you
              plan the perfect Sri Lanka trip.
            </p>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-6 md:gap-10 mt-8">
              {[
                { num: "10", label: "Articles" },
                { num: "4", label: "Categories" },
                { num: "Free", label: "Always" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-display text-[24px] md:text-[28px] font-bold text-white leading-none">{s.num}</div>
                  <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/40 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog List */}
      <BlogList posts={BLOG_POSTS} categories={BLOG_CATEGORIES} />
    </main>
  );
}
