'use client';

// =============================================================================
// Qatify — Dedicated Tiered Bundle Builder & Savings Studio (`/bundle-builder`)
// Rules:
// - Only products with regular price >= 180 QAR
// - Tiers: 5 items = 5%, 10 items = 10%, 15 items = 15%, 20 items = 20%
// - Maximum 20 products
// - 20 items unlocks an exclusive 20% VIP Coupon for next order
// - Connects with Homepage Card via URL state persistence
// =============================================================================

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Check,
  Plus,
  X,
  Search,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Plane,
  Gift,
  Flame,
  Award,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types/product';
import styles from './page.module.scss';

// Categories for Filter Bar
const BUNDLE_CATEGORIES = [
  { slug: 'all', name: 'All Eligible Tech (180+ QAR)' },
  { slug: 'gaming-gear', name: 'Gaming & Desk Tech' },
  { slug: 'chargers-powerbanks', name: 'GaN Power & Fast Chargers' },
  { slug: 'tws-audio', name: 'TWS & Spatial Audio' },
  { slug: 'smartwatches', name: 'Smartwatches & Fit' },
  { slug: 'home-projectors', name: 'Projectors & Smart Home' },
  { slug: 'car-accessories', name: 'Car Tech & Mounts' },
];

function BundleBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addBundleToCart, openCart, showToast } = useShop();

  // Selected Category & Search state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Products for the Bundle (Max 20)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Query Convex products >= 180 QAR
  const convexProducts = useQuery(api.products.getBundleEligibleProducts, {
    categorySlug: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  // Fallback to local catalog if Convex is loading or offline
  const allEligibleProducts: Product[] = useMemo(() => {
    if (convexProducts && convexProducts.length > 0) {
      return convexProducts as unknown as Product[];
    }
    // Filter local products: priceQAR >= 180 and inStock
    return PRODUCTS.filter((p) => {
      const isPrice = p.priceQAR >= 180;
      const isStock = p.inStock !== false;
      const isCat = selectedCategory === 'all' || p.categorySlug === selectedCategory;
      return isPrice && isStock && isCat;
    });
  }, [convexProducts, selectedCategory]);

  // Filter by search query
  const displayedProducts = useMemo(() => {
    if (!searchQuery.trim()) return allEligibleProducts;
    const q = searchQuery.toLowerCase();
    return allEligibleProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [allEligibleProducts, searchQuery]);

  // Read URL query params (?items=qat-004,qat-009...) from homepage card redirect
  useEffect(() => {
    const itemsParam = searchParams.get('items');
    if (itemsParam) {
      const ids = itemsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (ids.length > 0) {
        setSelectedProductIds(Array.from(new Set(ids)).slice(0, 20));
        showToast(
          'Items Carried Over! 🎯',
          `${ids.length} products loaded from your homepage selection.`,
          'info'
        );
      }
    }
  }, [searchParams]);

  // Look up full product objects for selected IDs
  const selectedProducts = useMemo(() => {
    return selectedProductIds
      .map((id) => PRODUCTS.find((p) => p.id === id))
      .filter(Boolean) as Product[];
  }, [selectedProductIds]);

  const selectedCount = selectedProducts.length;

  // Tier Calculation
  let tierPercent = 0;
  if (selectedCount >= 20) {
    tierPercent = 20;
  } else if (selectedCount >= 15) {
    tierPercent = 15;
  } else if (selectedCount >= 10) {
    tierPercent = 10;
  } else if (selectedCount >= 5) {
    tierPercent = 5;
  }

  // Financial Calculations
  const originalSubtotal = selectedProducts.reduce((acc, p) => acc + p.priceQAR, 0);
  const bundleSavingsQAR =
    tierPercent > 0 ? Math.round((originalSubtotal * tierPercent) / 100) : 0;
  const bundleFinalPrice = Math.max(0, originalSubtotal - bundleSavingsQAR);

  // Toggle Product Selection (Add / Remove)
  const handleToggleProduct = (product: Product) => {
    const isSelected = selectedProductIds.includes(product.id);
    if (isSelected) {
      setSelectedProductIds((prev) => prev.filter((id) => id !== product.id));
    } else {
      if (selectedProductIds.length >= 20) {
        showToast('Maximum 20 Items Reached', 'You can select up to 20 items in a bundle.', 'warning');
        return;
      }
      setSelectedProductIds((prev) => [...prev, product.id]);
    }
  };

  // Remove a product from the sticky tray directly
  const handleRemoveFromTray = (productId: string) => {
    setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
  };

  // Add the entire bundle to Cart
  const handleAddBundleToCart = () => {
    if (selectedCount < 5) {
      showToast(
        'Minimum 5 Items Required',
        `Add ${5 - selectedCount} more item(s) to activate this discount offer.`,
        'warning'
      );
      return;
    }

    addBundleToCart(selectedProducts);
    openCart();
  };

  // Motivation message
  const getMotivationMessage = () => {
    if (selectedCount === 0) return 'Pick any 5 to 20 items to unlock tier discounts!';
    if (selectedCount < 5) {
      return `Add ${5 - selectedCount} more item${5 - selectedCount > 1 ? 's' : ''} to unlock 5% OFF!`;
    }
    if (selectedCount < 10) {
      return `5% OFF unlocked! Add ${10 - selectedCount} more item${10 - selectedCount > 1 ? 's' : ''} for 10% OFF!`;
    }
    if (selectedCount < 15) {
      return `10% OFF unlocked! Add ${15 - selectedCount} more item${15 - selectedCount > 1 ? 's' : ''} for 15% OFF!`;
    }
    if (selectedCount < 20) {
      return `15% OFF unlocked! Add ${20 - selectedCount} more item${20 - selectedCount > 1 ? 's' : ''} for MAX 20% OFF + VIP Gift!`;
    }
    return '🏆 MAX TIER REACHED: 20% OFF + 20% Next Purchase VIP Gift Unlocked!';
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ===================================================================
          1. HERO HEADER WITH 4-TIER LADDER
      ==================================================================== */}
      <section className={styles.heroHeader}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.badgeRow}>
              <span className={styles.vipPill}>
                <Gift size={14} /> Build Your Custom Bundle
              </span>
              <span className={styles.minSpendNotice}>
                • All Products 180+ QAR • Max 20 Items
              </span>
            </div>

            <h1 className={styles.heroTitle}>
              Build Your Own Tech Bundle & Save Up to 20%
            </h1>
            <p className={styles.heroSubtitle}>
              Select between <strong>5 and 20 authentic tech products</strong> to unlock instant tiered
              discounts across your entire bundle. Buy 20 items to receive an exclusive{' '}
              <strong>20% VIP Coupon</strong> for your next purchase!
            </p>

            {/* 4-Tier Ladder Visual */}
            <div className={styles.tierLadderGrid}>
              <div
                className={`${styles.tierCard} ${
                  selectedCount >= 5 && selectedCount < 10 ? styles.activeTier : ''
                }`}
              >
                <div className={styles.tierDot}>5</div>
                <div className={styles.tierInfo}>
                  <strong>5 Items: 5% OFF</strong>
                  <span>Starter Discount</span>
                </div>
              </div>

              <div
                className={`${styles.tierCard} ${
                  selectedCount >= 10 && selectedCount < 15 ? styles.activeTier : ''
                }`}
              >
                <div className={styles.tierDot}>10</div>
                <div className={styles.tierInfo}>
                  <strong>10 Items: 10% OFF</strong>
                  <span>Double Savings</span>
                </div>
              </div>

              <div
                className={`${styles.tierCard} ${
                  selectedCount >= 15 && selectedCount < 20 ? styles.activeTier : ''
                }`}
              >
                <div className={styles.tierDot}>15</div>
                <div className={styles.tierInfo}>
                  <strong>15 Items: 15% OFF</strong>
                  <span>Super Bundle</span>
                </div>
              </div>

              <div
                className={`${styles.tierCard} ${
                  selectedCount === 20 ? styles.vipTier : ''
                }`}
              >
                <div className={styles.tierDot}>20</div>
                <div className={styles.tierInfo}>
                  <strong>20 Items: 20% OFF</strong>
                  <span>+ 20% VIP Coupon Gift 🎁</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. FILTER & SEARCH CONTROLS BAR
      ==================================================================== */}
      <section className={styles.filterBarSection}>
        <div className="container">
          <div className={styles.filterControlsRow}>
            <div className={styles.categoryChips}>
              {BUNDLE_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  className={`${styles.chipBtn} ${
                    selectedCategory === cat.slug ? styles.activeChip : ''
                  }`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className={styles.searchWrap}>
              <Search size={15} />
              <input
                type="text"
                placeholder="Search eligible tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. PRODUCT CATALOG GRID
      ==================================================================== */}
      <section className={styles.catalogSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.catalogCountText}>
              Showing {displayedProducts.length} qualifying products (180+ QAR)
            </span>
          </div>

          <div className={styles.productsGrid}>
            {displayedProducts.map((product) => {
              const isSelected = selectedProductIds.includes(product.id);
              const isMaxReached = selectedCount >= 20 && !isSelected;

              return (
                <div
                  key={product.id}
                  className={`${styles.bundleProductCard} ${
                    isSelected ? styles.cardSelected : ''
                  }`}
                >
                  <span className={styles.eligibleBadge}>180+ QAR ELIGIBLE</span>

                  <div className={styles.imageWrap}>
                    <img
                      src={product.images[0] || '/placeholder.svg'}
                      alt={product.title}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  <div className={styles.productMeta}>
                    <span className={styles.categoryTag}>{product.category}</span>
                    <h3 className={styles.productTitle} title={product.title}>
                      {product.title}
                    </h3>

                    <div className={styles.priceRow}>
                      <span className={styles.currency}>QAR</span>
                      <strong className={styles.priceValue}>
                        {product.priceQAR.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className={`${styles.addBtn} ${isSelected ? styles.removeBtn : ''}`}
                      disabled={isMaxReached}
                      onClick={() => handleToggleProduct(product)}
                    >
                      {isSelected ? (
                        <>
                          <Check size={16} /> Selected (Click to remove)
                        </>
                      ) : isMaxReached ? (
                        'Max 20 Reached'
                      ) : (
                        <>
                          <Plus size={16} /> Add to Bundle
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================
          4. STICKY BOTTOM BUNDLE TRAY & LIVE TRACKER
      ==================================================================== */}
      <div className={styles.stickyBottomTray}>
        <div className="container">
          <div className={styles.trayLayout}>
            {/* Left: Progress Bar, Motivation & Selected Avatars */}
            <div className={styles.leftProgressCol}>
              <div className={styles.statusMessageRow}>
                <span className={styles.motivationText}>
                  {selectedCount >= 20 ? (
                    <Award size={16} />
                  ) : selectedCount >= 5 ? (
                    <Flame size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  {getMotivationMessage()}
                </span>
                <span className={styles.counterBadge}>
                  {selectedCount} / 20 Selected
                </span>
              </div>

              {/* Visual 4-Milestone Progress Track */}
              <div className={styles.progressBarWrapper}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${Math.min(100, (selectedCount / 20) * 100)}%` }}
                />
                <div className={styles.milestoneMarkers}>
                  <div className={styles.markerNode} style={{ left: '0%' }}>
                    <span
                      className={`${styles.markerDot} ${
                        selectedCount >= 5 ? styles.reachedDot : ''
                      }`}
                    >
                      5
                    </span>
                  </div>
                  <div className={styles.markerNode} style={{ left: '50%' }}>
                    <span
                      className={`${styles.markerDot} ${
                        selectedCount >= 10 ? styles.reachedDot : ''
                      }`}
                    >
                      10
                    </span>
                  </div>
                  <div className={styles.markerNode} style={{ left: '75%' }}>
                    <span
                      className={`${styles.markerDot} ${
                        selectedCount >= 15 ? styles.reachedDot : ''
                      }`}
                    >
                      15
                    </span>
                  </div>
                  <div className={styles.markerNode} style={{ left: '100%' }}>
                    <span
                      className={`${styles.markerDot} ${
                        selectedCount >= 20 ? styles.reachedDot : ''
                      }`}
                    >
                      20
                    </span>
                  </div>
                </div>
              </div>

              {/* Horizontal Scroll of Selected Thumbnails */}
              {selectedProducts.length > 0 && (
                <div className={styles.selectedThumbnailsRow}>
                  {selectedProducts.map((p) => (
                    <div key={p.id} className={styles.thumbSlot} title={p.title}>
                      <img src={p.images[0] || '/placeholder.svg'} alt={p.title} />
                      <button
                        type="button"
                        className={styles.removeThumbBtn}
                        onClick={() => handleRemoveFromTray(p.id)}
                        aria-label={`Remove ${p.title}`}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Price Calculation & Primary CTA */}
            <div className={styles.rightActionCol}>
              <div className={styles.priceCalculationBox}>
                {bundleSavingsQAR > 0 && (
                  <span className={styles.originalStrikeRow}>
                    QAR {originalSubtotal.toLocaleString()}
                  </span>
                )}
                {bundleSavingsQAR > 0 && (
                  <span className={styles.savingsCalloutRow}>
                    Saved QAR {bundleSavingsQAR.toLocaleString()} ({tierPercent}% OFF)
                  </span>
                )}
                <div className={styles.finalTotalRow}>
                  <span>Total:</span>
                  <strong>QAR {bundleFinalPrice.toLocaleString()}</strong>
                </div>
              </div>

              <button
                type="button"
                className={`${styles.primaryCtaBtn} ${
                  selectedCount < 5
                    ? styles.lockedBtn
                    : selectedCount === 20
                    ? styles.vipActiveBtn
                    : ''
                }`}
                disabled={selectedCount < 5}
                onClick={handleAddBundleToCart}
              >
                {selectedCount < 5 ? (
                  <>Add {5 - selectedCount} more to unlock 5% OFF</>
                ) : selectedCount === 20 ? (
                  <>
                    <Gift size={16} /> Claim 20% OFF + VIP Gift ➔
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add Bundle to Cart ({tierPercent}% OFF) ➔
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BundleBuilderPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading Bundle Studio...</div>}>
      <BundleBuilderContent />
    </Suspense>
  );
}
