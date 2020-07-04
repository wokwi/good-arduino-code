import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import Highlight from 'react-highlight';
import { GlobalStyles } from '../../components/global-styles';
import { Header } from '../../components/header';
import {
  getProject,
  getProjectCode,
  getProjects,
  IProjectSourceFile,
  getProjectText,
} from '../../services/projects';
import ReactMarkdown from 'react-markdown/with-html';

interface ProjectPageParams extends ParsedUrlQuery {
  id: string;
}

interface ProjectPageProps {
  id: string;
  name: string;
  code: IProjectSourceFile[];
  text: string;
}

export default function ProjectPage(props: ProjectPageProps) {
  return (
    <div className="container">
      <Head>
        <title>{props.name} - Good Arduino Code</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main>
        <h1>{props.name}</h1>
        <ReactMarkdown escapeHtml={false} source={props.text} />
        {props.code.map((file) => (
          <section key={file.name}>
            <h2>{file.name}</h2>
            <Highlight>{file.code}</Highlight>
          </section>
        ))}
      </main>
      <GlobalStyles />
      <style jsx>{`
        figure {
          text-align: center;
        }

        main {
          padding: 8px;
        }
      `}</style>
    </div>
  );
}

export const getStaticProps: GetStaticProps<ProjectPageProps, ProjectPageParams> = async ({
  params,
}) => {
  if (!params) {
    throw new Error('Missing post id');
  }
  const project = await getProject(params.id);
  return {
    props: {
      id: params.id,
      name: project.name,
      text: await getProjectText(params.id),
      code: await getProjectCode(params.id),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getProjects()).map((path) => `/projects/${path}`),
  fallback: false,
});
