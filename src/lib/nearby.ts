/**
 * Restaurants and cafés near the Haven, each within about five minutes by
 * tuk-tuk (per the hotel team). Descriptions are written from the team's
 * notes and public reviews; check them with the team before changing.
 */
export interface NearbyPlace {
  name: string;
  kind: string;
  story: string;
}

export const NEARBY: NearbyPlace[] = [
  {
    name: "Cactus",
    kind: "Sunset views",
    story: "Go for the sunset. Cactus looks straight out over the beach, and as the sky turns pink over the bay, a cold drink here is how Ahangama says goodnight to the day.",
  },
  {
    name: "Thileni's",
    kind: "Seafood by the sea",
    story: "A small, warm place right on the shore. The crab curry and prawns come fresh from the water, and the rooftop catches the last light beautifully.",
  },
  {
    name: "Manori's Kitchen",
    kind: "Sri Lankan home cooking",
    story: "Rice and curry the way Sri Lankan families cook it at home, served outdoors beside the kitchen it came from. Fragrant curries, crisp poppadoms and roti. Come hungry.",
  },
  {
    name: "Vertigo Pizzeria Italiana",
    kind: "Italian",
    story: "Light, crisp Neapolitan pizza made by Italian hands, under rattan lamps, with a glass of wine. A little corner of Naples on the south coast.",
  },
  {
    name: "The Protein House",
    kind: "Healthy food",
    story: "For the mornings after a long surf, when your body asks for something clean and nourishing. Fresh, wholesome plates to refuel for the next session.",
  },
  {
    name: "Kai Ahangama",
    kind: "Café and bar",
    story: "The café everyone is posting about. Coffee and brunch by day, cocktails by night, and a rooftop for watching the village go by below.",
  },
];
