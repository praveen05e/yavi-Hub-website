import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "var(--ivory)",
        cream: "var(--cream)",
        charcoal: "var(--charcoal)",
        "near-black": "var(--near-black)",
        bronze: "var(--bronze)",
        beige: "var(--beige)",
        wood: "var(--wood)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      letterSpacing: {
        widest2: "0.22em",
      },
    },
  },
  plugins: [],
};
export default config;
