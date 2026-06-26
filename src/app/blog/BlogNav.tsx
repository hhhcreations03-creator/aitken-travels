"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Fleet", href: "/#fleet" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function BlogNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-[100] py-5">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto px-6 md:px-10 2xl:px-24">
          {/* Logo */}
          <Link href="/" className="flex items-center min-h-[44px] -mt-6">
            <Logo light />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8 -mt-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[13px] font-medium tracking-[0.01em] transition-colors duration-200 min-h-[44px] flex items-center ${
                  item.label === "Blog"
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side — mobile menu */}
          <div className="flex items-center gap-3 -mt-6">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2 min-h-[44px] justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span className={`w-6 h-0.5 rounded bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`w-6 h-0.5 rounded bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`w-4 h-0.5 rounded bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2 w-6" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[99] bg-white/95 backdrop-blur-[40px] pt-24 px-8 lg:hidden">
          <div className="flex flex-col gap-5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-display text-2xl text-slate-800 hover:text-primary-700 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://wa.me/94770813690"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center px-6 py-4 rounded-full text-sm font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white"
              onClick={() => setMenuOpen(false)}
            >
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      )}
    </>
  );
}
