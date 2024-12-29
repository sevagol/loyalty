// pages/_app.tsx

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Aouar from '@/components/fonts/AouarFont';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${Aouar.variable} font-aouar`}>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
