'use client';

import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const MessagesChat = dynamic(() => import('@/views/student/messages'));
const IndustryMessagesChat = dynamic(() => import('@/views/industry/messages'));
const InstitutionMessagesChat = dynamic(() => import('@/views/institution/messages'));

export default function MessagesPage() {
  const { role } = useAuth();

  if (role === 'INDUSTRY_SPOC') {
    return <IndustryMessagesChat />;
  }

  if (role === 'INSTITUTION_SPOC') {
    return <InstitutionMessagesChat />;
  }

  return <MessagesChat />;
}
