module.exports = {
  experimental: {
    async redirects() {
      return [
        {
          source: '/projects',
          destination: `/`,
          permanent: false,
        },
      ];
    },
  },
};
