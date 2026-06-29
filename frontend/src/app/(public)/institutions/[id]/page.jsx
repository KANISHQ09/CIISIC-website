import React from 'react';
import { institutions } from '@/content/institutions';
import { notFound } from 'next/navigation';
import { Building2, ArrowRight, ShieldCheck, MapPin, GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';

export default async function InstitutionDetailPage(props) {
  const params = await props.params;
  const instId = params.id;

  const inst = institutions.find((item) => item.id === instId);

  if (!inst) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12 text-left">
        {/* Header */}
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <Building2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[9px] font-bold uppercase tracking-wider text-blue-900 border border-blue-200">
                Cooperating Registry Chapter
              </span>
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Code: {inst.code}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">{inst.name}</h1>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold pt-1">
              <MapPin className="w-4 h-4 text-zinc-400" />
              <span>{inst.district}, Madhya Pradesh</span>
            </div>
          </div>
        </div>

        {/* Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-zinc-200 pt-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-neutral-900">About Chapter node</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium">
                This college hosts active student innovation cohorts under the state-level CIISIC program. The local placement SPOC
                coordinates technical approaches directly with corporate R&D labs.
              </p>
            </div>

            <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase">Chapter Oversight Coordinator</h4>
              <p className="text-xs text-neutral-800 font-bold">Local Placement SPOC Faculty</p>
              <p className="text-[10px] text-neutral-500 font-medium">
                Liaisons local candidate submissions and signs verified placement credentials.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-blue-900">
                <GraduationCap className="w-5 h-5 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wide">Connected Excellence Cells</h4>
              </div>
              <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
                Students of this college have active access keys to submit proposals to the Agritech, Clean Energy, Smart Mobility, and IT
                cells.
              </p>
            </div>

            <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-blue-900">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wide">Verification Registry Status</h4>
              </div>
              <p className="text-[10px] text-blue-950 leading-relaxed font-medium">
                Active & Vetted chapter since program launch. Database record synchronization verified.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-[#0F294A] text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <h4 className="text-base font-bold">Affiliated student of this Institution?</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Login using your academic credentials or coordinate with your local SPOC to sync your enrollment verification key.
            </p>
          </div>
          <Link href="/auth/login">
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs rounded-full shadow-md transition-all flex items-center gap-1 cursor-pointer border-none shrink-0">
              <span>Sign In to Chapter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
