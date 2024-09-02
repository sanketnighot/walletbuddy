/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4FD1C5',
          DEFAULT: '#38B2AC',
          dark: '#319795',
        },
        secondary: {
          light: '#9F7AEA',
          DEFAULT: '#805AD5',
          dark: '#6B46C1',
        },
        background: {
          DEFAULT: '#1A202C',
          light: '#2D3748',
        },
        text: {
          DEFAULT: '#E2E8F0',
          dark: '#A0AEC0',
        },
      },
    },
  },
  plugins: [],
}
