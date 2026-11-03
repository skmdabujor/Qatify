'use client';

import React from 'react';

export function QatarFlag({ className, size = 20 }: { className?: string; size?: number }) {
  const width = size;
  const height = Math.round(size * 0.7);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        borderRadius: '3px',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
    >
      <rect width="28" height="20" fill="#8D1B3D" />
      <path
        d="M0 0H8.5L11.5 1.11L8.5 2.22L11.5 3.33L8.5 4.44L11.5 5.55L8.5 6.66L11.5 7.77L8.5 8.88L11.5 10L8.5 11.11L11.5 12.22L8.5 13.33L11.5 14.44L8.5 15.55L11.5 16.66L8.5 17.77L11.5 18.88L8.5 20H0V0Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function SaudiFlag({ className, size = 20 }: { className?: string; size?: number }) {
  const width = size;
  const height = Math.round(size * 0.7);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        borderRadius: '3px',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
    >
      <rect width="28" height="20" fill="#006C35" />
      {/* Arabic Script Emblem */}
      <path
        d="M6 6.5h16v2H6zM8 9.5h12v1.5H8z"
        fill="#FFFFFF"
        opacity="0.95"
      />
      {/* Traditional curved sword */}
      <path d="M6 13.5h14l-1.5 1H6v-1z" fill="#FFFFFF" />
      <circle cx="21" cy="14" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

export function UAEFlag({ className, size = 20 }: { className?: string; size?: number }) {
  const width = size;
  const height = Math.round(size * 0.7);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        borderRadius: '3px',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
    >
      {/* Green top stripe */}
      <rect x="7" y="0" width="21" height="6.66" fill="#00732F" />
      {/* White middle stripe */}
      <rect x="7" y="6.66" width="21" height="6.66" fill="#FFFFFF" />
      {/* Black bottom stripe */}
      <rect x="7" y="13.33" width="21" height="6.67" fill="#000000" />
      {/* Red vertical hoist */}
      <rect x="0" y="0" width="7" height="20" fill="#FF0000" />
    </svg>
  );
}

export function CountryFlag({ code, size = 20 }: { code: string; size?: number }) {
  const c = code.toUpperCase();
  if (c === 'QA' || c === 'QATAR') return <QatarFlag size={size} />;
  if (c === 'SA' || c === 'SAUDI ARABIA') return <SaudiFlag size={size} />;
  if (c === 'AE' || c === 'UAE' || c.includes('DUBAI')) return <UAEFlag size={size} />;
  return null;
}

