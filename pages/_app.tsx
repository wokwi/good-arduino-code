import { AppPropsType } from 'next/dist/next-server/lib/utils';
import '../node_modules/highlight.js/styles/arduino-light.css';
import { GoogleAnalyticsScript } from '../components/google-analytics';

export default function MyApp({ Component, pageProps }: AppPropsType) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalyticsScript />
    </>
  );
}
