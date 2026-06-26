"use client";

import { Logo } from "./Logo";

const columns = [
  {
    h: "Services",
    items: [
      { label: "Airport Transfers", href: "/#services" },
      { label: "Round Tours", href: "/#services" },
      { label: "Vehicle Rentals", href: "/#services" },
      { label: "Day Excursions", href: "/#services" },
    ],
  },
  {
    h: "Fleet",
    items: [
      { label: "Cars", href: "/#fleet" },
      { label: "Vans", href: "/#fleet" },
      { label: "Buses", href: "/#fleet" },
      { label: "Motorbikes", href: "/#fleet" },
      { label: "Luxury", href: "/#fleet" },
    ],
  },
  {
    h: "Company",
    items: [
      { label: "About", href: "/#about" },
      { label: "Safety", href: "/#about" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    h: "Support",
    items: [
      { label: "Book", href: "/#services" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const socialIcons = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/14ZpJh9mxLx/?mibextid=wwXIfr",
    path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/aitken.travel?igsh=MTFnM2IyaTI5bW82bQ%3D%3D&utm_source=qr",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.92 4.92 0 0 1 1.675 1.09 4.92 4.92 0 0 1 1.09 1.675c.163.46.35 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.92 4.92 0 0 1-1.09 1.675 4.92 4.92 0 0 1-1.675 1.09c-.46.163-1.26.35-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.92 4.92 0 0 1-1.675-1.09 4.92 4.92 0 0 1-1.09-1.675c-.163-.46-.35-1.26-.403-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43A4.92 4.92 0 0 1 3.726 3.045a4.92 4.92 0 0 1 1.675-1.09c.46-.163 1.26-.35 2.43-.403C9.097 1.494 9.477 1.482 12 1.482V2.163zM12 6.865a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27zm0 8.468a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666zm5.338-8.671a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@aitkentravels1?_r=1&_t=ZS-96vQkqhMoon",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  },
];

export function Footer() {
  return (
    <footer className="relative">
      {/* Main footer */}
      <div className="bg-slate-900 pt-16 pb-10 px-6 md:px-10">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-[60px] pb-[60px]">
            {/* Logo column */}
            <div className="lg:col-span-1">
              <Logo light />
              <p className="mt-6 text-[14px] leading-relaxed text-slate-400 max-w-[280px]">
                Reliable transport services across Sri Lanka &mdash; cars, vans,
                buses, and bikes since 2024.
              </p>
              <div className="flex gap-3 mt-7">
                {socialIcons.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:border-primary-600 hover:text-white transition-all duration-300"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {columns.map((col) => (
              <div key={col.h}>
                <div className="font-display text-[13px] font-semibold tracking-wide text-primary-400 uppercase mb-5">
                  {col.h}
                </div>
                <ul className="flex flex-col gap-3">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-[14px] text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Decorative gradient line */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary-400/30 to-transparent" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 text-xs text-slate-500 gap-4">
            <span>
              &copy; 2026 Aitken Travels (Pvt) Ltd &middot; Galle, Sri Lanka
            </span>
            <div className="flex gap-6">
              <a href="/privacy" className="hover:text-slate-300 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-slate-300 transition-colors">
                Terms &amp; Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
