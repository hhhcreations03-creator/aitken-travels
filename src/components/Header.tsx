"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { NAV, SITE, whatsappUrl } from "@/lib/site";

interface HeaderProps {
  /** Pages with a full-bleed photographic hero start with a transparent, light header. */
  overlay?: boolean;
}

export function Header({ overlay = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const light = overlay && !scrolled && !open;
  const primary = NAV.filter((n) => ["/rooms", "/surf-retreats", "/wellness", "/dining", "/groups"].includes(n.href));

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500",
          light ? "bg-transparent" : "bg-ivory/90 backdrop-blur-md shadow-[0_1px_0_rgba(42,42,40,0.08)]",
        ].join(" ")}
      >
        <div className="wrap flex h-[72px] items-center justify-between lg:h-[84px]">
          <Logo light={light} priority />

          <nav aria-label="Primary" className="hidden items-center gap-7 xl:flex">
            {primary.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "textlink text-[14px] font-normal",
                    light ? "text-ivory after:bg-ivory" : "text-charcoal",
                    active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className={`hidden md:inline-flex ${light ? "btn-outline-light" : "btn-forest"} !py-2.5 !min-h-[44px]`}
            >
              Book Your Stay
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={[
                "flex h-11 w-11 items-center justify-center rounded-full border transition-colors",
                light ? "border-ivory/50 text-ivory" : "border-[color:var(--line)] text-charcoal",
              ].join(" ")}
            >
              <span className="relative block h-3.5 w-5" aria-hidden="true">
                <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[7px] h-px w-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 top-[14px] h-px w-full bg-current transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-forest text-ivory"
          >
            <div className="wrap flex min-h-full flex-col pb-10 pt-[96px] lg:pt-[120px]">
              <div className="grid flex-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
                <nav aria-label="All pages">
                  <ol className="flex flex-col">
                    {NAV.map((item, i) => {
                      const active = pathname === item.href;
                      return (
                        <li key={item.href} className="border-b border-ivory/10">
                          <Link
                            href={item.href}
                            aria-current={active ? "page" : undefined}
                            className="group flex items-baseline gap-5 py-3.5 lg:py-4"
                          >
                            <span className="w-6 text-[12px] text-sand-deep/80 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                            <span className={`font-display text-[clamp(1.6rem,3.6vw,2.6rem)] font-light leading-none transition-colors ${active ? "text-sand" : "text-ivory group-hover:text-sand"}`}>
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </nav>

                <div className="flex flex-col justify-between gap-10 lg:pl-10">
                  <div>
                    <p className="font-display text-[1.4rem] leading-snug text-sand">
                      Tell us when you&rsquo;d like to come and who&rsquo;s coming. We&rsquo;ll confirm availability and arrangements directly.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link href="/book" className="btn-ivory">Book Your Stay</Link>
                      <a href={whatsappUrl("Hello The Lavish Haven, I'd like to ask about a stay.")} target="_blank" rel="noopener noreferrer" className="btn-outline-light">
                        WhatsApp
                      </a>
                    </div>
                  </div>
                  <dl className="grid gap-5 text-[14px] sm:grid-cols-2">
                    <div>
                      <dt className="text-sand-deep/80">Email</dt>
                      <dd><a className="textlink text-ivory after:bg-ivory" href={`mailto:${SITE.email}`}>{SITE.email}</a></dd>
                    </div>
                    <div>
                      <dt className="text-sand-deep/80">WhatsApp</dt>
                      <dd><a className="textlink text-ivory after:bg-ivory" href={whatsappUrl("Hello The Lavish Haven")} target="_blank" rel="noopener noreferrer">{SITE.whatsappDisplay}</a></dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sand-deep/80">Address</dt>
                      <dd>{SITE.address.street}, {SITE.address.locality} {SITE.address.postalCode}, {SITE.address.country}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
