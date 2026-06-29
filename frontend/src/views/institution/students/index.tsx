'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudentAcademicRecord, VerificationStatus } from '@/types/institutionPortal';
import { StudentManagementService } from '@/services/studentManagementService';
import { TableSkeleton } from '@/components/student/Skeletons';
import { Search, FileUser, Check, X, ArrowRight, UserCheck } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function StudentDirectory() {
  const router = useRouter();
  const { showToast } = useToast();
  const [students, setStudents] = useState<StudentAcademicRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await StudentManagementService.getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleVerify = async (id: string, status: VerificationStatus) => {
    try {
      await StudentManagementService.verifyStudent(id, status);
      showToast(status === 'VERIFIED' ? 'Student verified!' : 'Student verification rejected.', 'success');
      fetchStudents();
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || s.verificationStatus === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Student Directory</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Verify credentials and manage enrollment details for university innovation teams
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="w-4.5 h-4.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name or registration number..."
            className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-zinc-800"
          />
        </div>

        {/* Dept filter */}
        <div className="w-full md:w-auto shrink-0 flex items-center gap-2">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2.5 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-zinc-650 cursor-pointer"
          >
            <option value="ALL">All Departments</option>
            <option value="Electronics & Communication">Electronics & Comm.</option>
            <option value="Chemical Engineering">Chemical Eng.</option>
            <option value="Computer Science">Computer Science</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-zinc-200 bg-white rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold text-zinc-650 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table grid listing */}
      {isLoading ? (
        <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm">
          <TableSkeleton />
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="py-16 text-center border border-zinc-150 border-dashed rounded-3xl bg-white space-y-3 shadow-sm">
          <FileUser className="w-10 h-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-850">No Students Found</h3>
            <p className="text-xs text-zinc-400 font-medium">Refine search criteria and department filters.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Solver Name</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">CGPA</th>
                  <th className="py-4 px-6">Verification</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-zinc-50/40 transition-colors">
                    <td className="py-4 px-6 text-left">
                      <p className="font-extrabold text-zinc-900 text-sm">{student.name}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Reg: {student.registrationNumber}</p>
                    </td>
                    <td className="py-4 px-6 text-zinc-600 font-bold">
                      {student.department}
                      <span className="text-[9px] text-zinc-400 font-bold block mt-0.5">Year {student.year}</span>
                    </td>
                    <td className="py-4 px-6 font-black text-zinc-800">{student.cgpa} / 10.0</td>
                    <td className="py-4 px-6">
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
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => router.push(`/students/${student.id}`)}
                          className="py-1.5 px-3 border border-zinc-200 hover:border-zinc-350 hover:bg-neutral-50 rounded-xl text-[10px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                        >
                          Audit Details
                        </button>
                        {student.verificationStatus === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleVerify(student.id, 'VERIFIED')}
                              className="p-2 border border-emerald-100 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all"
                              title="Approve student registration"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleVerify(student.id, 'REJECTED')}
                              className="p-2 border border-rose-100 hover:bg-rose-50 text-rose-600 rounded-xl transition-all"
                              title="Reject registration"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
