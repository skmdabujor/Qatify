// =============================================================================
// Qatify Qatar — Dynamic Open Graph Image Generator (1200 x 630 px)
// Automatically served at: https://shopqatify.com/opengraph-image
// Displayed when sharing site links on WhatsApp, Facebook, Twitter, Telegram, etc.
// =============================================================================

import { ImageResponse } from 'next/og';

export const alt = 'Qatify Qatar — Best Online Shopping for Mobiles, Electronics & Gadgets';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#090A0F',
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(255, 109, 0, 0.28) 0%, rgba(9, 10, 15, 0.98) 75%)',
          padding: '56px 64px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Subtle decorative inner border */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: '1px solid rgba(255, 109, 0, 0.22)',
            borderRadius: 24,
            display: 'flex',
          }}
        />

        {/* 1. TOP HEADER BAR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            zIndex: 10,
          }}
        >
          {/* Brand Logo & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: '#FF6D00',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(255, 109, 0, 0.45)',
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: '#ffffff',
                }}
              >
                Q
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                  color: '#ffffff',
                }}
              >
                Qatify<span style={{ color: '#FF6D00' }}>.</span>
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#FF6D00',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                Qatar Online Electronics Store
              </span>
            </div>
          </div>

          {/* Delivery & Country Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 30,
              padding: '10px 22px',
            }}
          >
            <span style={{ fontSize: 20 }}>🇶🇦</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.5px',
              }}
            >
              Doha • Lusail • Direct Air Express
            </span>
          </div>
        </div>

        {/* 2. CENTER HERO SECTION */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: 1020,
            zIndex: 10,
            marginTop: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(255, 109, 0, 0.15)',
              border: '1px solid rgba(255, 109, 0, 0.4)',
              borderRadius: 20,
              padding: '6px 20px',
              marginBottom: 18,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: '#FF8A00', letterSpacing: '1.2px' }}>
              ⚡ BEST TECH DEALS IN QATAR (QAR)
            </span>
          </div>

          <h1
            style={{
              fontSize: 52,
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#ffffff',
              margin: '0 0 16px 0',
            }}
          >
            Qatar’s Premier Electronics & Smart Gadgets Store
          </h1>

          <p
            style={{
              fontSize: 21,
              fontWeight: 500,
              lineHeight: 1.45,
              color: '#a1a1aa',
              margin: 0,
              maxWidth: 840,
            }}
          >
            Authentic GaN Fast Chargers • ANC Earbuds • Smartwatches • MagSafe • Gaming & Desk Tech
          </p>
        </div>

        {/* 3. BOTTOM TRUST BAR & DOMAIN */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingTop: 22,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 10,
          }}
        >
          {/* Trust Highlights */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>✈️</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#e4e4e7' }}>
                Doorstep Air Express
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🛡️</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#e4e4e7' }}>
                100% Genuine Guaranteed
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>💳</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#e4e4e7' }}>
                Apple Pay & Card Checkout
              </span>
            </div>
          </div>

          {/* Website Domain Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FF6D00',
              borderRadius: 14,
              padding: '10px 24px',
              fontWeight: 800,
              fontSize: 16,
              color: '#ffffff',
              letterSpacing: '0.5px',
              boxShadow: '0 6px 20px rgba(255, 109, 0, 0.4)',
            }}
          >
            shopqatify.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

