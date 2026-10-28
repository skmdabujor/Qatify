'use client';

// =============================================================================
// Qatify — Customer Sign In & Sign Up Modal
// Powered by Convex Auth (@convex-dev/auth)
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
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

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signIn',
  onSuccess,
}) => {
  const { signIn } = useAuthActions();
  const { showToast } = useShop();

  const [mode, setMode] = useState<'signIn' | 'signUp'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Keep mode in sync with defaultMode when opened
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setErrorMessage('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (mode === 'signUp' && !name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signUp') {
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

        // Store email locally for smooth backward-compatibility
        if (typeof window !== 'undefined') {
          localStorage.setItem('qatify_user_email', cleanEmail);
        }

        showToast('Welcome to Qatify! 🇶🇦', `Account created successfully for ${name.trim() || cleanEmail}`, 'success');
      } else {
        await signIn('password', {
          flow: 'signIn',
          email: cleanEmail,
          password: password,
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('qatify_user_email', cleanEmail);
        }

        showToast('Signed In Successfully 🇶🇦', `Welcome back to Qatify`, 'success');
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Auth error:', err);
      const msg = err?.message || String(err);
      if (msg.includes('Account already exists') || msg.includes('user already exists')) {
        setErrorMessage('An account already exists with this email. Please sign in instead.');
      } else if (msg.includes('Invalid credentials') || msg.includes('incorrect') || msg.includes('password')) {
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
            {mode === 'signIn' ? 'Welcome Back' : 'Create Customer Account'}
          </h2>
          <p className={styles.subtitle}>
            {mode === 'signIn'
              ? 'Access live 5-stage air tracking & saved Qatar addresses'
              : 'Join Qatar’s verified express dropship marketplace'}
          </p>
        </div>

        {/* Perks Strip */}
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

        {/* Tab Switcher */}
        <div className={styles.tabNav}>
          <button
            type="button"
            className={`${styles.tabBtn} ${mode === 'signIn' ? styles.active : ''}`}
            onClick={() => {
              setMode('signIn');
              setErrorMessage('');
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
            }}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {errorMessage && (
            <div className={styles.alertError}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'signUp' && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Full Name *</label>
              <div className={styles.inputWrapper}>
                <User size={16} className={styles.fieldIcon} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Al-Mansoor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.textInput}
                />
              </div>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email Address *</label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.fieldIcon} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>

          {mode === 'signUp' && (
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Qatar Mobile (Optional)</label>
              <div className={styles.inputWrapper}>
                <Phone size={16} className={styles.fieldIcon} />
                <span className={styles.phonePrefix}>+974</span>
                <input
                  type="tel"
                  placeholder="5512 8894"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s]/g, ''))}
                  className={`${styles.textInput} ${styles.phoneInput}`}
                />
              </div>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className={styles.label}>Password *</label>
              {mode === 'signIn' && (
                <span style={{ fontSize: '0.75rem', color: '#8A1538', fontWeight: 600 }}>
                  Min 8 chars
                </span>
              )}
            </div>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.fieldIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
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

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <span>{mode === 'signIn' ? 'Sign In' : 'Create Free Account'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <div className={styles.switchMode}>
            {mode === 'signIn' ? (
              <>
                Don&apos;t have an account yet?
                <button
                  type="button"
                  onClick={() => {
                    setMode('signUp');
                    setErrorMessage('');
                  }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?
                <button
                  type="button"
                  onClick={() => {
                    setMode('signIn');
                    setErrorMessage('');
                  }}
                >
                  Sign In
                </button>
              </>
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
