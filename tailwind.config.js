/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDeep: "#0a0016",
        bgCard: "#18062c",
        bgCardSoft: "#220a45",
        accent: "#8b5cf6",
        accentBorder: "#5b21b6",
      },
      borderRadius: {
        big: "22px",
      },
      boxShadow: {
        card: "0 0 32px rgba(139,92,246,0.35)",
      },
    },
  },
  plugins: [],
};
