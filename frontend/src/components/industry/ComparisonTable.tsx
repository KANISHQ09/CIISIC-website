import React from 'react';
import { ShortlistCandidate } from '@/types/industryPortal';
import { X, FileText, Code, Globe, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ComparisonTableProps {
  candidates: ShortlistCandidate[];
  onRemove: (id: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ candidates, onRemove }) => {
  const router = useRouter();

  if (candidates.length === 0) {
    return (
      <div className="py-12 text-center border border-zinc-150 border-dashed rounded-3xl bg-white text-zinc-400 font-bold text-xs">
        No candidates selected to compare.
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm select-none text-left">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              <th className="py-4 px-6 w-44">Criterion</th>
              {candidates.map((c) => (
                <th key={c.studentId} className="py-4 px-6 border-l border-zinc-100 min-w-[200px]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="leading-tight">
                      <p className="text-zinc-800 font-extrabold text-xs">{c.studentName}</p>
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">{c.college}</span>
                    </div>
                    <button
                      onClick={() => onRemove(c.proposalId)}
                      className="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-rose-500 transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
            {/* Proposal Score */}
            <tr className="hover:bg-zinc-50/20">
              <td className="py-3 px-6 font-bold text-zinc-400 text-[10px] uppercase tracking-wider">Evaluation Score</td>
              {candidates.map((c) => (
                <td key={c.studentId} className="py-3 px-6 border-l border-zinc-100 font-black text-blue-600">
                  {c.proposalScore} / 10.0
                </td>
              ))}
            </tr>

            {/* Academic CGPA */}
            <tr className="hover:bg-zinc-50/20">
              <td className="py-3 px-6 font-bold text-zinc-400 text-[10px] uppercase tracking-wider">CGPA Quotient</td>
              {candidates.map((c) => (
                <td key={c.studentId} className="py-3 px-6 border-l border-zinc-100 text-zinc-800 font-bold">
                  {c.cgpa} / 10.0
                </td>
              ))}
            </tr>

            {/* Major Department */}
            <tr className="hover:bg-zinc-50/20">
              <td className="py-3 px-6 font-bold text-zinc-400 text-[10px] uppercase tracking-wider">Specialization</td>
              {candidates.map((c) => (
                <td key={c.studentId} className="py-3 px-6 border-l border-zinc-100 text-zinc-600 font-medium">
                  {c.major}
                </td>
              ))}
            </tr>

            {/* Tech stack */}
            <tr className="hover:bg-zinc-50/20">
              <td className="py-3 px-6 font-bold text-zinc-400 text-[10px] uppercase tracking-wider">Primary Skills</td>
              {candidates.map((c) => (
                <td key={c.studentId} className="py-3 px-6 border-l border-zinc-100">
                  <div className="flex flex-wrap gap-1">
                    {c.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-1.5 py-0.5 bg-zinc-100 rounded text-[9px] font-bold text-zinc-500 uppercase tracking-wider"
                      >
                        {skill}
                      </span>
                    ))}
                    {c.skills.length > 3 && <span className="text-[9px] text-zinc-400 font-bold">+{c.skills.length - 3} more</span>}
                  </div>
                </td>
              ))}
            </tr>

            {/* Portfolio coordinates */}
            <tr className="hover:bg-zinc-50/20">
              <td className="py-3 px-6 font-bold text-zinc-400 text-[10px] uppercase tracking-wider">Coordinates Links</td>
              {candidates.map((c) => (
                <td key={c.studentId} className="py-3 px-6 border-l border-zinc-100">
                  <div className="flex items-center gap-3">
                    {c.githubUrl && (
                      <a
                        href={c.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded border border-zinc-150 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-950 transition-colors"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {c.portfolioUrl && (
                      <a
                        href={c.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded border border-zinc-150 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-950 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button className="p-1 rounded border border-zinc-150 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-950 transition-colors">
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr className="hover:bg-zinc-50/20">
              <td className="py-4 px-6 font-bold text-zinc-400 text-[10px] uppercase tracking-wider">Actions Hub</td>
              {candidates.map((c) => (
                <td key={c.studentId} className="py-4 px-6 border-l border-zinc-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/messages`)}
                      className="py-1.5 px-3 border border-zinc-200 hover:border-zinc-350 hover:bg-zinc-50 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer focus:outline-none"
                    >
                      <MessageSquare className="w-3 h-3" /> Anonymous Chat
                    </button>
                    <button
                      onClick={() => router.push(`/proposals/${c.proposalId}`)}
                      className="py-1.5 px-3 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer focus:outline-none"
                    >
                      View Solution
                    </button>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
