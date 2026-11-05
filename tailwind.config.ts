import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        alabaster: "#FAF7F2",
        oat: "#F4EFEA",
        "oat-hover": "#EDE6DF",
        espresso: "#2C2523",
        "espresso-light": "#423835",
        taupe: "#7A6F68",
        "taupe-light": "#A89F98",
        "dusty-rose": "#D8A796",
        "dusty-rose-light": "#F2DCD4",
        "dusty-rose-dark": "#BA8675",
        sage: "#9CAF9E",
        "sage-light": "#DFE8E0",
        "sage-dark": "#7B927E",
        butter: "#F3E5AB",
        "butter-light": "#FDF8E8",
        terracotta: "#C87D65",
        warmcard: "#FFFDF9",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Instrument Serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "-apple-system", "sans-serif"],
        handwriting: ["Caveat", "Dancing Script", "cursive"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(44, 37, 35, 0.06)",
        polaroid: "0 10px 25px -5px rgba(44, 37, 35, 0.1), 0 8px 10px -6px rgba(44, 37, 35, 0.05)",
        "polaroid-hover": "0 20px 35px -5px rgba(44, 37, 35, 0.15), 0 10px 15px -5px rgba(44, 37, 35, 0.08)",
        floating: "0 14px 40px rgba(44, 37, 35, 0.12)",
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        "float-gentle": "floatGentle 4s ease-in-out infinite",
        "flicker": "flicker 1.8s ease-in-out infinite alternate",
        "sway": "sway 3s ease-in-out infinite alternate",
      },
      keyframes: {
        floatGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        flicker: {
          "0%, 100%": { transform: "scale(1) rotate(-1deg)", opacity: "0.95" },
          "25%": { transform: "scale(1.08, 0.95) rotate(1deg)", opacity: "1" },
          "50%": { transform: "scale(0.96, 1.05) rotate(-2deg)", opacity: "0.85" },
          "75%": { transform: "scale(1.05, 0.98) rotate(2deg)", opacity: "0.98" },
        },
        sway: {
          "0%": { transform: "rotate(-1.5deg)" },
          "100%": { transform: "rotate(1.5deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
