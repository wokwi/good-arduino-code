import { Card } from '@/components/card';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { GacLogo } from '../components/gac-logo';
import { GlobalStyles } from '../components/global-styles';
import { SignupForm } from '../components/signup-form';
import { getProject, getProjects, IProjectInfo } from '../services/projects';
import { projectImageUrl } from '../services/urls';

interface IndexProps {
  projects: IProjectInfo[];
}

function ProjectCard({ project }: { project: IProjectInfo }) {
  const { id, thumbnail } = project;
  return (
    <Link href="projects/[id]" as={`projects/${project.id}`} passHref>
      <Card
        title={project.name}
        description={project.description}
        thumbnail={
          thumbnail && (
            <img
              src={projectImageUrl(id, thumbnail, { maxHeight: 200 })}
              srcSet={[
                projectImageUrl(id, thumbnail, { maxHeight: 200 }),
                projectImageUrl(id, thumbnail, { maxHeight: 300 }) + ' 1.5x',
                projectImageUrl(id, thumbnail, { maxHeight: 400 }) + ' 2x',
              ].join(', ')}
              alt={project.name}
            />
          )
        }
      />
    </Link>
  );
}

export default function Home(props: IndexProps) {
  return (
    <div className="container">
      <Head>
        <title>Good Arduino Code</title>
        <meta
          name="description"
          content="Arduino projects with great code, explanations, diagrams and simulation"
        />
        <meta property="og:title" content="Just Good Arduino Code" />
        <meta
          property="og:description"
          content="A curated collection of Arduino coding examples by Wokwi"
        />
        <meta property="og:image" content="https://goodarduinocode.com/images/social-cover.jpg" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@WokwiMakes" />
      </Head>

      <SignupForm />

      <main>
        <GacLogo aria-label="Good Arduino Code Logo" />

        <p className="description" style={{ marginTop: 0 }}>
          <strong>
            A curated collection of Arduino coding examples by{' '}
            <a href="https://wokwi.com/">Wokwi</a>
          </strong>
        </p>

        <h2>Guides</h2>
        <Link href="/guides/charlieplexing" passHref>
          <Card
            title="Charlieplexing"
            description="Control 72 LEDs with just 9 Arduino Pins"
            thumbnail={<img src="/images/guides/charlieplexing.svg" alt="Charlieplexing" />}
          />
        </Link>

        <h2>Projects</h2>
        <div className="grid">
          {props.projects.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))}
        </div>
      </main>

      <footer>Copyright (C) 2020 Uri Shaked</footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          margin-top: 64px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
      <GlobalStyles />
    </div>
  );
}

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const projectIds = await getProjects();
  const projects = await Promise.all(projectIds.map((id) => getProject(id)));
  return {
    props: {
      projects: projects.filter((project) => !project.unlisted),
    },
  };
};
