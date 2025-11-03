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
          DEFAULT: "#3CA86A",
          50: "#F5F8F2",
          100: "#E5F2E8",
          200: "#CAE5D4",
          300: "#A1D5B8",
          400: "#72C498",
          500: "#3CA86A",
          600: "#2F8C55",
          700: "#226C41",
          800: "#1E5130",
          900: "#163923"
        },
        foreground: "#1A1F1C",
        accent: "#1E5130",
        surface: "#F5F8F2",
        muted: {
          DEFAULT: "#E7EFE6",
          foreground: "#3A5141"
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
  plugins: [tailwindcssAnimate]
};

export default config;
