import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import { promises as fs } from 'fs';
import { getProject, IProjectInfo, projectDir } from '../../../services/projects';
import { logoVertical } from './logo-vertical';
const chrome = require('chrome-aws-lambda');

async function readThumbnail(project: IProjectInfo) {
  if (project.thumbnail) {
    const thumbnail = await fs.readFile(projectDir(project.id) + '/' + project.thumbnail);
    return `data:image/png;base64,${thumbnail.toString('base64')}`;
  }
  return null;
}

async function generateHtml(project: IProjectInfo) {
  const thumbnail = await readThumbnail(project);
  const { author, description } = project;
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { box-sizing: content-box; }

        html, body {
          font-family: verdana;
          color: #555;
        }

        h1 {
          margin: 0 0 16px;
          font-size: 64px;
        }

        h2 {
          font-size: 32px;
        }

        #container {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          bottom: 16px;
          background: white;
          padding: 32px;
          box-shadow: 16px 16px #00ffc3;
          border: solid #00ffc3 4px;
          overflow: hidden;
        }

        #thumbnail {
          max-width: 800px;
        }

        #author {
          position: absolute;
          bottom: 4px;
        }

        svg {
          position: absolute;
          width: 200px;
          top: 0;
          left: 920px;
        }
      </style>
    </head>
    <body>
      <div id="container">
        <h1>${project.name}</h1>
        ${
          description || author
            ? `<h2>${description || ''}<span> · ${author || ''}</span></h2>`
            : ''
        }
        ${thumbnail ? `<img id="thumbnail" src=${thumbnail} />` : ''}
        ${logoVertical}
      </div>
    </body>
    </html>
`;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { project },
  } = req;

  const projectId = (project as string).replace(/.png$/i, '');

  const projectInfo = await getProject(projectId);
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
  });
  try {
    const page = await browser.newPage();

    const imageWidth = 1200;
    const imageHeight = 630;

    await page.setViewport({
      width: imageWidth,
      height: imageHeight,
    });

    await page.setContent(await generateHtml(projectInfo), { waitUntil: 'networkidle0' });
    const screenshot = await page.screenshot({
      type: 'png',
      encoding: 'binary',
      omitBackground: true,
      clip: {
        x: 0,
        y: 0,
        width: imageWidth,
        height: imageHeight,
      },
    });

    res.statusCode = 200;
    res.setHeader('content-type', 'image/png');
    res.send(screenshot);
  } finally {
    browser.close();
  }
};
