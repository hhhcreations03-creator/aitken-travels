"use client";

import { useMemo, useState } from "react";
import { composeMessage, whatsappUrl } from "@/lib/site";
import { EMAIL_RE, addDaysISO, formatDateLong, submitEnquiry, todayISO, validateDates, type SubmitResult } from "@/lib/enquiry-client";
import { EnquiryOutcome } from "./EnquiryOutcome";
import { FormNote, Honeypot, SelectField, TextField, TextareaField } from "./fields";

import { GROUP_TYPES } from "@/lib/groups";

interface FormState {
  name: string;
  email: string;
  phone: string;
  groupType: string;
  guests: string;
  checkIn: string;
  checkOut: string;
  rooms: string;
  experiences: string;
  requirements: string;
}

const EMPTY: FormState = { name: "", email: "", phone: "", groupType: "", guests: "", checkIn: "", checkOut: "", rooms: "", experiences: "", requirements: "" };

export function GroupForm({ defaultType }: { defaultType?: string }) {
  const [form, setForm] = useState<FormState>({ ...EMPTY, groupType: defaultType ?? "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const message = useMemo(
    () =>
      composeMessage(
        "Hello The Lavish Haven, I'm organising a group stay and would like to enquire.",
        [
          ["Organiser", form.name],
          ["Email", form.email],
          ["WhatsApp / phone", form.phone],
          ["Group type", form.groupType],
          ["Estimated guests", form.guests],
          ["Check-in", formatDateLong(form.checkIn)],
          ["Check-out", formatDateLong(form.checkOut)],
          ["Rooms required", form.rooms],
          ["Requested experiences", form.experiences],
          ["Additional requirements", form.requirements],
        ],
        "Could you let me know what the hotel can accommodate and how to proceed? Thank you."
      ),
    [form]
  );
  const subject = `Group enquiry: ${form.groupType || "group stay"}${form.guests ? `, ${form.guests} guests` : ""}`;

  function validate(): boolean {
    const e: typeof errors = { ...validateDates(form.checkIn, form.checkOut) };
    if (!form.name.trim()) e.name = "Add the organiser's name.";
    if (!EMAIL_RE.test(form.email)) e.email = "Add a valid email address.";
    if (!form.phone.trim()) e.phone = "Add a WhatsApp or telephone number.";
    if (!form.groupType) e.groupType = "Choose the type of group.";
    if (!form.guests || Number(form.guests) < 2) e.guests = "Estimate the number of guests (2 or more).";
    if (!form.rooms || Number(form.rooms) < 1) e.rooms = "Estimate the rooms required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    const honeypot = (new FormData(e.currentTarget).get("website") as string) || "";
    setResult(await submitEnquiry({ subject, body: message, replyTo: form.email, name: form.name, website: honeypot }));
    setSending(false);
  }

  if (result) return <EnquiryOutcome result={result} subject={subject} message={message} onReset={() => { setResult(null); setForm(EMPTY); }} />;

  const today = todayISO();

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="name" label="Organiser's name" required autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
        <TextField id="email" label="Email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="phone" label="WhatsApp or telephone" type="tel" required autoComplete="tel" placeholder="Include your country code" value={form.phone} onChange={set("phone")} error={errors.phone} />
        <SelectField id="groupType" label="Group type" required value={form.groupType} onChange={set("groupType")} error={errors.groupType}>
          <option value="">Choose one</option>
          {GROUP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </SelectField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="guests" label="Estimated number of guests" type="number" required min={2} max={60} inputMode="numeric" value={form.guests} onChange={set("guests")} error={errors.guests} />
        <TextField id="rooms" label="Number of rooms required" type="number" required min={1} max={14} inputMode="numeric" value={form.rooms} onChange={set("rooms")} error={errors.rooms} hint="An estimate is fine. The team will suggest a room mix." />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="checkIn" label="Check-in" type="date" required min={today} value={form.checkIn} onChange={set("checkIn")} error={errors.checkIn} />
        <TextField id="checkOut" label="Check-out" type="date" required min={form.checkIn ? addDaysISO(form.checkIn, 1) : addDaysISO(today, 1)} value={form.checkOut} onChange={set("checkOut")} error={errors.checkOut} />
      </div>
      <TextareaField id="experiences" label="Requested experiences" value={form.experiences} onChange={set("experiences")} placeholder="Yoga sessions, surf days at Kabalana, group dinners, spa treatments, anything you have in mind." />
      <TextareaField id="requirements" label="Additional requirements" value={form.requirements} onChange={set("requirements")} placeholder="Budget range, accessibility needs, dietary requirements, transport questions." />
      <FormNote />
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={sending} className="btn-forest disabled:opacity-60">{sending ? "Sending…" : "Send group enquiry by email"}</button>
        <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" onClick={(e) => { if (!validate()) e.preventDefault(); }}>
          Send on WhatsApp
        </a>
      </div>
    </form>
  );
}
