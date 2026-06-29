'use client';

import React from 'react';
import { Register } from '@/features/auth/Register';

export default function RegisterPage() {
  return (
    <div className="h-screen w-screen flex bg-white text-zinc-900 overflow-hidden font-sans select-none">
      {/* Styling for glowing animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animate-glow-1 { animation: float 14s ease-in-out infinite; }
        .animate-glow-2 { animation: float 18s ease-in-out infinite; }
      `}</style>

      {/* Left column: registration form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white min-h-screen overflow-y-auto">
        <div className="w-full max-w-sm my-auto py-8">
          <Register />
        </div>
      </section>

      {/* Right column: premium glowing cosmic gradient */}
      <section className="hidden md:flex w-1/2 min-h-screen relative overflow-hidden bg-slate-950 flex-col justify-between p-12 select-none">
        {/* Background glow meshes */}
        <div className="absolute top-[-10%] right-[-10%] w-[65%] h-[65%] rounded-full bg-violet-600/20 blur-[130px] animate-glow-1"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[65%] h-[65%] rounded-full bg-indigo-600/15 blur-[130px] animate-glow-2"></div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="text-white/60 text-xs font-bold uppercase tracking-widest">Confederation of Indian Industry</div>
          <div className="px-3.5 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] text-violet-300 font-bold tracking-wide">
            Enterprise Portal v2.0
          </div>
        </div>

        {/* Center content: Text and Metrics Board */}
        <div className="relative z-10 space-y-8 my-auto pl-6">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Empowering India's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300">
                Industrial Innovation
              </span>
            </h2>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed font-medium">
              CIISIC unites student innovators, academic coordinators, and industry experts on a secure grid to co-create solutions.
            </p>
          </div>

          {/* Metric Stats glassmorphic card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 max-w-xs">
            <div className="text-white font-bold text-xs uppercase tracking-wider text-left border-b border-white/5 pb-2">
              Platform Metrics
            </div>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-2xl font-extrabold text-white">4.2k+</div>
                <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Innovators</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">450+</div>
                <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Industries</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">180+</div>
                <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Excellence Cells</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-white">1.2k+</div>
                <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Proposals</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between text-neutral-500 text-xs">
          <div>© {new Date().getFullYear()} CIISIC Platform. All rights reserved.</div>
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
        </div>
      </section>
    </div>
  );
}
