import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import Highlight from 'react-highlight';
import ReactMarkdown from 'react-markdown/with-html';
import { GlobalStyles } from '../../components/global-styles';
import { Header } from '../../components/header';
import {
  getProject,
  getProjectCode,
  getProjects,
  getProjectText,
  IProjectSourceFile,
} from '../../services/projects';
import { projectFileURL } from '../../services/urls';

interface ProjectPageParams extends ParsedUrlQuery {
  id: string;
}

interface ProjectPageProps {
  id: string;
  name: string;
  author?: string;
  description?: string;
  code: IProjectSourceFile[];
  text: string;
}

const transformImageUri = (projectId: string) => (uri: string) => projectFileURL(projectId, uri);

function fixImageUrls(id: string, markdown: string) {
  return markdown.replace(
    /src=["']([^"'>]+)['"]/g,
    (_, path) => `src="${projectFileURL(id, path)}"`,
  );
}

export default function ProjectPage(props: ProjectPageProps) {
  const metaDescription = props.author
    ? `${props.description} by ${props.author}`
    : props.description || '';
  return (
    <div className="container">
      <Head>
        <title>{props.name} - Good Arduino Code</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={`${props.name} - Good Arduino Code`} />
        <meta
          property="og:description"
          content={`Complete source code, schematics, and more. ${metaDescription}`}
        />
        <meta
          property="og:image"
          content={`https://goodarduinocode.com/api/social-image/${props.id}.png?v=2`}
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>

      <Header />
      <article>
        <header>
          <h1>{props.name}</h1>
        </header>
        <section className="markdown-body">
          <ReactMarkdown
            escapeHtml={false}
            source={fixImageUrls(props.id, props.text)}
            transformImageUri={transformImageUri(props.id)}
            linkTarget="_blank"
          />
        </section>
        {props.code.map((file) => (
          <section key={file.name}>
            <h2>{file.name}</h2>
            <Highlight>{file.code}</Highlight>
          </section>
        ))}
      </article>
      <GlobalStyles />
      <style jsx>{`
        article {
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        header,
        section {
          width: 700px;
          max-width: 100vw;
        }
      `}</style>
      <style jsx global>{`
        .markdown-body figure {
          text-align: center;
        }

        .markdown-body img {
          max-width: 100vw;
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
      author: project.author,
      description: project.description,
      text: await getProjectText(params.id),
      code: await getProjectCode(params.id),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getProjects()).map((path) => `/projects/${path}`),
  fallback: false,
});
