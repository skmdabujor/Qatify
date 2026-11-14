'use client';

// =============================================================================
// Qatify — Homepage New Arrivals Grid Section (16-Slot Mosaic Grid)
// Clean 8x2 bordered mosaic grid powered by the latest New Arrival products
// =============================================================================

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ArrowRight, Sparkles } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { Product, toProduct } from '@/types/product';
import styles from './HomeCategoriesSection.module.scss';

const TARGET_ITEM_COUNT = 16;

export const HomeCategoriesSection: React.FC = () => {
  const liveNewArrivals = useQuery(api.products.getNewArrivals, {
    limit: TARGET_ITEM_COUNT,
  });

  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const fallbackItems: Product[] = useMemo(() => {
    const newItems = PRODUCTS.filter((p) => p.isNewArrival);
    if (newItems.length >= TARGET_ITEM_COUNT) {
      return newItems.slice(0, TARGET_ITEM_COUNT);
    }
    const otherItems = PRODUCTS.filter((p) => !p.isNewArrival);
    return [...newItems, ...otherItems].slice(0, TARGET_ITEM_COUNT);
  }, []);

  const items: Product[] = useMemo(() => {
    if (liveNewArrivals && liveNewArrivals.length > 0) {
      const mapped = liveNewArrivals.map(toProduct);
      if (mapped.length >= TARGET_ITEM_COUNT) {
        return mapped.slice(0, TARGET_ITEM_COUNT);
      }
      const remaining = fallbackItems.filter(
        (fb) => !mapped.some((m) => m.id === fb.id || m.slug === fb.slug)
      );
      return [...mapped, ...remaining].slice(0, TARGET_ITEM_COUNT);
    }
    return fallbackItems;
  }, [liveNewArrivals, fallbackItems]);

  const gridColsClass =
    items.length > 12
      ? styles.cols8
      : items.length > 10
      ? styles.cols6
      : styles.cols5;

  const handleImageError = (itemKey: string) => {
    setFailedImages((prev) => (prev[itemKey] ? prev : { ...prev, [itemKey]: true }));
  };

  return (
    <section className={styles.sectionWrapper} aria-label="New Arrivals">
      <div className={styles.headerRow}>
        <h2 className={styles.heading}>New Arrivals</h2>
        <Link href="/shop?sort=newest" className={styles.viewAllBtn}>
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className={styles.gridCard}>
        <div className={`${styles.categoriesGrid} ${gridColsClass}`}>
          {items.map((item) => {
            const itemKey = `${item.id}-${item.slug}`;
            const itemImage = item.images?.[0];
            const hasBrokenImage = failedImages[itemKey] || !itemImage;
            const itemTitle = `${item.title} • QAR ${item.priceQAR}`;

            return (
              <Link
                key={itemKey}
                href={`/products/${item.slug}`}
                className={styles.categoryCell}
                title={itemTitle}
                aria-label={item.title}
              >
                <div className={styles.imageBox}>
                  {!hasBrokenImage && itemImage ? (
                    <img
                      src={itemImage}
                      alt={item.title}
                      className={styles.categoryImg}
                      loading="lazy"
                      ref={(el) => {
                        if (el && el.complete && el.naturalWidth === 0) {
                          handleImageError(itemKey);
                        }
                      }}
                      onError={() => handleImageError(itemKey)}
                    />
                  ) : (
                    <div className={styles.fallbackIcon}>
                      <Sparkles size={26} strokeWidth={1.75} />
                    </div>
                  )}
                </div>

                <span className={styles.categoryName}>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeCategoriesSection;
