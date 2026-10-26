import Image from "next/image";
import Link from "next/link";
import type { Room } from "@/lib/rooms";
import { whatsappUrl } from "@/lib/site";

export function roomEnquiryMessage(room: Room): string {
  return `Hello The Lavish Haven, I'd like to enquire about the ${room.name}.\n\nDates: \nGuests: \n\nThank you.`;
}

export function RoomCard({ room, priority = false }: { room: Room; priority?: boolean }) {
  const cover = room.images[0];
  return (
    <article className="group flex flex-col">
      <Link href={`/rooms/${room.slug}`} className="img-frame block aspect-[4/3]">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col pt-5">
        <p className="small text-charcoal-mute">
          {room.floor} <span aria-hidden="true">&nbsp;|&nbsp;</span> {room.sizeSqm} m² <span aria-hidden="true">&nbsp;|&nbsp;</span> {room.beds}
        </p>
        <h3 className="display-sm mt-2 text-forest">
          <Link href={`/rooms/${room.slug}`} className="hover:text-olive-deep">{room.name}</Link>
        </h3>
        <p className="body mt-2 line-clamp-3">{room.description}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
          <a href={whatsappUrl(roomEnquiryMessage(room))} target="_blank" rel="noopener noreferrer" className="textlink">Enquire about this room</a>
          <Link href={`/enquire?room=${room.slug}`} className="textlink">Check availability</Link>
        </div>
      </div>
    </article>
  );
}
