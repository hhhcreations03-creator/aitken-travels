"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const CONTACT_INFO = [
  {
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    label: "Phone",
    value: "+94 77 081 3690",
    href: "tel:+94770813690",
  },
  {
    icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
    label: "WhatsApp",
    value: "+94 77 081 3690",
    href: "https://wa.me/94770813690?text=Hi%20Aitken%20Travels!%20I'd%20like%20to%20inquire%20about%20your%20services.",
    isWhatsApp: true,
  },
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    label: "Email",
    value: "travelsaitken@gmail.com",
    href: "mailto:travelsaitken@gmail.com",
  },
  {
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    label: "Location",
    value: "Galle, Sri Lanka",
    href: "#",
  },
];

export function ContactContent() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);

  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const subject = `Contact Inquiry from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nService: ${form.service}\n\nMessage:\n${form.message}`;

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body, replyTo: form.email }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
    } catch {
      window.open(`mailto:travelsaitken@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-[60px] md:py-[100px] px-6 md:px-10 lg:px-16 2xl:px-24 bg-[#FFFBF5]">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">

          {/* Left — contact info */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-[28px] md:text-[36px] font-bold text-slate-900 mb-3">
              Let&apos;s plan your trip
            </h2>
            <p className="text-[15px] text-slate-500 leading-relaxed mb-10 max-w-[400px]">
              Whether you need a quick airport transfer or a full island tour, our team is ready to help. We typically respond within 1 hour.
            </p>

            {/* Contact cards */}
            <div className="space-y-4">
              {CONTACT_INFO.map((info, i) => (
                <motion.a
                  key={info.label}
                  href={info.href}
                  target={info.href.startsWith("http") ? "_blank" : undefined}
                  rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-elevation-1 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                    info.isWhatsApp
                      ? "bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white"
                      : "bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white"
                  }`}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={info.isWhatsApp ? "currentColor" : "none"} stroke={info.isWhatsApp ? "none" : "currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={info.icon} />
                    </svg>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-slate-500">{info.label}</div>
                    <div className="font-display text-[16px] font-semibold text-slate-800 group-hover:text-primary-700 transition-colors">{info.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Business hours */}
            <div className="mt-10 p-5 rounded-2xl bg-primary-50/60 border border-primary-100/50">
              <div className="font-display text-[16px] font-semibold text-slate-800 mb-2 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Business Hours
              </div>
              <div className="space-y-1 text-[14px] text-slate-600">
                <div className="flex justify-between"><span>All Services</span><span className="font-medium text-primary-700">24/7 Available</span></div>
                <div className="flex justify-between"><span>Including holidays</span><span className="font-medium text-primary-700">Always open</span></div>
              </div>
            </div>
          </motion.div>

          {/* Right — contact form */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            {sent ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-elevation-2 p-10 md:p-14 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center mx-auto mb-6">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>
                </div>
                <h3 className="font-display text-[28px] font-bold text-slate-900 mb-3">Message sent!</h3>
                <p className="text-[15px] text-slate-500 mb-6">We&apos;ll get back to you within 1 hour. Check your email for a confirmation.</p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", service: "", message: "" }); }}
                  className="text-primary-600 font-medium text-[14px] hover:text-primary-800 cursor-pointer">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-elevation-2 p-8 md:p-10">
                <h3 className="font-display text-[24px] font-bold text-slate-900 mb-1">Send us a message</h3>
                <p className="text-[14px] text-slate-500 mb-8">Fill in the form and we&apos;ll get back to you shortly.</p>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-name" className="font-mono text-[11px] tracking-[0.14em] uppercase text-primary-600 font-medium">Full name *</label>
                      <input id="contact-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Smith"
                        className="px-4 py-3 border border-slate-200 rounded-xl text-[14px] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all min-h-[44px]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-email" className="font-mono text-[11px] tracking-[0.14em] uppercase text-primary-600 font-medium">Email *</label>
                      <input id="contact-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com"
                        className="px-4 py-3 border border-slate-200 rounded-xl text-[14px] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all min-h-[44px]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-phone" className="font-mono text-[11px] tracking-[0.14em] uppercase text-primary-600 font-medium">Phone / WhatsApp</label>
                      <input id="contact-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+94 77 081 3690"
                        className="px-4 py-3 border border-slate-200 rounded-xl text-[14px] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all min-h-[44px]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-service" className="font-mono text-[11px] tracking-[0.14em] uppercase text-primary-600 font-medium">Service interested in</label>
                      <select id="contact-service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="px-4 py-3 border border-slate-200 rounded-xl text-[14px] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all min-h-[44px] bg-white">
                        <option value="">Select a service...</option>
                        <option>Airport Transfer</option>
                        <option>Round Island Tour</option>
                        <option>Day Excursion</option>
                        <option>Vehicle Rental</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-message" className="font-mono text-[11px] tracking-[0.14em] uppercase text-primary-600 font-medium">Message *</label>
                    <textarea id="contact-message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5}
                      placeholder="Tell us about your trip — dates, destinations, number of passengers, any special requirements..."
                      className="px-4 py-3 border border-slate-200 rounded-xl text-[14px] outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all resize-none" />
                  </div>

                  <button type="submit" disabled={sending}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl py-4 font-semibold text-[15px] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer min-h-[52px] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {sending ? (
                      <>
                        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.3" /><path d="M12 2a10 10 0 019.95 9" /></svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                        Send message
                      </>
                    )}
                  </button>

                  <p className="text-[12px] text-slate-500 text-center">
                    Your message will be sent to <span className="text-primary-600 font-medium">travelsaitken@gmail.com</span>
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
