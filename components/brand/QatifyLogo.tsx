'use client';

// =============================================================================
// Qatify — Brand Logo Component (Scalable SVG + Wordmark + Qatar Pill)
// Monogram: Geometric forward-leaning "Q" squircle in Red with Electric Yellow lightning spark tail
// =============================================================================

import React from 'react';
import Link from 'next/link';

interface QatifyLogoProps {
  variant?: 'light' | 'dark'; // 'light' for dark backgrounds, 'dark' for white/light backgrounds
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  iconOnly?: boolean;
  href?: string;
}

export const QatifyLogo: React.FC<QatifyLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = false,
  iconOnly = false,
  href = '/',
}) => {
  // Dimensions map
  const dimensions = {
    sm: { iconSize: 28, fontSize: 18, pillSize: 10 },
    md: { iconSize: 34, fontSize: 22, pillSize: 11 },
    lg: { iconSize: 44, fontSize: 28, pillSize: 13 },
  }[size];

  const textColor = variant === 'light' ? '#FFFFFF' : '#0A0A0C';
  const subtextColor = variant === 'light' ? '#A1A1AA' : '#71717A';

  const logoContent = (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'sm' ? '8px' : '10px',
        userSelect: 'none',
        textDecoration: 'none',
      }}
    >
      {/* Icon Badge: Forward-leaning Q Monogram with Electric Lightning Tail */}
      <svg
        width={dimensions.iconSize}
        height={dimensions.iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 6px rgba(225, 29, 72, 0.35))' }}
      >
        {/* Rounded Squircle Background in Qatify Red with subtle gradient */}
        <defs>
          <linearGradient id="qatifyRedGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F43F5E" />
            <stop offset="1" stopColor="#BE123C" />
          </linearGradient>
          <linearGradient id="sparkYellowGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="1" stopColor="#EAB308" />
          </linearGradient>
        </defs>

        {/* Squircle Badge */}
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          rx="24"
          fill="url(#qatifyRedGrad)"
        />

        {/* Geometric "Q" Body Outer Ring */}
        <circle
          cx="48"
          cy="46"
          r="26"
          stroke="#FFFFFF"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Dynamic Forward-Leaning Lightning Bolt / Spark as the "Q" Tail in Electric Yellow */}
        <path
          d="M 52 50 L 66 32 L 60 52 L 78 50 L 46 80 L 52 58 Z"
          fill="url(#sparkYellowGrad)"
          stroke="#0A0A0C"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Forward Speed Lines in Yellow */}
        <circle cx="28" cy="28" r="3.5" fill="#FACC15" />
      </svg>

      {/* Wordmark and Qatar Pill Badge */}
      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 900,
                fontSize: `${dimensions.fontSize}px`,
                letterSpacing: '-0.035em',
                color: textColor,
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'baseline',
              }}
            >
              QAT
              <span style={{ position: 'relative', display: 'inline-block' }}>
                I
                {/* Yellow dot on the 'i' */}
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: '4px',
                    backgroundColor: '#FACC15',
                    borderRadius: '50%',
                  }}
                />
              </span>
              FY
            </span>

            {/* .qa Pill Badge */}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                fontSize: `${dimensions.pillSize}px`,
                backgroundColor: '#FACC15',
                color: '#0A0A0C',
                padding: '2px 5px',
                borderRadius: '4px',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              .QA
            </span>
          </div>

          {showTagline && (
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: 600,
                color: subtextColor,
                letterSpacing: '0.04em',
                marginTop: '3px',
                textTransform: 'uppercase',
              }}
            >
              Direct Air Dropship
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Qatify Home">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default QatifyLogo;

