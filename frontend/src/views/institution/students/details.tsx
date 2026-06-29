'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StudentAcademicRecord, VerificationStatus } from '@/types/institutionPortal';
import { StudentManagementService } from '@/services/studentManagementService';
import { ArrowLeft, GraduationCap, ShieldCheck, X, Check, FolderLock, Mail, UserCheck } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function StudentDetailsAudit() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const studentId = params?.id as string;
  const [student, setStudent] = useState<StudentAcademicRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudentDetails = async () => {
    if (!studentId) return;
    setIsLoading(true);
    try {
      // Direct access from student list service
      const item = await StudentManagementService.getStudentById(studentId);
      setStudent(item || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const handleVerify = async (status: VerificationStatus) => {
    if (!student) return;
    try {
      const updated = await StudentManagementService.verifyStudent(student.id, status);
      if (updated) {
        setStudent(updated);
        showToast(status === 'VERIFIED' ? 'Student registration approved!' : 'Verification rejected.', 'success');
      }
    } catch {
      showToast('Action failed', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-zinc-500 font-bold">Student record not found.</p>
        <button onClick={() => router.push('/students')} className="text-xs text-indigo-600 hover:underline">
          Go back to directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Back button */}
      <button
        onClick={() => router.push('/students')}
        className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer focus:outline-none"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Directory
      </button>

      {/* Hero Header */}
      <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2.5 flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Reg: {student.registrationNumber}</span>
            <span>•</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border uppercase tracking-wider ${
                student.verificationStatus === 'VERIFIED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : student.verificationStatus === 'REJECTED'
                    ? 'bg-rose-50 text-rose-700 border-rose-100'
                    : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}
            >
              {student.verificationStatus}
            </span>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight leading-tight">{student.name}</h1>
          <p className="text-xs text-zinc-500 font-semibold">{student.department}</p>
        </div>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: academic profile, projects & proposals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Academic Portfolios Projects</h3>

            <div className="space-y-4 text-left">
              {student.projects.map((proj, i) => (
                <div key={i} className="p-4 border border-zinc-100 rounded-2xl space-y-1.5">
                  <h4 className="text-xs font-extrabold text-zinc-800">{proj.title}</h4>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submissions participation history */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Ecosystem Participation Log</h3>

            {student.participationHistory.length === 0 ? (
              <div className="py-8 text-center border border-zinc-100 border-dashed rounded-xl text-zinc-400 font-bold text-xs">
                No active challenge proposals filed yet.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
                {student.participationHistory.map((hist, i) => (
                  <div key={i} className="py-3 flex items-center justify-between text-left">
                    <div className="space-y-1">
                      <p className="font-extrabold text-zinc-900">{hist.challengeTitle}</p>
                      <p className="text-[10px] text-zinc-400 font-bold">Filed: {hist.date}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[9px] font-bold uppercase tracking-wider border border-blue-100">
                      {hist.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Verification actions panel & stats */}
        <div className="space-y-6">
          {/* Verification Panel */}
          {student.verificationStatus === 'PENDING' && (
            <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-50 pb-3">
                <UserCheck className="w-4.5 h-4.5 text-indigo-600" /> Vetting Action
              </h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Approve to verify solver enrollment credentials. Verification triggers active solution uploader routes for candidate.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => handleVerify('VERIFIED')}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Verify
                </button>
                <button
                  onClick={() => handleVerify('REJECTED')}
                  className="py-2.5 px-4 border border-zinc-200 hover:bg-rose-50 text-zinc-500 hover:text-rose-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          )}

          {/* Academic Info */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">Credential Summary</h3>
            <div className="space-y-3.5 text-xs text-zinc-650 font-semibold text-left">
              <div className="flex items-center gap-2.5">
                <GraduationCap className="w-4 h-4 text-zinc-400" />
                <span>CGPA score: {student.cgpa} / 10.0</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span className="truncate max-w-[180px]">{student.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
