'use client';

import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const ProposalDetails = dynamic(() => import('@/views/student/proposals/details'));
const ProposalReviewDetails = dynamic(() => import('@/views/industry/proposals/details'));
const SuperAdminProposalDetails = dynamic(() => import('@/views/admin/proposals/details'));
const ReviewerProposalEvaluation = dynamic(() => import('@/views/reviewer/proposals/evaluate'));

export default function ProposalDetailsPage() {
  const { role } = useAuth();

  if (role === 'INDUSTRY_SPOC') {
    return <ProposalReviewDetails />;
  }

  if (role === 'SUPER_ADMIN') {
    return <SuperAdminProposalDetails />;
  }

  if (role === 'REVIEWER') {
    return <ReviewerProposalEvaluation />;
  }

  return <ProposalDetails />;
}
