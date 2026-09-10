/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#0D1013",
        card: "#171B1F",
        panel: "#1A1F24",
        border1: "#22282D",
        border2: "#262B31",
        emeraldAccent: "#2ED9A0",
        textPrimary: "#F3F5F4",
        textMuted: "#8B9490",
        warning: "#E8A33D",
        danger: "#E2574C",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
