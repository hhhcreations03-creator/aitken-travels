"use client";

import { useMemo, useState } from "react";
import { composeMessage, whatsappUrl } from "@/lib/site";
import { EMAIL_RE, addDaysISO, formatDateLong, submitEnquiry, todayISO, validateDates, type SubmitResult } from "@/lib/enquiry-client";
import { EnquiryOutcome } from "./EnquiryOutcome";
import { FormNote, Honeypot, TextField, TextareaField } from "./fields";

interface FormState {
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  groupSize: string;
  accommodation: string;
  surf: string;
  questions: string;
}

const EMPTY: FormState = { name: "", email: "", phone: "", checkIn: "", checkOut: "", groupSize: "", accommodation: "", surf: "", questions: "" };

export function SurfRetreatForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const message = useMemo(
    () =>
      composeMessage(
        "Hello The Lavish Haven, I'm planning a surf-focused stay in Ahangama and would like to enquire.",
        [
          ["Name", form.name],
          ["Email", form.email],
          ["Phone", form.phone],
          ["Preferred check-in", formatDateLong(form.checkIn)],
          ["Preferred check-out", formatDateLong(form.checkOut)],
          ["Group size", form.groupSize],
          ["Accommodation requirements", form.accommodation],
          ["Requested surf experiences", form.surf],
          ["Questions", form.questions],
        ],
        "Could you let me know what's possible and how to proceed? Thank you."
      ),
    [form]
  );
  const subject = `Surf retreat enquiry${form.groupSize ? `: ${form.groupSize} guests` : ""}`;

  function validate(): boolean {
    const e: typeof errors = { ...validateDates(form.checkIn, form.checkOut) };
    if (!form.name.trim()) e.name = "Add your name.";
    if (!EMAIL_RE.test(form.email)) e.email = "Add a valid email address.";
    if (!form.groupSize || Number(form.groupSize) < 1) e.groupSize = "How many of you are coming?";
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
        <TextField id="name" label="Your name" required autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
        <TextField id="email" label="Email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="phone" label="WhatsApp or telephone" type="tel" autoComplete="tel" placeholder="Include your country code" value={form.phone} onChange={set("phone")} />
        <TextField id="groupSize" label="Group size" type="number" required min={1} max={60} inputMode="numeric" value={form.groupSize} onChange={set("groupSize")} error={errors.groupSize} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="checkIn" label="Preferred check-in" type="date" required min={today} value={form.checkIn} onChange={set("checkIn")} error={errors.checkIn} />
        <TextField id="checkOut" label="Preferred check-out" type="date" required min={form.checkIn ? addDaysISO(form.checkIn, 1) : addDaysISO(today, 1)} value={form.checkOut} onChange={set("checkOut")} error={errors.checkOut} />
      </div>
      <TextareaField id="accommodation" label="Accommodation requirements" value={form.accommodation} onChange={set("accommodation")} placeholder="Number of rooms, sharing arrangements, a kitchenette, ground floor, anything that matters." />
      <TextareaField id="surf" label="Requested surf experiences" value={form.surf} onChange={set("surf")} placeholder="Your level, how many surf days you'd like, whether you'd like help arranging lessons or board hire locally." />
      <TextareaField id="questions" label="Additional questions" value={form.questions} onChange={set("questions")} />
      <FormNote />
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={sending} className="btn-forest disabled:opacity-60">{sending ? "Sending…" : "Send retreat enquiry by email"}</button>
        <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" onClick={(e) => { if (!validate()) e.preventDefault(); }}>
          Send on WhatsApp
        </a>
      </div>
    </form>
  );
}
