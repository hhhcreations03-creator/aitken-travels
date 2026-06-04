"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/data";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24"
          fill={i < rating ? "#F59E0B" : "#E2E8F0"}
          stroke={i < rating ? "#F59E0B" : "#E2E8F0"}
          strokeWidth="0.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-[80px] md:py-[120px] overflow-hidden bg-gradient-to-b from-primary-50/40 to-white">
      <div className="content-max px-6 md:px-10 lg:px-16">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
              <span className="font-mono text-[12px] tracking-[0.16em] uppercase font-semibold text-primary-700">
                Reviews
              </span>
            </div>
            <h2 className="font-display font-bold text-[clamp(32px,4.5vw,48px)] leading-[1.08] text-slate-900">
              What our travellers{" "}
              <span className="gradient-text-accent">say</span>
            </h2>
            <p className="text-[15px] text-slate-500 mt-3 max-w-[420px] leading-relaxed">
              Real stories from real guests who explored Sri Lanka with us.
            </p>
          </motion.div>

          {/* Navigation arrows + overall rating */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center gap-4"
          >
            <div className="hidden md:flex items-center gap-2 mr-4 pr-4 border-r border-slate-200">
              <div className="font-display text-[32px] font-bold gradient-text leading-none">4.8</div>
              <div>
                <StarRating rating={5} />
                <div className="font-mono text-[9px] text-slate-400 tracking-wide uppercase mt-0.5">500+ reviews</div>
              </div>
            </div>
            <button
              onClick={() => scroll("left")}
              className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-primary-50 hover:border-primary-300 transition-all flex items-center justify-center cursor-pointer shadow-sm"
              aria-label="Previous"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-11 h-11 rounded-full border border-slate-200 bg-white hover:bg-primary-50 hover:border-primary-300 transition-all flex items-center justify-center cursor-pointer shadow-sm"
              aria-label="Next"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scrollable review cards */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-6 pl-6 md:pl-10 lg:pl-[max(40px,calc((100vw-1360px)/2+40px))] pr-6 snap-x snap-mandatory no-scrollbar"
      >
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex-shrink-0 w-[340px] md:w-[400px] snap-start bg-white rounded-2xl border border-slate-100 shadow-elevation-1 hover:shadow-elevation-2 hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
          >
            {/* Top section — avatar + info */}
            <div className="p-6 pb-0">
              <div className="flex items-start gap-4 mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[17px] font-semibold text-slate-900 leading-tight">
                    {t.name}
                  </div>
                  <div className="text-[12px] text-slate-500 mt-0.5">{t.from}</div>
                  <div className="mt-1.5">
                    <StarRating rating={t.rating} />
                  </div>
                </div>
              </div>

              {/* Trip badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-[11px] font-mono tracking-[0.06em] font-semibold">
                  {t.trip}
                </span>
              </div>

              {/* Quote */}
              <div className="relative">
                <svg width="24" height="24" viewBox="0 0 64 64" fill="none" className="text-primary-100 absolute -top-1 -left-1">
                  <path d="M14 34C14 28.477 18.477 24 24 24H26C27.105 24 28 24.895 28 26V28C28 29.105 27.105 30 26 30H24C21.791 30 20 31.791 20 34V36H26C27.105 36 28 36.895 28 38V46C28 47.105 27.105 48 26 48H16C14.895 48 14 47.105 14 46V34Z" fill="currentColor" />
                  <path d="M36 34C36 28.477 40.477 24 46 24H48C49.105 24 50 24.895 50 26V28C50 29.105 49.105 30 48 30H46C43.791 30 42 31.791 42 34V36H48C49.105 36 50 36.895 50 38V46C50 47.105 49.105 48 48 48H38C36.895 48 36 47.105 36 46V34Z" fill="currentColor" />
                </svg>
                <p className="text-[14px] text-slate-600 leading-[1.7] relative z-10 pl-2">
                  {t.quote}
                </p>
              </div>
            </div>

            {/* Bottom — tour highlights */}
            <div className="p-6 pt-5 mt-4 border-t border-slate-50">
              <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-slate-400 mb-2">
                Places visited
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {t.highlights.map((h) => (
                  <span
                    key={h}
                    className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1 text-[11px] text-slate-600 font-medium"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {/* CTA card at the end */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex-shrink-0 w-[340px] md:w-[400px] snap-start rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-8 flex flex-col justify-center items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <h3 className="font-display text-[24px] font-bold text-white mb-3">
            Join 500+ happy travellers
          </h3>
          <p className="text-[14px] text-white/60 leading-relaxed mb-6">
            Start your Sri Lanka adventure with Aitken Travels and share your own story.
          </p>
          <a
            href="https://wa.me/94770813690?text=Hi%20Aitken%20Travels!%20I%27d%20like%20to%20plan%20a%20trip%20to%20Sri%20Lanka."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-primary-700 rounded-full px-7 py-3 font-semibold text-[14px] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            Plan your trip
          </a>
        </motion.div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
    </section>
  );
}
