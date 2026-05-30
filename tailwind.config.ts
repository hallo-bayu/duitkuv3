import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        domi: {
          bg: "#EEF4FF",
          blue: "#6C63FF",
          "blue-light": "#4E87F5",
          green: "#10C98F",
          card: "#FFFFFF",
          text: "#1a1a2e",
          muted: "#8892AA",
          border: "#E8EEFF",
        },
      },
      animation: {
        "fade-up":    "fadeUp 0.3s ease-out",
        "fade-in":    "fadeIn 0.2s ease-out",
        "bounce-in":  "bounceIn 0.4s cubic-bezier(0.36,0.07,0.19,0.97)",
        "slide-up":   "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeUp:   { "0%": { opacity:"0", transform:"translateY(12px)" }, "100%": { opacity:"1", transform:"translateY(0)" } },
        fadeIn:   { "0%": { opacity:"0" }, "100%": { opacity:"1" } },
        bounceIn: { "0%": { opacity:"0", transform:"scale(0.85)" }, "60%": { transform:"scale(1.04)" }, "100%": { opacity:"1", transform:"scale(1)" } },
        slideUp:  { "0%": { transform:"translateY(100%)", opacity:"0" }, "100%": { transform:"translateY(0)", opacity:"1" } },
      },
    },
  },
  plugins: [],
};
export default config;
