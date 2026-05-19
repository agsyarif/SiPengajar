import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#E1F5EE",
          100: "#9FE1CB",
          200: "#5DCAA5",
          400: "#1D9E75",
          600: "#0F6E56",
          800: "#085041",
          900: "#04342C",
        },
        stone: {
          50: "#F7F7F5",
          100: "#EFEEEA",
          200: "#E8E8E4",
          300: "#D0D0CA",
          400: "#A8A8A2",
          500: "#888780",
          600: "#5F5E5A",
          700: "#444441",
          800: "#2C2C2A",
          900: "#1A1A1A",
        },
        violet: {
          50: "#EEEDFE",
          100: "#CECBF6",
          200: "#AFA9EC",
          400: "#7F77DD",
          600: "#534AB7",
          800: "#3C3489",
          900: "#26215C",
        },
        success: {
          bg: "#E1F5EE",
          text: "#085041",
          bold: "#0F6E56",
        },
        warning: {
          bg: "#FAEEDA",
          text: "#633806",
          bold: "#BA7517",
        },
        danger: {
          bg: "#FCEBEB",
          text: "#791F1F",
          bold: "#E24B4A",
        },
        info: {
          bg: "#E6F1FB",
          text: "#0C447C",
          bold: "#185FA5",
        },
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        sans: ["Geist", "DM Sans", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "20px" }],
        base: ["15px", { lineHeight: "24px" }],
        lg: ["17px", { lineHeight: "26px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "38px" }],
        "4xl": ["38px", { lineHeight: "46px" }],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "10px",
        xl: "14px",
        "2xl": "18px",
      },
      borderWidth: {
        DEFAULT: "0.5px",
        1: "1px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.26, 0.64, 1)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "120ms",
        normal: "180ms",
        slow: "300ms",
      },
      animation: {
        "fade-up": "fadeUp 0.35s cubic-bezier(0.34,1.2,0.64,1) both",
        "fade-in": "fadeIn 0.25s ease both",
        shimmer: "shimmer 1.5s infinite",
        "pulse-dot": "pulseDot 1.8s ease-in-out infinite",
        "pop-in": "popIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        pulseDot: {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.7)" },
        },
        popIn: {
          from: { opacity: "0", transform: "scale(0.6)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
        lift: "0 4px 16px rgba(15,110,86,0.10), 0 1px 4px rgba(0,0,0,0.04)",
        focus: "0 0 0 3px rgba(15,110,86,0.15)",
        modal: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
