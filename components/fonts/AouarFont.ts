// components/fonts/AouarFont.ts

import localFont from 'next/font/local';

const Aouar = localFont({
  src: [
    {
      path: '../../public/fonts/Aouar.ttf',
      weight: '400', // Adjust based on your font's available weights
      style: 'normal', // Adjust if your font has italic or other styles
    },
    // Add more font variants if available
    // {
    //   path: '../public/fonts/Aouar-Bold.ttf',
    //   weight: '700',
    //   style: 'normal',
    // },
  ],
  display: 'swap',
  variable: '--font-aouar', // CSS variable name
});

export default Aouar;
