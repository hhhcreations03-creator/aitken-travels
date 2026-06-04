"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REGIONS, Region } from "@/lib/data";

interface SriLankaMapProps {
  onOpenBooking: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SriLankaMap({ onOpenBooking }: SriLankaMapProps) {
  const [active, setActive] = useState<Region | null>(null);

  return (
    <section id="destinations" className="py-[80px] md:py-[120px] px-6 md:px-10 lg:px-16 bg-gradient-to-b from-primary-50/50 to-white overflow-hidden">
      <div className="content-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
            <span className="font-mono text-[12px] tracking-[0.16em] uppercase font-semibold text-primary-700">
              Destinations
            </span>
            <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-600 to-primary-400" />
          </div>
          <h2 className="font-display font-bold text-[clamp(32px,4.5vw,52px)] leading-[1.08] text-slate-900">
            Discover the beauty of{" "}
            <span className="gradient-text-accent">Sri Lanka</span>
          </h2>
          <p className="text-[15px] md:text-[16px] text-slate-500 mt-3 max-w-[500px] mx-auto leading-relaxed">
            From misty tea plantations to sun-kissed beaches, ancient kingdoms to wild jungles &mdash; 13 destinations worth exploring.
          </p>
        </motion.div>

        {/* Photo grid — 4-column masonry */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
          {REGIONS.map((region, i) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              onClick={() => setActive(region)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer break-inside-avoid"
            >
              {/* Image with varying heights for visual rhythm */}
              <div className={`relative overflow-hidden ${
                i % 5 === 0 ? "aspect-[3/4]" :
                i % 5 === 1 ? "aspect-[4/5]" :
                i % 5 === 2 ? "aspect-square" :
                i % 5 === 3 ? "aspect-[4/5]" :
                "aspect-[3/4]"
              }`}>
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url(${region.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent group-hover:from-slate-900/90 transition-all duration-300" />

                {/* Tag */}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-primary-800 rounded-full px-2.5 py-0.5 text-[9px] md:text-[10px] font-mono tracking-[0.08em] uppercase font-semibold shadow-sm">
                    {region.tag}
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5 md:p-4">
                  <h3 className="font-display font-bold text-white text-[18px] md:text-[22px] leading-tight">
                    {region.name}
                  </h3>
                  {/* Info that reveals on hover */}
                  <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {region.bestTime && (
                      <span className="text-[10px] text-white/70 font-mono flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        {region.bestTime}
                      </span>
                    )}
                    {region.distance && (
                      <span className="text-[10px] text-white/70 font-mono flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {region.distance}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── Detail Modal ─── */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-[12px] flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl overflow-hidden shadow-elevation-3 w-full max-w-[700px] max-h-[90vh] overflow-y-auto"
            >
              {/* Close */}
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 cursor-pointer flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>

              {/* Hero image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={active.image} alt={active.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                  <div>
                    <span className="bg-white/90 backdrop-blur-sm text-primary-800 rounded-full px-3 py-1 text-[10px] font-mono tracking-[0.1em] uppercase font-semibold">
                      {active.tag}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {active.bestTime && (
                      <span className="bg-white/80 backdrop-blur-sm text-slate-700 rounded-full px-2.5 py-1 text-[10px] font-mono flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        {active.bestTime}
                      </span>
                    )}
                    {active.distance && (
                      <span className="bg-white/80 backdrop-blur-sm text-slate-700 rounded-full px-2.5 py-1 text-[10px] font-mono flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {active.distance}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h3 className="font-display text-[32px] md:text-[38px] font-bold leading-tight text-slate-900 mb-3">
                  {active.name}
                </h3>
                <p className="text-[15px] leading-relaxed text-slate-500 mb-6">
                  {active.blurb}
                </p>

                {/* Highlights */}
                {active.highlights && active.highlights.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-display text-[16px] font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="2" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      Top highlights
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {active.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2.5 p-3 rounded-xl bg-primary-50/60 border border-primary-100/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                          <span className="text-[13px] text-slate-700">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {active.bestTime && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-slate-400 mb-1">Best time to visit</div>
                      <div className="font-display text-[15px] font-semibold text-slate-800">{active.bestTime}</div>
                    </div>
                  )}
                  {active.distance && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-slate-400 mb-1">Distance</div>
                      <div className="font-display text-[15px] font-semibold text-slate-800">{active.distance}</div>
                    </div>
                  )}
                </div>

                {/* Explore other destinations */}
                <div className="pt-5 border-t border-slate-100">
                  <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-slate-400 font-medium mb-3">
                    Explore more destinations
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {REGIONS.filter(r => r.id !== active.id).slice(0, 7).map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setActive(r)}
                        className="flex-shrink-0 flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-medium text-slate-600 hover:border-primary-200 hover:text-primary-700 transition-all cursor-pointer min-h-[32px]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={r.image} alt={r.name} className="w-5 h-5 rounded-full object-cover" />
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
    </section>
  );
}
