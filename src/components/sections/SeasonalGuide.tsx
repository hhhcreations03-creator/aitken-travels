"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentSeason, REGIONS } from "@/lib/data";

interface SeasonalGuideProps {
  open: boolean;
  onOpenBooking: () => void;
}

export function SeasonalGuide({ open, onOpenBooking }: SeasonalGuideProps) {
  const season = getCurrentSeason();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && ref.current) {
      setTimeout(
        () => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        100
      );
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          ref={ref}
          id="seasonal-guide"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          className="overflow-hidden"
        >
          <div className="py-12 md:py-20 px-6 md:px-10 lg:px-16 2xl:px-24 bg-gradient-to-b from-primary-950 to-slate-900">
            <div className="content-max">
              {/* Section 1: Weather Overview Bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 flex flex-wrap items-center gap-4 md:gap-8 mb-10 md:mb-14"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-pulse" />
                  <span className="font-display text-[18px] md:text-[22px] text-white font-semibold">
                    {season.name}
                  </span>
                </div>

                <span className="hidden md:block w-px h-8 bg-white/10" />

                <div className="flex items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--primary-400)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                  <span className="text-[14px] text-white font-medium">
                    {season.weather.condition}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[13px]">
                  <div className="flex items-center gap-1.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      opacity="0.5"
                    >
                      <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
                    </svg>
                    <span className="text-white/80">
                      {season.weather.tempLow}&deg;&ndash;{season.weather.tempHigh}&deg;C
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      opacity="0.5"
                    >
                      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                    </svg>
                    <span className="text-white/75">{season.weather.humidity} humidity</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="1.5"
                      opacity="0.5"
                    >
                      <path d="M16 13V5a4 4 0 00-8 0v8" />
                      <path d="M4 19h16" />
                    </svg>
                    <span className="text-white/75">{season.weather.rainfall} rain</span>
                  </div>
                </div>
              </motion.div>

              {/* Section 2: Season Header */}
              <div className="mb-8 md:mb-12">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-[2px] rounded-full bg-primary-400" />
                  <span className="font-mono text-[11px] md:text-[11px] tracking-[0.18em] uppercase text-primary-300 font-semibold">
                    {season.monthLabel}
                  </span>
                </div>
                <h2 className="font-display text-[28px] md:text-[clamp(32px,4vw,48px)] font-bold text-white leading-[1.05]">
                  Where to go <span className="gradient-text-accent">right now</span>
                </h2>
                <p className="text-[14px] md:text-[16px] text-white/75 mt-3 max-w-[560px] leading-relaxed">
                  {season.description}
                </p>
              </div>

              {/* Section 3: Destinations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
                {season.destinations.map((dest, i) => {
                  const region = REGIONS.find((r) => r.id === dest.regionId);
                  if (!region) return null;
                  return (
                    <motion.div
                      key={dest.regionId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className="group bg-white/5 backdrop-blur-sm border border-white/8 rounded-2xl overflow-hidden hover:bg-white/8 transition-all duration-300"
                    >
                      <div className="relative h-[180px] md:h-[200px] overflow-hidden">
                        <img
                          src={region.image}
                          alt={region.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--primary-400)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span className="text-[14px] text-white font-semibold">
                            {region.name}
                          </span>
                        </div>
                        {region.bestTime && (
                          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 text-[11px] text-white/70 font-mono uppercase tracking-wider">
                            Best: {region.bestTime}
                          </div>
                        )}
                      </div>
                      <div className="p-4 md:p-5">
                        <p className="text-[13px] text-white/70 leading-relaxed mb-3">
                          {dest.whyNow}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {dest.highlights.map((h) => (
                            <span
                              key={h}
                              className="text-[11px] bg-primary-400/15 text-primary-300 rounded-full px-2.5 py-1 font-medium"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Section 4: Activities — Bento Grid */}
              <div className="mb-12 md:mb-16">
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-[2px] rounded-full bg-primary-400" />
                    <span className="font-mono text-[11px] md:text-[11px] tracking-[0.18em] uppercase text-primary-300 font-semibold">
                      {season.name}
                    </span>
                  </div>
                  <h3 className="font-display text-[22px] md:text-[28px] text-white font-bold leading-tight">
                    Things to do <span className="text-primary-400">this season</span>
                  </h3>
                </div>

                {/* Bento grid — featured + smaller cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[200px]">
                  {season.activities.map((activity, i) => {
                    // First card spans 2 cols + 2 rows on desktop for hero effect
                    const isHero = i === 0;
                    // Last card spans 2 cols on mobile for variety
                    const isWide = i === season.activities.length - 1 && season.activities.length % 2 !== 0;

                    return (
                      <motion.div
                        key={activity.name}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.06 }}
                        className={`group relative rounded-2xl overflow-hidden ${
                          isHero
                            ? "col-span-2 row-span-2"
                            : isWide
                              ? "col-span-2 md:col-span-1"
                              : ""
                        }`}
                      >
                        <img
                          src={activity.image}
                          alt={activity.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

                        {/* Number badge */}
                        <div className="absolute top-3 left-3 md:top-4 md:left-4">
                          <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/10 flex items-center justify-center text-[11px] md:text-[12px] text-white font-bold font-mono">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>

                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3.5 md:p-5">
                          <h4 className={`font-display font-semibold text-white leading-tight mb-1 ${
                            isHero ? "text-[18px] md:text-[22px]" : "text-[14px] md:text-[15px]"
                          }`}>
                            {activity.name}
                          </h4>
                          <p className={`text-white/75 leading-snug ${
                            isHero
                              ? "text-[13px] md:text-[14px] line-clamp-3 max-w-[400px]"
                              : "text-[11px] md:text-[12px] line-clamp-2"
                          }`}>
                            {activity.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Travel Tips — Compact strip */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-5 md:p-7 mb-12 md:mb-16"
              >
                <h3 className="font-display text-[18px] md:text-[22px] text-white font-semibold mb-4">
                  Travel tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {season.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--primary-400)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="flex-shrink-0 mt-0.5"
                      >
                        <path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z" />
                        <path d="M9 21h6" />
                      </svg>
                      <span className="text-[13px] text-white/75 leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Section 5: Bottom CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <button
                  onClick={onOpenBooking}
                  className="bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-full px-10 py-4 font-semibold text-[16px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 cursor-pointer min-h-[48px]"
                >
                  Plan your {season.name.toLowerCase()} trip
                </button>
                <p className="text-[12px] text-white/75 mt-3 font-mono">
                  Our drivers know the best routes for this season
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
