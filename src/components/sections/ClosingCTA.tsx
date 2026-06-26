"use client";

import { motion } from "framer-motion";

interface ClosingCTAProps {
  onOpenBooking: () => void;
}

const steps = [
  { num: "01", title: "Tell us your plan", desc: "Share your dates, destinations, and group size", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { num: "02", title: "We match your ride", desc: "Get the perfect vehicle and driver within an hour", icon: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10 M17.5 16V11a1 1 0 00-.3-.7l-3.5-3.5A1 1 0 0013 6.5H13v10" },
  { num: "03", title: "Enjoy Sri Lanka", desc: "Sit back, relax, and explore the island your way", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
];

export function ClosingCTA({ onOpenBooking }: ClosingCTAProps) {
  return (
    <section id="contact" className="py-[80px] md:py-[120px] px-6 md:px-10 lg:px-16 2xl:px-24 bg-gradient-to-b from-white via-primary-50/30 to-primary-50/60 overflow-hidden">
      <div className="content-max">
        {/* Top — centered headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
            <span className="font-mono text-[12px] tracking-[0.16em] uppercase font-semibold text-primary-700">
              How it works
            </span>
            <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-600 to-primary-400" />
          </div>
          <h2 className="font-display font-bold text-[clamp(32px,4.5vw,52px)] leading-[1.08] text-slate-900">
            Three steps to your{" "}
            <span className="gradient-text-accent">Sri Lanka</span> trip
          </h2>
        </motion.div>

        {/* === MOBILE STEPS — vertical numbered list === */}
        <div className="md:hidden flex flex-col gap-5 mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex gap-4 items-start"
            >
              {/* Number circle */}
              <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-mono text-[13px] font-bold flex-shrink-0 shadow-sm">
                {step.num}
              </div>
              <div className="pt-1">
                <h3 className="font-display text-[17px] font-semibold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* === DESKTOP STEPS — 3 columns === */}
        <div className="hidden md:grid md:grid-cols-3 gap-0 mb-16 md:mb-20 relative">
          {/* Connecting line on desktop */}
          <div className="absolute top-[52px] left-[16.67%] right-[16.67%] h-[2px]">
            <div className="h-full bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 rounded-full" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center relative"
            >
              {/* Icon circle */}
              <div className="w-[104px] h-[104px] rounded-full bg-white border-2 border-primary-100 shadow-elevation-1 flex items-center justify-center mx-auto mb-6 relative z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={step.icon} />
                  </svg>
                </div>
                {/* Step number badge */}
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-mono text-[11px] font-bold shadow-sm">
                  {step.num}
                </div>
              </div>
              <h3 className="font-display text-[20px] font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-[14px] text-slate-500 max-w-[260px] mx-auto leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom — CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl bg-slate-900 p-8 md:p-12 lg:p-16 relative overflow-hidden"
        >
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-primary-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-primary-400/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Text */}
            <div className="text-center lg:text-left max-w-[500px]">
              <h3 className="font-display font-bold text-[clamp(24px,3.5vw,36px)] leading-[1.1] text-white mb-3">
                Ready to hit the road?
              </h3>
              <p className="text-[15px] text-white/50 leading-relaxed">
                Get in touch today and we&apos;ll have your perfect vehicle
                and driver sorted &mdash; usually within the hour.
              </p>
            </div>

            {/* Buttons + trust */}
            <div className="flex flex-col items-center lg:items-end gap-5">
              <div className="flex flex-col md:flex-row flex-wrap gap-3 justify-center lg:justify-end">
                <button
                  onClick={onOpenBooking}
                  className="bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-full px-8 py-4 font-semibold text-[15px] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(21,176,248,0.3)] transition-all duration-300 min-h-[52px] cursor-pointer flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  Book a vehicle
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
                <a
                  href="https://wa.me/94770813690?text=Hi%20Aitken%20Travels!%20I'd%20like%20to%20plan%20a%20trip%20to%20Sri%20Lanka."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/15 text-white rounded-full px-8 py-4 font-medium text-[15px] hover:bg-white/10 transition-all duration-300 min-h-[52px] inline-flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-60">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
              <div className="grid grid-cols-2 md:flex flex-wrap gap-x-5 gap-y-2 md:gap-y-1 justify-center lg:justify-end">
                {["Responds in 1 hour", "No upfront payment", "Free cancellation"].map((b) => (
                  <div key={b} className="flex items-center gap-1.5 text-[12px] text-white/30">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary-400">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
