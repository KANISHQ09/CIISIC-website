import React, { useState, useEffect } from 'react';
import { ProposalEvaluation, RecommendationType } from '@/types/industryPortal';
import { Award, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';

interface EvaluationScoresCardProps {
  proposalId: string;
  onSubmit: (data: ProposalEvaluation) => void;
  isSubmitting?: boolean;
}

export const EvaluationScoresCard: React.FC<EvaluationScoresCardProps> = ({ proposalId, onSubmit, isSubmitting = false }) => {
  const [technicalScore, setTechnicalScore] = useState(5);
  const [innovationScore, setInnovationScore] = useState(5);
  const [feasibilityScore, setFeasibilityScore] = useState(5);
  const [impactScore, setImpactScore] = useState(5);
  const [recommendation, setRecommendation] = useState<RecommendationType>('REVISION_REQUESTED');
  const [comments, setComments] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  const calculateTotal = () => {
    return Number(((technicalScore + innovationScore + feasibilityScore + impactScore) / 4).toFixed(1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      proposalId,
      technicalScore,
      innovationScore,
      feasibilityScore,
      impactScore,
      totalScore: calculateTotal(),
      recommendation,
      comments,
      internalNotes,
      evaluatedBy: 'Amit Saxena',
      evaluatedAt: new Date().toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-6 text-left select-none">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <h3 className="text-base font-extrabold text-zinc-900 tracking-tight">Proposal Review Board</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Average Score</span>
          <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-black border border-blue-100 flex items-center justify-center text-sm">
            {calculateTotal()}
          </span>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Technical Score */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-zinc-700">
            <span>Technical Quality</span>
            <span className="text-blue-600">{technicalScore}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={technicalScore}
            onChange={(e) => setTechnicalScore(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Innovation Score */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-zinc-700">
            <span>Innovation Quotient</span>
            <span className="text-blue-600">{innovationScore}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={innovationScore}
            onChange={(e) => setInnovationScore(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Feasibility Score */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-zinc-700">
            <span>Execution Feasibility</span>
            <span className="text-blue-600">{feasibilityScore}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={feasibilityScore}
            onChange={(e) => setFeasibilityScore(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Impact Score */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-zinc-700">
            <span>Business Impact</span>
            <span className="text-blue-600">{impactScore}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={impactScore}
            onChange={(e) => setImpactScore(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* Decision recommendation */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-700 block">Evaluation Recommendation</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setRecommendation('APPROVE')}
            className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              recommendation === 'APPROVE'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" /> Approve
          </button>
          <button
            type="button"
            onClick={() => setRecommendation('REVISION_REQUESTED')}
            className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              recommendation === 'REVISION_REQUESTED'
                ? 'border-amber-500 bg-amber-50 text-amber-700'
                : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Revision Req
          </button>
          <button
            type="button"
            onClick={() => setRecommendation('REJECT')}
            className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              recommendation === 'REJECT'
                ? 'border-rose-500 bg-rose-50 text-rose-700'
                : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" /> Reject
          </button>
        </div>
      </div>

      {/* Text feedback comments */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700">Official Evaluation Comments</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Provide constructive feedback for the candidate (visible to student & college coordinator)..."
            rows={4}
            className="w-full p-3 border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-semibold text-zinc-800"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700">Internal Audit Notes (Confidential)</label>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Add confidential notes for your internal committee (hidden from student)..."
            rows={2}
            className="w-full p-3 border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-semibold text-zinc-800"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer focus:outline-none disabled:opacity-40"
      >
        {isSubmitting ? 'Recording Evaluation...' : 'Submit Evaluation Report'}
      </button>
    </form>
  );
};
