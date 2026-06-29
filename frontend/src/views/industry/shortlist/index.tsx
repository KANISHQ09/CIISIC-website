'use client';

import React, { useEffect, useState } from 'react';
import { ShortlistCandidate } from '@/types/industryPortal';
import { ProposalReviewService } from '@/services/proposalReviewService';
import { ExportService } from '@/services/exportService';
import { ComparisonTable } from '@/components/industry/ComparisonTable';
import { FileText, Download, Users2, FileDown, Layers } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function StudentShortlist() {
  const { showToast } = useToast();
  const [candidates, setCandidates] = useState<ShortlistCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const fetchShortlist = async () => {
    setIsLoading(true);
    try {
      const data = await ProposalReviewService.getShortlist();
      setCandidates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, []);

  const handleRemove = async (proposalId: string) => {
    const success = await ProposalReviewService.removeFromShortlist(proposalId);
    if (success) {
      showToast('Candidate removed from shortlist.', 'info');
      fetchShortlist();
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await ExportService.exportShortlistPDF(candidates);
      showToast('Shortlist PDF exported successfully!', 'success');
    } catch {
      showToast('Failed to export PDF', 'error');
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
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Student Shortlist</h1>
          <p className="text-sm text-zinc-500 font-medium">Verify credentials and review matching portfolios for outstanding solvers</p>
        </div>
        <button
          onClick={handleExportPDF}
          disabled={isExporting || candidates.length === 0}
          className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 self-start sm:self-center disabled:opacity-40"
        >
          <FileDown className="w-4 h-4" /> {isExporting ? 'Generating PDF...' : 'Export List PDF'}
        </button>
      </div>

      {/* Main section split */}
      {candidates.length === 0 ? (
        <div className="py-16 text-center border border-zinc-150 border-dashed rounded-3xl bg-white space-y-3 shadow-sm">
          <Users2 className="w-10 h-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-800">No Shortlisted Candidates</h3>
            <p className="text-xs text-zinc-400 font-medium">Approve and score proposal solutions to populate your corporate shortlist.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Side by side comparison table matrix */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-blue-600" />
              <h2 className="text-sm font-extrabold text-zinc-850 uppercase tracking-wider">Solvers Evaluation Comparison</h2>
            </div>
            <ComparisonTable candidates={candidates} onRemove={handleRemove} />
          </div>

          {/* Cards Grid list */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-850 uppercase tracking-wider">Candidate Registry Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidates.map((c) => (
                <div
                  key={c.studentId}
                  className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-all text-left"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="leading-tight">
                        <h4 className="text-sm font-extrabold text-zinc-900">{c.studentName}</h4>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{c.college}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-black text-[10px] border border-blue-100">
                        {c.proposalScore} / 10.0
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 font-semibold leading-normal">
                      Major Specialization: <span className="text-zinc-800 font-bold">{c.major}</span>
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {c.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-1.5 py-0.5 bg-zinc-100 rounded text-[9px] font-bold text-zinc-500 uppercase tracking-wider"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-zinc-50 pt-4 mt-4">
                    <a
                      href={c.resumeUrl}
                      className="text-[11px] font-extrabold text-zinc-500 hover:text-zinc-950 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Download Portfolio
                    </a>
                    <button
                      onClick={() => handleRemove(c.proposalId)}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                    >
                      Remove Shortlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
