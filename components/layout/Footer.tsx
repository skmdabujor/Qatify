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
  Headset,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
} from 'lucide-react';
import { QatifyLogo } from '@/components/brand/QatifyLogo';
import { useShop } from '@/context/ShopContext';
import {
  ApplePayIcon,
  VisaIcon,
  MastercardIcon,
  AmexIcon,
  QarCurrencyIcon,
  CashOnDeliveryIcon,
} from '@/components/ui/PaymentIcons';
import styles from './Footer.module.scss';

// Social links configuration
const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/qatify.qa',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/qatify.qa',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/97455128894',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.59L5.07 16.29C4.24 14.97 3.8 13.46 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.32 4.53 17.88 6.09C19.44 7.65 20.3 9.72 20.3 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.39C16.32 14.26 15.1 13.66 14.87 13.58C14.65 13.5 14.48 13.46 14.32 13.71C14.15 13.96 13.68 14.51 13.53 14.68C13.39 14.85 13.24 14.87 12.99 14.74C12.74 14.62 11.94 14.35 10.99 13.5C10.25 12.84 9.75 12.03 9.61 11.78C9.46 11.53 9.6 11.4 9.72 11.27C9.83 11.16 9.97 10.99 10.1 10.84C10.22 10.69 10.27 10.58 10.35 10.42C10.43 10.25 10.39 10.1 10.33 9.98C10.27 9.85 9.77 8.63 9.57 8.13C9.37 7.64 9.17 7.71 9.02 7.7C8.88 7.69 8.71 7.69 8.54 7.69C8.38 7.69 8.11 7.75 7.88 8C7.65 8.25 7 8.86 7 10.09C7 11.32 7.9 12.51 8.02 12.68C8.15 12.84 9.79 15.37 12.3 16.45C12.9 16.71 13.36 16.86 13.73 16.98C14.33 17.17 14.88 17.14 15.31 17.08C15.8 17 16.82 16.46 17.03 15.85C17.24 15.24 17.24 14.73 17.18 14.62C17.11 14.52 16.95 14.46 16.57 14.39Z" />
      </svg>
    ),
  },
];

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
      {/* 1. CUSTOMER ASSURANCE TRUST STRIP */}
      <div className={styles.trustStrip}>
        <div className="container">
          <div className={styles.trustGrid}>
            <div className={styles.trustCard}>
              <div className={styles.trustIconWrap}>
                <Plane size={24} />
              </div>
              <div className={styles.trustContent}>
                <h4 className={styles.trustTitle}>Fast Qatar Express Delivery</h4>
                <p className={styles.trustDesc}>
                  Prompt tracked doorstep delivery across Doha, Lusail, Al Rayyan, Al Wakrah, and all municipalities.
                </p>
              </div>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIconWrap}>
                <ShieldCheck size={24} />
              </div>
              <div className={styles.trustContent}>
                <h4 className={styles.trustTitle}>100% Genuine Guaranteed</h4>
                <p className={styles.trustDesc}>
                  Every product is authentic, factory-sealed, and quality tested before dispatch.
                </p>
              </div>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIconWrap}>
                <CreditCard size={24} />
              </div>
              <div className={styles.trustContent}>
                <h4 className={styles.trustTitle}>Secure Payments & COD</h4>
                <p className={styles.trustDesc}>
                  Pay securely in Qatari Riyal (QAR) with Apple Pay, Visa, Mastercard, or Cash on Delivery.
                </p>
              </div>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIconWrap}>
                <Headset size={24} />
              </div>
              <div className={styles.trustContent}>
                <h4 className={styles.trustTitle}>24/7 Dedicated Support</h4>
                <p className={styles.trustDesc}>
                  Live WhatsApp & customer service ready to assist you anywhere in Qatar.
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
                Qatify is Qatar’s trusted online destination for authentic tech accessories and smart lifestyle electronics. We offer the best prices in Qatar on leading brands including Anker, Baseus, Green Lion, Porodo, and Soundcore, backed by prompt doorstep delivery and local customer support.
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
                <li><Link href="/track-order">Track International Shipment</Link></li>
                <li><Link href="/cart">Shopping Cart & Delivery</Link></li>
                <li><Link href="/dashboard?tab=orders">Order History & Invoices</Link></li>
                <li><Link href="/shop?filter=under-99">Deals Under QAR 99</Link></li>
                <li><Link href="/dashboard?tab=addresses">Qatar Delivery Zones</Link></li>
                <li><Link href="/track-order">Direct Air Express Tracking</Link></li>
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

              {/* Social Media Links */}
              <div className={styles.socialSection}>
                <span className={styles.socialTitle}>Follow Us</span>
                <div className={styles.socialIcons}>
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialIconLink}
                      aria-label={`Follow Qatify on ${social.name}`}
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
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
            <div className={styles.paymentMethods} aria-label="Accepted Payment Methods in Qatar">
              <span className={styles.payIconCard} title="Apple Pay">
                <ApplePayIcon />
              </span>
              <span className={styles.payIconCard} title="Visa">
                <VisaIcon />
              </span>
              <span className={styles.payIconCard} title="Mastercard">
                <MastercardIcon />
              </span>
              <span className={styles.payIconCard} title="American Express">
                <AmexIcon />
              </span>
              <span className={styles.payIconCard} title="QAR Currency (ر.ق)">
                <QarCurrencyIcon />
              </span>
              <span className={styles.payIconCard} title="Cash on Delivery Across Qatar">
                <CashOnDeliveryIcon />
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

