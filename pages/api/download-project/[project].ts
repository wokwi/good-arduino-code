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
  console.log('init download');
  await promisify(zip.entry).call(zip, null, { name: projectId, type: 'directory' });
  for (const file of await getProjectCode(projectId)) {
    console.log('add file', file.name, file.primary);
    const { code } = extractCodeAnnotations(file.code);
    console.log('code length', code.length);
    await promisify(zip.entry).call(zip, code, { name: `${projectId}/${file.name}` });
  }
  console.log('end zip');
  zip.finalize();
};
