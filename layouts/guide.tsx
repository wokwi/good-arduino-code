import Head from 'next/head';
import { Header } from '../components/header';
import { ILayoutProps } from './layout';
import styles from './guide.module.css';
import { MDXProvider } from '@mdx-js/react';
import { CodeElement } from '../components/code-element';
import { GlobalStyles } from '../components/global-styles';
import classnames from 'classnames';

export default function GuidesPage({ children, frontMatter }: ILayoutProps) {
  // React hooks, for example `useState` or `useEffect`, go here.
  return (
    <MDXProvider components={{ code: CodeElement }}>
      <Head>
        <title>{frontMatter.title}</title>
      </Head>
      <GlobalStyles />
      <Header />
      <article className={classnames(styles.guide, 'markdown-body')}>
        <h1>{frontMatter.title}</h1>
        {children}
      </article>
    </MDXProvider>
  );
}
