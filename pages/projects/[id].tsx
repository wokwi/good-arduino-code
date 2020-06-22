import { GetStaticPropsResult, GetStaticPaths } from 'next';
import { getProject, getProjects, getProjectCode } from '../../services/projects';

interface SimonProps {
  name: string;
  data: string;
}

export default function Simon(props: SimonProps) {
  return (
    <main>
      <h1>{props.name}</h1>
      <pre>{props.data}</pre>
    </main>
  );
}

export async function getStaticProps({ params }): Promise<GetStaticPropsResult<SimonProps>> {
  const project = await getProject(params.id);
  return {
    props: { name: project.name, data: await getProjectCode(params.id) },
  };
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getProjects()).map((path) => `/projects/${path}`),
  fallback: false,
});
