'use client';

// =============================================================================
// Qatify — Web Push & Deals Notification Subscribe Prompt
// 100% Native Qatify Brand (Signature Sunset Orange #ffb800)
// Sequential Action Trigger: Upon Later/Subscribe, triggers First-Time Discount Popup
// =============================================================================

import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useShop } from '@/context/ShopContext';
import styles from './SubscribeNotificationBanner.module.scss';

export const SubscribeNotificationBanner: React.FC = () => {
  const { showToast } = useShop();
  const [isVisible, setIsVisible] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const subscribeNewsletter = useMutation(api.newsletter.subscribe);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // 1. Check if user is already logged in
    const userEmail =
      localStorage.getItem('qatify_user_email') ||
      localStorage.getItem('qatify_remembered_email');
    if (userEmail) {
      return; // Already registered/logged in user, don't show
    }

    // 2. Check if user already subscribed
    const isSubscribed = localStorage.getItem('qatify_subscribed') === 'true';
    if (isSubscribed) {
      return;
    }

    // 3. Check if user clicked 'Later' within the past 24 hours
    const laterTimestamp = localStorage.getItem('qatify_notif_later');
    if (laterTimestamp) {
      const elapsedMs = Date.now() - parseInt(laterTimestamp, 10);
      const oneDayMs = 24 * 60 * 60 * 1000;
      if (elapsedMs < oneDayMs) {
        return;
      }
    }

    // Smooth delay before presenting the prompt (2 seconds)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const triggerNextPopup = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('qatify:open-discount-popup'));
    }
  };

  const handleLater = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('qatify_notif_later', Date.now().toString());
    }
    // Sequential trigger: After user acts on notification prompt, open the 10% discount popup
    triggerNextPopup();
  };

  const handleSubscribeClick = () => {
    // 1. Request native browser push notification permission if supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        Notification.requestPermission().catch(() => {});
      } catch {
        // Safe fallback
      }
    }

    // 2. Expand inline email input to capture deal alerts email
    setShowEmailInput(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Please enter a valid email address', '', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await subscribeNewsletter({
        email: cleanEmail,
        source: 'browser_notification_banner',
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('qatify_subscribed', 'true');
        localStorage.setItem('qatify_user_email', cleanEmail);
      }

      setIsSuccess(true);
      showToast(
        'Subscribed to Qatify Notifications! 🔔',
        'You will receive exclusive Qatar gadget updates & deal alerts.',
        'success'
      );

      setTimeout(() => {
        setIsVisible(false);
        // Sequential trigger: After subscribe completes, open the 10% discount popup
        triggerNextPopup();
      }, 1500);
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.setItem('qatify_subscribed', 'true');
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsVisible(false);
        triggerNextPopup();
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <aside
      className={styles.bannerWrapper}
      aria-label="Notification subscription banner"
      role="region"
    >
      <div className={styles.bannerCard}>
        <div className={styles.topRow}>
          {/* Qatify Signature App Icon Badge (Orange Gradient + Monogram) */}
          <div className={styles.logoIconBox}>
            <ShoppingBag size={21} className={styles.bagIcon} />
            <span className={styles.brandText}>QATIFY</span>
          </div>

          {/* Prompt Message */}
          <p className={styles.messageContent}>
            Subscribe to our notifications for the latest news and updates. You can disable anytime.
          </p>
        </div>

        {/* Success Feedback */}
        {isSuccess ? (
          <div className={styles.successNotice}>
            <CheckCircle size={18} />
            <span>Successfully subscribed to notifications & updates!</span>
          </div>
        ) : showEmailInput ? (
          /* Inline Email Capture Form */
          <form onSubmit={handleEmailSubmit} className={styles.inlineForm}>
            <input
              type="email"
              required
              autoFocus
              placeholder="Enter your email for deal alerts..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <button type="submit" className={styles.confirmBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Confirm'}
            </button>
            <button
              type="button"
              className={styles.cancelFormBtn}
              onClick={() => {
                setShowEmailInput(false);
                // If they cancel out of email input, treat as later
                handleLater();
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          /* Qatify Action Buttons (Later / Subscribe) */
          <div className={styles.actionRow}>
            <button type="button" onClick={handleLater} className={styles.laterBtn}>
              Later
            </button>
            <button
              type="button"
              onClick={handleSubscribeClick}
              className={styles.subscribeBtn}
            >
              Subscribe
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
