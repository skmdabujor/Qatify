'use client';

// =============================================================================
// Qatify — Reusable High-Conversion Product Card Component
// Tuned for Qatar Dropshipping Retail Density ("হালকা ঘন")
// =============================================================================

import React from 'react';
import Link from 'next/link';
import {
  Star,
  Heart,
  ShoppingCart,
  Plane,
  Flame,
  Check,
} from 'lucide-react';
import { Product } from '@/types/product';
import { useShop } from '@/context/ShopContext';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list' | 'compact';
  showStockBar?: boolean;
}

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

  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      {/* Top Badges & Actions Overlay */}
      <div className={styles.topBar}>
        <div className={styles.badgesCol}>
          {product.discountPercent > 0 && (
            <span className={styles.discountBadge}>
              -{product.discountPercent}%
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
            <Heart size={15} fill={isFavorited ? '#E06C2A' : 'none'} color={isFavorited ? '#E06C2A' : 'currentColor'} />
          </button>
        </div>
      </div>

      {/* Product Image Stage */}
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
        {/* Category & Brand info */}
        <div className={styles.metaRow}>
          <span className={styles.brandName}>{product.brand}</span>
          <div className={styles.ratingWrap}>
            <Star size={12} className={styles.starIcon} fill="#FACC15" />
            <span className={styles.ratingScore}>{product.rating}</span>
            <span className={styles.soldCount}>({product.soldCount} sold)</span>
          </div>
        </div>

        {/* Product Title */}
        <Link href={`/products/${product.slug}`} className={styles.titleLink}>
          <h3 className={styles.title}>{product.title}</h3>
        </Link>

        {/* List variant extra description */}
        {variant === 'list' && (
          <p className={styles.listDescription}>{product.shortDescription}</p>
        )}

        {/* Pricing Strip */}
        <div className={styles.priceRow}>
          <div className={styles.priceBlock}>
            <span className={styles.priceQAR}>
              <span className={styles.currency}>QAR</span>
              {product.priceQAR}
            </span>
            {product.originalPriceQAR > product.priceQAR && (
              <span className={styles.originalPrice}>
                QAR {product.originalPriceQAR}
              </span>
            )}
          </div>

          {/* Air Express Badge */}
          <div className={styles.airDeliveryPill}>
            <Plane size={11} />
            <span>6–10d Air</span>
          </div>
        </div>

        {/* Stock Progress Bar (Optional) */}
        {showStockBar && (
          <div className={styles.stockProgressWrap}>
            <div className={styles.stockTextRow}>
              <span className={styles.claimedText}>
                <Flame size={12} className={styles.flameIcon} />
                <strong>{product.stockPercent}% Claimed</strong>
              </span>
              <span className={styles.airBatchTag}>Limited Air Batch</span>
            </div>
            <div className={styles.stockBarTrack}>
              <div
                className={styles.stockBarFill}
                style={{ width: `${product.stockPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button: Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`${styles.addToCartBtn} ${isAdded ? styles.added : ''}`}
          aria-label={`Add ${product.title} to cart`}
        >
          {isAdded ? (
            <>
              <Check size={14} />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={14} />
              <span>Add to Cart</span>
              <span className={styles.btnPrice}>• QAR {product.priceQAR}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

