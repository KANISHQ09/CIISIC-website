'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChallengeManagement } from '@/types/industryPortal';
import { ChallengeManagementService } from '@/services/challengeManagementService';
import { StatusBadge } from '@/components/student/StatusBadge';
import { TableSkeleton } from '@/components/student/Skeletons';
import { Search, Plus, Copy, Trash2, ArrowRight, FolderKanban } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function ManageChallenges() {
  const router = useRouter();
  const { showToast } = useToast();
  const [challenges, setChallenges] = useState<ChallengeManagement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchChallenges = async () => {
    setIsLoading(true);
    try {
      const data = await ChallengeManagementService.getChallenges();
      setChallenges(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleDuplicate = async (id: string) => {
    const success = await ChallengeManagementService.duplicateChallenge(id);
    if (success) {
      showToast('Challenge copied to draft.', 'success');
      fetchChallenges();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this challenge?')) {
      await ChallengeManagementService.deleteChallenge(id);
      showToast('Challenge deleted.', 'info');
      fetchChallenges();
    }
  };

  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left pb-12 select-none">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Corporate Briefs</h1>
          <p className="text-sm text-zinc-500 font-medium">Manage corporate challenge statements and draft solution requirements</p>
        </div>
        <button
          onClick={() => router.push('/challenges/create')}
          className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Create Challenge
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search briefs by title or category..."
            className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-800"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2.5 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-zinc-600 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Table list */}
      {isLoading ? (
        <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm">
          <TableSkeleton />
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="py-16 text-center border border-zinc-150 border-dashed rounded-3xl bg-white space-y-3 shadow-sm">
          <FolderKanban className="w-10 h-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-800">No Challenges Found</h3>
            <p className="text-xs text-zinc-400 font-medium">Create a challenge to begin receiving solver proposals.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Brief Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Date Created</th>
                  <th className="py-4 px-6">Submissions</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
                {filteredChallenges.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="py-4 px-6 text-left">
                      <p className="font-extrabold text-zinc-900 text-sm line-clamp-1">{c.title}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">ID: {c.id.toUpperCase()}</p>
                    </td>
                    <td className="py-4 px-6 font-bold text-zinc-600">{c.category}</td>
                    <td className="py-4 px-6 text-zinc-400 font-medium">{new Date(c.dateCreated).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <p className="font-black text-zinc-800">{c.submissionsCount} Solvers</p>
                      {c.pendingCount > 0 && <span className="text-[9px] text-blue-600 font-extrabold">{c.pendingCount} pending</span>}
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => router.push(`/challenges/${c.id}`)}
                          className="py-1.5 px-3 border border-zinc-200 hover:border-zinc-350 hover:bg-neutral-50 rounded-xl text-[10px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => handleDuplicate(c.id)}
                          className="p-2 border border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700 rounded-xl transition-all"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-2 border border-zinc-200 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
