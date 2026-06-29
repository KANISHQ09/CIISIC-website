'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProposalService } from '@/services/proposalService';
import { ReviewerService } from '@/services/reviewerService';
import { Proposal } from '@/types/studentPortal';
import { ArrowLeft, Send, CheckCircle, ClipboardList } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function ReviewerEvaluation() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Evaluation form parameters
  const [innovationScore, setInnovationScore] = useState(5);
  const [feasibilityScore, setFeasibilityScore] = useState(5);
  const [documentationScore, setDocumentationScore] = useState(5);
  const [comments, setComments] = useState('');
  const [recommendation, setRecommendation] = useState<'APPROVED' | 'REVISING' | 'REJECTED'>('APPROVED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      ProposalService.getProposalById(params.id as string).then((data) => {
        setProposal(data || null);
        setIsLoading(false);
      });
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal) return;

    setIsSubmitting(true);
    try {
      await ReviewerService.submitReview({
        proposalId: proposal.id,
        innovationScore,
        technicalScore: 5,
        feasibilityScore,
        scalabilityScore: 5,
        documentationScore,
        businessImpactScore: 5,
        comments: comments.trim(),
        recommendation: recommendation === 'APPROVED' ? 'APPROVED' : recommendation === 'REVISING' ? 'REVISING' : 'REJECTED'
      });

      showToast('Technical assessment review submitted successfully!', 'success');
      router.push('/proposals');
    } catch {
      showToast('Assessment submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="py-12 text-center text-zinc-500">
        <p className="text-sm font-bold">Proposal file not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
        <button
          onClick={() => router.push('/proposals')}
          className="p-2 border border-zinc-200 hover:bg-zinc-50 text-zinc-650 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider block">Solution Assessment Queue</span>
          <h1 className="text-xl font-black text-zinc-950">{proposal.title}</h1>
        </div>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left pane: Proposal details */}
        <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider border-b border-zinc-50 pb-3">
            Technical Solution Spec
          </h3>
          <p className="text-xs text-zinc-650 font-semibold leading-relaxed whitespace-pre-line">{proposal.abstract}</p>
        </div>

        {/* Right pane: Evaluation score sliders */}
        <form onSubmit={handleSubmit} className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-50 pb-3">
            <ClipboardList className="w-4.5 h-4.5 text-indigo-650" /> Scorecard Sliders
          </h3>

          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-zinc-700">
                <span>Technical Innovation Score</span>
                <span className="text-indigo-600 font-extrabold">{innovationScore}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={innovationScore}
                onChange={(e) => setInnovationScore(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-zinc-700">
                <span>Engineering Feasibility Score</span>
                <span className="text-indigo-600 font-extrabold">{feasibilityScore}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={feasibilityScore}
                onChange={(e) => setFeasibilityScore(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-zinc-700">
                <span>Documentation Quality Score</span>
                <span className="text-indigo-600 font-extrabold">{documentationScore}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={documentationScore}
                onChange={(e) => setDocumentationScore(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-2 text-left">
            <label className="text-xs font-bold text-zinc-700 block">Assessment Verdict</label>
            <div className="grid grid-cols-3 gap-3">
              {(['APPROVED', 'REVISING', 'REJECTED'] as const).map((rec) => (
                <label
                  key={rec}
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer text-[10px] font-black uppercase transition-all ${
                    recommendation === rec
                      ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm'
                      : 'border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="recommendation"
                    value={rec}
                    checked={recommendation === rec}
                    onChange={() => setRecommendation(rec)}
                    className="sr-only"
                  />
                  <span>{rec === 'REVISING' ? 'Revision' : rec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Feedback comments */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-zinc-700">Technical Evaluation Notes</label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="State key challenges, recommendations or constraints..."
              className="w-full p-3 border border-zinc-200 bg-zinc-50/50 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-zinc-800 leading-relaxed"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            Submit Technical Review <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
