'use client';

import React, { useState, useEffect } from 'react';
import { ProposalService } from '@/services/proposalService';
import { Proposal } from '@/types/studentPortal';
import { Search, FileSpreadsheet, UserPlus, Check, X } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { useRouter } from 'next/navigation';

import { AdminService } from '@/services/adminService';

export default function AdminProposals() {
  const { showToast } = useToast();
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reviewers, setReviewers] = useState<Array<{ id: string; name: string }>>([]);
  const [assigningPropId, setAssigningPropId] = useState<string | null>(null);

  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const data = await ProposalService.getProposals();
      setProposals(data);
      const reviewersList = await AdminService.getUsers({ role: 'REVIEWER' });
      setReviewers(reviewersList.map((r) => ({ id: r.id, name: r.name })));
    } catch {
      showToast('Failed to load workspace data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleAssignReviewer = async (propId: string, reviewerId: string) => {
    try {
      const reviewer = reviewers.find((r) => r.id === reviewerId);
      if (!reviewer) return;
      await ProposalService.assignReviewer(propId, reviewerId);
      setProposals(
        proposals.map((p) => {
          if (p.id === propId) {
            return {
              ...p,
              feedback: `Reviewer assigned: ${reviewer.name}. Assessment pending.`
            };
          }
          return p;
        })
      );
      setAssigningPropId(null);
      showToast(`Proposal successfully routed to ${reviewer.name}`, 'success');
    } catch {
      showToast('Failed to assign reviewer.', 'error');
    }
  };

  const filtered = proposals.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Proposals Oversight</h1>
        <p className="text-sm text-zinc-500 font-medium">Monitor active student solution proposals and assign ecosystem reviewers</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-zinc-100 pb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search proposals by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-800"
          />
        </div>
      </div>

      {/* Directory Table */}
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="py-4 px-6 text-left">Proposal Title</th>
                <th className="py-4 px-6 text-left border-l border-zinc-100">Solver Group</th>
                <th className="py-4 px-6 text-center border-l border-zinc-100">Status</th>
                <th className="py-4 px-6 text-left border-l border-zinc-100">Evaluator Assignment</th>
                <th className="py-4 px-6 text-center border-l border-zinc-100 w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="py-4 px-6 text-left">
                    <button
                      onClick={() => router.push(`/proposals/${p.id}`)}
                      className="font-extrabold text-zinc-900 hover:text-indigo-650 hover:underline transition-all block text-left"
                    >
                      {p.title}
                    </button>
                    <span className="text-[10px] text-zinc-400 font-medium block pt-0.5">
                      Submitted: {new Date(p.submittedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left border-l border-zinc-100 font-bold text-zinc-500">{p.solverName}</td>
                  <td className="py-4 px-6 text-center border-l border-zinc-100">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        p.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : p.status === 'REVISING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left border-l border-zinc-100">
                    {assigningPropId === p.id ? (
                      <select
                        onChange={(e) => handleAssignReviewer(p.id, e.target.value)}
                        defaultValue=""
                        className="px-2 py-1 border border-zinc-200 bg-white rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-700"
                      >
                        <option value="" disabled>
                          Select Reviewer...
                        </option>
                        {reviewers.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-zinc-500 font-semibold">
                        {p.feedback.includes('Reviewer assigned') ? p.feedback.split('.')[0] : 'No Reviewer Assigned'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center border-l border-zinc-100">
                    <button
                      onClick={() => setAssigningPropId(p.id)}
                      className="py-1 px-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-650 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 mx-auto focus:outline-none"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Assign Reviewer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
