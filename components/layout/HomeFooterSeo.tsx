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
    items:
      'Active Noise Cancelling (ANC) Wireless Earbuds, MagSafe Magnetic Cases, Shockproof Drop Protection, 9H Tempered Glass Screen Protectors, Foldable Metal Phone Stands & Ergonomic Ring Grips',
  },
  {
    label: 'GaN Chargers & Power Banks',
    href: '/shop?cat=chargers-powerbanks',
    items:
      '65W, 100W & 140W USB-C GaNFast Wall Chargers (Qatar Standard UK 3-Pin), Magnetic Wireless Power Banks, High-Capacity 24,000mAh Laptop Battery Packs & Multi-Device Desktop Charging Stations',
  },
  {
    label: 'Smartwatches & Fitness',
    href: '/shop?cat=smartwatches',
    items:
      'Sunlight-Readable AMOLED Smartwatches, Bluetooth HD Calling Watches, 24/7 SpO2 & Heart Rate Monitors, Multi-Sport GPS Trackers, Stainless Steel Straps & Rugged Outdoor Smartbands',
  },
  {
    label: 'Gaming & Desk Tech',
    href: '/shop?cat=gaming-gear',
    items:
      'Hot-Swappable Mechanical Keyboards, Ultra-Lightweight PixArt PAW3395 Gaming Mice, Spatial Surround Sound Headsets, ARGB Desk Ambient Light Bars & XXL Precision Gaming Mousepads',
  },
  {
    label: 'Car Tech & Mounts',
    href: '/shop?cat=car-accessories',
    items:
      '4K UHD Dual-Channel Dash Cams, Magnetic Wireless Qi Vent Mounts, High-Output PD 30W Car Cigarette Lighter Chargers, Bluetooth FM Audio Transmitters & Portable Digital Tire Inflators',
  },
  {
    label: 'Drones & Vlogging Gear',
    href: '/shop?cat=drones-cameras',
    items:
      'Sub-250g GPS 4K Camera Drones, 3-Axis Motorized Handheld Gimbal Stabilizers, Wireless Dual-Channel Lapel Microphones, Dimmable Bi-Color LED Video Lights & Content Creator Tripods',
  },
  {
    label: 'Smart Home & Ambience',
    href: '/shop?cat=smart-home',
    items:
      'Smart Wi-Fi Indoor & Outdoor Security Cameras, Wireless App-Controlled Smart Plugs, Ambient RGBIC Corner Lamps, Motion-Activated Night Lights & Home Automation Smart Sensors',
  },
  {
    label: 'Laptop Hubs & Stands',
    href: '/shop?cat=laptop-gear',
    items:
      'Ergonomic Aluminum Foldable Laptop Risers, 10-in-1 Dual-Monitor USB-C Docking Hubs, High-Speed NVMe SSD Enclosures, ThunderBolt 4 Adapters & Waterproof Padded Carry Sleeves',
  },
  {
    label: 'Fast Cables & OTG Adapters',
    href: '/shop?cat=cables-adapters',
    items:
      '100W & 240W Power Delivery Double-Braided Type-C Cables, Apple MFi-Certified Lightning Cords, Right-Angle 90° Gaming Cables & High-Bandwidth USB 3.2 OTG Data Converters',
  },
  {
    label: 'Toys & Kids Learning Tech',
    href: '/shop?cat=toys-kids-learning',
    items:
      'Interactive English & Arabic Audio Flashcard Learning Devices, Reusable LCD Electronic Drawing Tablets, Programmable STEM Robotics Kits, Instant Print Kids Cameras & Smart Activity Gadgets',
  },
];

/**
 * Homepage-only authoritative e-commerce SEO guide tailored to Qatify Qatar.
 * Enriched with high-search-intent keywords, semantic category hierarchy,
 * and internal anchor links matching international e-commerce best practices.
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
              Welcome to <strong>ShopQatify.com</strong>, Qatar&apos;s premier online tech store for genuine consumer electronics, high-performance mobile accessories, next-generation GaN chargers, feature-rich smartwatches, immersive audio gear, and innovative smart home technology. We bridge the gap between world-class tech manufacturing and shoppers across the State of Qatar. Whether you are searching for premium wireless ANC earbuds for your daily commute in Doha, high-wattage multi-port USB-C adapters for your West Bay workstation, or rugged smart wearables for outdoor activities in Lusail, Qatify delivers a curated catalog of authentic electronics at competitive factory-direct prices. Experience reliable online shopping with full local pricing in <strong>Qatari Riyal (QAR)</strong>, real-time cargo milestone tracking, and dependable door-to-door express delivery covering every municipality across Qatar.
            </p>
          </div>

          {/* 2. Genuine Brands & Quality Assurance */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>100% Genuine Brands &amp; Quality-Tested Electronics</h3>
            <p className={styles.seoText}>
              Authenticity, reliability, and customer trust stand at the core of everything we do. At Qatify, we maintain a strict zero-counterfeit policy by partnering directly with authorized brand manufacturers and certified tech distributors. Shop 100% authentic, factory-sealed gadgets from industry-leading global brands including <strong>Anker, Baseus, Soundcore, Green Lion, Porodo, Joyroom, Wanbo, VGN,</strong> and <strong>SJRC</strong>. Every product batch undergoes rigorous multi-point functional inspections—verifying battery safety standards, wireless chip stability, thermal regulation, and structural integrity—prior to dispatch. Backed by our official{' '}
              <Link href="/refund-policy" className={styles.seoLink}>14-day return &amp; replacement policy</Link>, you can order with absolute confidence knowing you receive brand-new, original hardware.
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
              Traditional offline retail outlets and mall showrooms across Qatar incur substantial operational overheads—prime retail leases, storefront utilities, and multi-layered middleman distribution fees—which inevitably inflate final consumer prices. <strong>ShopQatify.com</strong> introduces a direct-to-consumer digital commerce model. By sourcing factory-sealed tech inventory directly from certified manufacturers and fulfilling orders straight to your doorstep, we eliminate costly commercial markups. Shoppers across Qatar gain access to original, untouched electronics priced transparently in <strong>Qatari Riyal (QAR)</strong>. Build your own personalized gear kit in our interactive{' '}
              <Link href="/bundle-builder" className={styles.seoLink}>Bundle Studio</Link> to save up to 20%, or discover hand-picked value deals in our{' '}
              <Link href="/shop?filter=under-99" className={styles.seoLink}>Super Deals Under QAR 99</Link> and{' '}
              <Link href="/shop?sort=trending" className={styles.seoLink}>Trending Best-Sellers</Link> collections.
            </p>
          </div>

          {/* 5. Exclusive Promotions & Offers */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>Exclusive Promotions &amp; Qatar Deal Alerts</h3>
            <p className={styles.seoText}>
              We believe premium technology should remain accessible without overspending. ShopQatify.com regularly introduces dynamic price drops, flash discounts, and limited-batch seasonal promotions. Explore our{' '}
              <Link href="/shop" className={styles.seoLink}>Mega Tech Deals</Link> with savings up to 60% on trending accessories, find budget-friendly everyday tech in our{' '}
              <Link href="/shop?filter=under-50" className={styles.seoLink}>Deals Under QAR 50</Link>, or maximize multi-item savings with custom kits in the{' '}
              <Link href="/bundle-builder" className={styles.seoLink}>Bundle Builder</Link>. Subscribe to our VIP Deal Alert newsletter for early access to viral gadget restocks, new technology drops, and exclusive discount codes designed for smart shoppers in Qatar.
            </p>
          </div>

          {/* 6. Fast Air Express Delivery */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>Direct Air Express Delivery Across Qatar</h3>
            <p className={styles.seoText}>
              Fast, predictable, and transparent shipping is critical when ordering tech gear online. Every Qatify shipment is handled via priority <strong>Direct Global Air Express</strong> with end-to-end milestone tracking. Enjoy <strong>FREE Express Air Delivery across Qatar on orders QAR 150 and above</strong> (or a simple flat rate of just <strong>QAR 15</strong> on orders below QAR 150). All international air freight manifests and electronic customs clearances at <strong>Hamad International Airport (DOH)</strong> are fully handled in advance—ensuring 100% zero surprise import fees or unexpected doorstep delivery charges. Packages arrive safely within <strong>6 to 10 business days</strong> directly to your doorstep in <strong>Doha, Lusail City, Al Rayyan, Al Wakrah, Al Khor, Umm Salal, Al Daayen, Al Shamal, and Al Shahaniya</strong>. Monitor every stage of your delivery live via our{' '}
              <Link href="/track-order" className={styles.seoLink}>Track Air Express Cargo</Link> portal.
            </p>
          </div>

          {/* 7. Multiple Payment Options */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>Multiple Secure Payment Options in QAR</h3>
            <p className={styles.seoText}>
              Complete checkout effortlessly and safely with bank-grade 256-bit SSL encryption. We accept full native payments in <strong>Qatari Riyal (QAR)</strong> through trusted digital payment options including <strong>Apple Pay, Google Pay, Visa, Mastercard,</strong> and <strong>American Express</strong>. Because transactions are billed locally in QAR, you never experience unexpected foreign currency conversion fees, dynamic currency markups, or international transaction charges on local Qatari debit and credit cards. Enjoy transparent order totals with zero hidden fees at checkout.
            </p>
          </div>

          {/* 8. 100% Online Store & Customer Care */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>100% Online Store &amp; Dedicated Customer Care</h3>
            <p className={styles.seoText}>
              Enjoy seamless online shopping 24 hours a day, 7 days a week, from any device anywhere in Qatar. Our dedicated bilingual customer care desk is actively available{' '}
              <strong>7 days a week from 8:00 AM to 11:00 PM (GMT+3 Doha Time)</strong> to assist with product specifications, device compatibility checks, live delivery updates, and tracking support. Reach our team instantly via Live Chat, send us a message on WhatsApp, or submit a request through our{' '}
              <Link href="/contact" className={styles.seoLink}>Contact Support Desk</Link> (<strong>support@shopqatify.com</strong>) for prompt, friendly customer service.
            </p>
          </div>

          {/* 9. Zero-Risk Guarantee & Returns */}
          <div className={styles.seoBlock}>
            <h3 className={styles.seoHeading}>Zero-Risk Missing Parcel Guarantee &amp; 14-Day Returns</h3>
            <p className={styles.seoText}>
              Every order placed on Qatify is safeguarded by our comprehensive customer protection program. Shipments include our <strong>100% Lost-in-Transit Money-Back or Free Replacement Guarantee</strong>—if your package encounters unexpected logistics loss or damage during transit, we replace your item or issue a full refund promptly. Furthermore, all eligible electronic products come with a <strong>14-day return and exchange window</strong> for any functional manufacturing defects or hardware irregularities. Review full warranty guidelines in our{' '}
              <Link href="/refund-policy" className={styles.seoLink}>Refund &amp; Return Policy</Link> and{' '}
              <Link href="/shipping-policy" className={styles.seoLink}>Shipping &amp; Delivery Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
