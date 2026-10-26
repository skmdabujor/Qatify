'use client';

// =============================================================================
// Qatify — Sticky Floating WhatsApp Support Button
// Direct 1-tap customer chat launcher
// =============================================================================

import React from 'react';
import styles from './WhatsAppButton.module.scss';

interface WhatsAppButtonProps {
  /** Phone number (e.g., '01875707255', '8801875707255', or '+8801875707255') */
  phoneNumber?: string;
  /** Optional pre-filled inquiry text */
  defaultMessage?: string;
  /** Tooltip label on desktop hover */
  tooltipText?: string;
}

/**
 * Normalizes phone numbers for wa.me URL
 * Converts Bangladesh 11-digit numbers (018...) to international 88018...
 */
function normalizeWhatsAppNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.startsWith('01') && digitsOnly.length === 11) {
    return `88${digitsOnly}`;
  }
  return digitsOnly;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  defaultMessage = 'Hello! I am browsing Qatify and have an inquiry.',
  tooltipText = 'Chat with us on WhatsApp',
}) => {
  const activeNumber =
    phoneNumber ||
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    '01875707255';
  const normalizedNumber = normalizeWhatsAppNumber(activeNumber);

  if (!normalizedNumber) {
    return null;
  }

  const safeMessage = encodeURIComponent(defaultMessage.trim());
  const whatsappUrl = `https://wa.me/${normalizedNumber}${safeMessage ? `?text=${safeMessage}` : ''}`;

  return (
    <div className={styles.whatsappWrapper}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsappBtn}
        aria-label="Chat on WhatsApp"
      >
        {/* Glowing pulse ring */}
        <span className={styles.pulseRing} aria-hidden="true" />

        {/* Live online green indicator dot */}
        <span className={styles.onlineIndicator} title="Online Support" />

        {/* Official WhatsApp Vector Logo */}
        <svg
          className={styles.iconSvg}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.59L5.07 16.29C4.24 14.97 3.8 13.46 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.32 4.53 17.88 6.09C19.44 7.65 20.3 9.72 20.3 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.39C16.32 14.26 15.1 13.66 14.87 13.58C14.65 13.5 14.48 13.46 14.32 13.71C14.15 13.96 13.68 14.51 13.53 14.68C13.39 14.85 13.24 14.87 12.99 14.74C12.74 14.62 11.94 14.35 10.99 13.5C10.25 12.84 9.75 12.03 9.61 11.78C9.46 11.53 9.6 11.4 9.72 11.27C9.83 11.16 9.97 10.99 10.1 10.84C10.22 10.69 10.27 10.58 10.35 10.42C10.43 10.25 10.39 10.1 10.33 9.98C10.27 9.85 9.77 8.63 9.57 8.13C9.37 7.64 9.17 7.71 9.02 7.7C8.88 7.69 8.71 7.69 8.54 7.69C8.38 7.69 8.11 7.75 7.88 8C7.65 8.25 7 8.86 7 10.09C7 11.32 7.9 12.51 8.02 12.68C8.15 12.84 9.79 15.37 12.3 16.45C12.9 16.71 13.36 16.86 13.73 16.98C14.33 17.17 14.88 17.14 15.31 17.08C15.8 17 16.82 16.46 17.03 15.85C17.24 15.24 17.24 14.73 17.18 14.62C17.11 14.52 16.95 14.46 16.57 14.39Z" />
        </svg>

        {/* Floating tooltip on desktop hover */}
        <span className={styles.tooltip}>{tooltipText}</span>
      </a>
    </div>
  );
};

