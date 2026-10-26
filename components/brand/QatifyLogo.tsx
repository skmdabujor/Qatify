'use client';

// =============================================================================
// Qatify — Brand Logo Component (Scalable SVG + Wordmark)
// Monogram: Geometric forward-leaning "Q" squircle in Red with Electric Yellow lightning spark tail
// =============================================================================

import React from 'react';
import Link from 'next/link';

interface QatifyLogoProps {
  variant?: 'light' | 'dark'; // 'light' for dark backgrounds, 'dark' for white/light backgrounds
  size?: 'sm' | 'md' | 'lg';
  showShop?: boolean; // Displays creative "SHOP" badge above Qatify for ShopQatify.com branding
  shopBadgeStyle?: 'box' | 'pill' | 'outline' | 'eyebrow'; // Creative style options (default: 'box' with sharp corners)
  showTagline?: boolean;
  iconOnly?: boolean;
  href?: string;
  className?: string;
}

export const QatifyLogo: React.FC<QatifyLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showShop = true,
  shopBadgeStyle = 'box',
  showTagline = false,
  iconOnly = false,
  href = '/',
  className,
}) => {
  // Dimensions map
  const dimensions = {
    sm: {
      iconSize: 28,
      fontSize: 17,
      gap: 6,
      shopFontSize: 7,
      shopIconSize: 7.5,
      shopPadding: '1.5px 5.5px',
      shopGap: 3,
      shopMarginBottom: 2,
    },
    md: {
      iconSize: 34,
      fontSize: 21,
      gap: 7,
      shopFontSize: 8,
      shopIconSize: 8.5,
      shopPadding: '1.5px 6.5px',
      shopGap: 3.5,
      shopMarginBottom: 2,
    },
    lg: {
      iconSize: 44,
      fontSize: 27,
      gap: 9,
      shopFontSize: 10,
      shopIconSize: 10.5,
      shopPadding: '2.5px 8.5px',
      shopGap: 4,
      shopMarginBottom: 3,
    },
  }[size];

  const textColor = variant === 'light' ? '#FFFFFF' : '#0A0A0C';
  const subtextColor = variant === 'light' ? '#A1A1AA' : '#71717A';

  // Creative "SHOP" eyebrow/badge styling based on selected badge style and light/dark variant
  const getShopBadgeStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: `${dimensions.shopGap}px`,
      alignSelf: 'flex-start',
      marginBottom: `${dimensions.shopMarginBottom}px`,
      lineHeight: 1,
      userSelect: 'none',
      transition: 'all 0.2s ease',
    };

    if (shopBadgeStyle === 'box' || shopBadgeStyle === 'pill') {
      const isBox = shopBadgeStyle === 'box';
      return {
        ...base,
        padding: dimensions.shopPadding,
        borderRadius: isBox ? '0px' : '9999px', // Sharp corners for 'box'
        background:
          variant === 'light'
            ? 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)'
            : 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
        color: '#FFFFFF',
        boxShadow:
          variant === 'light'
            ? '0 2px 7px rgba(244, 63, 94, 0.4)'
            : '0 2px 5px rgba(225, 29, 72, 0.28)',
        borderTop: '1px solid rgba(255, 255, 255, 0.28)',
        border: variant === 'light' ? '1px solid rgba(255, 255, 255, 0.2)' : undefined,
      };
    }

    if (shopBadgeStyle === 'outline') {
      return {
        ...base,
        padding: dimensions.shopPadding,
        borderRadius: '0px',
        background:
          variant === 'light'
            ? 'rgba(244, 63, 94, 0.2)'
            : 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
        color: variant === 'light' ? '#FDA4AF' : '#E11D48',
        border:
          variant === 'light'
            ? '1px solid rgba(244, 63, 94, 0.5)'
            : '1px solid rgba(225, 29, 72, 0.3)',
      };
    }

    // 'eyebrow' minimal text style
    return {
      ...base,
      padding: '0 1px',
      color: variant === 'light' ? '#FB7185' : '#E11D48',
      letterSpacing: '0.22em',
    };
  };

  const logoContent = (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${dimensions.gap}px`,
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

      {/* Wordmark */}
      {!iconOnly && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
          {/* Creative "SHOP" Eyebrow Badge (ShopQatify.com Branding) */}
          {showShop && (
            <div style={getShopBadgeStyles()}>
              {/* Mini Shopping Bag SVG Icon */}
              <svg
                width={dimensions.shopIconSize}
                height={dimensions.shopIconSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0 }}
                aria-hidden="true"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>

              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                  fontWeight: 900,
                  fontSize: `${dimensions.shopFontSize}px`,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  display: 'inline-block',
                }}
              >
                SHOP
              </span>
            </div>
          )}

          {/* Primary Brand Text: QATIFY */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
                lineHeight: 1,
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
              Qatar's Tech Store
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="ShopQatify Home">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default QatifyLogo;

