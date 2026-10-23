'use client';

// =============================================================================
// Qatify — Floating Toast Feedback Notifications
// =============================================================================

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.scss';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer} role="region" aria-live="polite">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'error' || toast.type === 'warning'
            ? AlertCircle
            : Info;

        return (
          <div
            key={toast.id}
            className={`${styles.toastItem} ${styles[toast.type]}`}
          >
            <div className={styles.iconWrap}>
              <Icon size={18} />
            </div>
            <div className={styles.contentWrap}>
              <p className={styles.title}>{toast.title}</p>
              {toast.description && (
                <p className={styles.desc}>{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={styles.closeBtn}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

