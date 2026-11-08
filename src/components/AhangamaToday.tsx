"use client";

import { useEffect, useState } from "react";

/** The Lavish Haven's coordinates, and Sri Lanka's fixed UTC+5:30. */
const LAT = 5.9735;
const LON = 80.362;
const TZ_HOURS = 5.5;

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** NOAA solar calculator: sunrise and sunset in minutes after local midnight. */
function sunTimes(y: number, m: number, d: number): { rise: number; set: number } {
  const jd = Date.UTC(y, m - 1, d) / 86400000 + 2440587.5;
  const jc = (jd - 2451545) / 36525;
  const L0 = (280.46646 + jc * (36000.76983 + jc * 0.0003032)) % 360;
  const M = 357.52911 + jc * (35999.05029 - 0.0001537 * jc);
  const e = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc);
  const C = Math.sin(rad(M)) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) + Math.sin(rad(2 * M)) * (0.019993 - 0.000101 * jc) + Math.sin(rad(3 * M)) * 0.000289;
  const omega = 125.04 - 1934.136 * jc;
  const lambda = L0 + C - 0.00569 - 0.00478 * Math.sin(rad(omega));
  const eps0 = 23 + (26 + (21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(rad(omega));
  const decl = deg(Math.asin(Math.sin(rad(eps)) * Math.sin(rad(lambda))));
  const vary = Math.tan(rad(eps / 2)) ** 2;
  const eqTime = 4 * deg(vary * Math.sin(2 * rad(L0)) - 2 * e * Math.sin(rad(M)) + 4 * e * vary * Math.sin(rad(M)) * Math.cos(2 * rad(L0)) - 0.5 * vary * vary * Math.sin(4 * rad(L0)) - 1.25 * e * e * Math.sin(2 * rad(M)));
  const ha = deg(Math.acos(Math.cos(rad(90.833)) / (Math.cos(rad(LAT)) * Math.cos(rad(decl))) - Math.tan(rad(LAT)) * Math.tan(rad(decl))));
  const noon = 720 - 4 * LON - eqTime + TZ_HOURS * 60;
  return { rise: noon - 4 * ha, set: noon + 4 * ha };
}

function clock(minutes: number): string {
  const total = Math.round(minutes);
  const h = Math.floor(total / 60) % 24;
  const mm = String(total % 60).padStart(2, "0");
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mm} ${h < 12 ? "am" : "pm"}`;
}

/** Today's sunrise and sunset at the Haven, worked out in the browser so it is always today's. */
export function AhangamaToday({ className = "" }: { className?: string }) {
  const [t, setT] = useState<{ rise: string; set: string } | null>(null);
  useEffect(() => {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Colombo", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(new Date());
    const get = (k: string) => Number(parts.find((p) => p.type === k)?.value);
    const { rise, set } = sunTimes(get("year"), get("month"), get("day"));
    setT({ rise: clock(rise), set: clock(set) });
  }, []);
  return (
    <p className={`min-h-[1.5em] ${className}`} aria-live="off">
      {t && <>Ahangama today: sunrise {t.rise}, sunset {t.set}.</>}
    </p>
  );
}
