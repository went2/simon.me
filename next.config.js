/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // converting class name to camel-case when import
    // https://github.com/vercel/next.js/discussions/11267
    config.module.rules
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes("css-loader"))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options.modules) {
          options.modules.exportLocalsConvention = "camelCase";
        }
      });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'user-images.githubusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
        pathname: '**',
      }
    ]
  },
};

module.exports = nextConfig;
