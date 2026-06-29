'use client';

import React, { useState, useEffect } from 'react';
import { ReviewerService } from '@/services/reviewerService';
import { FileText, ClipboardList, CheckCircle, BarChart3, TrendingUp } from 'lucide-react';

export default function ReviewerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ReviewerService.getReviewerStats().then((data) => {
      setStats(data);
      setIsLoading(false);
    });
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
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Reviewer Workspace</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Evaluate assigned student proposal drafts and rate project feasibility parameters
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-150 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-indigo-650" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Assigned Reviews</p>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{stats.assignedReviews}</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-150 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-indigo-650" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Pending Evaluations</p>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{stats.pendingReviews}</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-150 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-indigo-650" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Completed Assessments</p>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{stats.completedReviews}</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-150 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-indigo-650" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Average Graded Score</p>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{stats.averageScore}/10</p>
          </div>
        </div>
      </div>

      {/* Analytics info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-indigo-650" /> Reviewer Activity Timeline
          </h3>
          <div className="flex gap-4 items-end h-32 pt-4">
            {stats.performanceTimeline.map((t: any, idx: number) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-indigo-600 rounded-lg hover:opacity-85 transition-opacity"
                  style={{ height: `${(t.reviewsCompleted / 10) * 100}%` }}
                />
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  {t.month} ({t.reviewsCompleted})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
