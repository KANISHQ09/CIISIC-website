'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import useAuth from '@/hooks/useAuth';
import useToast from '@/hooks/useToast';

const registerSchema = zod.object({
  name: zod.string().min(2, 'Name must be at least 2 characters long'),
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(8, 'Password must be at least 8 characters long'),
  role: zod.enum(['STUDENT', 'INDUSTRY_SPOC', 'INSTITUTION_SPOC', 'ADMIN']),
  affiliationName: zod.string().optional()
});

type RegisterFields = zod.infer<typeof registerSchema>;

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-500">
    {children}
  </div>
);

export const Register: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'STUDENT' }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFields) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          profileData: data.role === 'STUDENT' 
            ? { enrollmentNo: `CII/ST/${Date.now().toString().slice(-4)}`, skills: [], department: 'General', yearOfStudy: 1 }
            : data.role === 'INDUSTRY_SPOC'
            ? { companyName: data.affiliationName || 'New Corporate Partner', industry: 'General', isCIIMember: true }
            : data.role === 'ADMIN'
            ? { adminRole: 'Global Administrator', department: 'CII Operations' }
            : { designation: 'Dean of Placement', department: 'Administration' }
        })
      });
      const result = await response.json();

      if (result.success) {
        document.cookie = `ciisic_token=${result.token}; path=/; max-age=86400; SameSite=Strict`;
        login(result.token, result.user);
        showToast('Account registered successfully!', 'success');
        router.push('/dashboard');
      } else {
        showToast(result.error || 'Registration failed', 'error');
      }
    } catch {
      showToast('Connection failed. Please check network settings.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-5">
      <div className="space-y-1 text-left">
        <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight leading-tight">Create Account</h2>
        <p className="text-xs text-zinc-500 font-medium">Join the CIISIC Institutional Cooperation Network</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div className="space-y-1 text-left">
          <label className="text-xs font-bold text-zinc-700">Full Name</label>
          <GlassInputWrapper>
            <input
              {...register('name')}
              type="text"
              placeholder="John Doe"
              className="w-full bg-transparent text-sm p-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
              required
            />
          </GlassInputWrapper>
          {errors.name && <p className="text-[10px] text-red-600 font-medium mt-0.5">{errors.name.message}</p>}
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-bold text-zinc-700">Email Address</label>
          <GlassInputWrapper>
            <input
              {...register('email')}
              type="email"
              placeholder="example@ciisic.in"
              className="w-full bg-transparent text-sm p-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
              required
            />
          </GlassInputWrapper>
          {errors.email && <p className="text-[10px] text-red-600 font-medium mt-0.5">{errors.email.message}</p>}
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-bold text-zinc-700">Password</label>
          <GlassInputWrapper>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full bg-transparent text-sm p-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
              required
            />
          </GlassInputWrapper>
          {errors.password && <p className="text-[10px] text-red-600 font-medium mt-0.5">{errors.password.message}</p>}
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-bold text-zinc-700">Register As</label>
          <GlassInputWrapper>
            <select
              {...register('role')}
              className="w-full bg-transparent text-sm p-3.5 focus:outline-none text-zinc-950 font-medium cursor-pointer"
            >
              <option value="STUDENT">Student Candidate</option>
              <option value="INDUSTRY_SPOC">Corporate Industry SPOC</option>
              <option value="INSTITUTION_SPOC">Academic Institution SPOC</option>
              <option value="ADMIN">Platform Admin</option>
            </select>
          </GlassInputWrapper>
        </div>

        {selectedRole !== 'STUDENT' && selectedRole !== 'ADMIN' && (
          <div className="space-y-1 text-left">
            <label className="text-xs font-bold text-zinc-700">Company or Institution Name</label>
            <GlassInputWrapper>
              <input
                {...register('affiliationName')}
                type="text"
                placeholder="e.g. Netlink Technologies or LNCT University"
                className="w-full bg-transparent text-sm p-3.5 focus:outline-none text-zinc-950 placeholder:text-zinc-400 font-medium"
                required
              />
            </GlassInputWrapper>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 font-bold transition-all mt-2 active:scale-[0.99] cursor-pointer text-sm shadow-sm disabled:opacity-50"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center text-xs font-semibold text-zinc-500 pt-2">
          Already have an account? <a href="/auth/login" className="text-violet-600 hover:underline transition-colors">Sign In</a>
        </p>
      </form>
    </div>
  );
};
