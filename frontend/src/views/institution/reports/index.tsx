'use client';

import React, { useState } from 'react';
import { ExportService } from '@/services/exportService';
import { BarChart3, FileDown, Layers, Landmark, TrendingUp } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { ProgressBar } from '@/components/student/ProgressBar';

export default function InstitutionReports() {
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await ExportService.exportAnalyticsExcel();
      showToast('Institutional placement reports downloaded successfully!', 'success');
    } catch {
      showToast('Export failed', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const departmentsData = [
    { name: 'Computer Science & Engineering', value: 85, solversCount: 450 },
    { name: 'Electronics & Communication', value: 72, solversCount: 380 },
    { name: 'Chemical Engineering', value: 48, solversCount: 150 },
    { name: 'Mechanical Engineering', value: 34, solversCount: 220 }
  ];

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Academic Reports</h1>
          <p className="text-sm text-zinc-500 font-medium">
            Evaluate department participation rates, placement readiness stats, and project completion parameters
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 self-start sm:self-center disabled:opacity-40"
        >
          <FileDown className="w-4 h-4" /> {isExporting ? 'Generating Excel...' : 'Export Placement Data'}
        </button>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Department metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Landmark className="w-4.5 h-4.5 text-indigo-600" /> Department Performance Metrics
            </h3>

            <div className="space-y-4">
              {departmentsData.map((dept) => (
                <div key={dept.name} className="space-y-1.5 text-xs text-left">
                  <div className="flex justify-between font-bold text-zinc-700">
                    <span>{dept.name}</span>
                    <span className="text-indigo-600">
                      {dept.value}% Participation ({dept.solversCount} Solvers)
                    </span>
                  </div>
                  <ProgressBar value={dept.value} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side: placement readiness gauges */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-600" /> Placement Readiness Indicators
            </h3>

            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl space-y-3">
              <div>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Ecosystem Placements Index</p>
                <p className="text-2xl font-black text-indigo-600 mt-1">74.5%</p>
              </div>
              <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed">
                Percentage of verified students participating in industrial innovation challenges with top industry grades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
