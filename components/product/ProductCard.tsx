'use client';

// =============================================================================
// Qatify — Reusable High-Conversion Product Card Component
// Modern 6-column marketplace retail card (Tokopedia/Shopee density tuned for Qatar)
// =============================================================================

import React from 'react';
import Link from 'next/link';
import {
  Star,
  Heart,
  ShoppingCart,
  Flame,
  Check,
  BadgeCheck,
} from 'lucide-react';
import { Product } from '@/types/product';
import { useShop } from '@/context/ShopContext';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list' | 'compact';
  showStockBar?: boolean;
}

const VERIFIED_BRANDS = [
  'anker',
  'soundcore',
  'baseus',
  'porodo',
  'green lion',
  'ugreen',
  'apple',
  'samsung',
  'xiaomi',
  'sony',
  'dji',
];

const QATAR_REGIONS = [
  'Doha, Qatar',
  'Lusail, Qatar',
  'Al Rayyan, Qatar',
  'Al Wakrah, Qatar',
  'West Bay, Doha',
];

const getRegionName = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
  }
  return QATAR_REGIONS[Math.abs(hash) % QATAR_REGIONS.length];
};

const formatSoldCount = (count?: number) => {
  if (!count || count <= 0) return '100+ sold';
  if (count >= 1000) {
    const k = (count / 1000).toFixed(count >= 10000 ? 0 : 1);
    return `${k.replace('.0', '')}k+ sold`;
  }
  return `${count} sold`;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'grid',
  showStockBar = false,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [isAdded, setIsAdded] = React.useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const savings =
    product.originalPriceQAR > product.priceQAR
      ? product.originalPriceQAR - product.priceQAR
      : 0;

  const discountPercent =
    product.discountPercent > 0
      ? product.discountPercent
      : product.originalPriceQAR > product.priceQAR
      ? Math.round(
          ((product.originalPriceQAR - product.priceQAR) /
            product.originalPriceQAR) *
            100
        )
      : 0;

  const hasDiscount = savings > 0 || discountPercent > 0;

  const isOfficial =
    product.brand &&
    VERIFIED_BRANDS.some((b) => product.brand.toLowerCase().includes(b));

  const promoBenefit =
    savings > 0
      ? `Save QAR ${savings} with Deal`
      : product.priceQAR >= 150
      ? 'Free Express Delivery'
      : product.isFlashDeal
      ? 'Limited Flash Deal'
      : 'Direct Air Express';

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      {/* Top Badges & Actions Overlay */}
      <div className={styles.topBar}>
        <div className={styles.badgesCol}>
          {hasDiscount && discountPercent > 0 && (
            <span className={styles.discountBadge}>
              {discountPercent}%
            </span>
          )}
          {product.badge && (
            <span className={styles.customBadge}>{product.badge}</span>
          )}
        </div>

        <div className={styles.quickActions}>
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`${styles.actionBtn} ${isFavorited ? styles.activeWish : ''}`}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
            title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart
              size={13}
              fill={isFavorited ? '#ffb800' : 'none'}
              color={isFavorited ? '#ffb800' : 'currentColor'}
            />
          </button>
        </div>
      </div>

      {/* Product Image Stage (1:1 Ratio) */}
      <Link href={`/products/${product.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <img
            src={product.images[0] || '/placeholder.svg'}
            alt={product.title}
            className={styles.productImage}
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.endsWith('/placeholder.svg')) {
                target.src = '/placeholder.svg';
              }
            }}
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.title} alternate view`}
              className={styles.productImageHover}
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/placeholder.svg')) {
                  target.src = '/placeholder.svg';
                }
              }}
            />
          )}
        </div>
      </Link>

      {/* Product Information Body */}
      <div className={styles.content}>
        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className={styles.titleLink}>
          <h3 className={styles.title} title={product.title}>
            {product.title}
          </h3>
        </Link>

        {/* List variant extra description */}
        {variant === 'list' && (
          <p className={styles.listDescription}>{product.shortDescription}</p>
        )}

        {/* Pricing Strip */}
        <div className={styles.priceRow}>
          <div className={styles.priceMain}>
            <span className={styles.priceQAR}>
              <span className={styles.currency}>QAR</span>
              {product.priceQAR.toLocaleString()}
            </span>
          </div>
          {product.originalPriceQAR > product.priceQAR && (
            <span className={styles.originalPrice}>
              QAR {product.originalPriceQAR.toLocaleString()}
            </span>
          )}
        </div>

        {/* Promo Benefit Tag (Hemat s.d Bonus / Bisa COD style) */}
        <div className={styles.promoRow}>
          <span className={styles.promoText} title={promoBenefit}>
            {promoBenefit}
          </span>
        </div>

        {/* Rating & Sold Row */}
        <div className={styles.ratingRow}>
          <Star size={11} className={styles.starIcon} fill="#f59e0b" color="#f59e0b" />
          <span className={styles.ratingScore}>{product.rating.toFixed(1)}</span>
          <span className={styles.dotSeparator}>·</span>
          <span className={styles.soldCount}>{formatSoldCount(product.soldCount)}</span>
        </div>

        {/* Store / Location Row (Bottom line) */}
        <div className={styles.storeRow}>
          {isOfficial ? (
            <span className={styles.officialStore} title={`${product.brand} Official Store`}>
              <BadgeCheck size={12} className={styles.officialCheckIcon} />
              <span className={styles.storeName}>{product.brand} Official Store</span>
            </span>
          ) : (
            <span className={styles.locationStore} title="Direct Air Delivery to Qatar">
              <span className={styles.locationDot} />
              <span className={styles.storeName}>{getRegionName(product.id)}</span>
            </span>
          )}
        </div>

        {/* Stock Progress Bar (Optional) */}
        {showStockBar && (
          <div className={styles.stockProgressWrap}>
            <div className={styles.stockTextRow}>
              <span className={styles.claimedText}>
                <Flame size={12} className={styles.flameIcon} />
                <strong>{product.stockPercent}% Claimed</strong>
              </span>
              <span className={styles.airBatchTag}>Air Batch</span>
            </div>
            <div className={styles.stockBarTrack}>
              <div
                className={styles.stockBarFill}
                style={{ width: `${product.stockPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button: Add to Cart (Desktop slide-up on hover, mobile tap) */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`${styles.addToCartBtn} ${isAdded ? styles.added : ''}`}
          aria-label={`Add ${product.title} to cart`}
        >
          {isAdded ? (
            <>
              <Check size={13} />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={13} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
