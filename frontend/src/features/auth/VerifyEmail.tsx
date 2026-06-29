'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useToast from '@/hooks/useToast';

export const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`/api/v1/auth/verify-email?token=${token}`, {
          method: 'GET'
        });
        const result = await response.json();

        if (result.success) {
          setStatus('success');
          showToast('Email verified successfully!', 'success');
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        } else {
          setStatus('error');
          showToast(result.error || 'Verification failed', 'error');
        }
      } catch {
        setStatus('error');
        showToast('Connection failed. Please check network settings.', 'error');
      }
    };

    verify();
  }, [searchParams, router, showToast]);

  return (
    <div className="w-full max-w-md mx-auto space-y-8 p-8 bg-white rounded-3xl border border-zinc-200 shadow-md text-center">
      <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Verify Email</h2>

      {status === 'verifying' && (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-neutral-500 font-medium">Verifying your email credentials, please wait...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
          <p className="text-sm font-bold text-green-800">Email verified successfully!</p>
          <p className="text-xs text-green-700">Redirecting to Sign In screen...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-sm font-bold text-red-800">Email verification failed</p>
          <p className="text-xs text-red-700">The verification token is invalid or expired.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            Go back to Sign In
          </button>
        </div>
      )}
    </div>
  );
};
