"use client";

/* eslint-disable @next/next/no-img-element */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex-shrink-0">
      <img
        src="/logo.png"
        alt="Aitken Travels"
        className={`h-32 md:h-44 w-auto object-contain transition-all duration-300 ${
          light
            ? ""
            : "brightness-0 saturate-100 [filter:brightness(0)_saturate(100%)_invert(24%)_sepia(89%)_saturate(746%)_hue-rotate(152deg)_brightness(93%)_contrast(93%)]"
        }`}
      />
    </div>
  );
}
