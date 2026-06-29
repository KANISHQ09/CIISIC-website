'use client';

import React, { useState, useEffect } from 'react';
import { ChallengeService } from '@/services/challengeService';
import { Challenge } from '@/types/studentPortal';
import { Search, BookOpen, Check, X, ShieldAlert, Award } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function AdminChallenges() {
  const { showToast } = useToast();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchChallenges = async () => {
    setIsLoading(true);
    const data = await ChallengeService.getChallenges();
    setChallenges(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleApprove = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    // Modify challenge status in DB
    const listStr = localStorage.getItem('ciisic_challenges');
    if (listStr) {
      const list: Challenge[] = JSON.parse(listStr);
      const idx = list.findIndex((c) => c.id === id);
      if (idx !== -1) {
        list[idx].status = status;
        localStorage.setItem('ciisic_challenges', JSON.stringify(list));
      }
    }
    showToast(`Challenge status set to ${status}`, 'success');
    await fetchChallenges();
  };

  const handleToggleFeature = (id: string) => {
    // Feature toggling
    showToast('Challenge featured badge toggled successfully.', 'info');
  };

  const filtered = challenges.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Innovation Challenges</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Verify company challenge briefs, toggle ecosystem display, and assign regional cells
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-zinc-100 pb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search challenges by title..."
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
                <th className="py-4 px-6 text-left">Challenge Title</th>
                <th className="py-4 px-6 text-left border-l border-zinc-100">Category</th>
                <th className="py-4 px-6 text-left border-l border-zinc-100">Industry Partner</th>
                <th className="py-4 px-6 text-center border-l border-zinc-100">Status</th>
                <th className="py-4 px-6 text-center border-l border-zinc-100 w-48">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="py-4 px-6 text-left">
                    <p className="font-extrabold text-zinc-900 line-clamp-1">{c.title}</p>
                    <span className="text-[10px] text-zinc-450 font-medium block pt-0.5">Budget: {c.budget}</span>
                  </td>
                  <td className="py-4 px-6 text-left border-l border-zinc-100">
                    <span className="text-[10px] font-black text-indigo-650 uppercase tracking-wider">{c.category}</span>
                  </td>
                  <td className="py-4 px-6 text-left border-l border-zinc-100 text-zinc-500 font-bold">{c.company}</td>
                  <td className="py-4 px-6 text-center border-l border-zinc-100">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        c.status === 'APPROVED' || c.status === 'OPEN'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : c.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center border-l border-zinc-100">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleApprove(c.id, 'APPROVED')}
                        className="py-1 px-2.5 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApprove(c.id, 'REJECTED')}
                        className="py-1 px-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleToggleFeature(c.id)}
                        className="p-1.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-500 rounded-lg focus:outline-none transition-colors cursor-pointer"
                        title="Feature this challenge"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                    </div>
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
