import { NextApiRequest, NextApiResponse } from 'next';
import { promisify } from 'util';
import ZipStream from 'zip-stream';
import { getProjectCode } from '../../../services/projects';
import { extractCodeAnnotations } from '../../../services/gac-annotations';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { project },
  } = req;

  const projectId = (project as string).replace(/.zip$/i, '');

  const zip = new ZipStream({ level: 9 });

  res.statusCode = 200;
  res.setHeader('content-type', 'application/zip');

  zip.pipe(res);
  for (const file of await getProjectCode(projectId)) {
    const { code } = extractCodeAnnotations(file.code);
    await promisify(zip.entry).call(zip, code, { name: file.name });
  }
  zip.finalize();
};
