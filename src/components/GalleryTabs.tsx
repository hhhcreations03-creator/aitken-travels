"use client";

import { useState } from "react";
import { GalleryGrid } from "./GalleryGrid";
import type { GalleryCategory } from "@/lib/gallery";

export function GalleryTabs({ categories }: { categories: GalleryCategory[] }) {
  const [active, setActive] = useState(0);
  const current = categories[active];

  return (
    <div>
      <div role="tablist" aria-label="Gallery categories" className="rule flex flex-wrap gap-x-6 gap-y-2 pt-4">
        {categories.map((c, i) => (
          <button
            key={c.slug}
            role="tab"
            id={`tab-${c.slug}`}
            aria-selected={active === i}
            aria-controls={`panel-${c.slug}`}
            onClick={() => setActive(i)}
            className={`relative py-2 text-[14.5px] transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-forest after:transition-transform ${active === i ? "text-forest after:scale-x-100" : "text-charcoal-mute hover:text-charcoal after:scale-x-0"}`}
          >
            {c.label} <span className="text-charcoal-mute tabular-nums">{c.images.length}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${current.slug}`} aria-labelledby={`tab-${current.slug}`} className="mt-8">
        <GalleryGrid key={current.slug} images={current.images} />
      </div>
    </div>
  );
}
