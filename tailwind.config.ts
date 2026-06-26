import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EFF8FF",
          100: "#DBEFFE",
          200: "#BFE3FE",
          300: "#93D3FD",
          400: "#15B0F8",
          500: "#0E9DE5",
          600: "#0B7EC4",
          700: "#0A659F",
          800: "#0D5583",
          900: "#10476D",
          950: "#0A2D49",
        },
        accent: {
          DEFAULT: "#15B0F8",
          deep: "#0B7EC4",
          warm: "#F59E0B",
          orange: "#F97316",
        },
        surface: {
          DEFAULT: "#F8FBFF",
          ice: "#EFF8FF",
          glass: "rgba(255,255,255,0.6)",
          "glass-dark": "rgba(10,45,73,0.7)",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        // Legacy aliases
        emerald: { DEFAULT: "#10476D", deep: "#0A2D49", soft: "#0A659F" },
        sand: "#EFF8FF",
        ivory: "#F8FBFF",
        gold: { DEFAULT: "#15B0F8", deep: "#0B7EC4" },
        terracotta: { DEFAULT: "#F97316", deep: "#EA580C" },
        charcoal: "#0F172A",
      },
      fontFamily: {
        display: ["var(--font-batangas)", "Inter", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        serif: ["var(--font-batangas)", "Georgia", "serif"],
      },
      boxShadow: {
        "elevation-1": "0 1px 3px rgba(10,45,73,0.04), 0 4px 12px rgba(10,45,73,0.06)",
        "elevation-2": "0 4px 16px rgba(10,45,73,0.08), 0 16px 48px rgba(10,45,73,0.1)",
        "elevation-3": "0 24px 80px rgba(0,0,0,0.2), 0 8px 24px rgba(10,45,73,0.15)",
        "glass-glow": "0 0 40px rgba(21,176,248,0.15)",
        "glass-subtle": "0 8px 32px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "blur-in": {
          from: { opacity: "0", filter: "blur(8px)" },
          to: { opacity: "1", filter: "blur(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-33.333%)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.33, 1, 0.68, 1) both",
        "fade-in": "fade-in 0.5s ease both",
        "slide-up": "slide-up 0.6s cubic-bezier(0.33, 1, 0.68, 1) both",
        "scale-in": "scale-in 0.4s cubic-bezier(0.33, 1, 0.68, 1) both",
        "blur-in": "blur-in 0.5s ease both",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite linear",
        kenburns: "kenburns 16s ease-out forwards",
        marquee: "marquee 40s linear infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
      },
    },
  },
  plugins: [],
};
export default config;
