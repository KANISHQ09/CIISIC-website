'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function PortalIndex() {
  const router = useRouter();
  const { role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!role) {
        router.push('/auth/login');
      } else {
        if (role === 'STUDENT') router.push('/portal/student/dashboard');
        else if (role === 'INDUSTRY_SPOC') router.push('/portal/industry/dashboard');
        else if (role === 'INSTITUTION_SPOC') router.push('/portal/institution/dashboard');
        else if (role === 'REVIEWER') router.push('/portal/reviewer/dashboard');
        else if (role === 'SUPER_ADMIN') router.push('/portal/admin/dashboard');
      }
    }
  }, [role, isLoading, router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-zinc-50">
      <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-violet-600 animate-spin" />
    </div>
  );
}
