'use client';

// =============================================================================
// Qatify — Customer Register Page (/register)
// =============================================================================

import React, { Suspense } from 'react';
import { AuthPage } from '@/components/auth/AuthPage';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <AuthPage defaultMode="signUp" />
    </Suspense>
  );
}
