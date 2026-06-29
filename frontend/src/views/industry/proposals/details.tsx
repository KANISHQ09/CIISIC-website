'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Proposal } from '@/types/studentPortal';
import { ProposalReviewService } from '@/services/proposalReviewService';
import { StatusBadge } from '@/components/student/StatusBadge';
import { EvaluationScoresCard } from '@/components/industry/EvaluationScoresCard';
import { ArrowLeft, FileText, Download, EyeOff, Maximize2, ZoomIn, ZoomOut, Send, Sparkles, ArrowUpCircle } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { ProposalEvaluation } from '@/types/industryPortal';

export default function ProposalReviewDetails() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const proposalId = params?.id as string;
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  // Simulated PDF Viewer Zoom State
  const [pdfZoom, setPdfZoom] = useState(100);

  const fetchProposal = async () => {
    if (!proposalId) return;
    setIsLoading(true);
    try {
      const item = await ProposalReviewService.getProposalById(proposalId);
      setProposal(item || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProposal();
  }, [proposalId]);

  const handleScoreSubmit = async (evaluation: ProposalEvaluation) => {
    setIsSubmittingScore(true);
    try {
      await ProposalReviewService.submitEvaluation(evaluation);
      showToast('Proposal evaluation recorded successfully!', 'success');

      // Reload
      await fetchProposal();
    } catch {
      showToast('Failed to record evaluation', 'error');
    } finally {
      setIsSubmittingScore(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !proposal) return;

    // Simulate sending anonymous message to student
    const updatedComments = [
      ...proposal.comments,
      {
        id: `comment-${Date.now()}`,
        authorName: 'Amit Saxena',
        authorRole: 'Industry Partner',
        content: chatMessage.trim(),
        createdAt: new Date().toISOString()
      }
    ];

    const proposalsStr = localStorage.getItem('ciisic_proposals');
    if (proposalsStr) {
      const list: Proposal[] = JSON.parse(proposalsStr);
      const index = list.findIndex((p) => p.id === proposal.id);
      if (index !== -1) {
        list[index].comments = updatedComments;
        localStorage.setItem('ciisic_proposals', JSON.stringify(list));
        setProposal({ ...proposal, comments: updatedComments });
        setChatMessage('');
        showToast('Anonymous message sent to candidate.', 'success');
      }
    }
  };

  const getAnonymizedName = (id: string) => {
    return `Solver-${id.slice(0, 5).toUpperCase()}`;
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-zinc-500 font-bold">Proposal brief not found.</p>
        <button onClick={() => router.push('/proposals')} className="text-xs text-blue-600 hover:underline">
          Go back to Review Center
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Back button */}
      <button
        onClick={() => router.push('/proposals')}
        className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer focus:outline-none"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Review Center
      </button>

      {/* Hero Header */}
      <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              <EyeOff className="w-3.5 h-3.5 shrink-0" /> {getAnonymizedName(proposal.studentId || proposal.id)}
            </span>
            <span>•</span>
            <StatusBadge status={proposal.status} />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tight leading-tight">{proposal.title}</h1>
          <p className="text-xs text-zinc-500 font-semibold">
            Challenge Reference: <span className="text-zinc-800 font-bold">{proposal.challengeTitle}</span>
          </p>
        </div>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: solution text & mock PDF viewer */}
        <div className="lg:col-span-2 space-y-6">
          {/* Solution brief */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-zinc-900 tracking-tight">Solution Brief</h2>
            <p className="text-xs text-zinc-600 leading-relaxed font-medium">{proposal.description}</p>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-extrabold text-zinc-800 uppercase tracking-wider">Technical Implementation Specs</h4>
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs font-medium text-zinc-700 whitespace-pre-line leading-relaxed">
                {proposal.technicalApproach}
              </div>
            </div>
          </div>

          {/* Premium PDF Viewer Simulation */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-md flex flex-col justify-between min-h-[400px]">
            {/* PDF Toolbar */}
            <div className="h-12 bg-slate-950 px-4 flex items-center justify-between border-b border-slate-900 text-slate-400 text-xs font-bold shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>{proposal.fileName}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPdfZoom(Math.max(50, pdfZoom - 10))}
                  className="p-1 hover:bg-slate-900 rounded transition-colors text-slate-400 hover:text-white"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span>{pdfZoom}%</span>
                <button
                  onClick={() => setPdfZoom(Math.min(200, pdfZoom + 10))}
                  className="p-1 hover:bg-slate-900 rounded transition-colors text-slate-400 hover:text-white"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-slate-900 rounded transition-colors text-slate-400 hover:text-white">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <button className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-1 transition-colors">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Document display preview */}
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-900/50 relative overflow-hidden">
              <div
                className="bg-white border border-slate-800 rounded-lg shadow-2xl p-8 max-w-lg w-full text-left space-y-4 text-zinc-900 select-text transition-all duration-200"
                style={{ transform: `scale(${pdfZoom / 100})` }}
              >
                <div className="border-b border-zinc-200 pb-3 flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-extrabold">{proposal.title}</h3>
                    <p className="text-[9px] text-zinc-400 font-extrabold uppercase mt-0.5">Technical Layout & Schematics Brief</p>
                  </div>
                  <span className="text-[8px] font-bold bg-zinc-100 text-zinc-500 px-1 py-0.2 rounded border border-zinc-200 uppercase">
                    Page 1 of 1
                  </span>
                </div>
                <p className="text-[10px] leading-relaxed text-zinc-600 font-medium">{proposal.description.slice(0, 300)}...</p>
                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl space-y-2">
                  <p className="text-[9px] font-black text-zinc-800 uppercase">Architecture Outline</p>
                  <p className="text-[9px] font-medium text-zinc-500 leading-normal">{proposal.technicalApproach.slice(0, 150)}...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Evaluation Scores Board & messaging */}
        <div className="space-y-6">
          {/* Evaluation score board */}
          <EvaluationScoresCard proposalId={proposal.id} onSubmit={handleScoreSubmit} isSubmitting={isSubmittingScore} />

          {/* Anonymous thread panel */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider border-b border-zinc-50 pb-3">Anonymous Thread</h3>

            <div className="space-y-4 max-h-60 overflow-y-auto">
              <div className="flex gap-2">
                <ArrowUpCircle className="w-4.5 h-4.5 text-zinc-400 shrink-0 mt-0.5" />
                <div className="text-left text-xs font-semibold text-zinc-600">
                  <p className="font-bold text-zinc-800">Proposal Uploaded</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase">{new Date(proposal.submissionDate).toLocaleDateString()}</p>
                </div>
              </div>

              {proposal.comments.map((c) => (
                <div key={c.id} className="text-left leading-normal space-y-1 p-3 bg-zinc-50 border border-zinc-100 rounded-2xl">
                  <div className="flex justify-between items-center text-[9px] text-zinc-400 font-bold">
                    <span>
                      {c.authorName} ({c.authorRole})
                    </span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-zinc-700 font-medium">{c.content}</p>
                </div>
              ))}
            </div>

            {/* Direct write block */}
            <form onSubmit={handleSendChat} className="flex gap-2 border-t border-zinc-50 pt-4 mt-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Send message to student anonymously..."
                className="flex-1 px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 rounded-xl text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
              />
              <button type="submit" className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-colors cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
