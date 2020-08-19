import fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import ZipStream from 'zip-stream';
import { extractCodeAnnotations } from '../services/gac-annotations';
import { getProjectCode, getProjects } from '../services/projects';

const zipRoot = join(__dirname, '../public/zip');

async function main() {
  for (const projectId of await getProjects()) {
    const zip = new ZipStream({ level: 9 });
    const output = fs.createWriteStream(join(zipRoot, `${projectId}.zip`));
    zip.pipe(output);
    await promisify(zip.entry).call(zip, null, { name: projectId, type: 'directory' });
    for (const file of await getProjectCode(projectId)) {
      const { code } = extractCodeAnnotations(file.code);
      await promisify(zip.entry).call(zip, code, { name: `${projectId}/${file.name}` });
    }
    zip.finalize();
  }
}

main().catch(console.error);
