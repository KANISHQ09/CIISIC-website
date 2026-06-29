'use client';

import React from 'react';
import { cells } from '@/content/cells';
import { BrainCircuit, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import dynamic from 'next/dynamic';
import useAuth from '@/hooks/useAuth';

const ExcellenceCellsRegistry = dynamic(() => import('@/views/institution/cells'));

export default function CellsPage() {
  const { role } = useAuth();

  if (role === 'INSTITUTION_SPOC') {
    return <ExcellenceCellsRegistry />;
  }
  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-14 text-left">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold">Active Domains</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">Excellence Cells</h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-medium">
            Dedicated research units hosted across partner universities in Madhya Pradesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(cells).map((cell, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200 rounded-[32px] p-6 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[280px] text-left group"
            >
              <div className="space-y-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: cell.primaryColor }}
                >
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{cell.hostName}</span>
                  <h4 className="text-base font-bold text-[#0F172A] group-hover:text-blue-900 transition-colors">{cell.name}</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-medium">{cell.tagline}</p>
              </div>
              <div className="pt-6 border-t border-zinc-200/60 mt-4">
                <Link
                  href={`/cells/${cell.theme.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700"
                >
                  <span>Explore Cell details</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
