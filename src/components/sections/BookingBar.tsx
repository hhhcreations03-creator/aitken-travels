"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface SearchSectionProps {
  onOpenBooking: () => void;
}

const FIELDS = [
  {
    label: "Service",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    options: ["Airport Transfer", "Round Island Tour", "Day Excursion", "Vehicle Rental"],
  },
  {
    label: "Vehicle",
    icon: "M8 17h8M8 17a2 2 0 01-2-2V9h12v6a2 2 0 01-2 2M8 17v2m8-2v2M4 9l1-4h14l1 4",
    options: ["Any Vehicle", "Car (1-3 pax)", "Van (4-12 pax)", "Bus (13-45 pax)", "Motorbike"],
  },
  {
    label: "When",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    options: ["Flexible Dates", "Today", "Tomorrow", "This Week", "Next Week", "Pick a Date"],
  },
  {
    label: "Pickup Location",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    options: ["Colombo", "Airport (CMB)", "Kandy", "Galle", "Ella", "Negombo", "Sigiriya", "Nuwara Eliya"],
  },
];

export function SearchSection({ onOpenBooking }: SearchSectionProps) {
  const [values, setValues] = useState(FIELDS.map((f) => f.options[0]));

  return (
    <section className="bg-primary-900 py-10 md:py-14 px-6 md:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="content-max"
      >
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <h2 className="font-display text-white text-[20px] md:text-[24px] font-semibold">
            Find your perfect ride
          </h2>
        </div>

        {/* Desktop: Horizontal form */}
        <div className="hidden md:block">
          <div className="bg-white rounded-2xl p-2 shadow-elevation-2">
            <div className="flex items-stretch">
              {FIELDS.map((f, i) => (
                <div key={f.label} className="flex items-stretch flex-1">
                  <div className="flex-1 px-5 py-4 group">
                    <div className="flex items-center gap-2 mb-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="var(--primary-600)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        className="flex-shrink-0 opacity-60">
                        <path d={f.icon} />
                      </svg>
                      <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary-700 font-semibold">
                        {f.label}
                      </label>
                    </div>
                    <select
                      value={values[i]}
                      onChange={(e) => {
                        const next = [...values];
                        next[i] = e.target.value;
                        setValues(next);
                      }}
                      className="w-full bg-transparent border-none outline-none font-sans text-[15px] font-medium text-slate-800 cursor-pointer appearance-none truncate pr-4"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 0 center",
                      }}
                    >
                      {f.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  {i < FIELDS.length - 1 && (
                    <div className="w-px self-stretch my-3 bg-slate-100 flex-shrink-0" />
                  )}
                </div>
              ))}

              {/* Search button */}
              <div className="flex-shrink-0 p-1.5 pl-2">
                <button
                  onClick={onOpenBooking}
                  className="h-full bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl px-10 flex items-center gap-2.5 text-[15px] font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer min-h-[56px]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Stacked form */}
        <div className="md:hidden space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map((f, i) => (
              <div key={f.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="var(--primary-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                  <label className="font-mono text-[9px] tracking-[0.14em] uppercase text-primary-300 font-semibold">
                    {f.label}
                  </label>
                </div>
                <select
                  value={values[i]}
                  onChange={(e) => {
                    const next = [...values];
                    next[i] = e.target.value;
                    setValues(next);
                  }}
                  className="w-full bg-transparent border-none outline-none font-sans text-[14px] font-medium text-white cursor-pointer appearance-none"
                >
                  {f.options.map((o) => (
                    <option key={o} className="text-slate-900">{o}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button
            onClick={onOpenBooking}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl py-4 font-semibold text-[15px] cursor-pointer hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 min-h-[52px]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            Search available vehicles
          </button>
        </div>
      </motion.div>
    </section>
  );
}
