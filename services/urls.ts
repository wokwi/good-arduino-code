import { isProduction } from './environment';

export interface IImageOptions {
  maxWidth?: number;
  maxHeight?: number;
}

export function projectFileURL(id: string, uri: string) {
  if (uri.includes('://') || uri.startsWith('/')) {
    return uri;
  }
  return `/api/files/${id}/${uri}`;
}

function imageKitUrl(url: string, options: IImageOptions) {
  if (!url.startsWith('/api/files')) {
    return url;
  }
  const imagePath = url.split('/').slice(3).join('/');
  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio ?? 1 : 1;
  const transformOptions = [
    options.maxWidth ? `w-${options.maxWidth * devicePixelRatio}` : null,
    options.maxHeight ? `h-${options.maxHeight * devicePixelRatio}` : null,
  ].filter((item) => item != null);
  const queryString = transformOptions.length ? `?tr=${transformOptions.join(',')}` : '';
  return `https://ik.imagekit.io/tlnjt5rshw/${imagePath}${queryString}`;
}

export function projectImageUrl(id: string, uri: string, options: IImageOptions = {}) {
  const baseUrl = projectFileURL(id, uri);
  return isProduction ? imageKitUrl(baseUrl, options) : baseUrl;
}

export function thumbnailUrl(
  { id, thumbnail }: { id: string; thumbnail?: string },
  options: IImageOptions = {},
) {
  return thumbnail ? projectImageUrl(id, thumbnail, options) : null;
}
