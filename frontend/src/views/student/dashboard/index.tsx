'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { StudentProfile, Challenge, Proposal, Notification } from '@/types/studentPortal';
import { StudentService } from '@/services/studentService';
import { ChallengeService } from '@/services/challengeService';
import { ProposalService } from '@/services/proposalService';
import { NotificationService } from '@/services/notificationService';
import { StatsCard } from '@/components/student/StatsCard';
import { ChallengeCard } from '@/components/student/ChallengeCard';
import { ProgressBar } from '@/components/student/ProgressBar';
import { StatusBadge } from '@/components/student/StatusBadge';
import { FileText, Bookmark, Trophy, Calendar, Bell, ArrowRight, TrendingUp, Award, Zap } from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profData, chData, prData, notData] = await Promise.all([
          StudentService.getProfile(),
          ChallengeService.getChallenges(),
          ProposalService.getProposals(),
          NotificationService.getNotifications()
        ]);
        setProfile(profData);
        setChallenges(chData.filter((c) => c.status === 'OPEN').slice(0, 2));
        setProposals(prData);
        setNotifications(notData.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-10">
      {/* Top Welcome Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome message */}
        <div className="md:col-span-2 bg-gradient-to-tr from-zinc-900 via-neutral-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[200px] shadow-lg">
          <div className="absolute top-[-20%] right-[-10%] w-60 h-60 rounded-full bg-violet-600/10 blur-[80px]" />
          <div className="space-y-2 relative z-10">
            <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase text-violet-300">
              Candidate Workspace
            </span>
            <h1 className="text-3xl font-black tracking-tight leading-none mt-1">
              Welcome back,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-200">{profile.name}</span>!
            </h1>
            <p className="text-zinc-400 text-xs font-medium max-w-sm leading-relaxed">
              Academic-Industrial collaboration portal. Browse open innovation briefs from CII corporate sponsors and draft your solutions.
            </p>
          </div>
          <div className="relative z-10 flex gap-4 mt-4">
            <button
              onClick={() => router.push('/challenges')}
              className="py-2.5 px-4 bg-white text-zinc-950 hover:bg-neutral-100 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
            >
              Explore Challenges <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="py-2.5 px-4 bg-white/10 text-white hover:bg-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              My Profile
            </button>
          </div>
        </div>

        {/* Profile completion card */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-150 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Verification Level</span>
              <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 font-extrabold text-[10px]">Level {profile.level}</span>
            </div>
            <h3 className="text-lg font-extrabold text-zinc-900">Ecosystem Credential</h3>
            <p className="text-xs text-zinc-500 font-medium leading-relaxed">
              Complete your student profile with portfolio coordinates and resume uploads to receive Excellence Cell endorsement.
            </p>
          </div>
          <div className="mt-4 pt-2">
            <ProgressBar value={profile.completionPercentage} />
          </div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Active Proposals"
          value={proposals.length}
          icon={<FileText className="w-5 h-5" />}
          description="In review cycle"
        />
        <StatsCard
          label="Reputation Points"
          value={profile.points}
          icon={<Zap className="w-5 h-5" />}
          trend={{ value: '+120 XP ', positive: true }}
        />
        <StatsCard label="Saved Briefs" value="1" icon={<Bookmark className="w-5 h-5" />} description="Bookmarked briefs" />
        <StatsCard label="Public Leaderboard" value={`#${profile.rank}`} icon={<Trophy className="w-5 h-5" />} description="Global rank" />
      </div>

      {/* Lower grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: recommended challenges & active proposals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended challenges */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Recommended Challenges</h2>
              <button
                onClick={() => router.push('/challenges')}
                className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {challenges.map((c) => (
                <ChallengeCard
                  key={c.id}
                  challenge={c}
                  isBookmarked={c.id === 'ch1'}
                  onBookmarkToggle={() => showToast('Bookmark toggled', 'info')}
                />
              ))}
            </div>
          </div>

          {/* Active proposals */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Active Submissions</h2>
              <button
                onClick={() => router.push('/proposals')}
                className="text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                History
              </button>
            </div>
            {proposals.length === 0 ? (
              <p className="text-xs text-zinc-400 py-6 text-center">No active submissions found.</p>
            ) : (
              <div className="divide-y divide-zinc-50">
                {proposals.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-3.5 hover:bg-zinc-50/50 rounded-xl px-2 transition-all cursor-pointer"
                    onClick={() => router.push(`/proposals/${p.id}`)}
                  >
                    <div className="text-left space-y-1">
                      <p className="text-sm font-extrabold text-zinc-900 line-clamp-1">{p.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold">
                        <span>{p.companyName}</span>
                        <span>•</span>
                        <span>Submitted {new Date(p.submissionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right col: deadlines, calendar widget, notifications */}
        <div className="space-y-6">
          {/* Mini Announcements list */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Bell className="w-4 h-4 text-violet-600" />
              <h2 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Ecosystem Updates</h2>
            </div>
            <div className="space-y-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => router.push('/notifications')}
                  className="space-y-1 text-left cursor-pointer group pb-3 last:pb-0 border-b border-zinc-50 last:border-0"
                >
                  <p className="text-xs font-bold text-zinc-800 group-hover:text-violet-600 transition-colors line-clamp-1">{n.title}</p>
                  <p className="text-[11px] text-zinc-400 font-medium line-clamp-2 leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stepper Deadlines */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Calendar className="w-4 h-4 text-violet-600" />
              <h2 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Deadlines</h2>
            </div>
            <div className="space-y-4 text-left">
              <div className="flex gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-zinc-800">Smart Hydration Solution</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">July 15, 2026</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-zinc-800">Billing Tenant Architecture</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">July 25, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
