'use client';

import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const ReportsAnalytics = dynamic(() => import('@/views/industry/reports'));
const InstitutionReports = dynamic(() => import('@/views/institution/reports'));
const SuperAdminReports = dynamic(() => import('@/views/admin/reports'));
const ReviewerReports = dynamic(() => import('@/views/reviewer/reports'));

export default function ReportsPage() {
  const { role } = useAuth();

  if (role === 'INSTITUTION_SPOC') {
    return <InstitutionReports />;
  }

  if (role === 'SUPER_ADMIN') {
    return <SuperAdminReports />;
  }

  if (role === 'REVIEWER') {
    return <ReviewerReports />;
  }

  return <ReportsAnalytics />;
}
