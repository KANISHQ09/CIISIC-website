'use client';

import React, { useState } from 'react';
import { institutions } from '@/content/institutions';
import { Building2, ArrowUpRight, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export default function InstitutionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInstitutions = institutions.filter(inst => 
    inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inst.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12 text-left">
        
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold">Cooperating Network</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Partner Institutions
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-medium">
            Over 40 academic universities and colleges coordinate verified challenges in Madhya Pradesh.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-y border-zinc-200 py-6">
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by college name or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-zinc-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
          <span className="text-xs font-bold text-neutral-400 font-mono">
            {filteredInstitutions.length} chapters found
          </span>
        </div>

        {/* List of institutions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((inst) => (
            <div 
              key={inst.id}
              className="bg-white border border-zinc-200 rounded-3xl p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[220px] text-left group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-neutral-400 font-bold uppercase">{inst.code}</span>
                    <h4 className="text-xs font-bold text-[#0F172A] line-clamp-2 leading-snug group-hover:text-blue-900 transition-colors">
                      {inst.name}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{inst.district}</span>
                </div>
                <Link href={`/institutions/${inst.id}`} className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-900 hover:text-blue-700">
                  <span>View chapter</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
