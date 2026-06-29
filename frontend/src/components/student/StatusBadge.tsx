import React from 'react';
import { ProposalStatus, ChallengeStatus } from '@/types/studentPortal';

interface StatusBadgeProps {
  status: ProposalStatus | ChallengeStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'OPEN':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'CLOSED':
        return 'bg-zinc-150 text-zinc-600 border-zinc-200';
      case 'DRAFT':
        return 'bg-zinc-50 text-zinc-500 border-zinc-200';
      case 'SUBMITTED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'INSTITUTION_VERIFIED':
        return 'bg-teal-50 text-teal-700 border-teal-100';
      case 'UNDER_REVIEW':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'ACCEPTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'REVISION_REQUESTED':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
  };

  const formatText = () => {
    return status.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStyle()} uppercase tracking-wider text-[10px]`}
    >
      {formatText()}
    </span>
  );
};
