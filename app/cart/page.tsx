'use client';

// =============================================================================
// Qatify — Shopping Cart Page (`/cart`)
// Exact visual reproduction of the user-provided layout
// Styled with Qatify Brand Identity (Qatify Yellow #ffb800, Black #18181b, Nunito Sans fonts)
// =============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  ShoppingBag,
  Plus,
  Minus,
  X,
  Tag,
  Gift,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { CartSkeleton } from '@/components/ui/skeleton';
import { PRODUCTS } from '@/data/products';
import styles from './page.module.scss';

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const {
    cart,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
    addToCart,
    showToast,
    appliedCoupon,
    appliedDiscountQAR,
    setCoupon,
  } = useShop();

  useEffect(() => {
    setMounted(true);
  }, []);

  const convex = useConvex();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [activeTab, setActiveTab] = useState<'coupon' | 'voucher'>('coupon');

  const couponDiscount = appliedDiscountQAR || 0;
  const isFreeShipping = cartSubtotal >= 150;
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : 20;
  const grandTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError('Please enter a promo code');
      showToast('Enter Promo Code', 'Please enter a valid promo code before applying.', 'warning');
      return;
    }

    if (activeTab === 'voucher') {
      showToast('Gift Voucher', 'Please enter a valid Qatar gift voucher or coupon code.', 'info');
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await convex.query(api.coupons.validateCoupon, {
        code,
        subtotalQAR: cartSubtotal,
        currentDate: new Date().toISOString().slice(0, 10),
      });

      if (res.isValid && res.code) {
        setCoupon(res.code, res.discountQAR);
        setCouponError(null);
        setCouponCode('');
      } else {
        const errorMsg = res.message || 'Invalid promo code. Please check and try again.';
        setCouponError(errorMsg);
      }
    } catch (err) {
      console.error('Coupon validation error, checking fallback:', err);
      // Fallback check for standard coupons in case Convex is temporarily unreachable
      const fallbackCoupons: Record<string, { type: 'percentage' | 'fixed'; val: number; min: number }> = {
        WELCOME10: { type: 'percentage', val: 10, min: 100 },
        QATAR25: { type: 'fixed', val: 25, min: 150 },
        EID50: { type: 'fixed', val: 50, min: 300 },
      };

      const matched = fallbackCoupons[code];
      if (matched) {
        if (cartSubtotal < matched.min) {
          const minMsg = `Minimum order subtotal of QAR ${matched.min} required for this coupon`;
          setCouponError(minMsg);
        } else {
          const discount = matched.type === 'percentage'
            ? Math.round((cartSubtotal * matched.val) / 100)
            : Math.min(matched.val, cartSubtotal);
          setCoupon(code, discount);
          setCouponError(null);
          setCouponCode('');
        }
      } else {
        const errorMsg = `Code "${code}" is invalid or expired.`;
        setCouponError(errorMsg);
      }
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Recommended Products for "You May Also Like" (Exactly 6 items, 2-column grid)
  const recommendedProducts = useMemo(() => {
    const inCartIds = new Set(cart.map((item) => item.product.id));
    return PRODUCTS.filter((p) => !inCartIds.has(p.id)).slice(0, 6);
  }, [cart]);

  if (!mounted) {
    return <CartSkeleton />;
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.cartContainer}>
        {/* Main Title: Shopping Cart */}
        <h1 className={styles.cartMainTitle}>Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className={styles.emptyCartCard}>
            <div className={styles.emptyIconCircle}>
              <ShoppingBag size={44} color="#a1a1aa" />
            </div>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyDesc}>
              Discover trending electronics, MagSafe accessories, and lifestyle essentials with fast Qatar doorstep delivery.
            </p>
            <Link href="/shop" className={styles.startShoppingBtn}>
              <span>Start Shopping</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            {/* ===============================================================
                LEFT COLUMN: YOUR PRODUCTS + YOU MAY ALSO LIKE
            ================================================================ */}
            <div className={styles.leftColumn}>
              {/* CARD 1: YOUR PRODUCTS */}
              <div className={styles.yourProductsCard}>
                <div className={styles.cardHeaderArea}>
                  <h2 className={styles.yourProductsTitle}>Your Products</h2>
                </div>
                <div className={styles.headerDivider} />

                <div className={styles.productsList}>
                  {cart.map((item) => (
                    <div key={item.id} className={styles.productRow}>
                      {/* Product Thumbnail */}
                      <Link
                        href={`/products/${item.product.slug}`}
                        className={styles.productThumbWrap}
                      >
                        <Image
                          src={item.product.images[0] || '/placeholder.svg'}
                          alt={item.product.title}
                          width={72}
                          height={72}
                          className={styles.productThumbImg}
                        />
                      </Link>

                      {/* Product Details */}
                      <div className={styles.productDetailsCol}>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className={styles.productTitleLink}
                        >
                          <h3 className={styles.productTitle}>{item.product.title}</h3>
                        </Link>

                        <div className={styles.officialStoreRow}>
                          <BadgeCheck size={12} className={styles.officialCheckIcon} />
                          <span className={styles.officialStoreName}>
                            {item.product.brand || 'Qatify'} Official Store
                          </span>
                        </div>

                        <div className={styles.modelRow}>
                          {item.selectedColor ? (
                            <span>Color: <strong>{item.selectedColor}</strong></span>
                          ) : item.selectedOption ? (
                            <span>Variant: <strong>{item.selectedOption}</strong></span>
                          ) : (
                            <span>Model: <strong>{item.product.brand || 'Original Edition'}</strong></span>
                          )}
                        </div>
                      </div>

                      {/* Boxed Stepper [ - | 1 | + ] */}
                      <div className={styles.segmentedStepper}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className={styles.stepperActionBtn}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} strokeWidth={2.5} />
                        </button>
                        <div className={styles.stepperDivider} />
                        <span className={styles.stepperNumber}>{item.quantity}</span>
                        <div className={styles.stepperDivider} />
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className={styles.stepperActionBtn}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* Price Column */}
                      <div className={styles.itemPriceArea}>
                        <strong className={styles.itemTotalPrice}>
                          {(item.product.priceQAR * item.quantity).toLocaleString()} QAR
                        </strong>
                        <span className={styles.itemUnitPrice}>
                          {item.product.priceQAR.toLocaleString()} QAR/unit
                        </span>
                      </div>

                      {/* Remove Button (✕) */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className={styles.removeCloseBtn}
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <X size={16} strokeWidth={2.2} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 2: YOU MAY ALSO LIKE (2-COLUMN GRID) */}
              {recommendedProducts.length > 0 && (
                <div className={styles.youMayLikeSection}>
                  <div className={styles.youMayLikeHeader}>
                    <h2 className={styles.youMayLikeTitle}>You May Also Like</h2>
                    <p className={styles.youMayLikeSub}>
                      People frequently buy these with the products on your cart.
                    </p>
                  </div>

                  <div className={styles.recommendGrid}>
                    {recommendedProducts.map((p) => (
                      <div key={p.id} className={styles.recommendCard}>
                        {/* Image Column */}
                        <div className={styles.recImageCol}>
                          <Link href={`/products/${p.slug}`} className={styles.recThumbLink}>
                            <Image
                              src={p.images[0] || '/placeholder.svg'}
                              alt={p.title}
                              width={84}
                              height={84}
                              className={styles.recThumbImg}
                            />
                          </Link>
                          <span className={styles.officialWarrantyBadge}>
                            <ShieldCheck size={10} />
                            <span>Authentic Product</span>
                          </span>
                        </div>

                        {/* Content Column */}
                        <div className={styles.recDetailsCol}>
                          <Link href={`/products/${p.slug}`} className={styles.recProductTitleLink}>
                            <h4 className={styles.recProductTitle}>{p.title}</h4>
                          </Link>

                          <div className={styles.recPriceWrap}>
                            <span className={styles.recMainPrice}>
                              {p.priceQAR.toLocaleString()} QAR
                            </span>
                            {p.originalPriceQAR > p.priceQAR && (
                              <span className={styles.recOldPrice}>
                                {p.originalPriceQAR.toLocaleString()} QAR
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => addToCart(p, 1, undefined, undefined, false)}
                            className={styles.recAddToCartButton}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===============================================================
                RIGHT COLUMN: STICKY ORDER SUMMARY
            ================================================================ */}
            <div className={styles.rightColumn}>
              <div className={styles.orderSummaryCard}>
                <h3 className={styles.summaryTitle}>Order Summary</h3>

                {/* Dashed Box: "Get Some Extra" */}
                <div className={styles.getExtraDashedBox}>
                  <div className={styles.getExtraHead}>
                    <strong className={styles.getExtraTitle}>Get Some Extra</strong>
                    <span className={styles.getExtraSub}>Use coupon/voucher/star points</span>
                  </div>

                  {/* Tabs: [ Coupon ] [ Gift Voucher ] */}
                  <div className={styles.couponTabs}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('coupon')}
                      className={`${styles.couponTabBtn} ${
                        activeTab === 'coupon' ? styles.couponTabActive : ''
                      }`}
                    >
                      <Tag size={11} />
                      <span>Coupon</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('voucher')}
                      className={`${styles.couponTabBtn} ${
                        activeTab === 'voucher' ? styles.couponTabActive : ''
                      }`}
                    >
                      <Gift size={11} />
                      <span>Gift Voucher</span>
                    </button>
                  </div>

                  {/* Integrated Input + Apply Form */}
                  <form onSubmit={handleApplyCoupon} className={styles.couponInputBar}>
                    <input
                      type="text"
                      placeholder={
                        activeTab === 'coupon'
                          ? 'Enter promo code'
                          : 'Enter voucher code'
                      }
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        if (couponError) setCouponError(null);
                      }}
                      className={styles.couponInputField}
                    />
                    <button
                      type="submit"
                      disabled={isValidatingCoupon}
                      className={styles.couponApplyButton}
                    >
                      {isValidatingCoupon ? '...' : 'Apply'}
                    </button>
                  </form>

                  {/* Coupon Validation Error */}
                  {couponError && (
                    <div className={styles.couponErrorRow}>
                      <AlertCircle size={13} style={{ color: '#dc2626', flexShrink: 0 }} />
                      <span>{couponError}</span>
                    </div>
                  )}

                  {/* Active Coupon Status */}
                  {appliedCoupon && (
                    <div className={styles.couponAppliedRow}>
                      <span>
                        Coupon <strong>{appliedCoupon}</strong> active (-{couponDiscount} QAR)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setCoupon(null, 0);
                          setCouponError(null);
                        }}
                        className={styles.removeCouponX}
                        aria-label="Remove coupon"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Sub-Total Row */}
                <div className={styles.summaryLineRow}>
                  <span className={styles.lineLabel}>Sub-Total:</span>
                  <span className={styles.lineValue}>
                    {cartSubtotal.toLocaleString()} QAR
                  </span>
                </div>

                {appliedCoupon && (
                  <div className={styles.summaryLineRow}>
                    <span className={styles.lineLabel}>Coupon Discount:</span>
                    <span className={styles.discountValue}>
                      - {couponDiscount.toLocaleString()} QAR
                    </span>
                  </div>
                )}

                {/* Total Row */}
                <div className={`${styles.summaryLineRow} ${styles.grandTotalLine}`}>
                  <span className={styles.totalLabel}>Total:</span>
                  <strong className={styles.totalValue}>
                    {grandTotal.toLocaleString()} QAR
                  </strong>
                </div>

                {/* Confirm Order CTA Button */}
                <button
                  type="button"
                  onClick={() => router.push('/checkout')}
                  className={styles.confirmOrderCTA}
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
