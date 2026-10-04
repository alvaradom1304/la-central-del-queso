import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFFDD0",
        foliage: "#4CAF50",
        terracotta: "#E2725B",
      },
    },
  },
  plugins: [],
};
export default config;