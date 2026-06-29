'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import useToast from '@/hooks/useToast';

const resetPasswordSchema = zod
  .object({
    password: zod.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: zod.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  });

type ResetPasswordFields = zod.infer<typeof resetPasswordSchema>;

export const ResetPassword: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onSubmit = async (data: ResetPasswordFields) => {
    setIsLoading(true);
    const token = searchParams.get('token');
    try {
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: data.password, token })
      });
      const result = await response.json();

      if (result.success) {
        showToast('Password updated successfully. Please log in.', 'success');
        router.push('/auth/login');
      } else {
        showToast(result.error || 'Password reset failed', 'error');
      }
    } catch {
      showToast('Connection failed. Please check network settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 p-8 bg-white rounded-3xl border border-zinc-200 shadow-md">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Reset Password</h2>
        <p className="text-xs text-neutral-500 font-medium">Input your new password credentials below</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1 text-left">
          <label className="text-xs font-bold text-neutral-700">New Password</label>
          <input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {errors.password && <p className="text-[11px] text-red-600 font-medium mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-bold text-neutral-700">Confirm Password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {errors.confirmPassword && <p className="text-[11px] text-red-600 font-medium mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-primary text-white hover:bg-primary-dark font-semibold text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};
