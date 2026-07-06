"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

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

export function MaxCard() {
  const [saving, setSaving] = useState(false);

  return (
    <>
      <style jsx global>{`
        .max-card-page {
          --sky: #15B0F8;
          --sky-deep: #0A87D6;
          --navy: #06304A;
          --navy-2: #0B2E42;
          --ink: #0E3A52;
          --cloud: #EAF6FE;
          --cloud-2: #F5FBFF;
          --line: rgba(6,48,74,0.10);
          font-family: 'Manrope', var(--font-inter), sans-serif;
          min-height: 100dvh;
          background: radial-gradient(circle at 50% 0%, #cdeeff 0%, #eaf6fe 45%, #dff0fb 100%);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 28px 16px 60px;
          color: var(--ink);
        }
        .max-card {
          width: 100%;
          max-width: 400px;
          background: #fff;
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 30px 60px -20px rgba(6,48,74,0.35), 0 8px 20px -8px rgba(6,48,74,0.2);
          position: relative;
        }
        .max-hero {
          position: relative;
          background: linear-gradient(160deg, var(--navy) 0%, var(--sky-deep) 55%, var(--sky) 100%);
          padding: 40px 24px 66px;
          text-align: center;
          overflow: hidden;
        }
        .max-hero::before {
          content: "";
          position: absolute;
          top: -60%; left: -20%;
          width: 140%; height: 180%;
          background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.16), transparent 55%);
          pointer-events: none;
        }
        .max-flight-path {
          position: absolute;
          top: 18px; left: 0;
          width: 100%;
          opacity: 0.35;
        }
        .max-icon-mark {
          width: 66px;
          height: auto;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 6px 14px rgba(0,0,0,0.15));
        }
        .max-wordmark {
          margin-top: 14px;
          font-family: 'Fredoka', var(--font-batangas), sans-serif;
          font-weight: 600;
          font-size: 26px;
          letter-spacing: 0.5px;
          color: #fff;
          position: relative;
          z-index: 2;
        }
        .max-tagline {
          margin-top: 6px;
          font-size: 13px;
          font-weight: 500;
          font-style: italic;
          letter-spacing: 0.3px;
          color: rgba(255,255,255,0.85);
          position: relative;
          z-index: 2;
        }
        .max-arch-cut {
          position: absolute;
          bottom: -1px; left: 50%;
          transform: translateX(-50%);
          width: 220%;
          height: 70px;
        }
        .max-panel {
          position: relative;
          margin-top: -46px;
          background: #fff;
          border-radius: 40px 40px 0 0;
          padding: 30px 26px 8px;
          text-align: center;
        }
        .max-name {
          font-family: 'Fredoka', var(--font-batangas), sans-serif;
          font-weight: 600;
          font-size: 22px;
          color: var(--navy);
        }
        .max-title {
          margin-top: 4px;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: var(--sky-deep);
        }
        .max-org-row {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12.5px;
          color: var(--ink);
          opacity: 0.65;
        }
        .max-org-row .dot {
          width: 4px; height: 4px; border-radius: 50%; background: var(--ink); opacity: 0.4;
        }
        .max-actions {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .max-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--navy);
        }
        .max-action .circle {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: var(--cloud);
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .max-action .circle svg { width: 22px; height: 22px; stroke: var(--sky-deep); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .max-action:hover .circle, .max-action:active .circle {
          background: var(--sky);
          transform: translateY(-2px);
        }
        .max-action:hover .circle svg, .max-action:active .circle svg { stroke: #fff; }
        .max-action .label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.3px;
          color: var(--navy-2);
          opacity: 0.8;
        }
        .max-save-btn {
          margin-top: 24px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--navy);
          color: #fff;
          border: none;
          padding: 15px 18px;
          border-radius: 999px;
          font-family: 'Manrope', var(--font-inter), sans-serif;
          font-weight: 700;
          font-size: 14.5px;
          letter-spacing: 0.2px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .max-save-btn:hover { background: var(--sky-deep); }
        .max-save-btn:active { transform: scale(0.98); }
        .max-save-btn svg { width: 18px; height: 18px; stroke: #fff; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .max-address {
          margin-top: 18px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          text-align: left;
          text-decoration: none;
          color: var(--ink);
          padding: 14px 16px;
          background: var(--cloud-2);
          border-radius: 18px;
          border: 1px solid var(--line);
        }
        .max-address svg { width: 18px; height: 18px; stroke: var(--sky-deep); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; margin-top: 2px; }
        .max-addr-text { font-size: 12.5px; line-height: 1.5; opacity: 0.85; }
        .max-addr-text strong { display: block; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--sky-deep); margin-bottom: 2px; }
        .max-divider {
          margin: 24px 0 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--ink);
          opacity: 0.4;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .max-divider::before, .max-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--line);
        }
        .max-socials {
          display: flex;
          justify-content: center;
          gap: 14px;
        }
        .max-socials a {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 1.5px solid var(--line);
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease;
        }
        .max-socials a svg { width: 18px; height: 18px; stroke: var(--navy); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .max-socials a:hover { background: var(--sky); border-color: var(--sky); transform: translateY(-2px); }
        .max-socials a:hover svg { stroke: #fff; }
        .max-footer {
          margin-top: 26px;
          padding: 16px 24px 22px;
          text-align: center;
        }
        .max-footer .arch-mini {
          width: 26px; height: 26px; margin: 0 auto 8px;
          opacity: 0.5;
        }
        .max-footer p {
          font-size: 10.5px;
          color: var(--ink);
          opacity: 0.45;
          letter-spacing: 0.3px;
        }
        @media (max-width: 360px) {
          .max-card { border-radius: 26px; }
          .max-actions { gap: 6px; }
          .max-action .circle { width: 46px; height: 46px; }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div className="max-card-page">
        <div className="max-card">

          {/* HERO */}
          <div className="max-hero">
            <svg className="max-flight-path" viewBox="0 0 400 60" fill="none">
              <path d="M10 45 C 100 5, 300 5, 390 45" stroke="white" strokeWidth="1.5" strokeDasharray="2 8" strokeLinecap="round" />
            </svg>
            <img className="max-icon-mark" src="/logo.png" alt="Aitken Travels" />
            <div className="max-wordmark">AITKEN TRAVELS</div>
            <div className="max-tagline">Your Journey Starts Here</div>
            <svg className="max-arch-cut" viewBox="0 0 800 70" preserveAspectRatio="none">
              <path d="M0,70 L0,40 Q400,-30 800,40 L800,70 Z" fill="#ffffff" />
            </svg>
          </div>

          {/* PANEL */}
          <div className="max-panel">
            <div className="max-name">Max Amarasinghe</div>
            <div className="max-title">Chief Travel Designer</div>
            <div className="max-org-row">
              <span>Aitken Travels</span>
              <span className="dot" />
              <span>Galle, Sri Lanka</span>
            </div>

            {/* ACTIONS */}
            <div className="max-actions">
              <a className="max-action" href="tel:+94770813690">
                <span className="circle">
                  <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </span>
                <span className="label">Call</span>
              </a>
              <a className="max-action" href="https://wa.me/94770813690" target="_blank" rel="noopener noreferrer">
                <span className="circle">
                  <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                </span>
                <span className="label">WhatsApp</span>
              </a>
              <a className="max-action" href="mailto:max@aitkentravel.com">
                <span className="circle">
                  <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg>
                </span>
                <span className="label">Email</span>
              </a>
              <a className="max-action" href="https://aitkentravel.com" target="_blank" rel="noopener noreferrer">
                <span className="circle">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                </span>
                <span className="label">Website</span>
              </a>
            </div>

            {/* SAVE CONTACT */}
            <button
              className="max-save-btn"
              onClick={() => { setSaving(true); saveContact(); setTimeout(() => setSaving(false), 1500); }}
            >
              <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              {saving ? "Saving..." : "Save Contact"}
            </button>

            {/* ADDRESS */}
            <a className="max-address" href="https://www.google.com/maps/search/?api=1&query=145%2F6+Bandaranayaka+Place+Galle+80000+Sri+Lanka" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span className="max-addr-text">
                <strong>Visit Us</strong>
                145/6 Bandaranayaka Place, Galle 80000, Sri Lanka
              </span>
            </a>

            <div className="max-divider">Follow Along</div>

            {/* SOCIALS */}
            <div className="max-socials">
              <a href="https://www.facebook.com/share/14ZpJh9mxLx/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://www.instagram.com/aitken.travel?igsh=MTFnM2IyaTI5bW82bQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" strokeWidth="1" /></svg>
              </a>
              <a href="https://www.tiktok.com/@aitkentravels1?_r=1&_t=ZS-97WxV1wjfjp" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 24 24"><path d="M16 3v9.5a3.5 3.5 0 1 1-3.5-3.5" /><path d="M16 3c.5 2.5 2 4 5 4.3" /></svg>
              </a>
            </div>

            {/* FOOTER */}
            <div className="max-footer">
              <img className="arch-mini" src="/logo.png" alt="" style={{ filter: "invert(20%) sepia(90%) saturate(1000%) hue-rotate(175deg)" }} />
              <p>AITKEN TRAVELS &middot; YOUR JOURNEY STARTS HERE</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
