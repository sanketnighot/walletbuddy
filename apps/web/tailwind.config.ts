import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "tg-bg": "var(--tg-theme-bg-color)",
        "tg-text": "var(--tg-theme-text-color)",
        "tg-hint": "var(--tg-theme-hint-color)",
        "tg-link": "var(--tg-theme-link-color)",
        "tg-button": "var(--tg-theme-button-color)",
        "tg-button-text": "var(--tg-theme-button-text-color)",
        "tg-secondary-bg": "var(--tg-theme-secondary-bg-color)",
        "tg-header-bg": "var(--tg-theme-header-bg-color)",
        "tg-accent-text": "var(--tg-theme-accent-text-color)",
        "tg-section-bg": "var(--tg-theme-section-bg-color)",
        "tg-section-header-text": "var(--tg-theme-section-header-text-color)",
        "tg-section-separator": "var(--tg-theme-section-separator-color)",
        "tg-subtitle-text": "var(--tg-theme-subtitle-text-color)",
        "tg-destructive-text": "var(--tg-theme-destructive-text-color)",
      },
    },
  },
  plugins: [],
}
export default config
