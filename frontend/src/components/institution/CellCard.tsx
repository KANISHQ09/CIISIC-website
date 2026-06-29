import React from 'react';
import { ExcellenceCell } from '@/types/institutionPortal';
import { Layers, User, Calendar, BookOpen } from 'lucide-react';

interface CellCardProps {
  cell: ExcellenceCell;
}

export const CellCard: React.FC<CellCardProps> = ({ cell }) => {
  return (
    <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all text-left relative overflow-hidden">
      {/* Accent glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full" />

      <div className="space-y-4">
        {/* Title & coordinator */}
        <div className="flex justify-between items-start">
          <div className="leading-tight space-y-1">
            <h4 className="text-base font-extrabold text-zinc-900">{cell.cellName}</h4>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              <span>SPOC: {cell.coordinatorName}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Focus domain */}
        <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-2xl">
          <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest block">Domain Focus Focus Focus</span>
          <p className="text-xs text-zinc-700 font-bold mt-1 leading-normal">{cell.domainFocus}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 border-y border-zinc-100 py-3.5 text-center">
          <div className="space-y-0.5">
            <p className="text-sm font-black text-zinc-800">{cell.projectsCount}</p>
            <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider block">Projects</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-black text-zinc-800">{cell.studentCount}</p>
            <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider block">Solvers</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-black text-zinc-800">{cell.eventsCount}</p>
            <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-wider block">Events</span>
          </div>
        </div>

        {/* Focus research areas tags */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Research Focus Areas</span>
          <div className="flex flex-wrap gap-1">
            {cell.researchAreas.map((area) => (
              <span key={area} className="px-2 py-0.5 bg-zinc-100 rounded text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
