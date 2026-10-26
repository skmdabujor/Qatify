'use client';

// =============================================================================
// Qatify — First-Time Visitor Signup & 10% Discount Modal Popup
// Features: Auto-trigger for first-time visitors, Email validation,
// 10% coupon reveal (WELCOME10), Clipboard 1-click copy,
// Multiple close triggers (X button, Backdrop click, Esc key, Dismiss link),
// and Floating Reopen launcher pill.
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  X,
  Gift,
  Mail,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Plane,
  Tag,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import styles from './FirstTimeDiscountPopup.module.scss';

const COUPON_CODE = 'WELCOME10';

export const FirstTimeDiscountPopup: React.FC = () => {
  const { showToast } = useShop();
  const subscribeNewsletter = useMutation(api.newsletter.subscribe);

  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  // Initialize and check first-time visitor status
  useEffect(() => {
    setIsHydrated(true);

    try {
      const alreadyClaimed = localStorage.getItem('qatify_user_signed_up');
      const alreadyDismissed = localStorage.getItem('qatify_signup_popup_closed');

      if (alreadyClaimed) {
        setIsSubmitted(true);
        setHasDismissed(true);
      } else if (alreadyDismissed) {
        setHasDismissed(true);
      } else {
        // First-time visitor: open popup with a gentle delay after page loads
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);

        return () => clearTimeout(timer);
      }
    } catch {
      // Safe fallback if localStorage is unavailable
    }
  }, []);

  // Handle Close
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setHasDismissed(true);
    try {
      localStorage.setItem('qatify_signup_popup_closed', 'true');
    } catch {
      // ignore
    }
  }, []);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Sign-Up Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setEmailError('Please enter your email address.');
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    // Save signup state in Convex backend and localStorage
    subscribeNewsletter({ email: trimmedEmail, source: 'first_time_popup' }).catch((err) => {
      console.warn('Newsletter subscription sync error:', err);
    });

    try {
      localStorage.setItem('qatify_user_signed_up', 'true');
      localStorage.setItem('qatify_user_email', trimmedEmail);
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    showToast(
      'Welcome to Qatify! 🎉',
      `Use code ${COUPON_CODE} for 10% off your first purchase!`,
      'success'
    );
  };

  // Copy Coupon Code to Clipboard
  const handleCopyCode = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(COUPON_CODE);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = COUPON_CODE;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setCopied(true);
      showToast('Coupon Copied! 🏷️', `Code "${COUPON_CODE}" applied to clipboard.`, 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast('Code: ' + COUPON_CODE, 'Copy manually: ' + COUPON_CODE, 'info');
    }
  };

  if (!isHydrated) return null;

  return (
    <>
      {/* Floating Re-Open Launcher Badge (Allows user to reopen voucher if closed) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={styles.floatingReopenBadge}
          title="Open First-Time 10% Discount Offer"
          aria-label="Open 10% Discount Offer"
        >
          <Gift size={18} className={styles.badgeGiftIcon} />
          <span>{isSubmitted ? 'Your 10% OFF Voucher' : 'Get 10% OFF 🎁'}</span>
        </button>
      )}

      {/* Main Modal Backdrop & Container */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="discount-modal-title"
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card content
          >
            {/* Close Button ('X') */}
            <button
              type="button"
              onClick={handleClose}
              className={styles.closeBtn}
              aria-label="Close modal"
              title="Close"
            >
              <X size={18} />
            </button>

            {/* Gradient Header Banner */}
            <div className={styles.bannerHeader}>
              <div className={styles.badgePill}>
                <Sparkles size={13} />
                <span>FIRST-TIME SHOPPER REWARD</span>
              </div>
              <h2 id="discount-modal-title" className={styles.bannerTitle}>
                {isSubmitted ? 'Congratulations! 🎉' : 'Get 10% OFF Your First Order'}
              </h2>
              <div className={styles.arabicSub}>
                {isSubmitted ? 'كوبون الخصم الخاص بك جاهز' : 'احصل على خصم 10% لأول طلب لك'}
              </div>
              <p className={styles.bannerSubtitle}>
                {isSubmitted
                  ? 'Your special voucher code is activated. Apply it at checkout to enjoy 10% off.'
                  : 'Join Qatify today! Sign up to unlock an exclusive 10% discount on genuine tech and trending gadgets in Qatar.'}
              </p>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              {/* Value Proposition Perks */}
              <div className={styles.perksList}>
                <div className={styles.perkItem}>
                  <Tag size={14} />
                  <span>10% Off Entire Order</span>
                </div>
                <div className={styles.perkItem}>
                  <Plane size={14} />
                  <span>Tracked Air Express</span>
                </div>
                <div className={styles.perkItem}>
                  <ShieldCheck size={14} />
                  <span>1-Year QA Warranty</span>
                </div>
              </div>

              {!isSubmitted ? (
                /* STATE 1: SIGNUP FORM */
                <form onSubmit={handleSubmit} className={styles.signupForm} noValidate>
                  <div className={styles.inputGroup}>
                    <label htmlFor="first-order-email" className={styles.inputLabel}>
                      Email Address
                    </label>
                    <div className={styles.inputWrapper}>
                      <Mail size={16} className={styles.inputIcon} />
                      <input
                        id="first-order-email"
                        type="email"
                        placeholder="Enter your email (e.g. name@domain.com)"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        className={`${styles.textInput} ${emailError ? styles.inputError : ''}`}
                        autoFocus
                      />
                    </div>
                    {emailError && <span className={styles.errorText}>{emailError}</span>}
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    <span>Sign Up & Claim 10% OFF</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className={styles.dismissAction}
                  >
                    No thanks, I will pay full price
                  </button>
                </form>
              ) : (
                /* STATE 2: SUCCESS & VOUCHER REVEAL */
                <div className={styles.successContainer}>
                  <div className={styles.successIconWrap}>
                    <CheckCircle2 size={30} />
                  </div>
                  <h3 className={styles.successTitle}>Your Voucher is Ready!</h3>
                  <p className={styles.successSubtitle}>
                    Use this exclusive code in your cart or at checkout:
                  </p>

                  <div className={styles.couponCard}>
                    <div className={styles.couponDetails}>
                      <span className={styles.couponTagLabel}>10% OFF FIRST ORDER COUPON</span>
                      <span className={styles.couponCodeText}>{COUPON_CODE}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className={`${styles.copyCodeBtn} ${copied ? styles.copied : ''}`}
                    >
                      {copied ? (
                        <>
                          <Check size={14} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className={styles.shopNowBtn}
                  >
                    <span>Start Shopping with 10% OFF</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

