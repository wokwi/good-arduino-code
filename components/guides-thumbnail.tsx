import { IGuideMetadata } from 'layouts/layout';
import Head from 'next/head';
import { LogoVertical } from './logo-vertical';

export interface IGuideThumbnailProps {
  frontMatter: IGuideMetadata;
}

export function GuidesThumbnail({ frontMatter }: IGuideThumbnailProps) {
  const { title, shortTitle, description, thumbnail } = frontMatter;
  return (
    <div id="container">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <h1>{shortTitle || title}</h1>
      {description && <h2>{description}</h2>}
      {thumbnail && <img className="thumbnail" src={thumbnail} />}
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
