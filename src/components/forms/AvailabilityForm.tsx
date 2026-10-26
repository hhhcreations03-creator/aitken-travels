"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ROOMS } from "@/lib/rooms";
import { composeMessage, whatsappUrl } from "@/lib/site";
import { EMAIL_RE, addDaysISO, formatDateLong, nightsBetween, submitEnquiry, todayISO, validateDates, type SubmitResult } from "@/lib/enquiry-client";
import { EnquiryOutcome } from "./EnquiryOutcome";
import { FormNote, Honeypot, SelectField, TextField, TextareaField } from "./fields";

interface FormState {
  room: string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
  rooms: string;
  name: string;
  email: string;
  phone: string;
  requests: string;
}

const EMPTY: FormState = { room: "", checkIn: "", checkOut: "", adults: "2", children: "0", rooms: "1", name: "", email: "", phone: "", requests: "" };

export function AvailabilityForm({ defaultRoom }: { defaultRoom?: string }) {
  const params = useSearchParams();
  const roomParam = defaultRoom ?? params.get("room") ?? "";
  const [form, setForm] = useState<FormState>({ ...EMPTY, room: ROOMS.some((r) => r.slug === roomParam) ? roomParam : "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  useEffect(() => {
    if (ROOMS.some((r) => r.slug === roomParam)) setForm((f) => ({ ...f, room: roomParam }));
  }, [roomParam]);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const roomName = ROOMS.find((r) => r.slug === form.room)?.name ?? "Any suitable room";
  const nights = form.checkIn && form.checkOut ? nightsBetween(form.checkIn, form.checkOut) : 0;

  const message = useMemo(
    () =>
      composeMessage(
        "Hello The Lavish Haven, I'd like to check availability for a stay.",
        [
          ["Room", roomName],
          ["Check-in", formatDateLong(form.checkIn)],
          ["Check-out", formatDateLong(form.checkOut)],
          ["Nights", nights > 0 ? nights : undefined],
          ["Adults", form.adults],
          ["Children", form.children],
          ["Rooms", form.rooms],
          ["Name", form.name],
          ["Email", form.email],
          ["Phone", form.phone],
          ["Requests", form.requests],
        ],
        "Please let me know availability and how to confirm. Thank you."
      ),
    [roomName, form, nights]
  );
  const subject = `Availability enquiry: ${roomName}${form.checkIn ? `, ${form.checkIn} to ${form.checkOut}` : ""}`;

  function validate(): boolean {
    const e: typeof errors = { ...validateDates(form.checkIn, form.checkOut) };
    if (Number(form.adults) < 1) e.adults = "At least one adult.";
    if (Number(form.rooms) < 1) e.rooms = "At least one room.";
    if (!form.name.trim()) e.name = "Add your name.";
    if (!EMAIL_RE.test(form.email)) e.email = "Add a valid email address.";
    if (!form.phone.trim()) e.phone = "Add a contact number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    const honeypot = (new FormData(e.currentTarget).get("website") as string) || "";
    const r = await submitEnquiry({ subject, body: message, replyTo: form.email, name: form.name, website: honeypot });
    setResult(r);
    setSending(false);
  }

  if (result) {
    return <EnquiryOutcome result={result} subject={subject} message={message} onReset={() => { setResult(null); setForm({ ...EMPTY, room: form.room }); }} />;
  }

  const today = todayISO();

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5">
      <Honeypot />
      <SelectField id="room" label="Room" value={form.room} onChange={set("room")} hint="Leave blank if you'd like the team to suggest a room.">
        <option value="">Any suitable room</option>
        {ROOMS.map((r) => <option key={r.slug} value={r.slug}>{r.name}</option>)}
      </SelectField>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="checkIn" label="Check-in" type="date" required min={today} value={form.checkIn} onChange={set("checkIn")} error={errors.checkIn} />
        <TextField id="checkOut" label="Check-out" type="date" required min={form.checkIn ? addDaysISO(form.checkIn, 1) : addDaysISO(today, 1)} value={form.checkOut} onChange={set("checkOut")} error={errors.checkOut} hint={nights > 0 ? `${nights} night${nights === 1 ? "" : "s"}` : undefined} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <TextField id="adults" label="Adults" type="number" required min={1} max={40} inputMode="numeric" value={form.adults} onChange={set("adults")} error={errors.adults} />
        <TextField id="children" label="Children" type="number" required min={0} max={40} inputMode="numeric" value={form.children} onChange={set("children")} />
        <TextField id="rooms" label="Rooms" type="number" required min={1} max={14} inputMode="numeric" value={form.rooms} onChange={set("rooms")} error={errors.rooms} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="name" label="Your name" required autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
        <TextField id="email" label="Email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
      </div>
      <TextField id="phone" label="Contact number" type="tel" required autoComplete="tel" placeholder="Include your country code" value={form.phone} onChange={set("phone")} error={errors.phone} />
      <TextareaField id="requests" label="Additional requests" value={form.requests} onChange={set("requests")} placeholder="Arrival time, dietary needs, a cot, a quieter room, anything else." />

      <FormNote />

      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={sending} className="btn-forest disabled:opacity-60">
          {sending ? "Sending…" : "Send enquiry by email"}
        </button>
        <a
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
          onClick={(e) => { if (!validate()) e.preventDefault(); }}
        >
          Send on WhatsApp
        </a>
      </div>
    </form>
  );
}
