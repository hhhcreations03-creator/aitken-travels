/**
 * Room inventory for The Lavish Haven.
 *
 * Names, sizes, bed configurations and views were taken from the hotel's
 * Booking.com listing (https://www.booking.com/hotel/lk/the-lavish-haven.en-gb.html)
 * as mirrored on public listing aggregators on 26 Oct 2026. Update this file
 * when the inventory changes; every room component reads from it.
 *
 * Photo folders in the client Drive are labelled by room number, not by
 * Booking.com room type. The images below are genuine photographs of the
 * property's rooms, matched to each type by layout (floor, bed count,
 * patio/balcony, kitchen). The hotel team should confirm the pairing.
 */

export type Floor = "Ground floor" | "First floor";

export interface RoomImage {
  src: string;
  alt: string;
}

export interface Room {
  slug: string;
  name: string;
  shortName: string;
  floor: Floor;
  sizeSqm: number;
  /** Plain-language bed configuration as published on the listing. */
  beds: string;
  /** "Double", "Family" or "Suite", as categorised on the listing. */
  category: "Double" | "Family" | "Suite";
  views: string[];
  outdoor: string;
  features: string[];
  description: string;
  images: RoomImage[];
  /** True when the photo pairing to this type is an editorial match, not confirmed. */
  photoMatchUnconfirmed?: boolean;
}

const COMMON_FEATURES = [
  "Air conditioning and ceiling fan",
  "Private bathroom with walk-in shower",
  "Free Wi-Fi",
  "Minibar and bottled water",
  "Desk and seating area",
  "Wardrobe and safety deposit box",
  "Electric kettle",
  "Hairdryer and toiletries",
];

export const ROOMS: Room[] = [
  {
    slug: "deluxe-king-patio-pool-view",
    name: "Deluxe King Room with Private Patio & Pool View",
    shortName: "Deluxe King, Patio & Pool View",
    floor: "Ground floor",
    sizeSqm: 39,
    beds: "1 king bed",
    category: "Double",
    views: ["Pool", "Garden", "Quiet street"],
    outdoor: "Private patio",
    features: COMMON_FEATURES,
    description:
      "A ground-floor king room that opens straight onto its own patio, a few steps from the pool. Polished concrete walls, timber doors and a wide bed keep the room calm and cool through the afternoon.",
    images: [
      { src: "/images/rooms/king-patio-pool/bed-garden-window.webp", alt: "King bed with blue palm-print runner beside a window onto the garden" },
      { src: "/images/rooms/king-patio-pool/bed-feature-wall.webp", alt: "King bed against a textured concrete feature wall" },
      { src: "/images/rooms/king-patio-pool/bed-and-door.webp", alt: "King room with timber door and bedside shelf" },
      { src: "/images/rooms/king-patio-pool/desk-corner.webp", alt: "Writing desk and chair in the corner of a king room" },
    ],
    photoMatchUnconfirmed: true,
  },
  {
    slug: "superior-king-balcony-garden-pool-view",
    name: "Superior King Room with Private Balcony, Garden & Pool View",
    shortName: "Superior King, Balcony",
    floor: "First floor",
    sizeSqm: 47,
    beds: "1 king bed",
    category: "Double",
    views: ["Garden", "Pool"],
    outdoor: "Private balcony",
    features: COMMON_FEATURES,
    description:
      "The largest of the king rooms, with a deep covered balcony under the gabled roof. Timber chairs look out across the palms to the pool below, and the bedroom behind keeps a stone feature wall and soft, even light.",
    images: [
      { src: "/images/rooms/superior-king/balcony-wide.webp", alt: "Covered first-floor balcony with timber chairs looking over the garden and pool" },
      { src: "/images/rooms/superior-king/bed-balcony-doors.webp", alt: "King bed with green cushions and doors opening onto the balcony" },
      { src: "/images/rooms/superior-king/stone-wall-shelf.webp", alt: "Stone feature wall and shelf in a superior king room" },
      { src: "/images/rooms/superior-king/balcony-palms.webp", alt: "Balcony seating framed by palm trees" },
      { src: "/images/rooms/superior-king/bathroom-rain-shower.webp", alt: "Wood-panelled bathroom with walk-in rain shower" },
    ],
  },
  {
    slug: "deluxe-king-private-kitchen",
    name: "Deluxe King Room with Private Kitchen",
    shortName: "Deluxe King, Private Kitchen",
    floor: "Ground floor",
    sizeSqm: 39,
    beds: "1 king bed",
    category: "Double",
    views: ["Pool", "Inner courtyard", "Quiet street"],
    outdoor: "Private terrace",
    features: ["Private kitchenette", ...COMMON_FEATURES],
    description:
      "A ground-floor king room with its own kitchenette and a small dining nook, made for longer stays or guests who like to make their own breakfast. The terrace sits off the inner courtyard.",
    images: [
      { src: "/images/rooms/king-kitchen/bed-stone-wall.webp", alt: "King bed beneath a vaulted ceiling with a stone feature wall" },
      { src: "/images/rooms/king-kitchen/kitchen-dining.webp", alt: "Private kitchenette with a white dining table and chairs" },
      { src: "/images/rooms/king-kitchen/bed-terrace-view.webp", alt: "King bed with doors to a private terrace" },
      { src: "/images/rooms/king-kitchen/desk-and-doors.webp", alt: "Desk and timber doors in a king room" },
      { src: "/images/rooms/king-kitchen/bathroom.webp", alt: "Concrete-finish bathroom with basin and mirror" },
    ],
  },
  {
    slug: "family-suite-patio",
    name: "Family Suite with Patio",
    shortName: "Family Suite, Patio",
    floor: "Ground floor",
    sizeSqm: 73,
    beds: "1 king bed and 1 queen bed",
    category: "Family",
    views: ["Garden", "Pool"],
    outdoor: "Private patio and terrace",
    features: COMMON_FEATURES,
    description:
      "A wide ground-floor suite with two beds under one high ceiling, so a family or two friends share the space without crowding it. The patio outside looks directly onto the pool.",
    images: [
      { src: "/images/rooms/family-suite-patio/two-beds-wide.webp", alt: "Family suite with two beds, desk and large windows" },
      { src: "/images/rooms/family-suite-patio/patio-pool.webp", alt: "Private patio with chairs looking onto the pool" },
      { src: "/images/rooms/family-suite-patio/two-beds-window.webp", alt: "Two beds with blue runners beside a window" },
      { src: "/images/rooms/family-suite-patio/patio-pool-wide.webp", alt: "Ground-floor patio and planting beside the pool" },
      { src: "/images/rooms/family-suite-patio/bed-detail.webp", alt: "Detail of bed linen and cushions in the family suite" },
    ],
  },
  {
    slug: "deluxe-king-patio-garden-view",
    name: "Deluxe King Room with Private Patio & Garden View",
    shortName: "Deluxe King, Patio & Garden View",
    floor: "Ground floor",
    sizeSqm: 39,
    beds: "1 king bed",
    category: "Double",
    views: ["Garden", "Pool", "Quiet street"],
    outdoor: "Private patio",
    features: COMMON_FEATURES,
    description:
      "A ground-floor king room whose patio sits among the garden planting. Inside, a long shelf runs the length of the wall, with a desk by the doors and a quiet, neutral palette.",
    images: [
      { src: "/images/rooms/king-patio-garden/bed-garden-doors.webp", alt: "King bed with green cushions and doors to a garden patio" },
      { src: "/images/rooms/king-patio-garden/patio-garden.webp", alt: "Stone-paved patio with chairs among tropical planting" },
      { src: "/images/rooms/king-patio-garden/bed-and-desk.webp", alt: "King room with desk and timber entrance door" },
      { src: "/images/rooms/king-patio-garden/bed-front.webp", alt: "King bed with palm-leaf runner" },
      { src: "/images/rooms/king-patio-garden/bathroom.webp", alt: "Bathroom with basin, mirror and walk-in shower" },
    ],
  },
  {
    slug: "deluxe-king-balcony-garden-view",
    name: "Deluxe King Room with Private Balcony & Garden View",
    shortName: "Deluxe King, Balcony & Garden View",
    floor: "First floor",
    sizeSqm: 43,
    beds: "1 king bed",
    category: "Double",
    views: ["Garden", "Quiet street"],
    outdoor: "Private balcony",
    features: COMMON_FEATURES,
    description:
      "A first-floor king room with a balcony that looks into the treetops. Warm ochre textiles, a timber-framed mirror and a wood-panelled bathroom give it a slightly richer tone than the ground-floor rooms.",
    images: [
      { src: "/images/rooms/king-balcony-garden/bed-balcony-doors.webp", alt: "King bed with ochre throw and open doors to a balcony" },
      { src: "/images/rooms/king-balcony-garden/bed-and-shelf.webp", alt: "King bed, wall shelf and artwork in a first-floor room" },
      { src: "/images/rooms/king-balcony-garden/bed-front.webp", alt: "King bed with towel swans and yellow cushions" },
      { src: "/images/rooms/king-balcony-garden/bed-wardrobe.webp", alt: "Open wardrobe and coat stand beside the bed" },
      { src: "/images/rooms/king-balcony-garden/bathroom.webp", alt: "Wood-clad bathroom with glass shower" },
    ],
  },
  {
    slug: "deluxe-family-studio-two-balconies",
    name: "Deluxe Family Studio with 2 Private Balconies, Pool & Garden Views",
    shortName: "Deluxe Family Studio, 2 Balconies",
    floor: "First floor",
    sizeSqm: 78,
    beds: "1 king bed and 1 double bed",
    category: "Family",
    views: ["Garden", "Pool"],
    outdoor: "Two private balconies",
    features: COMMON_FEATURES,
    description:
      "A studio for families, with two sleeping areas and two balconies on different sides of the building: one over the pool, one into the garden. Grey linen and pale timber keep it restful.",
    images: [
      { src: "/images/rooms/family-studio/bed-balcony-doors.webp", alt: "King bed with grey throw and doors to a balcony" },
      { src: "/images/rooms/family-studio/balcony-one.webp", alt: "First-floor balcony with timber bench overlooking the garden" },
      { src: "/images/rooms/family-studio/two-rooms.webp", alt: "View from one sleeping area through to the second" },
      { src: "/images/rooms/family-studio/balcony-two.webp", alt: "Second balcony looking over the pool and palms" },
      { src: "/images/rooms/family-studio/bed-grey-throw.webp", alt: "King bed with grey throw and timber headboard" },
    ],
    photoMatchUnconfirmed: true,
  },
  {
    slug: "family-junior-suite-patio-kitchenette",
    name: "Family Junior Suite with Private Patio and Kitchenette",
    shortName: "Family Junior Suite, Patio & Kitchenette",
    floor: "Ground floor",
    sizeSqm: 39,
    beds: "1 king bed and 1 double bed",
    category: "Family",
    views: ["Garden", "Pool"],
    outdoor: "Private patio and terrace",
    features: ["Kitchenette", ...COMMON_FEATURES],
    description:
      "A compact ground-floor suite with a kitchenette and a planted patio, suited to a small family who want to keep a little independence. The patio is screened by palms and potted greenery.",
    images: [
      { src: "/images/rooms/family-junior-suite/bed-patio-doors.webp", alt: "King bed with blue runner and doors to a private patio" },
      { src: "/images/rooms/family-junior-suite/patio-plants.webp", alt: "Ground-floor patio with potted plants and seating" },
      { src: "/images/rooms/family-junior-suite/bed-desk.webp", alt: "Bed, desk and chair beneath a vaulted ceiling" },
      { src: "/images/rooms/family-junior-suite/patio-palms.webp", alt: "Patio seating beneath coconut palms" },
      { src: "/images/rooms/family-junior-suite/bed-front.webp", alt: "King bed with palm-print cushions" },
    ],
    photoMatchUnconfirmed: true,
  },
  {
    slug: "two-bedroom-suite",
    name: "Two-Bedroom Suite",
    shortName: "Two-Bedroom Suite",
    floor: "First floor",
    sizeSqm: 93,
    beds: "2 king beds and 1 sofa bed",
    category: "Suite",
    views: ["Garden", "Pool", "Quiet street"],
    outdoor: "Private balcony",
    features: COMMON_FEATURES,
    description:
      "The largest room in the house. A timber staircase climbs from the main bedroom to a second bedroom on the mezzanine, with a sofa bed below for a fifth guest. Dark-green walls and lantern light make it the most atmospheric space at the Haven.",
    images: [
      { src: "/images/rooms/two-bedroom-suite/stairs-mezzanine.webp", alt: "Timber staircase rising to a mezzanine bedroom" },
      { src: "/images/rooms/two-bedroom-suite/bed-balcony.webp", alt: "King bed with doors to a balcony in the two-bedroom suite" },
      { src: "/images/rooms/two-bedroom-suite/mezzanine-bed.webp", alt: "Mezzanine bedroom with king bed and dark-green walls" },
      { src: "/images/rooms/two-bedroom-suite/second-bedroom.webp", alt: "Second bedroom with king bed and lantern light" },
      { src: "/images/rooms/two-bedroom-suite/stairs-wide.webp", alt: "Lower bedroom with staircase and coat stand" },
      { src: "/images/rooms/two-bedroom-suite/bathroom.webp", alt: "Dark-tiled bathroom with walk-in shower" },
    ],
  },
  {
    slug: "deluxe-king-balcony-pool-view",
    name: "Deluxe King Room with Private Balcony & Pool View",
    shortName: "Deluxe King, Balcony & Pool View",
    floor: "First floor",
    sizeSqm: 38,
    beds: "1 king bed",
    category: "Double",
    views: ["Garden", "Pool"],
    outdoor: "Private balcony and terrace",
    features: COMMON_FEATURES,
    description:
      "A first-floor king room with a balcony above the pool. Soft grey pillows, a long concrete shelf and a timber desk; from the balcony the whole courtyard is in view.",
    images: [
      { src: "/images/rooms/king-balcony-pool/balcony-pool-view.webp", alt: "Covered balcony with chairs looking down onto the pool" },
      { src: "/images/rooms/king-balcony-pool/bed-grey-pillows.webp", alt: "King bed with grey pillows beneath a vaulted ceiling" },
      { src: "/images/rooms/king-balcony-pool/bed-balcony-doors.webp", alt: "King bed with timber doors opening to a balcony" },
      { src: "/images/rooms/king-balcony-pool/bed-shelf.webp", alt: "Bed and concrete wall shelf in a king room" },
      { src: "/images/rooms/king-balcony-pool/bathroom.webp", alt: "Wood-panelled bathroom with walk-in shower" },
    ],
  },
  {
    slug: "family-suite-balcony-pool-garden-views",
    name: "Family Suite with Private Balcony, Pool & Garden Views",
    shortName: "Family Suite, Balcony",
    floor: "First floor",
    sizeSqm: 79,
    beds: "1 king bed and 1 queen bed",
    category: "Family",
    views: ["Garden", "Pool"],
    outdoor: "Private balcony and terrace",
    features: COMMON_FEATURES,
    description:
      "A generous first-floor suite with two beds side by side beneath the gable, a stone feature wall and doors to a balcony over the garden. Easy for a family of four.",
    images: [
      { src: "/images/rooms/family-suite-balcony/two-beds-balcony.webp", alt: "Family suite with two beds and doors to a balcony" },
      { src: "/images/rooms/family-suite-balcony/two-beds-stone-wall.webp", alt: "Two beds beside a stone feature wall" },
      { src: "/images/rooms/family-suite-balcony/two-beds-desk.webp", alt: "Family suite with desk and balcony doors" },
      { src: "/images/rooms/family-suite-balcony/two-beds-front.webp", alt: "Two beds with blue palm-print runners" },
      { src: "/images/rooms/family-suite-balcony/bathroom.webp", alt: "Dark-stone bathroom with shower column" },
    ],
  },
  {
    slug: "family-suite-private-kitchen-balcony-garden-view",
    name: "Family Suite with Private Kitchen, Balcony & Garden View",
    shortName: "Family Suite, Private Kitchen",
    floor: "First floor",
    sizeSqm: 77,
    beds: "1 king bed and 1 single bed",
    category: "Family",
    views: ["Garden"],
    outdoor: "Private balcony and terrace",
    features: ["Private kitchenette", ...COMMON_FEATURES],
    description:
      "A first-floor family suite with its own kitchenette on the balcony, a king bedroom and a second sleeping alcove. The balcony looks over the neighbouring rooftops and banana trees.",
    images: [
      { src: "/images/rooms/family-suite-kitchen/bed-balcony-doors.webp", alt: "King bed with blue runner and doors to a sunny balcony" },
      { src: "/images/rooms/family-suite-kitchen/balcony-kitchenette.webp", alt: "Balcony with seating and a kitchenette with fridge" },
      { src: "/images/rooms/family-suite-kitchen/two-rooms.webp", alt: "King bedroom with a second sleeping alcove beyond" },
      { src: "/images/rooms/family-suite-kitchen/balcony-view.webp", alt: "Balcony view over rooftops and banana trees" },
      { src: "/images/rooms/family-suite-kitchen/bed-front.webp", alt: "King bed with palm-print runner and cushions" },
      { src: "/images/rooms/family-suite-kitchen/bathroom.webp", alt: "Marble-basin bathroom with dark tiles" },
    ],
  },
];

export function getRoom(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug);
}

export const ROOM_SELECT_OPTIONS = ROOMS.map((r) => ({ value: r.slug, label: r.name }));
