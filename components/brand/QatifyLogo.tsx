'use client';

// =============================================================================
// Qatify — Brand Logo Component (Scalable SVG + Wordmark)
// Inspired by modern friendly e-commerce branding (Sokoni aesthetic in signature orange):
// - Vibrant Shopping Bag with "Q" monogram
// - Creative "SHOP" eyebrow badge (ShopQatify.com branding)
// - Bold, tightly-spaced "QATIFY" wordmark with signature orange dot
// - Optional tagline ribbon: "SHOP MORE, PAY LESS"
// =============================================================================

import React from 'react';
import Link from 'next/link';

export interface QatifyLogoProps {
  variant?: 'light' | 'dark' | 'orange'; // 'light' for dark bgs, 'dark' for white/light bgs, 'orange' for signature orange badge
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showShop?: boolean; // Displays creative "SHOP" badge above Qatify (default: true)
  shopBadgeStyle?: 'box' | 'pill' | 'outline' | 'eyebrow'; // Creative style options (default: 'box')
  showTagline?: boolean;
  taglineText?: string;
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
  taglineText = 'SHOP MORE, PAY LESS',
  iconOnly = false,
  href = '/',
  className,
}) => {
  // Dimensions map — tightly balanced spacing
  const dimensions = {
    sm: {
      bagWidth: 26,
      bagHeight: 29,
      fontSize: 17,
      gap: 5,
      dotSize: 3.5,
      dotTop: -3,
      taglineSize: 7,
      taglinePillPadding: '1px 6px',
      taglineDashWidth: 8,
      shopFontSize: 7,
      shopIconSize: 7.5,
      shopPadding: '1.5px 5.5px',
      shopGap: 3,
      shopMarginBottom: 2,
    },
    md: {
      bagWidth: 32,
      bagHeight: 35,
      fontSize: 21,
      gap: 6,
      dotSize: 4.2,
      dotTop: -3,
      taglineSize: 8,
      taglinePillPadding: '1.5px 8px',
      taglineDashWidth: 12,
      shopFontSize: 8,
      shopIconSize: 8.5,
      shopPadding: '1.5px 6.5px',
      shopGap: 3.5,
      shopMarginBottom: 2,
    },
    lg: {
      bagWidth: 42,
      bagHeight: 46,
      fontSize: 27,
      gap: 7.5,
      dotSize: 5,
      dotTop: -4,
      taglineSize: 9.5,
      taglinePillPadding: '2px 10px',
      taglineDashWidth: 16,
      shopFontSize: 10,
      shopIconSize: 10.5,
      shopPadding: '2.5px 8.5px',
      shopGap: 4,
      shopMarginBottom: 3,
    },
    xl: {
      bagWidth: 54,
      bagHeight: 59,
      fontSize: 36,
      gap: 9,
      dotSize: 6.5,
      dotTop: -5,
      taglineSize: 11,
      taglinePillPadding: '2.5px 12px',
      taglineDashWidth: 20,
      shopFontSize: 11,
      shopIconSize: 12,
      shopPadding: '3px 10px',
      shopGap: 5,
      shopMarginBottom: 4,
    },
  }[size];

  const brandOrange = '#E06C2A';
  const textColor = variant === 'light' ? '#FFFFFF' : '#0A0A0C';
  const subtextColor = variant === 'light' ? '#A1A1AA' : '#71717A';

  // Shopping Bag SVG with tight bounding box (zero phantom side padding)
  const isDarkVariant = variant === 'dark';
  const bagBg = isDarkVariant ? 'url(#qatifyBagGrad)' : '#FFFFFF';
  const handleColor = isDarkVariant ? brandOrange : '#FFFFFF';
  const rivetColor = isDarkVariant ? '#FFFFFF' : brandOrange;
  const qColor = isDarkVariant ? '#FFFFFF' : brandOrange;
  const qInner = isDarkVariant ? brandOrange : '#FFFFFF';

  const shoppingBagIcon = (
    <svg
      width={dimensions.bagWidth}
      height={dimensions.bagHeight}
      viewBox="21 16 78 103"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        flexShrink: 0,
        filter: isDarkVariant
          ? 'drop-shadow(0 2px 5px rgba(224, 108, 42, 0.32))'
          : 'drop-shadow(0 2px 5px rgba(0, 0, 0, 0.22))',
        display: 'block',
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="qatifyBagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E86E2A" />
          <stop offset="100%" stopColor="#D65D1E" />
        </linearGradient>
      </defs>

      {/* Arched Dual Handles */}
      <path
        d="M 45 42 C 45 18, 75 18, 75 42"
        stroke={handleColor}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bag Body */}
      <path
        d="M 32 44 C 32 38, 36 34, 42 34 L 78 34 C 84 34, 88 38, 88 44 L 97 106 C 98 112, 93 117, 87 117 L 33 117 C 27 117, 22 112, 23 106 Z"
        fill={bagBg}
      />

      {/* Rivets */}
      <circle cx="45" cy="46" r="3" fill={rivetColor} />
      <circle cx="75" cy="46" r="3" fill={rivetColor} />

      {/* 'Q' Monogram inside bag */}
      <g id="bag-letter-Q">
        <ellipse cx="60" cy="80" rx="16.5" ry="19.5" fill={qColor} />
        <ellipse cx="60" cy="79.5" rx="8.5" ry="11" fill={qInner} />
        <path
          d="M 61 85 C 67 90, 75 96, 83 102 C 79 104, 73 106, 68 101 Z"
          fill={qColor}
        />
        <path
          d="M 67 91 L 84 104 C 86 105, 85 107, 82 107 L 72 106 Z"
          fill={qColor}
        />
      </g>
    </svg>
  );

  if (iconOnly) {
    if (href) {
      return (
        <Link href={href} aria-label="Qatify Home" className={className} style={{ display: 'inline-flex' }}>
          {shoppingBagIcon}
        </Link>
      );
    }
    return <div className={className} style={{ display: 'inline-flex' }}>{shoppingBagIcon}</div>;
  }

  // Creative "SHOP" eyebrow/badge styling
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
        borderRadius: isBox ? '2px' : '9999px',
        background:
          variant === 'light'
            ? 'linear-gradient(135deg, #E86E2A 0%, #D65D1E 100%)'
            : 'linear-gradient(135deg, #E86E2A 0%, #D65D1E 100%)',
        color: '#FFFFFF',
        boxShadow:
          variant === 'light'
            ? '0 2px 7px rgba(224, 108, 42, 0.4)'
            : '0 2px 5px rgba(224, 108, 42, 0.28)',
        borderTop: '1px solid rgba(255, 255, 255, 0.28)',
        border: variant === 'light' ? '1px solid rgba(255, 255, 255, 0.2)' : undefined,
      };
    }

    if (shopBadgeStyle === 'outline') {
      return {
        ...base,
        padding: dimensions.shopPadding,
        borderRadius: '2px',
        background:
          variant === 'light'
            ? 'rgba(224, 108, 42, 0.2)'
            : 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
        color: variant === 'light' ? '#FDBA74' : '#E06C2A',
        border:
          variant === 'light'
            ? '1px solid rgba(224, 108, 42, 0.5)'
            : '1px solid rgba(224, 108, 42, 0.3)',
      };
    }

    // 'eyebrow' minimal text style
    return {
      ...base,
      padding: '0 1px',
      color: variant === 'light' ? '#FB923C' : '#E06C2A',
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
      {/* Brand Shopping Bag Icon with Q Monogram */}
      {shoppingBagIcon}

      {/* Wordmark Column (SHOP Eyebrow + QATIFY) */}
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
                fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
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
              fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
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
              {/* Vibrant Orange Dot on the 'I' */}
              <span
                style={{
                  position: 'absolute',
                  top: `${dimensions.dotTop}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: `${dimensions.dotSize}px`,
                  height: `${dimensions.dotSize}px`,
                  backgroundColor: brandOrange,
                  borderRadius: '50%',
                }}
              />
            </span>
            FY
          </span>
        </div>

        {/* Optional Tagline Pill: — SHOP MORE, PAY LESS — */}
        {showTagline && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px',
              alignSelf: 'flex-start',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: `${dimensions.taglineDashWidth}px`,
                height: '1.5px',
                backgroundColor: variant === 'light' ? '#FFFFFF' : brandOrange,
                borderRadius: '1px',
              }}
            />
            <span
              style={{
                display: 'inline-block',
                padding: dimensions.taglinePillPadding,
                backgroundColor: variant === 'light' ? '#FFFFFF' : brandOrange,
                color: variant === 'light' ? brandOrange : '#FFFFFF',
                borderRadius: '9999px',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: `${dimensions.taglineSize}px`,
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                lineHeight: 1.2,
              }}
            >
              {taglineText}
            </span>
            <span
              style={{
                display: 'inline-block',
                width: `${dimensions.taglineDashWidth}px`,
                height: '1.5px',
                backgroundColor: variant === 'light' ? '#FFFFFF' : brandOrange,
                borderRadius: '1px',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="ShopQatify Home" style={{ textDecoration: 'none' }}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default QatifyLogo;
