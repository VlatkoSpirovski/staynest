import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        mist: "#f5f7f4",
        clay: "#b8754d",
        olive: "#6f7c57",
        lagoon: "#4a8a8f"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(31, 41, 51, 0.10)",
        glow: "0 16px 50px rgba(74, 138, 143, 0.20)"
      }
    }
  },
  plugins: []
};

export default config;
