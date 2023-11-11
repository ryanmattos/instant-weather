/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { nextRuntime }) { 
    // as of Next.js latest versions, the nextRuntime is preferred over `isServer`, because of edge-runtime
    if (typeof nextRuntime === "undefined") {
      const { IgnorePlugin } = require("webpack");
      const ignoreFs = new IgnorePlugin({ resourceRegExp: /fs/ });
      config.plugins.push(ignoreFs);
    }

    return config;
  },
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.weatherapi.com',
          port: '',
          pathname: '/weather/128x128/**',
        },
      ],
    },
}

module.exports = nextConfig
