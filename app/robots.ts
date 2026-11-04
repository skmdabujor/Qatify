// =============================================================================
// Qatify Qatar — Dynamic Robots Configuration (Next.js App Router)
// Served automatically at: https://shopqatify.com/robots.txt
// Directs search engine crawlers (Googlebot, Bingbot, etc.) & guards private areas
// =============================================================================

import type { MetadataRoute } from 'next';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
    : 'https://shopqatify.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/shop',
          '/products/*',
          '/bundle-builder',
          '/contact',
          '/track-order',
          '/shipping-policy',
          '/refund-policy',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/cart',
          '/checkout',
          '/checkout/*',
          '/bundle-cart',
          '/login',
          '/signup',
          '/reset-password',
          '/track',
          '/api/*',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}

