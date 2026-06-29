'use client';

import React, { useEffect, useState } from 'react';
import { ExcellenceCell } from '@/types/institutionPortal';
import { CellManagementService } from '@/services/cellManagementService';
import { CellCard } from '@/components/institution/CellCard';
import { Layers, Plus, BookOpen, UserCheck, ShieldAlert } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function ExcellenceCellsRegistry() {
  const { showToast } = useToast();
  const [cells, setCells] = useState<ExcellenceCell[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCells = async () => {
      setIsLoading(true);
      try {
        const data = await CellManagementService.getCells();
        setCells(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCells();
  }, []);

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="space-y-1 text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">Excellence Cells</h1>
          <p className="text-sm text-zinc-500 font-medium">Coordinate innovation focus cells and manage assigned research domains</p>
        </div>
        <button
          onClick={() => showToast('Cell allocation is managed by Admin board.', 'info')}
          className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Request New Cell
        </button>
      </div>

      {/* Cells Grid */}
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cells.map((cell) => (
            <CellCard key={cell.id} cell={cell} />
          ))}
        </div>
      )}
    </div>
  );
}
