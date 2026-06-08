/** @type {import('next').NextConfig} */
const headers = require('./headers');

module.exports = {
  reactStrictMode: false,
  poweredByHeader: false,
  images: {
    domains: ['localhost', 'surabaya.go.id'],
  },
  experimental: {
    scrollRestoration: true,
  },
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts)x?$/] },
      use: ['@svgr/webpack'],
    });

    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers,
      },
    ];
  },
};
