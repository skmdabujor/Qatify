'use client';

// =============================================================================
// Qatify — Clean, Minimal & High-Converting Product Detail View (`/products/[slug]`)
// Streamlined Shopify-Style UX with Qatify Brand Aesthetics & Logistics
// =============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Product, toProduct } from '@/types/product';
import {
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Flame,
  Lock,
  Plane,
  ShieldCheck,
  Clock,
  Package,
  RotateCcw,
  Headset,
  ShoppingCart,
  ShoppingBag,
  Zap,
  CreditCard,
  X,
  ZoomIn,
} from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { useShop } from '@/context/ShopContext';
import styles from './page.module.scss';

interface ProductDetailClientProps {
  slug: string;
  initialProduct?: Product;
}

export function ProductDetailClient({ slug: propSlug, initialProduct }: ProductDetailClientProps) {
  const router = useRouter();
  const routeParams = useParams();

  // Extract slug from prop or useParams
  const paramSlug = routeParams?.slug;
  const slug = propSlug || (typeof paramSlug === 'string' ? paramSlug : Array.isArray(paramSlug) ? paramSlug[0] : '') || '';

  const {
    addToCart,
    initiateBuyNow,
    closeCart,
    toggleWishlist,
    isInWishlist,
    showToast,
  } = useShop();

  const liveProduct = useQuery(api.products.getBySlug, slug ? { slug } : 'skip');
  const fallbackProduct = initialProduct || PRODUCTS.find((p) => p.slug === slug);
  const product = liveProduct ? toProduct(liveProduct) : fallbackProduct;

  // Gallery active image
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handlePrevImage = () => {
    if (!product?.images || product.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleNextImage = () => {
    if (!product?.images || product.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % product.images.length);
  };

  // Lightbox & Mouse Drag / Touch Swipe to slide
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = React.useRef(0);
  const dragStartY = React.useRef(0);
  const dragDistance = React.useRef(0);
  const dragDistanceY = React.useRef(0);

  const handleDragStart = (clientX: number, clientY = 0) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    dragStartY.current = clientY;
    dragDistance.current = 0;
    dragDistanceY.current = 0;
  };

  const handleDragMove = (clientX: number, clientY = 0) => {
    if (!isDragging) return;
    dragDistance.current = clientX - dragStartX.current;
    if (clientY) {
      dragDistanceY.current = clientY - dragStartY.current;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 40;
    // Only register image swipe if horizontal movement is dominant over vertical scroll
    if (
      Math.abs(dragDistance.current) > threshold &&
      Math.abs(dragDistance.current) > Math.abs(dragDistanceY.current) * 1.3
    ) {
      if (dragDistance.current > 0) {
        // Dragged right -> previous image
        handlePrevImage();
      } else {
        // Dragged left -> next image
        handleNextImage();
      }
    }
    dragDistance.current = 0;
    dragDistanceY.current = 0;
  };

  // Keyboard navigation and scroll-lock for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      else if (e.key === 'ArrowLeft') handlePrevImage();
      else if (e.key === 'ArrowRight') handleNextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, product?.images]);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState(
    product?.variants?.colors?.[0]?.name || ''
  );
  const [selectedOption, setSelectedOption] = useState(
    product?.variants?.options?.[0]?.values?.[0] || ''
  );
  const [quantity, setQuantity] = useState(1);

  // Read more state for description
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Clean accordions states
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  // Sync variants when live product arrives
  useEffect(() => {
    if (product) {
      if (!selectedColor && product.variants?.colors?.[0]?.name) {
        setSelectedColor(product.variants.colors[0].name);
      }
      if (!selectedOption && product.variants?.options?.[0]?.values?.[0]) {
        setSelectedOption(product.variants.options[0].values[0]);
      }
    }
  }, [product, selectedColor, selectedOption]);

  // Sticky Add to Cart Bar visibility on scroll
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      const threshold = isMobile ? 220 : 420;
      const shouldShow = window.scrollY > threshold;
      setShowStickyBar(shouldShow);

      if (typeof document !== 'undefined') {
        if (shouldShow) {
          document.body.classList.add('has-sticky-cart');
        } else {
          document.body.classList.remove('has-sticky-cart');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (typeof document !== 'undefined') {
        document.body.classList.remove('has-sticky-cart');
      }
    };
  }, []);

  // Related products from Convex or mock fallback
  const liveRelated = useQuery(
    api.products.list,
    product?.categorySlug
      ? {
          categorySlug: product.categorySlug,
          limit: 6,
        }
      : 'skip'
  );

  // Live verified reviews from Convex
  const reviewTargetId = product?.id || product?.slug || slug;
  const liveReviews = useQuery(
    api.reviews.listByProduct,
    reviewTargetId
      ? {
          productId: reviewTargetId,
          limit: 20,
        }
      : 'skip'
  );
  const submitReviewMutation = useMutation(api.reviews.submitReview);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLocation, setReviewLocation] = useState('Doha, Qatar');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast('Missing Fields', 'Please provide your name and review comment.', 'warning');
      return;
    }
    try {
      setIsSubmittingReview(true);
      await submitReviewMutation({
        productId: product?.id || product?.slug || slug,
        authorName: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
        location: reviewLocation.trim() || 'Doha, Qatar',
      });
      showToast('Review Submitted! 🎉', 'Shukran for sharing your feedback with Qatar shoppers.', 'success');
      setReviewComment('');
      setShowReviewForm(false);
    } catch (err: any) {
      showToast('Submission Failed', err?.message || 'Could not submit review.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const relatedProducts = (
    liveRelated && liveRelated.length > 0
      ? liveRelated.filter((p) => (p.productId || p._id) !== product?.id).map(toProduct)
      : PRODUCTS.filter((p) => product && p.id !== product.id && p.categorySlug === product.categorySlug)
  ).slice(0, 5);

  if (!product) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Product Not Found</h2>
        <p>The tech item you are looking for is currently unavailable in Qatar stock.</p>
        <Link href="/shop" className={styles.backBtn}>
          Back to Shop Catalog
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const unitPrice = product.priceQAR;
  const totalPriceQAR = unitPrice * quantity;

  // Add to cart with variant
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedOption, true, false);
  };

  // Immediate Buy Now - redirect directly to checkout with isolated item (regular cart stays untouched!)
  const handleBuyNow = () => {
    if (!product) return;
    closeCart();
    initiateBuyNow(product, quantity, selectedColor, selectedOption);
    router.push('/checkout?mode=buynow');
  };

  // Share link
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.title,
          text: `Check out ${product.title} at ${unitPrice} QAR on Qatify!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied! 📋', 'Product link copied to your clipboard.', 'info');
    }
  };

  return (
    <div className={styles.productPage}>
      <div className="container">
        {/* ===================================================================
            BREADCRUMB NAVIGATION (Clean & Compact)
        ==================================================================== */}
        <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
          <Link href="/" className={styles.crumbLink}>Home</Link>
          <span className={styles.crumbSep}>/</span>
          <Link href="/shop" className={styles.crumbLink}>Shop</Link>
          <span className={styles.crumbSep}>/</span>
          <Link href={`/shop?cat=${product.categorySlug}`} className={styles.crumbLink}>
            {product.category}
          </Link>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.activeCrumb}>{product.title}</span>
        </nav>

        {/* ===================================================================
            MAIN PRODUCT STAGE: 2 CLEAN COLUMNS (Gallery + Streamlined Buy Box)
        ==================================================================== */}
        <div className={styles.productGrid}>
          {/* LEFT: Clean Image Gallery */}
          <div className={styles.galleryColumn}>
            <div
              className={`${styles.mainStage} ${isDragging ? styles.isDragging : ''}`}
              onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
              onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
              onMouseUp={handleDragEnd}
              onTouchStart={(e) =>
                handleDragStart(e.touches[0].clientX, e.touches[0].clientY)
              }
              onTouchMove={(e) =>
                handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
              }
              onTouchEnd={handleDragEnd}
            >
              {product.discountPercent > 0 && (
                <span className={styles.discountBadge}>
                  -{product.discountPercent}% OFF
                </span>
              )}

              {/* Click to Enlarge / Zoom Trigger Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className={styles.zoomTriggerBtn}
                title="Click to view full image"
                aria-label="Enlarge product image"
              >
                <ZoomIn size={16} />
              </button>

              {/* Stage Navigation Arrows (Mobile & Desktop) */}
              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className={`${styles.stageArrowBtn} ${styles.prevStageBtn}`}
                    aria-label="Previous product image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className={`${styles.stageArrowBtn} ${styles.nextStageBtn}`}
                    aria-label="Next product image"
                  >
                    <ChevronRight size={18} />
                  </button>

                  {/* Stage Dots Indicator */}
                  <div className={styles.stageDots} aria-hidden="true">
                    {product.images.map((_, dotIdx) => (
                      <span
                        key={dotIdx}
                        className={`${styles.stageDot} ${
                          activeImageIndex === dotIdx ? styles.activeStageDot : ''
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              <img
                key={activeImageIndex}
                src={product.images[activeImageIndex] || '/placeholder.svg'}
                alt={`${product.title} - Preview ${activeImageIndex + 1}`}
                className={styles.mainImg}
                draggable={false}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/placeholder.svg')) {
                    target.src = '/placeholder.svg';
                  }
                }}
              />
            </div>

            {/* Thumbnails Row */}
            {product.images.length > 1 && (
              <div className={styles.thumbsRow}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`${styles.thumbBtn} ${
                      activeImageIndex === idx ? styles.activeThumb : ''
                    }`}
                    aria-label={`View product image ${idx + 1}`}
                  >
                    <img
                      src={img || '/placeholder.svg'}
                      alt={`${product.title} preview ${idx + 1}`}
                      className={styles.thumbImg}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.endsWith('/placeholder.svg')) {
                          target.src = '/placeholder.svg';
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Clean, User-Friendly Product Details & Buy Box */}
          <div className={styles.infoColumn}>
            {/* Product Title */}
            <h1 className={styles.productHeading}>{product.title}</h1>

            {/* Rating Stars & Reviews Count & Total Sold */}
            <div className={styles.ratingRow}>
              <div className={styles.starsWrapper}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    fill={star <= Math.round(product.rating) ? '#FFB800' : '#E4E4E7'}
                    color={star <= Math.round(product.rating) ? '#FFB800' : '#E4E4E7'}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIsReviewsOpen(true)}
                className={styles.reviewsCountLink}
              >
                {product.reviewCount || 0} reviews
              </button>
              {product.soldCount > 0 && (
                <>
                  <span className={styles.ratingDivider}>•</span>
                  <span className={styles.soldCountText}>
                    <Flame size={13} className={styles.soldFlameIcon} />
                    <strong>{product.soldCount}</strong> sold
                  </span>
                </>
              )}
            </div>

            {/* Clean Pricing Line */}
            <div className={styles.priceRow}>
              {product.originalPriceQAR > unitPrice && (
                <span className={styles.originalPrice}>
                  QAR {product.originalPriceQAR}
                </span>
              )}
              <span className={styles.currentPrice}>
                QAR {unitPrice}
              </span>
              {product.discountPercent > 0 && (
                <span className={styles.priceDiscountPill}>
                  Save {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Variant Selectors: Colors */}
            {product.variants?.colors && product.variants.colors.length > 0 && (
              <div className={styles.variantSection}>
                <span className={styles.variantLabel}>
                  Color: <strong>{selectedColor}</strong>
                </span>
                <div className={styles.colorSwatches}>
                  {product.variants.colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`${styles.colorDotBtn} ${
                        selectedColor === color.name ? styles.activeDot : ''
                      }`}
                      title={color.name}
                      aria-label={`Select color ${color.name}`}
                    >
                      <span
                        className={styles.colorCircle}
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selectors: Edition / Options */}
            {product.variants?.options && product.variants.options.length > 0 && (
              <div className={styles.variantSection}>
                {product.variants.options.map((opt) => (
                  <div key={opt.name} className={styles.optBlock}>
                    <span className={styles.variantLabel}>
                      {opt.name}: <strong>{selectedOption}</strong>
                    </span>
                    <div className={styles.optionPills}>
                      {opt.values.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSelectedOption(val)}
                          className={`${styles.optionBtn} ${
                            selectedOption === val ? styles.activeOption : ''
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Stepper */}
            <div className={styles.quantitySection}>
              <span className={styles.quantityLabel}>Quantity</span>
              <div className={styles.quantityRow}>
                <div className={styles.quantityStepper}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={styles.stepBtn}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className={styles.qtyNumber}>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className={styles.stepBtn}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons (Side-by-Side Standard Size) */}
            <div className={styles.actionsContainer}>
              <button
                type="button"
                onClick={handleBuyNow}
                className={styles.buyNowBtn}
              >
                <ShoppingCart size={17} />
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className={styles.addToCartBtn}
              >
                <ShoppingBag size={17} />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Checkout Micro-Copy */}
            <p className={styles.ctaSubtext}>
              100% Secure Online Payment (Apple Pay, Google Pay & Cards). Fast express delivery across Qatar.
            </p>

            {/* Wishlist & Share Aux Links */}
            <div className={styles.auxLinksRow}>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`${styles.auxLinkBtn} ${isFavorited ? styles.activeWish : ''}`}
              >
                <Heart
                  size={15}
                  fill={isFavorited ? '#E11D48' : 'none'}
                  color={isFavorited ? '#E11D48' : 'currentColor'}
                />
                <span>{isFavorited ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
              <span className={styles.auxDivider}>•</span>
              <button
                type="button"
                onClick={handleShare}
                className={styles.auxLinkBtn}
              >
                <Share2 size={15} />
                <span>Share</span>
              </button>
            </div>

            {/* 4-Item Horizontal Trust Badges Grid (Direct from Reference) */}
            <div className={styles.trustBadgesGrid}>
              <div className={styles.trustBadgeItem}>
                <div className={styles.trustIconWrap}>
                  <CreditCard size={18} />
                </div>
                <div className={styles.trustBadgeText}>
                  <strong>Online Payment</strong>
                  <span>Cards & Apple Pay</span>
                </div>
              </div>

              <div className={styles.trustBadgeItem}>
                <div className={styles.trustIconWrap}>
                  <Plane size={18} />
                </div>
                <div className={styles.trustBadgeText}>
                  <strong>Free Delivery</strong>
                  <span>over QAR 150</span>
                </div>
              </div>

              <div className={styles.trustBadgeItem}>
                <div className={styles.trustIconWrap}>
                  <ShieldCheck size={18} />
                </div>
                <div className={styles.trustBadgeText}>
                  <strong>100% original</strong>
                  <span>QC checked</span>
                </div>
              </div>

              <div className={styles.trustBadgeItem}>
                <div className={styles.trustIconWrap}>
                  <Headset size={18} />
                </div>
                <div className={styles.trustBadgeText}>
                  <strong>24/7 Support</strong>
                  <span>WhatsApp &amp; Live Chat</span>
                </div>
              </div>
            </div>

            {/* Product Summary & Description with "Read more" toggle */}
            <div className={styles.productSummaryBox}>
              <h3 className={styles.summaryTitle}>
                {product.title.split('–')[0].trim()}
              </h3>
              <div className={`${styles.summaryText} ${isDescriptionExpanded ? styles.expanded : ''}`}>
                <p>{product.shortDescription || product.fullDescription}</p>
                {isDescriptionExpanded && product.fullDescription && product.fullDescription !== product.shortDescription && (
                  <div className={styles.fullDescParas}>
                    {product.fullDescription.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className={styles.readMoreBtn}
              >
                {isDescriptionExpanded ? 'Read less' : 'Read more'}
              </button>
            </div>

            {/* Clean Accordions (Shipping, Warranty, Specs & Reviews) */}
            <div className={styles.accordionsList}>
              {/* Accordion 1: Shipping & Delivery */}
              <div className={styles.accordionRow}>
                <button
                  type="button"
                  className={styles.accordionHeader}
                  onClick={() => setIsShippingOpen(!isShippingOpen)}
                  aria-expanded={isShippingOpen}
                >
                  <span className={styles.accordionHeaderLeft}>
                    <Plane size={16} />
                    <span>Shipping & delivery</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`${styles.chevron} ${isShippingOpen ? styles.rotate : ''}`}
                  />
                </button>
                {isShippingOpen && (
                  <div className={styles.accordionBody}>
                    <p>
                      <strong>Direct Global Air Express to Qatar:</strong> Orders are dispatched from certified manufacturers directly into Hamad International Airport (DOH).
                    </p>
                    <ul className={styles.accordionList}>
                      <li>
                        Estimated delivery window: <strong>6–10 business days</strong> directly to your doorstep in Doha, Lusail, Al Rayyan, Al Wakrah, Al Khor, and all Qatar municipalities.
                      </li>
                      <li>
                        <strong>Free shipping</strong> applies automatically on all orders QAR 150 and above.
                      </li>
                      <li>
                        Real-time tracking notifications sent via WhatsApp & SMS from air departure to your door.
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Returns & Warranty */}
              <div className={styles.accordionRow}>
                <button
                  type="button"
                  className={styles.accordionHeader}
                  onClick={() => setIsWarrantyOpen(!isWarrantyOpen)}
                  aria-expanded={isWarrantyOpen}
                >
                  <span className={styles.accordionHeaderLeft}>
                    <RotateCcw size={16} />
                    <span>Returns & warranty</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`${styles.chevron} ${isWarrantyOpen ? styles.rotate : ''}`}
                  />
                </button>
                {isWarrantyOpen && (
                  <div className={styles.accordionBody}>
                    <p>
                      <strong>100% Authentic Guarantee:</strong> Every product delivered by Qatify is brand new, factory sealed, and quality-inspected.
                    </p>
                    <ul className={styles.accordionList}>
                      <li>
                        <strong>14-Day Easy Return:</strong> If your product arrives damaged or defective, our Doha support team arranges instant replacement or refund.
                      </li>
                      <li>
                        <strong>1-Year Manufacturer Warranty:</strong> Protection against manufacturing defects and internal hardware malfunctions.
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 3: Technical Specifications & Package Contents */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className={styles.accordionRow}>
                  <button
                    type="button"
                    className={styles.accordionHeader}
                    onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                    aria-expanded={isSpecsOpen}
                  >
                    <span className={styles.accordionHeaderLeft}>
                      <Package size={16} />
                      <span>Specifications & package contents</span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`${styles.chevron} ${isSpecsOpen ? styles.rotate : ''}`}
                    />
                  </button>
                  {isSpecsOpen && (
                    <div className={styles.accordionBody}>
                      <table className={styles.specsCompactTable}>
                        <tbody>
                          {Object.entries(product.specifications).map(([key, val]) => (
                            <tr key={key}>
                              <td className={styles.specKey}>{key}</td>
                              <td className={styles.specVal}>{String(val)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {product.packageContents && product.packageContents.length > 0 && (
                        <div className={styles.packageContentsWrap}>
                          <strong>In the Box:</strong>
                          <ul className={styles.packageList}>
                            {product.packageContents.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Accordion 4: Verified Customer Reviews */}
              <div className={styles.accordionRow}>
                <button
                  type="button"
                  className={styles.accordionHeader}
                  onClick={() => setIsReviewsOpen(!isReviewsOpen)}
                  aria-expanded={isReviewsOpen}
                >
                  <span className={styles.accordionHeaderLeft}>
                    <Star size={16} />
                    <span>Verified customer reviews ({product.reviewCount || 0})</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`${styles.chevron} ${isReviewsOpen ? styles.rotate : ''}`}
                  />
                </button>
                {isReviewsOpen && (
                  <div className={styles.accordionBody}>
                    <div className={styles.reviewsSummaryHeader}>
                      <div className={styles.ratingNumberBox}>
                        <span className={styles.bigScore}>{product.rating}</span>
                        <div className={styles.starsWrapper}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={13}
                              fill={s <= Math.round(product.rating) ? '#FFB800' : '#E4E4E7'}
                              color={s <= Math.round(product.rating) ? '#FFB800' : '#E4E4E7'}
                            />
                          ))}
                        </div>
                        <span className={styles.revCountText}>
                          Based on {product.reviewCount} Qatar orders
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className={styles.writeReviewToggleBtn}
                      >
                        {showReviewForm ? 'Cancel' : 'Write a Review'}
                      </button>
                    </div>

                    {/* Review Submission Form */}
                    {showReviewForm && (
                      <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
                        <h4>Leave Your Review</h4>
                        <div className={styles.formRow}>
                          <label>
                            Your Name:
                            <input
                              type="text"
                              value={reviewName}
                              onChange={(e) => setReviewName(e.target.value)}
                              placeholder="e.g. Tariq Al-Kuwari"
                              required
                            />
                          </label>
                          <label>
                            Location:
                            <input
                              type="text"
                              value={reviewLocation}
                              onChange={(e) => setReviewLocation(e.target.value)}
                              placeholder="Doha, Qatar"
                            />
                          </label>
                        </div>
                        <div className={styles.formRatingRow}>
                          <span>Rating:</span>
                          <div className={styles.starPicker}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setReviewRating(s)}
                                className={styles.starPickerBtn}
                              >
                                <Star
                                  size={18}
                                  fill={s <= reviewRating ? '#FFB800' : '#E4E4E7'}
                                  color={s <= reviewRating ? '#FFB800' : '#E4E4E7'}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <label className={styles.commentLabel}>
                          Your Feedback:
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={3}
                            placeholder="Share your experience with product quality, speed of delivery, etc."
                            required
                          />
                        </label>
                        <button
                          type="submit"
                          disabled={isSubmittingReview}
                          className={styles.submitReviewBtn}
                        >
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    )}

                    {/* Reviews List */}
                    <div className={styles.reviewsList}>
                      {liveReviews && liveReviews.length > 0 ? (
                        liveReviews.map((rev: any) => (
                          <div key={rev._id} className={styles.singleReview}>
                            <div className={styles.singleRevMeta}>
                              <strong>{rev.authorName}</strong>
                              <span className={styles.singleRevLocation}>({rev.location || 'Qatar'})</span>
                              <span className={styles.verifiedTag}>✓ Verified Buyer</span>
                            </div>
                            <div className={styles.singleRevStars}>
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={11}
                                  fill={s <= rev.rating ? '#FFB800' : '#E4E4E7'}
                                  color={s <= rev.rating ? '#FFB800' : '#E4E4E7'}
                                />
                              ))}
                            </div>
                            <p className={styles.singleRevComment}>{rev.comment}</p>
                          </div>
                        ))
                      ) : (
                        <div className={styles.singleReview}>
                          <div className={styles.singleRevMeta}>
                            <strong>Mohammed S.</strong>
                            <span className={styles.singleRevLocation}>(Doha)</span>
                            <span className={styles.verifiedTag}>✓ Verified Buyer</span>
                          </div>
                          <div className={styles.singleRevStars}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={11} fill="#FFB800" color="#FFB800" />
                            ))}
                          </div>
                          <p className={styles.singleRevComment}>
                            Excellent build quality and fast direct air delivery to Doha. Exactly as described!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            RELATED PRODUCTS SHELF
        ==================================================================== */}
        {relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.relatedHeader}>
              <h2 className={styles.relatedTitle}>Customers Also Ordered in Qatar</h2>
              <Link href={`/shop?cat=${product.categorySlug}`} className={styles.viewCategoryLink}>
                <span>More in {product.category} →</span>
              </Link>
            </div>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}

        {/* ===================================================================
            STICKY ADD TO CART BAR (Scroll-Activated)
        ==================================================================== */}
        <div
          className={`${styles.stickyBar} ${showStickyBar ? styles.visible : ''}`}
          aria-hidden={!showStickyBar}
        >
          <div className={styles.stickyInner}>
            <div className={styles.stickyProductInfo}>
              <img
                src={product.images[activeImageIndex] || product.images[0] || '/placeholder.svg'}
                alt={product.title}
                className={styles.stickyThumb}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.endsWith('/placeholder.svg')) {
                    target.src = '/placeholder.svg';
                  }
                }}
              />
              <div className={styles.stickyTextCol}>
                <h4 className={styles.stickyTitle} title={product.title}>
                  {product.title}
                </h4>
                <div className={styles.stickyMetaRow}>
                  <span className={styles.stickyBrand}>{product.brand}</span>
                  {selectedColor && (
                    <span className={styles.stickyVariant}>• {selectedColor}</span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.stickyRightCol}>
              <div className={styles.stickyPriceBlock}>
                <span className={styles.stickyAmount}>QAR {totalPriceQAR}</span>
                {product.originalPriceQAR > unitPrice && (
                  <span className={styles.stickyOriginalPrice}>
                    QAR {product.originalPriceQAR * quantity}
                  </span>
                )}
              </div>

              <div className={styles.stickyStepper}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={styles.stickyStepBtn}
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className={styles.stickyStepVal}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className={styles.stickyStepBtn}
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>

              <div className={styles.stickyBtnGroup}>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className={styles.stickyBuyBtn}
                  title="Buy Now (Secure Online Payment)"
                >
                  <ShoppingCart size={16} />
                  <span>Buy Now</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={styles.stickyAddBtn}
                  title="Add to Cart"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================
          FULL-SCREEN IMAGE LIGHTBOX MODAL (Click to Enlarge)
      ==================================================================== */}
      {isLightboxOpen && (
        <div
          className={styles.lightboxOverlay}
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged product image view"
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.lightboxCloseBtn}
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close zoomed view"
            >
              <X size={22} />
            </button>

            <div className={styles.lightboxImageStage}>
              <img
                src={product.images[activeImageIndex] || '/placeholder.svg'}
                alt={`${product.title} - Zoomed`}
                className={styles.lightboxImg}
              />

              {product.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.lightboxNavBtn} ${styles.lightboxPrev}`}
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    type="button"
                    className={`${styles.lightboxNavBtn} ${styles.lightboxNext}`}
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight size={28} />
                  </button>
                </>
              )}
            </div>

            {product.images.length > 1 && (
              <div className={styles.lightboxThumbs}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`${styles.lightboxThumbBtn} ${
                      activeImageIndex === idx ? styles.activeLightboxThumb : ''
                    }`}
                    aria-label={`View photo ${idx + 1}`}
                  >
                    <img src={img || '/placeholder.svg'} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
