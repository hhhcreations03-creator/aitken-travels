"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { BlogPost } from "@/lib/blog-data";

interface BlogListProps {
  posts: BlogPost[];
  categories: readonly string[];
}

export function BlogList({ posts, categories }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <section className="section-padding pt-12 md:pt-16">
      <div className="content-max">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                "px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 border min-h-[44px]",
                activeCategory === cat
                  ? "bg-primary-700 text-white border-primary-700 shadow-elevation-1"
                  : "bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-700",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Card Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl overflow-hidden bg-white shadow-elevation-1 hover:shadow-elevation-2 hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-[16/10] overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Category Pill */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[12px] font-mono tracking-[0.1em] text-slate-700 uppercase">
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6">
                    <h3 className="font-display text-[20px] md:text-[22px] font-semibold leading-tight text-slate-900 group-hover:text-primary-700 transition-colors duration-300 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-[14px] text-slate-500 leading-[1.6] line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>

                    {/* Footer: Author, Date, Read Time */}
                    <div className="flex items-center gap-3 text-[13px] text-slate-500 font-mono tracking-wide">
                      <span>{post.author}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-[16px]">
              No posts found in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
