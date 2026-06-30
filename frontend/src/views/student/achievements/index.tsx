'use client';

import React, { useEffect, useState } from 'react';
import { StudentProfile, Badge, LeaderboardEntry } from '@/types/studentPortal';
import { StudentService } from '@/services/studentService';
import { Trophy, Award, Zap, ShieldCheck, Star, Sparkles, AlertCircle } from 'lucide-react';

export default function AchievementsLeaderboard() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [profData, badgeData, lbData] = await Promise.all([
          StudentService.getProfile(),
          StudentService.getBadges(),
          StudentService.getLeaderboard()
        ]);
        setProfile(profData);
        setBadges(badgeData);
        setLeaderboard(lbData);
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

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case '🏆': return <Award className="w-5 h-5 text-indigo-600" />;
      case '⚡': return <Zap className="w-5 h-5 text-amber-600" />;
      default: return <Star className="w-5 h-5 text-rose-600" />;
    }
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
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
            {badges.length} <span className="text-sm font-semibold text-zinc-400">/ 3</span>
          </h3>
          <p className="text-xs text-zinc-500 font-medium">Unlock credentials by solving briefs</p>
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: badges list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Unlocked Badges</h2>
          {badges.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-zinc-200 bg-white rounded-2xl flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-8 h-8 text-zinc-350" />
              <p className="text-xs font-semibold text-zinc-500">Submit a proposal to unlock your first industrial badge!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl border bg-white border-zinc-150 hover:border-zinc-250 shadow-sm flex items-start gap-4 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 bg-violet-50 border-violet-150 text-violet-600">
                    {getBadgeIcon(b.icon)}
                  </div>
                  <div className="text-left space-y-1">
                    <h4 className="text-sm font-extrabold text-zinc-800">{b.title}</h4>
                    <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">{b.description}</p>
                    <span className="inline-block text-[8px] font-bold text-violet-600 bg-violet-50 border border-violet-100 rounded px-1.5 py-0.2 uppercase tracking-wider mt-1.5">
                      Unlocked
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right col: Leaderboard list */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">Public Leaderboard</h2>
          <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm divide-y divide-zinc-100">
            {leaderboard.map((item) => (
              <div
                key={item.rank}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${item.isMe ? 'bg-violet-50/20' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      item.rank === 1
                        ? 'bg-amber-100 text-amber-800'
                        : item.rank === 2
                          ? 'bg-zinc-100 text-zinc-800'
                          : item.isMe
                            ? 'bg-violet-100 text-violet-850 font-bold border border-violet-200'
                            : 'text-zinc-400'
                    }`}
                  >
                    {item.rank}
                  </span>
                  <div className="text-left leading-tight">
                    <p className={`text-xs ${item.isMe ? 'font-extrabold text-violet-900' : 'font-bold text-zinc-800'}`}>
                      {item.name}{' '}
                      {item.isMe && (
                        <span className="text-[9px] font-extrabold bg-violet-105 text-violet-700 px-1 py-0.2 rounded uppercase ml-1">
                          You
                        </span>
                      )}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{item.institution}</span>
                  </div>
                </div>
                <div className="text-right leading-tight">
                  <p className="text-xs font-black text-zinc-900">{item.points} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
