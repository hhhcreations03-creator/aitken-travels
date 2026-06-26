"use client";

import { motion } from "framer-motion";
import { OFFERS } from "@/lib/data";

const gradients = {
  terracotta: "bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600",
  gold: "bg-gradient-to-br from-primary-500 via-cyan-400 to-primary-600",
} as const;

const decorativeText = ["15%", "FREE"] as const;

interface OffersProps {
  onApplyOffer?: (offerIndex: number) => void;
}

export function Offers({ onApplyOffer }: OffersProps) {
  return (
    <section className="pb-[100px] md:pb-[140px] px-6 md:px-10 lg:px-16 2xl:px-24 bg-white">
      <div className="content-max grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
        {OFFERS.map((o, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            className={`rounded-2xl overflow-hidden p-10 md:p-14 relative cursor-pointer hover:-translate-y-1 hover:shadow-elevation-2 transition-all duration-300 text-white ${gradients[o.accent]}`}
          >
            {/* Decorative large text */}
            <div className="absolute top-4 right-4 text-[100px] font-display font-bold text-white/[0.07] leading-none pointer-events-none select-none">
              {decorativeText[i] ?? ""}
            </div>

            <div className="relative z-10">
              <div className="text-white/60 font-mono text-[11px] tracking-[0.16em] uppercase mb-6">
                {o.tag.toUpperCase()}
              </div>

              <h3 className="font-display text-[36px] md:text-[44px] font-semibold leading-tight max-w-[380px]">
                {o.title}
              </h3>

              <p className="text-white/80 mt-4 max-w-[380px] text-[15px] leading-relaxed">
                {o.sub}
              </p>

              <button
                onClick={() => onApplyOffer?.(i)}
                className="mt-8 inline-flex glass-card rounded-full px-6 py-3 text-white text-[13px] font-medium items-center gap-2 hover:bg-white/20 transition-colors duration-200 min-h-[44px] cursor-pointer"
              >
                Apply this offer &rarr;
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
