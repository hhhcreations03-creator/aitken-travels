"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES, Service } from "@/lib/data";
import { SectionHead } from "../SectionHead";

const SERVICE_ICONS: Record<string, string> = {
  "airport-transfers": "M12 19V5m0 0l-4 4m4-4l4 4 M4 15h16",
  "round-tours": "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
  "self-drive": "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10 M17.5 16V11a1 1 0 00-.3-.7l-3.5-3.5A1 1 0 0013 6.5H13v10",
  "day-trips": "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707 M16 12a4 4 0 11-8 0 4 4 0 018 0z",
};

interface ServicesProps {
  onBookService?: (serviceId: string) => void;
}

export function Services({ onBookService }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section id="services" className="section-padding bg-white">
      <div className="content-max">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <SectionHead
            align="center"
            eyebrow="What we offer"
            title={
              <>
                Everything you need to{" "}
                <em className="gradient-text-accent not-italic">explore</em>{" "}
                Sri Lanka
              </>
            }
            sub="Airport pickups, multi-day tours, self-drive adventures, and day trips — all with professional drivers and island-wide coverage."
          />
        </div>

        {/* Mobile: Stacked card grid */}
        <div className="md:hidden">
          <div className="grid grid-cols-1 gap-4">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => setSelectedService(service)}
                className="flex rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-elevation-1 cursor-pointer"
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-[110px] h-[110px] rounded-l-2xl object-cover flex-shrink-0"
                />

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-center">
                  <h3 className="text-[17px] font-semibold text-slate-900 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 leading-snug mt-1 line-clamp-1">
                    {service.blurb}
                  </p>
                  <span className="text-[11px] font-mono text-primary-600 tracking-[0.1em] uppercase mt-2">
                    {service.meta}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop: 2x2 Card Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 xl:gap-8">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => setSelectedService(service)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-slate-100 shadow-elevation-1 hover:shadow-elevation-2 hover:-translate-y-1 transition-all duration-400"
            >
              {/* Image */}
              <div className="relative h-[280px] overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-[1.05] transition-transform duration-700"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />

                {/* Number + badge */}
                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center font-display text-[15px] font-bold text-primary-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="backdrop-blur-md bg-white/20 border border-white/10 text-white rounded-full px-3 py-1 text-[11px] font-mono tracking-[0.1em] uppercase">
                    {service.meta}
                  </span>
                </div>

                {/* Hover overlay CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white/95 backdrop-blur-sm text-primary-700 font-semibold text-[14px] rounded-full px-6 py-3 shadow-lg flex items-center gap-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                    Learn more
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={SERVICE_ICONS[service.id] || ""} />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display text-[24px] font-semibold text-slate-900 leading-tight group-hover:text-primary-800 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-[14px] text-slate-500 leading-relaxed mt-2 line-clamp-2">
                      {service.blurb}
                    </p>
                  </div>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-slate-50">
                  {service.details.features.slice(0, 3).map((f) => (
                    <span key={f} className="text-[12px] font-medium text-primary-700 bg-primary-50 rounded-full px-3 py-1">
                      {f.split("\u2014")[0].trim()}
                    </span>
                  ))}
                  <span className="text-[12px] font-medium text-slate-400 bg-slate-50 rounded-full px-3 py-1">
                    +{service.details.features.length - 3} more
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceModal
        service={selectedService}
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
        onBook={(serviceId: string) => {
          setSelectedService(null);
          onBookService?.(serviceId);
        }}
      />
    </section>
  );
}

/* ─── Service Detail Modal ───────────────────────────── */

function ServiceModal({
  service,
  open,
  onClose,
  onBook,
}: {
  service: Service | null;
  open: boolean;
  onClose: () => void;
  onBook: (serviceId: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-[12px] flex items-center justify-center p-4 md:p-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-hidden relative shadow-elevation-3 w-full max-w-[900px] max-h-[90vh] overflow-y-auto"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 cursor-pointer flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 14 14">
                <path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            {/* Hero */}
            <div className="relative h-[220px] md:h-[300px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <span className="inline-flex items-center gap-2 backdrop-blur-md bg-white/15 border border-white/10 text-white rounded-full px-3 py-1 text-[11px] font-mono tracking-[0.1em] uppercase mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={SERVICE_ICONS[service.id] || ""} />
                  </svg>
                  {service.meta}
                </span>
                <h2 className="font-display text-[32px] md:text-[40px] font-bold text-white leading-tight">
                  {service.title}
                </h2>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-10">
              <p className="text-[16px] md:text-[17px] text-slate-600 leading-[1.7] mb-8">
                {service.details.description}
              </p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-display text-[20px] font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  What&apos;s included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.details.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 p-3 rounded-xl bg-primary-50/60 border border-primary-100/60">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-[14px] text-slate-700 leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Routes */}
              {service.details.routes && service.details.routes.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-display text-[20px] font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    Popular routes
                  </h3>
                  <div className="rounded-xl border border-slate-100 overflow-hidden">
                    {service.details.routes.map((route, idx) => (
                      <div key={route} className={`flex items-center gap-3 px-5 py-3.5 text-[14px] text-slate-700 hover:bg-primary-50/50 transition-colors ${idx > 0 ? "border-t border-slate-50" : ""}`}>
                        <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[11px] font-mono font-semibold flex-shrink-0">{idx + 1}</span>
                        {route}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing */}
              {service.details.pricing && (
                <div className="mb-8 p-5 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-100">
                  <h3 className="font-display text-[16px] font-semibold text-primary-900 mb-1 flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-700)" strokeWidth="2" strokeLinecap="round">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                    Pricing
                  </h3>
                  <p className="text-[14px] text-primary-800/80">{service.details.pricing}</p>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => service && onBook(service.id)}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl px-8 py-3.5 font-semibold text-[15px] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
                >
                  Book this service
                </button>
                <a
                  href="https://wa.me/94770813690"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none border border-slate-200 text-slate-700 rounded-xl px-8 py-3.5 font-medium text-[15px] hover:border-primary-300 hover:text-primary-700 transition-all duration-300 min-h-[48px] flex items-center justify-center gap-2"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
