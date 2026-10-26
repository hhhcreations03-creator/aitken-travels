"use client";

import { useMemo, useState } from "react";
import { composeMessage, whatsappUrl } from "@/lib/site";
import { EMAIL_RE, submitEnquiry, type SubmitResult } from "@/lib/enquiry-client";
import { EnquiryOutcome } from "./EnquiryOutcome";
import { FormNote, Honeypot, SelectField, TextField, TextareaField } from "./fields";

const TOPICS = ["A stay", "Rooms and suites", "A group or retreat", "Dining", "Wellness and yoga", "Directions and transport", "Something else"];

interface FormState { name: string; email: string; phone: string; topic: string; message: string }
const EMPTY: FormState = { name: "", email: "", phone: "", topic: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const message = useMemo(
    () => composeMessage("Hello The Lavish Haven,", [["Name", form.name], ["Email", form.email], ["Phone", form.phone], ["Topic", form.topic], ["Message", form.message]]),
    [form]
  );
  const subject = `Website message${form.topic ? `: ${form.topic}` : ""}${form.name ? ` from ${form.name}` : ""}`;

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = "Add your name.";
    if (!EMAIL_RE.test(form.email)) e.email = "Add a valid email address.";
    if (form.message.trim().length < 10) e.message = "Tell us a little more so we can help.";
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

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="name" label="Your name" required autoComplete="name" value={form.name} onChange={set("name")} error={errors.name} />
        <TextField id="email" label="Email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="phone" label="Phone or WhatsApp" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />
        <SelectField id="topic" label="What's it about" value={form.topic} onChange={set("topic")}>
          <option value="">Choose a topic</option>
          {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
        </SelectField>
      </div>
      <TextareaField id="message" label="Message" required value={form.message} onChange={set("message")} error={errors.message} />
      <FormNote />
      <div className="flex flex-wrap gap-3 pt-2">
        <button type="submit" disabled={sending} className="btn-forest disabled:opacity-60">{sending ? "Sending…" : "Send message by email"}</button>
        <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" onClick={(e) => { if (!validate()) e.preventDefault(); }}>
          Send on WhatsApp
        </a>
      </div>
    </form>
  );
}
