import Link from "next/link";

interface LogoProps {
  /** Light variant for use on dark or photographic backgrounds. */
  light?: boolean;
  /** Hide the wordmark and show only the monogram. */
  markOnly?: boolean;
  className?: string;
}

export function LogoMark({ className = "h-9 w-9", light = false }: { className?: string; light?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke={light ? "#F5F1E8" : "#1E3A2F"}
      strokeWidth="2.2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M11 27 L32 11 L53 27" />
      <path d="M19 30 V53 H33" />
      <path d="M33 30 V53 M45 30 V53 M33 41.5 H45" />
    </svg>
  );
}

export function Logo({ light = false, markOnly = false, className = "" }: LogoProps) {
  return (
    <Link href="/" aria-label="The Lavish Haven, home" className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark light={light} className="h-10 w-10 shrink-0" />
      {!markOnly && (
        <span className="flex flex-col leading-none">
          <span className={`font-display text-[22px] tracking-[0.02em] ${light ? "text-ivory" : "text-forest"}`}>
            The Lavish Haven
          </span>
          <span className={`mt-1 text-[9.5px] tracking-[0.24em] ${light ? "text-sand-deep" : "text-olive"}`}>
            AHANGAMA, SRI LANKA
          </span>
        </span>
      )}
    </Link>
  );
}
