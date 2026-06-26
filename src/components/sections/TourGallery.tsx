"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  src: string;
  type: "image" | "video";
  caption: string;
  location: string;
  tag: string;
  poster?: string;
}

// Add your photos and videos to public/gallery/ and list them here
const GALLERY: GalleryItem[] = [
  { src: "/gallery/photo1.JPG", type: "image", caption: "Exploring Sri Lanka with Aitken Travels", location: "Sri Lanka", tag: "On the Road" },
  { src: "/gallery/video1.MP4", type: "video", caption: "Driving through the beauty of Sri Lanka", location: "Sri Lanka", tag: "Scenic Drive", poster: "/gallery/video1-poster.jpg" },
  { src: "/gallery/photo2.JPG", type: "image", caption: "Whale watching off the southern coast", location: "Mirissa", tag: "South Coast" },
  { src: "/gallery/photo3.JPG", type: "image", caption: "The iconic Ambuluwawa Tower surrounded by misty mountains", location: "Ambuluwawa", tag: "Hill Country" },
  { src: "/gallery/video2.MP4", type: "video", caption: "On the road — real moments from our tours", location: "Sri Lanka", tag: "Tour Life", poster: "/gallery/video2-poster.jpg" },
  { src: "/gallery/photo4.JPG", type: "image", caption: "Ambuluwawa spiral staircase with panoramic views", location: "Ambuluwawa", tag: "Hill Country" },
  { src: "/gallery/video3.MP4", type: "video", caption: "Coastal roads and ocean views", location: "South Coast", tag: "Coastal", poster: "/gallery/video3-poster.jpg" },
  { src: "/gallery/photo5.JPG", type: "image", caption: "Walking the historic ramparts of Galle Fort", location: "Galle", tag: "Heritage" },
  { src: "/gallery/video4.MP4", type: "video", caption: "Adventures captured by our drivers", location: "Sri Lanka", tag: "On the Road", poster: "/gallery/video4-poster.jpg" },
  { src: "/gallery/photo6.JPG", type: "image", caption: "Golden sands and turquoise waters at Unawatuna Beach", location: "Unawatuna", tag: "Beach" },
  { src: "/gallery/video5.MP4", type: "video", caption: "Behind the wheel across Sri Lanka", location: "Sri Lanka", tag: "Scenic Drive", poster: "/gallery/video5-poster.jpg" },
  { src: "/gallery/video6.MP4", type: "video", caption: "Every trip tells a story", location: "Sri Lanka", tag: "Tour Life", poster: "/gallery/video6-poster.jpg" },
  { src: "/gallery/photo7.JPG", type: "image", caption: "Enjoying fresh king coconuts — a Sri Lankan road trip essential", location: "Sri Lanka", tag: "On the Road" },
  { src: "/gallery/photo8.JPG", type: "image", caption: "Welcome to Sri Lanka — Aitken Travels airport pickup with orchid garlands", location: "Colombo Airport", tag: "Airport Pickup" },
];

export function TourGallery() {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");

  const filtered = filter === "all" ? GALLERY : GALLERY.filter((g) => g.type === filter);

  return (
    <section className="py-[80px] md:py-[120px] px-6 md:px-10 lg:px-16 2xl:px-24 bg-white overflow-hidden">
      <div className="content-max">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
            <span className="font-mono text-[12px] tracking-[0.16em] uppercase font-semibold text-primary-700">
              From the road
            </span>
            <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-600 to-primary-400" />
          </div>
          <h2 className="font-display font-bold text-[clamp(32px,4.5vw,52px)] leading-[1.08] text-slate-900">
            Real moments,{" "}
            <span className="gradient-text-accent">real journeys</span>
          </h2>
          <p className="text-[15px] md:text-[16px] text-slate-500 mt-3 max-w-[500px] mx-auto leading-relaxed">
            Photos and videos captured by our drivers and team during actual trips across Sri Lanka.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {(["all", "image", "video"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-300 min-h-[40px] cursor-pointer border ${
                filter === f
                  ? "bg-primary-600 border-primary-600 text-white"
                  : "bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-700"
              }`}
            >
              {f === "all" ? "All" : f === "image" ? "Photos" : "Videos"}
              <span className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                filter === f ? "bg-white/20" : "bg-slate-100"
              }`}>
                {f === "all" ? GALLERY.length : GALLERY.filter((g) => g.type === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Masonry gallery grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 2xl:columns-5 gap-3 md:gap-4 space-y-3 md:space-y-4">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
                onClick={() => setSelected(item)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer break-inside-avoid"
              >
                {item.type === "video" ? (
                  <div className="relative aspect-[9/16] bg-slate-900">
                    <video
                      src={item.src}
                      muted
                      loop
                      playsInline
                      preload="none"
                      poster={item.poster}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Play icon */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary-700)" stroke="none">
                          <polygon points="8,5 20,12 8,19" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`relative overflow-hidden ${
                    i % 5 === 0 ? "aspect-[3/4]" :
                    i % 5 === 1 ? "aspect-square" :
                    i % 5 === 2 ? "aspect-[4/5]" :
                    i % 5 === 3 ? "aspect-[4/3]" :
                    "aspect-[3/4]"
                  }`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={item.caption}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Tag */}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-primary-800 rounded-full px-2.5 py-0.5 text-[9px] md:text-[10px] font-mono tracking-[0.08em] uppercase font-semibold shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Video badge */}
                {item.type === "video" && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Video
                    </span>
                  </div>
                )}

                {/* Bottom caption — shows on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <p className="text-[13px] text-white font-medium leading-snug">{item.caption}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-white/60 font-mono">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {item.location}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="font-display text-[18px]">No items in this category yet</p>
          </div>
        )}
      </div>

      {/* ─── Lightbox Modal ─── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[1000] bg-slate-900/80 backdrop-blur-[16px] flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[900px] w-full max-h-[85vh] rounded-2xl overflow-hidden bg-black shadow-elevation-3"
            >
              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm cursor-pointer flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 14 14">
                  <path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>

              {/* Media */}
              {selected.type === "video" ? (
                <video
                  src={selected.src}
                  controls
                  playsInline
                  className="w-full max-h-[70vh] object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.src}
                  alt={selected.caption}
                  loading="lazy"
                  className="w-full max-h-[70vh] object-contain"
                />
              )}

              {/* Caption bar */}
              <div className="p-5 bg-slate-900">
                <p className="text-[15px] text-white font-medium">{selected.caption}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-[11px] text-white/50 font-mono">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {selected.location}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[11px] text-white/50 font-mono uppercase">{selected.tag}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
