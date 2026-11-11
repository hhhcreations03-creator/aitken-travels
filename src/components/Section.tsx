import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  tone?: "ivory" | "deep" | "forest" | "sand" | "lagoon" | "foam";
  id?: string;
  /** Tighter vertical rhythm for secondary sections. */
  compact?: boolean;
}

const TONES = {
  ivory: "bg-ivory text-charcoal",
  deep: "bg-ivory-deep text-charcoal",
  sand: "bg-sand text-charcoal",
  forest: "bg-forest text-ivory",
  lagoon: "bg-lagoon text-ivory",
  foam: "bg-foam text-charcoal",
};

export function Section({ children, className = "", tone = "ivory", id, compact = false }: SectionProps) {
  return (
    <section id={id} className={`${TONES[tone]} ${compact ? "py-10 sm:py-14 lg:py-20" : "py-14 sm:py-20 lg:py-28"} ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  );
}

interface HeadingProps {
  title: string;
  lead?: string;
  as?: "h1" | "h2" | "h3";
  light?: boolean;
  className?: string;
  /** Extra classes for the lead, e.g. to keep a long one off phones. */
  leadClassName?: string;
}

export function Heading({ title, lead, as: Tag = "h2", light = false, className = "", leadClassName = "" }: HeadingProps) {
  return (
    <div className={`max-w-[46rem] ${className}`}>
      <Tag className={`display-lg ${light ? "text-ivory" : "text-forest"}`}>{title}</Tag>
      {lead && <p className={`lede mt-5 ${light ? "!text-sand" : ""} ${leadClassName}`}>{lead}</p>}
    </div>
  );
}
