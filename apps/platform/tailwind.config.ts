import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e7fbf2",
          100: "#c0f1d8",
          200: "#91e6bd",
          300: "#5edba2",
          400: "#31d091",
          500: "#0fb77a",
          600: "#059164",
          700: "#036f4f",
          800: "#034f38",
          900: "#013223"
        }
      },
      boxShadow: {
        brand: "0 20px 45px -15px rgba(31, 187, 122, 0.45)"
      },
      fontFamily: {
        display: ["'Poppins'", "ui-sans-serif", "system-ui"],
        body: ["'Inter'", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
