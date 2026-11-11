import { useId } from "react";

export type SunPhase = "arrival" | "dawn" | "morning" | "midday" | "dusk" | "night";

/**
 * A small sun over a horizon line, drawn at the height it holds at that
 * time of day. Used beside the homepage's day sequence.
 */
export function SunMark({ phase, className = "" }: { phase: SunPhase; className?: string }) {
  const id = useId();
  const clip = `sun-${id}`;
  const sun = { arrival: { cx: 17, cy: 6 }, dawn: { cx: 7, cy: 12.5 }, morning: { cx: 9, cy: 8 }, midday: { cx: 12, cy: 4.5 }, dusk: { cx: 17, cy: 12.5 }, night: null }[phase];
  return (
    <svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true" className={`inline-block shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth="1">
      <defs>
        <clipPath id={clip}><rect x="0" y="0" width="24" height="12.5" /></clipPath>
      </defs>
      <line x1="0" y1="12.5" x2="24" y2="12.5" />
      {sun && <circle cx={sun.cx} cy={sun.cy} r="3.4" clipPath={`url(#${clip})`} />}
      {phase === "night" && <path d="M14.5 2.6a4 4 0 1 0 2.9 6.6 3.2 3.2 0 0 1-2.9-6.6z" />}
    </svg>
  );
}

/** One slow wave, drawn as a single line. The site's tide mark. */
export function TideLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 20" preserveAspectRatio="none" aria-hidden="true" className={`block h-4 w-full ${className}`} fill="none">
      <path d="M0 10 C 90 2, 180 18, 270 10 S 450 2, 540 10 S 720 18, 810 10 S 990 2, 1080 10 S 1260 18, 1350 10 S 1410 6, 1440 10" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
