"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    title: "Trusted drivers",
    stat: "50+",
    statLabel: "Experienced drivers",
    description: "Every driver is vetted, licensed, and has years of experience navigating Sri Lanka\u2019s roads. They\u2019re not just behind the wheel \u2014 they\u2019re your friendly local guide, concierge, and first friend on the island.",
  },
  {
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    title: "Personalised tours",
    stat: "100%",
    statLabel: "Customisable trips",
    description: "No fixed packages. Every tour is tailored to your interests, pace, and budget. You tell us what you want to see, and we design the perfect route \u2014 from a quick day trip to a full island circuit.",
  },
  {
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
    title: "Deep local knowledge",
    stat: "13",
    statLabel: "Destinations covered",
    description: "Our team knows every shortcut through the Cultural Triangle, the best rest stops between Ella and Yala, and hidden gems that aren\u2019t in any guidebook. We grew up exploring this island \u2014 now we share it with you.",
  },
  {
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    title: "Happy travellers",
    stat: "4.8",
    statLabel: "Average rating",
    description: "Over 500 travellers from 30+ countries have rated us 4.8 out of 5. Our secret? We treat every guest like family and every trip like it\u2019s our own holiday.",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Safe & reliable",
    stat: "24/7",
    statLabel: "Roadside support",
    description: "Every vehicle is fully insured and regularly serviced. With 24/7 roadside assistance, real-time vehicle tracking, and an operations team on call around the clock \u2014 you\u2019re in safe hands.",
  },
  {
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Transparent pricing",
    stat: "0",
    statLabel: "Hidden fees",
    description: "What you see is what you pay. No surge pricing, no surprise charges. We provide clear quotes upfront so you can plan your Sri Lanka trip with complete confidence.",
  },
];

export function WhyAitken() {
  return (
    <section className="py-[80px] md:py-[120px] px-6 md:px-10 lg:px-16 2xl:px-24 bg-gradient-to-b from-white to-primary-50/40 overflow-hidden">
      <div className="content-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
            <span className="font-mono text-[12px] tracking-[0.16em] uppercase font-semibold text-primary-700">
              Why choose us
            </span>
            <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-600 to-primary-400" />
          </div>
          <h2 className="font-display font-bold text-[clamp(32px,4.5vw,52px)] leading-[1.08] text-slate-900">
            What makes Aitken{" "}
            <span className="gradient-text-accent">different</span>
          </h2>
          <p className="text-[15px] md:text-[16px] text-slate-500 mt-3 max-w-[500px] mx-auto leading-relaxed">
            We&apos;re not just a transport company &mdash; we&apos;re your travel partner across Sri Lanka.
          </p>
        </motion.div>

        {/* === MOBILE LAYOUT === */}
        <div className="md:hidden">
          {/* Featured card — first item, full-width */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative rounded-2xl bg-white border border-slate-100 p-8 shadow-elevation-1 overflow-hidden mb-5"
          >
            <div className="absolute -top-4 -right-2 font-display text-[120px] font-bold leading-none text-primary-50 pointer-events-none select-none">
              {reasons[0].stat}
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={reasons[0].icon} />
                  </svg>
                </div>
                <div>
                  <div className="font-display text-[28px] font-bold gradient-text leading-none">{reasons[0].stat}</div>
                  <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-slate-400 mt-0.5">{reasons[0].statLabel}</div>
                </div>
              </div>
              <h3 className="font-display text-[22px] font-semibold text-slate-900 mb-3">
                {reasons[0].title}
              </h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">
                {reasons[0].description}
              </p>
            </div>
          </motion.div>

          {/* Remaining items — stacked cards */}
          <div className="grid grid-cols-1 gap-3 mt-4">
            {reasons.slice(1).map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3 bg-white rounded-xl border border-slate-100 shadow-sm p-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={r.icon} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[20px] font-bold gradient-text leading-none">{r.stat}</div>
                  <h3 className="text-[15px] font-semibold text-slate-900 mt-1">
                    {r.title}
                  </h3>
                  <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 mt-0.5">
                    {r.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* === DESKTOP LAYOUT === */}
        {/* Top row — 2 featured cards */}
        <div className="hidden md:grid grid-cols-2 gap-5 mb-5">
          {reasons.slice(0, 2).map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl bg-white border border-slate-100 p-8 md:p-10 shadow-elevation-1 hover:shadow-elevation-2 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Large faded stat in background */}
              <div className="absolute -top-4 -right-2 font-display text-[120px] md:text-[160px] font-bold leading-none text-primary-50 pointer-events-none select-none">
                {r.stat}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white flex items-center justify-center transition-colors duration-300">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d={r.icon} />
                    </svg>
                  </div>
                  <div>
                    <div className="font-display text-[28px] md:text-[32px] font-bold gradient-text leading-none">{r.stat}</div>
                    <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-slate-400 mt-0.5">{r.statLabel}</div>
                  </div>
                </div>

                <h3 className="font-display text-[22px] md:text-[24px] font-semibold text-slate-900 mb-3">
                  {r.title}
                </h3>
                <p className="text-[14px] md:text-[15px] text-slate-500 leading-relaxed">
                  {r.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom row — 4 compact cards */}
        <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-5 xl:gap-6 2xl:gap-8">
          {reasons.slice(2).map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              className="group rounded-2xl bg-white border border-slate-100 p-6 md:p-7 shadow-elevation-1 hover:shadow-elevation-2 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white flex items-center justify-center transition-colors duration-300">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={r.icon} />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="font-display text-[24px] font-bold gradient-text leading-none">{r.stat}</div>
                  <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-slate-400 mt-0.5">{r.statLabel}</div>
                </div>
              </div>

              <h3 className="font-display text-[18px] font-semibold text-slate-900 mb-2">
                {r.title}
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                {r.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
