"use client";

import { Modal } from "../Modal";
import { Vehicle } from "@/lib/data";

interface VehicleDetailProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
  onBook: () => void;
}

const SELF_RIDE_CATEGORIES = ["Scooter", "Royal Enfield", "Tuk-Tuk"];

const INCLUDED_DRIVER = [
  { label: "Professional driver", desc: "Experienced, English-speaking driver for your entire trip" },
  { label: "Vehicle insurance", desc: "Comprehensive coverage included at no extra cost" },
  { label: "24/7 phone support", desc: "Round-the-clock assistance throughout your journey" },
  { label: "GPS navigation", desc: "In-vehicle GPS device or phone mount provided free" },
  { label: "Flexible pickup & drop-off", desc: "Any location across Sri Lanka \u2014 hotel, airport, or city" },
  { label: "Complimentary bottled water", desc: "Stay refreshed on every ride" },
];

const INCLUDED_SELF_RIDE = [
  { label: "Vehicle insurance", desc: "Comprehensive coverage included at no extra cost" },
  { label: "24/7 roadside assistance", desc: "Help is one call away, anywhere on the island" },
  { label: "GPS navigation", desc: "GPS device or phone mount provided for easy navigation" },
  { label: "Flexible pickup & drop-off", desc: "Collect and return at Colombo, airport, Galle, Kandy, or Ella" },
  { label: "No mileage limits", desc: "Unlimited kilometres on multi-day rentals" },
  { label: "Safety gear included", desc: "All required safety equipment provided with the vehicle" },
];

export function VehicleDetail({ vehicle, open, onClose, onBook }: VehicleDetailProps) {
  if (!vehicle) return null;

  const isSelfRide = SELF_RIDE_CATEGORIES.includes(vehicle.category);
  const included = isSelfRide ? INCLUDED_SELF_RIDE : INCLUDED_DRIVER;

  return (
    <Modal open={open} onClose={onClose} width={1080}>
      {/* Hero */}
      <div className="relative h-[280px] md:h-[400px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
          <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary-300 mb-3">
            {vehicle.category.toUpperCase()} &middot; {vehicle.seats} {vehicle.seats === 1 ? "RIDER" : isSelfRide ? "RIDERS" : "SEATS"}
          </div>
          <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold leading-[0.98]">{vehicle.name}</h2>
          <p className="mt-3 text-[16px] text-white/80 max-w-[500px] leading-relaxed">{vehicle.description}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
        <div>
          {/* Specs row */}
          <div className="flex flex-wrap gap-4 pb-8 border-b border-slate-100 mb-8">
            {[
              { l: isSelfRide ? "Riders" : "Seats", v: `${vehicle.seats} ${isSelfRide ? "riders" : "pax"}`, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
              { l: "Transmission", v: vehicle.transmission, icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
              { l: "Climate", v: vehicle.ac ? "A/C" : "Non-A/C", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              { l: "Luggage", v: vehicle.luggage, icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
            ].map((s) => (
              <div key={s.l} className="flex-1 min-w-[120px] bg-slate-50 rounded-xl p-4 text-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" strokeWidth="1.5" strokeLinecap="round" className="mx-auto mb-2"><path d={s.icon} /></svg>
                <div className="font-display text-[15px] font-semibold">{s.v}</div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Features & Amenities */}
          <h3 className="font-display text-[24px] font-semibold mb-5">Features &amp; amenities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {vehicle.features.map((f) => (
              <div key={f} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-500)" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>
                <span className="text-[14px] text-slate-700">{f}</span>
              </div>
            ))}
          </div>

          {/* What's Included */}
          <h3 className="font-display text-[24px] font-semibold mb-5">What&apos;s included</h3>
          <div className="grid grid-cols-1 gap-3">
            {included.map((item) => (
              <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-primary-50/50 border border-primary-100/50">
                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>
                </div>
                <div>
                  <div className="font-display text-[15px] font-semibold text-slate-800">{item.label}</div>
                  <div className="text-[13px] text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:sticky lg:top-6 self-start">
          <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-elevation-1">
            <div className="font-display text-[22px] font-semibold text-slate-900 mb-1">Interested?</div>
            <p className="text-[14px] text-slate-500 leading-relaxed">Contact us for availability and pricing tailored to your trip.</p>
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
              <button onClick={onBook}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-[14px] font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all min-h-[48px]">
                Book this vehicle
              </button>
              <a href="https://wa.me/94770813690" target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-[14px] font-medium text-slate-700 border border-slate-200 hover:border-primary-300 hover:text-primary-700 transition-all min-h-[48px]">
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
