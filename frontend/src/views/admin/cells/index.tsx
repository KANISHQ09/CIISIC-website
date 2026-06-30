'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Tag, HelpCircle, Code } from 'lucide-react';
import useToast from '@/hooks/useToast';
import { CellManagementService } from '@/services/cellManagementService';
import { InstitutionService } from '@/services/institutionService';
import { ExcellenceCell } from '@/types/institutionPortal';

export default function ExcellenceCellsManager() {
  const { showToast } = useToast();
  const [cells, setCells] = useState<ExcellenceCell[]>([]);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [theme, setTheme] = useState('');
  const [hostInstitutionId, setHostInstitutionId] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchCellsAndInstitutions = async () => {
    setIsLoading(true);
    try {
      const cellData = await CellManagementService.getCells();
      setCells(cellData);
      const instData = await InstitutionService.getInstitutions();
      setInstitutions(instData);
      if (instData.length > 0) {
        setHostInstitutionId(instData[0]._id);
      }
    } catch {
      showToast('Failed to load excellence cells data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCellsAndInstitutions();
  }, []);

  const handleCreateCell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim() || !theme.trim() || !hostInstitutionId) return;

    try {
      await CellManagementService.createCell({
        name: name.trim(),
        theme: theme.trim(),
        description: `${name.trim()} focusing on ${domain.trim()}`,
        hostInstitutionId,
        researchDomain: domain.trim()
      });

      setName('');
      setDomain('');
      setTheme('');
      setShowForm(false);
      showToast('Excellence Cell created successfully!', 'success');
      await fetchCellsAndInstitutions();
    } catch {
      showToast('Failed to create Excellence Cell.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Excellence Cells Registry</h1>
          <p className="text-sm text-zinc-500 font-medium">
            Verify university research domains, assign regional cell coordinators, and track active solver participation
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 self-start sm:self-center focus:outline-none"
        >
          <Plus className="w-4 h-4" /> Create Excellence Cell
        </button>
      </div>

      {/* Slide down creation form */}
      {showForm && (
        <form
          onSubmit={handleCreateCell}
          className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left max-w-xl animate-in slide-in-from-top-4 duration-300"
        >
          <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" /> New Cell Parameters
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Cell Name</label>
            <input
              type="text"
              placeholder="e.g. Chemical Systems Design Cell"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Theme / Focus</label>
              <input
                type="text"
                placeholder="Embedded Systems"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Research Domain</label>
              <input
                type="text"
                placeholder="e.g. Agritech"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700">Host Institution</label>
            <select
              value={hostInstitutionId}
              onChange={(e) => setHostInstitutionId(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 bg-zinc-50/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-semibold text-zinc-800"
              required
            >
              {institutions.map((inst) => (
                <option key={inst._id} value={inst._id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="py-2.5 px-6 bg-zinc-950 hover:bg-zinc-855 text-white rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none"
          >
            Create Excellence Cell
          </button>
        </form>
      )}

      {/* Grid List */}
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cells.map((cell) => (
            <div
              key={cell.id}
              className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[200px] text-left"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider block">{cell.domainFocus}</span>
                  <h4 className="text-sm font-black text-zinc-900 leading-tight">{cell.cellName}</h4>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-550/10 mt-4 flex items-center justify-between text-xs text-zinc-600 font-semibold">
                <span>
                  Coord: <span className="text-zinc-900 font-bold">{cell.coordinatorName}</span>
                </span>
                <span className="px-2 py-0.5 bg-zinc-50 border border-zinc-100 rounded text-[9px] font-black uppercase text-zinc-650">
                  {cell.studentCount} Solvers
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
