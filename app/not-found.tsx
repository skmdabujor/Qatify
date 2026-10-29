'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: '#f8fafc',
    }}>
      <div style={{
        fontSize: '64px',
        fontWeight: 900,
        color: '#0a0a0c',
        lineHeight: 1,
        marginBottom: '12px',
      }}>
        404
      </div>
      <h2 style={{
        fontSize: '22px',
        fontWeight: 800,
        color: '#18181b',
        marginBottom: '8px',
      }}>
        Page Not Found
      </h2>
      <p style={{
        fontSize: '14px',
        color: '#71717a',
        maxWidth: '420px',
        lineHeight: 1.5,
        marginBottom: '24px',
      }}>
        The Qatar air express product or destination you are searching for does not exist or has been moved.
      </p>
      <Link
        href="/shop"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          backgroundColor: '#0a0a0c',
          color: '#ffffff',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        Return to Qatar Catalog
      </Link>
    </div>
  );
}

