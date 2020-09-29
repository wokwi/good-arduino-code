import { MDXProvider } from '@mdx-js/react';
import Head from 'next/head';
import { CodeElement } from '../components/code-element';
import { GlobalStyles } from '../components/global-styles';
import { Header } from '../components/header';
import { SharingButtons } from '../components/sharing-buttons';
import styles from './guide.module.css';
import { ILayoutProps } from './layout';

export default function GuidesPage({ children, frontMatter }: ILayoutProps) {
  return (
    <MDXProvider components={{ code: CodeElement }}>
      <Head>
        <title>{frontMatter.title}</title>
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
