import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        ink: "#0a0a0a",
        paper: "#fafaf9",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        /** Continuous ticker loop — the rule-1 exception: a spring has no
         * natural rest state to resolve toward for an indeterminate scroll,
         * so this stays a linear duration-based tween. */
        marquee: "marquee 24s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
