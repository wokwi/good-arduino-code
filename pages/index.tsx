import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { GlobalStyles } from '../components/global-styles';
import { SignupForm } from '../components/signup-form';
import { getProject, getProjects, IProjectInfo } from '../services/projects';
import { thumbnailUrl } from '../services/urls';

interface IndexProps {
  projects: IProjectInfo[];
}

export default function Home(props: IndexProps) {
  return (
    <div className="container">
      <Head>
        <title>Good Arduino Code</title>
        <link rel="icon" href="/favicon.ico" />
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
        <img src="gac-logo.svg" alt="Good Arduino Code" />

        <p className="description" style={{ marginTop: 0 }}>
          <strong>
            A curated collection of Arduino coding examples by{' '}
            <a href="https://wokwi.com/">Wokwi</a>
          </strong>
        </p>

        <div className="grid">
          {props.projects.map((project) => (
            <Link href="projects/[id]" as={`projects/${project.id}`} key={project.id}>
              <a
                className="card"
                style={{ backgroundImage: project.thumbnail ? `url(${thumbnailUrl(project)}` : '' }}
              >
                <h3>
                  <span>{project.name}</span>
                </h3>
                <p>
                  <span>{project.description}</span>
                </p>
              </a>
            </Link>
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

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: 100% 50%;
          min-height: 200px;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card h3 > span,
        .card p > span {
          background-color: white;
          padding: 0 8px 0 0;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
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
