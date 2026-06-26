import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/lib/blog-data";

// ─── Static Params ──────────────────────────────────────────────────

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

// ─── Dynamic Metadata ───────────────────────────────────────────────

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} | Aitken Travels Blog`,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
      siteName: "Aitken Travels",
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      site: "@aitkentravels",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image, alt: post.title }],
    },
  };
}

// ─── Helper: Get related posts ──────────────────────────────────────

function getRelatedPosts(currentSlug: string, count: number) {
  const others = BLOG_POSTS.filter((p) => p.slug !== currentSlug);
  const shuffled = [...others].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ─── Page Component ─────────────────────────────────────────────────

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Aitken Travels",
      logo: {
        "@type": "ImageObject",
        url: "https://www.aitkentravels.com/logo.png",
      },
    },
  };

  return (
    <main className="min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back Link */}
      <div className="px-6 md:px-10 lg:px-16 2xl:px-24 pb-0 pt-20 relative z-[101]">
        <div className="content-max">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-primary-700 hover:text-primary-900 transition-colors duration-200"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="rotate-180"
            >
              <path
                d="M6 12l4-4-4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to blog
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <section className="px-6 md:px-10 lg:px-16 2xl:px-24 pt-8">
        <div className="content-max">
          <div className="relative rounded-3xl overflow-hidden aspect-[21/9] md:aspect-[21/8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

            {/* Content on image */}
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 lg:p-14">
              {/* Category pill */}
              <span className="inline-block bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 text-[11px] font-mono tracking-[0.12em] text-slate-700 uppercase mb-4">
                {post.category}
              </span>
              <h1 className="font-display font-bold text-white leading-[1.1] text-[clamp(24px,4vw,48px)] max-w-[900px]">
                {post.title}
              </h1>
              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-3 mt-4 text-[13px] text-white/80 font-mono tracking-wide">
                <span>{post.author}</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article + Sidebar */}
      <section className="section-padding pt-12 md:pt-16">
        <div className="content-max">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Article Body — 65% */}
            <article className="lg:w-[65%] min-w-0">
              {post.content.map((block, i) => {
                switch (block.type) {
                  case "h2":
                    return (
                      <h2
                        key={i}
                        className="font-display text-[28px] font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4 mt-10 first:mt-0"
                      >
                        {block.text}
                      </h2>
                    );
                  case "h3":
                    return (
                      <h3
                        key={i}
                        className="font-display text-[22px] font-semibold text-slate-800 mt-8 mb-3"
                      >
                        {block.text}
                      </h3>
                    );
                  case "p":
                    return (
                      <p
                        key={i}
                        className="text-[16px] text-slate-600 leading-[1.8] mb-4"
                      >
                        {block.text}
                      </p>
                    );
                  case "list":
                    return (
                      <ul
                        key={i}
                        className="pl-6 list-disc text-slate-600 space-y-2 mb-4"
                      >
                        {block.items?.map((item, j) => (
                          <li
                            key={j}
                            className="text-[16px] leading-[1.7]"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    );
                  default:
                    return null;
                }
              })}
            </article>

            {/* Sidebar — 35% */}
            <aside className="lg:w-[35%] shrink-0">
              <div className="lg:sticky lg:top-8 space-y-8">
                {/* Plan Your Trip CTA */}
                <div className="rounded-2xl bg-gradient-to-br from-primary-900 to-primary-700 p-6 md:p-8 text-white shadow-elevation-2">
                  <h3 className="font-display text-[22px] font-bold mb-2">
                    Plan Your Trip
                  </h3>
                  <p className="text-[14px] text-primary-100 leading-[1.6] mb-5">
                    Ready to explore Sri Lanka? Chat with our team on WhatsApp
                    for a personalised itinerary and transport quote.
                  </p>
                  <a
                    href="https://wa.me/94771234567?text=Hi%20Aitken%20Travels!%20I%27d%20like%20to%20plan%20a%20trip%20to%20Sri%20Lanka."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-primary-800 font-semibold text-[14px] rounded-full px-6 py-3 hover:bg-primary-50 transition-colors duration-200"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>

                {/* Tags Cloud */}
                <div className="rounded-2xl bg-white p-6 shadow-elevation-1">
                  <h4 className="font-display text-[16px] font-semibold text-slate-900 mb-4">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-primary-50 text-primary-700 text-[12px] font-medium rounded-full px-3 py-1.5 border border-primary-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related Posts (sidebar) */}
                <div className="rounded-2xl bg-white p-6 shadow-elevation-1">
                  <h4 className="font-display text-[16px] font-semibold text-slate-900 mb-4">
                    More Articles
                  </h4>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/blog/${r.slug}`}
                        className="group flex gap-3 items-start"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={r.image}
                            alt={r.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-slate-800 leading-snug group-hover:text-primary-700 transition-colors duration-200 line-clamp-2">
                            {r.title}
                          </p>
                          <span className="text-[11px] text-slate-400 font-mono mt-1 block">
                            {r.readTime}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Bottom: Related Articles */}
      <section className="section-padding pt-0">
        <div className="content-max">
          <div className="border-t border-slate-200 pt-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
              <span className="eyebrow">Related Articles</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-white shadow-elevation-1 hover:shadow-elevation-2 hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[11px] font-mono tracking-[0.1em] text-slate-700 uppercase">
                      {r.category}
                    </div>
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="font-display text-[20px] md:text-[22px] font-semibold leading-tight text-slate-900 group-hover:text-primary-700 transition-colors duration-300 mb-2">
                      {r.title}
                    </h3>
                    <p className="text-[14px] text-slate-500 leading-[1.6] line-clamp-2 mb-4">
                      {r.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-[12px] text-slate-400 font-mono tracking-wide">
                      <span>{r.author}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>
                        {new Date(r.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{r.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
