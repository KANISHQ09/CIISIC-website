'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReviewerService } from '@/services/reviewerService';
import { FileText, ClipboardList, CheckCircle, BarChart3, TrendingUp } from 'lucide-react';
import { DashboardError } from '@/components/DashboardError';

export default function ReviewerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    ReviewerService.getReviewerStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err: any) => {
        console.error(err);
        setError(err.message || 'Unable to fetch reviewer portal evaluation metrics.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [retryCount]);

  if (error) {
    return <DashboardError message={error} onRetry={() => setRetryCount((c) => c + 1)} />;
  }

  if (isLoading || !stats) {
    return (
      <div className="space-y-6 text-left pb-12 select-none animate-pulse">
        <div className="border-b border-zinc-100 pb-4">
          <div className="h-8 w-64 bg-zinc-200 rounded-lg mb-2" />
          <div className="h-4 w-96 bg-zinc-150 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-150 rounded-2xl h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-200 rounded-3xl h-48" />
        </div>
      </div>
    );
  }

  const hasNoAssignments = stats.assignedReviews === 0;

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in duration-300">
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

      {/* Analytics info / Empty state */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-indigo-650" /> Reviewer Activity Timeline
          </h3>

          {hasNoAssignments ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-xs text-zinc-500 font-medium">No reviews assigned.</p>
              <button
                onClick={() => router.push('/proposals')}
                className="py-1.5 px-4 bg-indigo-600 text-white rounded-xl text-[10px] font-bold hover:bg-indigo-750 transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
              >
                View Assignments
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
