import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4CAF50",
          50: "#F1F8F4",
          100: "#DFF0E3",
          200: "#BCE1C4",
          300: "#90CE9C",
          400: "#63BA73",
          500: "#4CAF50",
          600: "#3F9844",
          700: "#2E7D32",
          800: "#1F5A22",
          900: "#143B16"
        },
        foreground: "#1F2421",
        accent: "#2E7D32",
        surface: "#F5F5F5",
        muted: {
          DEFAULT: "#E6EFE8",
          foreground: "#4B6251"
        },
        sunshine: "#FFD54F"
      },
      boxShadow: {
        brand: "0 20px 45px -15px rgba(31, 187, 122, 0.45)"
      },
      fontFamily: {
        sans: ["'Inter'", "Helvetica", "Arial", "sans-serif"],
        display: ["'Poppins'", "Helvetica", "Arial", "sans-serif"]
      }
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
