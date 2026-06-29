'use client';

import React from 'react';
import { resources } from '@/content/resources';
import { FileText, ArrowDownToLine, Globe, BookOpen } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12 text-left">
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold">Ecosystem Library</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">Program Resources</h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-medium">
            Download verified program documentation, guidelines, templates, and brochures.
          </p>
        </div>

        {/* Resources list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-zinc-200">
          {resources.map((res, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[180px] text-left group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-blue-900 transition-colors">{res.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase mt-0.5">{res.format}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center justify-between">
                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">Vetted Archive</span>
                <button
                  onClick={() => alert(`Downloading ${res.name}...`)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 bg-transparent border-none cursor-pointer p-0"
                >
                  <span>Download file</span>
                  <ArrowDownToLine className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
