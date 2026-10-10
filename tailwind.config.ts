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
          DEFAULT: "#FAF9F6", // Off-white elegante
          dark: "#F0EBE1"
        },
        forest: {
          DEFAULT: "#1A3626", // Verde oscuro premium
          light: "#2E5C43"
        },
        cheese: {
          DEFAULT: "#F2A900", // Amarillo oro cálido
          light: "#FFC72C"
        },
        terracotta: {
          DEFAULT: "#C0503D", // Rojo tierra apagado
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;