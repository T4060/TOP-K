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
        "duo-display": ["var(--font-duo-display)", "sans-serif"],
        "duo-body": ["var(--font-duo-body)", "sans-serif"],
      },
      colors: {
        ink: "#0a0a0a",
        paper: "#fafaf9",
        /** cmdline's Duolingo-style palette — scoped to the /learn product,
         * kept separate from TOP-K's ink/paper two-tone (rule 4 exception,
         * see app/learn/layout.tsx). */
        duo: {
          green: "#58CC02",
          "green-dark": "#46A302",
          blue: "#1CB0F6",
          "blue-dark": "#1899D6",
          gold: "#FFC800",
          "gold-dark": "#E6B400",
          red: "#FF4B4B",
          "red-dark": "#EA2B2B",
          purple: "#CE82FF",
          "purple-dark": "#A568CC",
          ink: "#3C3C3C",
          bg: "#FFFFFF",
          track: "#E5E5E5",
        },
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
