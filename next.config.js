const withMdxEnhanced = require('next-mdx-enhanced');
const withOptimizedImages = require('next-optimized-images');
const readingTime = require('reading-time');

module.exports = withOptimizedImages(
  withMdxEnhanced({
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
  }),
);
