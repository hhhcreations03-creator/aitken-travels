export const SITE = {
  name: "The Lavish Haven",
  shortName: "Lavish Haven",
  tagline: "A refined coastal escape in Ahangama",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.thelavishhaven.com",
  email: "hello@thelavishhaven.com",
  whatsappE164: "+94764832968",
  whatsappDisplay: "+94 76 483 2968",
  whatsappDigits: "94764832968",
  address: {
    street: "166/2 Welhengoda Road",
    locality: "Ahangama",
    postalCode: "80650",
    country: "Sri Lanka",
    countryCode: "LK",
  },
  bookingUrl: "https://www.booking.com/hotel/lk/the-lavish-haven.en-gb.html",
  mapsQuery: "The Lavish Haven, 166/2 Welhengoda Road, Ahangama 80650, Sri Lanka",
  checkIn: "2:00 PM",
} as const;

export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;
export const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapsQuery)}&output=embed`;

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Rooms & Suites", href: "/rooms" },
  { label: "Surf Retreats", href: "/surf-retreats" },
  { label: "Wellness & Experiences", href: "/wellness" },
  { label: "Dining", href: "/dining" },
  { label: "Groups & Events", href: "/groups" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Location", href: "/location" },
  { label: "Contact", href: "/contact" },
] as const;

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappDigits}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(subject: string, body: string): string {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Builds a plain-text message from labelled lines, skipping empty values. */
export function composeMessage(intro: string, lines: Array<[string, string | number | undefined | null]>, outro?: string): string {
  const rows = lines
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([k, v]) => `${k}: ${String(v).trim()}`);
  return [intro, "", ...rows, ...(outro ? ["", outro] : [])].join("\n");
}
