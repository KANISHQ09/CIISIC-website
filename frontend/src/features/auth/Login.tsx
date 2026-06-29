'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import useAuth from '@/hooks/useAuth';
import useToast from '@/hooks/useToast';

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
    formState: { errors },
    setValue
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFields) => {
    setIsLoading(true);
    try {
      // Simulate API token request
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

  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'INDUSTRY_SPOC' | 'INSTITUTION_SPOC' | 'ADMIN'>('STUDENT');

  const rolesInfo = {
    STUDENT: {
      label: 'Student',
      who: 'Students',
      email: 'student@lnct.ac.in',
      responsibilities:
        'Browse challenges, ask queries, submit proposals, upload documents, track proposal status, communicate with industry through portal.'
    },
    INDUSTRY_SPOC: {
      label: 'Industry SPOC',
      who: 'Company representatives',
      email: 'spoc@netlink.com',
      responsibilities:
        'Create and manage problem statements, respond to student queries, review proposals, approve/reject submissions, track challenge progress.'
    },
    INSTITUTION_SPOC: {
      label: 'Institutional SPOC',
      who: 'College/University coordinators',
      email: 'spoc@lnct.ac.in',
      responsibilities:
        'Register and manage students, monitor student participation, approve institutional registrations (if required), view reports, communicate with students.'
    },
    ADMIN: {
      label: 'Platform Admin',
      who: 'CIISIC/CII administrators',
      email: 'admin@ciisic.in',
      responsibilities:
        'Manage users, approve registrations, maintain CII member directory, monitor activity, generate reports, audit logs, platform configuration.'
    }
  };

  const handleRoleSelect = (roleKey: 'STUDENT' | 'INDUSTRY_SPOC' | 'INSTITUTION_SPOC' | 'ADMIN') => {
    setSelectedRole(roleKey);
    setValue('email', rolesInfo[roleKey].email);
    setValue('password', 'Password@123');
    showToast(`Loaded ${rolesInfo[roleKey].label} dev credentials`, 'info');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 p-8 bg-white rounded-3xl border border-zinc-200 shadow-md">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Access the CIISIC Collaboration Portal</h2>
        <p className="text-xs text-neutral-500 font-medium">Select a role credential or log in via email</p>
      </div>

      {/* Dev shortcuts */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block text-left">
          Ecosystem Role Guides & Shortcuts
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(rolesInfo) as Array<keyof typeof rolesInfo>).map((roleKey) => (
            <button
              key={roleKey}
              type="button"
              onClick={() => handleRoleSelect(roleKey)}
              className={`py-2 px-2 border rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedRole === roleKey
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-zinc-200 hover:bg-neutral-50 text-neutral-600'
              }`}
            >
              {rolesInfo[roleKey].label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1 text-left">
          <label className="text-xs font-bold text-neutral-700">Email Address</label>
          <input
            {...register('email')}
            type="email"
            placeholder="example@ciisic.in"
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {errors.email && <p className="text-[11px] text-red-600 font-medium mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-bold text-neutral-700">Password</label>
          <input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          {errors.password && <p className="text-[11px] text-red-600 font-medium mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 bg-primary text-white hover:bg-primary-dark font-semibold text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
