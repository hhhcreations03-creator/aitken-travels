"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { whatsappUrl } from "@/lib/site";

export interface DockRoom { slug: string; name: string; sizeSqm: number; beds: string }

/**
 * Phones and small tablets: a booking bar pinned to the bottom of the screen,
 * where a thumb can reach it. It slides in once the visitor scrolls past the
 * hero, offers the room they're looking at on a room page, steps aside while
 * the on-screen keyboard is open, and stays away from the booking pages.
 */
export function MobileDock({ rooms }: { rooms: DockRoom[] }) {
  const pathname = usePathname() ?? "/";
  const [shown, setShown] = useState(false);
  const [typing, setTyping] = useState(false);

  const hidden = pathname.startsWith("/book") || pathname.startsWith("/admin");

  useEffect(() => {
    if (hidden) return;
    document.body.classList.add("has-dock");
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.body.classList.remove("has-dock");
      window.removeEventListener("scroll", onScroll);
    };
  }, [hidden, pathname]);

  useEffect(() => {
    const isField = (t: EventTarget | null) => t instanceof HTMLElement && t.matches("input, textarea, select, [contenteditable]");
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = (e: FocusEvent) => isField(e.target) && setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  if (hidden) return null;

  const room = pathname.startsWith("/rooms/") ? rooms.find((r) => `/rooms/${r.slug}` === pathname) : undefined;
  const bookHref = room ? `/book?room=${room.slug}` : "/book";
  const bookLabel = room ? "Check availability" : "Book your stay";
  const message = room
    ? `Hello The Lavish Haven, I'd like to ask about the ${room.name}.`
    : "Hello The Lavish Haven, I'd like to ask about a stay.";
  const visible = shown && !typing;

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-30 border-t border-[color:var(--line)] bg-ivory/95 backdrop-blur-md lg:hidden",
        "pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
      aria-hidden={!visible}
    >
      <div className="wrap flex h-[68px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[1.05rem] leading-tight text-forest">{room ? room.name : "The Lavish Haven"}</p>
          <p className="truncate text-[12.5px] text-charcoal-mute">{room ? `${room.sizeSqm} m², ${room.beds}` : "Ahangama, two minutes from the beach"}</p>
        </div>
        <a
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          aria-label="Message us on WhatsApp"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[color:var(--line)] text-forest"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z" />
          </svg>
        </a>
        <Link href={bookHref} tabIndex={visible ? 0 : -1} className="btn-forest shrink-0 !px-5">
          {bookLabel}
        </Link>
      </div>
    </div>
  );
}
