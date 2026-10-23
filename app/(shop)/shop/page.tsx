'use client';

// =============================================================================
// Qatify — Product Catalog / Listing Page (`/shop`)
// Faceted Sidebar Filters + Quick QAR Pills + 4-Col Dense Grid vs List Toggle
// =============================================================================

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Filter,
  Grid3X3,
  List,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Star,
  SlidersHorizontal,
  Check,
  Plane,
} from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { Product, SortOption } from '@/types/product';
import styles from './page.module.scss';

// Brands available in mock data
const ALL_BRANDS = ['AcoustiQ', 'VoltGrid', 'AeroDrive', 'GlowMatrix', 'Chronos'];

function ShopContent() {
  const searchParams = useSearchParams();

  // URL query params initialization
  const initialCategory = searchParams.get('cat') || '';
  const initialSearch = searchParams.get('q') || '';
  const initialFilter = searchParams.get('filter') || '';
  const initialSort = (searchParams.get('sort') as SortOption) || 'trending';

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>(
    initialFilter === 'under-99'
      ? 'under-100'
      : initialFilter === 'under-50'
      ? 'under-50'
      : 'all'
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  // Toggle brand selection
  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSelectedPriceTier('all');
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
    setMinDiscount(0);
    setSortBy('trending');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category filter
      if (selectedCategory && product.categorySlug !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesTags = product.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesBrand && !matchesTags) {
          return false;
        }
      }

      // Price Tier filter
      if (selectedPriceTier === 'under-50' && product.priceQAR >= 50) return false;
      if (selectedPriceTier === 'under-100' && product.priceQAR >= 100) return false;
      if (selectedPriceTier === '100-200' && (product.priceQAR < 100 || product.priceQAR > 200)) return false;
      if (selectedPriceTier === '200-plus' && product.priceQAR < 200) return false;

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // In stock only
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // Minimum discount
      if (minDiscount > 0 && product.discountPercent < minDiscount) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.priceQAR - b.priceQAR;
        case 'price-desc':
          return b.priceQAR - a.priceQAR;
        case 'discount':
          return b.discountPercent - a.discountPercent;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.isNewArrival ? -1 : 1;
        case 'trending':
        default:
          return b.soldCount - a.soldCount;
      }
    });
  }, [
    selectedCategory,
    searchQuery,
    selectedPriceTier,
    selectedBrands,
    minRating,
    inStockOnly,
    minDiscount,
    sortBy,
  ]);

  // Active filters count for badges
  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedPriceTier !== 'all' ? 1 : 0) +
    selectedBrands.length +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className={styles.shopPage}>
      <div className="container">
        {/* Breadcrumb & Catalog Title */}
        <div className={styles.headerBanner}>
          <div className={styles.headerInfo}>
            <span className={styles.breadcrumb}>
              Home / Qatar Dropship Catalog / {selectedCategory ? selectedCategory.replace('-', ' ') : 'All Products'}
            </span>
            <h1 className={styles.catalogHeading}>
              {selectedCategory
                ? CATEGORIES.find((c) => c.slug === selectedCategory)?.name || 'Catalog'
                : 'Qatar Dropship Catalog'}
            </h1>
            <p className={styles.catalogDesc}>
              Direct air freight fulfillment from certified export hubs to Hamad International Airport. 6–10 Days tracked delivery across Doha, Lusail, Al Rayyan, Al Wakrah, and Al Khor.
            </p>
          </div>

          <div className={styles.quickQatarAssurance}>
            <Plane size={16} />
            <span>Tracked Air Express • Hamad Airport Customs Pre-Clearance</span>
          </div>
        </div>

        {/* Quick Price Tier Filter Pills (High Density Regional UX) */}
        <div className={styles.quickPillsStrip}>
          <button
            type="button"
            onClick={() => setSelectedPriceTier('all')}
            className={`${styles.pricePill} ${selectedPriceTier === 'all' ? styles.active : ''}`}
          >
            All Prices
          </button>
          <button
            type="button"
            onClick={() => setSelectedPriceTier('under-50')}
            className={`${styles.pricePill} ${selectedPriceTier === 'under-50' ? styles.active : ''}`}
          >
            Under QAR 50
          </button>
          <button
            type="button"
            onClick={() => setSelectedPriceTier('under-100')}
            className={`${styles.pricePill} ${selectedPriceTier === 'under-100' ? styles.active : ''}`}
          >
            Under QAR 100
          </button>
          <button
            type="button"
            onClick={() => setSelectedPriceTier('100-200')}
            className={`${styles.pricePill} ${selectedPriceTier === '100-200' ? styles.active : ''}`}
          >
            QAR 100 – QAR 200
          </button>
          <button
            type="button"
            onClick={() => setSelectedPriceTier('200-plus')}
            className={`${styles.pricePill} ${selectedPriceTier === '200-plus' ? styles.active : ''}`}
          >
            QAR 200+
          </button>
        </div>

        {/* Main Catalog Workspace: Sidebar + Products */}
        <div className={styles.catalogLayout}>
          {/* Backdrop for Mobile / Tablet Filter Drawer */}
          {isMobileFiltersOpen && (
            <div
              className={styles.mobileBackdrop}
              onClick={() => setIsMobileFiltersOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* =================================================================
              SIDEBAR FILTERS (Sticky Desktop, Sheet on Mobile)
          ================================================================== */}
          <aside
            className={`${styles.filterSidebar} ${
              isMobileFiltersOpen ? styles.mobileOpen : ''
            }`}
          >
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarTitleWrap}>
                <SlidersHorizontal size={16} />
                <span className={styles.sidebarTitle}>Faceted Filters</span>
                {activeFiltersCount > 0 && (
                  <span className={styles.filterCountBadge}>{activeFiltersCount}</span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={styles.resetBtn}
                >
                  <RotateCcw size={12} />
                  <span>Clear</span>
                </button>
              )}
              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className={styles.mobileCloseBtn}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.sidebarBody}>
              {/* Category Group */}
              <div className={styles.filterGroup}>
                <h3 className={styles.filterGroupTitle}>Categories</h3>
                <div className={styles.categoryRadioList}>
                  <label className={styles.radioOption}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                    />
                    <span className={styles.radioLabel}>All Categories</span>
                    <span className={styles.radioCount}>{PRODUCTS.length}</span>
                  </label>
                  {CATEGORIES.map((cat) => (
                    <label key={cat.id} className={styles.radioOption}>
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.slug}
                        onChange={() => setSelectedCategory(cat.slug)}
                      />
                      <span className={styles.radioLabel}>{cat.name}</span>
                      <span className={styles.radioCount}>{cat.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands Group */}
              <div className={styles.filterGroup}>
                <h3 className={styles.filterGroupTitle}>Brand & Ecosystem</h3>
                <div className={styles.checkboxList}>
                  {ALL_BRANDS.map((brand) => (
                    <label key={brand} className={styles.checkboxOption}>
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleToggleBrand(brand)}
                      />
                      <span className={styles.checkLabel}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div className={styles.filterGroup}>
                <h3 className={styles.filterGroupTitle}>Customer Rating</h3>
                <div className={styles.ratingOptions}>
                  {[4.8, 4.5, 4.0].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      className={`${styles.ratingFilterBtn} ${
                        minRating === rating ? styles.active : ''
                      }`}
                    >
                      <Star size={13} fill="#FACC15" color="#FACC15" />
                      <span>{rating}★ & above</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount Percentage */}
              <div className={styles.filterGroup}>
                <h3 className={styles.filterGroupTitle}>Discount Value</h3>
                <div className={styles.discountPills}>
                  {[20, 30, 40].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setMinDiscount(minDiscount === pct ? 0 : pct)}
                      className={`${styles.discountFilterBtn} ${
                        minDiscount === pct ? styles.active : ''
                      }`}
                    >
                      {pct}% Off & More
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles: In Stock Only */}
              <div className={styles.filterGroup}>
                <label className={styles.switchRow}>
                  <span className={styles.switchLabel}>In Stock Only</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className={styles.toggleInput}
                  />
                </label>
              </div>
            </div>

            {/* Mobile Apply Button */}
            <div className={styles.mobileApplyFooter}>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className={styles.applyFiltersBtn}
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </aside>

          {/* =================================================================
              PRODUCTS CATALOG WORKSPACE
          ================================================================== */}
          <div className={styles.productsWorkspace}>
            {/* Catalog Toolbar */}
            <div className={styles.catalogToolbar}>
              <div className={styles.toolbarLeft}>
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className={styles.mobileFilterToggle}
                >
                  <Filter size={15} />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className={styles.filterCountMini}>{activeFiltersCount}</span>
                  )}
                </button>

                <div className={styles.resultCount}>
                  Showing <strong>{filteredProducts.length}</strong> items
                  {selectedCategory && (
                    <span> in <em>{selectedCategory}</em></span>
                  )}
                </div>
              </div>

              <div className={styles.toolbarRight}>
                {/* Sort Dropdown */}
                <div className={styles.sortWrapper}>
                  <label htmlFor="sortBy" className={styles.sortLabel}>
                    Sort by:
                  </label>
                  <div className={styles.sortSelectWrap}>
                    <select
                      id="sortBy"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className={styles.sortSelect}
                    >
                      <option value="trending">Trending in Qatar</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="discount">Biggest Discount (%)</option>
                      <option value="rating">Top Rated (★)</option>
                      <option value="newest">Newest Arrivals</option>
                    </select>
                    <ChevronDown size={13} className={styles.sortChevron} />
                  </div>
                </div>

                {/* View Mode Toggle: Grid vs List */}
                <div className={styles.viewModeToggle}>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                    aria-label="List view"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Removable Tags */}
            {activeFiltersCount > 0 && (
              <div className={styles.activeFilterTagsStrip}>
                <span className={styles.activeTagTitle}>Active:</span>
                {selectedCategory && (
                  <span className={styles.filterTag}>
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('')}
                      aria-label="Remove category filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedPriceTier !== 'all' && (
                  <span className={styles.filterTag}>
                    Price: {selectedPriceTier.replace('-', ' ')}
                    <button
                      onClick={() => setSelectedPriceTier('all')}
                      aria-label="Remove price filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedBrands.map((brand) => (
                  <span key={brand} className={styles.filterTag}>
                    {brand}
                    <button
                      onClick={() => handleToggleBrand(brand)}
                      aria-label={`Remove brand ${brand}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {minRating > 0 && (
                  <span className={styles.filterTag}>
                    {minRating}★ & above
                    <button
                      onClick={() => setMinRating(0)}
                      aria-label="Remove rating filter"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className={styles.filterTag}>
                    Search: &quot;{searchQuery}&quot;
                    <button
                      onClick={() => setSearchQuery('')}
                      aria-label="Remove search query"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={styles.clearAllFiltersBtn}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid / List Showcase */}
            {filteredProducts.length === 0 ? (
              <div className={styles.noResultsBox}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h3 className={styles.noResultsTitle}>No matching products found</h3>
                <p className={styles.noResultsDesc}>
                  Try clearing your filters or choosing another category or price tier.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={styles.resetCatalogBtn}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? styles.productsGrid4Col
                    : styles.productsListCol
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopListingPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '40px 0' }}>Loading Qatar Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}

