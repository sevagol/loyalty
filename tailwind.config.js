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
      animation: {
        'pulse-custom': 'pulseCustom 2s infinite',
      },
      keyframes: {
        pulseCustom: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.1)', opacity: '0.7' },
        },
      },
    
      fontFamily: {
        BigCaslon: ['BigCaslon', 'sans-serif'],
        aouar: ['Aouar', 'sans-serif'], 
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
