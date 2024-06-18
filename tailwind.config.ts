import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'custom': '2fr 2fr 2fr 2fr 2fr 2fr 2fr 2fr 2fr',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    screens: {
      'sm': '640px',   // Changed to px
      'md': '768px',
      'lg': '1024px',  // Changed to px
      'xl': '1280px',
      '2xl': '1536px', // Changed to px
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
export default config;
