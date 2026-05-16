import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        spartan: {
          DEFAULT: "#18453B",
          green: "#18453B",
          kelly: "#008208",
          cream: "#F5F0E1",
          ink: "#0E2A24",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 24px -8px rgba(24, 69, 59, 0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
