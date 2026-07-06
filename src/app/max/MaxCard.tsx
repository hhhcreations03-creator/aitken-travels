"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const CONTACT = {
  name: "Max Amarasinghe",
  title: "Chief Travel Designer",
  company: "Aitken Travels",
  phone: "+94770813690",
  phoneDisplay: "+94 77 081 3690",
  email: "travelsaitken@gmail.com",
  whatsapp: "94770813690",
  website: "https://www.aitkentravels.com",
  location: "Galle, Sri Lanka",
  photo: "/team/max.JPG",
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61576498498498",
    instagram: "https://www.instagram.com/aitken.travels/",
    tiktok: "https://www.tiktok.com/@aitken.travels",
  },
};

function VcfDownload() {
  const vcf = `BEGIN:VCARD
VERSION:3.0
FN:${CONTACT.name}
ORG:${CONTACT.company}
TITLE:${CONTACT.title}
TEL;TYPE=CELL:${CONTACT.phone}
EMAIL:${CONTACT.email}
URL:${CONTACT.website}
ADR;TYPE=WORK:;;${CONTACT.location};;;;
END:VCARD`;

  const blob = new Blob([vcf], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Max-Amarasinghe-Aitken-Travels.vcf";
  a.click();
  URL.revokeObjectURL(url);
}

export function MaxCard() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `${CONTACT.name} — ${CONTACT.company}`,
      text: `Connect with ${CONTACT.name}, ${CONTACT.title} at ${CONTACT.company}`,
      url: window.location.href,
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-primary-950 via-slate-900 to-primary-950 flex items-center justify-center px-4 py-10">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className="relative w-full max-w-[420px]"
      >
        {/* Card */}
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.4)]">

          {/* Header gradient + photo */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400" />
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
              <div className="w-28 h-28 rounded-full border-4 border-slate-900 shadow-xl overflow-hidden">
                <img src={CONTACT.photo} alt={CONTACT.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Name + Title */}
          <div className="pt-16 pb-2 text-center px-6">
            <h1 className="font-display text-[24px] font-bold text-white">{CONTACT.name}</h1>
            <p className="text-primary-400 text-[14px] font-medium mt-1">{CONTACT.title}</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <img src="/logo.png" alt="" className="h-5 w-auto brightness-0 invert opacity-60" />
              <span className="text-[13px] text-white/50">{CONTACT.company}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-white/30">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-[12px] text-white/35">{CONTACT.location}</span>
            </div>
          </div>

          {/* Quick actions — 4 icon buttons */}
          <div className="flex justify-center gap-3 py-5 px-6">
            {[
              { href: `tel:${CONTACT.phone}`, label: "Call", icon: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z", color: "bg-emerald-500/20 text-emerald-400" },
              { href: `https://wa.me/${CONTACT.whatsapp}`, label: "WhatsApp", icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z", color: "bg-[#25D366]/20 text-[#25D366]", fill: true },
              { href: `mailto:${CONTACT.email}`, label: "Email", icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6", color: "bg-primary-500/20 text-primary-400" },
              { href: CONTACT.website, label: "Website", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z", color: "bg-violet-500/20 text-violet-400", fill: true },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`flex flex-col items-center gap-1.5 min-w-[64px]`}
              >
                <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center transition-transform hover:scale-110 active:scale-95`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={item.fill ? "currentColor" : "none"} stroke={item.fill ? "none" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <span className="text-[10px] text-white/40 font-medium">{item.label}</span>
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-6 h-px bg-white/[0.06]" />

          {/* Contact details list */}
          <div className="px-6 py-5 flex flex-col gap-3">
            {[
              { icon: "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z", label: "Phone", value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone}` },
              { icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6", label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
              { icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10m-3 0a3 3 0 106 0 3 3 0 10-6 0", label: "Location", value: CONTACT.location, href: "#" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-400)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-white/30 font-mono uppercase tracking-wider">{item.label}</div>
                  <div className="text-[14px] text-white/80 font-medium truncate group-hover:text-primary-400 transition-colors">{item.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-6 h-px bg-white/[0.06]" />

          {/* Social links */}
          <div className="px-6 py-5">
            <div className="text-[10px] text-white/25 font-mono uppercase tracking-wider mb-3">Follow us</div>
            <div className="flex gap-2.5">
              {[
                { href: CONTACT.socials.facebook, label: "Facebook", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { href: CONTACT.socials.instagram, label: "Instagram", icon: "M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4z M12 9a3 3 0 100 6 3 3 0 000-6z M17.5 6.5h.01" },
                { href: CONTACT.socials.tiktok, label: "TikTok", icon: "M9 12a4 4 0 104 4V4a5 5 0 005 5" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] flex items-center justify-center transition-all hover:scale-105" aria-label={s.label}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-6 h-px bg-white/[0.06]" />

          {/* Action buttons */}
          <div className="px-6 py-5 flex flex-col gap-2.5">
            <button
              onClick={VcfDownload}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl py-3.5 font-semibold text-[14px] cursor-pointer min-h-[48px] flex items-center justify-center gap-2.5 hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5 transition-all active:scale-[0.97]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6" /><path d="M23 11h-6" />
              </svg>
              Save Contact
            </button>
            <button
              onClick={handleShare}
              className="w-full bg-white/[0.06] border border-white/[0.08] text-white/80 rounded-xl py-3.5 font-medium text-[14px] cursor-pointer min-h-[48px] flex items-center justify-center gap-2.5 hover:bg-white/[0.1] hover:-translate-y-0.5 transition-all active:scale-[0.97]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.59 13.51l6.83 3.98" /><path d="M15.41 6.51l-6.82 3.98" />
              </svg>
              {copied ? "Link copied!" : "Share Card"}
            </button>
          </div>
        </div>

        {/* Branding footer */}
        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-2 opacity-40 hover:opacity-60 transition-opacity">
            <img src="/logo.png" alt="" className="h-8 w-auto brightness-0 invert" />
          </Link>
          <p className="text-[10px] text-white/20 mt-2 font-mono">aitkentravels.com</p>
        </div>
      </motion.div>
    </div>
  );
}
