import { AppPropsType } from 'next/dist/next-server/lib/utils';
import 'github-markdown-css';
import { GoogleAnalyticsScript } from '../components/google-analytics';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }: AppPropsType) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
      <GoogleAnalyticsScript />
    </>
  );
}
