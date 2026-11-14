'use client';

// =============================================================================
// Qatify — Official Brand Logo Component
// Renders the official Canva brand identity:
// - Vibrant Shopping Bag with dynamic handle & signature orange body
// - Modern "Shop Qatify" typography with Qatar smile/swoop
// - Crisp high-DPI rendering for Retina & Ultra-HD displays
// - Smart Light / Dark theme variants
// =============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface QatifyLogoProps {
  variant?: 'light' | 'dark' | 'orange'; // 'light' for dark bgs, 'dark' for white/light bgs
  size?: 'sm' | 'md' | 'lg' | 'xl';
  height?: number; // Optional explicit height override in pixels
  showShop?: boolean; // Maintained for backward compatibility
  shopBadgeStyle?: 'box' | 'pill' | 'outline' | 'eyebrow'; // Backward compatibility
  showTagline?: boolean;
  taglineText?: string;
  iconOnly?: boolean;
  href?: string | null;
  className?: string;
  priority?: boolean;
}

export const QatifyLogo: React.FC<QatifyLogoProps> = ({
  variant = 'dark',
  size = 'md',
  height: customHeight,
  showTagline = false,
  taglineText = 'SHOP MORE, PAY LESS',
  iconOnly = false,
  href = '/',
  className,
  priority = true,
}) => {
  // Dimensions map based on 2200x1040 master ratio (2.1154 : 1)
  const sizeMap = {
    sm: {
      height: 38,
      width: 80,
      iconSize: 36,
      taglineSize: 7.5,
      taglinePadding: '1.5px 6px',
    },
    md: {
      height: 52,
      width: 110,
      iconSize: 46,
      taglineSize: 8,
      taglinePadding: '2px 8px',
    },
    lg: {
      height: 68,
      width: 144,
      iconSize: 60,
      taglineSize: 9.5,
      taglinePadding: '2.5px 10px',
    },
    xl: {
      height: 88,
      width: 186,
      iconSize: 76,
      taglineSize: 11,
      taglinePadding: '3px 12px',
    },
  }[size];

  const isLight = variant === 'light';

  // Choose asset based on variant and iconOnly
  const imageSrc = iconOnly
    ? '/brand/qatify-icon.png'
    : isLight
      ? '/brand/qatify-final-logo-light.png'
      : '/brand/qatify-final-logo.png';

  const imgHeight = customHeight || (iconOnly ? sizeMap.iconSize : sizeMap.height);
  const imgWidth = customHeight
    ? (iconOnly ? customHeight : Math.round(customHeight * 2.1154))
    : (iconOnly ? sizeMap.iconSize : sizeMap.width);

  const logoContent = (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        userSelect: 'none',
        textDecoration: 'none',
        lineHeight: 1,
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <Image
          src={imageSrc}
          alt="Shop Qatify"
          width={imgWidth * 2} // 2x density for ultra-crisp retina display
          height={imgHeight * 2}
          priority={priority}
          style={{
            width: 'auto',
            height: `${imgHeight}px`,
            maxWidth: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {showTagline && !iconOnly && (
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
              width: '10px',
              height: '1.5px',
              backgroundColor: isLight ? '#FFFFFF' : '#FF6D00',
              borderRadius: '1px',
            }}
          />
          <span
            style={{
              display: 'inline-block',
              padding: sizeMap.taglinePadding,
              backgroundColor: isLight ? '#FFFFFF' : '#FF6D00',
              color: isLight ? '#FF6D00' : '#FFFFFF',
              borderRadius: '9999px',
              fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
              fontSize: `${sizeMap.taglineSize}px`,
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
              width: '10px',
              height: '1.5px',
              backgroundColor: isLight ? '#FFFFFF' : '#FF6D00',
              borderRadius: '1px',
            }}
          />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Shop Qatify Home" style={{ textDecoration: 'none', display: 'inline-flex' }}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};

export default QatifyLogo;
