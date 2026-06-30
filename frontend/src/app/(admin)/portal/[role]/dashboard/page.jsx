'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const StudentDashboard = dynamic(() => import('@/views/student/dashboard'));
const IndustryDashboard = dynamic(() => import('@/views/industry/dashboard'));
const InstitutionDashboard = dynamic(() => import('@/views/institution/dashboard'));
const SuperAdminDashboard = dynamic(() => import('@/views/admin/dashboard'));
const ReviewerDashboard = dynamic(() => import('@/views/reviewer/dashboard'));

// Role parameter matching dictionary
const ROLE_MAP = {
  student: 'STUDENT',
  industry: 'INDUSTRY_SPOC',
  institution: 'INSTITUTION_SPOC',
  reviewer: 'REVIEWER',
  admin: 'SUPER_ADMIN'
};

export default function PortalDashboard() {
  const params = useParams();
  const router = useRouter();
  const { role, isLoading } = useAuth();
  const roleParam = params?.role;

  useEffect(() => {
    if (!isLoading && !role) {
      router.push('/auth/login');
    }
  }, [role, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-50">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  if (!role) {
    return null;
  }

  const expectedRole = ROLE_MAP[roleParam];

  if (!expectedRole || role !== expectedRole) {
    // 403 Forbidden state
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-extrabold text-red-600 mb-2">403 Forbidden</h1>
        <p className="text-zinc-600 mb-6">You do not have permission to access this portal.</p>
        <button
          onClick={() => router.push('/auth/login')}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-medium"
        >
          Back to Login
        </button>
      </div>
    );
  }

  if (role === 'STUDENT') return <StudentDashboard />;
  if (role === 'INDUSTRY_SPOC') return <IndustryDashboard />;
  if (role === 'INSTITUTION_SPOC') return <InstitutionDashboard />;
  if (role === 'SUPER_ADMIN') return <SuperAdminDashboard />;
  if (role === 'REVIEWER') return <ReviewerDashboard />;

  return null;
}
