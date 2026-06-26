/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_SLIDES, REGIONS, getCurrentSeason } from "@/lib/data";

interface HeroProps {
  onOpenBooking: () => void;
  onToggleSeasonalGuide: () => void;
  seasonalGuideOpen: boolean;
}

const SLIDE_DURATION = 6000;

function WeatherIcon({
  icon,
  size = 24,
  className = "",
}: {
  icon: "sun" | "cloud-sun" | "cloud-rain" | "cloud-drizzle";
  size?: number;
  className?: string;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (icon) {
    case "sun":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      );
    case "cloud-sun":
      return (
        <svg {...props}>
          <path d="M12 2v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M20 12h2" />
          <path d="M19.07 4.93l-1.41 1.41" />
          <path d="M15.947 12.65a4 4 0 00-5.925-4.128" />
          <path d="M13 22H7a5 5 0 110-10h.5A7 7 0 0121 15a4.5 4.5 0 01-4 4.5H13" />
        </svg>
      );
    case "cloud-rain":
      return (
        <svg {...props}>
          <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" />
          <line x1="8" y1="16" x2="8" y2="20" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="16" y1="16" x2="16" y2="20" />
        </svg>
      );
    case "cloud-drizzle":
      return (
        <svg {...props}>
          <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" />
          <line x1="8" y1="17" x2="8" y2="19" />
          <line x1="12" y1="19" x2="12" y2="21" />
          <line x1="16" y1="17" x2="16" y2="19" />
        </svg>
      );
  }
}

export function Hero({
  onOpenBooking,
  onToggleSeasonalGuide,
  seasonalGuideOpen,
}: HeroProps) {
  const season = getCurrentSeason();
  const seasonSlides = season.heroSlideIndices.map((i) => HERO_SLIDES[i]);

  const [slide, setSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    setSlide((s) => (s + 1) % seasonSlides.length);
    setProgress(0);
  }, [seasonSlides.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [nextSlide]);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / SLIDE_DURATION, 1));
      if (elapsed < SLIDE_DURATION) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [slide]);

  const circumference = 2 * Math.PI * 10;
  const strokeDashoffset = circumference * (1 - progress);

  const mobileDescription =
    season.description.length > 80
      ? season.description.slice(0, 77) + "..."
      : season.description;

  return (
    <>
      {/* ===== MOBILE HERO ===== */}
      <section className="relative h-[78dvh] min-h-[480px] max-h-[640px] overflow-hidden md:hidden">
        {/* Background image */}
        <AnimatePresence initial={false}>
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center animate-kenburns"
              style={{
                backgroundImage: `url(${seasonSlides[slide].img})`,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,45,73,0.35) 0%, rgba(10,45,73,0.08) 30%, rgba(10,45,73,0.6) 65%, rgba(10,45,73,0.95) 100%)",
          }}
        />

        {/* Top area — Seasonal badge pill */}
        <div className="absolute top-20 left-5 z-[4]">
          <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1.5">
            <WeatherIcon icon={season.weather.icon} size={14} className="text-primary-400" />
            <span className="text-[11px] text-white/90 font-medium">
              {season.weather.tempLow}&deg;&ndash;{season.weather.tempHigh}&deg;C
            </span>
            <span className="w-px h-3 bg-white/20" />
            <span className="text-[10px] text-primary-300 font-mono uppercase tracking-wider">
              {season.weather.condition}
            </span>
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-[3] px-5 pb-5">
          {/* Text block */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-[1.5px] rounded-full bg-primary-400" />
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase font-semibold text-primary-300">
                {season.monthLabel} &middot; {season.name}
              </span>
            </div>

            <h1 className="font-display font-bold text-white leading-[1.05] tracking-tight text-[26px]">
              {season.tagline}
            </h1>

            <p className="text-[12px] text-white/55 mt-2 leading-relaxed max-w-[300px]">
              {mobileDescription}
            </p>
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex gap-2.5 mb-4"
          >
            <button
              onClick={onOpenBooking}
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl py-3 font-semibold text-[13px] cursor-pointer min-h-[44px] active:scale-[0.97] transition-transform"
            >
              Book your ride
            </button>
            <button
              onClick={onToggleSeasonalGuide}
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-xl py-3 font-medium text-[13px] cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform"
            >
              More Info
              <svg
                className={`transition-transform duration-300 ${seasonalGuideOpen ? "rotate-180" : ""}`}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </motion.div>

          {/* Slide indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-1.5"
          >
            {seasonSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setSlide(i);
                  setProgress(0);
                }}
                className="relative flex items-center justify-center cursor-pointer bg-transparent border-none p-1 min-h-[44px] min-w-[20px]"
                aria-label={`Slide ${i + 1}`}
              >
                {i === slide ? (
                  <motion.span
                    layoutId="mobile-dot"
                    className="block w-5 h-1 rounded-full bg-primary-400"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                ) : (
                  <span className="block w-1 h-1 rounded-full bg-white/35" />
                )}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== DESKTOP HERO ===== */}
      <section className="relative h-[90vh] min-h-[600px] max-h-[900px] overflow-hidden hidden md:block">
        {/* Background image crossfade */}
        <AnimatePresence initial={false}>
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center animate-kenburns"
              style={{
                backgroundImage: `url(${seasonSlides[slide].img})`,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,45,73,0.45) 0%, rgba(10,45,73,0.1) 40%, rgba(10,45,73,0.8) 100%)",
          }}
        />

        {/* Main content */}
        <div className="relative z-[3] h-full flex flex-col justify-center px-6 md:px-10 lg:px-16 2xl:px-24">
          <div className="content-max w-full">
            <div className="max-w-[680px]">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-3 mb-6"
              >
                <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-300" />
                <span className="font-mono text-[12px] tracking-[0.16em] uppercase font-semibold text-primary-300">
                  {season.monthLabel} &middot; {season.weather.condition}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className="font-display font-bold text-white leading-[0.95] tracking-tight text-[clamp(36px,7vw,72px)]"
              >
                {season.tagline}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-[16px] md:text-[18px] text-white/80 mt-6 max-w-[520px] leading-relaxed"
              >
                {season.description}
              </motion.p>

              {/* Weather badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
              >
                <div className="inline-flex items-center gap-4 bg-white/8 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3 mt-5">
                  <WeatherIcon
                    icon={season.weather.icon}
                    size={20}
                    className="text-primary-400"
                  />
                  <div>
                    <div className="text-[13px] text-white font-medium">
                      {season.weather.tempLow}&deg;&ndash;{season.weather.tempHigh}&deg;C
                    </div>
                    <div className="text-[10px] text-white/50 font-mono">
                      {season.weather.humidity} humidity &middot;{" "}
                      {season.weather.rainfall} rain
                    </div>
                  </div>
                  <span className="w-px h-8 bg-white/10" />
                  <div className="text-[11px] text-primary-300 font-mono uppercase tracking-wider">
                    {season.name}
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap gap-4 mt-8"
              >
                <button
                  onClick={onOpenBooking}
                  className="bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-full px-8 py-4 font-semibold text-[15px] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 cursor-pointer min-h-[48px]"
                >
                  Book your ride
                </button>
                <button
                  onClick={onToggleSeasonalGuide}
                  className="bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-full px-6 py-4 font-medium text-[14px] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer min-h-[48px] inline-flex items-center gap-2"
                >
                  Seasonal guide
                  <svg
                    className={`transition-transform duration-300 ${seasonalGuideOpen ? "rotate-180" : ""}`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <a
                  href="#fleet"
                  className="glass-card text-white rounded-full px-6 py-4 font-medium text-[14px] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer min-h-[48px] inline-flex items-center"
                >
                  Explore fleet
                </a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Season overlay card — bottom-right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="absolute bottom-20 right-6 md:right-10 lg:right-16 2xl:right-24 z-[4] bg-black/25 backdrop-blur-xl border border-white/10 rounded-2xl p-5 max-w-[280px]"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary-400" />
            <span className="text-[11px] text-white/70 font-mono uppercase tracking-wider">
              Best for
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {season.activities.slice(0, 3).map((a) => (
              <span
                key={a}
                className="text-[10px] bg-white/10 text-white/80 rounded-full px-2.5 py-1 font-medium"
              >
                {a}
              </span>
            ))}
          </div>

          <div className="flex -space-x-2">
            {season.destinations.slice(0, 4).map((d) => {
              const region = REGIONS.find((r) => r.id === d.regionId);
              return region ? (
                <div
                  key={d.regionId}
                  className="w-9 h-9 rounded-full border-2 border-black/30 overflow-hidden"
                >
                  <img
                    src={region.image}
                    alt={region.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null;
            })}
            <div className="w-9 h-9 rounded-full border-2 border-black/30 bg-primary-600/80 flex items-center justify-center">
              <span className="text-[9px] text-white font-bold">
                +{Math.max(0, season.destinations.length - 4)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar — slide info + indicators */}
        <div className="absolute bottom-0 left-0 right-0 z-[4] px-6 md:px-10 lg:px-16 2xl:px-24 pb-8">
          <div className="content-max flex items-center gap-5">
            {/* Slide indicators */}
            <div className="flex items-center gap-3">
              {seasonSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSlide(i);
                    setProgress(0);
                  }}
                  className="relative w-6 h-6 flex items-center justify-center cursor-pointer bg-transparent border-none"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  {i === slide && (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      className="absolute inset-0 -rotate-90"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="var(--primary-400)"
                        strokeWidth="1.5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.1s linear" }}
                      />
                    </svg>
                  )}
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      i === slide
                        ? "w-2 h-2 bg-white"
                        : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-white/20" />

            {/* Location info */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary-400)"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-[14px] text-white font-medium">
                  {seasonSlides[slide].place}
                </span>
                <span className="text-[12px] text-white/50 font-mono hidden sm:inline">
                  {seasonSlides[slide].sub}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
