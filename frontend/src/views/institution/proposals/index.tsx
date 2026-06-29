'use client';

import React, { useEffect, useState } from 'react';
import { Proposal } from '@/types/studentPortal';
import { ProposalMonitoringService } from '@/services/proposalMonitoringService';
import { StatusBadge } from '@/components/student/StatusBadge';
import { TableSkeleton } from '@/components/student/Skeletons';
import { Search, Monitor, ArrowRight, FileCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProposalMonitoring() {
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
        const list = await ProposalMonitoringService.getInstitutionProposals();
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

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Proposal Monitoring</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Track development progress, industry comments, and completion statuses for student solutions
        </p>
      </div>

      {/* KPI summaries cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-zinc-150 rounded-2xl text-left leading-tight">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Proposals</p>
          <p className="text-2xl font-black text-zinc-900 mt-1">{proposals.length}</p>
        </div>
        <div className="p-4 bg-white border border-zinc-150 rounded-2xl text-left leading-tight">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Approved Solutions</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{proposals.filter((p) => p.status === 'ACCEPTED').length}</p>
        </div>
        <div className="p-4 bg-white border border-zinc-150 rounded-2xl text-left leading-tight">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Awaiting Revision</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{proposals.filter((p) => p.status === 'REVISION_REQUESTED').length}</p>
        </div>
        <div className="p-4 bg-white border border-zinc-150 rounded-2xl text-left leading-tight">
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Under Audit Review</p>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {proposals.filter((p) => p.status === 'UNDER_REVIEW' || p.status === 'SUBMITTED').length}
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search proposals by title or challenge brief..."
            className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-zinc-800"
          />
        </div>

        {/* Status filter */}
        <div className="w-full sm:w-auto shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2.5 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-zinc-650 cursor-pointer"
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

      {/* Table directories */}
      {isLoading ? (
        <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm">
          <TableSkeleton />
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="py-16 text-center border border-zinc-150 border-dashed rounded-3xl bg-white space-y-3 shadow-sm">
          <Monitor className="w-10 h-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-850">No Proposals Monitored</h3>
            <p className="text-xs text-zinc-400 font-medium">Verify registrations to allow student submissions.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Proposal Brief</th>
                  <th className="py-4 px-6">Challenge Theme</th>
                  <th className="py-4 px-6">Student Team</th>
                  <th className="py-4 px-6">Submitted</th>
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
                    <td className="py-4 px-6 font-bold text-zinc-650 max-w-[200px] truncate">{p.challengeTitle}</td>
                    <td className="py-4 px-6 text-zinc-800 font-bold">{p.studentName}</td>
                    <td className="py-4 px-6 text-zinc-400 font-medium">{new Date(p.submissionDate).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => router.push(`/proposals/${p.id}`)}
                        className="py-1.5 px-3 border border-zinc-200 hover:border-zinc-350 hover:bg-neutral-50 rounded-xl text-[10px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                      >
                        Audit Solution <ArrowRight className="w-3 h-3" />
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
