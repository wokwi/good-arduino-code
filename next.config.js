const withMdxEnhanced = require('next-mdx-enhanced');
const readingTime = require('reading-time');

module.exports = withMdxEnhanced({
  fileExtensions: ['mdx'],
  usesSrc: false,
  extendFrontMatter: {
    process: (mdxContent) => ({
      readingTime: readingTime(mdxContent),
    }),
  },
})({
  async redirects() {
    return [
      {
        source: '/projects',
        destination: `/`,
        permanent: false,
      },
      {
        source: '/guides',
        destination: '/',
        permanent: false,
      },
    ];
  },
});
