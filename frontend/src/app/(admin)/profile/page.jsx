'use client';

import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const StudentProfileView = dynamic(() => import('@/views/student/profile'));
const CompanyProfile = dynamic(() => import('@/views/industry/profile'));
const InstitutionProfile = dynamic(() => import('@/views/institution/profile'));

export default function ProfilePage() {
  const { role } = useAuth();

  if (role === 'INDUSTRY_SPOC') {
    return <CompanyProfile />;
  }

  if (role === 'INSTITUTION_SPOC' || role === 'SUPER_ADMIN') {
    return <InstitutionProfile />;
  }

  return <StudentProfileView />;
}
