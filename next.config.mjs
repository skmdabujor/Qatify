/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      // Convex File Storage (Dynamic uploads from Admin panel)
      {
        protocol: 'https',
        hostname: '**.convex.cloud',
      },
      {
        protocol: 'https',
        hostname: '**.convex.site',
      },
      // AliExpress & Supplier CDNs (For Dropshipping Product Images)
      {
        protocol: 'https',
        hostname: '**.alicdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.aliexpress-media.com',
      },
      {
        protocol: 'https',
        hostname: '**.aliexpress.com',
      },
      // Cloudinary & Common Image CDNs
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;

