export default {
  content: [
    "./apps/dapp/src/**/*.{js,jsx,ts,tsx}",
    "./apps/dapp/index.html",
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
        background: '#F7FAFC',
        text: '#2D3748',
      },
    },
  },
  plugins: [],
}