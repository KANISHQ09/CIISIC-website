'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Globe, MapPin, Building, Landmark, Mail } from 'lucide-react';
import useToast from '@/hooks/useToast';

export default function InstitutionProfile() {
  const { showToast } = useToast();
  const [website, setWebsite] = useState('https://lnct.ac.in');
  const [location, setLocation] = useState('Kalchuri Nagar, Raisen Road, Bhopal, MP');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      showToast('University profile updated successfully!', 'success');
    }, 1000);
  };

  return (
    <div className="space-y-6 text-left pb-12 select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Title */}
      <div className="border-b border-zinc-100 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">University Profile</h1>
        <p className="text-sm text-zinc-500 font-medium">Coordinate institutional metadata details and view verified credentials</p>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Profile form details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm flex items-center gap-4 text-left">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-black text-xl shrink-0 border border-zinc-150">
              L
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-zinc-900 leading-none">Lakshmi Narain College of Technology</h2>
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
              </div>
              <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider block">University System Affiliate</span>
              <div className="flex items-center gap-4 text-xs text-zinc-500 font-bold pt-1">
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4 text-zinc-400" /> {website}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-zinc-400" /> Bhopal, MP
                </span>
              </div>
            </div>
          </div>

          {/* Details Form */}
          <form onSubmit={handleUpdate} className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
              <Landmark className="w-4.5 h-4.5 text-indigo-600" /> Academic Credentials
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">University Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-semibold text-zinc-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Campus Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white font-semibold text-zinc-800"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="py-2.5 px-6 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none disabled:opacity-40"
            >
              {isUpdating ? 'Saving details...' : 'Save Profile Details'}
            </button>
          </form>
        </div>

        {/* Right side stats count */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-150 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider border-b border-zinc-50 pb-3">
              Institution Stats
            </h3>
            <div className="space-y-3.5 text-xs text-zinc-600 font-semibold">
              <p>
                Total Departments: <span className="text-zinc-950 font-bold">12</span>
              </p>
              <p>
                Active Solvers: <span className="text-zinc-950 font-bold">1,210</span>
              </p>
              <p>
                Allocated Mentors: <span className="text-zinc-950 font-bold">42</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
