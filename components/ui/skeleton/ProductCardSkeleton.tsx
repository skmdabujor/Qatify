import React from 'react';
import { Skeleton } from './Skeleton';
import styles from './Skeleton.module.scss';

export function ProductCardSkeleton() {
  return (
    <div className={styles.cardSkeleton} aria-busy="true" aria-label="Loading product">
      {/* 1:1 Image Area */}
      <div className={styles.cardImageStage}>
        <Skeleton className={styles.cardImageShimmer} />
        <Skeleton className={styles.cardBadgePlaceholder} />
      </div>

      {/* Card Info Content */}
      <div className={styles.cardContent}>
        {/* Title Lines */}
        <Skeleton className={styles.cardTitleLine1} />
        <Skeleton className={styles.cardTitleLine2} />

        {/* Rating & Sold Meta */}
        <div className={styles.cardMetaRow}>
          <Skeleton className={styles.cardStarsPlaceholder} />
          <Skeleton className={styles.cardSoldPlaceholder} />
        </div>

        {/* Price Row */}
        <div className={styles.cardPriceRow}>
          <Skeleton className={styles.cardPriceMain} />
          <Skeleton className={styles.cardPriceOriginal} />
        </div>

        {/* Add to Cart Button */}
        <Skeleton className={styles.cardButtonPlaceholder} />
      </div>
    </div>
  );
}
