'use client';

// =============================================================================
// Qatify — Customer Login Page (/login)
// =============================================================================

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
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
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import { QatifyLogo } from '@/components/brand/QatifyLogo';
import { useShop } from '@/context/ShopContext';
import styles from './login.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const viewer = useQuery(api.users.viewer);
  const { signIn } = useAuthActions();
  const { showToast } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (viewer) {
      router.replace('/dashboard');
    }
  }, [viewer, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

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
      }

      showToast('Signed In Successfully 🇶🇦', 'Welcome back to Qatify', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Sign in error:', err);
      const msg = err?.message || String(err);
      if (msg.includes('Invalid credentials') || msg.includes('incorrect') || msg.includes('password')) {
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
            <h1 className={styles.title}>Sign In to Qatify</h1>
            <p className={styles.subtitle}>
              Track live air shipments & manage your orders in Qatar
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className={styles.form}>
            {errorMessage && (
              <div className={styles.errorAlert}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.icon} />
                <input
                  type="email"
                  required
                  placeholder="tariq@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.label}>Password</label>
                <span style={{ fontSize: '0.75rem', color: '#8A1538', fontWeight: 600 }}>Min 8 chars</span>
              </div>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.icon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                />
                <button
                  type="button"
                  className={styles.toggleBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className={styles.footerLink}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className={styles.highlightLink}>
                Create Account
              </Link>
            </div>
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
