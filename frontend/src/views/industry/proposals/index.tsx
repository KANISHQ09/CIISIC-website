'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Proposal } from '@/types/studentPortal';
import { ProposalReviewService } from '@/services/proposalReviewService';
import { StatusBadge } from '@/components/student/StatusBadge';
import { TableSkeleton } from '@/components/student/Skeletons';
import { Search, FileSearch, ArrowRight, EyeOff } from 'lucide-react';

export default function ProposalReviewCenter() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const list = await ProposalReviewService.getProposalsToReview();
        setProposals(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const filteredProposals = proposals.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.challengeTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getAnonymizedName = (id: string) => {
    // Standard anonymous candidate labeling to prevent bias
    return `Solver-${id.slice(0, 5).toUpperCase()}`;
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Review Center</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Audit and evaluate student solution proposals anonymously to prevent evaluation bias
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search proposals by title or challenge reference..."
            className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-800"
          />
        </div>

        {/* Filter select */}
        <div className="w-full sm:w-auto shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2.5 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-zinc-600 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="REVISION_REQUESTED">Revision Req.</option>
            <option value="ACCEPTED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table grid */}
      {isLoading ? (
        <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm">
          <TableSkeleton />
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="py-16 text-center border border-zinc-150 border-dashed rounded-3xl bg-white space-y-3 shadow-sm">
          <FileSearch className="w-10 h-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-800">No Proposals Awaiting Review</h3>
            <p className="text-xs text-zinc-400 font-medium">All student briefs are fully evaluated.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Proposal Details</th>
                  <th className="py-4 px-6">Challenge Brief</th>
                  <th className="py-4 px-6">Submitter ID</th>
                  <th className="py-4 px-6">Date Submitted</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
                {filteredProposals.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="py-4 px-6 text-left">
                      <p className="font-extrabold text-zinc-900 text-sm line-clamp-1">{p.title}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">ID: {p.id.toUpperCase()}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-zinc-800 max-w-[220px] truncate">{p.challengeTitle}</p>
                    </td>
                    <td className="py-4 px-6 text-zinc-500 font-bold">
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        <EyeOff className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{getAnonymizedName(p.studentId || p.id)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-zinc-400 font-medium">{new Date(p.submissionDate).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => router.push(`/proposals/${p.id}`)}
                        className="py-1.5 px-3 border border-zinc-200 hover:border-zinc-350 hover:bg-neutral-50 rounded-xl text-[10px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                      >
                        Evaluate <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
