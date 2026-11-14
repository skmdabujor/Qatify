'use client';

import React from 'react';
import Link from 'next/link';
import styles from './HomeFooterSeo.module.scss';

interface FooterCategoryGuide {
  label: string;
  href: string;
  items: string;
}

const QATIFY_CATEGORY_GUIDE: FooterCategoryGuide[] = [
  {
    label: 'Mobile Accessories',
    href: '/shop?cat=mobile-accessories',
    items: 'Wireless ANC Earbuds, MagSafe Cases, Magnetic Stands, Screen Protectors & Phone Grips',
  },
  {
    label: 'GaN Chargers & Power Banks',
    href: '/shop?cat=chargers-powerbanks',
    items: '100W/140W GaN Wall Chargers (UK 3-Pin), MagSafe Wireless Power Banks & Desktop Charging Stations',
  },
  {
    label: 'Smartwatches & Fitness',
    href: '/shop?cat=smartwatches',
    items: 'AMOLED Smartwatches, Fitness & Health Trackers, Magnetic Straps & Rugged Wearables',
  },
  {
    label: 'Gaming & Desk Tech',
    href: '/shop?cat=gaming-gear',
    items: 'Mechanical Keyboards, Wireless Gaming Mice, Headsets, RGB Light Bars & Desk Mats',
  },
  {
    label: 'Car Tech & Mounts',
    href: '/shop?cat=car-accessories',
    items: 'MagSafe Car Vent Mounts, High-Speed PD Car Chargers, Dash Cams & Portable Tire Inflators',
  },
  {
    label: 'Drones & Vlogging Gear',
    href: '/shop?cat=drones-cameras',
    items: 'Gimbal Stabilizers, Mini Camera Drones, Wireless Lapel Microphones & LED Studio Lights',
  },
  {
    label: 'Smart Home & Ambience',
    href: '/shop?cat=smart-home',
    items: 'Wi-Fi Smart Plugs, Motion Sensor Lights, Ambient RGB Lamps & Home Automation Tech',
  },
  {
    label: 'Laptop Hubs & Stands',
    href: '/shop?cat=laptop-gear',
    items: 'USB-C Multi-Port Hubs, Aluminum Ergonomic Stands, Docking Stations & Sleeves',
  },
  {
    label: 'Fast Cables & OTG Adapters',
    href: '/shop?cat=cables-adapters',
    items: 'Braided 100W/240W USB-C Cables, Fast-Charge Cords & High-Speed OTG Adapters',
  },
  {
    label: 'Toys & Kids Learning Tech',
    href: '/shop?cat=toys-kids-learning',
    items: 'Interactive LCD Writing Tablets, STEM Building Kits & Educational Smart Toys for Kids',
  },
];

/**
 * Homepage-only informational footer guide tailored to Qatify Qatar's catalog,
 * delivery model, payment options, and customer guarantees.
 */
export const HomeFooterSeo: React.FC = () => {
  return (
    <section className={styles.seoSection} aria-label="Online Shopping Guide for Qatify Qatar">
      <div className="container">
        <div className={styles.seoStack}>
          {/* 1. Online Shopping Overview */}
          <div className={styles.seoBlock}>
            <h2 className={styles.seoHeading}>
              Online Shopping in Qatar | ShopQatify.com — Authentic Tech &amp; Smart Gadgets
            </h2>
            <p className={styles.seoText}>
              Shop the latest mobile accessories, GaN fast chargers, ANC earbuds, smartwatches, gaming &amp; desk gear, smart home tech, and lifestyle gadgets at{' '}
              <Link href="/shop" className={styles.seoLink}>ShopQatify.com</Link>. Enjoy direct air express delivery across{' '}
              <strong>Doha, Lusail, Al Rayyan, Al Wakrah</strong>, and all Qatar municipalities, free shipping on orders{' '}
              <strong>QAR 150+</strong>, and secure Qatari Riyal (QAR) checkout with complete confidence.
            </p>
          </div>

          {/* 2. Genuine Brands & Quality Assurance */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>100% Genuine Brands &amp; Quality-Tested Electronics</h3>
            <p className={styles.seoText}>
              Buy 100% authentic, factory-sealed products from verified global tech brands including{' '}
              <strong>Anker, Baseus, Green Lion, Porodo,</strong> and <strong>Soundcore</strong> — each quality-tested before dispatch and backed by our{' '}
              <Link href="/refund-policy" className={styles.seoLink}>14-day return &amp; replacement policy</Link>.
            </p>
          </div>

          {/* 3. What You Can Buy */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>What You Can Buy from ShopQatify.com</h3>
            <ul className={styles.categoryList}>
              {QATIFY_CATEGORY_GUIDE.map((cat) => (
                <li key={cat.href} className={styles.categoryItem}>
                  <Link href={cat.href} className={styles.seoLink}>
                    {cat.label}
                  </Link>{' '}
                  — {cat.items}
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Smarter Tech Shopping Without Markups */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>Qatify Qatar — Smarter Tech Shopping Without Showroom Markups</h3>
            <p className={styles.seoText}>
              <strong>ShopQatify.com</strong> operates as a 100% online cross-border tech platform built specifically for shoppers in Qatar. By sourcing directly from certified global manufacturers and removing expensive mall showroom overhead, we offer fresh, untouched electronics in{' '}
              <strong>Qatari Riyal (QAR)</strong> at everyday value prices. Build a custom multi-item kit in our{' '}
              <Link href="/bundle-builder" className={styles.seoLink}>Bundle Studio</Link> to save up to 20%, or browse curated{' '}
              <Link href="/shop?filter=under-99" className={styles.seoLink}>Super Deals Under QAR 99</Link> and{' '}
              <Link href="/shop?sort=trending" className={styles.seoLink}>Trending in Doha</Link> best-sellers.
            </p>
          </div>

          {/* 5. Exclusive Promotions & Offers */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>Exclusive Promotions &amp; Qatar Deal Alerts</h3>
            <p className={styles.seoText}>
              Don&apos;t miss weekly drops and limited air-cargo savings across our{' '}
              <Link href="/shop" className={styles.seoLink}>Mega Tech Deals</Link> (up to 60% off),{' '}
              <Link href="/shop?filter=under-99" className={styles.seoLink}>Super Deals Under QAR 99</Link>,{' '}
              <Link href="/bundle-builder" className={styles.seoLink}>Bundle Studio</Link> multi-item discounts (up to 20% off), and{' '}
              <strong>VIP Newsletter</strong> alerts for early access to viral gadget launches.
            </p>
          </div>

          {/* 6. Fast Air Express Delivery */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>Direct Air Express Delivery Across Qatar</h3>
            <p className={styles.seoText}>
              Enjoy <strong>FREE Express Air Delivery</strong> across Qatar on orders <strong>QAR 150 and above</strong> (or a flat{' '}
              <strong>QAR 15</strong> rate for orders under QAR 150). Shipments fly directly into{' '}
              <strong>Hamad International Airport (DOH)</strong> with customs clearance handled—no surprise fees at the door—and arrive within{' '}
              <strong>6 to 10 business days</strong> across Doha, Lusail, Al Rayyan, Al Wakrah, Al Khor, Umm Salal, Al Shamal, and Al Shahaniya. Follow every milestone live via{' '}
              <Link href="/track-order" className={styles.seoLink}>Track Air Express Cargo</Link>.
            </p>
          </div>

          {/* 7. Multiple Payment Options */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>Multiple Secure Payment Options in QAR</h3>
            <p className={styles.seoText}>
              Pay your way in <strong>Qatari Riyal (QAR)</strong> using <strong>Apple Pay, Google Pay, Visa, Mastercard,</strong> or{' '}
              <strong>American Express</strong> — with zero foreign currency conversion fees on Qatari bank cards and no minimum order value required.
            </p>
          </div>

          {/* 8. 100% Online Store & Customer Care */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>100% Online Store &amp; Dedicated Customer Care</h3>
            <p className={styles.seoText}>
              Shop conveniently from anywhere in Qatar, 24/7. Our online customer support desk is available{' '}
              <strong>7 days a week from 8:00 AM – 11:00 PM (GMT+3 Doha Time)</strong> via Live Chat, WhatsApp, or our{' '}
              <Link href="/contact" className={styles.seoLink}>Contact Support Desk</Link> (<strong>support@shopqatify.com</strong>) for product guidance, order updates, and tracking assistance.
            </p>
          </div>

          {/* 9. Zero-Risk Guarantee & Returns */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>Zero-Risk Missing Parcel Guarantee &amp; 14-Day Returns</h3>
            <p className={styles.seoText}>
              Every Qatify order is protected by our <strong>100% Lost-in-Transit Money-Back or Free Replacement Guarantee</strong> and a{' '}
              <strong>14-day return window</strong> for functional manufacturing defects. Review full coverage in our{' '}
              <Link href="/refund-policy" className={styles.seoLink}>Refund &amp; Return Policy</Link> and{' '}
              <Link href="/shipping-policy" className={styles.seoLink}>Shipping &amp; Delivery Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
