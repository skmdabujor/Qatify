'use client';

// =============================================================================
// Qatify — Customer Login Page (/login)
// =============================================================================

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useConvex } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { api } from '@/convex/_generated/api';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Plane,
  Sparkles,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { QatifyLogo } from '@/components/brand/QatifyLogo';
import { useShop } from '@/context/ShopContext';
import styles from './login.module.scss';

type LoginViewMode = 'signIn' | 'forgotPassword' | 'resetSent';

export default function LoginPage() {
  const router = useRouter();
  const convex = useConvex();
  const viewer = useQuery(api.users.viewer);
  const { signIn } = useAuthActions();
  const { showToast } = useShop();

  const [mode, setMode] = useState<LoginViewMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rememberedEmail, setRememberedEmail] = useState('');

  // Hydrate remembered email for 1-click suggestion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored =
        localStorage.getItem('qatify_remembered_email') ||
        localStorage.getItem('qatify_user_email') ||
        '';
      if (stored) {
        setRememberedEmail(stored);
        if (!email) {
          setEmail(stored);
        }
      }
    }
  }, []);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (viewer) {
      router.replace('/dashboard');
    }
  }, [viewer, router]);

  // Save credentials to browser Credential Management API (Chrome/Edge/Safari/Android)
  const saveBrowserCredentials = async (userEmail: string, userPass: string) => {
    if (typeof window !== 'undefined' && 'PasswordCredential' in window) {
      try {
        const cred = new (window as any).PasswordCredential({
          id: userEmail,
          password: userPass,
        });
        await navigator.credentials.store(cred);
      } catch {
        // Silently continue if browser blocks or unsupported
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // -------------------------------------------------------------------------
    // Flow 1: FORGOT PASSWORD REQUEST
    // -------------------------------------------------------------------------
    if (mode === 'forgotPassword') {
      setLoading(true);
      try {
        const exists = await convex.query(api.users.checkEmailExists, { email: cleanEmail });
        if (!exists) {
          setErrorMessage('No account found with this email. Please check your email or create an account.');
          setLoading(false);
          return;
        }

        await signIn('password', {
          flow: 'reset',
          email: cleanEmail,
        });

        setSuccessMessage(`Password reset link and verification code have been sent to your email (${cleanEmail})!`);
        setMode('resetSent');
      } catch (err: any) {
        console.error('Reset request error:', err);
        setErrorMessage('Unable to send password reset code. Please try again shortly.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // -------------------------------------------------------------------------
    // Flow 2: RESET VERIFICATION (Inline code verification)
    // -------------------------------------------------------------------------
    if (mode === 'resetSent') {
      if (!resetCode.trim()) {
        setErrorMessage('Please enter the verification code sent to your email.');
        return;
      }
      if (!newPassword || newPassword.length < 8) {
        setErrorMessage('New password must be at least 8 characters long.');
        return;
      }

      setLoading(true);
      try {
        await signIn('password', {
          flow: 'reset-verification',
          email: cleanEmail,
          code: resetCode.trim(),
          newPassword: newPassword,
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('qatify_user_email', cleanEmail);
          localStorage.setItem('qatify_remembered_email', cleanEmail);
        }

        await saveBrowserCredentials(cleanEmail, newPassword);

        showToast('Password Updated! 🇶🇦', 'Your password has been reset successfully.', 'success');
        router.push('/dashboard');
      } catch (err: any) {
        console.error('Reset code error:', err);
        const msg = err?.message || String(err);
        if (msg.includes('Invalid code') || msg.includes('incorrect') || msg.includes('code')) {
          setErrorMessage('The verification code is incorrect or expired. Please enter the valid code.');
        } else {
          setErrorMessage('Password reset failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // -------------------------------------------------------------------------
    // Flow 3: SIGN IN
    // -------------------------------------------------------------------------
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await signIn('password', {
        flow: 'signIn',
        email: cleanEmail,
        password: password,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('qatify_user_email', cleanEmail);
        localStorage.setItem('qatify_remembered_email', cleanEmail);
      }

      await saveBrowserCredentials(cleanEmail, password);

      showToast('Signed In Successfully 🇶🇦', 'Welcome back to Qatify', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Sign in error:', err);
      const msg = err?.message || String(err);
      if (
        msg.includes('Invalid credentials') ||
        msg.includes('incorrect') ||
        msg.includes('password') ||
        msg.includes('Invalid')
      ) {
        setErrorMessage('Invalid email or password. Please verify and try again.');
      } else {
        setErrorMessage('Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authContainer}>
        {/* Card */}
        <div className={styles.authCard}>
          <div className={styles.cardHeader}>
            <Link href="/" className={styles.logoLink}>
              <QatifyLogo size="md" />
            </Link>
            <h1 className={styles.title}>
              {mode === 'signIn' && 'Sign In to Qatify'}
              {mode === 'forgotPassword' && 'Forgot Password'}
              {mode === 'resetSent' && 'Verify & Set Password'}
            </h1>
            <p className={styles.subtitle}>
              {mode === 'signIn' && 'Track live air shipments & manage your orders in Qatar'}
              {mode === 'forgotPassword' && 'Enter your registered email and we’ll send a password reset link.'}
              {mode === 'resetSent' && `We sent a reset link & verification code to ${email}`}
            </p>
          </div>

          {mode === 'signIn' && (
            <div className={styles.perks}>
              <div className={styles.perk}>
                <Plane size={13} />
                <span>5-Stage Air Tracking</span>
              </div>
              <div className={styles.perk}>
                <Sparkles size={13} />
                <span>VIP Pricing</span>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={styles.form}
            method="post"
            autoComplete="on"
          >
            {errorMessage && (
              <div className={styles.errorAlert}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className={styles.successAlert}>
                <div className={styles.successRow}>
                  <CheckCircle2 size={16} color="#16a34a" />
                  <span>Verification Link Sent!</span>
                </div>
                <div>{successMessage}</div>
              </div>
            )}

            {/* Email Field (when not in resetSent mode) */}
            {mode !== 'resetSent' && (
              <div className={styles.fieldGroup}>
                <label htmlFor="login-email" className={styles.label}>
                  Email Address *
                </label>
                <div className={styles.inputWrapper}>
                  <Mail size={16} className={styles.icon} />
                  <input
                    id="login-email"
                    name="username"
                    type="email"
                    required
                    autoComplete="username webauthn"
                    inputMode="email"
                    placeholder="tariq@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                  />
                </div>

                {/* 1-Click Login Suggestion */}
                {mode === 'signIn' && rememberedEmail && rememberedEmail !== email && (
                  <button
                    type="button"
                    className={styles.suggestionChip}
                    onClick={() => {
                      setEmail(rememberedEmail);
                      document.getElementById('login-password')?.focus();
                    }}
                    title="Click to fill saved account"
                  >
                    <Sparkles size={14} className={styles.suggestionIcon} />
                    <span>
                      Saved Login: <strong>{rememberedEmail}</strong> (Click to fill)
                    </span>
                  </button>
                )}
              </div>
            )}

            {/* Password Field (Sign In Mode) */}
            {mode === 'signIn' && (
              <div className={styles.fieldGroup}>
                <div className={styles.passwordLabelRow}>
                  <label htmlFor="login-password" className={styles.label}>
                    Password *
                  </label>
                  <button
                    type="button"
                    className={styles.forgotBtn}
                    onClick={() => {
                      setMode('forgotPassword');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.icon} />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
            )}

            {/* Reset Sent Fields (Code + New Password) */}
            {mode === 'resetSent' && (
              <>
                <div className={styles.fieldGroup}>
                  <label htmlFor="login-code" className={styles.label}>
                    Reset Verification Code *
                  </label>
                  <div className={styles.inputWrapper}>
                    <KeyRound size={16} className={styles.icon} />
                    <input
                      id="login-code"
                      type="text"
                      required
                      placeholder="ENTER CODE"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                      className={`${styles.input} ${styles.codeInput}`}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                    Check your email inbox or click the link sent to your email.
                  </span>
                </div>

                <div className={styles.fieldGroup}>
                  <div className={styles.passwordLabelRow}>
                    <label htmlFor="login-new-password" className={styles.label}>
                      New Password *
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#8A1538', fontWeight: 600 }}>
                      Min 8 chars
                    </span>
                  </div>
                  <div className={styles.inputWrapper}>
                    <Lock size={16} className={styles.icon} />
                    <input
                      id="login-new-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Create a new strong password"
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
              </>
            )}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  <span>
                    {mode === 'signIn' && 'Sign In'}
                    {mode === 'forgotPassword' && 'Send Reset Link'}
                    {mode === 'resetSent' && 'Save New Password & Sign In'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {mode === 'signIn' && (
              <div className={styles.footerLink}>
                Don&apos;t have an account?{' '}
                <Link href="/signup" className={styles.highlightLink}>
                  Create Account
                </Link>
              </div>
            )}

            {(mode === 'forgotPassword' || mode === 'resetSent') && (
              <div className={styles.footerLink}>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FF6D00',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontWeight: 700,
                  }}
                  onClick={() => {
                    setMode('signIn');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </button>
              </div>
            )}
          </form>
        </div>

        <div className={styles.securityBadge}>
          <ShieldCheck size={14} />
          <span>Protected by Convex Backend & Qatar Express Security</span>
        </div>
      </div>
    </div>
  );
}
