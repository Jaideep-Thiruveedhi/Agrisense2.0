import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#0D1013", card: "#171B1F", panel: "#1A1F24",
        border1: "#22282D", emeraldAccent: "#2ED9A0",
        textPrimary: "#F3F5F4", textMuted: "#8B9490",
        warning: "#E8A33D", danger: "#E2574C"
      },
      fontFamily: { sans: ['"Plus Jakarta Sans"','sans-serif'], mono: ['"JetBrains Mono"','monospace'] }
    }
  },
  plugins: []
} satisfies Config;
