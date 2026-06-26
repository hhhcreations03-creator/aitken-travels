"use client";

import { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { motion, AnimatePresence } from "framer-motion";

interface TopNavProps {
  onOpenBooking: () => void;
}

const NAV_ITEMS = [
  "Services",
  "Fleet",
  "Destinations",
  "About",
  "Stories",
  "Contact",
];

export function TopNav({ onOpenBooking }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = !scrolled;

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
          transparent
            ? "py-5 bg-transparent translate-y-0 opacity-100"
            : "py-3 -translate-y-full opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="flex items-center justify-between max-w-[1440px] mx-auto px-6 md:px-10">
          <a href="#" className="cursor-pointer min-h-[44px] flex items-center -mt-6">
            <Logo light={transparent} />
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-9 -mt-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={item === "Contact" ? "/contact" : `#${item.toLowerCase()}`}
                className={[
                  "relative text-[13px] font-normal tracking-[0.01em] transition-colors duration-200 min-h-[44px] flex items-center group",
                  transparent
                    ? "text-white/90 hover:text-white"
                    : "text-slate-700 hover:text-primary-700",
                ].join(" ")}
              >
                {item}
                <span
                  className={[
                    "absolute -bottom-1 left-0 right-0 h-[1.5px] rounded-full transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100",
                    transparent ? "bg-white/80" : "bg-primary-600",
                  ].join(" ")}
                />
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3.5 -mt-6">
            <button
              className={[
                "bg-transparent border-none cursor-pointer text-[11px] font-mono tracking-[0.16em] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-200",
                transparent
                  ? "text-white/90 hover:text-white"
                  : "text-slate-700 hover:text-primary-700",
              ].join(" ")}
            >
              EN
            </button>
            <span
              className={[
                "w-px h-3.5",
                transparent ? "bg-white/30" : "bg-slate-300",
              ].join(" ")}
            />
            <button
              className={[
                "bg-transparent border-none cursor-pointer text-[11px] font-mono tracking-[0.16em] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-200",
                transparent
                  ? "text-white/90 hover:text-white"
                  : "text-slate-700 hover:text-primary-700",
              ].join(" ")}
            >
              USD
            </button>
            <button
              onClick={onOpenBooking}
              className={[
                "inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[12.5px] font-medium ml-2 transition-all duration-300 min-h-[44px]",
                transparent
                  ? "bg-white text-slate-900 hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:-translate-y-0.5",
              ].join(" ")}
            >
              Book a vehicle
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M3 6h6m0 0L6 3m3 3L6 9"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2 min-h-[44px] min-w-[44px] items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={[
                "w-6 h-0.5 rounded transition-all duration-300",
                menuOpen
                  ? "rotate-45 translate-y-[4px] bg-slate-900"
                  : transparent
                    ? "bg-white/90"
                    : "bg-slate-700",
              ].join(" ")}
            />
            <span
              className={[
                "w-6 h-0.5 rounded transition-all duration-300",
                menuOpen
                  ? "opacity-0"
                  : transparent
                    ? "bg-white/90"
                    : "bg-slate-700",
              ].join(" ")}
            />
            <span
              className={[
                "h-0.5 rounded transition-all duration-300",
                menuOpen
                  ? "w-6 -rotate-45 -translate-y-[4px] bg-slate-900"
                  : transparent
                    ? "w-4 bg-white/90"
                    : "w-4 bg-slate-700",
              ].join(" ")}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[99] backdrop-blur-[40px] bg-white/90 pt-28 px-8 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-6">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item}
                  href={item === "Contact" ? "/contact" : `#${item.toLowerCase()}`}
                  className="font-display text-3xl text-slate-900 min-h-[44px] flex items-center"
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: i * 0.04,
                  }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenBooking();
                }}
                className="mt-4 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full text-sm font-medium bg-gradient-to-r from-primary-600 to-primary-500 text-white min-h-[44px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: NAV_ITEMS.length * 0.04,
                }}
              >
                Book a vehicle
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
