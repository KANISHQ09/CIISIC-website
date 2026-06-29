'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProposalService } from '@/services/proposalService';
import { Proposal } from '@/types/studentPortal';
import { ArrowLeft, ShieldCheck, Download, Calendar, Layers, BookOpen } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function ProposalDetailsMonitor() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      ProposalService.getProposalById(params.id as string).then((data) => {
        setProposal(data || null);
        setIsLoading(false);
      });
    }
  }, [params.id]);

  const handleDownload = () => {
    showToast('Proposal abstract PDF downloaded successfully.', 'success');
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="py-12 text-center text-zinc-500">
        <p className="text-sm font-bold">Proposal audit file not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
        <button
          onClick={() => router.push('/proposals')}
          className="p-2 border border-zinc-200 hover:bg-zinc-50 text-zinc-650 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider block">Admin Proposal Audit</span>
          <h1 className="text-xl font-black text-zinc-950">{proposal.title}</h1>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail specs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider border-b border-zinc-50 pb-3">
              Technical Solution Spec
            </h3>
            <p className="text-xs text-zinc-600 font-semibold leading-relaxed whitespace-pre-line">{proposal.abstract}</p>

            <div className="pt-4 border-t border-zinc-100 flex flex-wrap gap-4">
              <button
                onClick={handleDownload}
                className="py-2 px-4 border border-zinc-200 hover:bg-zinc-50 text-zinc-650 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Abstract PDF
              </button>
            </div>
          </div>
        </div>

        {/* Audit status panel */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider border-b border-zinc-50 pb-3">Audit Logs</h3>
            <div className="space-y-4 text-xs font-semibold text-zinc-650">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-400" />
                <span>
                  Solver Group: <span className="text-zinc-950 font-bold">{proposal.solverName}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>
                  Status: <span className="text-zinc-950 font-bold uppercase">{proposal.status}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
