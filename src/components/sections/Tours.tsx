"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VEHICLES, Vehicle } from "@/lib/data";

interface FleetProps {
  onOpenVehicle: (vehicle: Vehicle) => void;
}

const CATEGORIES = [
  { key: "All", label: "All Vehicles" },
  { key: "Sedan", label: "Sedans" },
  { key: "Luxury Sedan", label: "Luxury" },
  { key: "High Roof Van", label: "High Roof" },
  { key: "Flat Roof Van", label: "Flat Roof" },
  { key: "Rosa Bus", label: "Rosa Bus" },
  { key: "Luxury Coach", label: "Coach" },
  { key: "Scooter", label: "Scooters" },
  { key: "Royal Enfield", label: "Enfield" },
  { key: "Tuk-Tuk", label: "Tuk-Tuks" },
] as const;

const SELF_RIDE = ["Scooter", "Royal Enfield", "Tuk-Tuk"];

export function Fleet({ onOpenVehicle }: FleetProps) {
  const [filter, setFilter] = useState("All");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered =
    filter === "All"
      ? VEHICLES
      : VEHICLES.filter((v) => v.category === filter);

  return (
    <section id="fleet" className="section-padding bg-slate-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <div className="content-max relative">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-300" />
              <span className="font-mono text-[12px] tracking-[0.16em] uppercase font-semibold text-primary-400">
                Our fleet
              </span>
              <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-300 to-primary-400" />
            </div>
            <h2 className="font-display font-bold text-[clamp(32px,4.5vw,56px)] leading-[1.05] text-white">
              Choose your perfect{" "}
              <span className="text-primary-400">ride</span>
            </h2>
            <p className="text-[16px] md:text-[18px] text-white/75 mt-4 max-w-[500px] mx-auto leading-relaxed">
              From compact sedans to luxury coaches — we have the right vehicle for every Sri Lankan adventure.
            </p>
          </motion.div>
        </div>

        {/* Category filter — horizontal scrollable pills */}
        <div className="mb-10 -mx-4 px-4 md:mx-0 md:px-0">
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto pb-2 no-scrollbar md:flex-wrap md:justify-center"
          >
            {CATEGORIES.map((cat) => {
              const isActive = filter === cat.key;
              const count = cat.key === "All" ? VEHICLES.length : VEHICLES.filter(v => v.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => setFilter(cat.key)}
                  className={`relative flex-shrink-0 px-5 py-2.5 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-300 min-h-[44px] flex items-center gap-2 border ${
                    isActive
                      ? "bg-primary-500 border-primary-400 text-white shadow-[0_0_20px_rgba(21,176,248,0.25)]"
                      : "bg-white/5 border-white/10 text-white/75 hover:bg-white/10 hover:text-white/90"
                  }`}
                >
                  {cat.label}
                  <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-white/5 text-white/75"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile: Single column horizontal cards */}
        <div className="md:hidden flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((v, i) => (
              <MobileFleetCard
                key={v.id}
                vehicle={v}
                onOpen={() => onOpenVehicle(v)}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Desktop: Vehicle grid */}
        <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5 xl:gap-6 2xl:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((v, i) => (
              <FleetCard
                key={v.id}
                vehicle={v}
                onOpen={() => onOpenVehicle(v)}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/75">
            <p className="font-display text-[20px]">No vehicles in this category</p>
          </div>
        )}
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
      `}</style>
    </section>
  );
}

/* ─── Fleet Card ─────────────────────────────────────── */

function FleetCard({
  vehicle,
  onOpen,
  index,
}: {
  vehicle: Vehicle;
  onOpen: () => void;
  index: number;
}) {
  const isSelfRide = SELF_RIDE.includes(vehicle.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      onClick={onOpen}
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white/[0.04] border border-white/[0.08] hover:border-primary-400/30 hover:bg-white/[0.07] transition-all duration-400"
    >
      {/* Image */}
      <div className="relative aspect-[16/11] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={vehicle.image}
          alt={`${vehicle.name} - ${vehicle.category}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {isSelfRide && (
            <span className="bg-amber-500 text-white rounded-full px-3 py-1 text-[11px] font-mono tracking-[0.08em] uppercase font-semibold">
              Self-ride
            </span>
          )}
          {!isSelfRide && (
            <span className="backdrop-blur-md bg-white/15 border border-white/10 text-white rounded-full px-3 py-1 text-[11px] font-mono tracking-[0.08em] uppercase">
              With driver
            </span>
          )}
          <span className="backdrop-blur-md bg-black/30 text-white rounded-full px-3 py-1 text-[11px] font-mono tracking-[0.08em]">
            {vehicle.seats} {isSelfRide ? "riders" : "seats"}
          </span>
        </div>

        {/* Hover CTA overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <span className="bg-white text-primary-700 font-semibold text-[13px] rounded-full px-6 py-2.5 shadow-lg flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            View details
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-[22px] font-semibold text-white leading-tight group-hover:text-primary-300 transition-colors duration-300">
          {vehicle.name}
        </h3>

        {/* Specs row */}
        <div className="flex items-center gap-3 mt-3 text-[12px] text-white/75 font-mono">
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2m-9-11h2m18 0h2"/></svg>
            {vehicle.transmission}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{vehicle.ac ? "A/C" : "Non-A/C"}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>{vehicle.luggage}</span>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {vehicle.features.slice(0, 3).map((f) => (
            <span
              key={f}
              className="bg-white/[0.06] border border-white/[0.06] rounded-full px-2.5 py-1 text-[11px] text-white/75"
            >
              {f}
            </span>
          ))}
          {vehicle.features.length > 3 && (
            <span className="bg-primary-500/10 border border-primary-400/20 rounded-full px-2.5 py-1 text-[11px] text-primary-400">
              +{vehicle.features.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Mobile Fleet Card (horizontal layout) ──────────── */

function MobileFleetCard({
  vehicle,
  onOpen,
  index,
}: {
  vehicle: Vehicle;
  onOpen: () => void;
  index: number;
}) {
  const isSelfRide = SELF_RIDE.includes(vehicle.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      onClick={onOpen}
      className="flex gap-4 rounded-2xl overflow-hidden cursor-pointer bg-white/[0.04] border border-white/[0.08] p-3"
    >
      {/* Image */}
      <div className="relative w-[120px] h-[120px] rounded-xl overflow-hidden flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={vehicle.image}
          alt={`${vehicle.name} - ${vehicle.category}`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

        {/* Badge */}
        <div className="absolute top-2 left-2">
          {isSelfRide ? (
            <span className="bg-amber-500 text-white rounded-full px-2 py-0.5 text-[11px] font-mono tracking-[0.06em] uppercase font-semibold">
              Self-ride
            </span>
          ) : (
            <span className="backdrop-blur-md bg-white/15 border border-white/10 text-white rounded-full px-2 py-0.5 text-[11px] font-mono tracking-[0.06em] uppercase">
              With driver
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="font-display text-[17px] font-semibold text-white leading-tight truncate">
          {vehicle.name}
        </h3>

        {/* Specs row */}
        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-white/75 font-mono">
          <span>{vehicle.transmission}</span>
          <span className="text-white/20">&middot;</span>
          <span>{vehicle.ac ? "A/C" : "Non-A/C"}</span>
          <span className="text-white/20">&middot;</span>
          <span>{vehicle.luggage}</span>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {vehicle.features.slice(0, 2).map((f) => (
            <span
              key={f}
              className="bg-white/[0.06] border border-white/[0.06] rounded-full px-2 py-0.5 text-[11px] text-white/75"
            >
              {f}
            </span>
          ))}
        </div>

        {/* View details link */}
        <div className="flex items-center gap-1 mt-2.5 text-[12px] font-medium text-primary-400">
          View details
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
