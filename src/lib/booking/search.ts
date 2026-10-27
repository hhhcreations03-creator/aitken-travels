import "server-only";
import { ROOMS } from "@/lib/rooms";
import { availability, roomTypes } from "./availability";
import { syncAllFeeds } from "./ical";
import { quote } from "./bookings";

export interface RoomOffer {
  slug: string;
  name: string;
  available: number;
  maxGuests: number;
  fits: boolean;
  nightlyRate: number | null;
  total: number | null;
}

/** Refreshes stale imported calendars (bounded wait), then returns offers for every active room type. */
export async function searchRooms(checkIn: string, checkOut: string, guests: number, rooms: number): Promise<RoomOffer[]> {
  await Promise.race([syncAllFeeds(true).catch(() => null), new Promise((r) => setTimeout(r, 4000))]);
  const [types, avail] = await Promise.all([roomTypes(), availability(checkIn, checkOut)]);
  return types
    .map((t) => {
      const room = ROOMS.find((r) => r.slug === t.slug);
      const available = avail.get(t.slug) ?? 0;
      return {
        slug: t.slug,
        name: room?.name ?? t.slug,
        available,
        maxGuests: t.max_guests,
        fits: t.max_guests * rooms >= guests,
        nightlyRate: t.nightly_rate,
        total: quote(t.nightly_rate, checkIn, checkOut, rooms),
      };
    })
    .filter((o) => ROOMS.some((r) => r.slug === o.slug));
}
