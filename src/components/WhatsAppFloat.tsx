"use client";

import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/site";

export function WhatsAppFloat() {
  // On phones the button waits until the visitor scrolls past the opening screen,
  // so it never sits on top of the hero's own buttons.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const update = () => setShown(window.innerWidth >= 768 || window.scrollY > window.innerHeight * 0.6);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a
      href={whatsappUrl("Hello The Lavish Haven, I'd like to ask about a stay.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with The Lavish Haven on WhatsApp"
      className={`fixed bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_8px_24px_rgba(31,157,85,0.35)] transition-[opacity,transform] duration-300 hover:scale-105 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14 ${shown ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      tabIndex={shown ? undefined : -1}
      aria-hidden={shown ? undefined : true}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}
