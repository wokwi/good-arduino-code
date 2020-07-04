import { projectFileURL, thumbnailUrl } from './urls';

describe('projectFileURL', () => {
  it('should return the full URL of the given project file', async () => {
    expect(projectFileURL('simon', 'images/thumbnail.png')).toEqual(
      '/api/files/simon/images/thumbnail.png',
    );
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
