'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Shield } from 'lucide-react';
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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (result.success) {
        setIsSent(true);
        showToast('Password reset link sent to your institutional email.', 'success');
      } else {
        showToast(result.error || 'Failed to dispatch reset link', 'error');
      }
    } catch {
      showToast('Connection failed. Please check network settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

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
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Locked / Security Illustration Graphic */}
          <div className="mt-8 relative w-48 h-48 mx-auto flex items-center justify-center bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <Shield className="w-24 h-24 text-violet-400 animate-pulse" />
          </div>
        </div>

        <div className="relative z-10 text-neutral-500 text-xs">
          © {new Date().getFullYear()} CIISIC Platform. All rights reserved.
        </div>
      </section>

      {/* Right Column: Forgot Password Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white min-h-screen">
        <div className="w-full max-w-sm space-y-7 text-left">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Forgot Password</h1>
            <p className="text-xs text-zinc-500 font-medium">Enter your institutional email address</p>
          </div>

          {isSent ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl text-xs font-semibold text-emerald-800 leading-relaxed">
                We've sent a secure password reset link to your institutional email. Please check your inbox and spam folder to continue.
              </div>
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 font-bold transition-all text-sm shadow-sm flex items-center justify-center gap-2"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700">Institutional Email</label>
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500 flex items-center px-4">
                  <Mail className="w-4 h-4 text-zinc-400 mr-2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@institution.edu.in"
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
                {isLoading ? 'Sending Link...' : 'Send Reset Link →'}
              </button>

              <div className="p-4 bg-violet-50/50 border border-violet-100 rounded-2xl text-[11px] text-violet-700 font-semibold leading-relaxed">
                We'll send you a secure link to reset your password. Please check your inbox and spam folder.
              </div>
            </form>
          )}

          <div className="pt-2">
            <button
              onClick={() => router.push('/auth/login')}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
