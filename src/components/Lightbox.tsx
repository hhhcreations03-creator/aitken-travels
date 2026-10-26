"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryImage } from "@/lib/gallery";

interface LightboxProps {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}

export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const count = images.length;

  const prev = useCallback(() => index !== null && onNavigate((index - 1 + count) % count), [index, count, onNavigate]);
  const next = useCallback(() => index !== null && onNavigate((index + 1) % count), [index, count, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose, prev, next]);

  const touchX = useRef<number | null>(null);

  return (
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${index + 1} of ${count}: ${images[index].alt}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex flex-col bg-charcoal/95 text-ivory"
          onClick={onClose}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (dx > 50) prev();
            if (dx < -50) next();
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8" onClick={(e) => e.stopPropagation()}>
            <p className="text-[13px] tabular-nums text-ivory/70">{index + 1} / {count}</p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/30 hover:bg-ivory/10"
              aria-label="Close gallery"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>

          <div className="relative flex-1 px-4 pb-4 sm:px-16" onClick={(e) => e.stopPropagation()}>
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-full w-full"
            >
              <Image
                src={images[index].src}
                alt={images[index].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 bg-charcoal/40 hover:bg-ivory/10 sm:left-5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 2L4 8l6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 bg-charcoal/40 hover:bg-ivory/10 sm:right-5"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
          </div>
          <p className="px-5 pb-5 text-center text-[13.5px] text-ivory/75 sm:px-8" onClick={(e) => e.stopPropagation()}>{images[index].alt}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
