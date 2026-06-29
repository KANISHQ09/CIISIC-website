import React, { useState } from 'react';
import { StudentAcademicRecord, VerificationStatus } from '@/types/institutionPortal';
import { Check, X, ShieldAlert, GraduationCap } from 'lucide-react';

interface VerificationCardProps {
  student: StudentAcademicRecord;
  onVerify: (id: string, status: VerificationStatus) => void;
}

export const VerificationCard: React.FC<VerificationCardProps> = ({ student, onVerify }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = (status: VerificationStatus) => {
    setIsProcessing(true);
    setTimeout(() => {
      onVerify(student.id, status);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="bg-white border border-zinc-150 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-indigo-300 transition-all text-left select-none relative overflow-hidden">
      {/* Accent Glow */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 blur-xl rounded-full" />

      <div className="space-y-2 relative z-10">
        <div className="flex items-start justify-between">
          <div className="leading-tight space-y-1">
            <h4 className="text-xs font-extrabold text-zinc-950">{student.name}</h4>
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">{student.registrationNumber}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <GraduationCap className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="space-y-1 text-[11px] font-semibold text-zinc-500">
          <p>
            Department: <span className="text-zinc-800 font-bold">{student.department}</span>
          </p>
          <p>
            CGPA Quotient: <span className="text-zinc-800 font-bold">{student.cgpa} / 10.0</span>
          </p>
          <p>
            Email Address: <span className="text-zinc-800 font-bold truncate block">{student.email}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-zinc-50 relative z-10 shrink-0">
        <button
          onClick={() => handleAction('VERIFIED')}
          disabled={isProcessing}
          className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer focus:outline-none disabled:opacity-40"
        >
          <Check className="w-3 h-3" /> Approve Verification
        </button>
        <button
          onClick={() => handleAction('REJECTED')}
          disabled={isProcessing}
          className="py-1.5 px-3 border border-zinc-200 hover:bg-rose-50 text-zinc-400 hover:text-rose-600 rounded-xl text-[10px] font-bold transition-colors cursor-pointer focus:outline-none disabled:opacity-40"
        >
          <X className="w-3 h-3" /> Reject
        </button>
      </div>
    </div>
  );
};
