'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentProfile, Challenge, Proposal, Notification, Badge } from '@/types/studentPortal';
import { StudentService } from '@/services/studentService';
import { ChallengeService } from '@/services/challengeService';
import { ProposalService } from '@/services/proposalService';
import { NotificationService } from '@/services/notificationService';
import { DashboardError } from '@/components/DashboardError';
import { StatusBadge } from '@/components/student/StatusBadge';
import { 
  FileText, Bookmark, Trophy, Calendar, Bell, ArrowRight, Zap, 
  User, CheckCircle, ChevronRight, Award, MessageSquare, BookOpen, Clock, ShieldCheck, HelpCircle, Star, Sparkles
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 22 } }
};

export default function StudentDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Calendar dates generation
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [profData, chData, prData, notData, lbData, badgeData] = await Promise.all([
          StudentService.getProfile(),
          ChallengeService.getChallenges(),
          ProposalService.getProposals(),
          NotificationService.getNotifications(),
          StudentService.getLeaderboard(),
          StudentService.getBadges()
        ]);
        setProfile(profData);
        setChallenges(chData.filter((c) => c.status === 'OPEN').slice(0, 3));
        setProposals(prData.slice(0, 4));
        setNotifications(notData.slice(0, 4));
        setLeaderboard(lbData);
        setBadges(badgeData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Unable to fetch student workspace. Please verify backend connection.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [retryCount]);

  if (error) {
    return <DashboardError message={error} onRetry={() => setRetryCount((c) => c + 1)} />;
  }

  if (isLoading || !profile) {
    return (
      <div className="space-y-6 text-left pb-10 select-none animate-pulse">
        {/* Welcome Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-zinc-200 rounded-3xl h-52" />
          <div className="bg-zinc-200 rounded-3xl h-52" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-150 rounded-2xl h-24" />
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-200 rounded-3xl h-48" />
            <div className="bg-zinc-200 rounded-3xl h-48" />
          </div>
          <div className="space-y-6">
            <div className="bg-zinc-200 rounded-3xl h-48" />
            <div className="bg-zinc-200 rounded-3xl h-48" />
          </div>
        </div>
      </div>
    );
  }

  const getProposalCount = (statusType: string) => {
    return proposals.filter((p) => p.status === statusType).length;
  };

  // Check if calendar day has a deadline
  const getDeadlineForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return challenges.find(c => {
      if (!c.deadline) return false;
      const chDate = new Date(c.deadline);
      return chDate.getFullYear() === currentYear && chDate.getMonth() === currentMonth && chDate.getDate() === day;
    });
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 text-left pb-16 select-none font-sans bg-zinc-50/10"
    >
      {/* 1. Welcome Banner Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          variants={cardVariants}
          className="lg:col-span-2 bg-gradient-to-br from-zinc-950 via-zinc-900 to-violet-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[240px] shadow-xl border border-white/5"
        >
          <div className="absolute top-[-30%] right-[-10%] w-80 h-80 rounded-full bg-violet-650/20 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-70 h-70 rounded-full bg-indigo-650/15 blur-[90px]" />
          
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black tracking-wider uppercase text-violet-300 backdrop-blur-md border border-white/10">
              <Zap className="w-3.5 h-3.5 text-violet-400" /> Student Innovation Workspace
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-200">
                {profile.name}
              </span>!
            </h1>
            <p className="text-zinc-400 text-xs font-medium max-w-md leading-relaxed">
              Explore open industrial briefs, configure co-solving project teams, and submit your technical proposal drafts live.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => router.push('/challenges')}
              className="py-2.5 px-4.5 bg-white hover:bg-neutral-100 text-zinc-950 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-[0.98] focus:outline-none"
            >
              Browse Open Challenges <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="py-2.5 px-4.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-all backdrop-blur-sm cursor-pointer border border-white/10 focus:outline-none"
            >
              My Portfolio
            </button>
          </div>
        </motion.div>

        {/* Level and XP Badge card */}
        <motion.div 
          variants={cardVariants}
          className="bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-zinc-200 shadow-lg flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-[-30%] right-[-30%] w-48 h-48 rounded-full bg-violet-500/5 blur-[50px]" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Level Index</span>
              <span className="px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 font-extrabold text-[10px] border border-violet-100">
                Level {profile.level}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={profile.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'}
                  alt="avatar"
                  className="w-12 h-12 rounded-2xl object-cover border border-zinc-150"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-650 text-white rounded-full flex items-center justify-center text-[9px] font-black border border-white shadow-sm">
                  {profile.level}
                </span>
              </div>
              <div className="text-left leading-tight">
                <h3 className="text-sm font-extrabold text-zinc-950">{profile.name}</h3>
                <span className="text-[10px] text-zinc-400 font-semibold">{profile.email}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between text-xs font-bold text-zinc-500">
                <span>XP Progress</span>
                <span className="text-violet-600">{profile.completionPercentage}%</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2">
                <div 
                  className="bg-violet-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${profile.completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-zinc-100 flex items-center justify-between text-xs">
            <div className="text-left">
              <span className="text-[9px] text-zinc-400 uppercase font-black tracking-wider">Accrued Points</span>
              <p className="text-sm font-black text-zinc-950">{profile.points} XP</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-zinc-400 uppercase font-black tracking-wider">Ecosystem Rank</span>
              <p className="text-sm font-black text-zinc-950">#{profile.rank}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. KPI statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={cardVariants} className="p-5 bg-white border border-zinc-200 rounded-3xl text-left space-y-2.5 shadow-sm relative hover:shadow-md transition-shadow">
          <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 border border-violet-100">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Active Briefs</span>
            <p className="text-2xl font-black text-zinc-950 mt-0.5">{challenges.length}</p>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="p-5 bg-white border border-zinc-200 rounded-3xl text-left space-y-2.5 shadow-sm relative hover:shadow-md transition-shadow">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
            <FileText className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Submitted proposals</span>
            <p className="text-2xl font-black text-zinc-950 mt-0.5">{proposals.length}</p>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="p-5 bg-white border border-zinc-200 rounded-3xl text-left space-y-2.5 shadow-sm relative hover:shadow-md transition-shadow">
          <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">In Review Cycle</span>
            <p className="text-2xl font-black text-zinc-950 mt-0.5">
              {getProposalCount('UNDER_REVIEW') + getProposalCount('SUBMITTED')}
            </p>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="p-5 bg-white border border-zinc-200 rounded-3xl text-left space-y-2.5 shadow-sm relative hover:shadow-md transition-shadow">
          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
            <Trophy className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Approved Solutions</span>
            <p className="text-2xl font-black text-zinc-950 mt-0.5">{getProposalCount('ACCEPTED')}</p>
          </div>
        </motion.div>
      </div>

      {/* 3. Lower layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side (Recommended Challenges & Recent Proposals) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Announcements Marquee */}
          <div className="bg-violet-50/70 border border-violet-100 rounded-2xl px-4 py-3 flex items-center gap-2 overflow-hidden">
            <span className="px-2 py-0.5 rounded bg-violet-600 text-white font-extrabold text-[9px] uppercase tracking-wider shrink-0">Live</span>
            <div className="text-xs font-semibold text-violet-850 animate-pulse truncate">
              📢 Innovation seed funding deadlines are extended to July 30th. Check templates inside Resources.
            </div>
          </div>

          {/* Recommended Briefs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-zinc-950 tracking-tight flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-violet-600" /> Recommended Challenges
              </h2>
              <button
                onClick={() => router.push('/challenges')}
                className="text-xs font-black text-violet-600 hover:text-violet-750 flex items-center gap-0.5 transition-colors cursor-pointer border-0 bg-transparent"
              >
                Explore all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {challenges.map((c) => (
                <motion.div
                  key={c.id}
                  onClick={() => router.push(`/challenges/${c.id}`)}
                  whileHover={{ y: -4 }}
                  className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-zinc-300 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between text-left space-y-3 shadow-sm"
                >
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-650 font-extrabold text-[9px] uppercase tracking-wider">
                      {c.category}
                    </span>
                    <h3 className="text-sm font-extrabold text-zinc-950 leading-snug line-clamp-2">{c.title}</h3>
                    <p className="text-[11px] text-zinc-500 line-clamp-2 font-medium leading-relaxed">{c.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-50 text-[10px] text-zinc-400 font-bold">
                    <span>{c.companyName}</span>
                    <span className="text-violet-600 font-black">{c.difficulty}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Proposals Pipeline */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="text-base font-black text-zinc-950 tracking-tight flex items-center gap-1.5">
                <FileText className="w-4.5 h-4.5 text-violet-600" /> Recent Proposals Pipeline
              </h2>
              <button
                onClick={() => router.push('/proposals')}
                className="text-xs font-black text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer border-0 bg-transparent"
              >
                Track history
              </button>
            </div>

            {proposals.length === 0 ? (
              <div className="py-12 text-center space-y-2.5">
                <p className="text-xs text-zinc-500 font-medium">You haven't drafted any solutions yet.</p>
                <button
                  onClick={() => router.push('/challenges')}
                  className="py-2 px-4 bg-violet-600 text-white rounded-xl text-[10px] font-bold hover:bg-violet-750 transition-colors cursor-pointer"
                >
                  Browse Challenges
                </button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {proposals.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/proposals/${p.id}`)}
                    className="flex items-center justify-between py-3.5 hover:bg-zinc-50/50 rounded-xl px-2.5 transition-all cursor-pointer"
                  >
                    <div className="text-left space-y-1">
                      <p className="text-xs font-extrabold text-zinc-950 line-clamp-1">{p.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold">
                        <span>{p.companyName}</span>
                        <span>•</span>
                        <span>{new Date(p.submissionDate).toLocaleDateString()}</span>
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

        {/* Right Side (Leaderboard, Calendar, Achievements) */}
        <div className="space-y-6">
          {/* Achievements Badges */}
          {badges.length > 0 && (
            <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm space-y-3.5">
              <div className="flex items-center gap-1.5 border-b border-zinc-100 pb-2.5">
                <Trophy className="w-4 h-4 text-violet-600" />
                <h2 className="text-xs font-black text-zinc-950 uppercase tracking-wider">Unlocked Badges</h2>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {badges.map((b) => (
                  <div 
                    key={b.id} 
                    className="aspect-square rounded-2xl bg-zinc-50 border border-zinc-150 flex items-center justify-center text-xl hover:bg-violet-50 hover:border-violet-200 transition-all cursor-help relative group"
                    title={`${b.title}: ${b.description}`}
                  >
                    <span>{b.icon}</span>
                    <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-zinc-900 text-white text-[10px] rounded-lg shadow-lg z-30 leading-snug">
                      <p className="font-extrabold">{b.title}</p>
                      <p className="text-zinc-300 mt-0.5">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Widget */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-violet-600" />
                <h2 className="text-xs font-black text-zinc-950 uppercase tracking-wider">
                  {today.toLocaleString('default', { month: 'long' })} {currentYear}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-black text-zinc-400">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="py-1">{day}</div>
              ))}
              {/* Padding for first day index */}
              {[...Array(firstDayIndex)].map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {/* Days in Month */}
              {[...Array(daysInMonth)].map((_, i) => {
                const day = i + 1;
                const deadlineInfo = getDeadlineForDay(day);
                const isToday = day === today.getDate();
                return (
                  <div 
                    key={`day-${day}`}
                    className={`py-1.5 rounded-lg text-[10px] font-extrabold flex flex-col items-center relative group ${
                      isToday ? 'bg-violet-650 text-white font-black' : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{day}</span>
                    {deadlineInfo && (
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full absolute bottom-1" />
                    )}
                    {deadlineInfo && (
                      <div className="absolute bottom-full mb-2 hidden group-hover:block w-40 p-2 bg-zinc-900 text-white text-[10px] rounded-lg shadow-lg z-30 leading-snug">
                        <p className="font-extrabold text-rose-400">Deadline</p>
                        <p className="text-zinc-200 mt-0.5 truncate">{deadlineInfo.title}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-violet-600" />
                <h2 className="text-xs font-black text-zinc-950 uppercase tracking-wider">Top Performers</h2>
              </div>
              <span className="text-[10px] text-zinc-400 font-bold">Global Rank</span>
            </div>

            <div className="space-y-3">
              {leaderboard.slice(0, 4).map((entry, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-xl border ${
                    entry.isMe 
                      ? 'bg-violet-50/50 border-violet-200' 
                      : 'bg-zinc-50/30 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-extrabold text-zinc-400 w-4">{entry.rank}</span>
                    <img src={entry.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} className="w-7 h-7 rounded-lg object-cover" alt="" />
                    <div className="text-left leading-tight">
                      <p className="text-xs font-bold text-zinc-950">{entry.name}</p>
                      <span className="text-[9px] text-zinc-400 font-semibold">{entry.institution}</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-zinc-700">{entry.points} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines List */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-zinc-100 pb-2.5">
              <Calendar className="w-4 h-4 text-violet-600" />
              <h2 className="text-xs font-black text-zinc-950 uppercase tracking-wider">Critical Deadlines</h2>
            </div>
            <div className="space-y-3.5 text-left">
              {challenges.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-zinc-800 line-clamp-1">{c.title}</p>
                    <span className="text-[9px] text-zinc-450 font-black uppercase mt-0.5 block">
                      {c.deadline ? new Date(c.deadline).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
