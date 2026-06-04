"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { target: 2, suffix: "+", label: "Years on the road" },
  { target: 50, suffix: "+", label: "Vehicles in fleet" },
  { target: 4.8, suffix: "", label: "Average rating", decimal: true },
  { target: 500, suffix: "+", label: "Happy travellers" },
];

const values = [
  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Safe & insured", desc: "Every vehicle fully insured with 24/7 roadside assistance" },
  { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Always on time", desc: "Real-time flight tracking and punctual service guaranteed" },
  { icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064", title: "Island-wide", desc: "From Jaffna to Mirissa — every destination covered" },
  { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "Local experts", desc: "Drivers who double as your personal Sri Lanka guide" },
];

function useCountUp(target: number, inView: boolean, decimal = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(decimal ? Math.round(start * 10) / 10 : Math.floor(start)); }
    }, interval);
    return () => clearInterval(timer);
  }, [inView, target, decimal]);
  return decimal ? count.toFixed(1) : count;
}

function StatItem({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const value = useCountUp(stat.target, isInView, stat.decimal);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center">
      <div className="gradient-text font-display text-[36px] md:text-[44px] font-bold leading-none whitespace-nowrap">
        {value}{stat.suffix}
      </div>
      <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-slate-400 mt-2">
        {stat.label}
      </div>
    </motion.div>
  );
}

export function Intro() {
  return (
    <section id="about" className="overflow-hidden">
      {/* ─── Main about section ─── */}
      <div className="py-[80px] md:py-[120px] px-6 md:px-10 lg:px-16 bg-gradient-to-b from-primary-50/50 to-white">
        <div className="content-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — text content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
                <span className="font-mono text-[12px] tracking-[0.16em] uppercase font-semibold text-primary-700">
                  Our story
                </span>
              </div>

              <h2 className="font-display font-bold text-[clamp(32px,5vw,52px)] leading-[1.06] text-slate-900 mb-6">
                Four friends,{" "}
                <span className="gradient-text-accent">one island,</span>
                <br />
                endless roads.
              </h2>

              <div className="space-y-5 text-[15px] md:text-[16px] text-slate-600 leading-[1.75]">
                <p>
                  In 2024, four friends who grew up exploring every corner of Sri Lanka
                  decided to turn their passion into purpose. We believed that getting
                  around this beautiful island shouldn&apos;t be stressful, overpriced,
                  or unpredictable &mdash; it should be part of the adventure.
                </p>
                <p>
                  Today, Aitken Travels operates a fleet of 50+ vehicles &mdash; from
                  sedans and vans to tuk-tuks and Royal Enfields &mdash; serving
                  travellers from over 30 countries. Our drivers know every shortcut
                  through the Cultural Triangle and the best stops between Ella and Yala.
                </p>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-200">
                <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-primary-700 font-semibold">
                  EST. 2024
                </div>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-slate-400">
                  Colombo, Sri Lanka
                </div>
              </div>

              {/* Values row */}
              <div className="grid grid-cols-2 gap-4 mt-10">
                {values.map((v, i) => (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={v.icon} />
                      </svg>
                    </div>
                    <div>
                      <div className="font-display text-[14px] font-semibold text-slate-800">{v.title}</div>
                      <div className="text-[12px] text-slate-500 leading-snug mt-0.5">{v.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right — image with creative border */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative"
            >
              {/* Decorative white border frame — offset behind the image */}
              <div className="absolute top-4 left-4 right-[-16px] bottom-[-16px] rounded-3xl border-[3px] border-white shadow-[0_0_0_1px_rgba(0,0,0,0.04)] pointer-events-none z-0" />

              {/* Teal accent block behind top-left corner */}
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 z-0" />

              {/* Main image */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-elevation-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/about.JPG"
                  alt="Aitken Travels team — four founders"
                  className="w-full aspect-[4/3] object-cover"
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
              </div>

              {/* Floating stat card overlapping bottom-left */}
              <div className="absolute -bottom-6 -left-4 md:-left-8 z-20 bg-white rounded-2xl shadow-elevation-2 p-5 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-display text-[24px] font-bold text-slate-900 leading-none">30+</div>
                    <div className="text-[11px] text-slate-500 font-mono tracking-wide uppercase mt-0.5">Countries served</div>
                  </div>
                </div>
              </div>

              {/* Floating rating badge top-right */}
              <div className="absolute -top-3 -right-3 md:-right-6 z-20 bg-white rounded-xl shadow-elevation-2 px-4 py-3 border border-slate-100">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <div className="font-display text-[18px] font-bold text-slate-900">4.8</div>
                  <div className="text-[10px] text-slate-400 font-mono">/ 5.0</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── Stats bar ─── */}
      <div className="py-14 md:py-16 px-6 md:px-10 lg:px-16 bg-white border-t border-slate-100">
        <div className="content-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((s, i) => (
              <StatItem key={s.label} stat={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
