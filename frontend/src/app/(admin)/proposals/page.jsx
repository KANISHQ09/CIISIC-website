'use client';

import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const MyProposals = dynamic(() => import('@/views/student/proposals'));
const ProposalReview = dynamic(() => import('@/views/industry/proposals'));
const InstitutionProposals = dynamic(() => import('@/views/institution/proposals'));
const SuperAdminProposals = dynamic(() => import('@/views/admin/proposals'));
const ReviewerProposals = dynamic(() => import('@/views/reviewer/proposals'));

export default function ProposalsPage() {
  const { role } = useAuth();

  if (role === 'INDUSTRY_SPOC') {
    return <ProposalReview />;
  }

  if (role === 'INSTITUTION_SPOC') {
    return <InstitutionProposals />;
  }

  if (role === 'SUPER_ADMIN') {
    return <SuperAdminProposals />;
  }

  if (role === 'REVIEWER') {
    return <ReviewerProposals />;
  }

  return <MyProposals />;
}
