"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingCTAProps {
  onOpenBooking: () => void;
}

export function FloatingCTA({ onOpenBooking }: FloatingCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={onOpenBooking}
            className="px-6 py-3.5 rounded-full glass-card-dark text-white border-white/10 cursor-pointer text-[13px] font-medium flex items-center gap-2.5 hover:scale-105 transition-transform duration-200 shadow-elevation-2 animate-float min-h-[48px]"
          >
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            Book a ride
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
