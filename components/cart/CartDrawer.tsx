'use client';

// =============================================================================
// Qatify — Slide-Over Cart Drawer with Qatar Free Delivery Progress & Arrival Preview
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  ShoppingBag,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import styles from './CartDrawer.module.scss';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    closeCart,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
    showToast,
    appliedCoupon,
    appliedDiscountQAR,
    setCoupon,
  } = useShop();

  const convex = useConvex();
  const [couponCode, setCouponCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  if (!isCartOpen) return null;

  const couponDiscount = appliedDiscountQAR || 0;
  const totalDiscount = couponDiscount;
  const shippingFee = cart.length === 0 ? 0 : 20;
  const grandTotal = Math.max(0, cartSubtotal - totalDiscount + shippingFee);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    setIsValidating(true);
    try {
      const res = await convex.query(api.coupons.validateCoupon, {
        code,
        subtotalQAR: cartSubtotal,
        currentDate: new Date().toISOString().slice(0, 10),
      });

      if (res.isValid && res.code) {
        setCoupon(res.code, res.discountQAR);
        showToast('Promo Code Applied! 🏷️', res.message, 'success');
        setCouponCode('');
      } else {
        showToast('Coupon Not Applied', res.message, 'warning');
      }
    } catch (err) {
      console.error('Coupon validation error:', err);
      showToast('Validation Error', 'Could not verify promo code.', 'error');
    } finally {
      setIsValidating(false);
    }
  };

  const handleProceedToCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className={styles.overlay} onClick={closeCart}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <ShoppingBag size={20} className={styles.headerIcon} />
            <h2 className={styles.headerTitle}>Shopping Cart</h2>
            <span className={styles.itemCountBadge}>({cart.length})</span>
          </div>
          <button
            onClick={closeCart}
            className={styles.closeBtn}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className={styles.itemsList}>
          {cart.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconCircle}>
                <ShoppingBag size={36} />
              </div>
              <p className={styles.emptyTitle}>Your cart is currently empty</p>
              <p className={styles.emptyDesc}>
                Explore trending tech, MagSafe gear, and smart electronics with 6–10 day delivery across Qatar.
              </p>
              <Link href="/shop" onClick={closeCart} className={styles.continueShopBtn}>
                Explore Qatar Super Deals
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className={styles.cartItemCard}>
                <div className={styles.itemImageWrap}>
                  <img
                    src={item.product.images[0] || '/placeholder.svg'}
                    alt={item.product.title}
                    className={styles.itemImage}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/placeholder.svg')) {
                        target.src = '/placeholder.svg';
                      }
                    }}
                  />
                </div>

                <div className={styles.itemDetails}>
                  <div className={styles.itemHeader}>
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className={styles.itemTitle}
                    >
                      {item.product.title}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={styles.itemDeleteBtn}
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Variant info */}
                  {(item.selectedColor || item.selectedOption) && (
                    <div className={styles.variantBadges}>
                      {item.selectedColor && (
                        <span className={styles.variantBadge}>
                          Color: {item.selectedColor}
                        </span>
                      )}
                      {item.selectedOption && (
                        <span className={styles.variantBadge}>
                          {item.selectedOption}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price & Quantity Controls */}
                  <div className={styles.itemFooter}>
                    <div className={styles.priceWrap}>
                      <span className={styles.unitPrice}>
                        QAR {item.product.priceQAR}
                      </span>
                      {item.product.originalPriceQAR > item.product.priceQAR && (
                        <span className={styles.originalPrice}>
                          QAR {item.product.originalPriceQAR}
                        </span>
                      )}
                    </div>

                    <div className={styles.qtyStepper}>
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className={styles.qtyNumber}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {cart.length > 0 && (
          <div className={styles.footer}>
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className={styles.promoForm}>
              <div className={styles.promoInputWrap}>
                <Tag size={14} className={styles.tagIcon} />
                <input
                  type="text"
                  placeholder="Promo Code (Try WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className={styles.promoInput}
                />
              </div>
              <button type="submit" className={styles.applyBtn}>
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className={styles.couponSuccessPill}>
                <span>Code <strong>{appliedCoupon}</strong> active (-QAR {couponDiscount})</span>
                <button
                  type="button"
                  onClick={() => setCoupon(null, 0)}
                  className={styles.removeCouponBtn}
                >
                  Remove
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className={styles.summaryLines}>
              <div className={styles.summaryLine}>
                <span>Subtotal</span>
                <span className={styles.summaryVal}>QAR {cartSubtotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className={`${styles.summaryLine} ${styles.discountLine}`}>
                  <span>Promo Coupon</span>
                  <span className={styles.summaryVal}>- QAR {couponDiscount}</span>
                </div>
              )}
              <div className={styles.summaryLine}>
                <span>Tracked Air Delivery</span>
                <span className={styles.summaryVal}>
                  {cart.length === 0 ? 'QAR 0' : `QAR ${shippingFee}`}
                </span>
              </div>
              <div className={`${styles.summaryLine} ${styles.totalLine}`}>
                <span>Estimated Total</span>
                <span className={styles.totalValue}>
                  QAR {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className={styles.ctaButtons}>
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className={styles.checkoutBtn}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>

              <Link
                href="/cart"
                onClick={closeCart}
                className={styles.viewCartBtn}
              >
                View Full Cart & Save Items
              </Link>
            </div>

            {/* Assurance trust note */}
            <div className={styles.assuranceNote}>
              <ShieldCheck size={14} />
              <span>100% Quality Inspected • 24/7 Qatar Support</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

