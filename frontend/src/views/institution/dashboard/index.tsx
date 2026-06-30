'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { InstitutionService } from '@/services/institutionService';
import { StudentManagementService } from '@/services/studentManagementService';
import { CellManagementService } from '@/services/cellManagementService';
import { StatsCard } from '@/components/industry/StatsCard';
import { VerificationCard } from '@/components/institution/VerificationCard';
import { StudentAcademicRecord, ExcellenceCell, VerificationStatus } from '@/types/institutionPortal';
import { DashboardError } from '@/components/DashboardError';
import { Users2, BookmarkCheck, TrendingUp, Layers, Megaphone, ArrowRight, ShieldAlert } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function InstitutionDashboard() {
  const router = useRouter();
  const { showToast } = useToast();

  const [stats, setStats] = useState<any>(null);
  const [pendingStudents, setPendingStudents] = useState<StudentAcademicRecord[]>([]);
  const [cells, setCells] = useState<ExcellenceCell[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, studentsList, cellsList] = await Promise.all([
        InstitutionService.getDashboardStats(),
        StudentManagementService.getStudents(),
        CellManagementService.getCells()
      ]);
      setStats(statsData);
      setPendingStudents(studentsList.filter((s) => s.verificationStatus === 'PENDING'));
      setCells(cellsList.slice(0, 3));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to fetch academic console. Please check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [retryCount]);

  const handleVerify = async (id: string, status: VerificationStatus) => {
    try {
      const updated = await StudentManagementService.verifyStudent(id, status);
      if (updated) {
        showToast(status === 'VERIFIED' ? 'Student verified!' : 'Student verification rejected.', 'success');
        fetchDashboardData();
      }
    } catch {
      showToast('Failed to execute verification', 'error');
    }
  };

  if (error) {
    return <DashboardError message={error} onRetry={() => setRetryCount((c) => c + 1)} />;
  }

  if (isLoading || !stats) {
    return (
      <div className="space-y-6 text-left pb-12 select-none animate-pulse">
        <div className="bg-zinc-200 rounded-3xl h-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-tr from-slate-900 via-neutral-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="absolute top-[-30%] right-[-10%] w-64 h-64 rounded-full bg-indigo-600/10 blur-[80px]" />

        <div className="space-y-2 relative z-10 max-w-lg">
          <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase text-indigo-300">
            University Admin Console
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mt-1.5">LNCT University SPOC Hub</h1>
          <p className="text-slate-400 text-xs font-medium leading-relaxed">
            Verify student registrations, track active industry submissions, manage domain excellence cells, and compile placement reports.
          </p>
        </div>

        <div className="relative z-10 shrink-0 self-start md:self-center">
          <button
            onClick={() => router.push('/students')}
            className="py-3 px-5 bg-white text-slate-950 hover:bg-neutral-100 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
          >
            Manage Student Directory <ArrowRight className="w-4 h-4 text-indigo-600" />
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Student Solvers"
          value={stats.totalStudents}
          icon={<Users2 className="w-5 h-5 text-indigo-600" />}
          description="Ecosystem enrollment"
        />
        <StatsCard
          label="Verified Registrants"
          value={stats.verifiedStudents}
          icon={<BookmarkCheck className="w-5 h-5 text-indigo-600" />}
          description="Ready to participate"
        />
        <StatsCard
          label="Active Challenges"
          value={stats.activeChallenges}
          icon={<Layers className="w-5 h-5 text-indigo-600" />}
          description="Madhya Pradesh sector briefs"
        />
        <StatsCard
          label="Participation Rate"
          value={`${stats.participationRate}%`}
          icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
          description="Avg. college metrics"
        />
      </div>

      {/* Split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Verification Queue & Cell registry list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending verification queue */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-zinc-900 tracking-tight">Pending Verifications Queue</h2>
              <p className="text-[11px] text-zinc-400 font-bold uppercase mt-0.5">Approve or reject student registrations</p>
            </div>

            {pendingStudents.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-xs text-zinc-500 font-medium">No students registered yet.</p>
                <button
                  onClick={() => router.push('/students')}
                  className="py-1.5 px-4 bg-indigo-600 text-white rounded-xl text-[10px] font-bold hover:bg-indigo-700 transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  Invite Students
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pendingStudents.map((student) => (
                  <VerificationCard key={student.id} student={student} onVerify={handleVerify} />
                ))}
              </div>
            )}
          </div>

          {/* Excellence Cells registry summary */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-zinc-900 tracking-tight">Active Excellence Cells</h2>
                <p className="text-[11px] text-zinc-400 font-bold uppercase mt-0.5">Cooperation focus cells</p>
              </div>
              <button onClick={() => router.push('/cells')} className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                Manage Cells
              </button>
            </div>

            <div className="space-y-3">
              {cells.map((c) => (
                <div
                  key={c.id}
                  onClick={() => router.push('/cells')}
                  className="p-4 border border-zinc-100 hover:border-indigo-250 rounded-2xl flex items-center justify-between gap-4 transition-all cursor-pointer text-left"
                >
                  <div className="leading-tight space-y-1">
                    <p className="text-xs font-extrabold text-zinc-800">{c.cellName}</p>
                    <p className="text-[10px] text-zinc-400 font-bold">Domain: {c.domainFocus}</p>
                  </div>
                  <div className="text-right leading-tight">
                    <p className="text-xs font-black text-zinc-850">{c.studentCount} Solvers</p>
                    <span className="text-[10px] text-zinc-400 font-bold">{c.projectsCount} research briefs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: announcements & activity logs */}
        <div className="space-y-6">
          {/* Announcements block */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Megaphone className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
              <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-widest">Ecosystem Announcements</h3>
            </div>

            <div className="space-y-4 text-left">
              {stats.announcements.map((ann: any) => (
                <div key={ann.id} className="space-y-1 pb-3 border-b border-zinc-50 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400">
                    <span className="text-indigo-600 uppercase tracking-wider">CII MP Board</span>
                    <span>{new Date(ann.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs font-bold text-zinc-800 leading-tight">{ann.title}</p>
                  <p className="text-[11px] text-zinc-500 font-medium leading-normal">{ann.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Warning alerts */}
          {pendingStudents.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-5 flex items-start gap-3 text-left">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-amber-900">Approvals Required</h4>
                <p className="text-[11px] text-amber-800 font-medium leading-normal">
                  There are {pendingStudents.length} student registrations awaiting verification check. Solvers cannot submit proposal
                  designs until verified.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
