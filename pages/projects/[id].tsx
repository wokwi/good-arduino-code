import { mdiDownload, mdiGithub } from '@mdi/js';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import { AnnotatedSource } from '../../components/annotated-source';
import { GlobalStyles } from '../../components/global-styles';
import { Header } from '../../components/header';
import { LinkIconButton } from '../../components/link-icon-button';
import { ISideNavLink, SideNav } from '../../components/side-nav';
import { reportEvent } from '../../services/analytics';
import { extractCodeAnnotations, IGACAnnotation } from '../../services/gac-annotations';
import {
  getProject,
  getProjectCode,
  getProjects,
  getProjectText,
  IProjectSourceFile,
} from '../../services/projects';
import { projectFileURL, projectImageUrl } from '../../services/urls';
import { HeadingRenderer } from '../../utils/heading-renderer';
import { headingToId } from '../../utils/heading-to-id';
import { extractHeadings } from '../../utils/markdown-utils';
import { SharingButtons } from '../../components/sharing-buttons';
import { isProduction } from '../../services/environment';

interface ProjectPageParams extends ParsedUrlQuery {
  id: string;
}

interface IAnnotatedSourceFile extends IProjectSourceFile {
  annotations: IGACAnnotation[];
}

interface ProjectPageProps {
  id: string;
  name: string;
  lastModified: number;
  author?: string;
  description?: string;
  simulation: string | null;
  code: IAnnotatedSourceFile[];
  text: string;
}

const transformImageUri = (projectId: string) => (uri: string) => projectFileURL(projectId, uri);

function fileNameToId(filename: string) {
  return `source-${filename.toLowerCase().replace(/\W/g, '_')}`;
}

function fixImageUrls(id: string, markdown: string) {
  return markdown.replace(
    /src=["']([^"'>]+)['"]/g,
    (_, path) => `src="${projectImageUrl(id, path, { maxWidth: 700 })}"`,
  );
}

function getSectionLinks(props: ProjectPageProps) {
  return [
    { id: 'start', name: props.name, indent: 0 },
    ...extractHeadings(props.text).map(({ text, level }) => ({
      id: headingToId(text),
      name: text,
      indent: level - 2,
    })),
    { id: 'source-code', name: 'Source code', indent: 0 },
    ...props.code.map(({ name }) => ({ id: fileNameToId(name), name, indent: 1 })),
    ...(props.simulation ? [{ id: 'simulation', name: 'Simulation', indent: 0 }] : []),
  ] as ISideNavLink[];
}

export function ProjectPage(props: ProjectPageProps) {
  const metaDescription = props.author
    ? `${props.description} by ${props.author}`
    : props.description || '';
  return (
    <div className="container">
      <Head>
        <title>{props.name} - Good Arduino Code</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={`${props.name} - Good Arduino Code`} />
        <meta
          property="og:description"
          content={`Complete source code, schematics, and more. ${metaDescription}`}
        />
        <meta
          property="og:image"
          content={`https://thumbs.wokwi.com/api/render.png?service=goodarduinocode&path=/projects/${props.id}/social-preview?ts=${props.lastModified}`}
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@WokwiMakes" />
      </Head>

      <Header />

      <div className="page-layout">
        <nav>
          <div className="nav-content">
            <SideNav links={getSectionLinks(props)} />
          </div>
        </nav>

        <article>
          <header>
            <h1 id="start">
              <span className="article-name">{props.name}</span>
              <SharingButtons />
            </h1>
          </header>
          <section className="markdown-body">
            <ReactMarkdown
              escapeHtml={false}
              source={fixImageUrls(props.id, props.text)}
              transformImageUri={transformImageUri(props.id)}
              renderers={{ heading: HeadingRenderer }}
              linkTarget={(url) => (url.startsWith('#') ? '' : '_blank')}
            />
          </section>
          <h2 id="source-code">Source code</h2>
          <section>
            <LinkIconButton
              href={`/zip/${props.id}.zip`}
              icon={mdiDownload}
              onClick={() =>
                reportEvent({ action: 'download', category: 'project', label: props.id })
              }
            >
              Download project
            </LinkIconButton>
            <LinkIconButton
              icon={mdiGithub}
              href={`https://github.com/wokwi/good-arduino-code/tree/master/content/${props.id}`}
              onClick={() =>
                reportEvent({ action: 'view-on-github', category: 'project', label: props.id })
              }
              target="_blank"
            >
              View on GitHub
            </LinkIconButton>
          </section>
          {props.code.map((file) => (
            <section id={fileNameToId(file.name)} key={file.name}>
              <h3>{file.name}</h3>
              <AnnotatedSource code={file.code} annotations={file.annotations} />
            </section>
          ))}
          <div className="sharing-buttons">
            <SharingButtons />
          </div>
          {props.simulation && (
            <>
              <h2 id="simulation">Simulation</h2>
              <section>
                <iframe src={props.simulation} title="Arduino Simulation"></iframe>
              </section>
            </>
          )}
        </article>
      </div>
      <GlobalStyles />
      <style jsx>{`
        .page-layout {
          display: grid;
          grid-template-columns: 1fr 732px 1fr;
          font-size: 17px;
          max-width: 100vw;
        }

        article {
          grid-area: 1 / 2;
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 100vw;
        }

        nav {
          grid-area: 1 / 3;
        }

        .nav-content {
          position: sticky;
          top: 16px;
          margin: 16px 0 0 14px;
        }

        @media (max-width: 890px) {
          nav {
            display: none;
          }
        }

        header,
        section {
          width: 100%;
        }

        h1 {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .article-name {
          margin: 0 16px 8px 0;
        }

        .markdown-body,
        .sharing-buttons,
        h1,
        h2,
        h3 {
          padding: 0 8px;
          width: 100%;
        }

        iframe {
          border: none;
          width: 100%;
          height: 800px;
        }
      `}</style>
      <style jsx global>{`
        article .markdown-body {
          font-size: inherit;
        }

        .markdown-body figure {
          text-align: center;
        }

        .markdown-body img,
        .markdown-body iframe {
          max-width: 100%;
        }

        code.arduino {
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

export default function ProjectPageWrapper(props: ProjectPageProps) {
  if (!isProduction) {
    const [liveProps, setProps] = useState(props);
    useEffect(() => {
      const timer = setInterval(async () => {
        const request = await fetch(`/api/watch-project?project=${liveProps.id}`);
        const newProps = await request.json();
        setProps(newProps);
      }, 100);
      return () => clearTimeout(timer);
    });
    return <ProjectPage {...liveProps} />;
  } else {
    return <ProjectPage {...props} />;
  }
}

export const getStaticProps: GetStaticProps<ProjectPageProps, ProjectPageParams> = async ({
  params,
}) => {
  if (!params) {
    throw new Error('Missing post id');
  }
  const project = await getProject(params.id);
  const annotatedCode = (await getProjectCode(params.id)).map((sourceFile) => {
    const { code, annotations } = extractCodeAnnotations(sourceFile.code);
    return { ...sourceFile, code, annotations };
  });
  return {
    props: {
      id: params.id,
      name: project.name,
      lastModified: project.lastModified,
      author: project.author,
      description: project.description,
      simulation: project.simulation ?? null,
      text: await getProjectText(params.id),
      code: annotatedCode,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getProjects()).map((path) => `/projects/${path}`),
  fallback: false,
});
