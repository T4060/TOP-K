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
        /** cmdline's palette — scoped to the /learn product, kept separate
         * from TOP-K's ink/paper two-tone. A dark, jewel-toned "quiet
         * luxury" system: brass/gold as the primary accent, deep emerald
         * and burgundy as secondary accents, on near-black surfaces —
         * deliberately not the bright green-on-white gamification look
         * competitors default to. Token *names* stay from the earlier
         * pass (duo.green is the primary accent, etc.) so component
         * classNames didn't need touching — only the values changed. */
        duo: {
          green: "#C9A24B",
          "green-dark": "#A17F38",
          blue: "#1F5C48",
          "blue-dark": "#123B2E",
          gold: "#E4C275",
          "gold-dark": "#B89347",
          red: "#7A3B3B",
          "red-dark": "#5A2929",
          purple: "#4E3B63",
          "purple-dark": "#382A48",
          ink: "#F1EAD9",
          bg: "#0B0B0C",
          surface: "#161514",
          track: "#2C2823",
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
