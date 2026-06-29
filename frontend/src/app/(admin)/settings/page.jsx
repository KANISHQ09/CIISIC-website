'use client';

import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const StudentSettings = dynamic(() => import('@/views/student/settings'));
const IndustrySettings = dynamic(() => import('@/views/industry/settings'));
const InstitutionSettings = dynamic(() => import('@/views/institution/settings'));
const SuperAdminSettings = dynamic(() => import('@/views/admin/settings'));
const ReviewerSettings = dynamic(() => import('@/views/reviewer/settings'));

export default function SettingsPage() {
  const { role } = useAuth();

  if (role === 'INDUSTRY_SPOC') {
    return <IndustrySettings />;
  }

  if (role === 'INSTITUTION_SPOC') {
    return <InstitutionSettings />;
  }

  if (role === 'SUPER_ADMIN') {
    return <SuperAdminSettings />;
  }

  if (role === 'REVIEWER') {
    return <ReviewerSettings />;
  }

  return <StudentSettings />;
}
