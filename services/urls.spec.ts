import { projectFileURL, thumbnailUrl } from './urls';

describe('projectFileURL', () => {
  it('should return the full URL of the given project file', async () => {
    expect(projectFileURL('simon', 'images/thumbnail.png')).toEqual(
      '/api/files/simon/images/thumbnail.png',
    );
  });

  it('should return the input URL for absolute URL', async () => {
    expect(projectFileURL('simon', '/foo/bar')).toEqual('/foo/bar');
  });

  it('should return the input URL for https:// URL', async () => {
    expect(projectFileURL('simon', 'https://example.org')).toEqual('https://example.org');
  });
});

describe('thumbnailUrl', () => {
  it('should return the thumbnail URL for the given project', () => {
    expect(thumbnailUrl({ id: 'simon', thumbnail: 'images/thumbnail.png' })).toEqual(
      '/api/files/simon/images/thumbnail.png',
    );
  });

  it('should return null if the project has no thumbnail', () => {
    expect(thumbnailUrl({ id: 'simon' })).toBeNull();
  });
});
