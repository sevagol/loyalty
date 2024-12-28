// pages/_app.tsx (or .js)
import type { AppProps } from 'next/app';
import '@/styles/globals.css'; // path to your global CSS

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
