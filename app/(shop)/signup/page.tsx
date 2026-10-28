'use client';

// =============================================================================
// Qatify — Customer Signup Page (/signup)
// =============================================================================

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { api } from '@/convex/_generated/api';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Plane,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { QatifyLogo } from '@/components/brand/QatifyLogo';
import { useShop } from '@/context/ShopContext';
import styles from '../login/login.module.scss';

export default function SignupPage() {
  const router = useRouter();
  const viewer = useQuery(api.users.viewer);
  const { signIn } = useAuthActions();
  const { showToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const params: Record<string, string> = {
        flow: 'signUp',
        email: cleanEmail,
        password: password,
        name: name.trim(),
      };
      if (phone.trim()) {
        params.phone = `+974 ${phone.trim().replace(/^\+?974\s*/, '')}`;
      }
      await signIn('password', params);

      if (typeof window !== 'undefined') {
        localStorage.setItem('qatify_user_email', cleanEmail);
      }

      showToast('Welcome to Qatify! 🇶🇦', `Account created successfully for ${name.trim()}`, 'success');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Sign up error:', err);
      const msg = err?.message || String(err);
      if (msg.includes('Account already exists') || msg.includes('user already exists')) {
        setErrorMessage('An account already exists with this email. Please sign in instead.');
      } else {
        setErrorMessage('Failed to create account. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.cardHeader}>
            <Link href="/" className={styles.logoLink}>
              <QatifyLogo size="md" />
            </Link>
            <h1 className={styles.title}>Create Your Account</h1>
            <p className={styles.subtitle}>
              Fast checkout, live Qatar air tracking & exclusive member discounts
            </p>
          </div>

          <div className={styles.perks}>
            <div className={styles.perk}>
              <Plane size={13} />
              <span>Air Transit DOH</span>
            </div>
            <div className={styles.perk}>
              <Sparkles size={13} />
              <span>10% First Order</span>
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
              <label className={styles.label}>Full Name *</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.icon} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Al-Mansoor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email Address *</label>
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
              <label className={styles.label}>Qatar Mobile (Optional)</label>
              <div className={styles.inputWrapper}>
                <Phone size={16} className={styles.icon} />
                <span className={styles.phonePrefix}>+974</span>
                <input
                  type="tel"
                  placeholder="5512 8894"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s]/g, ''))}
                  className={`${styles.input} ${styles.phoneInput}`}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className={styles.label}>Password *</label>
                <span style={{ fontSize: '0.75rem', color: '#8A1538', fontWeight: 600 }}>Min 8 chars</span>
              </div>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.icon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="Create a strong password"
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
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className={styles.footerLink}>
              Already registered?{' '}
              <Link href="/login" className={styles.highlightLink}>
                Sign In
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
