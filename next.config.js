const withMdxEnhanced = require('next-mdx-enhanced');
const withOptimizedImages = require('next-optimized-images');

module.exports = withOptimizedImages(
  withMdxEnhanced({
    fileExtensions: ['mdx'],
    usesSrc: false,
  })({
    async redirects() {
      return [
        {
          source: '/projects',
          destination: `/`,
          permanent: false,
        },
      ];
    },
  }),
);
