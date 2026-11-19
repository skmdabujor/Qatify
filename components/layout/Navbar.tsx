'use client';

// =============================================================================
// Qatify — Sticky Two-Tier Header & Mega-Menu (Medium-High Density Layout)
// Top Utility Bar + Predictive Search + Category Strip + Cart Counter
// =============================================================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Search,
  ShoppingCart,
  ShoppingBag,
  User,
  Shield,
  Zap,
  Menu,
  X,
  ChevronDown,
  Plane,
  Sparkles,
  Globe,
  SlidersHorizontal,
  LayoutGrid,
  Check,
  Smartphone,
  Watch,
  Headphones,
  Car,
  Gamepad2,
  Camera,
  Home,
  Laptop,
  Cable,
  ToyBrick,
  Baby,
  Puzzle,
  MessageCircle,
  ArrowRight,
  Layers, Building2,
} from 'lucide-react';
import { QatifyLogo } from '@/components/brand/QatifyLogo';
import { useShop } from '@/context/ShopContext';
import { CATEGORIES, PRODUCTS } from '@/data/products';
import { Product, toProduct } from '@/types/product';
import styles from './Navbar.module.scss';

const POPULAR_SEARCH_TAGS = [
  'MagSafe',
  'ANC Earbuds',
  'GaN Charger',
  'Smartwatch',
  '4K Drone',
  'Under QAR 99',
];

const getCategoryIcon = (iconName?: string, size = 15) => {
  switch (iconName) {
    case 'Smartphone':
      return <Smartphone size={size} />;
    case 'Watch':
      return <Watch size={size} />;
    case 'Headphones':
      return <Headphones size={size} />;
    case 'Zap':
      return <Zap size={size} />;
    case 'Car':
      return <Car size={size} />;
    case 'Gamepad2':
      return <Gamepad2 size={size} />;
    case 'Camera':
      return <Camera size={size} />;
    case 'Home':
      return <Home size={size} />;
    case 'Laptop':
      return <Laptop size={size} />;
    case 'Cable':
      return <Cable size={size} />;
    case 'ToyBrick':
      return <ToyBrick size={size} />;
    case 'Baby':
      return <Baby size={size} />;
    case 'Puzzle':
      return <Puzzle size={size} />;
    case 'Sparkles':
      return <Sparkles size={size} />;
    default:
      return <LayoutGrid size={size} />;
  }
};

export const DESKTOP_NAV_LINKS = [
  { label: 'Mobile Accessories', href: '/shop?cat=mobile-accessories', icon: 'Smartphone' },
  { label: 'Smartwatches', href: '/shop?cat=smartwatches', icon: 'Watch' },
  { label: 'GaN Chargers', href: '/shop?cat=chargers-powerbanks', icon: 'Zap' },
  { label: 'Car Tech', href: '/shop?cat=car-accessories', icon: 'Car' },
  { label: 'Gaming Gear', href: '/shop?cat=gaming-gear', icon: 'Gamepad2' },
  { label: 'Smart Home', href: '/shop?cat=smart-home', icon: 'Home' },
  { label: 'Laptop Gear', href: '/shop?cat=laptop-gear', icon: 'Laptop' },
  { label: 'Toys & Kids', href: '/shop?cat=toys-kids-learning', icon: 'ToyBrick' },
  { label: 'New Arrivals', href: '/shop?sort=newest', icon: 'Sparkles' },
  { label: 'Super Deals', href: '/shop?filter=under-99', icon: 'Zap' },
];

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const {
    cartCount,
    cartSubtotal,
    isHydrated,
    isCartOpen,
    openCart,
    openChat,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useShop();

  const viewer = useQuery(api.users.viewer);
  const isUserAdmin = Boolean(viewer?.isAdmin);

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isSearchCategoryOpen, setIsSearchCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const searchCategoryRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const categoryHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleCategoryMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCategoryMenuOpen((prev) => !prev);
  };

  const handleCategoryMouseEnter = () => {
    if (categoryHoverTimeoutRef.current) {
      clearTimeout(categoryHoverTimeoutRef.current);
      categoryHoverTimeoutRef.current = null;
    }
    setIsCategoryMenuOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    if (categoryHoverTimeoutRef.current) {
      clearTimeout(categoryHoverTimeoutRef.current);
    }
    categoryHoverTimeoutRef.current = setTimeout(() => {
      setIsCategoryMenuOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (categoryHoverTimeoutRef.current) {
        clearTimeout(categoryHoverTimeoutRef.current);
      }
    };
  }, []);

  // Sync localSearch when global searchQuery changes
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search query for Convex database full-text search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(localSearch);
    }, 150);
    return () => clearTimeout(timer);
  }, [localSearch]);

  // Reset keyboard highlight index when search text changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [localSearch]);

  // Live Convex full-text search query
  const liveSearchResults = useQuery(
    api.products.searchProducts,
    debouncedSearch.trim()
      ? {
          searchTerm: debouncedSearch.trim(),
          categorySlug: selectedCategory || undefined,
          limit: 8,
        }
      : 'skip'
  );

  // Real-time suggested products (Convex results merged with instant local product search fallback)
  const suggestedProducts = useMemo(() => {
    const query = localSearch.trim().toLowerCase();
    if (!query) return [];

    // Instant local filtering across title, brand, category, tags
    const localMatches = PRODUCTS.filter((p) => {
      if (selectedCategory && p.categorySlug !== selectedCategory) {
        return false;
      }
      const titleMatch = p.title.toLowerCase().includes(query);
      const brandMatch = p.brand?.toLowerCase().includes(query);
      const catMatch = p.category?.toLowerCase().includes(query);
      const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(query));
      return titleMatch || brandMatch || catMatch || tagMatch;
    });

    if (liveSearchResults && liveSearchResults.length > 0) {
      const liveConverted = liveSearchResults.map(toProduct);
      const seen = new Set<string>();
      const combined: Product[] = [];
      for (const item of [...liveConverted, ...localMatches]) {
        const key = item.slug || item.id;
        if (!seen.has(key)) {
          seen.add(key);
          combined.push(item);
        }
      }
      return combined.slice(0, 8);
    }

    return localMatches.slice(0, 8);
  }, [localSearch, liveSearchResults, selectedCategory]);

  // Matching categories when user types category-related terms
  const matchingCategories = useMemo(() => {
    const query = localSearch.trim().toLowerCase();
    if (!query || query.length < 2) return [];
    return CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query)
    ).slice(0, 3);
  }, [localSearch]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(target)) {
        setIsCategoryMenuOpen(false);
      }
      if (searchCategoryRef.current && !searchCategoryRef.current.contains(target)) {
        setIsSearchCategoryOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setIsSearchFocused(false);
      }
      if (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(target)) {
        setIsMobileSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchFocused(false);
    setIsMobileSearchFocused(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close dropdowns on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCategoryMenuOpen(false);
        setIsSearchCategoryOpen(false);
        setIsSearchFocused(false);
        setIsMobileSearchFocused(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(localSearch);
    const params = new URLSearchParams();
    if (localSearch.trim()) {
      params.set('q', localSearch.trim());
    }
    if (selectedCategory) {
      params.set('cat', selectedCategory);
    }
    const queryString = params.toString();
    router.push(`/shop${queryString ? `?${queryString}` : ''}`);
    setIsSearchFocused(false);
    setIsMobileSearchFocused(false);
    setIsSearchCategoryOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestedProducts.length > 0) {
        setSelectedIndex((prev) =>
          prev < suggestedProducts.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestedProducts.length > 0) {
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestedProducts.length - 1
        );
      }
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestedProducts.length) {
        e.preventDefault();
        const selected = suggestedProducts[selectedIndex];
        setIsSearchFocused(false);
        setIsMobileSearchFocused(false);
        router.push(`/products/${selected.slug}`);
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      setIsMobileSearchFocused(false);
    }
  };

  const handleSelectCategory = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setIsSearchCategoryOpen(false);
    const params = new URLSearchParams();
    if (localSearch.trim()) {
      params.set('q', localSearch.trim());
    }
    if (catSlug) {
      params.set('cat', catSlug);
    }
    const queryString = params.toString();
    router.push(`/shop${queryString ? `?${queryString}` : ''}`);
  };

  const handleQuickTagClick = (tag: string) => {
    setLocalSearch(tag);
    setSearchQuery(tag);
    const params = new URLSearchParams();
    params.set('q', tag);
    if (selectedCategory) {
      params.set('cat', selectedCategory);
    }
    router.push(`/shop?${params.toString()}`);
    setIsSearchFocused(false);
    setIsMobileSearchFocused(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className={styles.highlightText}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const renderSuggestionsDropdown = (isMobile = false) => {
    const trimmed = localSearch.trim();
    return (
      <div
        className={`${styles.searchSuggestionsDropdown} ${isMobile ? styles.mobileDropdown : ''}`}
        role="listbox"
        aria-label="Search suggestions"
      >
        {!trimmed ? (
          <div className={styles.emptySearchGuide}>
            <div className={styles.popularTagsRow}>
              {POPULAR_SEARCH_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={styles.popularTagPill}
                  onClick={() => handleQuickTagClick(tag)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleQuickTagClick(tag);
                  }}
                >
                  <Search size={11} />
                  <span>{tag}</span>
                </button>
              ))}
            </div>

            <div className={styles.suggestionDivider} />

            <div className={styles.trendingQuickList}>
              {PRODUCTS.slice(0, 3).map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className={styles.trendingQuickItem}
                  onClick={() => {
                    setIsSearchFocused(false);
                    setIsMobileSearchFocused(false);
                  }}
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className={styles.quickThumb}
                  />
                  <div className={styles.quickInfo}>
                    <span className={styles.quickTitle}>{p.title}</span>
                    <span className={styles.quickPrice}>QAR {p.priceQAR}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.searchResultsContainer}>
            {/* Matching Categories */}
            {matchingCategories.length > 0 && (
              <div className={styles.matchingCategoriesSection}>
                <div className={styles.suggestionSectionHeader}>
                  <LayoutGrid size={13} className={styles.headerIcon} />
                  <span>In Category</span>
                </div>
                <div className={styles.matchingCategoryChips}>
                  {matchingCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={styles.categoryChipBtn}
                      onClick={() => {
                        handleSelectCategory(cat.slug);
                        setIsSearchFocused(false);
                        setIsMobileSearchFocused(false);
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectCategory(cat.slug);
                        setIsSearchFocused(false);
                        setIsMobileSearchFocused(false);
                      }}
                    >
                      <span className={styles.catChipName}>{cat.name}</span>
                      <span className={styles.catChipHint}>Browse →</span>
                    </button>
                  ))}
                </div>
                <div className={styles.suggestionDivider} />
              </div>
            )}

            {/* Matching Products */}
            <div className={styles.suggestionSectionHeader}>
              <Sparkles size={13} className={styles.headerIcon} />
              <span>
                Product Suggestions ({suggestedProducts.length})
              </span>
            </div>

            {suggestedProducts.length > 0 ? (
              <div className={styles.productsSuggestionList}>
                {suggestedProducts.map((product, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <Link
                      key={product.id || product.slug}
                      href={`/products/${product.slug}`}
                      className={`${styles.productSuggestionItem} ${isSelected ? styles.selected : ''}`}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => {
                        setIsSearchFocused(false);
                        setIsMobileSearchFocused(false);
                      }}
                    >
                      <div className={styles.productThumbWrap}>
                        <img
                          src={
                            product.images?.[0] ||
                            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
                          }
                          alt={product.title}
                          className={styles.productThumb}
                        />
                        {product.discountPercent > 0 && (
                          <span className={styles.thumbDiscountBadge}>
                            -{product.discountPercent}%
                          </span>
                        )}
                      </div>

                      <div className={styles.productSuggestionDetails}>
                        <span className={styles.productSuggestionTitle}>
                          {highlightMatch(product.title, trimmed)}
                        </span>
                        <div className={styles.productSuggestionMetaRow}>
                          <span className={styles.productCategoryPill}>
                            {product.category}
                          </span>
                          {product.brand && (
                            <span className={styles.productBrandPill}>
                              {product.brand}
                            </span>
                          )}
                          <span className={styles.deliveryPill}>
                            ✈️ Direct Air Express (6–10 Days)
                          </span>
                        </div>
                      </div>

                      <div className={styles.productSuggestionPriceCol}>
                        <div className={styles.currentPrice}>
                          <span className={styles.currencyLabel}>QAR</span>
                          <span className={styles.priceNumber}>
                            {product.priceQAR}
                          </span>
                        </div>
                        {product.originalPriceQAR > product.priceQAR && (
                          <span className={styles.originalPrice}>
                            QAR {product.originalPriceQAR}
                          </span>
                        )}
                        <span className={styles.stockStatusBadge}>
                          {product.inStock ? '✓ In Stock' : 'Pre-order'}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className={styles.noResultsBox}>
                <p className={styles.noResultsTitle}>
                  No items found matching &ldquo;<strong>{trimmed}</strong>&rdquo;
                </p>
                <p className={styles.noResultsSub}>
                  Try searching with keywords like MagSafe, Earbuds, 100W GaN, or Smartwatch
                </p>
                <div className={styles.suggestedKeywords}>
                  {POPULAR_SEARCH_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={styles.suggestedTagBtn}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleQuickTagClick(tag);
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* View All Results Footer CTA */}
            <div className={styles.suggestionFooter}>
              <button
                type="button"
                className={styles.viewAllResultsBtn}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSearchSubmit(e);
                }}
              >
                <span>
                  View all results for &ldquo;<strong>{trimmed}</strong>&rdquo;
                </span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const currentCatObj = CATEGORIES.find((c) => c.slug === selectedCategory);
  const currentCategoryName = currentCatObj ? currentCatObj.name : 'All Categories';
  const currentCategoryIcon = currentCatObj ? getCategoryIcon(currentCatObj.icon, 13) : <LayoutGrid size={13} />;

  return (
    <header className={styles.header}>
      {/* 1. TOP UTILITY BAR (Ecobazar Style: Dark Slate Charcoal Bar) */}
      <div className={styles.topUtilityBar}>
        <div className="container">
          <div className={styles.topUtilityInner}>
            {/* Left Meta Links: Language, Currency & Track Order */}
            <div className={styles.topUtilityLeft}>
              <div className={styles.metaDropdown}>
                <span>Eng</span>
                <ChevronDown size={12} />
              </div>

              <div className={styles.metaDropdown}>
                <span>QAR (ر.ق)</span>
                <ChevronDown size={12} />
              </div>

              <span className={styles.topDivider}>|</span>

              <Link href="/track-order" className={styles.topAuthLink}>
                <span>Track Order</span>
              </Link>
            </div>

            {/* Right Meta Links: Auth */}
            <div className={styles.topUtilityMeta}>
              {viewer === undefined ? (
                <span className={styles.topAuthSkeleton} />
              ) : viewer ? (
                <>
                  {isUserAdmin && (
                    <>
                      <Link
                        href="/dashboard?role=admin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.topAdminLink}
                        title="Access Dropship Operations Admin Panel"
                      >
                        <Shield size={12} className={styles.topAdminIcon} />
                        <span>Admin</span>
                      </Link>
                      <span className={styles.topDivider}>|</span>
                    </>
                  )}
                  <Link href="/dashboard" className={styles.topAuthLink}>
                    <User size={13} />
                    <span>Hi, {viewer.name ? viewer.name.split(' ')[0] : viewer.email.split('@')[0]}</span>
                  </Link>
                </>
              ) : (
                <Link href="/login" className={styles.topAuthLink}>
                  <span>Sign In / Sign Up</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR (Al Anees / Qatify Style: Logo, Wide Search, Wishlist, Cart) */}
      <div className={styles.mainNav}>
        <div className="container">
          <div className={styles.mainNavInner}>
            {/* Mobile Menu Toggle with Animated 3-Bar Hamburger */}
            <button
              className={`${styles.mobileMenuToggle} ${isMobileMenuOpen ? styles.menuOpen : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <div className={styles.hamburgerIconWrap}>
                <span className={styles.hamburgerBar} />
                <span className={styles.hamburgerBar} />
                <span className={styles.hamburgerBar} />
              </div>
            </button>

            {/* Qatify Brand Logo */}
            <div className={styles.logoWrap}>
              <QatifyLogo variant="dark" size="lg" showTagline={false} />
            </div>

            {/* Desktop Search Box */}
            <div className={styles.searchContainer} ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <div className={styles.searchInputGroup}>
                  <Search size={18} className={styles.searchInnerIcon} />
                  <input
                    id="catalog-search-input"
                    type="text"
                    value={localSearch}
                    onChange={(e) => {
                      setLocalSearch(e.target.value);
                      setIsSearchFocused(true);
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="What are you looking for ?"
                    className={styles.searchInput}
                    aria-label="Search catalog"
                    autoComplete="off"
                  />
                  {localSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setLocalSearch('');
                        setSearchQuery('');
                        setSelectedIndex(-1);
                      }}
                      className={styles.clearSearchBtn}
                      aria-label="Clear search input"
                      title="Clear search text"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.searchSubmitBtn}
                  aria-label="Search catalog"
                  title="Search catalog"
                >
                  <Search size={16} strokeWidth={2.2} />
                  <span>Search</span>
                </button>
              </form>

              {/* Real-time Predictive Suggestions Dropdown */}
              {isSearchFocused && renderSuggestionsDropdown(false)}
            </div>

            {/* Right Action Items: Cart */}
            <div className={styles.actionItems}>
              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={openCart}
                className={`${styles.cartGroupBtn} ${isCartOpen ? styles.cartActive : ''}`}
                aria-label={`Open shopping cart (${cartCount} items)`}
              >
                <div className={styles.cartIconWrapper}>
                  <ShoppingBag size={25} strokeWidth={1.6} />
                  {!isHydrated ? (
                    <span className={styles.cartCountSkeleton} />
                  ) : (
                    <span className={styles.cartCountBadge}>{cartCount}</span>
                  )}
                </div>
                <div className={styles.cartPriceCol}>
                  <span className={styles.cartPriceLabel}>Shopping cart:</span>
                  {!isHydrated ? (
                    <span className={styles.cartPriceSkeleton} />
                  ) : (
                    <span className={styles.cartPriceValue}>
                      QAR {cartSubtotal.toLocaleString()}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Dedicated Mobile & Tablet Quick Search Bar (< 768px) */}
          <div className={styles.mobileSearchRow} ref={mobileSearchContainerRef}>
            <form onSubmit={handleSearchSubmit} className={styles.mobileSearchForm}>
              <div className={styles.mobileSearchIconWrap}>
                <Search size={17} strokeWidth={1.8} />
              </div>
              <input
                id="mobile-catalog-search-input"
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setIsMobileSearchFocused(true);
                }}
                onFocus={() => setIsMobileSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="What are you looking for ?"
                className={styles.mobileSearchInput}
                aria-label="Search catalog"
                autoComplete="off"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch('');
                    setSearchQuery('');
                    setSelectedIndex(-1);
                  }}
                  className={styles.mobileClearBtn}
                  aria-label="Clear search text"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                className={styles.mobileSearchSubmitBtn}
                aria-label="Submit search"
                title="Submit search"
              >
                <Search size={19} strokeWidth={2.2} />
              </button>
            </form>

            {/* Mobile Predictive Suggestions Dropdown */}
            {isMobileSearchFocused && renderSuggestionsDropdown(true)}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM NAVIGATION STRIP (Ecobazar Style: All Categories, Category Links, Phone) */}
      <nav className={styles.categoryStrip}>
        <div className="container">
          <div className={styles.categoryStripInner}>
            {/* All Categories Solid Button (Hover open & mouse leave close) */}
            <div
              className={styles.allCatWrapper}
              ref={categoryMenuRef}
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <button
                type="button"
                onClick={toggleCategoryMenu}
                className={`${styles.allCatBtn} ${isCategoryMenuOpen ? styles.active : ''}`}
                aria-expanded={isCategoryMenuOpen}
                aria-haspopup="true"
              >
                <Menu size={18} strokeWidth={2.2} />
                <span>All Categories</span>
                <ChevronDown size={14} className={styles.chevron} />
              </button>

              {/* Mega Flyout Dropdown */}
              {isCategoryMenuOpen && (
                <div
                  className={styles.megaFlyout}
                  onMouseEnter={handleCategoryMouseEnter}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <div className={styles.megaFlyoutHeader}>
                    <span>Popular Dropship Categories</span>
                  </div>
                  <div className={styles.megaGrid}>
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?cat=${cat.slug}`}
                        onClick={() => setIsCategoryMenuOpen(false)}
                        className={styles.megaItem}
                      >
                        <span className={styles.megaItemName}>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                  <div className={styles.megaFlyoutFooter}>
                    <Link
                      href="/shop"
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className={styles.viewAllCatalogLink}
                    >
                      Browse Entire 1,000+ Qatar Catalog →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links Horizontal Strip - Qatify Categories (10 Items) */}
            <div className={styles.navLinks}>
              {DESKTOP_NAV_LINKS.map((item) => (
                <Link key={item.label} href={item.href} className={styles.navLink}>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation (Smooth CSS Slide & Fade) */}
      <div
        className={`${styles.mobileDrawerBackdrop} ${isMobileMenuOpen ? styles.drawerOpen : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className={`${styles.mobileDrawer} ${isMobileMenuOpen ? styles.drawerOpen : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.mobileDrawerHeader}>
            <QatifyLogo variant="dark" size="sm" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={styles.closeDrawerBtn}
              aria-label="Close menu drawer"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

            <div className={styles.mobileDrawerBody}>
              {/* Account, Track Order & Admin (Matching Desktop Top Bar) */}
              <div className={styles.mobileLinksSection}>
                <Link
                  href="/track-order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={styles.mobileDrawerLink}
                >
                  <Plane size={16} />
                  <span>Track Order</span>
                </Link>

                {viewer === undefined ? (
                  <div className={styles.mobileDrawerSkeletonLink}>
                    <span className={styles.mobileAuthSkeleton} />
                  </div>
                ) : viewer ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={styles.mobileDrawerLink}
                  >
                    <User size={16} />
                    <span>Hi, {viewer.name ? viewer.name.split(' ')[0] : viewer.email.split('@')[0]}</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={styles.mobileDrawerLink}
                  >
                    <User size={16} />
                    <span>Sign In / Sign Up</span>
                  </Link>
                )}

                {isUserAdmin && (
                  <Link
                    href="/dashboard?role=admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${styles.mobileDrawerLink} ${styles.adminDrawerLink}`}
                  >
                    <Shield size={16} />
                    <span>Store Admin (Admin)</span>
                    <span className={styles.adminDrawerBadge}>Admin</span>
                  </Link>
                )}
              </div>

              {/* Exact Categories & Deals matching Desktop */}
              <div className={styles.mobileCategoryHeading}>All Categories &amp; Deals</div>
              <div className={styles.mobileCategoryList}>
                {DESKTOP_NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={styles.mobileCategoryItem}
                  >
                    <span className={styles.mobileCatItemLeft}>
                      <span className={styles.mobileCatIcon}>
                        {getCategoryIcon(item.icon, 16)}
                      </span>
                      <span>{item.label}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className={styles.mobileDrawerFooter}>
              <div className={styles.mobileGuaranteeText}>
                ✈️ 6–10 Days Direct Air Delivery to Doha, Lusail &amp; all Qatar
              </div>
            </div>
          </div>
        </div>
    </header>
  );
};

