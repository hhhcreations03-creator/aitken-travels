export interface GalleryImage {
  src: string;
  alt: string;
  /** Aspect hint for layout: "wide" (3:2), "tall" (2:3) or "square". */
  shape?: "wide" | "tall" | "square";
}

export interface GalleryCategory {
  slug: string;
  label: string;
  images: GalleryImage[];
}

export const GALLERY: GalleryCategory[] = [
  {
    slug: "property",
    label: "Property",
    images: [
      { src: "/images/property/pool-dusk-wide.webp", alt: "The Lavish Haven at dusk, pool lit and balconies glowing" },
      { src: "/images/property/aerial-pool-building.webp", alt: "Aerial view of the hotel's green roofs and pool among palms" },
      { src: "/images/property/lobby-staircase.webp", alt: "Lobby with timber staircase and rattan seating" },
      { src: "/images/property/aerial-green-roofs.webp", alt: "Aerial view over palm trees to the hotel's green roofs" },
      { src: "/images/property/pool-evening.webp", alt: "Pool and courtyard in the blue hour" },
      { src: "/images/property/lobby-lounge.webp", alt: "Lounge seating beneath the lobby staircase" },
      { src: "/images/property/aerial-night-pool.webp", alt: "Night-time aerial of the illuminated pool" },
      { src: "/images/property/aerial-top-down.webp", alt: "Top-down aerial of the hotel, pool and gardens" },
      { src: "/images/property/lobby-wide.webp", alt: "Lobby with marble floor and timber balustrades" },
      { src: "/images/property/aerial-night-courtyard.webp", alt: "Night aerial of the courtyard and pool" },
    ],
  },
  {
    slug: "rooms",
    label: "Rooms",
    images: [
      { src: "/images/rooms/superior-king/bed-balcony-doors.webp", alt: "King bed with green cushions and balcony doors" },
      { src: "/images/rooms/two-bedroom-suite/stairs-mezzanine.webp", alt: "Timber staircase to a mezzanine bedroom" },
      { src: "/images/rooms/family-suite-balcony/two-beds-balcony.webp", alt: "Family suite with two beds and a balcony" },
      { src: "/images/rooms/king-kitchen/bed-stone-wall.webp", alt: "King bed beneath a vaulted ceiling and stone wall" },
      { src: "/images/rooms/more/king-room-patio-doors.webp", alt: "King room with doors to a small patio" },
      { src: "/images/rooms/king-balcony-garden/bed-front.webp", alt: "King bed with towel swans and ochre cushions" },
      { src: "/images/rooms/more/twin-family-room.webp", alt: "Family room with two beds and a stone wall" },
      { src: "/images/rooms/family-studio/bed-balcony-doors.webp", alt: "King bed with grey throw and balcony doors" },
      { src: "/images/rooms/more/king-room-art.webp", alt: "King room with artwork and timber desk" },
      { src: "/images/rooms/superior-king/bathroom-rain-shower.webp", alt: "Wood-panelled bathroom with rain shower" },
      { src: "/images/rooms/more/bathroom-wood.webp", alt: "Bathroom with timber-look tiles and glass shower" },
      { src: "/images/rooms/two-bedroom-suite/mezzanine-bed.webp", alt: "Mezzanine bedroom with dark-green walls" },
      { src: "/images/rooms/more/balcony-gable.webp", alt: "Balcony beneath a white gabled roof" },
      { src: "/images/rooms/family-suite-patio/two-beds-wide.webp", alt: "Ground-floor family suite with two beds" },
      { src: "/images/details/towel-swans.webp", alt: "Towel swans on a bed with ochre cushions" },
      { src: "/images/details/tea-station.webp", alt: "Tea and coffee station on a wall shelf" },
    ],
  },
  {
    slug: "pool-gardens",
    label: "Pool & gardens",
    images: [
      { src: "/images/property/pool-daytime.webp", alt: "The pool and courtyard in daylight" },
      { src: "/images/property/aerial-pool-swimmer.webp", alt: "Top-down aerial of a swimmer in the pool" },
      { src: "/images/property/garden-path-pool.webp", alt: "Stone garden path leading to the pool" },
      { src: "/images/property/pool-courtyard.webp", alt: "Pool with balconies and planting" },
      { src: "/images/rooms/more/balcony-over-pool.webp", alt: "Balcony table overlooking the pool" },
      { src: "/images/property/pool-dusk.webp", alt: "Pool at dusk with the building lit" },
      { src: "/images/details/garden-foliage.webp", alt: "Garden foliage against a concrete wall" },
      { src: "/images/rooms/family-suite-patio/patio-pool-wide.webp", alt: "Ground-floor patio and planting beside the pool" },
      { src: "/images/rooms/more/balcony-over-pool-wide.webp", alt: "Wide balcony above the pool" },
    ],
  },
  {
    slug: "surf-surroundings",
    label: "Surf & surroundings",
    images: [
      { src: "/images/property/aerial-coast-surf.webp", alt: "Aerial view of the Ahangama coastline with surf breaking" },
      { src: "/images/property/aerial-ocean-horizon.webp", alt: "Aerial view over palms to the ocean horizon" },
      { src: "/images/property/aerial-coastline.webp", alt: "Aerial of the coastline and village from above the hotel" },
      { src: "/images/property/aerial-palms.webp", alt: "Aerial of the hotel among coconut palms" },
      { src: "/images/rooms/more/balcony-banana-trees.webp", alt: "Balcony beside banana trees" },
      { src: "/images/rooms/more/balcony-rooftops.webp", alt: "Balcony looking over village rooftops" },
    ],
  },
  {
    slug: "wellness",
    label: "Wellness",
    images: [
      { src: "/images/wellness/yoga-balcony-reach.webp", alt: "Yoga pose on a balcony among palms" },
      { src: "/images/wellness/yoga-poolside.webp", alt: "Yoga by the pool" },
      { src: "/images/wellness/yoga-stretch.webp", alt: "Side stretch on a covered terrace" },
      { src: "/images/wellness/yoga-headstand.webp", alt: "Headstand beside the pool" },
      { src: "/images/wellness/yoga-balcony.webp", alt: "Standing yoga pose on a balcony" },
      { src: "/images/wellness/poolside-lounger.webp", alt: "Reading on a sun lounger by the pool" },
      { src: "/images/wellness/pool-swim.webp", alt: "Guest entering the pool" },
      { src: "/images/wellness/poolside-coconut.webp", alt: "Fresh coconut by the pool" },
      { src: "/images/details/amenities-bottles.webp", alt: "Bathroom amenity bottles with palm motif" },
    ],
  },
  {
    slug: "dining",
    label: "Dining",
    images: [
      { src: "/images/dining/restaurant-terrace.webp", alt: "Open-air restaurant terrace with timber tables" },
      { src: "/images/dining/restaurant-lanterns.webp", alt: "Restaurant lit by woven lanterns in the evening" },
      { src: "/images/dining/drink-service.webp", alt: "A drink served poolside on a wooden tray" },
      { src: "/images/dining/restaurant-tables.webp", alt: "Restaurant tables beneath a white timber ceiling" },
      { src: "/images/dining/restaurant-evening.webp", alt: "Restaurant terrace at night" },
      { src: "/images/dining/drink-served.webp", alt: "Guest receiving a drink by the pool" },
      { src: "/images/details/glassware.webp", alt: "Glassware and folded napkins" },
    ],
  },
  {
    slug: "experiences",
    label: "Experiences",
    images: [
      { src: "/images/wellness/poolside-hat.webp", alt: "Guest in a straw hat by the pool" },
      { src: "/images/wellness/poolside-reading-coconut.webp", alt: "Reading with a fresh coconut by the pool" },
      { src: "/images/wellness/poolside-pool-edge.webp", alt: "Sitting at the edge of the pool" },
      { src: "/images/wellness/poolside-drink.webp", alt: "A cold drink on a striped towel by the pool" },
      { src: "/images/wellness/poolside-hat-seated.webp", alt: "Seated by the pool in a straw hat" },
      { src: "/images/property/pool-evening.webp", alt: "The courtyard in the evening" },
    ],
  },
];
