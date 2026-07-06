"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { motion } from "framer-motion";

function saveContact() {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Max Amarasinghe",
    "N:Amarasinghe;Max;;;",
    "ORG:Aitken Travels",
    "TITLE:Chief Travel Designer",
    "TEL;TYPE=CELL:+94770813690",
    "EMAIL:max@aitkentravel.com",
    "URL:https://aitkentravel.com",
    "ADR;TYPE=WORK:;;145/6 Bandaranayaka Place;Galle;;80000;Sri Lanka",
    "END:VCARD",
  ].join("\n");
  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Max_Amarasinghe_Aitken_Travels.vcf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* Plane-in-arch icon mark — matches the Aitken Travels brand mark */
function IconMark({ size = 66, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
      {/* Arch/gateway shape */}
      <path d="M60 10C33 10 16 35 16 62v48h20V62c0-18 10-32 24-32s24 14 24 32v48h20V62c0-27-17-52-44-52z" fill="white" />
      {/* Plane */}
      <g transform="translate(60,58)" fill="white">
        <path d="M0-22L7-8 22-4 7 2 10 18 0 10-10 18-7 2-22-4-7-8z" fill="#06304A" />
      </g>
    </svg>
  );
}

/* Blue tinted icon mark for footer */
function IconMarkBlue({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" style={{ opacity: 0.5 }}>
      <path d="M60 10C33 10 16 35 16 62v48h20V62c0-18 10-32 24-32s24 14 24 32v48h20V62c0-27-17-52-44-52z" fill="#0A87D6" />
      <g transform="translate(60,58)" fill="#0A87D6">
        <path d="M0-22L7-8 22-4 7 2 10 18 0 10-10 18-7 2-22-4-7-8z" fill="#06304A" opacity="0.4" />
      </g>
    </svg>
  );
}

export function MaxCard() {
  const [saving, setSaving] = useState(false);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style jsx global>{`
        .mc-page {
          font-family: 'Manrope', sans-serif;
          min-height: 100dvh;
          background: radial-gradient(circle at 50% 0%, #cdeeff 0%, #eaf6fe 45%, #dff0fb 100%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 28px 16px 60px;
          color: #0E3A52;
        }
      `}</style>

      <div className="mc-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          style={{
            width: "100%",
            maxWidth: 400,
            background: "#fff",
            borderRadius: 32,
            overflow: "hidden",
            boxShadow: "0 30px 60px -20px rgba(6,48,74,0.35), 0 8px 20px -8px rgba(6,48,74,0.2)",
          }}
        >
          {/* ===== HERO ===== */}
          <div style={{
            position: "relative",
            background: "linear-gradient(160deg, #06304A 0%, #0A87D6 55%, #15B0F8 100%)",
            padding: "44px 24px 72px",
            textAlign: "center",
            overflow: "hidden",
          }}>
            {/* Light glow */}
            <div style={{
              position: "absolute", top: "-60%", left: "-20%",
              width: "140%", height: "180%",
              background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.16), transparent 55%)",
              pointerEvents: "none",
            }} />

            {/* Flight path */}
            <svg style={{ position: "absolute", top: 18, left: 0, width: "100%", opacity: 0.35 }} viewBox="0 0 400 60" fill="none">
              <path d="M10 45 C 100 5, 300 5, 390 45" stroke="white" strokeWidth="1.5" strokeDasharray="2 8" strokeLinecap="round" />
            </svg>

            {/* Icon mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              style={{ position: "relative", zIndex: 2 }}
            >
              <IconMark size={80} />
            </motion.div>

            {/* Wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              style={{
                marginTop: 14,
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: 28,
                letterSpacing: 0.5,
                color: "#fff",
                position: "relative",
                zIndex: 2,
              }}
            >
              AITKEN TRAVELS
            </motion.div>

            {/* Tagline */}
            <div style={{
              marginTop: 6,
              fontSize: 13.5,
              fontWeight: 500,
              fontStyle: "italic",
              letterSpacing: 0.3,
              color: "rgba(255,255,255,0.85)",
              position: "relative",
              zIndex: 2,
            }}>
              Your Journey Starts Here
            </div>

            {/* Arch cut */}
            <svg style={{ position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)", width: "220%", height: 70 }} viewBox="0 0 800 70" preserveAspectRatio="none">
              <path d="M0,70 L0,40 Q400,-30 800,40 L800,70 Z" fill="#ffffff" />
            </svg>
          </div>

          {/* ===== PANEL ===== */}
          <div style={{
            position: "relative",
            marginTop: -46,
            background: "#fff",
            borderRadius: "40px 40px 0 0",
            padding: "32px 28px 10px",
            textAlign: "center",
          }}>
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: 24,
                color: "#06304A",
              }}>
                Max Amarasinghe
              </div>
              <div style={{
                marginTop: 5,
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: 1.8,
                textTransform: "uppercase" as const,
                color: "#0A87D6",
              }}>
                Chief Travel Designer
              </div>
              <div style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                fontSize: 13,
                color: "#0E3A52",
                opacity: 0.6,
              }}>
                <span>Aitken Travels</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#0E3A52", opacity: 0.4 }} />
                <span>Galle, Sri Lanka</span>
              </div>
            </motion.div>

            {/* ===== ACTIONS ===== */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              style={{
                marginTop: 28,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 10,
              }}
            >
              {[
                { href: "tel:+94770813690", label: "Call", icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /> },
                { href: "https://wa.me/94770813690", label: "WhatsApp", icon: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /> },
                { href: "mailto:max@aitkentravel.com", label: "Email", icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></> },
                { href: "https://aitkentravel.com", label: "Website", icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></> },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textDecoration: "none", color: "#06304A" }}
                >
                  <div style={{
                    width: 58, height: 58,
                    borderRadius: "50%",
                    background: "#EAF6FE",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "transform 0.15s ease, background 0.15s ease",
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#15B0F8"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "#EAF6FE"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A87D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {item.icon}
                    </svg>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.3, color: "#0B2E42", opacity: 0.8 }}>
                    {item.label}
                  </span>
                </a>
              ))}
            </motion.div>

            {/* ===== SAVE CONTACT ===== */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              onClick={() => { setSaving(true); saveContact(); setTimeout(() => setSaving(false), 1500); }}
              style={{
                marginTop: 26,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                background: "#06304A",
                color: "#fff",
                border: "none",
                padding: "17px 18px",
                borderRadius: 999,
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: 0.2,
                cursor: "pointer",
                transition: "background 0.15s ease, transform 0.1s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#0A87D6"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#06304A"; }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              {saving ? "Saving..." : "Save Contact"}
            </motion.button>

            {/* ===== ADDRESS ===== */}
            <motion.a
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              href="https://www.google.com/maps/search/?api=1&query=145%2F6+Bandaranayaka+Place+Galle+80000+Sri+Lanka"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: 18,
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                textAlign: "left",
                textDecoration: "none",
                color: "#0E3A52",
                padding: "16px 18px",
                background: "#F5FBFF",
                borderRadius: 18,
                border: "1px solid rgba(6,48,74,0.10)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A87D6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>
                <strong style={{ display: "block", fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase" as const, color: "#0A87D6", marginBottom: 3, fontWeight: 700 }}>
                  Visit Us
                </strong>
                <span style={{ fontSize: 13, lineHeight: 1.55, opacity: 0.85 }}>
                  145/6 Bandaranayaka Place, Galle 80000, Sri Lanka
                </span>
              </span>
            </motion.a>

            {/* ===== DIVIDER ===== */}
            <div style={{
              margin: "26px 0 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#0E3A52",
              opacity: 0.4,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 2.2,
              textTransform: "uppercase" as const,
            }}>
              <span style={{ flex: 1, height: 1, background: "rgba(6,48,74,0.10)" }} />
              Follow Along
              <span style={{ flex: 1, height: 1, background: "rgba(6,48,74,0.10)" }} />
            </div>

            {/* ===== SOCIALS ===== */}
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              {[
                { href: "https://www.facebook.com/share/14ZpJh9mxLx/?mibextid=wwXIfr", label: "Facebook", icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
                { href: "https://www.instagram.com/aitken.travel?igsh=MTFnM2IyaTI5bW82bQ%3D%3D&utm_source=qr", label: "Instagram", icon: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" strokeWidth="1" /></> },
                { href: "https://www.tiktok.com/@aitkentravels1?_r=1&_t=ZS-97WxV1wjfjp", label: "TikTok", icon: <><path d="M16 3v9.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M16 3c.5 2.5 2 4 5 4.3" /></> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 48, height: 48,
                    borderRadius: "50%",
                    border: "1.5px solid rgba(6,48,74,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textDecoration: "none",
                    transition: "border-color 0.15s ease, transform 0.15s ease, background 0.15s ease",
                  }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "#15B0F8"; el.style.borderColor = "#15B0F8"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "transparent"; el.style.borderColor = "rgba(6,48,74,0.12)"; el.style.transform = "translateY(0)"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06304A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>

            {/* ===== FOOTER ===== */}
            <div style={{ marginTop: 28, paddingBottom: 24, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                <IconMarkBlue size={30} />
              </div>
              <p style={{ fontSize: 10.5, color: "#0E3A52", opacity: 0.4, letterSpacing: 0.4 }}>
                AITKEN TRAVELS &middot; YOUR JOURNEY STARTS HERE
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
