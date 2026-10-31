'use client';

// =============================================================================
// Qatify — Customer Signup Page (/signup)
// =============================================================================

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useConvex } from 'convex/react';
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
import { COUNTRY_DIAL_CODES } from '@/components/auth/AuthModal';

export default function SignupPage() {
  const router = useRouter();
  const convex = useConvex();
  const viewer = useQuery(api.users.viewer);
  const { signIn } = useAuthActions();
  const { showToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+974');
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

  // Save credentials to browser Credential Management API (Chrome/Edge/Safari/Android)
  const saveBrowserCredentials = async (userEmail: string, userPass: string, userName?: string) => {
    if (typeof window !== 'undefined' && 'PasswordCredential' in window) {
      try {
        const cred = new (window as any).PasswordCredential({
          id: userEmail,
          password: userPass,
          name: userName || undefined,
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
      // 1. Strict Duplicate Account Restriction Pre-Check
      const emailAlreadyExists = await convex.query(api.users.checkEmailExists, { email: cleanEmail });
      if (emailAlreadyExists) {
        setErrorMessage('এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট খোলা আছে, অনুগ্রহ করে লগইন করুন।');
        setLoading(false);
        return;
      }

      // 2. Create customer account in Convex Auth
      const params: Record<string, string> = {
        flow: 'signUp',
        email: cleanEmail,
        password: password,
        name: name.trim(),
      };
      if (phone.trim()) {
        const rawPhone = phone.trim();
        if (rawPhone.startsWith('+')) {
          params.phone = rawPhone;
        } else {
          params.phone = `${countryCode} ${rawPhone}`;
        }
      }
      await signIn('password', params);

      if (typeof window !== 'undefined') {
        localStorage.setItem('qatify_user_email', cleanEmail);
        localStorage.setItem('qatify_remembered_email', cleanEmail);
      }

      await saveBrowserCredentials(cleanEmail, password, name.trim());

      showToast('Welcome to Qatify! 🇶🇦', `Account created successfully for ${name.trim()}`, 'success');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Sign up error:', err);
      const msg = err?.message || String(err);
      if (
        msg.includes('already exists') ||
        msg.includes('user already exists') ||
        (msg.includes('Account') && msg.includes('exists'))
      ) {
        setErrorMessage('এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট খোলা আছে, অনুগ্রহ করে লগইন করুন।');
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

          <form
            onSubmit={handleSubmit}
            className={styles.form}
            method="post"
            autoComplete="on"
          >
            {errorMessage && (
              <div className={styles.errorAlert}>
                <AlertCircle size={16} />
                <div>
                  <span>{errorMessage}</span>
                  {errorMessage.includes('ইতিমধ্যে একটি অ্যাকাউন্ট খোলা আছে') && (
                    <div>
                      <Link
                        href="/login"
                        className={styles.alertActionBtn}
                      >
                        লগইন করুন (Sign In) →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.fieldGroup}>
              <label htmlFor="signup-name" className={styles.label}>
                Full Name *
              </label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.icon} />
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Tariq Al-Mansoor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="signup-email" className={styles.label}>
                Email Address *
              </label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.icon} />
                <input
                  id="signup-email"
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
            </div>

            {/* Phone Number (Any Country / Optional) */}
            <div className={styles.fieldGroup}>
              <label htmlFor="signup-phone" className={styles.label}>
                Phone Number (Any Country / Optional)
              </label>
              <div className={styles.phoneInputGroup}>
                <select
                  className={styles.countryCodeSelect}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  aria-label="Country dial code"
                >
                  {COUNTRY_DIAL_CODES.map((item) => (
                    <option key={item.code + item.name} value={item.code}>
                      {item.flag} {item.code} ({item.name})
                    </option>
                  ))}
                </select>
                <div className={styles.phoneFieldWrapper}>
                  <input
                    id="signup-phone"
                    name="tel"
                    type="tel"
                    autoComplete="tel"
                    placeholder={
                      countryCode === '+974'
                        ? '5512 8894'
                        : countryCode === '+880'
                        ? '1712 345678'
                        : 'Phone number'
                    }
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.phoneTextInput}
                  />
                </div>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.passwordLabelRow}>
                <label htmlFor="signup-password" className={styles.label}>
                  Password *
                </label>
                <span style={{ fontSize: '0.75rem', color: '#8A1538', fontWeight: 600 }}>
                  Min 8 chars
                </span>
              </div>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.icon} />
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
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
