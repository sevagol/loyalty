// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // Add other paths if necessary
  ],
  theme: {
    extend: {
      fontFamily: {
        aouar: ['Aouar', 'sans-serif'], // Define 'aouar' font family
      },
      colors: {
        customGray: '#d7d7d7',
        loyaltyCircleBg: '#b0aa9a',
        plusIconColor: '#2c2a26',
        refreshButtonBg: '#847f73',
        // Add any other custom colors if needed
      },
    },
  },
  plugins: [],
};
