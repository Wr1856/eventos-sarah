import type { Config } from "tailwindcss";
import scrollbar from "tailwind-scrollbar";
import tailwindCssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    scrollbar({ nocompatible: true, preferredStrategy: "pseudoelements" }),
    tailwindCssAnimate,
  ],
};
export default config;
