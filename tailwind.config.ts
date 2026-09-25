import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        paper: "var(--paper)",
        raised: "var(--raised)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        purple: {
          DEFAULT: "var(--purple)",
          soft: "var(--purple-soft)",
          "soft-hover": "var(--purple-soft-hover)",
        },
        gold: "var(--gold)",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          "soft-hover": "var(--accent-soft-hover)",
          border: "var(--accent-border)",
        },
        tag: {
          DEFAULT: "var(--tag-bg)",
          ink: "var(--tag-ink)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
