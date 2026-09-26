import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["-apple-system", "BlinkMacSystemFont", '"SF Pro Display"', "var(--font-inter)", "system-ui", "sans-serif"],
        sans: ["-apple-system", "BlinkMacSystemFont", '"SF Pro Text"', "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", '"SF Mono"', "SFMono-Regular", "Menlo", "var(--font-jetbrains)", "monospace"],
      },
      // Apple-style scale: 17px body, tighter tracking as size grows.
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.33", letterSpacing: "0" }],
        sm: ["0.875rem", { lineHeight: "1.43", letterSpacing: "-0.006em" }],
        base: ["1.0625rem", { lineHeight: "1.47", letterSpacing: "-0.015em" }],
        lg: ["1.1875rem", { lineHeight: "1.42", letterSpacing: "-0.012em" }],
        xl: ["1.3125rem", { lineHeight: "1.33", letterSpacing: "-0.012em" }],
        "2xl": ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
      },
      colors: {
        paper: "var(--paper)",
        raised: "var(--raised)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        faint: "var(--faint)",
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
