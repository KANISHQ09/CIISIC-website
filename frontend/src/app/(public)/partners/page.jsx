'use client';

import React from 'react';
import { partners } from '@/content/partners';
import { Building2, Globe, Sparkles } from 'lucide-react';

export default function PartnersPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12 text-left">
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold">Cooperating Industry</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">Corporate Partners</h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-medium">
            Discover the leading enterprise organizations hosting technical challenges and placement opportunities on CIISIC.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-zinc-200">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200 rounded-[32px] p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[200px] text-left group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-blue-900 transition-colors">{partner.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase mt-0.5">{partner.type}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center justify-between">
                <span className="text-[10px] text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full font-bold border border-green-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-green-600" />
                  <span>CII Member</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-bold flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Institutional SPOC</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
