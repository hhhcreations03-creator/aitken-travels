"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BLOG_POSTS } from "@/lib/blog-data";
import { SectionHead } from "../SectionHead";

// Show the first 3 blog posts on the homepage
const FEATURED = BLOG_POSTS.slice(0, 3);

export function Stories() {
  return (
    <section id="stories" className="section-padding bg-white">
      <div className="content-max">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <SectionHead
            eyebrow="Our blog"
            title={
              <>
                Travel guides &amp;{" "}
                <em className="gradient-text-accent not-italic">tips</em>
              </>
            }
            sub="Expert advice, route guides, and honest comparisons to help you plan your Sri Lanka trip."
          />
          <Link
            href="/blog"
            className="link-arrow flex-shrink-0"
          >
            View all articles &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 2xl:gap-10">
          {FEATURED.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-2xl overflow-hidden bg-white shadow-elevation-1 hover:shadow-elevation-2 hover:-translate-y-1.5 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[11px] font-mono tracking-[0.1em] text-primary-700 font-semibold">
                    {post.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mb-3">
                    <span>{post.publishedAt}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-display text-[20px] font-semibold leading-tight text-slate-900 group-hover:text-primary-700 transition-colors duration-300 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
