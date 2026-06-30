'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 select-none bg-gradient-to-tr from-zinc-50 via-white to-zinc-50/50">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-zinc-150 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Messaging */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-zinc-950 tracking-tight leading-tight">Access Restricted</h1>
          <p className="text-xs font-semibold text-zinc-500 max-w-xs mx-auto leading-relaxed">
            Your authenticated role does not possess the permissions necessary to access this administrative segment of the ecosystem.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 px-4 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white rounded-2xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none shadow-sm"
          >
            <Home className="w-4 h-4" /> Home Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
