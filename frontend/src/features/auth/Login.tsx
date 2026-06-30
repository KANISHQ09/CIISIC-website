'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import useAuth from '@/hooks/useAuth';
import useToast from '@/hooks/useToast';
import { ShieldAlert, LogIn, Lock } from 'lucide-react';

const loginSchema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(8, 'Password must be at least 8 characters long')
});

type LoginFields = zod.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFields) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (result.success) {
        // Set secure cookie for middleware route guards
        document.cookie = `ciisic_token=${result.token}; path=/; max-age=86400; SameSite=Strict`;
        login(result.token, result.user);
        showToast('Successfully signed in!', 'success');

        const redirect = searchParams.get('redirect') || '/dashboard';
        router.push(redirect);
      } else {
        showToast(result.error || 'Authentication failed', 'error');
      }
    } catch {
      showToast('Connection failed. Please check network settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const isSessionExpired = searchParams.get('session_expired') === 'true';

  return (
    <div className="w-full max-w-md mx-auto space-y-8 p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-zinc-200 shadow-lg text-left select-none animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight flex items-center justify-center gap-2">
          <LogIn className="w-6 h-6 text-violet-600" /> Sign In
        </h2>
        <p className="text-xs text-neutral-500 font-medium">
          Log in with your institutional or corporate credentials
        </p>
      </div>

      {isSessionExpired && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800 font-semibold animate-in slide-in-from-top-2 duration-300">
          <ShieldAlert className="w-4.5 h-4.5 text-amber-600 shrink-0" />
          <div className="leading-relaxed">
            <p className="font-bold">Session Expired</p>
            <p className="text-[11px] font-medium text-amber-700 mt-0.5">
              Your security session has expired. Please authenticate again to access your workspace.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-bold text-neutral-700">Email Address</label>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500">
            <input
              {...register('email')}
              type="email"
              placeholder="example@ciisic.in"
              className="w-full bg-transparent text-sm p-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-semibold"
              required
            />
          </div>
          {errors.email && <p className="text-[11px] text-red-650 font-semibold mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5 text-left">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-neutral-700">Password</label>
            <a href="/auth/forgot-password" className="text-[11px] font-bold text-violet-600 hover:underline">
              Forgot?
            </a>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500">
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full bg-transparent text-sm p-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-semibold"
              required
            />
          </div>
          {errors.password && <p className="text-[11px] text-red-650 font-semibold mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
