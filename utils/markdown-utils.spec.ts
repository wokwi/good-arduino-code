import { extractHeadings } from './markdown-utils';

describe('extract-headings', () => {
  it('should extract the headings from the given markdown source', () => {
    expect(extractHeadings('# Top level\n\n### third-level')).toEqual([
      {
        text: 'Top level',
        level: 1,
      },
      {
        text: 'third-level',
        level: 3,
      },
    ]);
  });
});
