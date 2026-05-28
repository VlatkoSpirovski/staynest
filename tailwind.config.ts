import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./themes/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mist: "#fafafa",
        ivory: "#fafafa",
        surface: "#ffffff",
        clay: "#6b7280",
        olive: "#76875d",
        lagoon: "#5f9d99",
        navy: {
          DEFAULT: "#111827",
          deep: "#162033"
        },
        teal: {
          DEFAULT: "#5f9d99",
          soft: "#b7dad5"
        }
      },
      borderRadius: {
        luxury: "24px",
        "luxury-inner": "18px",
        "luxury-control": "16px"
      },
      boxShadow: {
        soft: "0 24px 72px rgba(17, 24, 39, 0.12)",
        card: "0 22px 62px rgba(17, 24, 39, 0.085)",
        nav: "0 24px 82px rgba(17, 24, 39, 0.18)",
        glow: "0 16px 50px rgba(95, 157, 153, 0.22)",
        button: "0 18px 50px rgba(17, 24, 39, 0.26)",
        hero: "0 34px 110px rgba(17, 24, 39, 0.30)"
      }
    }
  },
  plugins: []
};

export default config;
