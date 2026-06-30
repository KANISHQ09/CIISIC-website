'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, ArrowUpRight, Plus, Check } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { InstitutionService } from '@/services/institutionService';
import { apiClient } from '@/services/api/client';

interface InstAdminRecord {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  facultyCount: number;
  assignedCells: string[];
}

export default function SuperAdminInstitutions() {
  const { showToast } = useToast();
  const [institutions, setInstitutions] = useState<InstAdminRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCellName, setNewCellName] = useState('');
  const [activeInstId, setActiveInstId] = useState<string | null>(null);

  const fetchInstitutions = async () => {
    setIsLoading(true);
    try {
      const data = await InstitutionService.getInstitutions();
      setInstitutions(
        data.map((inst: any) => ({
          id: inst._id,
          name: inst.name,
          code: inst.code,
          studentCount: inst.studentCount || 0,
          facultyCount: inst.facultyMembers?.length || 0,
          assignedCells: inst.departments || []
        }))
      );
    } catch {
      showToast('Failed to retrieve institution coop data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const handleAddCell = async (instId: string) => {
    if (!newCellName.trim()) return;

    const inst = institutions.find((i) => i.id === instId);
    if (!inst) return;

    try {
      const updatedCells = [...inst.assignedCells, newCellName.trim()];
      await apiClient.patch(`/api/v1/institutions/${instId}`, {
        departments: updatedCells
      });

      showToast('Excellence Cell assignment updated successfully!', 'success');
      setNewCellName('');
      setActiveInstId(null);
      await fetchInstitutions();
    } catch {
      showToast('Failed to update Excellence Cell assignment.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">University Cooperations</h1>
        <p className="text-sm text-zinc-500 font-medium">
          Coordinate institutional verification credentials and Excellence Cells assignments
        </p>
      </div>

      {/* Directory Table */}
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-zinc-150 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="py-4 px-6 text-left">Academic Institution</th>
                <th className="py-4 px-6 text-center border-l border-zinc-100">Solvers Enrolled</th>
                <th className="py-4 px-6 text-center border-l border-zinc-100">Faculty Mentors</th>
                <th className="py-4 px-6 text-left border-l border-zinc-100">Assigned Excellence Cells</th>
                <th className="py-4 px-6 text-center border-l border-zinc-100 w-44">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs font-semibold text-zinc-700">
              {institutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-zinc-50/40 transition-colors">
                  <td className="py-4 px-6 text-left flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                      <Landmark className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-left leading-tight">
                      <p className="font-extrabold text-zinc-900">{inst.name}</p>
                      <span className="text-[10px] text-zinc-400 font-extrabold uppercase">{inst.code}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center border-l border-zinc-100 text-zinc-900 font-extrabold">{inst.studentCount}</td>
                  <td className="py-4 px-6 text-center border-l border-zinc-100 text-zinc-500 font-bold">{inst.facultyCount}</td>
                  <td className="py-4 px-6 text-left border-l border-zinc-100">
                    <div className="flex flex-wrap gap-1.5">
                      {inst.assignedCells.map((cell, cidx) => (
                        <span
                          key={cidx}
                          className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg text-[9px] font-black uppercase"
                        >
                          {cell}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center border-l border-zinc-100">
                    {activeInstId === inst.id ? (
                      <div className="flex items-center gap-1.5 justify-center">
                        <input
                          type="text"
                          placeholder="Cell label..."
                          value={newCellName}
                          onChange={(e) => setNewCellName(e.target.value)}
                          className="px-2 py-1 border border-zinc-200 bg-white rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-zinc-800 w-24"
                        />
                        <button
                          onClick={() => handleAddCell(inst.id)}
                          className="p-1.5 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveInstId(inst.id)}
                        className="py-1 px-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-650 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 mx-auto focus:outline-none"
                      >
                        <Plus className="w-3.5 h-3.5" /> Assign Cell
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
