"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/calendar", label: "Calendar" },
  { href: "/admin/rooms", label: "Rooms & rates" },
  { href: "/admin/availability", label: "Closures & sync" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav({ pending }: { pending: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? path === "/admin" : path.startsWith(href));
  return (
    <>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="admin-nav" className="rounded-[3px] border border-ivory/30 px-3 py-1.5 text-[13px] text-ivory lg:hidden">
        Menu
      </button>
      <nav id="admin-nav" aria-label="Admin" className={`${open ? "block" : "hidden"} absolute left-0 right-0 top-full z-30 bg-forest-deep px-4 pb-4 lg:static lg:block lg:bg-transparent lg:p-0`}>
        <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={active(l.href) ? "page" : undefined}
                className={`flex items-center gap-2 rounded-[3px] px-3 py-2 text-[14px] ${active(l.href) ? "bg-ivory/15 text-ivory" : "text-ivory/75 hover:bg-ivory/10 hover:text-ivory"}`}
              >
                {l.label}
                {l.href === "/admin/bookings" && pending > 0 && (
                  <span className="rounded-full bg-[#E9C46A] px-1.5 text-[11.5px] font-semibold text-forest-deep" aria-label={`${pending} awaiting confirmation`}>{pending}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
