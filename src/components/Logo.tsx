"use client";

/* eslint-disable @next/next/no-img-element */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex-shrink-0">
      <img
        src="/logo.png"
        alt="Aitken Travels"
        className={`h-40 md:h-44 w-auto object-contain transition-all duration-300 ${
          light
            ? ""
            : "brightness-0 saturate-100 [filter:brightness(0)_saturate(100%)_invert(58%)_sepia(85%)_saturate(1500%)_hue-rotate(180deg)_brightness(100%)_contrast(95%)]"
        }`}
      />
    </div>
  );
}
