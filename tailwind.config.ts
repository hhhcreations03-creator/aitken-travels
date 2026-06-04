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
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
          950: "#042F2E",
        },
        accent: {
          DEFAULT: "#F59E0B",
          deep: "#D97706",
          warm: "#D4A853",
          orange: "#F97316",
        },
        surface: {
          DEFAULT: "#FFFBF5",
          ice: "#FFF7ED",
          glass: "rgba(255,255,255,0.6)",
          "glass-dark": "rgba(19,78,74,0.7)",
        },
        slate: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
          950: "#0C0A09",
        },
        // Legacy aliases
        emerald: { DEFAULT: "#134E4A", deep: "#042F2E", soft: "#0F766E" },
        sand: "#FFF7ED",
        ivory: "#FFFBF5",
        gold: { DEFAULT: "#F59E0B", deep: "#D97706" },
        terracotta: { DEFAULT: "#F97316", deep: "#EA580C" },
        charcoal: "#1C1917",
      },
      fontFamily: {
        display: ["var(--font-jakarta)", "Inter", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        serif: ["var(--font-jakarta)", "Georgia", "serif"],
      },
      boxShadow: {
        "elevation-1": "0 1px 3px rgba(19,78,74,0.04), 0 4px 12px rgba(19,78,74,0.06)",
        "elevation-2": "0 4px 16px rgba(19,78,74,0.08), 0 16px 48px rgba(19,78,74,0.1)",
        "elevation-3": "0 24px 80px rgba(0,0,0,0.2), 0 8px 24px rgba(19,78,74,0.15)",
        "glass-glow": "0 0 40px rgba(45,212,191,0.15)",
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
