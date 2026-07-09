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

function WeatherIcon({ icon, size = 24, className = "" }: { icon: string; size?: number; className?: string }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className };
  switch (icon) {
    case "sun": return <svg {...props}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>;
    case "cloud-sun": return <svg {...props}><path d="M12 2v2" /><path d="M4.93 4.93l1.41 1.41" /><path d="M20 12h2" /><path d="M19.07 4.93l-1.41 1.41" /><path d="M15.947 12.65a4 4 0 00-5.925-4.128" /><path d="M13 22H7a5 5 0 110-10h.5A7 7 0 0121 15a4.5 4.5 0 01-4 4.5H13" /></svg>;
    case "cloud-rain": return <svg {...props}><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" /><line x1="8" y1="16" x2="8" y2="20" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="16" y1="16" x2="16" y2="20" /></svg>;
    default: return <svg {...props}><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" /><line x1="8" y1="17" x2="8" y2="19" /><line x1="12" y1="19" x2="12" y2="21" /><line x1="16" y1="17" x2="16" y2="19" /></svg>;
  }
}

export function Hero({ onOpenBooking, onToggleSeasonalGuide, seasonalGuideOpen }: HeroProps) {
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

  return (
    <>
      {/* ===== MOBILE HERO ===== */}
      {/* Mobile: full screen | Small phones: min 560px */}
      <section className="relative h-[100dvh] min-h-[560px] overflow-hidden md:hidden">
        {/* Background */}
        <AnimatePresence initial={false}>
          <motion.div key={slide} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }} className="absolute inset-0">
            <div className="absolute inset-0 bg-cover bg-center animate-kenburns" style={{ backgroundImage: `url(${seasonSlides[slide].img})` }} />
          </motion.div>
        </AnimatePresence>

        {/* Overlay */}
        <div className="absolute inset-0 z-[1]" style={{
          background: "linear-gradient(180deg, rgba(10,45,73,0.5) 0%, rgba(10,45,73,0.05) 35%, rgba(10,45,73,0.45) 60%, rgba(10,45,73,0.95) 100%)",
        }} />

        {/* Content */}
        <div className="relative z-[3] h-full flex flex-col justify-end px-5 pb-8 pt-[140px]">

          {/* Weather pill — sits above the spacer */}
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mb-auto">
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full px-3.5 py-2">
              <WeatherIcon icon={season.weather.icon} size={14} className="text-primary-400" />
              <span className="text-[11px] text-white/90 font-medium">{season.weather.tempLow}&deg;&ndash;{season.weather.tempHigh}&deg;C</span>
              <span className="w-px h-3 bg-white/20" />
              <span className="text-[10px] text-primary-300 font-mono uppercase tracking-wider">{season.weather.condition}</span>
            </div>
          </motion.div>

          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-2 mb-3">
            <span className="w-4 h-[1.5px] rounded-full bg-primary-400" />
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase font-semibold text-primary-300">
              {season.monthLabel} &middot; {season.name}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            className="font-display font-bold text-white leading-[1.08] tracking-tight text-[30px] mb-3">
            {season.tagline}
          </motion.h1>

          {/* Description */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-[13px] text-white/50 leading-relaxed max-w-[340px] mb-6">
            {season.description}
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="flex gap-2.5 mb-5">
            <button onClick={onOpenBooking}
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl py-3 font-semibold text-[13px] cursor-pointer min-h-[48px] active:scale-[0.97] transition-transform">
              Book your ride
            </button>
            <button onClick={onToggleSeasonalGuide}
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-xl py-3 font-medium text-[13px] cursor-pointer min-h-[48px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform">
              More Info
              <svg className={`transition-transform duration-300 ${seasonalGuideOpen ? "rotate-180" : ""}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </motion.div>

          {/* Bottom row: dots + location */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {seasonSlides.map((_, i) => (
                <button key={i} onClick={() => { setSlide(i); setProgress(0); }}
                  className="relative flex items-center justify-center cursor-pointer bg-transparent border-none p-1 min-h-[32px] min-w-[16px]"
                  aria-label={`Slide ${i + 1}`}>
                  {i === slide ? (
                    <motion.span layoutId="m-dot" className="block w-5 h-1 rounded-full bg-primary-400" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  ) : (
                    <span className="block w-1 h-1 rounded-full bg-white/30" />
                  )}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={slide} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary-400)" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span className="text-[11px] text-white/80 font-medium">{seasonSlides[slide].place}</span>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ===== DESKTOP HERO ===== */}
      {/* Tablet: 90vh | Laptop: 92vh | Desktop: 95vh | Large: 100vh */}
      <section className="relative h-[90vh] md:min-h-[600px] lg:h-[92vh] lg:min-h-[650px] xl:h-[95vh] 2xl:h-[100vh] overflow-hidden hidden md:block">
        {/* Background */}
        <AnimatePresence initial={false}>
          <motion.div key={slide} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }} className="absolute inset-0">
            <div className="absolute inset-0 bg-cover bg-center animate-kenburns" style={{ backgroundImage: `url(${seasonSlides[slide].img})` }} />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[1]" style={{
          background: "linear-gradient(135deg, rgba(10,45,73,0.72) 0%, rgba(10,45,73,0.15) 50%, rgba(10,45,73,0.55) 100%)",
        }} />

        {/* Main content */}
        <div className="relative z-[3] h-full flex flex-col justify-center px-6 md:px-10 lg:px-16 2xl:px-24 pt-[100px] lg:pt-[110px] xl:pt-[120px] pb-[70px] lg:pb-[80px]">
          <div className="content-max w-full">
            <div className="flex items-center justify-between gap-16">

              {/* Left — Text */}
              <div className="max-w-[620px]">
                {/* Eyebrow */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-center gap-3 mb-6">
                  <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-300" />
                  <span className="font-mono text-[11px] tracking-[0.16em] uppercase font-semibold text-primary-300">
                    {season.monthLabel} &middot; {season.weather.condition}
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
                  className="font-display font-bold text-white leading-[0.97] tracking-tight text-[clamp(32px,5vw,48px)] lg:text-[clamp(40px,5.5vw,64px)] xl:text-[clamp(44px,5.5vw,72px)] 2xl:text-[76px]">
                  {season.tagline}
                </motion.h1>

                {/* Description */}
                <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
                  className="text-[14px] lg:text-[16px] xl:text-[17px] 2xl:text-[18px] text-white/70 mt-4 lg:mt-5 xl:mt-6 max-w-[440px] lg:max-w-[480px] xl:max-w-[500px] leading-relaxed">
                  {season.description}
                </motion.p>

                {/* Weather pill */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                  className="mt-5">
                  <div className="inline-flex items-center gap-3 bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-full px-4 py-2">
                    <WeatherIcon icon={season.weather.icon} size={16} className="text-primary-400" />
                    <span className="text-[13px] text-white/85 font-medium">{season.weather.tempLow}&deg;&ndash;{season.weather.tempHigh}&deg;C</span>
                    <span className="w-px h-4 bg-white/10" />
                    <span className="text-[10px] text-white/45 font-mono">{season.weather.humidity} humidity</span>
                  </div>
                </motion.div>

                {/* CTAs */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
                  className="flex flex-wrap items-center gap-3 mt-5 lg:mt-6 xl:mt-8">
                  <button onClick={onOpenBooking}
                    className="bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-full px-7 py-3.5 font-semibold text-[14px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 cursor-pointer min-h-[48px]">
                    Book your ride
                  </button>
                  <button onClick={onToggleSeasonalGuide}
                    className="bg-white/[0.07] backdrop-blur-md border border-white/[0.1] text-white rounded-full px-6 py-3.5 font-medium text-[14px] hover:-translate-y-0.5 hover:bg-white/[0.12] transition-all duration-300 cursor-pointer min-h-[48px] inline-flex items-center gap-2">
                    Seasonal guide
                    <svg className={`transition-transform duration-300 ${seasonalGuideOpen ? "rotate-180" : ""}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  <a href="#fleet" className="text-white/55 hover:text-white text-[13px] font-medium transition-colors min-h-[48px] inline-flex items-center gap-1.5 pl-2">
                    Explore fleet
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                  </a>
                </motion.div>
              </div>

              {/* Right — Season card */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
                className="hidden xl:block flex-shrink-0">
                <div className="bg-black/20 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 xl:p-6 w-[250px] xl:w-[270px] 2xl:w-[290px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                      <span className="text-[12px] text-white font-semibold">{season.name}</span>
                    </div>
                    <span className="text-[9px] bg-primary-400/20 text-primary-300 rounded-full px-2 py-0.5 font-mono uppercase tracking-wider">Now</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mb-4">
                    {season.destinations.slice(0, 3).map((d) => {
                      const region = REGIONS.find((r) => r.id === d.regionId);
                      return region ? (
                        <div key={d.regionId} className="relative aspect-square rounded-xl overflow-hidden">
                          <img src={region.image} alt={region.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute bottom-1.5 left-1.5 text-[8px] text-white font-semibold leading-none">{region.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {season.activities.slice(0, 3).map((a) => (
                      <span key={a.name} className="text-[9px] bg-white/[0.08] text-white/70 rounded-full px-2.5 py-1 font-medium">{a.name}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 z-[4] px-6 md:px-10 lg:px-16 2xl:px-24 pb-5 lg:pb-6 xl:pb-7">
          <div className="content-max flex items-center gap-5">
            <div className="flex items-center gap-2.5">
              {seasonSlides.map((_, i) => (
                <button key={i} onClick={() => { setSlide(i); setProgress(0); }}
                  className="relative w-6 h-6 flex items-center justify-center cursor-pointer bg-transparent border-none"
                  aria-label={`Go to slide ${i + 1}`}>
                  {i === slide && (
                    <svg width="24" height="24" viewBox="0 0 24 24" className="absolute inset-0 -rotate-90">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="10" fill="none" stroke="var(--primary-400)" strokeWidth="1.5"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.1s linear" }} />
                    </svg>
                  )}
                  <span className={`block rounded-full transition-all duration-300 ${i === slide ? "w-2 h-2 bg-white" : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"}`} />
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-white/15" />
            <AnimatePresence mode="wait">
              <motion.div key={slide} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.25 }}
                className="flex items-center gap-2">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--primary-400)" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span className="text-[13px] text-white font-medium">{seasonSlides[slide].place}</span>
                <span className="text-[11px] text-white/40 font-mono hidden lg:inline">{seasonSlides[slide].sub}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
