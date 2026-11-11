"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type IconName = "dashboard" | "bookings" | "calendar" | "inbox" | "rooms" | "sync" | "settings";

/** Only pages that exist are listed; new modules add themselves here as they ship. */
const GROUPS: Array<{ label: string; links: Array<{ href: string; label: string; icon: IconName; badge?: "pending" | "needsReply" }> }> = [
  {
    label: "Operations",
    links: [
      { href: "/admin", label: "Dashboard", icon: "dashboard" },
      { href: "/admin/bookings", label: "Reservations", icon: "bookings", badge: "pending" },
      { href: "/admin/calendar", label: "Calendar", icon: "calendar" },
    ],
  },
  {
    label: "Guests",
    links: [{ href: "/admin/inbox", label: "Inbox", icon: "inbox", badge: "needsReply" }],
  },
  {
    label: "Property",
    links: [
      { href: "/admin/rooms", label: "Rooms & rates", icon: "rooms" },
      { href: "/admin/availability", label: "Closures & sync", icon: "sync" },
      { href: "/admin/settings", label: "Settings", icon: "settings" },
    ],
  },
];

function Icon({ name }: { name: IconName }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "dashboard":
      return <svg {...common}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>;
    case "bookings":
      return <svg {...common}><path d="M8 3v3M16 3v3" /><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 11h10M7 15h6" /></svg>;
    case "calendar":
      return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2" /></svg>;
    case "inbox":
      return <svg {...common}><path d="M3 13l3-8h12l3 8v6a1 1 0 01-1 1H4a1 1 0 01-1-1z" /><path d="M3 13h5l1.5 2.5h5L16 13h5" /></svg>;
    case "rooms":
      return <svg {...common}><path d="M3 18v-7a2 2 0 012-2h14a2 2 0 012 2v7M3 18h18M3 21v-3M21 21v-3" /><path d="M7 9V6a1 1 0 011-1h8a1 1 0 011 1v3" /></svg>;
    case "sync":
      return <svg {...common}><path d="M20 11a8 8 0 00-14.3-4.9L4 8" /><path d="M4 4v4h4" /><path d="M4 13a8 8 0 0014.3 4.9L20 16" /><path d="M20 20v-4h-4" /></svg>;
    case "settings":
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-1.8-.3 1.6 1.6 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-1-1.5 1.6 1.6 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00.3-1.8 1.6 1.6 0 00-1.5-1H3a2 2 0 110-4h.1a1.6 1.6 0 001.5-1 1.6 1.6 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 001.8.3H9a1.6 1.6 0 001-1.5V3a2 2 0 114 0v.1a1.6 1.6 0 001 1.5 1.6 1.6 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 00-.3 1.8V9a1.6 1.6 0 001.5 1H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z" /></svg>;
  }
}

function NavList({ counts, onNavigate }: { counts: { pending: number; needsReply: number }; onNavigate?: () => void }) {
  const path = usePathname();
  const active = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  return (
    <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 pb-6">
      {GROUPS.map((g) => (
        <div key={g.label} className="mt-6 first:mt-2">
          <p className="px-3 pb-2 text-[11.5px] font-medium text-ivory/45">{g.label}</p>
          <ul className="space-y-0.5">
            {g.links.map((l) => {
              const n = l.badge ? counts[l.badge] : 0;
              const on = active(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onNavigate}
                    aria-current={on ? "page" : undefined}
                    className={`group flex items-center gap-3 rounded-[4px] px-3 py-2 text-[14px] transition-colors ${on ? "bg-ivory text-forest" : "text-ivory/75 hover:bg-ivory/10 hover:text-ivory"}`}
                  >
                    <span className={on ? "text-forest" : "text-ivory/55 group-hover:text-ivory"}><Icon name={l.icon} /></span>
                    <span className="flex-1">{l.label}</span>
                    {n > 0 && (
                      <span className="rounded-full bg-[#E9C46A] px-1.5 text-[11.5px] font-semibold tabular-nums text-forest-deep" aria-label={l.badge === "pending" ? `${n} awaiting confirmation` : `${n} need a reply`}>{n}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 px-6 py-5" aria-label="Lavish Haven admin home">
      <Image src="/brand/symbol-light.png" alt="" width={36} height={33} className="h-[28px] w-auto" />
      <span className="leading-tight">
        <span className="block font-display text-[1.1rem] text-ivory">Lavish Haven</span>
        <span className="block text-[11.5px] text-sand-deep">Hotel management</span>
      </span>
    </Link>
  );
}

export function Sidebar({ counts, account }: { counts: { pending: number; needsReply: number }; account: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-forest lg:flex">
        <Brand />
        <NavList counts={counts} />
        <div className="border-t border-ivory/10 p-4">{account}</div>
      </aside>

      {/* Phones and tablets */}
      <button type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="admin-drawer" className="inline-flex h-9 w-9 items-center justify-center rounded-[4px] border border-[color:var(--line)] bg-white text-forest lg:hidden" aria-label="Open menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-forest-deep/50" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside id="admin-drawer" className="absolute inset-y-0 left-0 flex w-[272px] max-w-[85vw] flex-col bg-forest shadow-xl">
            <div className="flex items-center justify-between pr-3">
              <Brand />
              <button type="button" onClick={() => setOpen(false)} className="rounded-[4px] p-2 text-ivory/80 hover:bg-ivory/10" aria-label="Close menu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <NavList counts={counts} onNavigate={() => setOpen(false)} />
            <div className="border-t border-ivory/10 p-4">{account}</div>
          </aside>
        </div>
      )}
    </>
  );
}
