const withOptimizedImages = require('next-optimized-images');

module.exports = withOptimizedImages({
  async redirects() {
    return [
      {
        source: '/projects',
        destination: `/`,
        permanent: false,
      },
    ];
  },
});
