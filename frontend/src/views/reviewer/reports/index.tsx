'use client';

import React, { useState } from 'react';
import { ExportService } from '@/services/exportService';
import { FileSpreadsheet, TrendingUp, Landmark, Award } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { ProgressBar } from '@/components/student/ProgressBar';

export default function ReviewerReports() {
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await ExportService.exportAnalyticsExcel();
      showToast('Completed evaluations spreadsheet saved to downloads folder.', 'success');
    } catch {
      showToast('Export failed', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Evaluation Reports</h1>
          <p className="text-sm text-zinc-500 font-medium">Download completed evaluations statistics and review duration parameters</p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 self-start sm:self-center disabled:opacity-40"
        >
          <FileSpreadsheet className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Export Assigned Reviews'}
        </button>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-indigo-650" /> Completed Assessments Distribution
            </h3>

            <div className="space-y-4 text-xs font-semibold text-zinc-700">
              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Agricultural Technology Proposals</span>
                  <span className="text-indigo-600">4 Completed (8.2 Avg Score)</span>
                </div>
                <ProgressBar value={80} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold">
                  <span>IoT & Embedded Sensors</span>
                  <span className="text-indigo-600">2 Completed (7.5 Avg Score)</span>
                </div>
                <ProgressBar value={40} />
              </div>
            </div>
          </div>
        </div>

        {/* Right side stats widget */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-650" /> Evaluation Turnaround
            </h3>
            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl space-y-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Average response duration</span>
              <p className="text-2xl font-black text-indigo-650">3.2 Days</p>
              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                Represents the average duration from reviewer assignment to final technical score submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
