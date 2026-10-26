"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";
import type { GalleryImage } from "@/lib/gallery";

interface Props {
  images: GalleryImage[];
  /** Layout: editorial (varied spans) or uniform. */
  variant?: "editorial" | "uniform";
  columnsClass?: string;
}

const SPANS = ["lg:col-span-7 lg:row-span-2", "lg:col-span-5", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4"];

export function GalleryGrid({ images, variant = "editorial", columnsClass }: Props) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <ul
        className={
          variant === "editorial"
            ? "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12"
            : `grid grid-cols-2 gap-3 sm:gap-4 ${columnsClass ?? "md:grid-cols-3"}`
        }
      >
        {images.map((img, i) => (
          <li key={img.src} className={variant === "editorial" ? SPANS[i % SPANS.length] : ""}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="img-frame group block h-full w-full aspect-[4/3] focus-visible:outline-offset-[-3px]"
              aria-label={`Open image: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                loading={i < 2 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 40vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={active} onClose={() => setActive(null)} onNavigate={setActive} />
    </>
  );
}
