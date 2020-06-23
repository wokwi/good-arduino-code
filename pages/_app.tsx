import { AppPropsType } from 'next/dist/next-server/lib/utils';
import '../node_modules/highlight.js/styles/arduino-light.css';

export default function MyApp({ Component, pageProps }: AppPropsType) {
  return <Component {...pageProps} />;
}
