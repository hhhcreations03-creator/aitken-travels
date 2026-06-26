"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "../Modal";
import { Vehicle } from "@/lib/data";
import { SearchData } from "../sections/BookingBar";

interface BookingFlowProps {
  open: boolean;
  onClose: () => void;
  prefillVehicle: Vehicle | null;
  prefillSearch?: SearchData | null;
}

interface BookingData {
  // Step 1: Service
  service: string;
  // Airport Transfer fields
  flightNumber: string;
  arrivalDate: string;
  arrivalTime: string;
  airportPickup: string;
  airportDropoff: string;
  // Round Tour fields
  tourStartDate: string;
  tourDays: number;
  tourDestinations: string[];
  tourVehicle: string;
  // Day Trip fields
  dayTripDate: string;
  dayTripType: string;
  dayTripDestination: string;
  // Vehicle Rental fields
  rentalVehicle: string;
  rentalStartDate: string;
  rentalDays: number;
  rentalPickupLocation: string;
  // Common
  pax: number;
  // Accommodation
  needAccommodation: string;
  accommodationType: string;
  accommodationBudget: string;
  accommodationRooms: number;
  accommodationNotes: string;
  // Contact
  name: string;
  email: string;
  phone: string;
  country: string;
  notes: string;
}

const INITIAL_DATA: BookingData = {
  service: "", flightNumber: "", arrivalDate: "", arrivalTime: "", airportPickup: "Airport (CMB)", airportDropoff: "",
  tourStartDate: "", tourDays: 5, tourDestinations: [], tourVehicle: "",
  dayTripDate: "", dayTripType: "full", dayTripDestination: "",
  rentalVehicle: "", rentalStartDate: "", rentalDays: 3, rentalPickupLocation: "",
  pax: 2, needAccommodation: "", accommodationType: "", accommodationBudget: "", accommodationRooms: 1, accommodationNotes: "",
  name: "", email: "", phone: "", country: "", notes: "",
};

const LOCATIONS = ["Colombo", "Airport (CMB)", "Negombo", "Kandy", "Sigiriya", "Ella", "Galle", "Mirissa", "Yala", "Anuradhapura", "Jaffna", "Trincomalee", "Nuwara Eliya", "Tangalle", "Bentota", "Unawatuna"];
const TOUR_DESTINATIONS = ["Sigiriya", "Kandy", "Ella", "Nuwara Eliya", "Galle", "Mirissa", "Yala", "Anuradhapura", "Trincomalee", "Jaffna", "Bentota", "Wilpattu", "Polonnaruwa", "Dambulla"];

function getSteps(service: string, needAccom: string): string[] {
  const base = ["Service"];
  const serviceSteps: Record<string, string[]> = {
    airport: ["Flight Details", "Route"],
    "round-tour": ["Tour Details", "Vehicle"],
    "day-trip": ["Trip Details"],
    "self-drive": ["Rental Details"],
  };
  const steps = [...base, ...(serviceSteps[service] || [])];
  steps.push("Accommodation");
  if (needAccom === "yes") steps.push("Accommodation Details");
  steps.push("Your Details", "Review & Submit");
  return steps;
}

export function BookingFlow({ open, onClose, prefillVehicle, prefillSearch }: BookingFlowProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<BookingData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const steps = getSteps(data.service, data.needAccommodation);

  useEffect(() => {
    if (open) {
      const newData = { ...INITIAL_DATA };

      if (prefillVehicle) {
        newData.rentalVehicle = prefillVehicle.name;
      }

      if (prefillSearch) {
        // Map search service names to booking service IDs
        const serviceMap: Record<string, string> = {
          "Airport Transfer": "airport",
          "Round Island Tour": "round-tour",
          "Day Excursion": "day-trip",
          "Vehicle Rental": "self-drive",
        };
        const serviceId = serviceMap[prefillSearch.service] || "";
        newData.service = serviceId;

        // Pre-fill date into the correct field based on service
        if (prefillSearch.date) {
          if (serviceId === "airport") newData.arrivalDate = prefillSearch.date;
          else if (serviceId === "round-tour") newData.tourStartDate = prefillSearch.date;
          else if (serviceId === "day-trip") newData.dayTripDate = prefillSearch.date;
          else if (serviceId === "self-drive") newData.rentalStartDate = prefillSearch.date;
        }

        // Pre-fill pickup location
        if (prefillSearch.pickup) {
          if (serviceId === "airport") newData.airportPickup = prefillSearch.pickup;
          else if (serviceId === "self-drive") newData.rentalPickupLocation = prefillSearch.pickup;
        }

        // Pre-fill vehicle — map fleet names to booking form IDs
        if (prefillSearch.vehicle && prefillSearch.vehicle !== "Any Vehicle") {
          const vehicleMap: Record<string, string> = {
            "Sedan Cars": "sedan", "Luxury Sedan Cars": "luxury",
            "Flat Roof Vans": "van-flat", "High Roof Vans": "van-high",
            "Rosa Buses": "rosa", "Luxury Coach Buses": "coach",
            "Scooters": "scooter", "Royal Enfield Motorbikes": "enfield",
            "Tuk-Tuks": "tuktuk",
          };
          const mappedVehicle = vehicleMap[prefillSearch.vehicle] || prefillSearch.vehicle;
          if (serviceId === "round-tour") newData.tourVehicle = mappedVehicle;
          else if (serviceId === "self-drive") newData.rentalVehicle = mappedVehicle;
        }
      }

      // Auto-apply offer text to notes if coming from offer tiles
      if (prefillSearch && prefillSearch.service === "Round Island Tour" && !prefillSearch.date && !prefillSearch.vehicle) {
        newData.notes = "\u2b50 OFFER APPLIED: 15% off multi-day bookings (5+ days)";
      }
      if (prefillSearch && prefillSearch.service === "Airport Transfer" && prefillSearch.pickup === "Airport (CMB)" && !prefillSearch.date) {
        newData.notes = "\u2b50 OFFER APPLIED: Free meet & greet at Bandaranaike Airport";
      }

      setData(newData);
      // Skip to step 1 (past service selection) if search pre-filled the service
      setStep(prefillSearch?.service ? 1 : 0);
      setSubmitted(false);
      setSubmitting(false);
    }
  }, [open, prefillVehicle, prefillSearch]);

  const set = (k: string, v: unknown) => { setData((d) => ({ ...d, [k]: v })); setError(""); };
  const [error, setError] = useState("");
  const goBack = () => { setDir(-1); setStep((s) => Math.max(s - 1, 0)); setError(""); };
  const progress = ((step + 1) / steps.length) * 100;
  const currentStep = steps[step];

  const validate = (): string | null => {
    switch (currentStep) {
      case "Service":
        if (!data.service) return "Please select a service.";
        break;
      case "Flight Details":
        if (!data.arrivalDate) return "Please select an arrival date.";
        if (!data.arrivalTime) return "Please select an arrival time.";
        if (data.pax < 1) return "Please enter at least 1 passenger.";
        break;
      case "Route":
        if (!data.airportPickup) return "Please select a pickup location.";
        if (!data.airportDropoff) return "Please select a drop-off location.";
        break;
      case "Tour Details":
        if (!data.tourStartDate) return "Please select a start date.";
        if (data.tourDestinations.length === 0) return "Please select at least one destination.";
        if (data.pax < 1) return "Please enter at least 1 passenger.";
        break;
      case "Vehicle":
        if (!data.tourVehicle) return "Please select a vehicle type.";
        break;
      case "Trip Details":
        if (!data.dayTripDate) return "Please select a date.";
        if (!data.dayTripDestination) return "Please select a destination.";
        if (data.pax < 1) return "Please enter at least 1 passenger.";
        break;
      case "Rental Details":
        if (!data.rentalVehicle) return "Please select a vehicle type.";
        if (!data.rentalStartDate) return "Please select a start date.";
        if (!data.rentalPickupLocation) return "Please select a pickup location.";
        break;
      case "Accommodation":
        if (!data.needAccommodation) return "Please select whether you need accommodation.";
        break;
      case "Accommodation Details":
        if (!data.accommodationType) return "Please select an accommodation type.";
        if (!data.accommodationBudget) return "Please select a budget range.";
        break;
      case "Your Details":
        if (!data.name.trim()) return "Please enter your full name.";
        if (!data.email.trim()) return "Please enter your email address.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Please enter a valid email address.";
        if (!data.phone.trim()) return "Please enter your phone or WhatsApp number.";
        break;
    }
    return null;
  };

  const goNext = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setDir(1);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const subject = `New Booking Inquiry: ${data.service} - ${data.name}`;
    const body = buildEmailBody(data);
    // Send via mailto as fallback (works universally)
    const mailto = `mailto:travelsaitken@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, "_blank");
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Modal open={open} onClose={onClose} width={600}>
        <div className="p-10 md:p-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center mx-auto mb-6">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>
          </div>
          <h2 className="font-display text-[28px] font-bold text-slate-900 mb-3">Inquiry sent!</h2>
          <p className="text-[15px] text-slate-500 leading-relaxed mb-8 max-w-[360px] mx-auto">
            Your booking details have been sent to our team. We&apos;ll get back to you within 1 hour via email or WhatsApp.
          </p>
          <button onClick={onClose} className="bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-full px-8 py-3.5 font-semibold text-[15px] hover:shadow-lg transition-all cursor-pointer min-h-[48px]">
            Done
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} width={1080}>
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] min-h-[600px]">
        {/* Left rail */}
        <div className="hidden md:flex flex-col bg-gradient-to-b from-primary-900 to-primary-700 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative z-10">
            <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-primary-300 mb-6">Book your ride</div>
            <h3 className="font-display text-[24px] font-semibold leading-tight mb-8">Plan your Sri Lanka trip.</h3>
            <div className="flex flex-col gap-0">
              {steps.map((s, i) => (
                <div key={s + i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-medium border-2 transition-all duration-300" style={{
                      borderColor: i <= step ? "var(--primary-400)" : "rgba(255,255,255,0.15)",
                      background: i < step ? "var(--primary-400)" : i === step ? "rgba(21,176,248,0.15)" : "transparent",
                      color: i < step ? "var(--primary-900)" : i === step ? "white" : "rgba(255,255,255,0.3)",
                    }}>
                      {i < step ? "\u2713" : String(i + 1).padStart(2, "0")}
                    </div>
                    {i < steps.length - 1 && <div className="w-0.5 h-5 rounded-full transition-colors duration-300" style={{ background: i < step ? "var(--primary-400)" : "rgba(255,255,255,0.1)" }} />}
                  </div>
                  <span className={`mt-1 text-[12px] transition-all ${i === step ? "font-semibold text-white" : i < step ? "text-white/60" : "text-white/25"}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="p-6 md:p-10 flex flex-col">
          {/* Mobile progress */}
          <div className="md:hidden mb-5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span>Step {step + 1}/{steps.length}</span><span>{currentStep}</span>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={currentStep + step} custom={dir} initial={{ opacity: 0, x: dir * 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -30 }} transition={{ duration: 0.2 }}>
                {currentStep === "Service" && <StepService data={data} set={set} />}
                {currentStep === "Flight Details" && <StepFlight data={data} set={set} />}
                {currentStep === "Route" && <StepAirportRoute data={data} set={set} />}
                {currentStep === "Tour Details" && <StepTourDetails data={data} set={set} />}
                {currentStep === "Vehicle" && <StepTourVehicle data={data} set={set} />}
                {currentStep === "Trip Details" && <StepDayTrip data={data} set={set} />}
                {currentStep === "Rental Details" && <StepRental data={data} set={set} />}
                {currentStep === "Accommodation" && <StepAccommodation data={data} set={set} />}
                {currentStep === "Accommodation Details" && <StepAccommodationDetails data={data} set={set} />}
                {currentStep === "Your Details" && <StepContact data={data} set={set} />}
                {currentStep === "Review & Submit" && <StepReview data={data} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] mt-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
              </svg>
              {error}
            </div>
          )}

          {/* Bottom nav */}
          <div className="flex justify-between items-center pt-5 border-t border-slate-100 mt-4">
            <button onClick={() => { if (step > 0) { goBack(); } else { onClose(); } setError(""); }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium text-slate-600 border border-slate-200 hover:border-slate-400 transition-all min-h-[44px] cursor-pointer">
              {step > 0 ? "\u2190 Back" : "Cancel"}
            </button>
            {currentStep === "Review & Submit" ? (
              <button onClick={handleSubmit} disabled={submitting} className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[13px] font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg transition-all min-h-[44px] cursor-pointer disabled:opacity-60">
                {submitting ? "Sending..." : "Submit Booking"}
              </button>
            ) : (
              <button onClick={goNext} className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[13px] font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg transition-all min-h-[44px] cursor-pointer">
                Continue &rarr;
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Step Components ───────────────────────────── */

type SP = { data: BookingData; set: (k: string, v: unknown) => void };

function StepService({ data, set }: SP) {
  const opts = [
    { id: "airport", t: "Airport Transfer", d: "Pickup or drop-off at BIA", icon: "M12 19V5m0 0l-4 4m4-4l4 4" },
    { id: "round-tour", t: "Round Island Tour", d: "Multi-day tour with driver", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
    { id: "day-trip", t: "Day Excursion", d: "Half-day or full-day trip", icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" },
    { id: "self-drive", t: "Vehicle Rental", d: "Cars, bikes & tuk-tuks", icon: "M15 7h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-6 0H7a2 2 0 01-2-2V9a2 2 0 012-2h2m4-4v4m0 12v-4" },
  ];
  return (
    <div>
      <h3 className="font-display text-[24px] md:text-[32px] font-semibold leading-tight mb-2">What do you need?</h3>
      <p className="text-slate-500 mb-6 text-[14px]">Select your service to get a tailored booking form.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {opts.map((o) => (
          <button key={o.id} onClick={() => set("service", o.id)} className={`p-4 rounded-xl text-left transition-all duration-200 border-2 flex items-start gap-3 min-h-[44px] ${data.service === o.id ? "border-primary-500 bg-primary-50" : "border-slate-100 bg-white hover:border-primary-200"}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${data.service === o.id ? "bg-primary-600 text-white" : "bg-slate-50 text-slate-400"}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={o.icon} /></svg>
            </div>
            <div><div className="font-display text-[15px] font-semibold">{o.t}</div><div className="text-[12px] text-slate-500 mt-0.5">{o.d}</div></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepFlight({ data, set }: SP) {
  return (
    <div>
      <h3 className="font-display text-[24px] md:text-[32px] font-semibold leading-tight mb-2">Flight details</h3>
      <p className="text-slate-500 mb-6 text-[14px]">We&apos;ll track your flight and be ready when you land.</p>
      <div className="flex flex-col gap-4">
        <FL label="Flight number (optional)"><input value={data.flightNumber} onChange={(e) => set("flightNumber", e.target.value)} placeholder="e.g. SQ468" className="fi" /></FL>
        <div className="grid grid-cols-2 gap-4">
          <FL label="Arrival date"><input type="date" value={data.arrivalDate} onChange={(e) => set("arrivalDate", e.target.value)} min={new Date().toISOString().split("T")[0]} className="fi" /></FL>
          <FL label="Arrival time"><input type="time" value={data.arrivalTime} onChange={(e) => set("arrivalTime", e.target.value)} className="fi" /></FL>
        </div>
        <FL label="Number of passengers"><input type="number" min="1" max="45" value={data.pax} onChange={(e) => set("pax", +e.target.value)} className="fi w-28" /></FL>
      </div>
    </div>
  );
}

function StepAirportRoute({ data, set }: SP) {
  return (
    <div>
      <h3 className="font-display text-[24px] md:text-[32px] font-semibold leading-tight mb-2">Pickup &amp; drop-off</h3>
      <p className="text-slate-500 mb-6 text-[14px]">Where are you coming from and going to?</p>
      <div className="flex flex-col gap-4">
        <FL label="Pickup"><select value={data.airportPickup} onChange={(e) => set("airportPickup", e.target.value)} className="fi"><option value="">Select...</option>{LOCATIONS.map((l) => <option key={l}>{l}</option>)}</select></FL>
        <FL label="Drop-off"><select value={data.airportDropoff} onChange={(e) => set("airportDropoff", e.target.value)} className="fi"><option value="">Select...</option>{LOCATIONS.map((l) => <option key={l}>{l}</option>)}</select></FL>
      </div>
    </div>
  );
}

function StepTourDetails({ data, set }: SP) {
  const toggleDest = (d: string) => set("tourDestinations", data.tourDestinations.includes(d) ? data.tourDestinations.filter((x) => x !== d) : [...data.tourDestinations, d]);
  return (
    <div>
      <h3 className="font-display text-[24px] md:text-[32px] font-semibold leading-tight mb-2">Plan your tour</h3>
      <p className="text-slate-500 mb-6 text-[14px]">Select dates, duration, and destinations you want to visit.</p>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <FL label="Start date"><input type="date" value={data.tourStartDate} onChange={(e) => set("tourStartDate", e.target.value)} min={new Date().toISOString().split("T")[0]} className="fi" /></FL>
          <FL label="Number of passengers"><input type="number" min="1" max="45" value={data.pax} onChange={(e) => set("pax", +e.target.value)} className="fi" /></FL>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary-600 font-medium mb-2">Duration &middot; {data.tourDays} days</div>
          <input type="range" min="2" max="21" value={data.tourDays} onChange={(e) => set("tourDays", +e.target.value)} className="w-full accent-primary-600" />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1"><span>2</span><span>7</span><span>14</span><span>21</span></div>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary-600 font-medium mb-3">Destinations you want to visit</div>
          <div className="flex flex-wrap gap-2">
            {TOUR_DESTINATIONS.map((d) => (
              <button key={d} onClick={() => toggleDest(d)} className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer min-h-[32px] ${data.tourDestinations.includes(d) ? "bg-primary-600 border-primary-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-primary-300"}`}>{d}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepTourVehicle({ data, set }: SP) {
  const vehicles = [{ id: "sedan", t: "Sedan Car" }, { id: "luxury", t: "Luxury Sedan" }, { id: "van-flat", t: "Flat Roof Van" }, { id: "van-high", t: "High Roof Van" }, { id: "rosa", t: "Rosa Bus" }, { id: "coach", t: "Luxury Coach" }];
  return (
    <div>
      <h3 className="font-display text-[24px] md:text-[32px] font-semibold leading-tight mb-2">Choose your vehicle</h3>
      <p className="text-slate-500 mb-6 text-[14px]">Select the vehicle type for your tour.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {vehicles.map((v) => (
          <button key={v.id} onClick={() => set("tourVehicle", v.id)} className={`p-4 rounded-xl text-center transition-all border-2 min-h-[44px] ${data.tourVehicle === v.id ? "border-primary-500 bg-primary-50" : "border-slate-100 bg-white hover:border-primary-200"}`}>
            <div className="font-display text-[14px] font-semibold">{v.t}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepDayTrip({ data, set }: SP) {
  const destinations = ["Sigiriya", "Kandy", "Galle", "Ella", "Nuwara Eliya", "Yala Safari", "Pinnawala", "Anuradhapura", "Mirissa Whale Watching"];
  return (
    <div>
      <h3 className="font-display text-[24px] md:text-[32px] font-semibold leading-tight mb-2">Day trip details</h3>
      <p className="text-slate-500 mb-6 text-[14px]">Where would you like to go?</p>
      <div className="flex flex-col gap-4">
        <FL label="Date"><input type="date" value={data.dayTripDate} onChange={(e) => set("dayTripDate", e.target.value)} min={new Date().toISOString().split("T")[0]} className="fi" /></FL>
        <div className="grid grid-cols-2 gap-4">
          <FL label="Trip type">
            <select value={data.dayTripType} onChange={(e) => set("dayTripType", e.target.value)} className="fi">
              <option value="half">Half day (4-5 hrs)</option><option value="full">Full day (8-10 hrs)</option>
            </select>
          </FL>
          <FL label="Passengers"><input type="number" min="1" max="45" value={data.pax} onChange={(e) => set("pax", +e.target.value)} className="fi" /></FL>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary-600 font-medium mb-3">Destination</div>
          <div className="flex flex-wrap gap-2">
            {destinations.map((d) => (
              <button key={d} onClick={() => set("dayTripDestination", d)} className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all cursor-pointer min-h-[32px] ${data.dayTripDestination === d ? "bg-primary-600 border-primary-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-primary-300"}`}>{d}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepRental({ data, set }: SP) {
  const vehicles = [{ id: "sedan", t: "Sedan Car" }, { id: "luxury", t: "Luxury Sedan" }, { id: "van", t: "Van" }, { id: "scooter", t: "Scooter" }, { id: "enfield", t: "Royal Enfield" }, { id: "tuktuk", t: "Tuk-Tuk" }];
  return (
    <div>
      <h3 className="font-display text-[24px] md:text-[32px] font-semibold leading-tight mb-2">Rental details</h3>
      <p className="text-slate-500 mb-6 text-[14px]">Choose your vehicle and rental period.</p>
      <div className="flex flex-col gap-4">
        <div>
          <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary-600 font-medium mb-3">Vehicle type</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {vehicles.map((v) => (
              <button key={v.id} onClick={() => set("rentalVehicle", v.id)} className={`p-3 rounded-xl text-center transition-all border-2 text-[13px] font-medium min-h-[40px] ${data.rentalVehicle === v.id ? "border-primary-500 bg-primary-50" : "border-slate-100 bg-white hover:border-primary-200"}`}>{v.t}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FL label="Start date"><input type="date" value={data.rentalStartDate} onChange={(e) => set("rentalStartDate", e.target.value)} min={new Date().toISOString().split("T")[0]} className="fi" /></FL>
          <FL label="Duration (days)"><input type="number" min="1" max="30" value={data.rentalDays} onChange={(e) => set("rentalDays", +e.target.value)} className="fi" /></FL>
        </div>
        <FL label="Pickup location"><select value={data.rentalPickupLocation} onChange={(e) => set("rentalPickupLocation", e.target.value)} className="fi"><option value="">Select...</option>{LOCATIONS.map((l) => <option key={l}>{l}</option>)}</select></FL>
      </div>
    </div>
  );
}

function StepAccommodation({ data, set }: SP) {
  return (
    <div>
      <h3 className="font-display text-[24px] md:text-[32px] font-semibold leading-tight mb-2">Need accommodation?</h3>
      <p className="text-slate-500 mb-6 text-[14px]">We can help arrange hotels and guesthouses across Sri Lanka.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[{ id: "yes", t: "Yes, help me find accommodation", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
          { id: "no", t: "No, I have my own accommodation", icon: "M5 13l4 4L19 7" }].map((o) => (
          <button key={o.id} onClick={() => set("needAccommodation", o.id)} className={`p-5 rounded-xl text-left transition-all duration-200 border-2 flex items-center gap-3 min-h-[44px] ${data.needAccommodation === o.id ? "border-primary-500 bg-primary-50" : "border-slate-100 bg-white hover:border-primary-200"}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${data.needAccommodation === o.id ? "bg-primary-600 text-white" : "bg-slate-50 text-slate-400"}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={o.icon} /></svg>
            </div>
            <div className="font-display text-[14px] font-semibold">{o.t}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepAccommodationDetails({ data, set }: SP) {
  return (
    <div>
      <h3 className="font-display text-[24px] md:text-[32px] font-semibold leading-tight mb-2">Accommodation preferences</h3>
      <p className="text-slate-500 mb-6 text-[14px]">Tell us what you&apos;re looking for and we&apos;ll find the best options.</p>
      <div className="flex flex-col gap-4">
        <FL label="Type of accommodation">
          <select value={data.accommodationType} onChange={(e) => set("accommodationType", e.target.value)} className="fi">
            <option value="">Select...</option><option>Budget guesthouse</option><option>Mid-range hotel</option><option>Boutique hotel</option><option>Luxury resort</option><option>Eco lodge</option><option>No preference</option>
          </select>
        </FL>
        <div className="grid grid-cols-2 gap-4">
          <FL label="Budget per night">
            <select value={data.accommodationBudget} onChange={(e) => set("accommodationBudget", e.target.value)} className="fi">
              <option value="">Select...</option><option>Under $30</option><option>$30 - $60</option><option>$60 - $100</option><option>$100 - $200</option><option>$200+</option><option>Flexible</option>
            </select>
          </FL>
          <FL label="Number of rooms"><input type="number" min="1" max="20" value={data.accommodationRooms} onChange={(e) => set("accommodationRooms", +e.target.value)} className="fi" /></FL>
        </div>
        <FL label="Any special requirements?"><textarea value={data.accommodationNotes} onChange={(e) => set("accommodationNotes", e.target.value)} rows={2} placeholder="Pool, sea view, family room, etc." className="fi resize-none" /></FL>
      </div>
    </div>
  );
}

function StepContact({ data, set }: SP) {
  return (
    <div>
      <h3 className="font-display text-[24px] md:text-[32px] font-semibold leading-tight mb-2">Your details</h3>
      <p className="text-slate-500 mb-6 text-[14px]">So we can confirm your booking.</p>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FL label="Full name"><input value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="John Smith" className="fi" /></FL>
          <FL label="Country"><input value={data.country} onChange={(e) => set("country", e.target.value)} placeholder="e.g. Australia" className="fi" /></FL>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FL label="Email"><input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" className="fi" /></FL>
          <FL label="Phone / WhatsApp"><input value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+61 400 123 456" className="fi" /></FL>
        </div>
        <FL label="Additional notes"><textarea value={data.notes} onChange={(e) => set("notes", e.target.value)} rows={3} placeholder="Special requests, dietary needs, etc." className="fi resize-none" /></FL>
      </div>
    </div>
  );
}

function StepReview({ data }: { data: BookingData }) {
  const serviceNames: Record<string, string> = { airport: "Airport Transfer", "round-tour": "Round Island Tour", "day-trip": "Day Excursion", "self-drive": "Vehicle Rental" };
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>
        </div>
        <div>
          <div className="font-mono text-[10px] text-primary-600 font-semibold tracking-wide uppercase">Ready to submit</div>
          <h3 className="font-display text-[22px] font-semibold">Review your booking</h3>
        </div>
      </div>
      <div className="bg-slate-50 rounded-2xl p-5 md:p-6 space-y-4 text-[14px]">
        <RR label="Service" v={serviceNames[data.service] || data.service} />
        <RR label="Passengers" v={String(data.pax)} />
        {data.service === "airport" && (<><RR label="Flight" v={data.flightNumber || "Not provided"} /><RR label="Date & Time" v={`${data.arrivalDate} at ${data.arrivalTime}`} /><RR label="Pickup" v={data.airportPickup} /><RR label="Drop-off" v={data.airportDropoff} /></>)}
        {data.service === "round-tour" && (<><RR label="Start date" v={data.tourStartDate} /><RR label="Duration" v={`${data.tourDays} days`} /><RR label="Destinations" v={data.tourDestinations.join(", ") || "Not selected"} /><RR label="Vehicle" v={data.tourVehicle} /></>)}
        {data.service === "day-trip" && (<><RR label="Date" v={data.dayTripDate} /><RR label="Type" v={data.dayTripType === "full" ? "Full day" : "Half day"} /><RR label="Destination" v={data.dayTripDestination} /></>)}
        {data.service === "self-drive" && (<><RR label="Vehicle" v={data.rentalVehicle} /><RR label="Start date" v={data.rentalStartDate} /><RR label="Duration" v={`${data.rentalDays} days`} /><RR label="Pickup" v={data.rentalPickupLocation} /></>)}
        <div className="border-t border-slate-200 pt-3">
          <RR label="Accommodation" v={data.needAccommodation === "yes" ? `Yes \u2014 ${data.accommodationType || "Not specified"}, ${data.accommodationBudget || "Flexible"} budget, ${data.accommodationRooms} room(s)` : "Not needed"} />
        </div>
        <div className="border-t border-slate-200 pt-3">
          <RR label="Name" v={data.name} /><RR label="Email" v={data.email} /><RR label="Phone" v={data.phone} /><RR label="Country" v={data.country} />
        </div>
        {data.notes && <RR label="Notes" v={data.notes} />}
      </div>
      <p className="mt-4 text-[12px] text-slate-400">Your inquiry will be sent to <span className="text-primary-600 font-medium">travelsaitken@gmail.com</span>. We respond within 1 hour.</p>
    </div>
  );
}

/* ─── Helpers ─── */

function RR({ label, v }: { label: string; v: string }) {
  return v ? (
    <div className="flex justify-between gap-4"><span className="text-slate-500 flex-shrink-0">{label}</span><span className="text-slate-800 font-medium text-right">{v}</span></div>
  ) : null;
}

function FL({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-primary-600 font-medium">{label}</label>
      {children}
      <style jsx>{`
        .fi { padding: 10px 14px; border: 1.5px solid var(--line-strong); border-radius: 10px; background: white; font-size: 16px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; min-height: 44px; font-family: var(--font-inter), Inter, sans-serif; width: 100%; -webkit-appearance: none; }
        .fi:focus { border-color: var(--primary-500); box-shadow: 0 0 0 3px rgba(21, 176, 248, 0.1); }
        @media (min-width: 768px) { .fi { font-size: 14px; } }
      `}</style>
    </div>
  );
}

function buildEmailBody(d: BookingData): string {
  const serviceNames: Record<string, string> = { airport: "Airport Transfer", "round-tour": "Round Island Tour", "day-trip": "Day Excursion", "self-drive": "Vehicle Rental" };
  let body = `NEW BOOKING INQUIRY — AITKEN TRAVELS\n${"=".repeat(45)}\n\n`;
  body += `Service: ${serviceNames[d.service] || d.service}\nPassengers: ${d.pax}\n\n`;

  if (d.service === "airport") {
    body += `--- AIRPORT TRANSFER ---\nFlight: ${d.flightNumber || "N/A"}\nDate: ${d.arrivalDate}\nTime: ${d.arrivalTime}\nPickup: ${d.airportPickup}\nDrop-off: ${d.airportDropoff}\n\n`;
  } else if (d.service === "round-tour") {
    body += `--- ROUND ISLAND TOUR ---\nStart: ${d.tourStartDate}\nDuration: ${d.tourDays} days\nDestinations: ${d.tourDestinations.join(", ")}\nVehicle: ${d.tourVehicle}\n\n`;
  } else if (d.service === "day-trip") {
    body += `--- DAY EXCURSION ---\nDate: ${d.dayTripDate}\nType: ${d.dayTripType === "full" ? "Full day" : "Half day"}\nDestination: ${d.dayTripDestination}\n\n`;
  } else if (d.service === "self-drive") {
    body += `--- VEHICLE RENTAL ---\nVehicle: ${d.rentalVehicle}\nStart: ${d.rentalStartDate}\nDuration: ${d.rentalDays} days\nPickup: ${d.rentalPickupLocation}\n\n`;
  }

  body += `--- ACCOMMODATION ---\nNeeded: ${d.needAccommodation === "yes" ? "Yes" : "No"}\n`;
  if (d.needAccommodation === "yes") {
    body += `Type: ${d.accommodationType}\nBudget: ${d.accommodationBudget}\nRooms: ${d.accommodationRooms}\nNotes: ${d.accommodationNotes || "N/A"}\n`;
  }

  body += `\n--- CONTACT ---\nName: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nCountry: ${d.country}\nNotes: ${d.notes || "N/A"}\n`;
  return body;
}
