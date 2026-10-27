"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE, whatsappUrl } from "@/lib/site";
import { TextField, TextareaField, SelectField, Honeypot } from "@/components/forms/fields";

export interface FlowRoom {
  slug: string;
  name: string;
  beds: string;
  sizeSqm: number;
  floor: string;
  outdoor: string;
  image: { src: string; alt: string };
}

interface Offer {
  slug: string;
  name: string;
  available: number;
  maxGuests: number;
  fits: boolean;
  nightlyRate: number | null;
  total: number | null;
}

interface Props {
  rooms: FlowRoom[];
  initialRoom?: string;
  today: string;
  maxNights: number;
  maxRooms: number;
  currency: string;
  policyNote: string;
}

type Step = "search" | "choose" | "details" | "done";

const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const without = (o: Record<string, string>, key: string) => {
  const next = { ...o };
  delete next[key];
  return next;
};
const nightsBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
const fmt = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const money = (n: number, c: string) => new Intl.NumberFormat("en-GB", { style: "currency", currency: c, maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);

const STEPS: { id: Step; label: string }[] = [
  { id: "search", label: "Dates" },
  { id: "choose", label: "Room" },
  { id: "details", label: "Your details" },
  { id: "done", label: "Request sent" },
];

export function BookingFlow({ rooms, initialRoom, today, maxNights, maxRooms, currency, policyNote }: Props) {
  const [step, setStep] = useState<Step>("search");
  const [search, setSearch] = useState({ checkIn: "", checkOut: "", adults: "2", children: "0", rooms: "1" });
  const [searchErrors, setSearchErrors] = useState<Record<string, string>>({});
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [searched, setSearched] = useState<typeof search | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [guest, setGuest] = useState({ name: "", email: "", phone: "", country: "", arrivalTime: "", requests: "" });
  const [agree, setAgree] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [done, setDone] = useState<{ ref: string; manageUrl: string | null } | null>(null);
  const openedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const roomInfo = useMemo(() => new Map(rooms.map((r) => [r.slug, r])), [rooms]);
  const n = searched ? nightsBetween(searched.checkIn, searched.checkOut) : 0;
  const guests = searched ? Number(searched.adults) + Number(searched.children) : 0;

  const setS = (k: keyof typeof search) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearch((s) => ({ ...s, [k]: e.target.value }));
    setSearchErrors((e) => without(e, k));
  };
  const setG = (k: keyof typeof guest) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setGuest((g) => ({ ...g, [k]: e.target.value }));
    setFieldErrors((e) => without(e, `guest.${k}`));
  };

  async function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const errs: Record<string, string> = {};
    if (!search.checkIn) errs.checkIn = "Choose a check-in date.";
    else if (search.checkIn < today) errs.checkIn = "Check-in can't be in the past.";
    if (!search.checkOut) errs.checkOut = "Choose a check-out date.";
    else if (search.checkIn && search.checkOut <= search.checkIn) errs.checkOut = "Check-out must be after check-in.";
    else if (search.checkIn && nightsBetween(search.checkIn, search.checkOut) > maxNights) errs.checkOut = `For more than ${maxNights} nights, please contact us.`;
    if (Number(search.adults) < 1) errs.adults = "At least one adult.";
    setSearchErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setNotice(null);
    try {
      const qs = new URLSearchParams(search).toString();
      const res = await fetch(`/api/availability?${qs}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.error || "We couldn't check availability.");
        return;
      }
      const list: Offer[] = data.offers;
      // Show the room the guest came from first, then available rooms that fit, then the rest.
      list.sort((a, b) => {
        const score = (o: Offer) => (o.slug === initialRoom ? -10 : 0) + (o.available >= Number(search.rooms) && o.fits ? 0 : 5);
        return score(a) - score(b);
      });
      setOffers(list);
      setSearched(search);
      setStep("choose");
    } catch {
      setNotice("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!searched || !selected) return;
    const errs: Record<string, string> = {};
    if (guest.name.trim().length < 2) errs["guest.name"] = "Add your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email.trim())) errs["guest.email"] = "Add a valid email address.";
    if (!/^[+\d][\d\s().-]{5,}$/.test(guest.phone.trim())) errs["guest.phone"] = "Add a phone or WhatsApp number with country code.";
    if (!agree) errs.agree = "Please confirm you've read how booking works.";
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    setBusy(true);
    setNotice(null);
    const website = (new FormData(e.currentTarget).get("website") as string) || "";
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...searched, room: selected, guest, agree, website, elapsedMs: Date.now() - openedAt.current }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setNotice(data.error);
        await runSearch();
        return;
      }
      if (!res.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setNotice(data.error || "Something went wrong.");
        return;
      }
      setDone(data);
      setStep("done");
    } catch {
      setNotice("We couldn't reach the server. Your request was not sent. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const chosen = selected ? offers?.find((o) => o.slug === selected) : null;
  const chosenRoom = selected ? roomInfo.get(selected) : null;
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div>
      <ol className="mb-10 flex flex-wrap gap-x-6 gap-y-2 text-[14px]" aria-label="Booking steps">
        {STEPS.map((s, i) => (
          <li key={s.id} aria-current={i === stepIndex ? "step" : undefined} className={`flex items-center gap-2 ${i === stepIndex ? "text-forest" : i < stepIndex ? "text-charcoal-soft" : "text-charcoal-mute"}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-[12px] tabular-nums ${i === stepIndex ? "border-forest bg-forest text-ivory" : i < stepIndex ? "border-forest/40 text-forest" : "border-[color:var(--line)]"}`}>
              {i < stepIndex ? "✓" : i + 1}
            </span>
            {s.label}
          </li>
        ))}
      </ol>

      {notice && (
        <div role="alert" className="mb-6 rounded-[2px] border border-[#9B3B2E]/30 bg-[#9B3B2E]/5 px-4 py-3 text-[14.5px] text-[#7A2E24]">
          {notice}
        </div>
      )}

      {step === "search" && (
        <form onSubmit={runSearch} noValidate className="grid gap-5">
          <h2 ref={headingRef} tabIndex={-1} className="display-md text-forest outline-none">When would you like to stay?</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="checkIn" label="Check-in" type="date" required min={today} value={search.checkIn} onChange={(e) => { const v = e.target.value; setSearch((s) => ({ ...s, checkIn: v, checkOut: v && (!s.checkOut || s.checkOut <= v) ? addDays(v, 2) : s.checkOut })); setSearchErrors({}); }} error={searchErrors.checkIn} />
            <TextField id="checkOut" label="Check-out" type="date" required min={search.checkIn ? addDays(search.checkIn, 1) : addDays(today, 1)} value={search.checkOut} onChange={setS("checkOut")} error={searchErrors.checkOut}
              hint={search.checkIn && search.checkOut > search.checkIn ? `${nightsBetween(search.checkIn, search.checkOut)} night${nightsBetween(search.checkIn, search.checkOut) === 1 ? "" : "s"}` : undefined} />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <SelectField id="adults" label="Adults" required value={search.adults} onChange={setS("adults")} error={searchErrors.adults}>
              {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
            </SelectField>
            <SelectField id="children" label="Children" required value={search.children} onChange={setS("children")}>
              {Array.from({ length: 9 }, (_, i) => <option key={i} value={i}>{i}</option>)}
            </SelectField>
            <SelectField id="rooms" label="Rooms" required value={search.rooms} onChange={setS("rooms")}>
              {Array.from({ length: maxRooms }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
            </SelectField>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button type="submit" disabled={busy} className="btn-forest disabled:opacity-60">{busy ? "Checking…" : "Check availability"}</button>
            <Link href="/groups" className="textlink text-[14px]">More than {maxRooms} rooms? Send a group enquiry</Link>
          </div>
        </form>
      )}

      {step === "choose" && offers && searched && (
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 ref={headingRef} tabIndex={-1} className="display-md text-forest outline-none">Choose your room</h2>
              <p className="body mt-2">
                {fmt(searched.checkIn)} to {fmt(searched.checkOut)}, {n} night{n === 1 ? "" : "s"}, {guests} guest{guests === 1 ? "" : "s"}, {searched.rooms} room{searched.rooms === "1" ? "" : "s"}
              </p>
            </div>
            <button type="button" onClick={() => setStep("search")} className="btn-outline !min-h-[44px] !py-2">Change dates</button>
          </div>
          <ul className="mt-8 grid gap-4">
            {offers.map((o) => {
              const r = roomInfo.get(o.slug);
              if (!r) return null;
              const enough = o.available >= Number(searched.rooms);
              const bookable = enough && o.fits;
              return (
                <li key={o.slug} className={`grid gap-4 rounded-[2px] border bg-white/60 p-4 sm:grid-cols-[200px_1fr_auto] sm:items-center ${bookable ? "border-[color:var(--line)]" : "border-[color:var(--line-soft)] opacity-70"}`}>
                  <div className="img-frame aspect-[4/3] w-full">
                    <Image src={r.image.src} alt={r.image.alt} fill sizes="200px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display text-[1.3rem] leading-snug text-forest">{r.name}</h3>
                    <p className="small mt-1 text-charcoal-soft">{r.floor}, {r.sizeSqm} m², {r.beds}, {r.outdoor.toLowerCase()}. Sleeps up to {o.maxGuests}.</p>
                    <p className={`small mt-2 ${bookable ? (o.available <= 2 ? "text-[#8A5A12]" : "text-forest") : "text-charcoal-mute"}`}>
                      {!enough
                        ? o.available === 0 ? "Not available for these dates" : `Only ${o.available} left for these dates`
                        : !o.fits ? `Sleeps up to ${o.maxGuests} per room. Add a room or choose a larger one.`
                        : o.available <= 2 ? `Available. Only ${o.available} left.` : "Available"}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end sm:text-right">
                    {o.total !== null ? (
                      <p><span className="font-display text-[1.5rem] text-forest">{money(o.total, currency)}</span><br /><span className="small text-charcoal-soft">{money(o.nightlyRate!, currency)} per night, estimate</span></p>
                    ) : (
                      <p className="small max-w-[18ch] text-charcoal-soft">Rate confirmed by the hotel</p>
                    )}
                    <button type="button" disabled={!bookable} onClick={() => { setSelected(o.slug); setStep("details"); }} className="btn-forest !min-h-[44px] !py-2 disabled:cursor-not-allowed disabled:opacity-40">
                      {bookable ? "Select" : "Unavailable"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          {!offers.some((o) => o.available >= Number(searched.rooms) && o.fits) && (
            <p className="body mt-6">Nothing matches those dates. Try different dates, or <a className="textlink" href={whatsappUrl(`Hello The Lavish Haven, I'm looking for a room from ${searched.checkIn} to ${searched.checkOut} for ${guests} guests.`)} target="_blank" rel="noopener noreferrer">ask us on WhatsApp</a>.</p>
          )}
        </div>
      )}

      {step === "details" && chosen && chosenRoom && searched && (
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <form onSubmit={submit} noValidate className="relative grid gap-5">
            <Honeypot />
            <h2 ref={headingRef} tabIndex={-1} className="display-md text-forest outline-none">Your details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField id="name" label="Full name" required autoComplete="name" value={guest.name} onChange={setG("name")} error={fieldErrors["guest.name"]} />
              <TextField id="email" label="Email" type="email" required autoComplete="email" value={guest.email} onChange={setG("email")} error={fieldErrors["guest.email"]} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField id="phone" label="Phone or WhatsApp" type="tel" required autoComplete="tel" placeholder="+44 7700 900000" value={guest.phone} onChange={setG("phone")} error={fieldErrors["guest.phone"]} />
              <TextField id="country" label="Country" autoComplete="country-name" value={guest.country} onChange={setG("country")} />
            </div>
            <TextField id="arrivalTime" label="Estimated arrival time" placeholder="For example, 3pm" value={guest.arrivalTime} onChange={setG("arrivalTime")} hint={`Check-in is from ${SITE.checkIn}.`} />
            <TextareaField id="requests" label="Requests" value={guest.requests} onChange={setG("requests")} placeholder="Airport transfer, a cot, dietary needs, a quieter room." />
            <div>
              <label className="flex items-start gap-3 text-[14.5px] leading-relaxed text-charcoal-soft">
                <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); setFieldErrors((e) => without(e, "agree")); }} className="mt-1 h-5 w-5 shrink-0 accent-[#1E3A2F]" aria-describedby={fieldErrors.agree ? "agree-error" : undefined} />
                <span>{policyNote} I understand the hotel will contact me to confirm.</span>
              </label>
              {fieldErrors.agree && <p id="agree-error" className="field-error">{fieldErrors.agree}</p>}
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" disabled={busy} className="btn-forest disabled:opacity-60">{busy ? "Sending request…" : "Send booking request"}</button>
              <button type="button" onClick={() => setStep("choose")} className="btn-outline">Back to rooms</button>
            </div>
            <p className="small text-charcoal-mute">We use your details only to manage this booking. They are never shared or sold.</p>
          </form>

          <aside className="h-fit rounded-[2px] border border-[color:var(--line)] bg-white/50 p-5 lg:sticky lg:top-28">
            <div className="img-frame aspect-[4/3]">
              <Image src={chosenRoom.image.src} alt={chosenRoom.image.alt} fill sizes="320px" className="object-cover" />
            </div>
            <h3 className="mt-4 font-display text-[1.25rem] leading-snug text-forest">{chosenRoom.name}</h3>
            <dl className="mt-4 grid gap-2 text-[14px]">
              <div className="flex justify-between gap-4"><dt className="text-charcoal-soft">Check-in</dt><dd>{fmt(searched.checkIn)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-charcoal-soft">Check-out</dt><dd>{fmt(searched.checkOut)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-charcoal-soft">Nights</dt><dd>{n}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-charcoal-soft">Guests</dt><dd>{searched.adults} adult{searched.adults === "1" ? "" : "s"}{searched.children !== "0" ? `, ${searched.children} child${searched.children === "1" ? "" : "ren"}` : ""}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-charcoal-soft">Rooms</dt><dd>{searched.rooms}</dd></div>
              <div className="rule mt-2 flex justify-between gap-4 pt-3"><dt className="text-charcoal-soft">Estimated total</dt><dd className="font-medium">{chosen.total !== null ? money(chosen.total, currency) : "Confirmed by the hotel"}</dd></div>
            </dl>
            <p className="small mt-3 text-charcoal-mute">No payment now. The hotel confirms the final rate with you.</p>
          </aside>
        </div>
      )}

      {step === "done" && done && searched && (
        <div className="max-w-[40rem]">
          <h2 ref={headingRef} tabIndex={-1} className="display-lg text-forest outline-none">Request sent</h2>
          <p className="lede mt-4">Thank you, {guest.name.split(" ")[0]}. We&rsquo;re holding the room while our team confirms your stay.</p>
          <p className="mt-6 text-[15px] text-charcoal-soft">Your reference</p>
          <p className="font-display text-[2.4rem] tracking-[0.04em] text-forest">{done.ref}</p>
          <ol className="body mt-6 list-decimal space-y-2 pl-5">
            <li>We check availability and your rate, usually within 24 hours.</li>
            <li>We confirm by email or WhatsApp. Your stay is booked once you hear from us.</li>
            <li>Nothing is charged online.</li>
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            {done.manageUrl && <Link href={done.manageUrl} className="btn-forest">View your booking</Link>}
            <a href={whatsappUrl(`Hello The Lavish Haven, I've just sent booking request ${done.ref} for ${searched.checkIn} to ${searched.checkOut}.`)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">Message us on WhatsApp</a>
          </div>
          {done.manageUrl && <p className="small mt-5 text-charcoal-mute">Bookmark the &ldquo;View your booking&rdquo; link. It&rsquo;s private to you and lets you check the status or cancel.</p>}
        </div>
      )}
    </div>
  );
}
