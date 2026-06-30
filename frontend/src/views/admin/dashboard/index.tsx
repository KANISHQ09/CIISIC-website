'use client';

import React, { useState, useEffect } from 'react';
import { AdminService } from '@/services/adminService';
import { SystemHealthStatus } from '@/types/adminPortal';
import { Users, Building, Landmark, ShieldCheck, BookOpen, Activity, HeartPulse, TrendingUp } from 'lucide-react';
import { DashboardError } from '@/components/DashboardError';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    AdminService.getDashboardStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err: any) => {
        console.error(err);
        setError(err.message || 'Unable to fetch administrative controller system metrics.');
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
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-zinc-150 rounded-2xl h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-200 rounded-3xl h-64" />
          <div className="bg-zinc-200 rounded-3xl h-64" />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents, icon: <Users className="w-5 h-5 text-indigo-600" /> },
    { label: 'Chapter Institutions', value: stats.totalInstitutions, icon: <Landmark className="w-5 h-5 text-indigo-600" /> },
    { label: 'Verified Companies', value: stats.totalCompanies, icon: <Building className="w-5 h-5 text-indigo-600" /> },
    { label: 'Ecosystem Reviewers', value: stats.totalReviewers, icon: <ShieldCheck className="w-5 h-5 text-indigo-600" /> },
    { label: 'Active Challenges', value: stats.activeChallenges, icon: <BookOpen className="w-5 h-5 text-indigo-600" /> },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: <Activity className="w-5 h-5 text-indigo-600" /> }
  ];

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Governance Control Center</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Manage state-wide academic cooperation chapters, corporate partners, and innovation pipelines
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((c, idx) => (
          <div key={idx} className="bg-white border border-zinc-150 rounded-2xl p-4 shadow-sm space-y-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">{c.icon}</div>
            <div>
              <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">{c.label}</p>
              <p className="text-xl font-black text-zinc-950 mt-0.5">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: health + growth */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health index */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-4.5 h-4.5 text-indigo-600" /> System Health Status
            </h3>
            <div className="divide-y divide-zinc-100">
              {stats.systemHealth.map((h: SystemHealthStatus, idx: number) => (
                <div key={idx} className="py-3 flex justify-between items-center text-xs font-semibold text-zinc-700">
                  <span>{h.service}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-zinc-400 font-mono">latency: {h.latencyMs}ms</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[9px] font-black uppercase">
                      {h.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: quick stats summaries */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-600" /> Platform Growth Index
            </h3>
            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl space-y-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Cooperation Velocity</span>
              <p className="text-2xl font-black text-indigo-600">+24.5% MoM</p>
              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                Reflects the month-over-month increase in solved innovation challenges and industrial project verifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
