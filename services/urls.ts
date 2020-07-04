export function projectFileURL(id: string, file: string) {
  return `/api/files/${id}/${file}`;
}

export function thumbnailUrl({ id, thumbnail }: { id: string; thumbnail?: string }) {
  return thumbnail ? projectFileURL(id, thumbnail) : null;
}
