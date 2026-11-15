'use client';

// =============================================================================
// Qatify — Customer Signup / Register Page (/signup)
// 2-Column Layout matching design specifications
// =============================================================================

import React, { Suspense } from 'react';
import { AuthPage } from '@/components/auth/AuthPage';

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <AuthPage defaultMode="signUp" />
    </Suspense>
  );
}
