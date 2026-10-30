'use client';

// =============================================================================
// Qatify — Dedicated Tiered Bundle Builder & Savings Studio (`/bundle-builder`)
// Newegg-Inspired Split Layout: Left Filter Sidebar + Product Rows Table + Bottom Tray
// - Tiers: 5 items = 5%, 10 items = 10%, 15 items = 15%, 20 items = 20%
// - Up to 20 products
// - URL sync (?items=qat-004,qat-009...)
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
  Gift,
  Flame,
  Award,
  SlidersHorizontal,
  Star,
  RotateCcw,
  ChevronDown,
  Layers,
  CheckSquare,
  Square,
  Filter,
  Tag,
  Zap,
  Truck,
  Lock,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types/product';
import styles from './page.module.scss';

// Helper to reliably extract product ID (handles both Convex productId / _id and standard id)
const getProductId = (p: any): string => {
  if (!p) return '';
  return String(p.id || p.productId || p._id || '').trim();
};

// Helper to extract clean regular price (ignoring any individual discounts on product page)
const getRegularPrice = (p: any): number => {
  const orig = typeof p.originalPriceQAR === 'number' && !isNaN(p.originalPriceQAR) ? p.originalPriceQAR : 0;
  const curr = typeof p.priceQAR === 'number' && !isNaN(p.priceQAR) ? p.priceQAR : 0;
  return Math.max(orig, curr);
};

// Normalize any catalog product into a bundle-eligible product with clean regular pricing
const normalizeBundleProduct = (raw: any): Product | null => {
  if (!raw) return null;
  const id = getProductId(raw);
  if (!id) return null;

  const regularPrice = getRegularPrice(raw);

  // Strict 180+ QAR threshold (products below 180 QAR are excluded from bundle builder)
  if (regularPrice < 180) return null;

  // In-stock items only
  if (raw.inStock === false) return null;

  return {
    ...raw,
    id,
    priceQAR: regularPrice,
    originalPriceQAR: regularPrice,
    discountPercent: 0,
    isFlashDeal: false,
  } as Product;
};

// Categories for Filter Bar
const BUNDLE_CATEGORIES = [
  { slug: 'all', name: 'All Categories' },
  { slug: 'mobile-accessories', name: 'Mobile Accessories' },
  { slug: 'smartwatches', name: 'Smartwatches & Fit' },
  { slug: 'tws-audio', name: 'TWS & Spatial Audio' },
  { slug: 'chargers-powerbanks', name: 'GaN Chargers & Power' },
  { slug: 'car-accessories', name: 'Car Tech & Mounts' },
  { slug: 'gaming-gear', name: 'Gaming & Desk Tech' },
  { slug: 'drones-cameras', name: 'Drones & Cameras' },
  { slug: 'smart-home', name: 'Smart Home & Ambience' },
  { slug: 'laptop-gear', name: 'Laptop Hubs & Stands' },
  { slug: 'cables-adapters', name: 'Fast Cables & OTG' },
];

const PREDEFINED_PRICE_RANGES = [
  { id: 'all', label: 'All Eligible (180+ QAR)', min: 180, max: 99999 },
  { id: '180-250', label: 'QAR 180 – QAR 250', min: 180, max: 250 },
  { id: '250-350', label: 'QAR 250 – QAR 350', min: 250, max: 350 },
  { id: '350-500', label: 'QAR 350 – QAR 500', min: 350, max: 500 },
  { id: '500-plus', label: 'QAR 500+', min: 500, max: 99999 },
];

function BundleBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setBundleCart, showToast } = useShop();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [pricePreset, setPricePreset] = useState<string>('all');
  const [minPriceInput, setMinPriceInput] = useState<string>('');
  const [maxPriceInput, setMaxPriceInput] = useState<string>('');
  const [activeMinPrice, setActiveMinPrice] = useState<number | null>(null);
  const [activeMaxPrice, setActiveMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Selected Products for the Bundle (Max 20)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Query live store products directly from Convex product catalog
  const liveProducts = useQuery(api.products.list, { limit: 250 });

  // Base Products Catalog (strictly 180+ QAR regular pricing, no individual discounts)
  const allProducts: Product[] = useMemo(() => {
    const rawCatalog: any[] =
      liveProducts && liveProducts.length > 0 ? liveProducts : PRODUCTS;

    const list: Product[] = [];
    const seenIds = new Set<string>();

    for (const raw of rawCatalog) {
      const item = normalizeBundleProduct(raw);
      if (item && !seenIds.has(item.id)) {
        seenIds.add(item.id);
        list.push(item);
      }
    }

    return list;
  }, [liveProducts]);

  // Read URL query params (?items=qat-004,qat-009...) from homepage card redirect
  useEffect(() => {
    const itemsParam = searchParams.get('items');
    if (itemsParam) {
      const ids = itemsParam
        .split(',')
        .map((s) => s.trim())
        .filter((id) => id && id !== 'undefined' && id !== 'null' && id !== '[object Object]');
      if (ids.length > 0) {
        setSelectedProductIds(Array.from(new Set(ids)).slice(0, 20));
        showToast(
          'Items Carried Over! 🎯',
          `${ids.length} products loaded into your bundle.`,
          'info'
        );
      }
    }
  }, [searchParams]);

  // Extract all unique brands with product counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of allProducts) {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    }
    return counts;
  }, [allProducts]);

  const availableBrands = useMemo(() => {
    return Object.keys(brandCounts).sort();
  }, [brandCounts]);

  // Extract category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of allProducts) {
      const cat = p.categorySlug || 'other';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [allProducts]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  // Handle Price Preset change
  const handlePricePresetChange = (presetId: string) => {
    setPricePreset(presetId);
    setMinPriceInput('');
    setMaxPriceInput('');
    setActiveMinPrice(null);
    setActiveMaxPrice(null);
  };

  // Handle Manual Custom Price Range Submit (min starts at 180 QAR)
  const handleCustomPriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = parseFloat(minPriceInput);
    const maxVal = parseFloat(maxPriceInput);
    const min = !isNaN(minVal) ? Math.max(180, minVal) : 180;
    const max = !isNaN(maxVal) && maxVal >= min ? maxVal : null;
    setActiveMinPrice(min);
    setActiveMaxPrice(max);
    setPricePreset('custom');
  };

  // Handle Brand Toggle
  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setSearchQuery('');
    setSearchInput('');
    setPricePreset('all');
    setMinPriceInput('');
    setMaxPriceInput('');
    setActiveMinPrice(null);
    setActiveMaxPrice(null);
    setMinRating(0);
    setSortBy('featured');
  };

  const isAnyFilterActive =
    selectedCategory !== 'all' ||
    selectedBrands.length > 0 ||
    searchQuery.trim() !== '' ||
    pricePreset !== 'all' ||
    activeMinPrice !== null ||
    activeMaxPrice !== null ||
    minRating > 0;

  // Filter and Sort Products (strictly >= 180 QAR)
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Strict 180+ QAR threshold
        if (typeof p.priceQAR !== 'number' || p.priceQAR < 180) return false;

        // Category filter
        if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
          return false;
        }

        // Price filter
        if (pricePreset !== 'all' && pricePreset !== 'custom') {
          const range = PREDEFINED_PRICE_RANGES.find((r) => r.id === pricePreset);
          if (range) {
            if (p.priceQAR < range.min || p.priceQAR > range.max) return false;
          }
        } else if (pricePreset === 'custom') {
          if (activeMinPrice !== null && p.priceQAR < activeMinPrice) return false;
          if (activeMaxPrice !== null && p.priceQAR > activeMaxPrice) return false;
        }

        // Rating filter
        if (minRating > 0 && (p.rating || 0) < minRating) {
          return false;
        }

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchBrand = p.brand?.toLowerCase().includes(q);
          const matchCat = p.category?.toLowerCase().includes(q);
          const matchDesc = p.shortDescription?.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchCat && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceQAR - b.priceQAR;
        if (sortBy === 'price-desc') return b.priceQAR - a.priceQAR;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        // Featured (default): bestsellers & trending first
        const scoreA = (a.isBestSeller ? 2 : 0) + (a.isTrending ? 1 : 0);
        const scoreB = (b.isBestSeller ? 2 : 0) + (b.isTrending ? 1 : 0);
        return scoreB - scoreA;
      });
  }, [
    allProducts,
    selectedCategory,
    selectedBrands,
    pricePreset,
    activeMinPrice,
    activeMaxPrice,
    minRating,
    searchQuery,
    sortBy,
  ]);

  // Selected Products detail objects (matching normalized product ID)
  const selectedProducts = useMemo(() => {
    const rawCatalog: any[] =
      liveProducts && liveProducts.length > 0 ? liveProducts : PRODUCTS;

    return selectedProductIds
      .map((id) => {
        const found = allProducts.find((p) => getProductId(p) === id);
        if (found) return found;

        // Fallback search in catalog in case product was carried over before list populated
        const fallback = rawCatalog.find((p) => getProductId(p) === id);
        if (fallback) {
          return normalizeBundleProduct(fallback);
        }
        return null;
      })
      .filter(Boolean) as Product[];
  }, [selectedProductIds, allProducts, liveProducts]);

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

  // Toggle Product Selection (Individual Add / Remove by distinct ID)
  const handleToggleProduct = (product: Product) => {
    const pId = getProductId(product);
    if (!pId) return;

    const isCurrentlySelected = selectedProductIds.includes(pId);

    if (isCurrentlySelected) {
      setSelectedProductIds((prev) => prev.filter((id) => id !== pId));
      showToast('Removed from Bundle', `${product.title.slice(0, 30)} removed.`, 'info');
    } else {
      if (selectedProductIds.length >= 20) {
        showToast(
          'Maximum 20 Items Reached',
          'You can select up to 20 items in a single bundle.',
          'warning'
        );
        return;
      }

      const newCount = selectedProductIds.length + 1;
      const unlockMsg =
        newCount < 5
          ? `Add ${5 - newCount} more for 5% OFF!`
          : newCount === 5
          ? '🎉 5% OFF UNLOCKED!'
          : newCount === 10
          ? '🎉 10% OFF UNLOCKED!'
          : newCount === 15
          ? '🎉 15% OFF UNLOCKED!'
          : newCount === 20
          ? '🏆 20% OFF + VIP GIFT UNLOCKED!'
          : `${tierPercent}% OFF applied!`;

      setSelectedProductIds((prev) => (prev.includes(pId) ? prev : [...prev, pId]));
      showToast('Item Added to Bundle! 🎯', `${product.title.slice(0, 30)} added. ${unlockMsg}`, 'success');
    }
  };

  // Remove a product from the sticky tray directly
  const handleRemoveFromTray = (productId: string) => {
    setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
  };

  // Add the entire bundle to Dedicated Bundle Cart and route to /bundle-cart
  const handleAddBundleToCart = () => {
    if (selectedCount === 0) return;
    setBundleCart(selectedProducts);
    showToast(
      'Proceeding to Bundle Cart! 🎁',
      `${selectedCount} items configured in your dedicated wholesale bundle.`,
      'success'
    );
    router.push('/bundle-cart');
  };

  // Motivation message
  const getMotivationMessage = () => {
    if (selectedCount === 0) return 'Select 5 to 20 items to unlock tier savings!';
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

  // Extract key specs for table presentation
  const getProductKeySpecs = (p: Product): { label: string; value: string }[] => {
    const specs = p.specifications || {};
    const entries = Object.entries(specs);
    if (entries.length === 0) {
      return [
        { label: 'Category', value: p.subcategory || p.category },
        { label: 'Condition', value: 'Brand New' },
      ];
    }
    return entries.slice(0, 2).map(([k, v]) => ({ label: k, value: v }));
  };

  return (
    <div className={styles.pageWrapper}>
      {/* ===================================================================
          1. HEADER WITH 4-TIER PROGRESS LADDER (CLEAN WHITE VALUE STUDIO)
      ==================================================================== */}
      <section className={styles.heroHeader}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.badgeRow}>
              <span className={styles.vipPill}>
                <Tag size={13} /> QATAR EXCLUSIVE BUNDLE SAVINGS
              </span>
              <span className={styles.minSpendNotice}>
                Auto-applied at checkout • No promo code needed
              </span>
            </div>

            <h1 className={styles.heroTitle}>
              Buy More, Pay Less: Save Up to 20% on Every Single Item
            </h1>

            <p className={styles.heroSubtitle}>
              Pick 5 to 20 items to unlock wholesale-level savings. Discounts apply automatically across your entire bundle with direct express delivery across Qatar.
            </p>

            {/* 4-Tier Ladder Visual */}
            <div className={styles.tierLadderGrid}>
              <div
                className={`${styles.tierCard} ${
                  selectedCount >= 5 && selectedCount < 10 ? styles.activeTier : ''
                }`}
              >
                <div className={styles.tierDot}>
                  {selectedCount >= 5 ? <Check size={14} strokeWidth={3} /> : '5'}
                </div>
                <div className={styles.tierInfo}>
                  <strong>5 Items: 5% OFF</strong>
                  <span>{selectedCount >= 5 ? '✓ Tier 1 Unlocked' : 'Starter Bundle'}</span>
                </div>
              </div>

              <div
                className={`${styles.tierCard} ${
                  selectedCount >= 10 && selectedCount < 15 ? styles.activeTier : ''
                }`}
              >
                <div className={styles.tierDot}>
                  {selectedCount >= 10 ? <Check size={14} strokeWidth={3} /> : '10'}
                </div>
                <div className={styles.tierInfo}>
                  <strong>10 Items: 10% OFF</strong>
                  <span>{selectedCount >= 10 ? '✓ Double Savings Unlocked' : 'Double Savings 🔥'}</span>
                </div>
              </div>

              <div
                className={`${styles.tierCard} ${
                  selectedCount >= 15 && selectedCount < 20 ? styles.activeTier : ''
                }`}
              >
                <div className={styles.tierDot}>
                  {selectedCount >= 15 ? <Check size={14} strokeWidth={3} /> : '15'}
                </div>
                <div className={styles.tierInfo}>
                  <strong>15 Items: 15% OFF</strong>
                  <span>{selectedCount >= 15 ? '✓ Super Bundle Unlocked' : 'Super Saver'}</span>
                </div>
              </div>

              <div
                className={`${styles.tierCard} ${
                  selectedCount === 20 ? styles.vipTier : ''
                }`}
              >
                <div className={styles.tierDot}>
                  {selectedCount === 20 ? <Check size={14} strokeWidth={3} /> : '20'}
                </div>
                <div className={styles.tierInfo}>
                  <strong>20 Items: 20% OFF</strong>
                  <span>{selectedCount === 20 ? '✓ Max VIP Tier Unlocked 🎁' : '+ 20% VIP Coupon Gift 🎁'}</span>
                </div>
              </div>
            </div>

            {/* Quick Trust Highlights (Text + Icons) */}
            <div className={styles.trustBadgeRow}>
              <div className={styles.trustItem}>
                <Zap size={14} className={styles.trustIcon} />
                <span>Instant Auto-Discount at Checkout</span>
              </div>
              <div className={styles.trustItem}>
                <Truck size={14} className={styles.trustIcon} />
                <span>Direct Air Express to Qatar</span>
              </div>
              <div className={styles.trustItem}>
                <Lock size={14} className={styles.trustIcon} />
                <span>Secure &amp; Encrypted Payment</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================
          2. MAIN SPLIT BUILDER LAYOUT (SIDEBAR FILTER + PRODUCT TABLE)
      ==================================================================== */}
      <div className="container">
        <div className={styles.builderMainLayout}>
          {/* MOBILE FILTER TOGGLE BUTTON */}
          <div className={styles.mobileFilterToggleRow}>
            <button
              type="button"
              className={styles.mobileFilterBtn}
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              <SlidersHorizontal size={15} />
              <span>Filters {isAnyFilterActive ? '(Active)' : ''}</span>
            </button>
            <span className={styles.productCountSimple}>
              {filteredProducts.length} Products
            </span>
          </div>

          {/* =================================================================
              LEFT SIDEBAR: NEWEGG-STYLE FILTERS
          ================================================================== */}
          <aside
            className={`${styles.sidebarFilter} ${
              mobileFilterOpen ? styles.mobileOpen : ''
            }`}
          >
            <div className={styles.sidebarHeader}>
              <div className={styles.filterTitleGroup}>
                <Filter size={16} />
                <span className={styles.sidebarTitle}>Filters</span>
              </div>
              {isAnyFilterActive && (
                <button
                  type="button"
                  className={styles.resetAllBtn}
                  onClick={handleResetFilters}
                >
                  <RotateCcw size={12} />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Price Filter Section */}
            <div className={styles.filterSection}>
              <div className={styles.sectionTitle}>Price (QAR)</div>

              {/* Min - Max Input Boxes with GO button */}
              <form onSubmit={handleCustomPriceSubmit} className={styles.customPriceRow}>
                <div className={styles.priceInputWrap}>
                  <span className={styles.currencyPrefix}>QAR</span>
                  <input
                    type="number"
                    placeholder="Min 180"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    min="180"
                  />
                </div>
                <span className={styles.priceDivider}>to</span>
                <div className={styles.priceInputWrap}>
                  <span className={styles.currencyPrefix}>QAR</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    min="180"
                  />
                </div>
                <button type="submit" className={styles.priceGoBtn} title="Apply custom price">
                  GO
                </button>
              </form>

              {/* Predefined Range Checkboxes / Radios */}
              <div className={styles.radioList}>
                {PREDEFINED_PRICE_RANGES.map((range) => (
                  <label key={range.id} className={styles.checkboxItem}>
                    <input
                      type="radio"
                      name="pricePreset"
                      checked={pricePreset === range.id}
                      onChange={() => handlePricePresetChange(range.id)}
                    />
                    <span className={styles.checkCustomRadio} />
                    <span className={styles.checkLabel}>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories / Department Filter */}
            <div className={styles.filterSection}>
              <div className={styles.sectionTitle}>Department</div>
              <div className={styles.categoryRadioList}>
                {BUNDLE_CATEGORIES.map((cat) => {
                  const count =
                    cat.slug === 'all'
                      ? allProducts.length
                      : categoryCounts[cat.slug] || 0;
                  if (cat.slug !== 'all' && count === 0) return null;
                  return (
                    <label key={cat.slug} className={styles.categoryRowItem}>
                      <input
                        type="radio"
                        name="selectedCategory"
                        checked={selectedCategory === cat.slug}
                        onChange={() => setSelectedCategory(cat.slug)}
                      />
                      <span className={styles.checkCustomRadio} />
                      <span className={styles.catName}>{cat.name}</span>
                      <span className={styles.catCount}>({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Brand Filter */}
            <div className={styles.filterSection}>
              <div className={styles.sectionTitle}>Brand</div>
              <div className={styles.brandList}>
                {availableBrands.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  const count = brandCounts[brand] || 0;
                  return (
                    <label key={brand} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleBrand(brand)}
                      />
                      <span className={styles.checkCustomBox}>
                        {isChecked && <Check size={11} strokeWidth={3} />}
                      </span>
                      <span className={styles.checkLabel}>{brand}</span>
                      <span className={styles.brandCount}>({count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Customer Rating Filter */}
            <div className={styles.filterSection}>
              <div className={styles.sectionTitle}>Customer Rating</div>
              <div className={styles.ratingList}>
                {[
                  { value: 4.5, label: '4.5★ & Above' },
                  { value: 4.0, label: '4.0★ & Above' },
                  { value: 0, label: 'All Ratings' },
                ].map((item) => (
                  <label key={item.value} className={styles.checkboxItem}>
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === item.value}
                      onChange={() => setMinRating(item.value)}
                    />
                    <span className={styles.checkCustomRadio} />
                    <span className={styles.checkLabel}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile Close Button */}
            <div className={styles.mobileCloseWrap}>
              <button
                type="button"
                className={styles.applyFilterMobileBtn}
                onClick={() => setMobileFilterOpen(false)}
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </aside>

          {/* =================================================================
              RIGHT MAIN AREA: SEARCH & SORT BAR + NEWEGG PRODUCT TABLE
          ================================================================== */}
          <main className={styles.mainContent}>
            {/* Top Control Bar: Search Within + Sort By */}
            <div className={styles.topControlBar}>
              <form onSubmit={handleSearchSubmit} className={styles.searchWithinForm}>
                <div className={styles.searchBoxWrap}>
                  <Search size={15} className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search within results..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  {searchInput && (
                    <button
                      type="button"
                      className={styles.clearSearchBtn}
                      onClick={handleClearSearch}
                      title="Clear search"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
                <button type="submit" className={styles.searchSubmitBtn}>
                  SEARCH
                </button>
              </form>

              <div className={styles.sortCountGroup}>
                <div className={styles.sortWrapper}>
                  <span className={styles.sortLabel}>Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={styles.sortSelect}
                  >
                    <option value="featured">Featured Items</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Product Name (A-Z)</option>
                  </select>
                </div>

                <span className={styles.resultsCountBadge}>
                  {filteredProducts.length} Products | Page 1/1
                </span>
              </div>
            </div>

            {/* Active Filter Chips Row */}
            {isAnyFilterActive && (
              <div className={styles.activeChipsRow}>
                <span className={styles.activeLabel}>Active Filters:</span>
                {selectedCategory !== 'all' && (
                  <span className={styles.filterChip}>
                    Category: {BUNDLE_CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory('all')}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedBrands.map((brand) => (
                  <span key={brand} className={styles.filterChip}>
                    Brand: {brand}
                    <button onClick={() => handleToggleBrand(brand)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {searchQuery && (
                  <span className={styles.filterChip}>
                    Keyword: &quot;{searchQuery}&quot;
                    <button onClick={handleClearSearch}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {pricePreset !== 'all' && (
                  <span className={styles.filterChip}>
                    Price:{' '}
                    {pricePreset === 'custom'
                      ? `QAR ${activeMinPrice || 0} - ${activeMaxPrice || 'Max'}`
                      : PREDEFINED_PRICE_RANGES.find((r) => r.id === pricePreset)?.label}
                    <button onClick={() => handlePricePresetChange('all')}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className={styles.filterChip}>
                    Rating: {minRating}★+
                    <button onClick={() => setMinRating(0)}>
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  className={styles.clearAllLink}
                  onClick={handleResetFilters}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* NEWEGG-STYLE PRODUCT TABLE */}
            <div className={styles.tableResponsiveWrap}>
              <table className={styles.productTable}>
                <thead>
                  <tr>
                    <th className={styles.colProduct}>Product</th>
                    <th className={styles.colBrand}>Brand</th>
                    <th className={styles.colSpecs}>Key Highlights</th>
                    <th className={styles.colRating}>Rating</th>
                    <th className={styles.colPrice}>Price</th>
                    <th className={styles.colAction}>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.emptyTableState}>
                        <div className={styles.emptyContent}>
                          <Sparkles size={32} />
                          <h3>No tech products match your filters</h3>
                          <p>Try resetting some filters or searching with different keywords.</p>
                          <button
                            type="button"
                            className={styles.resetEmptyBtn}
                            onClick={handleResetFilters}
                          >
                            Reset All Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const pId = getProductId(product);
                      const isSelected = selectedProductIds.includes(pId);
                      const isMaxReached = selectedCount >= 20 && !isSelected;
                      const specs = getProductKeySpecs(product);

                      return (
                        <tr
                          key={pId}
                          className={`${styles.productRow} ${
                            isSelected ? styles.rowSelected : ''
                          }`}
                        >
                          {/* PRODUCT COLUMN */}
                          <td className={styles.colProduct}>
                            <div className={styles.productCellFlex}>
                              <Link
                                href={`/products/${product.slug}`}
                                className={styles.productThumbLink}
                              >
                                <img
                                  src={product.images[0] || '/placeholder.svg'}
                                  alt={product.title}
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                      '/placeholder.svg';
                                  }}
                                />
                              </Link>

                              <div className={styles.productInfoWrap}>
                                <Link
                                  href={`/products/${product.slug}`}
                                  className={styles.productTitleLink}
                                  title={product.title}
                                >
                                  {product.title}
                                </Link>

                                <div className={styles.badgeRow}>
                                  <span className={styles.bundleEligibleBadge}>
                                    Bundle Eligible
                                  </span>
                                  {product.inStock !== false && (
                                    <span className={styles.inStockTag}>✓ In Stock</span>
                                  )}
                                </div>

                                {product.shortDescription && (
                                  <div className={styles.promoNoteText}>
                                    {product.shortDescription.slice(0, 65)}...
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* BRAND COLUMN */}
                          <td className={styles.colBrand}>
                            <span className={styles.brandBadge}>{product.brand}</span>
                          </td>

                          {/* KEY HIGHLIGHTS / SPECS COLUMN */}
                          <td className={styles.colSpecs}>
                            <div className={styles.specsStack}>
                              {specs.map((s, idx) => (
                                <div key={idx} className={styles.specLine}>
                                  <span className={styles.specLabel}>{s.label}:</span>{' '}
                                  <span className={styles.specVal}>
                                    {s.value.length > 28 ? s.value.slice(0, 28) + '...' : s.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* RATING COLUMN */}
                          <td className={styles.colRating}>
                            <div className={styles.ratingWrap}>
                              <div className={styles.starIcons}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={12}
                                    fill={
                                      star <= Math.round(product.rating || 5)
                                        ? '#f59e0b'
                                        : '#e2e8f0'
                                    }
                                    stroke="none"
                                  />
                                ))}
                              </div>
                              <span className={styles.reviewCount}>
                                ({product.reviewCount || 42})
                              </span>
                            </div>
                          </td>

                          {/* PRICE COLUMN (Clean standard price, no individual discount) */}
                          <td className={styles.colPrice}>
                            <div className={styles.priceWrap}>
                              <span className={styles.priceValue}>
                                QAR{' '}
                                {product.priceQAR.toLocaleString('en-US', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          </td>

                          {/* ACTION / SELECT BUTTON COLUMN */}
                          <td className={styles.colAction}>
                            <div className={styles.actionColWrap}>
                              <button
                                type="button"
                                className={`${styles.selectButton} ${
                                  isSelected ? styles.selectedState : ''
                                }`}
                                disabled={isMaxReached}
                                onClick={() => handleToggleProduct(product)}
                              >
                                {isSelected ? (
                                  <>
                                    <Check size={13} strokeWidth={3} />
                                    <span>SELECTED</span>
                                  </>
                                ) : isMaxReached ? (
                                  'MAX 20'
                                ) : (
                                  <>
                                    <Plus size={13} strokeWidth={3} />
                                    <span>SELECT</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* ===================================================================
          3. STICKY BOTTOM BUNDLE TRAY & LIVE TRACKER
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
                  {selectedProducts.map((p) => {
                    const pId = getProductId(p);
                    return (
                      <div key={pId} className={styles.thumbSlot} title={p.title}>
                        <img src={p.images[0] || '/placeholder.svg'} alt={p.title} />
                        <button
                          type="button"
                          className={styles.removeThumbBtn}
                          onClick={() => handleRemoveFromTray(pId)}
                          aria-label={`Remove ${p.title}`}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Price Calculation & Primary CTA */}
            <div className={styles.rightActionCol}>
              <div className={styles.priceCalculationBox}>
                {bundleSavingsQAR > 0 && (
                  <span className={styles.originalStrikeRow}>
                    QAR {originalSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                )}
                {bundleSavingsQAR > 0 && (
                  <span className={styles.savingsCalloutRow}>
                    Saved QAR {bundleSavingsQAR.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({tierPercent}% OFF)
                  </span>
                )}
                <div className={styles.finalTotalRow}>
                  <span>Total:</span>
                  <strong>
                    QAR{' '}
                    {bundleFinalPrice.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                className={`${styles.primaryCtaBtn} ${
                  selectedCount === 0
                    ? styles.lockedBtn
                    : selectedCount === 20
                    ? styles.vipActiveBtn
                    : ''
                }`}
                disabled={selectedCount === 0}
                onClick={handleAddBundleToCart}
              >
                {selectedCount === 0 ? (
                  <>Select at least 1 item</>
                ) : selectedCount < 5 ? (
                  <>Proceed to Bundle Cart (Regular Price) ➔</>
                ) : selectedCount === 20 ? (
                  <>
                    <Gift size={16} /> Proceed to Bundle Cart (20% OFF + VIP Gift) ➔
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Proceed to Bundle Cart ({tierPercent}% OFF) ➔
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
    <Suspense
      fallback={
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          Loading Qatify Bundle Studio...
        </div>
      }
    >
      <BundleBuilderContent />
    </Suspense>
  );
}
