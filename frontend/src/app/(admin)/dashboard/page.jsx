'use client';

import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const StudentDashboard = dynamic(() => import('@/views/student/dashboard'));
const IndustryDashboard = dynamic(() => import('@/views/industry/dashboard'));
const InstitutionDashboard = dynamic(() => import('@/views/institution/dashboard'));
const SuperAdminDashboard = dynamic(() => import('@/views/admin/dashboard'));
const ReviewerDashboard = dynamic(() => import('@/views/reviewer/dashboard'));

/***************************  DASHBOARD SWITCHER  ***************************/

export default function DashboardPages() {
  const { role } = useAuth();

  if (role === 'STUDENT') {
    return <StudentDashboard />;
  }

  if (role === 'INDUSTRY_SPOC') {
    return <IndustryDashboard />;
  }

  if (role === 'INSTITUTION_SPOC') {
    return <InstitutionDashboard />;
  }

  if (role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  if (role === 'REVIEWER') {
    return <ReviewerDashboard />;
  }

  return <SuperAdminDashboard />;
}
