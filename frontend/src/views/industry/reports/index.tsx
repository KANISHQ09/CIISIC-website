'use client';

import React, { useState, useEffect } from 'react';
import { AnalyticsService, TimeSeriesPoint, TechnologyShare, InstitutionActivity } from '@/services/analyticsService';
import { ExportService } from '@/services/exportService';
import { BarChart3, TrendingUp, HelpCircle, FileDown, Layers, Landmark } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { ProgressBar } from '@/components/student/ProgressBar';

export default function ReportsAnalytics() {
  const { showToast } = useToast();
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [techTrends, setTechTrends] = useState<TechnologyShare[]>([]);
  const [colleges, setColleges] = useState<InstitutionActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ts, tt, cl] = await Promise.all([
          AnalyticsService.getTimeSeriesData(7),
          AnalyticsService.getTechnologyTrends(),
          AnalyticsService.getInstitutionParticipation()
        ]);
        setTimeSeries(ts);
        setTechTrends(tt);
        setColleges(cl);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      await ExportService.exportAnalyticsExcel();
      showToast('Analytics Excel report exported!', 'success');
    } catch {
      showToast('Export failed', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Reports & Analytics</h1>
          <p className="text-sm text-zinc-500 font-medium">
            Monitor challenge applications, participant statistics, and technology domain allocations
          </p>
        </div>
        <button
          onClick={handleExportExcel}
          disabled={isExporting}
          className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 self-start sm:self-center disabled:opacity-40"
        >
          <FileDown className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Export Excel Data'}
        </button>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Submissions over time & list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submissions histogram */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-blue-600" /> Solution Submissions Trend
            </h3>

            {/* Custom SVG Bar Chart */}
            <div className="h-48 w-full bg-zinc-50/50 rounded-2xl p-4 flex items-end justify-between border border-zinc-100 relative">
              {timeSeries.map((pt, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[9px] font-black text-blue-600">{pt.submissions}</span>
                  <div
                    className="w-8 bg-gradient-to-t from-blue-600 to-indigo-500 rounded-md transition-all hover:opacity-80"
                    style={{ height: `${(pt.submissions / 10) * 100}px` }}
                  />
                  <span className="text-[8px] text-zinc-400 font-extrabold">{pt.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic partner colleges */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Landmark className="w-4.5 h-4.5 text-blue-600" /> Academic Institution Activity
            </h3>

            <div className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
              {colleges.map((cl) => (
                <div key={cl.collegeName} className="py-3 flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <p className="font-extrabold text-zinc-950">{cl.collegeName}</p>
                    <p className="text-[10px] text-zinc-400 font-bold">State University System affiliate</p>
                  </div>
                  <div className="text-right leading-tight">
                    <p className="font-black text-zinc-800">{cl.submissionsCount} submissions</p>
                    <span className="text-[9px] text-emerald-600 font-extrabold">{cl.acceptedCount} Approved solutions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: technology domains distribution */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-blue-600" /> Technology Share
            </h3>

            <div className="space-y-4">
              {techTrends.map((trend) => (
                <div key={trend.name} className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between font-bold text-zinc-700">
                    <span>{trend.name}</span>
                    <span className="text-blue-600">{trend.value}%</span>
                  </div>
                  <ProgressBar value={trend.value} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
