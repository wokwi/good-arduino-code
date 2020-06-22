import { promises as fs } from 'fs';

export interface IProjectInfo {
  id: string;
  name: string;
}

const CONTENT_DIR = `${process.cwd()}/content`;

export function getProjects() {
  return fs.readdir(CONTENT_DIR);
}

export async function getProject(id: string) {
  return {
    ...JSON.parse(await fs.readFile(`${CONTENT_DIR}/${id}/project.json`, 'utf-8')),
    id,
  } as IProjectInfo;
}

export async function getProjectCode(id: string) {
  const code = (await fs.readFile(`${CONTENT_DIR}/${id}/sketch.ino`)).toString('utf-8');
  return code;
}
