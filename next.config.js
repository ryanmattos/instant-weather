/** @type {import('next').NextConfig} */
const nextConfig = {
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
