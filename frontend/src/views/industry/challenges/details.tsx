'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChallengeManagement } from '@/types/industryPortal';
import { ChallengeManagementService } from '@/services/challengeManagementService';
import { ProposalReviewService } from '@/services/proposalReviewService';
import { StatusBadge } from '@/components/student/StatusBadge';
import { ArrowLeft, Building, Calendar, Clock, ArrowRight, ShieldCheck, FolderOpen } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { Proposal } from '@/types/studentPortal';

export default function ChallengeDetails() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const challengeId = params?.id as string;
  const [challenge, setChallenge] = useState<ChallengeManagement | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetails = async () => {
    if (!challengeId) return;
    setIsLoading(true);
    try {
      const item = await ChallengeManagementService.getChallengeById(challengeId);
      setChallenge(item || null);

      const allProposals = await ProposalReviewService.getProposalsToReview();
      setProposals(allProposals.filter((p) => p.challengeId === challengeId));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [challengeId]);

  const handleUpdateStatus = async (status: 'PUBLISHED' | 'CLOSED' | 'ARCHIVED') => {
    if (!challenge) return;
    const updated = await ChallengeManagementService.updateChallenge(challenge.id, { status });
    if (updated) {
      setChallenge(updated);
      showToast(`Challenge status set to ${status}!`, 'success');
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-zinc-500 font-bold">Challenge brief not found.</p>
        <button onClick={() => router.push('/challenges')} className="text-xs text-blue-600 hover:underline">
          Go back to registry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Back link */}
      <button
        onClick={() => router.push('/challenges')}
        className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer focus:outline-none"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to registry
      </button>

      {/* Hero Header */}
      <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">ID: {challenge.id.toUpperCase()}</span>
            <span>•</span>
            <StatusBadge status={challenge.status} />
          </div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight leading-tight">{challenge.title}</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">{challenge.category}</p>
        </div>

        {/* Change status action */}
        <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
          {challenge.status === 'DRAFT' && (
            <button
              onClick={() => handleUpdateStatus('PUBLISHED')}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Publish Challenge
            </button>
          )}
          {challenge.status === 'PUBLISHED' && (
            <button
              onClick={() => handleUpdateStatus('CLOSED')}
              className="py-2.5 px-4 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Close Challenge
            </button>
          )}
          {challenge.status !== 'ARCHIVED' && (
            <button
              onClick={() => handleUpdateStatus('ARCHIVED')}
              className="py-2.5 px-4 border border-zinc-200 hover:bg-zinc-50 text-zinc-500 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Archive
            </button>
          )}
        </div>
      </div>

      {/* Split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Submission Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Review submission queue</h2>

            {proposals.length === 0 ? (
              <div className="py-12 text-center border border-zinc-100 border-dashed rounded-2xl bg-zinc-50/20 text-zinc-400 font-bold text-xs space-y-2">
                <FolderOpen className="w-8 h-8 mx-auto text-zinc-300" />
                <p>No student solutions submitted for this brief yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
                {proposals.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/proposals/${p.id}`)}
                    className="py-4 flex items-center justify-between hover:bg-zinc-50/50 px-2 rounded-xl transition-all cursor-pointer text-left"
                  >
                    <div className="space-y-1">
                      <p className="font-extrabold text-zinc-900 text-sm">{p.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold">
                        <span>Submitted {new Date(p.submissionDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Version {p.versionHistory.length}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={p.status} />
                      <button className="p-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: details stats */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Brief Metadata</h3>
            <div className="space-y-3.5 text-xs text-zinc-600 font-semibold text-left">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>Date Created: {new Date(challenge.dateCreated).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span>Total Solvers: {challenge.submissionsCount}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-zinc-400" />
                <span>Evaluation Status: {challenge.pendingCount > 0 ? `${challenge.pendingCount} Awaiting review` : 'All caught up'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
