import React from 'react';
import { cells } from '@/content/cells';
import { notFound } from 'next/navigation';
import { BrainCircuit, GraduationCap, Users, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function CellDetailPage(props) {
  const params = await props.params;
  const themeParam = params.theme?.toLowerCase();

  const cell = Object.values(cells).find((c) => c.theme.toLowerCase() === themeParam);

  if (!cell) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12 text-left">
        {/* Cell Header */}
        <div className="space-y-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: cell.primaryColor }}>
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-extrabold">Hosted by {cell.hostName}</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">{cell.name}</h1>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-medium">{cell.tagline}</p>
          </div>
        </div>

        {/* Focus Areas Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-zinc-200 pt-8">
          <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase">Focus Areas</h4>
            <ul className="text-[11px] text-neutral-600 space-y-1 list-disc pl-4 font-semibold">
              {cell.focusAreas.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase">Research Lead</h4>
            <p className="text-xs text-neutral-800 font-bold">{cell.leadName}</p>
            <p className="text-[10px] text-neutral-500 font-medium">Head of Research and Academic Innovation Coordinator</p>
          </div>

          <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase">Verification Rate</h4>
            <p className="text-xs text-neutral-800 font-bold">100% Secure Nodes</p>
            <p className="text-[10px] text-neutral-500 font-medium">All student approaches are vetted and hashed under SPOC signatures.</p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-[#0F294A] text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h4 className="text-base font-bold">Join the {cell.theme} Cohort</h4>
            <p className="text-xs text-white/80 leading-relaxed max-w-md">
              Are you a student or faculty mentor from Madhya Pradesh working in {cell.theme}? Apply to get matched with corporate research
              problems.
            </p>
          </div>
          <Link href="/auth/register">
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-full shadow-md transition-all flex items-center gap-1 cursor-pointer border-none shrink-0">
              <span>Apply to Cell</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
