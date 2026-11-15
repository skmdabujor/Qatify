'use client';

// =============================================================================
// Qatify — Customer Login Page (/login)
// 2-Column Layout matching design specifications
// =============================================================================

import React, { Suspense } from 'react';
import { AuthPage } from '@/components/auth/AuthPage';

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <AuthPage defaultMode="signIn" />
    </Suspense>
  );
}
