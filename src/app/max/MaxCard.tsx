"use client";
/* eslint-disable @next/next/no-img-element */

const ICON_MARK_BASE64 = "data:image/png;base64,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";

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
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style jsx global>{`
        :root {
          --sky: #15B0F8;
          --sky-deep: #0A87D6;
          --navy: #06304A;
          --navy-2: #0B2E42;
          --ink: #0E3A52;
          --cloud: #EAF6FE;
          --cloud-2: #F5FBFF;
          --white: #FFFFFF;
          --line: rgba(6,48,74,0.10);
        }
        .mc-body {
          font-family: 'Manrope', sans-serif;
          background: radial-gradient(circle at 50% 0%, #cdeeff 0%, #eaf6fe 45%, #dff0fb 100%);
          min-height: 100dvh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 28px 16px 60px;
          color: var(--ink);
        }
        .mc-card {
          width: 100%;
          max-width: 400px;
          background: var(--white);
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 30px 60px -20px rgba(6,48,74,0.35), 0 8px 20px -8px rgba(6,48,74,0.2);
          position: relative;
        }
        .mc-hero {
          position: relative;
          background: linear-gradient(160deg, var(--navy) 0%, var(--sky-deep) 55%, var(--sky) 100%);
          padding: 48px 24px 72px;
          text-align: center;
          overflow: hidden;
        }
        .mc-hero::before {
          content: "";
          position: absolute;
          top: -60%; left: -20%;
          width: 140%; height: 180%;
          background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.16), transparent 55%);
          pointer-events: none;
        }
        .mc-flight-path {
          position: absolute;
          top: 8px; left: -10%;
          width: 120%;
          opacity: 0.35;
        }
        .mc-icon-mark {
          width: 82px;
          height: auto;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 6px 14px rgba(0,0,0,0.15));
          display: block;
          margin: 0 auto;
        }
        .mc-wordmark {
          margin-top: 16px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 700;
          font-size: 28px;
          letter-spacing: 1px;
          color: var(--white);
          position: relative;
          z-index: 2;
        }
        .mc-tagline {
          margin-top: 8px;
          font-size: 14px;
          font-weight: 500;
          font-style: italic;
          letter-spacing: 0.4px;
          color: rgba(255,255,255,0.85);
          position: relative;
          z-index: 2;
        }
        .mc-arch-cut {
          position: absolute;
          bottom: -1px; left: 50%;
          transform: translateX(-50%);
          width: 220%;
          height: 70px;
        }
        .mc-panel {
          position: relative;
          margin-top: -46px;
          background: var(--white);
          border-radius: 40px 40px 0 0;
          padding: 30px 26px 8px;
          text-align: center;
        }
        .mc-profile-row {
          display: flex;
          align-items: center;
          gap: 18px;
          text-align: left;
        }
        .mc-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--cloud);
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(6,48,74,0.12);
        }
        .mc-profile-info {
          flex: 1;
          min-width: 0;
        }
        .mc-name {
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          font-size: 21px;
          color: var(--navy);
          line-height: 1.2;
        }
        .mc-title {
          margin-top: 4px;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: var(--sky-deep);
        }
        .mc-org-row {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 12px;
          color: var(--ink);
          opacity: 0.6;
        }
        .mc-org-row .mc-dot {
          width: 4px; height: 4px; border-radius: 50%; background: var(--ink); opacity: 0.4;
        }
        .mc-actions {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }
        .mc-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: var(--navy);
        }
        .mc-action .mc-circle {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: var(--cloud);
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .mc-action .mc-circle svg { width: 22px; height: 22px; stroke: var(--sky-deep); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .mc-action:hover .mc-circle, .mc-action:active .mc-circle {
          background: var(--sky);
          transform: translateY(-2px);
        }
        .mc-action:hover .mc-circle svg, .mc-action:active .mc-circle svg { stroke: var(--white); }
        .mc-action .mc-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.3px;
          color: var(--navy-2);
          opacity: 0.8;
        }
        .mc-save-btn {
          margin-top: 24px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--navy);
          color: var(--white);
          border: none;
          padding: 15px 18px;
          border-radius: 999px;
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
          font-size: 14.5px;
          letter-spacing: 0.2px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease;
        }
        .mc-save-btn:hover { background: var(--sky-deep); }
        .mc-save-btn:active { transform: scale(0.98); }
        .mc-save-btn svg { width: 18px; height: 18px; stroke: var(--white); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .mc-address {
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
        .mc-address svg { width: 18px; height: 18px; stroke: var(--sky-deep); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; flex-shrink: 0; margin-top: 2px; }
        .mc-addr-text { font-size: 12.5px; line-height: 1.5; opacity: 0.85; }
        .mc-addr-text strong { display: block; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--sky-deep); margin-bottom: 2px; font-weight: 700; }
        .mc-divider {
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
        .mc-divider::before, .mc-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--line);
        }
        .mc-socials {
          display: flex;
          justify-content: center;
          gap: 14px;
        }
        .mc-socials a {
          width: 44px; height: 44px;
          border-radius: 50%;
          border: 1.5px solid var(--line);
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease;
        }
        .mc-socials a svg { width: 18px; height: 18px; stroke: var(--navy); fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .mc-socials a:hover { background: var(--sky); border-color: var(--sky); transform: translateY(-2px); }
        .mc-socials a:hover svg { stroke: var(--white); }
        .mc-footer {
          margin-top: 26px;
          padding: 16px 24px 22px;
          text-align: center;
        }
        .mc-footer .mc-arch-mini {
          width: 26px; height: 26px; margin: 0 auto 8px;
          opacity: 0.5;
        }
        .mc-footer p {
          font-size: 10.5px;
          color: var(--ink);
          opacity: 0.45;
          letter-spacing: 0.3px;
        }
        @media (max-width: 360px) {
          .mc-card { border-radius: 26px; }
          .mc-actions { gap: 6px; }
          .mc-action .mc-circle { width: 46px; height: 46px; }
        }
      `}</style>

      <div className="mc-body">
        <div className="mc-card">

          {/* HERO */}
          <div className="mc-hero">
            <svg className="mc-flight-path" viewBox="0 0 500 80" fill="none">
              <path d="M-20 65 C 80 -5, 420 -5, 520 65" stroke="white" strokeWidth="1.8" strokeDasharray="3 10" strokeLinecap="round" />
            </svg>
            <img className="mc-icon-mark" src={ICON_MARK_BASE64} alt="Aitken Travels" />
            <div className="mc-wordmark">AITKEN TRAVELS</div>
            <div className="mc-tagline">Your Journey Starts Here</div>
            <svg className="mc-arch-cut" viewBox="0 0 800 70" preserveAspectRatio="none">
              <path d="M0,70 L0,40 Q400,-30 800,40 L800,70 Z" fill="#ffffff" />
            </svg>
          </div>

          {/* PANEL */}
          <div className="mc-panel">
            <div className="mc-profile-row">
              <img className="mc-avatar" src="/team/max.JPG" alt="Max Amarasinghe" />
              <div className="mc-profile-info">
                <div className="mc-name">Max Amarasinghe</div>
                <div className="mc-title">Chief Travel Designer</div>
                <div className="mc-org-row">
                  <span>Aitken Travels</span>
                  <span className="mc-dot" />
                  <span>Galle, Sri Lanka</span>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mc-actions">
              <a className="mc-action" href="tel:+94770813690">
                <span className="mc-circle"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg></span>
                <span className="mc-label">Call</span>
              </a>
              <a className="mc-action" href="https://wa.me/94770813690" target="_blank" rel="noopener noreferrer">
                <span className="mc-circle"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg></span>
                <span className="mc-label">WhatsApp</span>
              </a>
              <a className="mc-action" href="mailto:max@aitkentravel.com">
                <span className="mc-circle"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></svg></span>
                <span className="mc-label">Email</span>
              </a>
              <a className="mc-action" href="https://aitkentravel.com" target="_blank" rel="noopener noreferrer">
                <span className="mc-circle"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg></span>
                <span className="mc-label">Website</span>
              </a>
            </div>

            {/* SAVE CONTACT */}
            <button className="mc-save-btn" onClick={saveContact}>
              <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
              Save Contact
            </button>

            {/* ADDRESS */}
            <a className="mc-address" href="https://www.google.com/maps/search/?api=1&query=145%2F6+Bandaranayaka+Place+Galle+80000+Sri+Lanka" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span className="mc-addr-text">
                <strong>Visit Us</strong>
                145/6 Bandaranayaka Place, Galle 80000, Sri Lanka
              </span>
            </a>

            <div className="mc-divider">Follow Along</div>

            {/* SOCIALS */}
            <div className="mc-socials">
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
            <div className="mc-footer">
              <img className="mc-arch-mini" src={ICON_MARK_BASE64} alt="" style={{ filter: "invert(20%) sepia(90%) saturate(1000%) hue-rotate(175deg)" }} />
              <p>AITKEN TRAVELS &middot; YOUR JOURNEY STARTS HERE</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
