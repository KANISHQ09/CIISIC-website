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

export default function Layout({ children }) {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-50">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-violet-600 animate-spin" />
      </div>
    );
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
