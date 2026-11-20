'use client';

// =============================================================================
// Qatify — Sticky Homepage Notification & Deals Subscription Bar
// Fixed at bottom (above MobileBottomNav on mobile, bottom 0 on desktop)
// 5s stay timer on homepage, auto-subscribes logged-in user, stores in Convex
// =============================================================================

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, CheckCircle, Bell, X } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useShop } from '@/context/ShopContext';
import styles from './SubscribeNotificationBanner.module.scss';

export const SubscribeNotificationBanner: React.FC = () => {
  const pathname = usePathname();
  const { showToast } = useShop();

  const [isVisible, setIsVisible] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);

  // Authenticated customer (if logged in)
  const viewer = useQuery(api.users.viewer);
  const subscribeNewsletter = useMutation(api.newsletter.subscribe);

  // Check known email from logged-in user or previous session
  const [storedEmail, setStoredEmail] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const detected =
      localStorage.getItem('qatify_user_email') ||
      localStorage.getItem('qatify_remembered_email') ||
      '';
    setStoredEmail(detected);
  }, []);

  const effectiveEmail = (viewer?.email || storedEmail || '').trim();

  // Query if the effective email is already in the backend database
  const isAlreadySubscribedInDb = useQuery(
    api.newsletter.isEmailSubscribed,
    effectiveEmail ? { email: effectiveEmail } : 'skip'
  );

  useEffect(() => {
    // Only execute on client and only on the Homepage ('/')
    if (typeof window === 'undefined') return;
    if (pathname !== '/') {
      setIsVisible(false);
      return;
    }

    // 1. Check if user already marked subscribed in localStorage
    const isSubscribedLocally = localStorage.getItem('qatify_subscribed') === 'true';
    if (isSubscribedLocally) {
      return;
    }

    // 2. Check if user is known and already subscribed in DB
    if (isAlreadySubscribedInDb) {
      localStorage.setItem('qatify_subscribed', 'true');
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

    // 4. Appear after staying 5 seconds on the homepage
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [pathname, isAlreadySubscribedInDb]);

  const handleLater = () => {
    setIsVisible(false);
    setShowEmailInput(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('qatify_notif_later', Date.now().toString());
    }
  };

  const handleSubscribeClick = async () => {
    // 1. Request native browser push notification permission if supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        Notification.requestPermission().catch(() => {});
      } catch {
        // Safe fallback
      }
    }

    // 2. If user email is available (logged in user or remembered session), auto-subscribe!
    if (effectiveEmail && effectiveEmail.includes('@')) {
      setIsSubmitting(true);
      try {
        await subscribeNewsletter({
          email: effectiveEmail,
          source: 'homepage_sticky_banner_auto',
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('qatify_subscribed', 'true');
          localStorage.setItem('qatify_user_email', effectiveEmail);
        }

        setSubscribedEmail(effectiveEmail);
        setIsSuccess(true);
        showToast(
          'Subscribed to Qatify Notifications! 🔔',
          `Updates will be sent to ${effectiveEmail}`,
          'success'
        );

        setTimeout(() => {
          setIsVisible(false);
        }, 1800);
      } catch (err) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('qatify_subscribed', 'true');
        }
        setIsSuccess(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 1500);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // 3. If guest without email, open inline email capture field
    setShowEmailInput(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      showToast('Please enter a valid email address', '', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await subscribeNewsletter({
        email: cleanEmail,
        source: 'homepage_sticky_banner',
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('qatify_subscribed', 'true');
        localStorage.setItem('qatify_user_email', cleanEmail);
      }

      setSubscribedEmail(cleanEmail);
      setIsSuccess(true);
      showToast(
        'Subscribed to Qatify Notifications! 🔔',
        'You will receive exclusive Qatar gadget updates & deal alerts.',
        'success'
      );

      setTimeout(() => {
        setIsVisible(false);
      }, 1800);
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.setItem('qatify_subscribed', 'true');
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only render on homepage and when visible
  if (pathname !== '/' || !isVisible) {
    return null;
  }

  return (
    <aside
      className={`${styles.stickyBar} ${isVisible ? styles.visible : ''}`}
      aria-label="Notification subscription banner"
      role="region"
    >
      <div className={styles.stickyInner}>
        {/* Left Side: Qatify App Badge & Message */}
        <div className={`${styles.infoSection} ${showEmailInput ? styles.inputMode : ''}`}>
          <div className={styles.logoBadge} aria-hidden="true">
            <ShoppingBag size={20} className={styles.bagIcon} />
            <span className={styles.brandText}>QATIFY</span>
          </div>

          <div className={styles.textCol}>
            <p className={styles.mainTitle}>
              Subscribe to our notifications for the latest news and updates.
            </p>
            <p className={styles.subTitle}>
              You can disable anytime. Get exclusive Qatar gadget drops &amp; flash deals.
            </p>
          </div>
        </div>

        {/* Right Side: Actions (Success / Inline Input / Buttons) */}
        <div className={`${styles.actionSection} ${showEmailInput ? styles.actionInputMode : ''}`}>
          {isSuccess ? (
            <div className={styles.successNotice}>
              <CheckCircle size={16} className={styles.checkIcon} />
              <span>
                {subscribedEmail
                  ? `Subscribed with ${subscribedEmail}!`
                  : 'Successfully subscribed to updates!'}
              </span>
            </div>
          ) : showEmailInput ? (
            <form onSubmit={handleEmailSubmit} className={styles.inlineForm}>
              <input
                type="email"
                required
                autoFocus
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className={styles.emailInput}
                aria-label="Email address"
              />
              <button
                type="submit"
                className={styles.subscribeBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Subscribe'}
              </button>
            </form>
          ) : (
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={handleLater}
                className={styles.laterBtn}
              >
                Later
              </button>
              <button
                type="button"
                onClick={handleSubscribeClick}
                className={styles.subscribeBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Subscribing...'
                ) : (
                  <>
                    <Bell size={14} className={styles.btnIcon} />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Quick Dismiss Button */}
          <button
            type="button"
            onClick={handleLater}
            className={styles.closeBtn}
            aria-label="Dismiss notification bar"
            title="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
