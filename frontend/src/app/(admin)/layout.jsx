'use client';

import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const AdminLayout = dynamic(() => import('@/layouts/AdminLayout'));
const StudentLayout = dynamic(() => import('@/layouts/StudentLayout'));
const IndustryLayout = dynamic(() => import('@/layouts/IndustryLayout'));
const InstitutionLayout = dynamic(() => import('@/layouts/InstitutionLayout'));
const SuperAdminLayout = dynamic(() => import('@/layouts/SuperAdminLayout'));
const ReviewerLayout = dynamic(() => import('@/layouts/ReviewerLayout'));

/***************************  LAYOUT - ADMIN, STUDENT, INDUSTRY, INSTITUTION & REVIEWER  ***************************/

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { DashboardLoading } from '@/components/DashboardLoading';

export default function Layout({ children }) {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !role) {
      const redirectUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
      const loginUrl = redirectUrl ? `/auth/login?redirect=${encodeURIComponent(redirectUrl)}` : '/auth/login';
      router.push(loginUrl);
    }
  }, [role, isLoading, router]);

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (!role) {
    return null;
  }

  if (role === 'STUDENT') {
    return <StudentLayout>{children}</StudentLayout>;
  }

  if (role === 'INDUSTRY_SPOC') {
    return <IndustryLayout>{children}</IndustryLayout>;
  }

  if (role === 'INSTITUTION_SPOC') {
    return <InstitutionLayout>{children}</InstitutionLayout>;
  }

  if (role === 'SUPER_ADMIN') {
    return <SuperAdminLayout>{children}</SuperAdminLayout>;
  }

  if (role === 'REVIEWER') {
    return <ReviewerLayout>{children}</ReviewerLayout>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

Layout.propTypes = { children: PropTypes.any };
