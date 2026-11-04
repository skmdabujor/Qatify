// =============================================================================
// Qatify Qatar — Dynamic XML Sitemap Generator (Next.js App Router)
// Served automatically at: https://shopqatify.com/sitemap.xml
// Combines static routes, categories & all dynamic products from Convex & catalog
// =============================================================================

import type { MetadataRoute } from 'next';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { PRODUCTS, CATEGORIES } from '@/data/products';

// Revalidate sitemap at most once every hour for performance and freshness
export const revalidate = 3600;

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
    : 'https://shopqatify.com';

interface ProductItem {
  slug: string;
  lastModified?: Date;
  images?: string[];
}

interface CategoryItem {
  slug: string;
  lastModified?: Date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // 1. Static Core Public Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/bundle-builder`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/track-order`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/shipping-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/refund-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Collect Products (Static catalog + Live Convex database)
  const productsMap = new Map<string, ProductItem>();

  // Populate from local catalog baseline
  for (const product of PRODUCTS) {
    if (product.slug) {
      productsMap.set(product.slug, {
        slug: product.slug,
        lastModified: currentDate,
        images: product.images && product.images.length > 0 ? product.images.slice(0, 5) : undefined,
      });
    }
  }

  // Enrich / update with live products from Convex Database
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (convexUrl) {
    try {
      const client = new ConvexHttpClient(convexUrl);
      const liveProducts = await client.query(api.products.list, { limit: 500 });
      if (Array.isArray(liveProducts)) {
        for (const item of liveProducts) {
          if (item?.slug) {
            productsMap.set(item.slug, {
              slug: item.slug,
              lastModified: item._creationTime ? new Date(item._creationTime) : currentDate,
              images: item.images && item.images.length > 0 ? item.images.slice(0, 5) : undefined,
            });
          }
        }
      }
    } catch (error) {
      console.warn('[sitemap] Notice: Could not fetch products from Convex DB, using static catalog:', error);
    }
  }

  const productEntries: MetadataRoute.Sitemap = Array.from(productsMap.values()).map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: p.lastModified || currentDate,
    changeFrequency: 'daily',
    priority: 0.85,
    ...(p.images && p.images.length > 0 ? { images: p.images } : {}),
  }));

  // 3. Collect Categories (Static catalog + Live Convex database)
  const categoriesMap = new Map<string, CategoryItem>();

  // Populate from local categories
  for (const cat of CATEGORIES) {
    if (cat.slug) {
      categoriesMap.set(cat.slug, {
        slug: cat.slug,
        lastModified: currentDate,
      });
    }
  }

  // Enrich with Convex Database categories
  if (convexUrl) {
    try {
      const client = new ConvexHttpClient(convexUrl);
      const liveCategories = await client.query(api.categories.list, { limit: 100 });
      if (Array.isArray(liveCategories)) {
        for (const item of liveCategories) {
          if (item?.slug) {
            categoriesMap.set(item.slug, {
              slug: item.slug,
              lastModified: item._creationTime ? new Date(item._creationTime) : currentDate,
            });
          }
        }
      }
    } catch (error) {
      console.warn('[sitemap] Notice: Could not fetch categories from Convex DB, using static catalog:', error);
    }
  }

  const categoryEntries: MetadataRoute.Sitemap = Array.from(categoriesMap.values()).map((c) => ({
    url: `${BASE_URL}/shop?cat=${encodeURIComponent(c.slug)}`,
    lastModified: c.lastModified || currentDate,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticPages, ...categoryEntries, ...productEntries];
}

