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
  GooglePayIcon,
  QarCurrencyIcon,
} from '@/components/ui/PaymentIcons';
import styles from './Footer.module.scss';

// Social links configuration
const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/shopqatify',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/shopqatify',
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
    href: 'https://wa.me/8801304564836?text=Hello%20Qatify%20Support!',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
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
                <h4 className={styles.trustTitle}>Secure Payments & Instant Order</h4>
                <p className={styles.trustDesc}>
                  Pay securely in Qatari Riyal (QAR) with Apple Pay, Google Pay, Visa, or Mastercard with zero conversion fees.
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
            {/* Col 1: Brand Info & Online Delivery */}
            <div className={styles.brandCol}>
              <QatifyLogo variant="dark" size="lg" showTagline={true} />
              <p className={styles.brandBio}>
                Qatify is Qatar’s trusted online shopping destination for authentic tech accessories and smart lifestyle electronics. We connect shoppers directly to leading brands including Anker, Baseus, Green Lion, Porodo, and Soundcore, backed by prompt doorstep air delivery across Qatar.
              </p>

              <div className={styles.contactDetails}>
                <div className={styles.contactRow}>
                  <Plane size={15} />
                  <span>100% Online Store • Direct Express Air Delivery to Qatar</span>
                </div>
                <div className={styles.contactRow}>
                  <Mail size={15} />
                  <span>support@shopqatify.com</span>
                </div>
                <div className={styles.contactRow}>
                  <MessageCircle size={15} />
                  <button
                    type="button"
                    onClick={() => openChat()}
                    className={styles.chatFooterBtn}
                  >
                    Chat With Us Live (Instant Response)
                  </button>
                </div>
                <div className={styles.contactRow}>
                  <Clock size={15} />
                  <span>Online Customer Care: 8:00 AM – 11:00 PM (GMT+3 Doha Time)</span>
                </div>
              </div>
            </div>

            {/* Col 2: Top Categories */}
            <div className={styles.linksCol}>
              <h5 className={styles.colTitle}>Popular Categories</h5>
              <ul className={styles.linksList}>
                <li><Link href="/shop?cat=mobile-accessories">Mobile & MagSafe</Link></li>
                <li><Link href="/shop?cat=chargers-powerbanks">GaN Chargers & Banks</Link></li>
                <li><Link href="/shop?cat=toys-kids-learning">Toys-Kids Learning</Link></li>
                <li><Link href="/shop?cat=smartwatches">Smartwatches & Fitness</Link></li>
                <li><Link href="/shop?cat=car-accessories">Car Tech & Mounts</Link></li>
                <li><Link href="/shop?cat=gaming-gear">Gaming & Desk Gear</Link></li>
                <li><Link href="/shop?cat=smart-home">Smart Home Ambience</Link></li>
              </ul>
            </div>

            {/* Col 3: Customer Care & Policies */}
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
                <li><Link href="/contact">Contact Support Desk</Link></li>
                <li><Link href="/shipping-policy">Shipping & Delivery (6–10 Days)</Link></li>
                <li><Link href="/refund-policy">Refund & Return Policy</Link></li>
                <li><Link href="/track-order">Track Air Express Cargo</Link></li>
                <li><Link href="/privacy">Privacy Policy (Qatar PDPPL)</Link></li>
                <li><Link href="/terms">Terms & Conditions</Link></li>
                <li><Link href="/bundle-builder">Bundle Studio (Save Up to 20%)</Link></li>
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
              © {new Date().getFullYear()} <strong>ShopQatify.com</strong>. All Rights Reserved. Engineered for Qatar.
            </div>

            {/* Legal & Compliance Quick Links */}
            <nav className={styles.legalNav} aria-label="Legal & Policies">
              <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
              <span className={styles.legalDot}>•</span>
              <Link href="/terms" className={styles.legalLink}>Terms & Conditions</Link>
              <span className={styles.legalDot}>•</span>
              <Link href="/refund-policy" className={styles.legalLink}>Refund & Returns</Link>
              <span className={styles.legalDot}>•</span>
              <Link href="/shipping-policy" className={styles.legalLink}>Shipping Policy</Link>
              <span className={styles.legalDot}>•</span>
              <Link href="/contact" className={styles.legalLink}>Contact Us</Link>
            </nav>

            {/* Regional Payment Badges */}
            <div className={styles.paymentMethods} aria-label="Accepted Payment Methods in Qatar">
              <span className={styles.payIconCard} title="Apple Pay">
                <ApplePayIcon />
              </span>
              <span className={styles.payIconCard} title="Google Pay">
                <GooglePayIcon />
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
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

