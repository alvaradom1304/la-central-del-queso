import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F7F4EC",
          dark: "#EAE3D2",
        },
        forest: {
          DEFAULT: "#0F1E16",
          light: "#1F3B2C",
        },
        cheese: {
          DEFAULT: "#DDA13E",
          light: "#F0BA5C",
        },
        terracotta: {
          DEFAULT: "#B85634",
          dark: "#944023",
        },
        guanacaste: {
          DEFAULT: "#1B130D",
          warm: "#2A1D14",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.75rem", { lineHeight: "1.1rem", letterSpacing: "0.02em" }],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(15, 30, 22, 0.06)",
        editorial: "0 24px 54px -16px rgba(0, 0, 0, 0.45)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;