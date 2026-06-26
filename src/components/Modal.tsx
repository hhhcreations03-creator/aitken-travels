"use client";

import { useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number;
}

export function Modal({ open, onClose, children, width = 1100 }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      // Delay restoring scroll to avoid conflict when transitioning between modals
      const timer = setTimeout(() => {
        // Only restore if no other modal is open
        if (!document.querySelector("[data-modal-open]")) {
          document.body.style.overflow = "";
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    return () => {
      // Only restore on unmount if no other modal is open
      setTimeout(() => {
        if (!document.querySelector("[data-modal-open]")) {
          document.body.style.overflow = "";
        }
      }, 100);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          data-modal-open
          className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-[12px] flex items-center justify-center p-4 md:p-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-auto relative shadow-elevation-3 overscroll-contain"
            style={{ width: "100%", maxWidth: width, maxHeight: "90dvh" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 rounded-full glass-card-strong cursor-pointer flex items-center justify-center hover:scale-110 transition-transform duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 14 14">
                <path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
