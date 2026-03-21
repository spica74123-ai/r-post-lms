import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // รองรับระบบเปลี่ยนโหมดมืด/สว่าง
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sarabun', 'sans-serif'], // ฟอนต์ราชการ
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        rta: {
          light: '#6b8e23',
          DEFAULT: '#4b5320', // เขียวขี้ม้าทหารบก
          dark: '#2e3314',
          accent: '#d4af37',  // สีทอง
        },
        army: {
          900: '#141c0e',
          800: '#1d2714',
          700: '#2b3a1d',
          600: '#3a4f27',
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
