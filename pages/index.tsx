import Head from 'next/head';
import Link from 'next/link';
import { getProjects, getProject, IProjectInfo } from '../services/projects';
import { GetStaticProps } from 'next';
import { SignupForm } from '../components/signup-form';
import { GlobalStyles } from '../components/global-styles';

interface IndexProps {
  projects: IProjectInfo[];
}

export default function Home(props: IndexProps) {
  return (
    <div className="container">
      <Head>
        <title>Good Arduino Code</title>
        <link rel="icon" href="/favicon.ico" />
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
              <a className="card">
                <h3>{project.name} &rarr;</h3>
                <p>{project.name}</p>
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

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
            Bitstream Vera Sans Mono, Courier New, monospace;
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

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
      <GlobalStyles />
    </div>
  );
}

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const projects = await getProjects();
  return {
    props: {
      projects: await Promise.all(projects.map((id) => getProject(id))),
    },
  };
};
