module.exports = {
  async redirects() {
    return [
      {
        source: '/projects',
        destination: `/`,
        permanent: false,
      },
    ];
  },
};
