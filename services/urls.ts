export function projectFileURL(id: string, uri: string) {
  if (uri.includes('://') || uri.startsWith('/')) {
    return uri;
  }
  return `/api/files/${id}/${uri}`;
}

export function thumbnailUrl({ id, thumbnail }: { id: string; thumbnail?: string }) {
  return thumbnail ? projectFileURL(id, thumbnail) : null;
}
