'use client';

// =============================================================================
// Qatify — Global Footer (Deep Obsidian Black #0A0A0C Anchor)
// Dropship Assurance Strip + Category Columns + Qatar Address + Payment Badges
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Plane,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Send,
  MessageCircle,
} from 'lucide-react';
import { QatifyLogo } from '@/components/brand/QatifyLogo';
import { useShop } from '@/context/ShopContext';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
  const { showToast, openChat } = useShop();
  const [email, setEmail] = useState('');
  const subscribeNewsletter = useMutation(api.newsletter.subscribe);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (cleanEmail) {
      try {
        await subscribeNewsletter({ email: cleanEmail, source: 'footer' });
        showToast('Subscribed to Qatify VIP! 🎉', 'You will receive top trending gadget deals in Qatar.');
        setEmail('');
      } catch (err: any) {
        showToast('Subscription Notice', err?.message || 'Could not subscribe right now.', 'warning');
      }
    }
  };

  return (
    <footer className={styles.footer}>
      {/* 1. DROPSHIP ASSURANCE TRUST STRIP */}
      <div className={styles.trustStrip}>
        <div className="container">
          <div className={styles.trustGrid}>
            <div className={styles.trustCard}>
              <div className={styles.trustIconWrap}>
                <Plane size={24} />
              </div>
              <div className={styles.trustContent}>
                <h4 className={styles.trustTitle}>6–10 Days Air Express</h4>
                <p className={styles.trustDesc}>
                  Direct air transit from global tech hub to Hamad Airport (DOH) & doorstep delivery in Qatar.
                </p>
              </div>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIconWrap}>
                <ShieldCheck size={24} />
              </div>
              <div className={styles.trustContent}>
                <h4 className={styles.trustTitle}>100% Pre-Dispatch Checked</h4>
                <p className={styles.trustDesc}>
                  Every electronic item undergoes powered testing and optical inspection before packaging.
                </p>
              </div>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIconWrap}>
                <CreditCard size={24} />
              </div>
              <div className={styles.trustContent}>
                <h4 className={styles.trustTitle}>Secure QAR Payment</h4>
                <p className={styles.trustDesc}>
                  Pay securely in Qatari Riyal (QAR) with Apple Pay, Visa, Mastercard, or local debit cards.
                </p>
              </div>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIconWrap}>
                <RotateCcw size={24} />
              </div>
              <div className={styles.trustContent}>
                <h4 className={styles.trustTitle}>14-Day Return Protection</h4>
                <p className={styles.trustDesc}>
                  Hassle-free replacement guarantee on defective electronics across all Qatar municipalities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT */}
      <div className={styles.mainFooter}>
        <div className="container">
          <div className={styles.footerGrid}>
            {/* Col 1: Brand Info & Qatar Presence */}
            <div className={styles.brandCol}>
              <QatifyLogo variant="light" size="lg" showTagline={true} />
              <p className={styles.brandBio}>
                Qatify is Qatar’s premium direct-from-source tech and gadget dropshipping destination. Delivering viral electronics, MagSafe power gear, gaming peripherals, and smart living innovations directly to your doorstep in Doha, Lusail, Al Rayyan, and Al Wakrah in 6–10 business days.
              </p>

              <div className={styles.contactDetails}>
                <div className={styles.contactRow}>
                  <MapPin size={15} />
                  <span>C-Ring Road, Doha, State of Qatar</span>
                </div>
                <div className={styles.contactRow}>
                  <Phone size={15} />
                  <span>+974 4492 8100 | WhatsApp: +974 5512 8894</span>
                </div>
                <div className={styles.contactRow}>
                  <Mail size={15} />
                  <span>support@qatify.qa</span>
                </div>
                <div className={styles.contactRow}>
                  <MessageCircle size={15} />
                  <button
                    type="button"
                    onClick={() => openChat()}
                    className={styles.chatFooterBtn}
                  >
                    Chat With Us Live (2 min response)
                  </button>
                </div>
                <div className={styles.contactRow}>
                  <Clock size={15} />
                  <span>Support: 8:00 AM – 11:00 PM (GMT+3 Doha Time)</span>
                </div>
              </div>
            </div>

            {/* Col 2: Top Categories */}
            <div className={styles.linksCol}>
              <h5 className={styles.colTitle}>Popular Categories</h5>
              <ul className={styles.linksList}>
                <li><Link href="/shop?cat=mobile-accessories">Mobile & MagSafe</Link></li>
                <li><Link href="/shop?cat=chargers-powerbanks">GaN Chargers & Banks</Link></li>
                <li><Link href="/shop?cat=tws-audio">TWS & Spatial Audio</Link></li>
                <li><Link href="/shop?cat=smartwatches">Smartwatches & Fitness</Link></li>
                <li><Link href="/shop?cat=car-accessories">Car Tech & Mounts</Link></li>
                <li><Link href="/shop?cat=gaming-gear">Gaming & Desk Gear</Link></li>
                <li><Link href="/shop?cat=smart-home">Smart Home Ambience</Link></li>
              </ul>
            </div>

            {/* Col 3: Customer Care & Tracking */}
            <div className={styles.linksCol}>
              <h5 className={styles.colTitle}>Customer Care</h5>
              <ul className={styles.linksList}>
                <li>
                  <button
                    type="button"
                    onClick={() => openChat()}
                    className={styles.linkButton}
                  >
                    💬 Live Chat & Support
                  </button>
                </li>
                <li><Link href="/dashboard">Track International Shipment</Link></li>
                <li><Link href="/cart">Shopping Cart & Delivery</Link></li>
                <li><Link href="/dashboard?tab=orders">Order History & Invoices</Link></li>
                <li><Link href="/shop?filter=under-99">Deals Under QAR 99</Link></li>
                <li><Link href="/dashboard?tab=addresses">Qatar Delivery Zones</Link></li>
                <li><Link href="/dashboard">Direct Air Express Tracking</Link></li>
              </ul>
            </div>

            {/* Col 4: Newsletter & Exclusive Qatar Deals */}
            <div className={styles.newsletterCol}>
              <h5 className={styles.colTitle}>Qatar Deal Alerts</h5>
              <p className={styles.newsletterDesc}>
                Subscribe to get early access to viral gadget drops, limited air batches, and exclusive discounts up to 50% off.
              </p>

              <form onSubmit={handleNewsletter} className={styles.newsletterForm}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.newsletterSubmit} aria-label="Subscribe">
                  <Send size={15} />
                </button>
              </form>

              <div className={styles.deliveryBadgeMini}>
                <span className={styles.yellowSpark}>⚡</span>
                <span>Average delivery time: <strong>7.4 business days</strong> to Doha</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM UTILITY & PAYMENT BADGES */}
      <div className={styles.bottomBar}>
        <div className="container">
          <div className={styles.bottomInner}>
            <div className={styles.copyrightText}>
              © {new Date().getFullYear()} <strong>Qatify.qa</strong>. All Rights Reserved. Engineered for Qatar.
            </div>

            {/* Regional Payment Badges */}
            <div className={styles.paymentMethods}>
              <span className={styles.payBadge}>Apple Pay</span>
              <span className={styles.payBadge}>Visa</span>
              <span className={styles.payBadge}>Mastercard</span>
              <span className={styles.payBadge}>QAR Currency</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

