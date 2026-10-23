'use client';

// =============================================================================
// Qatify — Slide-Over Cart Drawer with Qatar Free Delivery Progress & Arrival Preview
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Plane,
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
    freeShippingThreshold,
    freeShippingRemaining,
    isFreeShipping,
    updateQuantity,
    removeFromCart,
    showToast,
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Calculate delivery window (6 to 10 days from today)
  const today = new Date();
  const minDeliveryDate = new Date(today);
  minDeliveryDate.setDate(today.getDate() + 6);
  const maxDeliveryDate = new Date(today);
  maxDeliveryDate.setDate(today.getDate() + 10);

  const deliveryDateString = `${minDeliveryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} – ${maxDeliveryDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`;

  const progressPercent = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );

  const discountAmount = appliedCoupon ? Math.round(cartSubtotal * 0.1) : 0;
  const shippingFee = isFreeShipping || cart.length === 0 ? 0 : 20;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'QATAR10' || code === 'QATIFY10' || code === 'WELCOME10') {
      setAppliedCoupon(code);
      showToast('Promo Code Applied! 🏷️', '10% discount applied to your order.');
    } else {
      showToast('Invalid Code', 'Try promo code "WELCOME10" or "QATAR10" for 10% off.', 'warning');
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

        {/* Free Delivery Progress Bar */}
        <div className={styles.shippingBarWrap}>
          <div className={styles.shippingBarStatus}>
            {isFreeShipping ? (
              <span className={styles.unlockedText}>
                🎉 <strong>Free Qatar Direct Air Express</strong> unlocked!
              </span>
            ) : (
              <span>
                Add <strong className="price-qar">QAR {freeShippingRemaining}</strong> more for <strong>FREE Qatar Air Shipping</strong>!
              </span>
            )}
          </div>
          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 6-10 Days Delivery Preview Strip */}
        <div className={styles.deliveryEstimateStrip}>
          <Plane size={14} className={styles.planeIcon} />
          <div className={styles.deliveryEstimateText}>
            <span>Direct Air Delivery to Qatar:</span>
            <strong>{deliveryDateString}</strong>
          </div>
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
                <span>Code <strong>{appliedCoupon}</strong> active (-10%)</span>
                <button
                  type="button"
                  onClick={() => setAppliedCoupon(null)}
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
                <span className="price-qar">QAR {cartSubtotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className={`${styles.summaryLine} ${styles.discountLine}`}>
                  <span>Promo Discount (10%)</span>
                  <span>- QAR {discountAmount}</span>
                </div>
              )}
              <div className={styles.summaryLine}>
                <span>
                  Tracked Air Delivery
                  {isFreeShipping && <span className={styles.freeTag}>FREE</span>}
                </span>
                <span className="price-qar">
                  {isFreeShipping ? 'QAR 0' : `QAR ${shippingFee}`}
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
              <span>100% Quality Inspected • 14-Day Return Guarantee</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

