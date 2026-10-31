'use client';

// =============================================================================
// Qatify — Customer Sign In, Sign Up & Password Reset Modal
// Powered by Convex Auth (@convex-dev/auth)
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Plane,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';
import { QatifyLogo } from '@/components/brand/QatifyLogo';
import { useShop } from '@/context/ShopContext';
import styles from './AuthModal.module.scss';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signIn' | 'signUp';
  onSuccess?: () => void;
}

type AuthMode = 'signIn' | 'signUp' | 'forgotPassword' | 'resetSent';

// Supported international country dial codes
export const COUNTRY_DIAL_CODES = [
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+1', flag: '🇺🇸', name: 'USA/Canada' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+977', flag: '🇳🇵', name: 'Nepal' },
  { code: '+94', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+', flag: '🌐', name: 'Other' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signIn',
  onSuccess,
}) => {
  const convex = useConvex();
  const { signIn } = useAuthActions();
  const { showToast } = useShop();

  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+974');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [rememberedEmail, setRememberedEmail] = useState('');

  // Hydrate remembered email for 1-click login suggestions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored =
        localStorage.getItem('qatify_remembered_email') ||
        localStorage.getItem('qatify_user_email') ||
        '';
      if (stored) {
        setRememberedEmail(stored);
        if (!email && (mode === 'signIn' || defaultMode === 'signIn')) {
          setEmail(stored);
        }
      }
    }
  }, [isOpen, defaultMode]);

  // Keep mode in sync with defaultMode when opened
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setErrorMessage('');
      setSuccessMessage('');
      setPassword('');
      setResetCode('');
      setNewPassword('');
    }
  }, [isOpen, defaultMode]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    setSuccessMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // -------------------------------------------------------------------------
    // Flow 1: FORGOT PASSWORD (Send reset link & verification code)
    // -------------------------------------------------------------------------
    if (mode === 'forgotPassword') {
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

        setSuccessMessage(`পাসওয়ার্ড রিসেট লিংক এবং কোড আপনার ইমেইলে (${cleanEmail}) পাঠানো হয়েছে!`);
        setMode('resetSent');
      } catch (err: any) {
        console.error('Password reset request error:', err);
        const msg = err?.message || String(err);
        if (msg.includes('Cannot find') || msg.includes('InvalidAccountId')) {
          setErrorMessage('এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে সঠিক ইমেইল দিন।');
        } else {
          setErrorMessage('পাসওয়ার্ড রিসেট লিংক পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // -------------------------------------------------------------------------
    // Flow 2: RESET VERIFICATION (Set new password using code)
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
        onClose();
        if (onSuccess) onSuccess();
      } catch (err: any) {
        console.error('Password reset verification error:', err);
        const msg = err?.message || String(err);
        if (msg.includes('Invalid code') || msg.includes('incorrect') || msg.includes('code')) {
          setErrorMessage('ভেরিফিকেশন কোডটি সঠিক নয় বা মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে সঠিক কোড দিন।');
        } else {
          setErrorMessage('পাসওয়ার্ড আপডেট ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // -------------------------------------------------------------------------
    // Flow 3: SIGN UP (with strict duplicate account restriction)
    // -------------------------------------------------------------------------
    if (mode === 'signUp') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }

      if (!password || password.length < 8) {
        setErrorMessage('Password must be at least 8 characters long.');
        return;
      }

      setLoading(true);

      // Pre-check for duplicate account in Convex backend
      try {
        const emailAlreadyExists = await convex.query(api.users.checkEmailExists, { email: cleanEmail });
        if (emailAlreadyExists) {
          setErrorMessage('এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট খোলা আছে, অনুগ্রহ করে লগইন করুন।');
          setLoading(false);
          return;
        }

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

        showToast('Welcome to Qatify! 🇶🇦', `Account created successfully for ${name.trim() || cleanEmail}`, 'success');
        onClose();
        if (onSuccess) onSuccess();
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
      return;
    }

    // -------------------------------------------------------------------------
    // Flow 4: SIGN IN
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
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Auth error:', err);
      const msg = err?.message || String(err);
      if (
        msg.includes('Invalid credentials') ||
        msg.includes('incorrect') ||
        msg.includes('password') ||
        msg.includes('Invalid')
      ) {
        setErrorMessage('Invalid email or password. Please verify and try again.');
      } else {
        setErrorMessage('Authentication failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.brandLogo}>
            <QatifyLogo size="md" />
          </div>
          <h2 className={styles.title}>
            {mode === 'signIn' && 'Welcome Back'}
            {mode === 'signUp' && 'Create Customer Account'}
            {mode === 'forgotPassword' && 'Forgot Password'}
            {mode === 'resetSent' && 'Verify & Set Password'}
          </h2>
          <p className={styles.subtitle}>
            {mode === 'signIn' && 'Access live 5-stage air tracking & saved Qatar addresses'}
            {mode === 'signUp' && 'Join Qatar’s verified express dropship marketplace'}
            {mode === 'forgotPassword' && 'Enter your registered email and we’ll send a password reset link.'}
            {mode === 'resetSent' && `We sent a reset link & verification code to ${email}`}
          </p>
        </div>

        {/* Perks Strip (Only for Sign In / Sign Up) */}
        {(mode === 'signIn' || mode === 'signUp') && (
          <div className={styles.perksStrip}>
            <div className={styles.perk}>
              <Plane size={13} />
              <span>Air Express Tracking</span>
            </div>
            <div className={styles.perk}>
              <Sparkles size={13} />
              <span>VIP Discounts</span>
            </div>
            <div className={styles.perk}>
              <ShieldCheck size={13} />
              <span>100% Authentic</span>
            </div>
          </div>
        )}

        {/* Tab Switcher (Only for Sign In / Sign Up) */}
        {(mode === 'signIn' || mode === 'signUp') && (
          <div className={styles.tabNav}>
            <button
              type="button"
              className={`${styles.tabBtn} ${mode === 'signIn' ? styles.active : ''}`}
              onClick={() => {
                setMode('signIn');
                setErrorMessage('');
                setSuccessMessage('');
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${mode === 'signUp' ? styles.active : ''}`}
              onClick={() => {
                setMode('signUp');
                setErrorMessage('');
                setSuccessMessage('');
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Form */}
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          method="post"
          autoComplete="on"
        >
          {errorMessage && (
            <div className={styles.alertError}>
              <AlertCircle size={16} />
              <div>
                <span>{errorMessage}</span>
                {errorMessage.includes('ইতিমধ্যে একটি অ্যাকাউন্ট খোলা আছে') && (
                  <div>
                    <button
                      type="button"
                      className={styles.alertActionBtn}
                      onClick={() => {
                        setMode('signIn');
                        setErrorMessage('');
                      }}
                    >
                      লগইন করুন (Sign In Now) →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {successMessage && (
            <div className={styles.successAlert}>
              <div className={styles.successRow}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span>লিংক পাঠানো হয়েছে!</span>
              </div>
              <div>{successMessage}</div>
            </div>
          )}

          {/* SIGN UP FULL NAME */}
          {mode === 'signUp' && (
            <div className={styles.fieldGroup}>
              <label htmlFor="auth-modal-name" className={styles.label}>
                Full Name *
              </label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.fieldIcon} />
                <input
                  id="auth-modal-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Tariq Al-Mansoor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.textInput}
                />
              </div>
            </div>
          )}

          {/* EMAIL ADDRESS (All modes except resetSent) */}
          {mode !== 'resetSent' && (
            <div className={styles.fieldGroup}>
              <label htmlFor="auth-modal-email" className={styles.label}>
                Email Address *
              </label>
              <div className={styles.inputWrapper}>
                <Mail size={16} className={styles.fieldIcon} />
                <input
                  id="auth-modal-email"
                  name="username"
                  type="email"
                  required
                  autoComplete="username webauthn"
                  inputMode="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.textInput}
                />
              </div>

              {/* One-Click Login Suggestion Chip for Return Visitors */}
              {mode === 'signIn' && rememberedEmail && rememberedEmail !== email && (
                <button
                  type="button"
                  className={styles.suggestionChip}
                  onClick={() => {
                    setEmail(rememberedEmail);
                    document.getElementById('auth-modal-password')?.focus();
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

          {/* SIGN UP PHONE (Supports Any Country Worldwide) */}
          {mode === 'signUp' && (
            <div className={styles.fieldGroup}>
              <label htmlFor="auth-modal-phone" className={styles.label}>
                Phone Number (Any Country / Optional)
              </label>
              <div className={styles.phoneInputGroup}>
                <select
                  className={styles.countryCodeSelect}
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  aria-label="Select country dial code"
                >
                  {COUNTRY_DIAL_CODES.map((item) => (
                    <option key={item.code + item.name} value={item.code}>
                      {item.flag} {item.code} ({item.name})
                    </option>
                  ))}
                </select>
                <div className={styles.phoneFieldWrapper}>
                  <input
                    id="auth-modal-phone"
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
          )}

          {/* PASSWORD (Sign In & Sign Up) */}
          {(mode === 'signIn' || mode === 'signUp') && (
            <div className={styles.fieldGroup}>
              <div className={styles.passwordLabelRow}>
                <label htmlFor="auth-modal-password" className={styles.label}>
                  Password *
                </label>
                {mode === 'signIn' ? (
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
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#8A1538', fontWeight: 600 }}>
                    Min 8 chars
                  </span>
                )}
              </div>
              <div className={styles.inputWrapper}>
                <Lock size={16} className={styles.fieldIcon} />
                <input
                  id="auth-modal-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.textInput}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* RESET SENT FIELDS (Verification Code + New Password) */}
          {mode === 'resetSent' && (
            <>
              <div className={styles.fieldGroup}>
                <label htmlFor="auth-modal-code" className={styles.label}>
                  Reset Verification Code *
                </label>
                <div className={styles.inputWrapper}>
                  <KeyRound size={16} className={styles.fieldIcon} />
                  <input
                    id="auth-modal-code"
                    type="text"
                    required
                    placeholder="ENTER CODE"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                    className={`${styles.textInput} ${styles.codeInput}`}
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                  Check your inbox for the 8-character verification code.
                </span>
              </div>

              <div className={styles.fieldGroup}>
                <div className={styles.passwordLabelRow}>
                  <label htmlFor="auth-modal-new-password" className={styles.label}>
                    New Password *
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#8A1538', fontWeight: 600 }}>
                    Min 8 chars
                  </span>
                </div>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.fieldIcon} />
                  <input
                    id="auth-modal-new-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    placeholder="Create a new strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.textInput}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <span>
                  {mode === 'signIn' && 'Sign In'}
                  {mode === 'signUp' && 'Create Free Account'}
                  {mode === 'forgotPassword' && 'Send Reset Link'}
                  {mode === 'resetSent' && 'Save New Password & Sign In'}
                </span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* BOTTOM NAVIGATION LINKS */}
          <div className={styles.switchMode}>
            {mode === 'signIn' && (
              <>
                Don&apos;t have an account yet?
                <button
                  type="button"
                  onClick={() => {
                    setMode('signUp');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                >
                  Sign Up
                </button>
              </>
            )}

            {mode === 'signUp' && (
              <>
                Already have an account?
                <button
                  type="button"
                  onClick={() => {
                    setMode('signIn');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                >
                  Sign In
                </button>
              </>
            )}

            {(mode === 'forgotPassword' || mode === 'resetSent') && (
              <button
                type="button"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                onClick={() => {
                  setMode('signIn');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
              >
                <ArrowLeft size={13} />
                <span>Back to Sign In</span>
              </button>
            )}
          </div>

          <div className={styles.guestNote}>
            🔒 Protected by Qatar Express SSL Encryption & Convex Security.
          </div>
        </form>
      </div>
    </div>
  );
};
