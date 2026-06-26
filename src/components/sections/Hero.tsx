"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_SLIDES } from "@/lib/data";

interface HeroProps {
  onOpenBooking: () => void;
}

const SLIDE_DURATION = 6000;

export function Hero({ onOpenBooking }: HeroProps) {
  const [slide, setSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    setSlide((s) => (s + 1) % HERO_SLIDES.length);
    setProgress(0);
  }, []);

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
            <div className="absolute inset-0 bg-cover bg-center animate-kenburns" style={{ backgroundImage: `url(${HERO_SLIDES[slide].img})` }} />
          </motion.div>
        </AnimatePresence>

        {/* Overlay — stronger at bottom for text readability */}
        <div className="absolute inset-0 z-[1]" style={{
          background: "linear-gradient(180deg, rgba(10,45,73,0.3) 0%, rgba(10,45,73,0.08) 35%, rgba(10,45,73,0.55) 65%, rgba(10,45,73,0.92) 100%)",
        }} />

        {/* Floating location pill — top area */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="absolute top-20 left-5 z-[4]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25 }}
              className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-3 py-1.5"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary-400)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-[11px] text-white/90 font-medium">{HERO_SLIDES[slide].place}</span>
              <span className="text-[9px] text-white/40 font-mono">{HERO_SLIDES[slide].sub.split(" \u00b7 ")[0]}</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Content — pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-[3] px-5 pb-5">
          {/* Text block */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-4 h-[1.5px] rounded-full bg-primary-400" />
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase font-semibold text-primary-300">Explore Sri Lanka</span>
            </div>

            <h1 className="font-display font-bold text-white leading-[1.05] tracking-tight text-[28px]">
              Your journey through{" "}<span className="gradient-text-accent">Sri Lanka</span> starts here.
            </h1>

            <p className="text-[13px] text-white/60 mt-2 leading-relaxed max-w-[300px]">
              Cars, vans, buses &amp; bikes — professional drivers, island-wide.
            </p>
          </motion.div>

          {/* CTA row */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="flex gap-2.5 mb-4">
            <button
              onClick={onOpenBooking}
              className="flex-1 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl py-3 font-semibold text-[13px] cursor-pointer min-h-[44px] active:scale-[0.97] transition-transform"
            >
              Book your ride
            </button>
            <a
              href="#fleet"
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/15 text-white rounded-xl py-3 font-medium text-[13px] cursor-pointer min-h-[44px] flex items-center justify-center active:scale-[0.97] transition-transform"
            >
              Explore fleet
            </a>
          </motion.div>

          {/* Slide indicators — minimal dots */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center justify-center gap-1.5">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setSlide(i); setProgress(0); }}
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
              style={{ backgroundImage: `url(${HERO_SLIDES[slide].img})` }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[1]" style={{
          background: "linear-gradient(180deg, rgba(10,45,73,0.45) 0%, rgba(10,45,73,0.1) 40%, rgba(10,45,73,0.8) 100%)",
        }} />

        {/* Main content */}
        <div className="relative z-[3] h-full flex flex-col justify-center px-6 md:px-10 lg:px-16">
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
                  Explore Sri Lanka with us
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
                className="font-display font-bold text-white leading-[0.95] tracking-tight text-[clamp(36px,7vw,76px)]"
              >
                Your journey through
                <br />
                <span className="gradient-text-accent">Sri Lanka</span> starts here.
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-[16px] md:text-[18px] text-white/80 mt-6 max-w-[520px] leading-relaxed"
              >
                From Colombo to Sigiriya, Kandy to Galle &mdash; travel Sri Lanka
                in comfort with our cars, vans, buses, and bikes.
              </motion.p>

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
                <a
                  href="#fleet"
                  className="glass-card text-white rounded-full px-8 py-4 font-medium text-[15px] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer min-h-[48px] inline-flex items-center"
                >
                  Explore our fleet
                </a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom bar — slide info + indicators */}
        <div className="absolute bottom-0 left-0 right-0 z-[4] px-6 md:px-10 lg:px-16 pb-8">
          <div className="content-max flex items-center gap-5">
            {/* Slide indicators */}
            <div className="flex items-center gap-3">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setSlide(i); setProgress(0); }}
                  className="relative w-6 h-6 flex items-center justify-center cursor-pointer bg-transparent border-none"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  {i === slide && (
                    <svg width="24" height="24" viewBox="0 0 24 24" className="absolute inset-0 -rotate-90">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="10" fill="none" stroke="var(--primary-400)" strokeWidth="1.5"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.1s linear" }} />
                    </svg>
                  )}
                  <span className={`block rounded-full transition-all duration-300 ${
                    i === slide ? "w-2 h-2 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                  }`} />
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-400)" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-[14px] text-white font-medium">{HERO_SLIDES[slide].place}</span>
                <span className="text-[12px] text-white/50 font-mono hidden sm:inline">{HERO_SLIDES[slide].sub}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
