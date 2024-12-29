// pages/_app.tsx

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import BigCaslon from '@/components/fonts/AouarFont';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${BigCaslon.variable} font-BigCaslon`}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
