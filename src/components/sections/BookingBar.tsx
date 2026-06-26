"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface SearchData {
  service: string;
  vehicle: string;
  date: string;
  pickup: string;
}

interface SearchSectionProps {
  onSearch: (data: SearchData) => void;
}

const SERVICE_OPTIONS = ["Airport Transfer", "Round Island Tour", "Day Excursion", "Vehicle Rental"];
const VEHICLE_OPTIONS = ["Any Vehicle", "Car (1-3 pax)", "Van (4-12 pax)", "Bus (13-45 pax)", "Motorbike", "Tuk-Tuk", "Scooter"];
const LOCATION_OPTIONS = ["Colombo", "Airport (CMB)", "Kandy", "Galle", "Ella", "Negombo", "Sigiriya", "Nuwara Eliya", "Mirissa", "Trincomalee", "Bentota"];

const FIELD_ICONS = {
  service: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  vehicle: "M8 17h8M8 17a2 2 0 01-2-2V9h12v6a2 2 0 01-2 2M8 17v2m8-2v2M4 9l1-4h14l1 4",
  date: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  pickup: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
};

export function SearchSection({ onSearch }: SearchSectionProps) {
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [vehicle, setVehicle] = useState(VEHICLE_OPTIONS[0]);
  const [date, setDate] = useState("");
  const [pickup, setPickup] = useState(LOCATION_OPTIONS[0]);

  const handleSearch = () => {
    onSearch({ service, vehicle, date, pickup });
  };

  return (
    <section className="py-5 md:py-14 px-5 md:px-10 lg:px-16 bg-transparent">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="content-max">
        <div className="hidden md:flex items-center gap-3 mb-6 md:mb-8">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <h2 className="font-display text-slate-900 text-[20px] md:text-[24px] font-semibold">Find your perfect ride</h2>
        </div>

        {/* Desktop */}
        <div className="hidden md:block">
          <div className="bg-white rounded-2xl p-2 shadow-elevation-2">
            <div className="flex items-stretch">
              {/* Service */}
              <Field icon={FIELD_ICONS.service} label="Service">
                <select value={service} onChange={(e) => setService(e.target.value)} className="field-select">
                  {SERVICE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Divider />
              {/* Vehicle */}
              <Field icon={FIELD_ICONS.vehicle} label="Vehicle">
                <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className="field-select">
                  {VEHICLE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Divider />
              {/* Date picker */}
              <Field icon={FIELD_ICONS.date} label="Travel Date">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="field-select cursor-pointer"
                  min={new Date().toISOString().split("T")[0]}
                />
              </Field>
              <Divider />
              {/* Pickup */}
              <Field icon={FIELD_ICONS.pickup} label="Pickup Location">
                <select value={pickup} onChange={(e) => setPickup(e.target.value)} className="field-select">
                  {LOCATION_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              {/* Search button */}
              <div className="flex-shrink-0 p-1.5 pl-2">
                <button onClick={handleSearch} className="h-full bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl px-10 flex items-center gap-2.5 text-[15px] font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer min-h-[56px]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div className="flex items-center gap-3 mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <h2 className="font-display text-slate-900 text-[18px] font-semibold">Find your ride</h2>
          </div>
          <div className="flex items-stretch gap-3">
            <div className="flex-[7] bg-white rounded-xl overflow-hidden">
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full h-full px-4 py-3.5 text-[15px] font-medium text-slate-800 bg-transparent border-none outline-none cursor-pointer appearance-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
              >
                {SERVICE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <button
              onClick={handleSearch}
              className="flex-[3] bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl px-4 py-3.5 font-semibold text-[15px] cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px]"
            >
              Book
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
            </button>
          </div>
          <p className="text-[12px] text-slate-400 text-center mt-3">
            Airport Transfer · Round Tour · Day Trip · Vehicle Rental
          </p>
        </div>

        <style jsx>{`
          .field-select { width: 100%; background: transparent; border: none; outline: none; font-family: var(--font-inter), Inter, sans-serif; font-size: 15px; font-weight: 500; color: #1e293b; cursor: pointer; appearance: none; }
          .mobile-select { width: 100%; background: transparent; border: none; outline: none; font-family: var(--font-inter), Inter, sans-serif; font-size: 14px; font-weight: 500; color: white; cursor: pointer; appearance: none; }
        `}</style>
      </motion.div>
    </section>
  );
}

function Field({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-stretch flex-1">
      <div className="flex-1 px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 opacity-60"><path d={icon} /></svg>
          <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary-700 font-semibold">{label}</label>
        </div>
        {children}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="w-px self-stretch my-3 bg-slate-100 flex-shrink-0" />;
}
