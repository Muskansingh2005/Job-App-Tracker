/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4F46E5",
          secondary: "#06B6D4",
          accent: "#22C55E",
        },
        surface: {
          base: "#F8FAFC",
        },
      },
      boxShadow: {
        card: "0 10px 30px -20px rgba(15, 23, 42, 0.35)",
        soft: "0 8px 24px -16px rgba(15, 23, 42, 0.25)",
      },
    },
  },
  plugins: [],
};
