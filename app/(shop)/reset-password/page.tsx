'use client';

// =============================================================================
// Qatify — Customer Password Reset Page (/reset-password)
// Handles direct reset links from email & manual verification codes
// =============================================================================

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { QatifyLogo } from '@/components/brand/QatifyLogo';
import { useShop } from '@/context/ShopContext';
import styles from '../login/login.module.scss';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const convex = useConvex();
  const { signIn } = useAuthActions();
  const { showToast } = useShop();

  const codeFromUrl = searchParams.get('code') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailFromUrl);
  const [code, setCode] = useState(codeFromUrl);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sync state if URL searchParams update
  useEffect(() => {
    if (emailFromUrl && !email) setEmail(emailFromUrl);
    if (codeFromUrl && !code) setCode(codeFromUrl);
  }, [emailFromUrl, codeFromUrl]);

  // Request new reset link if no code
  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const exists = await convex.query(api.users.checkEmailExists, { email: cleanEmail });
      if (!exists) {
        setErrorMessage('এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে সঠিক ইমেইল দিন অথবা অ্যাকাউন্ট খুলুন।');
        setLoading(false);
        return;
      }

      await signIn('password', {
        flow: 'reset',
        email: cleanEmail,
      });

      setSuccessMessage(`পাসওয়ার্ড রিসেট লিংক এবং ভেরিফিকেশন কোড আপনার ইমেইলে (${cleanEmail}) পাঠানো হয়েছে! ইনবক্স চেক করুন।`);
    } catch (err: any) {
      console.error('Reset request error:', err);
      setErrorMessage('রিসেট লিংক পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // Submit new password with code
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!code.trim()) {
      setErrorMessage('Please enter your 8-character verification code.');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      await signIn('password', {
        flow: 'reset-verification',
        email: cleanEmail,
        code: code.trim(),
        newPassword: newPassword,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('qatify_user_email', cleanEmail);
        localStorage.setItem('qatify_remembered_email', cleanEmail);

        if ('PasswordCredential' in window) {
          try {
            const cred = new (window as any).PasswordCredential({
              id: cleanEmail,
              password: newPassword,
            });
            await navigator.credentials.store(cred);
          } catch {
            // Silently ignore
          }
        }
      }

      showToast('Password Updated! 🇶🇦', 'Your password has been reset successfully.', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Password reset error:', err);
      const msg = err?.message || String(err);
      if (msg.includes('Invalid code') || msg.includes('incorrect') || msg.includes('code')) {
        setErrorMessage('ভেরিফিকেশন কোডটি সঠিক নয় বা মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে সঠিক কোড দিন বা নতুন লিংক নিন।');
      } else {
        setErrorMessage('পাসওয়ার্ড আপডেট ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  const hasCode = Boolean(code);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.cardHeader}>
            <Link href="/" className={styles.logoLink}>
              <QatifyLogo size="md" />
            </Link>
            <h1 className={styles.title}>
              {hasCode ? 'Set New Password' : 'Reset Your Password'}
            </h1>
            <p className={styles.subtitle}>
              {hasCode
                ? `Enter a new password for ${email || 'your Qatify account'}`
                : 'Enter your registered email to receive a password reset link.'}
            </p>
          </div>

          <div style={{ padding: '1.75rem 2rem 2rem' }}>
            {errorMessage && (
              <div className={styles.errorAlert} style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className={styles.successAlert} style={{ marginBottom: '1.25rem' }}>
                <div className={styles.successRow}>
                  <CheckCircle2 size={16} color="#16a34a" />
                  <span>লিংক পাঠানো হয়েছে!</span>
                </div>
                <div>{successMessage}</div>
              </div>
            )}

            {hasCode ? (
              // FORM 1: SET NEW PASSWORD
              <form onSubmit={handleResetPassword} method="post" autoComplete="on">
                <div className={styles.fieldGroup}>
                  <label htmlFor="reset-email" className={styles.label}>
                    Email Address *
                  </label>
                  <div className={styles.inputWrapper}>
                    <Mail size={16} className={styles.icon} />
                    <input
                      id="reset-email"
                      name="username"
                      type="email"
                      required
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup} style={{ marginTop: '1rem' }}>
                  <label htmlFor="reset-code" className={styles.label}>
                    Verification Code *
                  </label>
                  <div className={styles.inputWrapper}>
                    <KeyRound size={16} className={styles.icon} />
                    <input
                      id="reset-code"
                      type="text"
                      required
                      placeholder="ENTER CODE"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className={`${styles.input} ${styles.codeInput}`}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup} style={{ marginTop: '1rem' }}>
                  <div className={styles.passwordLabelRow}>
                    <label htmlFor="reset-new-password" className={styles.label}>
                      New Password *
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#8A1538', fontWeight: 600 }}>
                      Min 8 chars
                    </span>
                  </div>
                  <div className={styles.inputWrapper}>
                    <Lock size={16} className={styles.icon} />
                    <input
                      id="reset-new-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={styles.input}
                    />
                    <button
                      type="button"
                      className={styles.toggleBtn}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className={styles.fieldGroup} style={{ marginTop: '1rem' }}>
                  <label htmlFor="reset-confirm-password" className={styles.label}>
                    Confirm New Password *
                  </label>
                  <div className={styles.inputWrapper}>
                    <Lock size={16} className={styles.icon} />
                    <input
                      id="reset-confirm-password"
                      name="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitBtn}
                  style={{ marginTop: '1.5rem' }}
                >
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    <>
                      <span>Save Password & Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              // FORM 2: REQUEST RESET LINK
              <form onSubmit={handleRequestLink} method="post" autoComplete="on">
                <div className={styles.fieldGroup}>
                  <label htmlFor="request-email" className={styles.label}>
                    Your Registered Email *
                  </label>
                  <div className={styles.inputWrapper}>
                    <Mail size={16} className={styles.icon} />
                    <input
                      id="request-email"
                      name="username"
                      type="email"
                      required
                      autoComplete="username"
                      placeholder="tariq@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={styles.submitBtn}
                  style={{ marginTop: '1.25rem' }}
                >
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FF6D00',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    onClick={() => setCode(' ')}
                  >
                    Already have a reset code? Click here
                  </button>
                </div>
              </form>
            )}

            <div className={styles.footerLink} style={{ marginTop: '1.25rem' }}>
              <Link
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: '#FF6D00',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <ArrowLeft size={14} />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.securityBadge}>
          <ShieldCheck size={14} />
          <span>Protected by Convex Backend & Qatar Express Security</span>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.pageWrapper}>
          <div className={styles.spinner} />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

