import { GetStaticProps, GetStaticPaths } from 'next';
import { getProject, getProjects, getProjectCode } from '../../services/projects';
import { GlobalStyles } from '../../components/global-styles';
import Highlight from 'react-highlight';
import { ParsedUrlQuery } from 'querystring';

interface ProjectPageParams extends ParsedUrlQuery {
  id: string;
}

interface ProjectPageProps {
  name: string;
  data: string;
}

export default function ProjectPage(props: ProjectPageProps) {
  return (
    <div className="container">
      <main>
        <h1>{props.name}</h1>
        <Highlight>{props.data}</Highlight>
      </main>

      <GlobalStyles />
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
    props: { name: project.name, data: await getProjectCode(params.id) },
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getProjects()).map((path) => `/projects/${path}`),
  fallback: false,
});
