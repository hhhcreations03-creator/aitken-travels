"use client";

import { Logo } from "./Logo";

const columns = [
  {
    h: "Services",
    items: [
      "Airport Transfers",
      "Round Tours",
      "Vehicle Rentals",
      "Day Excursions",
    ],
  },
  {
    h: "Fleet",
    items: ["Cars", "Vans", "Buses", "Motorbikes", "Luxury", "Group"],
  },
  {
    h: "Company",
    items: ["About", "Drivers", "Safety", "Blog", "Partners"],
  },
  {
    h: "Support",
    items: ["Book", "FAQ", "Routes", "Insurance", "Contact"],
  },
];

const socialIcons = [
  {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.92 4.92 0 0 1 1.675 1.09 4.92 4.92 0 0 1 1.09 1.675c.163.46.35 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.92 4.92 0 0 1-1.09 1.675 4.92 4.92 0 0 1-1.675 1.09c-.46.163-1.26.35-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.92 4.92 0 0 1-1.675-1.09 4.92 4.92 0 0 1-1.09-1.675c-.163-.46-.35-1.26-.403-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43A4.92 4.92 0 0 1 3.726 3.045a4.92 4.92 0 0 1 1.675-1.09c.46-.163 1.26-.35 2.43-.403C9.097 1.494 9.477 1.482 12 1.482V2.163zM12 6.865a5.135 5.135 0 1 0 0 10.27 5.135 5.135 0 0 0 0-10.27zm0 8.468a3.333 3.333 0 1 1 0-6.666 3.333 3.333 0 0 1 0 6.666zm5.338-8.671a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z",
  },
  {
    label: "Facebook",
    path: "M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z",
  },
  {
    label: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "WhatsApp",
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z",
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
                buses, and bikes since 2009.
              </p>
              <div className="flex gap-3 mt-7">
                {socialIcons.map((social) => (
                  <a
                    key={social.label}
                    href="#"
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
                    <li key={item}>
                      <a
                        href="#"
                        className="text-[14px] text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        {item}
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
              &copy; 2026 Aitken Travels (Pvt) Ltd &middot; Colombo, Sri Lanka
            </span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-300 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-300 transition-colors">
                Terms
              </a>
              <span>SLTDA No. 2143</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
