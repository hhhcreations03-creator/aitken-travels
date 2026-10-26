/**
 * Guest ratings shown on the homepage.
 *
 * Only enter figures you have checked on the source itself, and update
 * `asOf` whenever you change one. Leave `score` as null to show the source
 * as a link without a number.
 */
export interface Rating {
  source: string;
  score: number | null;
  outOf: number;
  reviewCount: number | null;
  url: string;
  linkLabel: string;
  /** Month the figure was last checked, e.g. "October 2026". */
  asOf: string;
}

export const RATINGS: Rating[] = [
  {
    source: "Booking.com",
    score: 9.3,
    outOf: 10,
    reviewCount: 34,
    url: "https://www.booking.com/hotel/lk/the-lavish-haven.en-gb.html#tab-reviews",
    linkLabel: "Read reviews on Booking.com",
    asOf: "October 2026",
  },
  {
    source: "Google",
    score: 4.8,
    outOf: 5,
    reviewCount: 52,
    url: "https://www.google.com/maps/search/?api=1&query=The+Lavish+Haven+166%2F2+Welhengoda+Road+Ahangama",
    linkLabel: "Read reviews on Google",
    asOf: "October 2026",
  },
];
