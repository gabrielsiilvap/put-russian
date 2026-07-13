/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        surface: "var(--surface)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: "var(--accent)",
        "accent-tint": "var(--accent-tint)",
        gold: "var(--gold)",
        "gold-tint": "var(--gold-tint)",
        good: "var(--good)",
        "good-tint": "var(--good-tint)",
        bad: "var(--bad)",
        "bad-tint": "var(--bad-tint)",
      },
      fontFamily: {
        display: ["'PT Serif'", "Georgia", "serif"],
        ui: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
      transitionTimingFunction: {
        "out-strong": "cubic-bezier(0.23, 1, 0.32, 1)",
        "in-out-strong": "cubic-bezier(0.77, 0, 0.175, 1)",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 200ms cubic-bezier(0.23,1,0.32,1) both",
      },
    },
  },
  plugins: [],
};
