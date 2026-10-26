import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: "#F5F1E8", deep: "#EDE7DA" },
        sand: { DEFAULT: "#E3D8C3", deep: "#C9B995" },
        olive: { DEFAULT: "#7C8160", deep: "#5F6447" },
        forest: { DEFAULT: "#1E3A2F", deep: "#13261F" },
        charcoal: { DEFAULT: "#2A2A28", soft: "#5C5B55", mute: "#8B8A82" },
        whatsapp: "#1F9D55",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: { site: "1440px" },
      letterSpacing: { snug: "-0.015em" },
      transitionTimingFunction: { out: "cubic-bezier(0.22, 1, 0.36, 1)" },
      keyframes: {
        rise: { from: { opacity: "0", transform: "translateY(14px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fade: { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: {
        rise: "rise 1s cubic-bezier(0.22, 1, 0.36, 1) both",
        fade: "fade 1.4s ease both",
      },
    },
  },
  plugins: [],
};
export default config;
