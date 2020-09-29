const withMdxEnhanced = require('next-mdx-enhanced');

module.exports = withMdxEnhanced({
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
});
