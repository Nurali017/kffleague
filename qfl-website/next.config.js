/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'upload.wikimedia.org',
      'localhost',
      process.env.NEXT_PUBLIC_SITE_DOMAIN || 'kff.1sportkz.com',
    ],
  },
  async rewrites() {
    const backendUrl = process.env.API_REWRITE_DESTINATION || 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
