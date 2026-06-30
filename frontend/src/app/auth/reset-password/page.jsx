'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import useToast from '@/hooks/useToast';

const CiisicLogo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    <div className="text-left">
      <span className="text-base font-black tracking-tight text-white">
        CII <span className="text-violet-400 font-extrabold">CIISIC</span>
      </span>
      <p className="text-[8px] text-zinc-400 font-extrabold uppercase tracking-wider -mt-1.5">Collaboration Hub</p>
    </div>
  </div>
);

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get('token') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showToast('Reset token is missing from the URL.', 'error');
      return;
    }
    if (password.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const result = await response.json();
      if (result.success) {
        showToast('Password reset successful. Please sign in with your new password.', 'success');
        router.push('/auth/login');
      } else {
        showToast(result.error || 'Failed to reset password', 'error');
      }
    } catch {
      showToast('Connection failed. Please check network settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-7 text-left">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Create New Password</h1>
        <p className="text-xs text-zinc-500 font-medium">Set a strong password for your student innovator account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700">New Password</label>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
            <Lock className="w-4 h-4 text-zinc-400 mr-2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm py-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 focus:outline-none">
              {showPassword ? <EyeOff className="w-4 h-4 text-zinc-400" /> : <Eye className="w-4 h-4 text-zinc-400" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700">Confirm Password</label>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
            <Lock className="w-4 h-4 text-zinc-400 mr-2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent text-sm py-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-violet-600 hover:bg-violet-750 text-white py-3.5 font-bold transition-all mt-2 active:scale-[0.99] cursor-pointer text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password →'}
        </button>
      </form>

      <div className="pt-2">
        <button
          onClick={() => router.push('/auth/login')}
          className="text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="h-screen w-screen flex bg-white text-zinc-900 overflow-hidden font-sans select-none">
      {/* Left Column: premium glowing cosmic gradient */}
      <section className="hidden md:flex w-1/2 min-h-screen relative overflow-hidden bg-slate-950 flex-col justify-between p-12 select-none">
        {/* Background glow meshes */}
        <div className="absolute top-[-10%] right-[-10%] w-[65%] h-[65%] rounded-full bg-violet-600/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[65%] h-[65%] rounded-full bg-indigo-600/15 blur-[130px]" />

        <div className="relative z-10">
          <CiisicLogo />
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-6 my-auto pl-6 text-left">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Reset Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300">
              Password
            </span>
          </h2>
          <p className="text-sm text-neutral-400 max-w-sm leading-relaxed font-medium">
            Enter your new password coordinates below to verify credentials.
          </p>
        </div>

        <div className="relative z-10 text-neutral-500 text-xs">
          © {new Date().getFullYear()} CIISIC Platform. All rights reserved.
        </div>
      </section>

      {/* Right Column: Reset Password Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white min-h-screen">
        <Suspense fallback={<div>Loading form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </section>
    </div>
  );
}
