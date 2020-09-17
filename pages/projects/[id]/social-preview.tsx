import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import { LogoVertical } from '../../../components/logo-vertical';
import { getProject, getProjects, IProjectInfo } from '../../../services/projects';
import { projectImageUrl } from '../../../services/urls';

interface ProjectPageParams extends ParsedUrlQuery {
  id: string;
}

interface ProjectPageProps {
  project: IProjectInfo;
}

export default function socialImage({ project }: { project: IProjectInfo }) {
  const { author, description, thumbnail } = project;
  return (
    <div id="container">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <h1>{project.name}</h1>
      {(description || author) && (
        <h2>
          {description}
          <span> · {author}</span>
        </h2>
      )}
      {thumbnail && <img className="thumbnail" src={projectImageUrl(project.id, thumbnail)} />}
      <LogoVertical className="logo" />
      <style jsx global>{`
        body {
          position: relative;
          height: 630px;
          width: 1200px;
        }

        * {
          box-sizing: content-box;
        }
      `}</style>
      <style jsx>{`
        #container {
          font-family: verdana;
          color: #555;
          position: absolute;
          top: 32px;
          left: 32px;
          right: 32px;
          bottom: 32px;
          background: white;
          padding: 32px;
          box-shadow: 16px 16px #00ffc3;
          border: solid #00ffc3 4px;
          overflow: hidden;
        }

        h1 {
          margin: 0 0 16px;
          font-size: 64px;
        }

        h2 {
          font-size: 32px;
        }

        .thumbnail {
          max-width: 800px;
        }

        :global(svg.logo) {
          position: absolute;
          width: 200px;
          top: 0;
          left: 910px;
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
      project,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getProjects()).map((path) => `/projects/${path}/social-preview`),
  fallback: false,
});
