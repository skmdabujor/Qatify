'use client';

// =============================================================================
// Qatify — Dedicated Auth Page Component (Sign In / Register / Reset)
// Exact reproduction of the user-provided layout & design system
// Fully integrated with Convex Auth (@convex-dev/auth)
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvex, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Eye,
  EyeOff,
  Package,
  Heart,
  Bell,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { COUNTRY_DIAL_CODES } from '@/components/auth/AuthModal';
import styles from './AuthPage.module.scss';

export const NATIONALITIES = [
  'Qatari',
  'Bangladeshi',
  'Indian',
  'Pakistani',
  'Filipino',
  'Egyptian',
  'Nepalese',
  'Sri Lankan',
  'Jordanian',
  'Lebanese',
  'Syrian',
  'Sudanese',
  'Yemeni',
  'British',
  'American',
  'Canadian',
  'Australian',
  'Other',
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Prefer not to say' },
];

interface AuthPageProps {
  defaultMode?: 'signIn' | 'signUp' | 'forgotPassword';
}

export function AuthPage({ defaultMode = 'signIn' }: AuthPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || searchParams.get('returnTo') || '/dashboard';

  const convex = useConvex();
  const { signIn } = useAuthActions();
  const { showToast } = useShop();
  const viewer = useQuery(api.users.viewer);

  // Auth View Modes: 'signIn' | 'signUp' | 'forgotPassword' | 'resetSent'
  const [mode, setMode] = useState<'signIn' | 'signUp' | 'forgotPassword' | 'resetSent'>(defaultMode);

  // Sign In & Reset Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Sign Up Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('');
  const [countryCode, setCountryCode] = useState('+974');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(true);

  // Password Reset Specific
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(true);

  // Custom Dropdowns States & Refs
  const [isDialDropdownOpen, setIsDialDropdownOpen] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isNationalityOpen, setIsNationalityOpen] = useState(false);
  const dialDropdownRef = useRef<HTMLDivElement>(null);
  const genderDropdownRef = useRef<HTMLDivElement>(null);
  const nationalityDropdownRef = useRef<HTMLDivElement>(null);

  // Close custom dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dialDropdownRef.current && !dialDropdownRef.current.contains(target)) {
        setIsDialDropdownOpen(false);
      }
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(target)) {
        setIsGenderOpen(false);
      }
      if (nationalityDropdownRef.current && !nationalityDropdownRef.current.contains(target)) {
        setIsNationalityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keep readOnly briefly on mount to prevent browser password managers from auto-filling saved credentials
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReadOnly(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Keep internal state aligned with defaultMode prop
  useEffect(() => {
    setMode(defaultMode);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setErrorMessage('');
    setSuccessMessage('');
  }, [defaultMode]);

  // If already authenticated and not loading, redirect to dashboard or intended destination
  useEffect(() => {
    if (viewer) {
      router.push(redirectUrl);
    }
  }, [viewer, redirectUrl, router]);

  // Switch between Sign In and Register
  const handleSwitchMode = (targetMode: 'signIn' | 'signUp' | 'forgotPassword') => {
    setMode(targetMode);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setGender('');
    setDob('');
    setNationality('');
    setResetCode('');
    setNewPassword('');
    setIsDialDropdownOpen(false);
    setIsGenderOpen(false);
    setIsNationalityOpen(false);
    setErrorMessage('');
    setSuccessMessage('');
    if (targetMode === 'signIn') {
      window.history.replaceState(null, '', '/login');
    } else if (targetMode === 'signUp') {
      window.history.replaceState(null, '', '/register');
    }
  };

  // Save credentials to browser Credential Management API (Chrome, Safari, Edge, Android)
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
        // Silently continue
      }
    }
  };

  // Handle Form Submission
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
    // Flow 1: FORGOT PASSWORD / REACTIVATION
    // -------------------------------------------------------------------------
    if (mode === 'forgotPassword') {
      setLoading(true);
      try {
        const exists = await convex.query(api.users.checkEmailExists, { email: cleanEmail });
        if (!exists) {
          setErrorMessage('No account found with this email. Please check your email or register a new account.');
          setLoading(false);
          return;
        }

        await signIn('password', {
          flow: 'reset',
          email: cleanEmail,
        });

        setSuccessMessage(`A verification code has been dispatched to ${cleanEmail}. Please check your inbox.`);
        setMode('resetSent');
      } catch (err: any) {
        console.error('Password reset request error:', err);
        const msg = err?.message || String(err);
        if (msg.includes('Cannot find') || msg.includes('InvalidAccountId')) {
          setErrorMessage('No account found with this email address.');
        } else {
          setErrorMessage('Unable to dispatch reset verification code. Please try again in a few moments.');
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // -------------------------------------------------------------------------
    // Flow 2: RESET VERIFICATION (Code + New Password)
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
          if (rememberMe) {
            localStorage.setItem('qatify_remembered_email', cleanEmail);
          }
        }

        await saveBrowserCredentials(cleanEmail, newPassword);

        showToast('Password Updated! 🇶🇦', 'Your password has been reset successfully.', 'success');
        router.push(redirectUrl);
      } catch (err: any) {
        console.error('Password reset verification error:', err);
        const msg = err?.message || String(err);
        if (msg.includes('Invalid code') || msg.includes('incorrect') || msg.includes('code')) {
          setErrorMessage('The verification code is incorrect or expired. Please check your email.');
        } else {
          setErrorMessage('Password update failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    // -------------------------------------------------------------------------
    // Flow 3: REGISTER (SIGN UP)
    // -------------------------------------------------------------------------
    if (mode === 'signUp') {
      if (!firstName.trim()) {
        setErrorMessage('Please enter your first name.');
        return;
      }

      if (!password || password.length < 8) {
        setErrorMessage('Password must be at least 8 characters long.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please ensure both passwords match.');
        return;
      }

      setLoading(true);

      try {
        // Pre-check for duplicate account in Convex backend
        const emailAlreadyExists = await convex.query(api.users.checkEmailExists, { email: cleanEmail });
        if (emailAlreadyExists) {
          setErrorMessage('An account with this email already exists. Please sign in instead.');
          setLoading(false);
          return;
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
        const params: Record<string, string | boolean> = {
          flow: 'signUp',
          email: cleanEmail,
          password: password,
          name: fullName,
          marketingConsent: Boolean(marketingConsent),
        };

        if (gender.trim()) {
          params.gender = gender.trim();
        }
        if (dob.trim()) {
          params.dob = dob.trim();
        }
        if (nationality.trim()) {
          params.nationality = nationality.trim();
        }

        if (phone.trim()) {
          const rawPhone = phone.trim();
          if (rawPhone.startsWith('+')) {
            params.phone = rawPhone;
          } else {
            params.phone = `${countryCode} ${rawPhone}`;
          }
        }

        await signIn('password', params);

        if (marketingConsent) {
          try {
            await convex.mutation(api.newsletter.subscribe, {
              email: cleanEmail,
              source: 'registration',
            });
          } catch {
            // Non-blocking newsletter sync
          }
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('qatify_user_email', cleanEmail);
          if (rememberMe) {
            localStorage.setItem('qatify_remembered_email', cleanEmail);
          }
        }

        await saveBrowserCredentials(cleanEmail, password, fullName);

        showToast('Welcome to Qatify! 🇶🇦', `Account created successfully for ${fullName || cleanEmail}`, 'success');
        router.push(redirectUrl);
      } catch (err: any) {
        console.error('Sign up error:', err);
        const msg = err?.message || String(err);
        if (
          msg.includes('already exists') ||
          msg.includes('user already exists') ||
          (msg.includes('Account') && msg.includes('exists'))
        ) {
          setErrorMessage('An account with this email already exists. Please sign in instead.');
        } else {
          setErrorMessage('Failed to create account. Please check your information and try again.');
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
        if (rememberMe) {
          localStorage.setItem('qatify_remembered_email', cleanEmail);
        } else {
          localStorage.removeItem('qatify_remembered_email');
        }
      }

      await saveBrowserCredentials(cleanEmail, password);

      showToast('Signed In Successfully 🇶🇦', 'Welcome back to Qatify', 'success');
      router.push(redirectUrl);
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
    <div className={styles.authPageWrapper}>
      <div className={styles.authContainer}>
        {/* Breadcrumb Row */}
        <nav className={styles.breadcrumbRow} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>
            {mode === 'signUp'
              ? 'Register'
              : mode === 'forgotPassword' || mode === 'resetSent'
              ? 'Reset Password'
              : 'Sign in'}
          </span>
        </nav>

        {/* 2-Column Authentication Layout */}
        <div className={styles.authGrid}>
          {/* ===================================================================
              LEFT COLUMN: MAIN FORM
              =================================================================== */}
          <div className={styles.formColumn}>
            {/* Feedback Alerts */}
            {errorMessage && (
              <div className={styles.errorAlert} role="alert">
                <AlertCircle size={17} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className={styles.successAlert} role="status">
                <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ---------------------------------------------------------------
                VIEW A: SIGN IN FORM
                --------------------------------------------------------------- */}
            {mode === 'signIn' && (
              <>
                <h1 className={styles.mainHeading}>Already a member? Sign in!</h1>
                <p className={styles.subHeading}>
                  Get access to your orders, wishlist and recommendations to products you are interested in!
                </p>

                <form onSubmit={handleSubmit} className={styles.formBody} noValidate autoComplete="off">
                  {/* Email address */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="signin-email" className={styles.fieldLabel}>
                      Email address
                    </label>
                    <input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email ID"
                      required
                      readOnly={isReadOnly}
                      onFocus={() => setIsReadOnly(false)}
                      autoComplete="off"
                      className={styles.textInput}
                    />
                  </div>

                  {/* Password */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="signin-password" className={styles.fieldLabel}>
                      Password
                    </label>
                    <div className={styles.passwordInputWrapper}>
                      <input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        readOnly={isReadOnly}
                        onFocus={() => setIsReadOnly(false)}
                        autoComplete="new-password"
                        className={`${styles.textInput} ${styles.passwordInput}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.eyeToggleBtn}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className={styles.forgotPasswordRow}>
                      <button
                        type="button"
                        onClick={() => handleSwitchMode('forgotPassword')}
                        className={styles.forgotPasswordBtn}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  {/* Remember me */}
                  <label className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxLabel}>Remember me</span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.primaryActionBtn}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className={styles.spinner} />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign in</span>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ---------------------------------------------------------------
                VIEW B: REGISTER (SIGN UP) FORM
                --------------------------------------------------------------- */}
            {mode === 'signUp' && (
              <>
                <h1 className={styles.mainHeading}>New to Qatify? Register!</h1>
                <p className={styles.orEmailDivider}>Or sign up using email</p>

                <form onSubmit={handleSubmit} className={styles.formBody} noValidate>
                  {/* Your name (2 Columns: First Name & Last Name) */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Your name</label>
                    <div className={styles.twoColRow} style={{ marginBottom: 0 }}>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        required
                        className={styles.textInput}
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        className={styles.textInput}
                      />
                    </div>
                  </div>

                  {/* Gender & Date of Birth */}
                  <div className={styles.twoColRow}>
                    <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                      <label className={styles.fieldLabel}>
                        Gender <span className={styles.optionalTag}>(Optional)</span>
                      </label>
                      <div className={styles.customSelectWrapper} ref={genderDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsGenderOpen(!isGenderOpen)}
                          className={`${styles.customSelectBtn} ${isGenderOpen ? styles.open : ''}`}
                          aria-label="Select your gender"
                          aria-expanded={isGenderOpen}
                        >
                          <span className={gender ? styles.selectValueText : styles.selectPlaceholderText}>
                            {GENDER_OPTIONS.find((g) => g.value === gender)?.label || 'Select your gender'}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`${styles.dialChevron} ${isGenderOpen ? styles.rotate : ''}`}
                          />
                        </button>

                        {isGenderOpen && (
                          <div className={styles.customSelectMenu}>
                            {GENDER_OPTIONS.map((g) => {
                              const isSelected = g.value === gender;
                              return (
                                <div
                                  key={g.value}
                                  onClick={() => {
                                    setGender(g.value);
                                    setIsGenderOpen(false);
                                  }}
                                  className={`${styles.customSelectItem} ${isSelected ? styles.selected : ''}`}
                                >
                                  {g.label}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
                      <label htmlFor="signup-dob" className={styles.fieldLabel}>
                        Date of birth <span className={styles.optionalTag}>(Optional)</span>
                      </label>
                      <input
                        id="signup-dob"
                        type="text"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        placeholder="DD/MM/YYYY"
                        className={styles.textInput}
                      />
                    </div>
                  </div>

                  {/* Nationality */}
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>
                      Nationality <span className={styles.optionalTag}>(Optional)</span>
                    </label>
                    <div className={styles.customSelectWrapper} ref={nationalityDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsNationalityOpen(!isNationalityOpen)}
                        className={`${styles.customSelectBtn} ${isNationalityOpen ? styles.open : ''}`}
                        aria-label="Select your nationality"
                        aria-expanded={isNationalityOpen}
                      >
                        <span className={nationality ? styles.selectValueText : styles.selectPlaceholderText}>
                          {nationality || 'Select your nationality'}
                        </span>
                        <ChevronDown
                          size={14}
                          className={`${styles.dialChevron} ${isNationalityOpen ? styles.rotate : ''}`}
                        />
                      </button>

                      {isNationalityOpen && (
                        <div className={styles.customSelectMenu}>
                          {NATIONALITIES.map((nat) => {
                            const isSelected = nat === nationality;
                            return (
                              <div
                                key={nat}
                                onClick={() => {
                                  setNationality(nat);
                                  setIsNationalityOpen(false);
                                }}
                                className={`${styles.customSelectItem} ${isSelected ? styles.selected : ''}`}
                              >
                                {nat}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="signup-phone" className={styles.fieldLabel}>
                      Mobile number
                    </label>
                    <div className={styles.phoneGroup}>
                      <div className={styles.customDialWrapper} ref={dialDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsDialDropdownOpen(!isDialDropdownOpen)}
                          className={`${styles.customDialBtn} ${isDialDropdownOpen ? styles.open : ''}`}
                          aria-label="Select Country Dial Code"
                          aria-expanded={isDialDropdownOpen}
                        >
                          <span>{countryCode}</span>
                          <ChevronDown
                            size={14}
                            className={`${styles.dialChevron} ${isDialDropdownOpen ? styles.rotate : ''}`}
                          />
                        </button>

                        {isDialDropdownOpen && (
                          <div className={styles.customDialMenu}>
                            {COUNTRY_DIAL_CODES.map((item) => {
                              const isSelected = item.code === countryCode;
                              return (
                                <div
                                  key={item.code + item.name}
                                  onClick={() => {
                                    setCountryCode(item.code);
                                    setIsDialDropdownOpen(false);
                                  }}
                                  className={`${styles.customDialItem} ${isSelected ? styles.selected : ''}`}
                                >
                                  <span className={styles.itemCode}>{item.code}</span>
                                  <span className={styles.itemName}>{item.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <input
                        id="signup-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="XXXXXXXX"
                        autoComplete="off"
                        className={`${styles.textInput} ${styles.phoneInput}`}
                      />
                    </div>
                  </div>

                  {/* Email address */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="signup-email" className={styles.fieldLabel}>
                      Email address
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email ID"
                      required
                      readOnly={isReadOnly}
                      onFocus={() => setIsReadOnly(false)}
                      autoComplete="off"
                      className={styles.textInput}
                    />
                  </div>

                  {/* New password */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="signup-password" className={styles.fieldLabel}>
                      New password
                    </label>
                    <div className={styles.passwordInputWrapper}>
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        readOnly={isReadOnly}
                        onFocus={() => setIsReadOnly(false)}
                        autoComplete="new-password"
                        className={`${styles.textInput} ${styles.passwordInput}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.eyeToggleBtn}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm new password */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor="signup-confirm-password" className={styles.fieldLabel}>
                      Confirm new password
                    </label>
                    <div className={styles.passwordInputWrapper}>
                      <input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Password"
                        required
                        readOnly={isReadOnly}
                        onFocus={() => setIsReadOnly(false)}
                        autoComplete="new-password"
                        className={`${styles.textInput} ${styles.passwordInput}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={styles.eyeToggleBtn}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Agreement Checkbox */}
                  <label className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxLabel}>
                      By creating an account you agree to receive messages and offers from qatify.com on this mobile
                      number or email address.
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.primaryActionBtn}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className={styles.spinner} />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Register</span>
                    )}
                  </button>

                  {/* Disclaimer note */}
                  <p className={styles.legalNote}>
                    By clicking the &ldquo;Register&rdquo; button, you confirm that you accept our{' '}
                    <Link href="/terms" target="_blank">
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" target="_blank">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              </>
            )}

            {/* ---------------------------------------------------------------
                VIEW C: FORGOT PASSWORD REQUEST
                --------------------------------------------------------------- */}
            {mode === 'forgotPassword' && (
              <>
                <h1 className={styles.mainHeading}>Want to reactivate your account?</h1>
                <p className={styles.subHeading}>
                  Enter your registered email address and we will dispatch a password reset code to help you securely recover your account.
                </p>

                <form onSubmit={handleSubmit} className={styles.formBody} noValidate>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="reset-email" className={styles.fieldLabel}>
                      Email address
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email ID"
                      required
                      className={styles.textInput}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.primaryActionBtn}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className={styles.spinner} />
                        <span>Dispatching code...</span>
                      </>
                    ) : (
                      <span>Send Verification Code</span>
                    )}
                  </button>

                  <div className={styles.backBtnRow}>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('signIn')}
                      className={styles.backBtn}
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Sign in</span>
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ---------------------------------------------------------------
                VIEW D: VERIFY CODE & SET NEW PASSWORD
                --------------------------------------------------------------- */}
            {mode === 'resetSent' && (
              <>
                <h1 className={styles.mainHeading}>Enter Verification Code</h1>
                <p className={styles.subHeading}>
                  We have sent a verification code to <strong>{email}</strong>. Enter it below along with your new password.
                </p>

                <form onSubmit={handleSubmit} className={styles.formBody} noValidate>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="reset-code" className={styles.fieldLabel}>
                      Verification Code
                    </label>
                    <input
                      id="reset-code"
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="6-digit code"
                      required
                      className={styles.textInput}
                      style={{ letterSpacing: '2px', fontWeight: 700 }}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="reset-new-password" className={styles.fieldLabel}>
                      New password
                    </label>
                    <div className={styles.passwordInputWrapper}>
                      <input
                        id="reset-new-password"
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className={`${styles.textInput} ${styles.passwordInput}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.eyeToggleBtn}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.primaryActionBtn}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className={styles.spinner} />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <span>Update Password & Sign In</span>
                    )}
                  </button>

                  <div className={styles.backBtnRow}>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('signIn')}
                      className={styles.backBtn}
                    >
                      <ArrowLeft size={14} />
                      <span>Back to Sign in</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* ===================================================================
              RIGHT COLUMN: BENEFIT SIDEBAR CARD
              =================================================================== */}
          <div className={styles.sidebarColumn}>
            <div className={styles.sidebarCard}>
              {/* Common Feature Bullet Points */}
              <div className={styles.benefitList}>
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIconBox}>
                    <Package size={14} />
                  </div>
                  <span className={styles.benefitText}>
                    Easily review products and track your orders.
                  </span>
                </div>

                <div className={styles.benefitItem}>
                  <div className={styles.benefitIconBox}>
                    <Heart size={14} />
                  </div>
                  <span className={styles.benefitText}>
                    Access to wishlist, save the items you like!
                  </span>
                </div>

                <div className={styles.benefitItem}>
                  <div className={styles.benefitIconBox}>
                    <Bell size={14} />
                  </div>
                  <span className={styles.benefitText}>
                    Get all these alerts on the go with our app experience!
                  </span>
                </div>
              </div>

              {/* Sidebar Action depending on Current View Mode */}
              {mode === 'signIn' || mode === 'forgotPassword' || mode === 'resetSent' ? (
                <>
                  <h3 className={styles.sidebarHeading} style={{ marginTop: 8 }}>
                    New to Qatify? Register!
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signUp')}
                    className={styles.sidebarSolidBtn}
                  >
                    Register
                  </button>

                  <div className={styles.sidebarDivider} />

                  <div className={styles.sidebarSubSection}>
                    <h4 className={styles.sidebarSubHeading}>Want to reactivate your account?</h4>
                    <p className={styles.sidebarSubDesc}>
                      Welcome back! You can reactivate your account by clicking below and following the coming steps
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('forgotPassword')}
                      className={styles.sidebarOutlineBtn}
                    >
                      Reactivate now
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.sidebarDivider} style={{ marginTop: 8 }} />
                  <div className={styles.sidebarSubSection}>
                    <h3 className={styles.sidebarHeading}>Already a member? Sign in!</h3>
                    <p className={styles.sidebarSubDesc}>
                      Get access to your orders, wishlist and recommendations to products you are interested in!
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('signIn')}
                      className={styles.sidebarOutlineBtn}
                    >
                      Sign in
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
