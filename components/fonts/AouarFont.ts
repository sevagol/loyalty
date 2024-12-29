// components/fonts/AouarFont.ts

import localFont from 'next/font/local';

const BigCaslon = localFont({
  src: [
    {
      path: '../../public/fonts/BigCaslon.otf',
      weight: '600', // Adjust based on your font's available weights
      style: 'bold', // Adjust if your font has italic or other styles
    },
    // Add more font variants if available
    // {
    //   path: '../public/fonts/BigCaslon-Bold.ttf',
    //   weight: '700',
    //   style: 'normal',
    // },
  ],
  display: 'swap',
  variable: '--font-BigCaslon', // CSS variable name
});

export default BigCaslon;
