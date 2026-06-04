"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "../Modal";
import { Vehicle } from "@/lib/data";

interface BookingFlowProps {
  open: boolean;
  onClose: () => void;
  prefillVehicle: Vehicle | null;
}

interface BookingData {
  service: string;
  vehicle: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  days: number;
  pax: number;
  extras: string[];
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const STEPS = ["Service", "Route", "When", "Vehicle", "Extras", "You", "Confirm"];

export function BookingFlow({ open, onClose, prefillVehicle }: BookingFlowProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<BookingData>({
    service: "", vehicle: "", pickup: "", dropoff: "", date: "", time: "",
    days: 1, pax: 2, extras: [], name: "", email: "", phone: "", notes: "",
  });

  useEffect(() => {
    if (open && prefillVehicle) {
      setData((d) => ({ ...d, vehicle: prefillVehicle.name }));
      setStep(0);
    } else if (open) {
      setStep(0);
    }
  }, [open, prefillVehicle]);

  const set = (k: string, v: unknown) => setData((d) => ({ ...d, [k]: v }));
  const goNext = () => { setDir(1); setStep((s) => Math.min(s + 1, 6)); };
  const goBack = () => { setDir(-1); setStep((s) => Math.max(s - 1, 0)); };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <Modal open={open} onClose={onClose} width={1080}>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] min-h-[640px]">
        {/* Left rail */}
        <div className="hidden md:flex flex-col bg-gradient-to-b from-primary-900 to-primary-700 text-white p-10 relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />

          <div className="relative z-10">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary-300 mb-8">
              BOOK YOUR RIDE
            </div>
            <h3 className="font-display text-[28px] font-semibold leading-tight mb-2">
              Quick &amp; easy booking.
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-10">
              Seven steps to your perfect ride.
            </p>

            {/* Progress steps */}
            <div className="flex flex-col gap-0">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-start gap-3">
                  {/* Vertical connector */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-mono font-medium border-2 transition-all duration-300"
                      style={{
                        borderColor: i <= step ? "var(--primary-400)" : "rgba(255,255,255,0.15)",
                        background: i < step ? "var(--primary-400)" : i === step ? "rgba(45,212,191,0.15)" : "transparent",
                        color: i < step ? "var(--primary-900)" : i === step ? "white" : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {i < step ? "\u2713" : String(i + 1).padStart(2, "0")}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="w-0.5 h-6 rounded-full transition-colors duration-300"
                        style={{ background: i < step ? "var(--primary-400)" : "rgba(255,255,255,0.1)" }}
                      />
                    )}
                  </div>
                  <span className={`mt-1.5 transition-all duration-200 ${
                    i === step ? "font-display text-[16px] font-semibold text-white" :
                    i < step ? "text-[13px] text-white/60" : "text-[13px] text-white/25"
                  }`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="p-6 md:p-12 flex flex-col">
          {/* Mobile progress bar */}
          <div className="md:hidden mb-6">
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span>Step {step + 1} of {STEPS.length}</span>
              <span>{STEPS[step]}</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
              >
                {step === 0 && <StepService data={data} set={set} />}
                {step === 1 && <StepRoute data={data} set={set} />}
                {step === 2 && <StepWhen data={data} set={set} />}
                {step === 3 && <StepVehicle data={data} set={set} />}
                {step === 4 && <StepExtras data={data} set={set} />}
                {step === 5 && <StepYou data={data} set={set} />}
                {step === 6 && <StepConfirm data={data} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-6">
            <button
              onClick={() => step > 0 ? goBack() : onClose()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] font-medium text-slate-600 border border-slate-200 hover:border-slate-400 transition-all min-h-[44px]"
            >
              {step > 0 ? "\u2190 Back" : "Cancel"}
            </button>
            {step < 6 ? (
              <button
                onClick={goNext}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[13px] font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all min-h-[44px]"
              >
                Continue &rarr;
              </button>
            ) : (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[13px] font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all min-h-[44px]"
              >
                Submit booking
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Step Components ───────────────────────────────────── */

type StepProps = { data: BookingData; set: (k: string, v: unknown) => void };

function StepService({ data, set }: StepProps) {
  const opts = [
    { id: "airport", t: "Airport Transfer", d: "Pickup or drop-off at BIA.", icon: "M12 19V5m0 0l-4 4m4-4l4 4" },
    { id: "round-tour", t: "Round Island Tour", d: "Multi-day tour with driver.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
    { id: "day-trip", t: "Day Excursion", d: "Half-day or full-day trip.", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" },
    { id: "self-drive", t: "Vehicle Rental", d: "Cars, bikes & tuk-tuks.", icon: "M15 7h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-6 0H7a2 2 0 01-2-2V9a2 2 0 012-2h2m4-4v4m0 12v-4" },
  ];
  return (
    <div>
      <h3 className="font-display text-[28px] md:text-[36px] font-semibold leading-tight mb-2">What do you need?</h3>
      <p className="text-slate-500 mb-8">Pick the service that fits your trip.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {opts.map((o) => (
          <button key={o.id} onClick={() => set("service", o.id)}
            className={`p-5 rounded-xl text-left transition-all duration-200 border-2 flex items-start gap-4 min-h-[44px] ${
              data.service === o.id
                ? "border-primary-500 bg-primary-50 shadow-[0_0_0_3px_rgba(245,158,11,0.1)]"
                : "border-slate-100 bg-white hover:border-primary-200"
            }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              data.service === o.id ? "bg-primary-600 text-white" : "bg-slate-50 text-slate-400"
            }`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={o.icon} /></svg>
            </div>
            <div>
              <div className="font-display text-[16px] font-semibold">{o.t}</div>
              <div className="text-[13px] text-slate-500 mt-0.5">{o.d}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepRoute({ data, set }: StepProps) {
  const locations = ["Airport (CMB)", "Colombo", "Negombo", "Kandy", "Sigiriya", "Ella", "Galle", "Mirissa", "Yala", "Anuradhapura", "Jaffna", "Trincomalee", "Nuwara Eliya", "Tangalle"];
  return (
    <div>
      <h3 className="font-display text-[28px] md:text-[36px] font-semibold leading-tight mb-2">Where to?</h3>
      <p className="text-slate-500 mb-8">Tell us pickup and drop-off locations.</p>
      <div className="flex flex-col gap-5">
        <FieldLabel label="Pickup location">
          <select value={data.pickup} onChange={(e) => set("pickup", e.target.value)} className="form-select">
            <option value="">Select pickup...</option>
            {locations.map((l) => <option key={l}>{l}</option>)}
          </select>
        </FieldLabel>
        <FieldLabel label="Drop-off location">
          <select value={data.dropoff} onChange={(e) => set("dropoff", e.target.value)} className="form-select">
            <option value="">Select drop-off...</option>
            {locations.map((l) => <option key={l}>{l}</option>)}
          </select>
        </FieldLabel>
        <FieldLabel label="Number of passengers">
          <input type="number" min="1" max="45" value={data.pax} onChange={(e) => set("pax", +e.target.value)} className="form-input w-32" />
        </FieldLabel>
      </div>
    </div>
  );
}

function StepWhen({ data, set }: StepProps) {
  return (
    <div>
      <h3 className="font-display text-[28px] md:text-[36px] font-semibold leading-tight mb-2">When do you need a ride?</h3>
      <p className="text-slate-500 mb-8">Date, time, and duration.</p>
      <div className="flex flex-col gap-5">
        <FieldLabel label="Date"><input type="date" value={data.date} onChange={(e) => set("date", e.target.value)} className="form-input" /></FieldLabel>
        <FieldLabel label="Pickup time"><input type="time" value={data.time} onChange={(e) => set("time", e.target.value)} className="form-input" /></FieldLabel>
        <div>
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary-600 font-medium mb-3">
            Duration &middot; {data.days} {data.days === 1 ? "day" : "days"}
          </div>
          <input type="range" min="1" max="21" value={data.days} onChange={(e) => set("days", +e.target.value)}
            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary-600 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-elevation-1" />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-2"><span>1</span><span>7</span><span>14</span><span>21</span></div>
        </div>
      </div>
    </div>
  );
}

function StepVehicle({ data, set }: StepProps) {
  const vehicles = [
    { id: "car", t: "Car (1\u20133 pax)", d: "Toyota Premio / Axio" },
    { id: "van-small", t: "Van \u2014 8 seats", d: "Toyota KDH" },
    { id: "van-large", t: "Van \u2014 12 seats", d: "Toyota HiAce" },
    { id: "mini-bus", t: "Mini Bus (28)", d: "Mitsubishi Rosa" },
    { id: "coach", t: "Coach (45)", d: "Luxury coach" },
    { id: "bike", t: "Motorbike", d: "Honda Dio / Enfield" },
  ];
  return (
    <div>
      <h3 className="font-display text-[28px] md:text-[36px] font-semibold leading-tight mb-2">Pick your ride.</h3>
      <p className="text-slate-500 mb-8">We&apos;ll match the best available vehicle.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {vehicles.map((o) => (
          <button key={o.id} onClick={() => set("vehicle", o.id)}
            className={`p-5 rounded-xl text-left transition-all duration-200 border-2 min-h-[44px] ${
              data.vehicle === o.id
                ? "border-primary-500 bg-primary-50 shadow-[0_0_0_3px_rgba(245,158,11,0.1)]"
                : "border-slate-100 bg-white hover:border-primary-200"
            }`}>
            <div className="font-display text-[16px] font-semibold">{o.t}</div>
            <div className="text-[13px] text-slate-500 mt-0.5">{o.d}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepExtras({ data, set }: StepProps) {
  const opts = [
    { id: "child-seat", t: "Child safety seat", sub: "+$5/day" },
    { id: "wifi", t: "Portable Wi-Fi", sub: "+$8/day" },
    { id: "cooler", t: "Cooler with drinks", sub: "+$10" },
    { id: "guide", t: "English tour guide", sub: "+$40/day" },
    { id: "gps", t: "GPS navigation", sub: "+$5/day" },
    { id: "decoration", t: "Vehicle decoration", sub: "+$50" },
  ];
  const toggle = (id: string) => set("extras", data.extras.includes(id) ? data.extras.filter((x) => x !== id) : [...data.extras, id]);
  return (
    <div>
      <h3 className="font-display text-[28px] md:text-[36px] font-semibold leading-tight mb-2">Any extras?</h3>
      <p className="text-slate-500 mb-8">Optional add-ons to enhance your ride.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {opts.map((o) => (
          <button key={o.id} onClick={() => toggle(o.id)}
            className={`p-5 rounded-xl flex justify-between items-center transition-all duration-200 border-2 text-left min-h-[44px] ${
              data.extras.includes(o.id)
                ? "border-primary-500 bg-primary-50"
                : "border-slate-100 bg-white hover:border-primary-200"
            }`}>
            <div>
              <div className="font-display text-[15px] font-semibold">{o.t}</div>
              <div className="font-mono text-[11px] text-slate-400 mt-1">{o.sub.toUpperCase()}</div>
            </div>
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs border-2 transition-all ${
              data.extras.includes(o.id) ? "border-primary-500 bg-primary-600 text-white" : "border-slate-200 bg-white"
            }`}>
              {data.extras.includes(o.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepYou({ data, set }: StepProps) {
  return (
    <div>
      <h3 className="font-display text-[28px] md:text-[36px] font-semibold leading-tight mb-2">Your details.</h3>
      <p className="text-slate-500 mb-8">So we can confirm your booking.</p>
      <div className="flex flex-col gap-5">
        <FieldLabel label="Full name"><input value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="John Smith" className="form-input" /></FieldLabel>
        <FieldLabel label="Email"><input value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" className="form-input" /></FieldLabel>
        <FieldLabel label="Phone / WhatsApp"><input value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+94 77 123 4567" className="form-input" /></FieldLabel>
        <FieldLabel label="Special requests"><textarea value={data.notes} onChange={(e) => set("notes", e.target.value)} rows={3} placeholder="Flight number, extra luggage..." className="form-input resize-none" /></FieldLabel>
      </div>
    </div>
  );
}

function StepConfirm({ data }: { data: BookingData }) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>
        </div>
        <div>
          <div className="font-mono text-[11px] text-primary-600 font-semibold tracking-wide uppercase mb-0.5">READY TO SUBMIT</div>
          <h3 className="font-display text-[24px] font-semibold">Your booking summary.</h3>
        </div>
      </div>
      <div className="bg-slate-50 rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-2 gap-5 text-sm">
          <Row label="Service" v={data.service || "\u2014"} />
          <Row label="Vehicle" v={data.vehicle || "\u2014"} />
          <Row label="Pickup" v={data.pickup || "\u2014"} />
          <Row label="Drop-off" v={data.dropoff || "\u2014"} />
          <Row label="Date" v={data.date || "\u2014"} />
          <Row label="Duration" v={`${data.days} ${data.days === 1 ? "day" : "days"}`} />
          <Row label="Passengers" v={`${data.pax}`} />
          <Row label="Extras" v={data.extras.length ? `${data.extras.length} selected` : "None"} />
        </div>
      </div>
      <p className="mt-6 text-sm text-slate-500 leading-relaxed">
        We&apos;ll confirm your booking via email and WhatsApp, usually within the hour.
      </p>
    </div>
  );
}

function Row({ label, v }: { label: string; v: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-slate-400 font-medium mb-1">{label}</div>
      <div className="text-[15px] font-medium text-slate-800 capitalize">{v}</div>
    </div>
  );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary-600 font-medium">{label}</label>
      {children}
      <style jsx>{`
        .form-input, .form-select {
          padding: 12px 16px;
          border: 1.5px solid var(--line-strong);
          border-radius: 12px;
          background: white;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          min-height: 44px;
          font-family: var(--font-inter), Inter, sans-serif;
        }
        .form-input:focus, .form-select:focus {
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
        }
      `}</style>
    </div>
  );
}
