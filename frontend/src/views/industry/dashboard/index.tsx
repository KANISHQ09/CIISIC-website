'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { IndustryService } from '@/services/industryService';
import { ChallengeManagementService } from '@/services/challengeManagementService';
import { ProposalReviewService } from '@/services/proposalReviewService';
import { StatsCard } from '@/components/industry/StatsCard';
import { FileText, BookmarkCheck, Zap, Building, PlusCircle, ArrowRight, TrendingUp, Clock, Briefcase } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { ChallengeManagement } from '@/types/industryPortal';
import { Proposal } from '@/types/studentPortal';

export default function IndustryDashboard() {
  const router = useRouter();
  const { showToast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [challenges, setChallenges] = useState<ChallengeManagement[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, chData, prData] = await Promise.all([
          IndustryService.getDashboardStats(),
          ChallengeManagementService.getChallenges(),
          ProposalReviewService.getProposalsToReview()
        ]);
        setStats(statsData);
        setChallenges(chData.slice(0, 3));
        setProposals(prData.filter((p) => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-tr from-slate-900 via-zinc-900 to-blue-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="absolute top-[-30%] right-[-10%] w-64 h-64 rounded-full bg-blue-600/10 blur-[80px]" />

        <div className="space-y-2 relative z-10 max-w-lg">
          <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase text-blue-300">
            Corporate Partner Workspace
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mt-1.5">Netlink Innovation Center</h1>
          <p className="text-slate-400 text-xs font-medium leading-relaxed">
            Review submitted student solution briefs, evaluate criteria indices, and post revision requests.
          </p>
        </div>

        <div className="relative z-10 shrink-0 self-start md:self-center">
          <button
            onClick={() => router.push('/challenges/create')}
            className="py-3 px-5 bg-white text-slate-950 hover:bg-neutral-100 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" /> Create Challenge
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Briefs"
          value={challenges.length}
          icon={<Briefcase className="w-5 h-5" />}
          description="Ecosystem challenges"
        />
        <StatsCard
          label="Total Solutions"
          value={stats.totalSubmissions}
          icon={<FileText className="w-5 h-5" />}
          trend={{ value: '+4 new ', positive: true }}
        />
        <StatsCard label="Pending Review" value={proposals.length} icon={<Clock className="w-5 h-5" />} description="Action required" />
        <StatsCard
          label="Shortlisted Solutions"
          value={stats.shortlistedCandidates}
          icon={<BookmarkCheck className="w-5 h-5" />}
          description="Top tier solvers"
        />
      </div>

      {/* Split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Pending Review Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-zinc-900 tracking-tight">Review queue</h2>
                <p className="text-[11px] text-zinc-400 font-bold uppercase mt-0.5">Needs SPOC Evaluation</p>
              </div>
              <button
                onClick={() => router.push('/proposals')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                Go to Review Center <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {proposals.length === 0 ? (
              <p className="text-xs text-zinc-400 py-8 text-center">No proposals awaiting review.</p>
            ) : (
              <div className="divide-y divide-zinc-50">
                {proposals.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/proposals/${p.id}`)}
                    className="py-3 flex items-center justify-between hover:bg-zinc-50/50 px-2 rounded-xl transition-all cursor-pointer"
                  >
                    <div className="text-left leading-tight space-y-1">
                      <p className="text-xs font-extrabold text-zinc-800 line-clamp-1">{p.title}</p>
                      <p className="text-[10px] text-zinc-400 font-bold">Challenge: {p.challengeTitle}</p>
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[9px] uppercase tracking-wider border border-blue-100">
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active corporate challenges list */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-zinc-900 tracking-tight">Active Challenge Registry</h2>
                <p className="text-[11px] text-zinc-400 font-bold uppercase mt-0.5">Manage published briefs</p>
              </div>
              <button
                onClick={() => router.push('/challenges')}
                className="text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {challenges.map((c) => (
                <div
                  key={c.id}
                  onClick={() => router.push(`/challenges/${c.id}`)}
                  className="p-4 border border-zinc-100 hover:border-blue-200 rounded-2xl flex items-center justify-between gap-4 transition-all cursor-pointer"
                >
                  <div className="text-left leading-tight space-y-1">
                    <p className="text-xs font-extrabold text-zinc-800">{c.title}</p>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{c.category}</span>
                  </div>
                  <div className="text-right leading-tight">
                    <p className="text-xs font-black text-zinc-800">{c.submissionsCount} Solvers</p>
                    <span className="text-[10px] text-zinc-400 font-bold">{c.pendingCount} pending review</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col: Activities, announcements */}
        <div className="space-y-6">
          {/* Recent activity feeds */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <TrendingUp className="w-4.5 h-4.5 text-blue-600" />
              <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-widest">Audit Activity Log</h3>
            </div>

            <div className="space-y-4 text-left">
              {stats.recentActivity.map((act: any) => (
                <div key={act.id} className="space-y-1 pb-3 border-b border-zinc-50 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[9px] font-bold">
                    <span className="text-blue-600 uppercase tracking-wider">{act.type}</span>
                    <span className="text-zinc-400">
                      {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-zinc-800">{act.title}</p>
                  <p className="text-[11px] text-zinc-400 font-medium leading-normal">{act.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick sector coordinates stats */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-widest">Active Sectors</h3>
            <div className="flex flex-wrap gap-1.5">
              {stats.metrics.activeSectors.map((sec: string) => (
                <span
                  key={sec}
                  className="px-2.5 py-1 bg-blue-50/50 text-blue-700 rounded-lg text-[10px] font-bold border border-blue-100 uppercase tracking-wider"
                >
                  {sec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
