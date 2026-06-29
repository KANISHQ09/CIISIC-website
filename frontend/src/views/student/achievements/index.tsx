'use client';

import React, { useEffect, useState } from 'react';
import { StudentProfile } from '@/types/studentPortal';
import { StudentService } from '@/services/studentService';
import { Trophy, Award, Zap, ShieldCheck, Flame, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  rank: number;
  name: string;
  college: string;
  points: number;
  badgeCount: number;
}

export default function AchievementsLeaderboard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock Leaderboard List
  const leaderboardList: LeaderboardEntry[] = [
    { rank: 1, name: 'Ayush Sharma', college: 'SATI Vidisha', points: 2840, badgeCount: 9 },
    { rank: 2, name: 'Ritu Rajawat', college: 'UIT RGPV Bhopal', points: 2610, badgeCount: 8 },
    { rank: 3, name: 'Madhavan Singh', college: 'LNCT Bhopal', points: 2450, badgeCount: 7 }, // logged in student
    { rank: 4, name: 'Nikita Agrawal', college: 'IPS Academy Indore', points: 2200, badgeCount: 6 },
    { rank: 5, name: 'Rahul Chaurasia', college: 'MITS Gwalior', points: 1980, badgeCount: 5 }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const item = await StudentService.getProfile();
        setProfile(item);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-violet-600 animate-spin" />
      </div>
    );
  }

  const badges = [
    {
      id: 'b1',
      title: 'Pioneer Solver',
      desc: 'Submitted initial industrial challenge proposal',
      icon: <Award className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-150',
      unlocked: true
    },
    {
      id: 'b2',
      title: 'Endorsed Candidate',
      desc: 'Academic verification checklist completed',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-150',
      unlocked: true
    },
    {
      id: 'b3',
      title: 'Tech Prodigy',
      desc: 'Earned 2,000 reputation XP points',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-150',
      unlocked: true
    },
    {
      id: 'b4',
      title: 'Industrial Innovator',
      desc: 'Proposal accepted by corporate sponsor',
      icon: <Star className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50 border-rose-150',
      unlocked: false
    }
  ];

  return (
    <div className="space-y-6 text-left pb-12 select-none">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Achievements & Ranks</h1>
        <p className="text-sm text-zinc-500 font-medium">Review credentials, unlocked badges, and public leaderboard ranks</p>
      </div>

      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-tr from-violet-600 to-indigo-600 text-white rounded-3xl space-y-2 shadow-md relative overflow-hidden">
          <Sparkles className="w-20 h-20 text-white/5 absolute right-[-10px] bottom-[-10px]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-200">Total Reputation</span>
          <h3 className="text-3xl font-black">{profile.points} XP</h3>
          <p className="text-xs text-violet-100 font-medium">Keep solving briefs to level up!</p>
        </div>

        <div className="p-6 bg-white border border-zinc-150 rounded-3xl space-y-2 shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Global Leaderboard Rank</span>
          <h3 className="text-3xl font-black text-zinc-900">#{profile.rank}</h3>
          <p className="text-xs text-zinc-500 font-medium">Top 5% of active students</p>
        </div>

        <div className="p-6 bg-white border border-zinc-150 rounded-3xl space-y-2 shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Badges Unlocked</span>
          <h3 className="text-3xl font-black text-zinc-900">
            {badges.filter((b) => b.unlocked).length} <span className="text-sm font-semibold text-zinc-400">/ {badges.length}</span>
          </h3>
          <p className="text-xs text-zinc-500 font-medium">Unlock credentials by solving briefs</p>
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: badges list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Unlocked Badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                  b.unlocked ? 'bg-white border-zinc-150 hover:border-zinc-250 shadow-sm' : 'bg-zinc-50/50 border-zinc-100 opacity-60'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${b.unlocked ? b.bg : 'bg-zinc-100 border-zinc-200 text-zinc-400'}`}
                >
                  {b.icon}
                </div>
                <div className="text-left space-y-1">
                  <h4 className="text-sm font-extrabold text-zinc-800">{b.title}</h4>
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">{b.desc}</p>
                  {!b.unlocked && (
                    <span className="inline-block text-[8px] font-bold text-zinc-400 bg-zinc-100 border border-zinc-200 rounded px-1.5 py-0.2 uppercase tracking-wider mt-1.5">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col: Leaderboard list */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Public Leaderboard</h2>
          <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm divide-y divide-zinc-100">
            {leaderboardList.map((item) => {
              const isSelf = item.name === profile.name;
              return (
                <div
                  key={item.rank}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors ${isSelf ? 'bg-violet-50/20' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                        item.rank === 1
                          ? 'bg-amber-100 text-amber-800'
                          : item.rank === 2
                            ? 'bg-zinc-100 text-zinc-800'
                            : item.rank === 3
                              ? 'bg-violet-100 text-violet-800 font-bold border border-violet-200'
                              : 'text-zinc-400'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <div className="text-left leading-tight">
                      <p className={`text-xs ${isSelf ? 'font-extrabold text-violet-900' : 'font-bold text-zinc-800'}`}>
                        {item.name}{' '}
                        {isSelf && (
                          <span className="text-[9px] font-extrabold bg-violet-100 text-violet-700 px-1 py-0.2 rounded uppercase ml-1">
                            You
                          </span>
                        )}
                      </p>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{item.college}</span>
                    </div>
                  </div>
                  <div className="text-right leading-tight">
                    <p className="text-xs font-black text-zinc-900">{item.points} XP</p>
                    <span className="text-[9px] text-zinc-400 font-medium">{item.badgeCount} badges</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
