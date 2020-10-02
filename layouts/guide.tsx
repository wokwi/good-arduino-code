import { GuidesThumbnail } from '@/components/guides-thumbnail';
import { MDXProvider } from '@mdx-js/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AutolinkedHeading } from '../components/autolinked-heading';
import { CodeElement } from '../components/code-element';
import { GlobalStyles } from '../components/global-styles';
import { Header } from '../components/header';
import { PreElement } from '../components/pre-element';
import { SharingButtons } from '../components/sharing-buttons';
import styles from './guide.module.css';
import { ILayoutProps } from './layout';

/* eslint-disable react/display-name */

export default function GuidesPage({ children, frontMatter }: ILayoutProps) {
  const router = useRouter();

  if (router.query.thumb) {
    return <GuidesThumbnail frontMatter={frontMatter} />;
  }

  const ogImage =
    frontMatter.ogImage ??
    `https://thumbs.wokwi.com/api/render.png?service=goodarduinocode&path=/${router.pathname}?thumb=1`;

  return (
    <MDXProvider
      components={{
        pre: PreElement,
        code: CodeElement,
        h1: (props) => <AutolinkedHeading size="h1" {...props} />,
        h2: (props) => <AutolinkedHeading size="h2" {...props} />,
        h3: (props) => <AutolinkedHeading size="h3" {...props} />,
        h4: (props) => <AutolinkedHeading size="h4" {...props} />,
        h5: (props) => <AutolinkedHeading size="h5" {...props} />,
        h6: (props) => <AutolinkedHeading size="h6" {...props} />,
      }}
    >
      <Head>
        <title>{frontMatter.title}</title>
        <meta name="description" content={frontMatter.description || ''} />
        <meta property="og:site_name" content="Good Arduino Code" />
        <meta property="og:title" content={frontMatter.title} />
        <meta property="og:description" content={frontMatter.description || ''} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="article:publisher" content="https://www.facebook.com/Wokwi" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@WokwiMakes" />
      </Head>
      <GlobalStyles />
      <Header />
      <article className={styles.guide}>
        <h1>{frontMatter.title}</h1>
        <SharingButtons />
        {children}
        <SharingButtons />
      </article>
    </MDXProvider>
  );
}
