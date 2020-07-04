import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import { projectDir } from '../../../../services/projects';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { project, path },
  } = req;
  const relativePath = (path as string[]).join('/');
  const content = await fs.readFile(projectDir(project as string) + '/' + relativePath);
  res.statusCode = 200;
  res.setHeader('content-type', 'image/png');
  res.send(content);
};
