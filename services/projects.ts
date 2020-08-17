import { promises as fs } from 'fs';
import { extname } from 'path';

export interface IProjectInfo {
  id: string;
  name: string;
  lastModified: number;
  author?: string;
  description?: string;
  thumbnail?: string;
  simulation?: string;
  unlisted?: boolean;
}

export interface IProjectSourceFile {
  name: string;
  code: string;
  primary: boolean;
}

const CONTENT_DIR = `${process.cwd()}/content`;

export function getProjects() {
  return fs.readdir(CONTENT_DIR);
}

export function projectDir(id: string) {
  return `${CONTENT_DIR}/${id}`;
}

export async function getProject(id: string) {
  const projectJson = `${projectDir(id)}/project.json`;
  return {
    ...JSON.parse(await fs.readFile(projectJson, 'utf-8')),
    id,
    lastModified: (await fs.stat(projectJson)).mtime.getTime(),
  } as IProjectInfo;
}

function sortByPrimaryThenName(file1: IProjectSourceFile, file2: IProjectSourceFile) {
  if (file1.primary) {
    return -1;
  }
  if (file2.primary) {
    return 1;
  }
  if (file1.name > file2.name) {
    return 1;
  }
  if (file2.name < file1.name) {
    return -1;
  }
  return 0;
}

export async function getProjectText(id: string) {
  return await fs.readFile(`${projectDir(id)}/README.md`, 'utf-8');
}

export async function getProjectCode(id: string) {
  const files = await fs.readdir(projectDir(id));
  const result: IProjectSourceFile[] = [];
  const codeExtensions = ['.ino', '.c', '.h', '.cpp'];
  console.log('files', files);
  for (const file of files) {
    const extension = extname(file.toLowerCase());
    if (codeExtensions.includes(extension)) {
      result.push({
        name: file,
        code: await fs.readFile(`${projectDir(id)}/${file}`, 'utf-8'),
        primary: extension === '.ino',
      });
    }
  }
  return result.sort(sortByPrimaryThenName);
}
