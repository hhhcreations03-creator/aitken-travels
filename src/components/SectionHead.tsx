"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionHeadProps {
  eyebrow?: string;
  title: ReactNode;
  sub?: string;
  align?: "left" | "center";
  maxWidth?: number;
}

export function SectionHead({ eyebrow, title, sub, align = "left", maxWidth = 720 }: SectionHeadProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      className={align === "center" ? "text-center mx-auto" : ""}
      style={{ maxWidth }}
    >
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-5"
          style={{ justifyContent: align === "center" ? "center" : "flex-start" }}
        >
          <span className="w-8 h-[2px] rounded-full bg-gradient-to-r from-primary-400 to-primary-600" />
          <span className="eyebrow">{eyebrow}</span>
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display font-semibold text-slate-900 leading-[1.05] text-[clamp(32px,4.5vw,60px)]"
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`text-[16px] md:text-[18px] text-slate-500 mt-5 max-w-[560px] leading-[1.65] ${align === "center" ? "mx-auto" : ""}`}
        >
          {sub}
        </motion.p>
      )}
    </motion.div>
  );
}
