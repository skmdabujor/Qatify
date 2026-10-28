'use client';

// =============================================================================
// Qatify — Home Combo Deals, Shell Shocker & New Drop Promo Section (3-Card Layout)
// 100% In-Stock Authentic Qatify Products from Catalog
// - Card 1: Combo Up & Save (Gaming & Desk Tech / GaN Fast Power)
// - Card 2: Shell Shocker (High Discount Deal of the Day — Crisp White Header)
// - Card 3: New Drop (Fresh Tech Arrival — Crisp White Header)
// Includes Carousel Flipping (< >), Working Cart Integration & QAR Pricing
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus, Check, X } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types/product';
import styles from './HomeComboDealsSection.module.scss';

// Helper to reliably find a product by ID from Qatify catalog
const getProduct = (id: string): Product => {
  const p = PRODUCTS.find((item) => item.id === id);
  if (!p) {
    throw new Error(`Product ${id} not found in Qatify catalog`);
  }
  return p;
};

// --- CARD 1: IN-STOCK COMBO DEALS ---
const IN_STOCK_COMBOS = [
  {
    id: 'combo-gaming-desk',
    category: 'Gaming & Desk Tech',
    categorySlug: 'gaming-gear',
    savingsQAR: 258,
    bundlePriceQAR: 269.0,
    originalPriceQAR: 527.0,
    topProduct: getProduct('qat-004'), // Baseus i-wok Light Bar (QAR 249)
    bottomLeft: getProduct('qat-009'), // VGN Dragonfly Gaming Mouse (QAR 199)
    bottomRight: getProduct('qat-014'), // Porodo Sound Reactive RGB Pickup Light (QAR 79)
  },
  {
    id: 'combo-fast-power',
    category: 'GaN Fast Power & Charging',
    categorySlug: 'chargers-powerbanks',
    savingsQAR: 318,
    bundlePriceQAR: 349.0,
    originalPriceQAR: 667.0,
    topProduct: getProduct('qat-006'), // Anker 737 140W Power Bank (QAR 379)
    bottomLeft: getProduct('qat-002'), // Anker Prime 100W GaN Wall Charger (QAR 219)
    bottomRight: getProduct('qat-012'), // Baseus 240W Fast Type-C Cable (QAR 69)
  },
];

// --- CARD 2: IN-STOCK SHELL SHOCKER (HOT FLASH DISCOUNTS) ---
const SHOCKER_DEALS = [
  {
    product: getProduct('qat-005'), // Green Lion Monaco Smartwatch
    promoNote: 'Free Silicone + Titanium Strap + Tempered Glass Protector with purchase!',
    priceQAR: 189.0,
    strikePriceQAR: 349.0,
  },
  {
    product: getProduct('qat-007'), // Wanbo T2 Max Pro Projector
    promoNote: 'Free Foldable 100" Anti-Light Ambient Projector Screen included!',
    priceQAR: 289.0,
    strikePriceQAR: 499.0,
  },
  {
    product: getProduct('qat-010'), // SJRC F22S 4K Pro GPS Drone
    promoNote: 'Free Extra Flight Battery + Waterproof Hard Shoulder Case included!',
    priceQAR: 449.0,
    strikePriceQAR: 799.0,
  },
];

// --- CARD 3: IN-STOCK NEW DROP (FRESH LAUNCHES & TRENDING GEAR) ---
const NEW_DROP_DEALS = [
  {
    product: getProduct('qat-001'), // Soundcore Liberty 4 NC Earbuds
    promoNote: 'Free Protective Silicone Case + Carabiner Clip with purchase, while supplies last!',
    priceQAR: 149.0,
    strikePriceQAR: 269.0,
  },
  {
    product: getProduct('qat-003'), // Joyroom 15W Magnetic Cooling Mount
    promoNote: 'Free Fast QC 3.0 Metal Car Adapter + Braided Type-C Cable included!',
    priceQAR: 99.0,
    strikePriceQAR: 169.0,
  },
  {
    product: getProduct('qat-008'), // Porodo 3-in-1 Foldable Charging Station
    promoNote: 'Free 20W Fast PD Wall Adapter included in retail package!',
    priceQAR: 99.0,
    strikePriceQAR: 179.0,
  },
];

export const HomeComboDealsSection: React.FC = () => {
  const router = useRouter();
  const { addToCart, showToast } = useShop();

  // Card 1: Interactive Tiered Bundle Starter (1 to 4 items, >= 180 QAR)
  const CARD_COMBO_POOL: Product[] = [
    getProduct('qat-004'), // Baseus i-wok Light Bar (QAR 249)
    getProduct('qat-009'), // VGN Dragonfly Gaming Mouse (QAR 199)
    getProduct('qat-002'), // Anker Prime 100W GaN Wall Charger (QAR 219)
    getProduct('qat-005'), // Green Lion Monaco Rugged Smartwatch (QAR 189)
    getProduct('qat-006'), // Anker 737 140W Power Bank (QAR 379)
  ];

  const [cardSelectedIds, setCardSelectedIds] = useState<string[]>([
    'qat-004',
    'qat-009',
    'qat-002',
  ]);

  const cardSelectedProducts = cardSelectedIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const cardSubtotal = cardSelectedProducts.reduce((sum, p) => sum + p.priceQAR, 0);
  const cardOriginalTotal = cardSelectedProducts.reduce(
    (sum, p) => sum + (p.originalPriceQAR || p.priceQAR),
    0
  );
  const cardSavings = Math.max(0, cardOriginalTotal - cardSubtotal);

  const handleCardPlus = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cardSelectedIds.length >= 4) {
      showToast(
        'Opening Bundle Studio! 🚀',
        'Add your 5th item in the collection to unlock 5% OFF!',
        'info'
      );
      router.push(`/bundle-builder?items=${cardSelectedIds.join(',')}`);
      return;
    }

    const nextProduct = CARD_COMBO_POOL.find((p) => !cardSelectedIds.includes(p.id));
    if (nextProduct) {
      const updated = [...cardSelectedIds, nextProduct.id];
      setCardSelectedIds(updated);
      showToast(
        'Item Added to Bundle! 🛒',
        `${nextProduct.title.slice(0, 30)} added (${updated.length}/4). Add 5 to unlock 5% OFF!`,
        'success'
      );
    }
  };

  const handleCardRemove = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (cardSelectedIds.length <= 1) {
      showToast('Minimum 1 Item', 'At least 1 item must remain in preview.', 'warning');
      return;
    }
    setCardSelectedIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleCardCta = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cardSelectedIds.length >= 4) {
      router.push(`/bundle-builder?items=${cardSelectedIds.join(',')}`);
    } else {
      cardSelectedProducts.forEach((p) => addToCart(p, 1));
      setAddedCombo(true);
      showToast(
        'Combo Added to Cart! 🛒',
        `${cardSelectedProducts.length} items added. Add 5 items to unlock 5% OFF!`,
        'success'
      );
      setTimeout(() => setAddedCombo(false), 2000);
    }
  };

  const [comboIndex, setComboIndex] = useState(0);
  const [shockerIndex, setShockerIndex] = useState(0);
  const [newDropIndex, setNewDropIndex] = useState(0);

  const [addedCombo, setAddedCombo] = useState(false);
  const [addedShocker, setAddedShocker] = useState(false);
  const [addedNewDrop, setAddedNewDrop] = useState(false);

  const currentCombo = IN_STOCK_COMBOS[comboIndex];
  const currentShocker = SHOCKER_DEALS[shockerIndex];
  const currentNewDrop = NEW_DROP_DEALS[newDropIndex];

  // Carousel Handlers
  const handleComboPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setComboIndex((prev) => (prev === 0 ? IN_STOCK_COMBOS.length - 1 : prev - 1));
  };
  const handleComboNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setComboIndex((prev) => (prev === IN_STOCK_COMBOS.length - 1 ? 0 : prev + 1));
  };

  const handleShockerPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setShockerIndex((prev) => (prev === 0 ? SHOCKER_DEALS.length - 1 : prev - 1));
  };
  const handleShockerNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setShockerIndex((prev) => (prev === SHOCKER_DEALS.length - 1 ? 0 : prev + 1));
  };

  const handleNewDropPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setNewDropIndex((prev) => (prev === 0 ? NEW_DROP_DEALS.length - 1 : prev - 1));
  };
  const handleNewDropNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setNewDropIndex((prev) => (prev === NEW_DROP_DEALS.length - 1 ? 0 : prev + 1));
  };

  // Add Real In-Stock Combo to Cart
  const handleAddCombo = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(currentCombo.topProduct, 1);
    addToCart(currentCombo.bottomLeft, 1);
    addToCart(currentCombo.bottomRight, 1);

    setAddedCombo(true);
    showToast(
      'Combo Added to Cart! 🛒',
      `${currentCombo.category} bundle added (Saved QAR ${currentCombo.savingsQAR})`,
      'success'
    );
    setTimeout(() => setAddedCombo(false), 2000);
  };

  // Add In-Stock Shell Shocker Deal to Cart
  const handleAddShocker = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(currentShocker.product, 1);
    setAddedShocker(true);
    showToast(
      'Shell Shocker Claimed! 🏷️',
      `${currentShocker.product.title.slice(0, 36)}... (QAR ${currentShocker.priceQAR})`,
      'success'
    );
    setTimeout(() => setAddedShocker(false), 2000);
  };

  // Add In-Stock New Drop Deal to Cart
  const handleAddNewDrop = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(currentNewDrop.product, 1);
    setAddedNewDrop(true);
    showToast(
      'New Drop Added! ⚡',
      `${currentNewDrop.product.title.slice(0, 36)}... (QAR ${currentNewDrop.priceQAR})`,
      'success'
    );
    setTimeout(() => setAddedNewDrop(false), 2000);
  };

  return (
    <section className={styles.sectionWrapper} aria-label="Qatify Combo Deals, Shell Shocker and New Drop">
      <div className={styles.cardsGrid}>
        {/* ===================================================================
            CARD 1 (1ST POSITION): IN-STOCK COMBO (GAMING & DESK TECH / FAST POWER)
        ==================================================================== */}
        <div className={styles.promoCard}>
          <div>
            <div className={styles.cardHeaderRow}>
              <div className={styles.categoryTitle}>Gaming & Desk Tech</div>
              <Link
                href={`/bundle-builder?items=${cardSelectedIds.join(',')}`}
                className={styles.headerActionLink}
                title="Open Full 180+ QAR Bundle Studio"
              >
                <span>More options</span>
                <span className={styles.chevronSmall}>▶</span>
              </Link>
            </div>

            <div className={styles.savingsCallout}>
              {cardSelectedIds.length === 4
                ? '🔥 4 items ready! Add 1 more to unlock 5% OFF!'
                : `Pick 5 to 20 items to unlock 5%–20% OFF (${cardSelectedIds.length}/4)`}
            </div>

            {/* Inner Light Container */}
            <div className={styles.bundleBox}>
              {/* Top Item */}
              {cardSelectedProducts[0] && (
                <div className={styles.topItemRow} title={cardSelectedProducts[0].title}>
                  <Link
                    href={`/products/${cardSelectedProducts[0].slug}`}
                    className={styles.thumbFrame}
                  >
                    <img
                      src={cardSelectedProducts[0].images[0]}
                      alt={cardSelectedProducts[0].title}
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </Link>
                  <span className={styles.itemTitle}>{cardSelectedProducts[0].title}</span>
                  {cardSelectedIds.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeSmallBtn}
                      onClick={(e) => handleCardRemove(e, cardSelectedProducts[0].id)}
                      title="Remove product"
                      aria-label="Remove item"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              )}

              {/* Clean Modern Slot Status Row (Replaced the confusing axis track) */}
              <div className={styles.slotDividerRow}>
                <span className={styles.slotCounterTag}>
                  Bundle Slots ({cardSelectedIds.length}/4)
                </span>
                {cardSelectedIds.length < 4 && (
                  <button
                    type="button"
                    className={styles.quickAddPill}
                    onClick={handleCardPlus}
                    title="Add item into bundle slot"
                  >
                    <Plus size={11} strokeWidth={3} />
                    <span>Add Item</span>
                  </button>
                )}
              </div>

              {/* Bottom Companion Products */}
              <div className={styles.bottomItemsGrid}>
                {cardSelectedProducts.slice(1).map((p) => (
                  <div key={p.id} className={styles.bottomItem} title={p.title}>
                    <div className={styles.smallThumbFrame}>
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <span className={styles.smallItemTitle}>{p.title}</span>
                    <button
                      type="button"
                      className={styles.removeSmallBtn}
                      onClick={(e) => handleCardRemove(e, p.id)}
                      title="Remove product"
                      aria-label="Remove item"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}

                {/* If fewer than 4 items, show an interactive Add Slot placeholder */}
                {cardSelectedIds.length < 4 && (
                  <button
                    type="button"
                    className={styles.addSlotCardBtn}
                    onClick={handleCardPlus}
                  >
                    <Plus size={12} />
                    <span>Add Item ({cardSelectedIds.length}/4)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Pricing Row */}
            <div className={styles.pricingRow}>
              <span className={styles.equalSign}>=</span>
              <div className={styles.totalPrice}>
                <span className={styles.currency}>QAR</span>
                <span>
                  {cardSubtotal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              {cardSavings > 0 && (
                <span className={styles.strikePrice}>
                  QAR{' '}
                  {cardOriginalTotal.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Action Button: Wide Add to cart / Add 5th to unlock */}
          <div>
            <button
              type="button"
              className={styles.wideAddToCartBtn}
              onClick={handleCardCta}
            >
              {addedCombo ? (
                <>
                  <Check size={14} /> Added to Cart
                </>
              ) : cardSelectedIds.length === 4 ? (
                <>
                  Add 5th Item (Unlock 5% OFF) <span className={styles.btnChevron}>▶</span>
                </>
              ) : (
                <>
                  Add to cart <span className={styles.btnChevron}>▶</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ===================================================================
            CARD 2 (2ND POSITION): IN-STOCK SHELL SHOCKER (NO FIRE ICON)
        ==================================================================== */}
        <div className={styles.promoCard}>
          <div>
            <div className={styles.cardHeaderRow}>
              <div className={styles.shockerTitleGroup}>
                <span className={styles.shockerText}>Shell Shocker</span>
              </div>
              <Link href={`/shop?category=${currentShocker.product.categorySlug}`} className={styles.headerActionLink}>
                <span>See all</span>
                <span className={styles.chevronSmall}>▶</span>
              </Link>
            </div>

            <Link href={`/products/${currentShocker.product.slug}`} style={{ textDecoration: 'none' }}>
              <div className={styles.shockerProductTitle}>
                {currentShocker.product.title}
              </div>
            </Link>

            <div className={styles.shockerPromoNote}>
              {currentShocker.promoNote}
            </div>

            {/* Deal Visual Row: Left Price, Right Card Graphic with Arrows */}
            <div className={styles.shockerVisualRow}>
              <div className={styles.shockerPriceBlock}>
                <div className={styles.shockerPriceLarge}>
                  <span className={styles.currency}>QAR</span>
                  <span>{Math.floor(currentShocker.priceQAR)}</span>
                  <span className={styles.cents}>.00</span>
                </div>
                <span className={styles.shockerStrikethrough}>
                  QAR {currentShocker.strikePriceQAR.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Carousel Container with Arrows & Card Box */}
              <div className={styles.shockerCarouselContainer}>
                <button
                  type="button"
                  className={styles.axisNavBtn}
                  onClick={handleShockerPrev}
                  aria-label="Previous Shell Shocker deal"
                >
                  <ChevronLeft size={20} />
                </button>

                <Link href={`/products/${currentShocker.product.slug}`} className={styles.shockerCardBox}>
                  <img
                    src={currentShocker.product.images[0]}
                    alt={currentShocker.product.title}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </Link>

                <button
                  type="button"
                  className={styles.axisNavBtn}
                  onClick={handleShockerNext}
                  aria-label="Next Shell Shocker deal"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Button: Wide Add to cart */}
          <div>
            <button
              type="button"
              className={styles.wideAddToCartBtn}
              onClick={handleAddShocker}
            >
              {addedShocker ? (
                <>
                  <Check size={14} /> Added to Cart
                </>
              ) : (
                <>
                  Add to cart <span className={styles.btnChevron}>▶</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ===================================================================
            CARD 3 (3RD POSITION): IN-STOCK NEW DROP (NO FIRE ICON)
        ==================================================================== */}
        <div className={styles.promoCard}>
          <div>
            <div className={styles.cardHeaderRow}>
              <div className={styles.newDropTitleGroup}>
                <span className={styles.newDropText}>New Drop</span>
              </div>
              <Link href={`/shop?category=${currentNewDrop.product.categorySlug}`} className={styles.headerActionLink}>
                <span>See all</span>
                <span className={styles.chevronSmall}>▶</span>
              </Link>
            </div>

            <Link href={`/products/${currentNewDrop.product.slug}`} style={{ textDecoration: 'none' }}>
              <div className={styles.shockerProductTitle}>
                {currentNewDrop.product.title}
              </div>
            </Link>

            <div className={styles.shockerPromoNote}>
              {currentNewDrop.promoNote}
            </div>

            {/* Deal Visual Row: Left Price, Right Card Graphic with Arrows */}
            <div className={styles.shockerVisualRow}>
              <div className={styles.shockerPriceBlock}>
                <div className={styles.shockerPriceLarge}>
                  <span className={styles.currency}>QAR</span>
                  <span>{Math.floor(currentNewDrop.priceQAR)}</span>
                  <span className={styles.cents}>.00</span>
                </div>
                <span className={styles.shockerStrikethrough}>
                  QAR {currentNewDrop.strikePriceQAR.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Carousel Container with Arrows & Card Box */}
              <div className={styles.shockerCarouselContainer}>
                <button
                  type="button"
                  className={styles.axisNavBtn}
                  onClick={handleNewDropPrev}
                  aria-label="Previous New Drop deal"
                >
                  <ChevronLeft size={20} />
                </button>

                <Link href={`/products/${currentNewDrop.product.slug}`} className={styles.shockerCardBox}>
                  <img
                    src={currentNewDrop.product.images[0]}
                    alt={currentNewDrop.product.title}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </Link>

                <button
                  type="button"
                  className={styles.axisNavBtn}
                  onClick={handleNewDropNext}
                  aria-label="Next New Drop deal"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Button: Wide Add to cart */}
          <div>
            <button
              type="button"
              className={styles.wideAddToCartBtn}
              onClick={handleAddNewDrop}
            >
              {addedNewDrop ? (
                <>
                  <Check size={14} /> Added to Cart
                </>
              ) : (
                <>
                  Add to cart <span className={styles.btnChevron}>▶</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeComboDealsSection;
