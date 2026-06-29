'use client';

import React from 'react';
import { Building2, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12 text-left">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold">Ecosystem Overview</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">About CIISIC</h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-medium">
            The Collaborative Institutional Cooperation network for Industrial Innovation (CIISIC) is a state-wide program that bridges the
            gap between industrial challenges and university research talent in Madhya Pradesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-200">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-900">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Academic Integration</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              Over 40 universities and colleges across Madhya Pradesh host dedicated chapters, empowering student cohorts to work on actual
              corporate blockers as part of their curriculum.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">Domain Vetting & Security</h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium">
              Every challenge is validated by university deans (SPOCs) and routed through specialized Excellence Cells to ensure academic
              rigor and objective evaluation.
            </p>
          </div>
        </div>

        <div className="bg-[#0F294A] text-white p-8 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold">CII Roster Management</h3>
          <p className="text-xs text-white/80 leading-relaxed">
            As the administrator registry, the Confederation of Indian Industry (CII) audits partner company listings and ensures verified
            placement keys translate to genuine career and R&D opportunities.
          </p>
          <Link href="/auth/register">
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-full shadow-md transition-all cursor-pointer border-none mt-2">
              Onboard Ecosystem Chapter
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
