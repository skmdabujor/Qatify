// =============================================================================
// Qatify — Dynamic Product Detail Page (`/products/[slug]`)
// Server-Rendered Metadata & Schema.org JSON-LD (Al Anees Qatar Standard)
// =============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/data/products';
import { ProductDetailClient } from './ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Not Found | Qatify Qatar',
      description: 'The requested product is not available at Qatify Qatar.',
    };
  }

  const title = `${product.title} - Best Price in Qatar | Qatify`;
  const description = `Buy ${product.title} at the best price in Qatar (QR ${product.priceQAR}). 100% Genuine guaranteed, fast express delivery across Doha, Lusail, Al Rayyan & all Qatar municipalities. Cash on Delivery available.`;
  const canonicalUrl = `https://qatify.qa/products/${slug}`;
  const imageUrl = product.images[0] || 'https://qatify.qa/placeholder.svg';

  return {
    title,
    description,
    keywords: [
      product.title,
      `${product.brand} Qatar`,
      `${product.category} Doha`,
      `${product.title} price in qatar`,
      'buy online qatar',
      'alanees qatar alternative',
      'electronics doha',
      ...product.tags,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Qatify Qatar',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
      locale: 'en_QA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://qatify.qa',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: product.category,
            item: `https://qatify.qa/shop?cat=${product.categorySlug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.title,
            item: `https://qatify.qa/products/${slug}`,
          },
        ],
      },
      {
        '@type': 'Product',
        name: product.title,
        image: product.images,
        description: product.fullDescription || product.shortDescription,
        sku: product.id.toUpperCase(),
        mpn: product.id.toUpperCase(),
        brand: {
          '@type': 'Brand',
          name: product.brand,
        },
        offers: {
          '@type': 'Offer',
          url: `https://qatify.qa/products/${slug}`,
          priceCurrency: 'QAR',
          price: product.priceQAR.toString(),
          priceValidUntil: '2027-12-31',
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'Qatify Qatar',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating.toString(),
          reviewCount: product.reviewCount.toString(),
          bestRating: '5',
          worstRating: '1',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient slug={slug} initialProduct={product} />
    </>
  );
}
