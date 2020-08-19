import fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import ZipStream from 'zip-stream';
import { extractCodeAnnotations } from '../services/gac-annotations';
import { getProjectCode, getProjects } from '../services/projects';

const zipRoot = join(__dirname, '../public/zip');

async function main() {
  for (const projectId of await getProjects()) {
    const readme = `Project downloaded from https://goodarduinocode.com/projects/${projectId} \r\n\r\nVisit https://goodarduinocode.com/ for more projects.\r\n`;
    const codePrefix = `// Project downloaded from https://goodarduinocode.com/projects/${projectId}\n\n`;
    const zip = new ZipStream({ level: 9 });
    const output = fs.createWriteStream(join(zipRoot, `${projectId}.zip`));
    zip.pipe(output);
    await promisify(zip.entry).call(zip, null, { name: projectId, type: 'directory' });
    await promisify(zip.entry).call(zip, readme, { name: `${projectId}/README.txt` });
    for (const file of await getProjectCode(projectId)) {
      const { code } = extractCodeAnnotations(file.code);
      await promisify(zip.entry).call(zip, codePrefix + code, {
        name: `${projectId}/${file.name}`,
      });
    }
    zip.finalize();
  }
}

main().catch(console.error);
