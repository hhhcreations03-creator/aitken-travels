"use client";

import { useState } from "react";
import { Modal } from "../Modal";

interface Day {
  city: string;
  n: number;
  hotel: string;
}

const INITIAL_DAYS: Day[] = [
  { city: "Colombo", n: 1, hotel: "Cinnamon Lakeside" },
  { city: "Sigiriya", n: 2, hotel: "Water Garden Sigiriya" },
  { city: "Kandy", n: 2, hotel: "Kandy House" },
  { city: "Ella", n: 2, hotel: "98 Acres Resort" },
  { city: "Yala", n: 2, hotel: "Wild Coast Tented Lodge" },
];

const CITIES = [
  "Colombo", "Sigiriya", "Kandy", "Ella", "Yala", "Galle",
  "Mirissa", "Wilpattu", "Anuradhapura", "Nuwara Eliya",
];

export function ItineraryBuilder({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [days, setDays] = useState<Day[]>(INITIAL_DAYS);
  const total = days.reduce((s, d) => s + d.n, 0);
  const price = total * 420;

  return (
    <Modal open={open} onClose={onClose} width={1100}>
      <div className="p-8 md:p-12">
        <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-gold-deep mb-3">
          SMART ITINERARY BUILDER
        </div>
        <h2 className="font-serif text-[36px] md:text-[48px] leading-[1.05] font-normal mb-3">
          Build your trip, in real time.
        </h2>
        <p className="text-gray max-w-[600px] mb-10">
          Drag, drop, edit. Pricing updates live. A human reviews everything
          before you pay anything.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div>
            {days.map((d, i) => (
              <div
                key={i}
                className="grid grid-cols-[40px_1fr_auto_40px] gap-4 items-center py-4 border-b border-black/[0.08]"
              >
                <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-gold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <select
                    value={d.city}
                    onChange={(e) => {
                      const nd = [...days];
                      nd[i].city = e.target.value;
                      setDays(nd);
                    }}
                    className="border-none bg-transparent font-serif text-[22px] font-normal cursor-pointer outline-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <div className="text-xs text-gray mt-0.5">{d.hotel}</div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => {
                      const nd = [...days];
                      nd[i].n = Math.max(1, nd[i].n - 1);
                      setDays(nd);
                    }}
                    className="w-7 h-7 border border-black/15 bg-white rounded cursor-pointer text-sm flex items-center justify-center hover:border-charcoal transition-colors"
                  >
                    &ndash;
                  </button>
                  <span className="font-mono text-[11px] tracking-[0.08em] uppercase min-w-[64px] text-center">
                    {d.n} {d.n === 1 ? "NIGHT" : "NIGHTS"}
                  </span>
                  <button
                    onClick={() => {
                      const nd = [...days];
                      nd[i].n += 1;
                      setDays(nd);
                    }}
                    className="w-7 h-7 border border-black/15 bg-white rounded cursor-pointer text-sm flex items-center justify-center hover:border-charcoal transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => setDays(days.filter((_, j) => j !== i))}
                  className="bg-transparent border-none text-gray cursor-pointer text-lg hover:text-charcoal transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setDays([...days, { city: "Galle", n: 2, hotel: "Amangalla" }])
              }
              className="mt-4 w-full py-3 px-5 border border-dashed border-black/15 bg-transparent cursor-pointer rounded text-gray text-sm hover:border-charcoal hover:text-charcoal transition-colors"
            >
              + Add a stop
            </button>
          </div>

          <div className="bg-emerald text-ivory p-8">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-gold mb-4">
              YOUR JOURNEY
            </div>
            <div className="flex justify-between mb-3">
              <span>Total nights</span>
              <span className="font-serif text-[22px]">{total}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span>Stops</span>
              <span className="font-serif text-[22px]">{days.length}</span>
            </div>
            <div className="flex justify-between mb-6 pb-6 border-b border-white/20">
              <span>Suggested style</span>
              <span className="text-[13px]">Cultural &middot; Slow</span>
            </div>
            <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-white/60 mb-2">
              FROM
            </div>
            <div className="font-serif text-[48px] font-light mb-6">
              ${price.toLocaleString()}
            </div>
            <button className="w-full inline-flex items-center justify-center gap-2.5 px-[26px] py-3.5 rounded-full text-[13.5px] font-medium bg-gold text-white hover:bg-gold-deep transition-all duration-200">
              Send to a designer
            </button>
            <div className="mt-4 text-xs text-white/60 text-center">
              You won&apos;t be charged. We&apos;ll write back within 48h.
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
