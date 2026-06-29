'use client';

import React, { useState, useEffect } from 'react';
import { ReviewerService } from '@/services/reviewerService';
import { Proposal } from '@/types/studentPortal';
import { Search, FileSpreadsheet, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReviewerProposals() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ReviewerService.getAssignedProposals().then((data) => {
      setProposals(data);
      setIsLoading(false);
    });
  }, []);

  const filtered = proposals.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Assigned Review Queues</h1>
        <p className="text-sm text-zinc-500 font-medium">Evaluate industrial solution papers and post technical reviews comments</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-zinc-100 pb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assigned proposals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-800"
          />
        </div>
      </div>

      {/* Grid list of assigned proposals */}
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm divide-y divide-zinc-100">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/proposals/${p.id}`)}
              className="p-5 hover:bg-zinc-50/30 transition-colors flex items-center justify-between gap-4 cursor-pointer text-left"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center shrink-0 mt-0.5">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="space-y-1 leading-tight">
                  <p className="font-extrabold text-zinc-900 text-sm">{p.title}</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    Group: {p.studentName} • Submitted: {new Date(p.submissionDate).toLocaleDateString()}
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 mt-1.5 rounded text-[8px] font-black uppercase border ${
                      p.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}
                  >
                    Status: {p.status}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-zinc-300" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
