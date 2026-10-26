import Image from "next/image";
import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  intro?: string;
  image: { src: string; alt: string };
  /** Short label shown above the title, e.g. the section name. */
  kicker?: string;
  children?: ReactNode;
  /** Full-height treatment for the homepage. */
  tall?: boolean;
  priority?: boolean;
}

export function PageHero({ title, intro, image, kicker, children, tall = false, priority = true }: PageHeroProps) {
  return (
    <section className={`relative flex items-end overflow-hidden bg-forest text-ivory ${tall ? "min-h-[100svh]" : "min-h-[62svh] lg:min-h-[70svh]"}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover animate-fade"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/25 to-forest-deep/10" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-forest-deep/55 to-transparent" aria-hidden="true" />
      <div className="wrap relative pb-14 pt-40 lg:pb-20">
        <div className="max-w-[56rem] animate-rise">
          {kicker && <p className="mb-4 font-display text-[1.1rem] italic text-sand">{kicker}</p>}
          <h1 className={tall ? "display-xl" : "display-lg"}>{title}</h1>
          {intro && <p className="lede mt-6 max-w-[42ch] !text-ivory/85">{intro}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}
