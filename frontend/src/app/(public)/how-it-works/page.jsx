'use client';

import React from 'react';
import { timeline } from '@/content/timeline';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16 text-left">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-widest text-blue-900 font-extrabold">Ecosystem Flow</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">How It Works</h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-medium">
            CIISIC coordinates verified industrial blocker challenges with collegiate talent through structured vetting steps.
          </p>
        </div>

        <div className="relative border-l-2 border-zinc-200 pl-6 ml-4 space-y-12">
          {timeline.map((step) => (
            <div key={step.step} className="relative space-y-3">
              {/* Dot bullet marker */}
              <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full bg-blue-900 border-4 border-white shadow-sm" />

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold uppercase tracking-wider text-blue-900 border border-blue-200">
                  {step.badge}
                </span>
                <span className="text-xs font-bold text-neutral-400">Step {step.step}</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">{step.title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-medium max-w-xl">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-8 bg-white border border-zinc-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <h4 className="text-base font-bold text-[#0F172A]">Ready to participate in the timeline?</h4>
            <p className="text-xs text-neutral-500 font-medium">Join as a student candidate or corporate partner.</p>
          </div>
          <Link href="/auth/register">
            <button className="px-6 py-3 bg-[#0F294A] hover:bg-[#1A3A63] text-white font-semibold text-xs rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer border-none">
              <Sparkles className="w-4 h-4 text-white/95" />
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
