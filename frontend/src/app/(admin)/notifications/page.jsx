'use client';

import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const NotificationsCenter = dynamic(() => import('@/views/student/notifications'));
const IndustryNotifications = dynamic(() => import('@/views/industry/notifications'));
const InstitutionNotifications = dynamic(() => import('@/views/institution/notifications'));

export default function NotificationsPage() {
  const { role } = useAuth();

  if (role === 'INDUSTRY_SPOC') {
    return <IndustryNotifications />;
  }

  if (role === 'INSTITUTION_SPOC' || role === 'SUPER_ADMIN') {
    return <InstitutionNotifications />;
  }

  return <NotificationsCenter />;
}
